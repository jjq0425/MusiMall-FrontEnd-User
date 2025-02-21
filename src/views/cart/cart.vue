<template>
  <div class="cart-container">
    <div style="display: flex; justify-content: space-between">
      <h2 style="margin-bottom: 20px">购物车</h2>
      <p>共 {{ totalCount }} 件商品</p>
    </div>
    <a-empty v-if="cartData.length === 0 && !fetchCartDataLoading">
      购物车空空如也
    </a-empty>
    <a-empty v-else-if="fetchCartDataLoading && cartData.length == 0">
      <template #image>
        <icon-loading style="font-size: 68px; color: #165dff" />
      </template>
      <div style="margin-top: 25px; font-size: 20px">加载中，请稍后...</div>
    </a-empty>
    <a-list
      v-show="cartData.length > 0"
      :data="cartData"
      :max-height="500"
      @reach-bottom="fetchCartData"
      :scrollbar="true"
      style="overflow-y: always"
    >
      <template #scroll-loading>
        <div
          v-if="hasReachedBottom && !fetchCartDataLoading"
          @click="fetchCartData"
          style="cursor: pointer; color: grey"
        >
          —— 我是有底线的 ——
        </div>
        <a-spin v-else />
      </template>
      <template #item="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>
              <div style="font-size: 16px; font-weight: bold">
                {{ item.productName }}
                <span style="font-size: 16px; color: red; font-weight: bold">
                  ￥{{ (item.price * item.quantity).toFixed(2) }}
                </span>
              </div>
            </template>
            <template #description>
              <a-descriptions
                column="3"
                size="small"
                style="margin-top: 10px; width: 55vh"
              >
                <a-descriptions-item label="型号/描述" :span="3">{{
                  item.model
                }}</a-descriptions-item>
                <a-descriptions-item label="单价"
                  >￥{{ item.price.toFixed(2) }}</a-descriptions-item
                >
                <a-descriptions-item label="购买数量">
                  <a-input-number
                    v-model="item.quantity"
                    :min="1"
                    @change="updateQuantity(item)"
                  />
                </a-descriptions-item>
              </a-descriptions>
            </template>
          </a-list-item-meta>
          <template #extra>
            <div class="trade-item-picture">
              <a-image
                :src="item.cover"
                :alt="item.productName"
                width="110px"
                height="110px"
              />
            </div>
            <a-button
              type="danger"
              @click="removeItem(item.id)"
              style="margin-top: 10px"
            >
              删除
            </a-button>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import {
  getCartList,
  removeCartItem,
  //   updateCartItemQuantity,
} from "@/api/cart";
import { Message } from "@arco-design/web-vue";

const cartData = reactive([]);
const currentPage = ref(1);
const pageSize = 10;
const totalCount = ref(0);
const hasReachedBottom = ref(false);
const fetchCartDataLoading = ref(false);

const fetchCartData = async () => {
  fetchCartDataLoading.value = true;
  Message.loading({ content: "加载中...", id: "cart-data" });
  const response = await getCartList(currentPage.value, pageSize).finally(
    () => {
      fetchCartDataLoading.value = false;
    }
  );
  if (!hasReachedBottom.value) {
    cartData.push(...response.data);
  } else {
    // 根据currentPage和pageSize替换最后一页的数据，保留前面几页的数据
    cartData.splice(
      (currentPage.value - 1) * pageSize,
      pageSize,
      ...response.data
    );
  }
  Message.success({ content: "加载成功", id: "cart-data" });
  fetchCartDataLoading.value = false;
  if (cartData.length >= response.totalCount) {
    hasReachedBottom.value = true;
  } else {
    hasReachedBottom.value = false;
    currentPage.value++;
  }
  totalCount.value = response.totalCount;
};

const removeItem = async (id) => {
  Message.loading({ content: "删除中...", id: "cart-data" });
  const res = await removeCartItem(id);
  if (res.code === 200) {
    Message.success({
      content: res.message == null ? "删除成功" : res.message,
      id: "cart-data",
    });
    const index = cartData.findIndex((item) => item.id === id);
    if (index !== -1) {
      cartData.splice(index, 1);
      totalCount.value--;
    }
  } else {
    Message.error({
      content: res.message == null ? "删除失败" : res.message,
      id: "cart-data",
    });
  }
};

const updateQuantity = async (item) => {
  //   await updateCartItemQuantity(item.id, item.quantity);
  Message.success("数量已更新");
};

onMounted(() => {
  fetchCartData();
});
</script>

<style>
.cart-container {
  margin: 30px;
  padding: 50px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(176, 191, 231, 0.15);
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.item-image {
  width: 50px;
  height: 50px;
  margin-right: 20px;
}

.item-details {
  flex: 1;
}
</style>