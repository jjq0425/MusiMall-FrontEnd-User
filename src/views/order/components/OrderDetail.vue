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
      <a-descriptions column="2">
        <a-descriptions-item label="总金额"
          >￥{{ order.totalAmount.toFixed(2) }}</a-descriptions-item
        >
        <a-descriptions-item label="应付金额"
          >￥{{ order.paymentAmount.toFixed(2) }}</a-descriptions-item
        >
        <a-descriptions-item label="支付状态"
          >{{ payStatusText }}
        </a-descriptions-item>
        <a-descriptions-item label="支付方式" v-if="order.payType">
          {{ payTypeText }} &nbsp;&nbsp;&nbsp;
          <span v-if="order.alipayTraceNo">
            (流水号：{{ order.alipayTraceNo }})
          </span>
        </a-descriptions-item>
        <a-descriptions-item label="校验支付状态" v-else>
          <a-tooltip content="点击后系统立即校验支付状态。无需等待信息同步">
            <a-button
              type="primary"
              @click="checkOrderPayFinishNow()"
              size="small"
              shape="round"
              >点击校验</a-button
            >
          </a-tooltip>
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="remark-info card">
      <h2>备注信息</h2>
      <a-divider />
      <p>{{ order.remark || "无" }}</p>
    </div>
    <!-- 新增浮动区域 -->
    <div class="floating-buttons animate__animated animate__fadeInUp">
      <div class="button-container">
        <a-popconfirm
          content="确定取消订单吗？"
          @ok="cancelOrderNow"
          type="warning"
        >
          <a-button
            type="primary"
            status="danger"
            v-if="order.orderStatus === 1"
            >取消订单</a-button
          >
        </a-popconfirm>
        <a-button
          type="primary"
          @click="goToPay"
          v-if="order.orderStatus === 1"
        >
          去支付
        </a-button>
        <div
          style="margin: 5px 0; color: gray"
          v-if="
            order.orderStatus === 5 ||
            order.orderStatus === 6 ||
            order.orderStatus === 2
          "
        >
          感谢光临MusiMall，祝您购物愉快。
        </div>
      </div>
    </div>
    <!-- 使用新的支付选择模态框组件 -->
    <PayModal ref="payModalRef" @paymentComplete="fetchOrderDetails" />
    <PaymentSuccessModal ref="paymentSuccessModalRef" />
    <payment-failed-modal ref="paymentFailedModalRef" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { getOrderDetailById, cancelOrder } from "@/api/trade";
import { getAddressById } from "@/api/address";
import { Message } from "@arco-design/web-vue";
import dayjs from "dayjs";
import OrderStatusTag from "./OrderStatusTag.vue";
import OrderHeader from "./OrderHeader.vue";
import TradeList from "./TradeList.vue";
import router from "@/router";
import { useUserStore } from "@/store/user";
import PayModal from "../../pay/PayModal.vue";
import { checkOrderPayFinish } from "../../../api/trade";
import PaymentSuccessModal from "../../pay/PaymentSuccessModal.vue";
import PaymentFailedModal from "../../pay/PaymentFailedModal.vue";

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
  payType: null,
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

const payTypeText = computed(() => {
  switch (order.payType) {
    case 1:
      return "支付宝";
    case 2:
      return "金币";
    default:
      return "/";
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

// Btn

const cancelOrderNow = async () => {
  Message.loading({ content: "取消订单中...", id: "cancel-order" });
  try {
    await cancelOrder(order.id);
    fetchOrderDetails();
  } catch (error) {
    Message.error({
      content: "取消订单失败: " + error?.message,
      id: "cancel-order",
    });
  } finally {
  }
};

const payModalRef = ref(null);
const goToPay = () => {
  payModalRef.value.open(order.id, order.totalAmount);
};

const paymentSuccessModalRef = ref(null);
const paymentFailedModalRef = ref(null);
const checkOrderPayFinishNow = async () => {
  Message.loading({ content: "校验支付状态中...", id: "check-pay-status" });
  setTimeout(async () => {
    const res = await checkOrderPayFinish(order.id);
    if (res) {
      Message.success({ content: "支付状态：已支付", id: "check-pay-status" });
      paymentSuccessModalRef.value.open();
      fetchOrderDetails();
    } else {
      Message.warning({ content: "支付状态：未支付", id: "check-pay-status" });
      paymentFailedModalRef.value.open();
    }
  }, 1000);
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

.floating-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  padding-right: 80px;
  padding-left: 80px;
  display: flex;

  justify-content: flex-end;
  box-shadow: 1px 3px 32px 0 rgba(50, 73, 198, 0.08),
    6px -1px 28px 0 rgba(50, 73, 198, 0.12);
  box-sizing: border-box;
  border: 1px solid #e7e7e7;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
}

.button-container {
  display: flex;
  gap: 10px;
}

.pay-options {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}
</style>
