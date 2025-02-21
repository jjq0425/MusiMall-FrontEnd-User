<template>
  <div class="cart-container">
    <div style="display: flex; justify-content: space-between">
      <h2 style="margin-bottom: 20px">购物车</h2>
      <p>共 {{ totalCount }} 件商品</p>
    </div>
    <CartProductList @updateTotalCount="updateTotalCount" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import CartProductList from "./components/CartProductList.vue";

const totalCount = ref(0);

const updateTotalCount = (count) => {
  totalCount.value = count;
};
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