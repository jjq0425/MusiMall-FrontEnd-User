<template>
  <div class="order-detail-page">
    <OrderHeader class="card" :orderStatus="order.orderStatus" />
    <a-alert v-if="order.orderStatus === 1">
      请在下单后的15分钟内完成支付，否则订单将自动取消。距离自动取消还有<a-countdown
        format="mm:ss.SSS"
        :value="orderTimeDate()"
        :value-style="{
          color: 'red',
          fontSize: '18px',
          fontWeight: 'bold',
          marginLeft: '5px',
        }"
        @finish="refreshOrderDetails"
      />
    </a-alert>
    <div class="order-info card">
      <h2>订单信息</h2>
      <a-divider />
      <a-descriptions column="2">
        <a-descriptions-item label="订单编号">{{
          order.id
        }}</a-descriptions-item>
        <a-descriptions-item label="下单时间">{{
          formatDate(order.orderTime)
        }}</a-descriptions-item>
        <a-descriptions-item label="订单状态">
          <OrderStatusTag :orderStatus="order.orderStatus" />
        </a-descriptions-item>
        <a-descriptions-item label="下单用户">{{
          userStore.username
        }}</a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="address-info card">
      <h2>地址信息</h2>
      <a-divider />
      <a-descriptions :column="3">
        <a-descriptions-item label="收件人" :span="1">{{
          address.receiverName
        }}</a-descriptions-item>
        <a-descriptions-item label="电话" :span="1">{{
          address.receiverPhone
        }}</a-descriptions-item>
        <a-descriptions-item label="邮编" :span="1">{{
          address.postCode
        }}</a-descriptions-item>
        <a-descriptions-item label="省市区" :span="1"
          >{{ address.province }} / {{ address.city }} /
          {{ address.district }}</a-descriptions-item
        >
        <a-descriptions-item label="详细地址" :span="1">{{
          address.detailAddress
        }}</a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="trade-items card">
      <h2>商品信息</h2>
      <a-divider />
      <a-alert type="normal">
        仅代表下单时数据，与当前最新商品信息可能有差异或不同。
        <template #icon>
          <icon-exclamation-circle-fill />
        </template>
      </a-alert>
      <TradeList :tradeItems="order.tradeItemList" />
    </div>
    <div class="payment-info card">
      <h2>支付信息</h2>
      <a-divider />
      <a-descriptions column="3">
        <a-descriptions-item label="支付状态">{{
          payStatusText
        }}</a-descriptions-item>
        <a-descriptions-item label="总金额"
          >￥{{ order.totalAmount.toFixed(2) }}</a-descriptions-item
        >
        <a-descriptions-item label="应付金额"
          >￥{{ order.paymentAmount.toFixed(2) }}</a-descriptions-item
        >
      </a-descriptions>
    </div>
    <div class="remark-info card">
      <h2>备注信息</h2>
      <a-divider />
      <p>{{ order.remark || "无" }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { getOrderDetailById } from "@/api/trade";
import { getAddressById } from "@/api/address";
import { Message } from "@arco-design/web-vue";
import dayjs from "dayjs";
import OrderStatusTag from "./OrderStatusTag.vue";
import OrderHeader from "./OrderHeader.vue";
import TradeList from "./TradeList.vue";
import router from "@/router";
import { useUserStore } from "@/store/user";

const route = useRoute();
const orderId = route.params.id;
const userStore = useUserStore();

const order = reactive({
  code: "",
  orderTime: "",
  orderStatus: 0,
  payStatus: 0,
  totalAmount: 0,
  paymentAmount: 0,
  remark: "",
  tradeItemList: [
    {
      productName: "",
      model: "",
      price: 0,
      quantity: 0,
      picture: "",
    },
  ],
});

const address = reactive({
  receiverName: "",
  receiverPhone: "",
  province: "",
  city: "",
  district: "",
  detailAddress: "",
  postCode: "",
});

const fetchOrderDetails = async () => {
  // 设置滚动条位置
  window.scrollTo(0, 0);
  // 加载中
  Message.loading({ content: "加载中...", id: "order-detail" });
  try {
    const orderRes = await getOrderDetailById(orderId);
    if (!orderRes.data || orderRes.data.length != 1) {
      Message.error({ content: "订单不存在", id: "order-detail" });
      router.push({ name: "Order" });
      return;
    }
    Message.success({ content: "获取订单详情成功", id: "order-detail" });
    Object.assign(order, orderRes.data[0]);
    const addressRes = await getAddressById(order.deliveryAddressId);
    Object.assign(address, addressRes);
  } catch (error) {
    Message.error({ content: "获取订单详情失败", id: "order-detail" });
  } finally {
  }
};

const formatDate = (timestamp) => {
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
};

const orderStatusText = computed(() => {
  switch (order.orderStatus) {
    case 1:
      return "待支付";
    case 2:
      return "已支付";
    case 4:
      return "已完成";
    case 5:
      return "交易取消";
    case 6:
      return "退款退货";
    default:
      return "未知状态";
  }
});

const payStatusText = computed(() => {
  switch (order.payStatus) {
    case 1:
      return "未支付";
    case 2:
      return "已支付";
    case 3:
      return "已退款";
    case 4:
      return "失败";
    default:
      return "未知状态";
  }
});

const orderTimeDate = () => {
  // 将order.orderTime转为Date
  // return Date.now() + 0.1 * 60 * 1000;
  return order.orderTime + 15 * 60 * 1000;
};

const refreshOrderDetails = () => {
  Message.info({ content: "超时未支付，订单即将取消...", duration: 4000 });
  setTimeout(() => {
    fetchOrderDetails();
  }, 3500);
};

onMounted(() => {
  fetchOrderDetails();
});
</script>

<style scoped>
.order-detail-page {
  margin: 50px;
  margin-top: 10px;
  padding: 50px;
  padding-top: 0px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(176, 191, 231, 0.15);
}

.order-status {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
}

a-divider {
  margin: 10px 0;
}

.trade-item-picture {
  margin-top: 10px;
}

.card {
  margin-top: 40px;
}
</style>
