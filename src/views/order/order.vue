<template>
  <div class="order-page">
    <h1>我的订单</h1>
    <a-list
      :data-source="orders"
      :loading="loading"
      bordered
      item-layout="vertical"
    >
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
import { ref, reactive, onMounted } from "vue";
import { getMyOrderList } from "@/api/trade";
import { Message } from "@arco-design/web-vue";

const orders = reactive([]);
const loading = ref(false);
// 分页相关
const currentPage = ref(1);
const pageSize = ref(5);
const totalCount = ref(0);

const handlePageChange = (page) => {
  currentPage.value = page;
  fetchOrders();
};

const fetchOrders = async () => {
  loading.value = true;
  try {
    const res = await getMyOrderList(currentPage.value, pageSize.value);
    orders.splice(0, orders.length, ...res.data);
    totalCount.value = res.totalCount;
  } catch (error) {
    Message.error("获取订单列表失败，请稍后再试");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.order-page {
  padding: 20px;
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
</style>