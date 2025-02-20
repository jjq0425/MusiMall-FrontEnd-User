<template>
  <div class="order-detail-page">
    <div class="order-status">
      <OrderStatusTag :orderStatus="order.orderStatus" />
    </div>
    <div class="order-info">
      <h2>订单详情</h2>
      <a-divider />
      <a-descriptions column="2">
        <a-descriptions-item label="订单编号">{{
          order.id
        }}</a-descriptions-item>
        <a-descriptions-item label="下单时间">{{
          formatDate(order.orderTime)
        }}</a-descriptions-item>
        <a-descriptions-item label="订单状态">{{
          orderStatusText
        }}</a-descriptions-item>
        <a-descriptions-item label="支付状态">{{
          payStatusText
        }}</a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="address-info">
      <h2>地址信息</h2>
      <a-divider />
      <a-descriptions column="1">
        <a-descriptions-item label="收件人">{{
          address.receiverName
        }}</a-descriptions-item>
        <a-descriptions-item label="电话">{{
          address.receiverPhone
        }}</a-descriptions-item>
        <a-descriptions-item label="省市区"
          >{{ address.province }} / {{ address.city }} /
          {{ address.district }}</a-descriptions-item
        >
        <a-descriptions-item label="详细地址">{{
          address.detailAddress
        }}</a-descriptions-item>
        <a-descriptions-item label="邮编">{{
          address.postCode
        }}</a-descriptions-item>
      </a-descriptions>
    </div>
    <div class="trade-items">
      <h2>商品信息</h2>
      <a-divider />
      <a-list :data="order.tradeItemList">
        <template #item="{ item }">
          <a-list-item>
            <a-list-item-meta
              :title="item.productName"
              :description="`型号：${item.model}，单价：￥${item.price}，数量：${item.quantity}`"
            />
            <div class="trade-item-picture">
              <a-image
                :src="item.picture"
                :alt="item.productName"
                width="100px"
                height="100px"
              />
            </div>
          </a-list-item>
        </template>
      </a-list>
    </div>
    <div class="payment-info">
      <h2>支付信息</h2>
      <a-divider />
      <a-descriptions column="1">
        <a-descriptions-item label="总金额"
          >￥{{ order.totalAmount }}</a-descriptions-item
        >
        <a-descriptions-item label="支付金额"
          >￥{{ order.paymentAmount }}</a-descriptions-item
        >
      </a-descriptions>
    </div>
    <div class="remark-info">
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
import router from "@/router";

const route = useRoute();
const orderId = route.params.id;

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
  try {
    const orderRes = await getOrderDetailById(orderId);
    if (!orderRes.data || orderRes.data.length != 1) {
      Message.error("订单不存在");
      router.push({ name: "Order" });
      return;
    }
    Object.assign(order, orderRes.data[0]);
    const addressRes = await getAddressById(order.deliveryAddressId);
    Object.assign(address, addressRes);
  } catch (error) {
    Message.error("获取订单详情失败，请稍后再试");
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
  return order.payStatus === 1 ? "已支付" : "未支付";
});

onMounted(() => {
  fetchOrderDetails();
});
</script>

<style scoped>
.order-detail-page {
  padding: 20px;
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
</style>
