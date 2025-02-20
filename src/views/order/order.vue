<template>
  <div class="order-page">
    <h1>我的订单</h1>
    <a-radio-group
      v-model="orderStatusTypeChoose"
      type="button"
      style="margin-bottom: 20px"
      @change="orderStatusTypeChooseChange"
    >
      <a-radio :value="0">全部</a-radio>
      <a-radio :value="1">待支付</a-radio>
      <a-radio :value="2">已支付</a-radio>
      <!-- <a-radio value="3">已发货</a-radio> -->
      <a-radio :value="4">已完成</a-radio>
      <a-radio :value="5">交易取消</a-radio>
      <a-radio :value="6">退款退货</a-radio>
    </a-radio-group>
    <a-list :data="orders" :loading="loading" bordered item-layout="vertical">
      <template #item="{ item }">
        <a-list-item class="list-demo-item" action-layout="vertical">
          <template #actions>
            <div class="list-item-footer">
              <OrderStatusTag :orderStatus="item.orderStatus" />
              <a-button
                type="text"
                size="small"
                @click="viewOrderDetail(item.id)"
              >
                {{ item.orderStatus == 1 ? "去支付" : "查看订单" }}
              </a-button>
            </div>
          </template>
          <template #extra>
            <a-avatar-group :size="124">
              <a-avatar
                v-for="tradeItem in item.tradeItemList.slice(0, 3)"
                :key="tradeItem.productId"
                :image-url="tradeItem.picture"
                class="trade-item-picture"
              />
              <a-avatar
                v-if="item.tradeItemList.length > 3"
                class="trade-item-picture"
                >+{{ item.tradeItemList.length - 3 }}</a-avatar
              >
            </a-avatar-group>
          </template>
          <a-list-item-meta>
            <template #title>
              <div style="font-size: 16px; font-weight: bold">
                {{ itemTileSimple(item) }}
                <span style="font-size: 16px; color: red; font-weight: bold">
                  ￥ {{ item.paymentAmount }}</span
                >
              </div>
            </template>
            <template #description>
              <div class="order-details">
                <div>订单编号：{{ item.code }}</div>
                <!-- <div>应付金额：{{ item.paymentAmount }}</div> -->
                <div>下单时间：{{ formatDate(item.orderTime) }}</div>
              </div>
            </template>
            <template #avatar> </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
    <a-pagination
      style="margin-top: 10px"
      :current="currentPage"
      :page-size="pageSize"
      :total="totalCount"
      :show-total="true"
      @change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getMyOrderList } from "@/api/trade";
import { Message } from "@arco-design/web-vue";
import dayjs from "dayjs";
import OrderStatusTag from "./components/OrderStatusTag.vue";

const orders = reactive([]);
const loading = ref(false);
// 分页相关
const currentPage = ref(1);
const pageSize = ref(5);
const totalCount = ref(0);
const orderStatusTypeChoose = ref(0);

const router = useRouter();

const handlePageChange = (page) => {
  currentPage.value = page;
  fetchOrders();
};

const itemTileSimple = (item) => {
  // 只选取前2个商品名称
  if (item.tradeItemList.length > 2) {
    return (
      item.tradeItemList
        .slice(0, 2)
        .map((tradeItem) => tradeItem.productName)
        .join(", ") +
      " 等" +
      item.tradeItemList.length +
      "件商品"
    );
  } else {
    return (
      item.tradeItemList.map((tradeItem) => tradeItem.productName).join(", ") +
      " 共" +
      item.tradeItemList.length +
      "件商品"
    );
  }
};

const fetchOrders = async () => {
  loading.value = true;
  try {
    const res = await getMyOrderList(
      currentPage.value,
      pageSize.value,
      orderStatusTypeChoose.value == 0 ? null : orderStatusTypeChoose.value
    );
    orders.splice(0, orders.length, ...res.data);
    totalCount.value = res.totalCount;
  } catch (error) {
    Message.error("获取订单列表失败，请稍后再试");
  } finally {
    loading.value = false;
  }
};

const orderStatusTypeChooseChange = (value) => {
  orderStatusTypeChoose.value = value;
  currentPage.value = 1;
  fetchOrders();
};

const formatDate = (timestamp) => {
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
};

const viewOrderDetail = (orderId) => {
  router.push({ name: "Order-Detail", params: { id: orderId } });
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.order-page {
  margin: 30px;
  padding: 50px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(176, 191, 231, 0.15);
}

.order-details {
  margin-top: 20px;
}

.trade-items {
  margin-top: 20px;
}

.trade-item-picture {
  margin-top: 10px;
}

.list-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
</style>