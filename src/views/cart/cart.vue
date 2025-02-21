<template>
  <div class="cart-container">
    <div style="display: flex; justify-content: space-between">
      <h2 style="margin-bottom: 20px">购物车</h2>
      <p>共 {{ totalCount }} 件商品</p>
    </div>
    <CartProductList
      @updateTotalCount="updateTotalCount"
      @updateSelectProductId="updateSelectProductId"
      @updateChangeItemLoading="updateChangeItemLoading"
      ref="cartProductListRef"
    />
    <div style="min-height: 40px"></div>
    <div class="floating-footer">
      <p>已选择 {{ selectProductId.length }} 件商品</p>
      <div style="display: flex">
        <div
          class="floating-footer-btn btn-remove"
          v-if="selectProductId.length > 0"
          @click="handleRemove"
        >
          移除选中商品
        </div>
        <div
          class="floating-footer-btn btn-orderPart"
          v-if="selectProductId.length > 0"
          @click="createSelectOrder"
        >
          结算选中商品
        </div>
        <div class="floating-footer-btn btn-orderAll" @click="createOrderAll">
          结算全部购物车
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import CartProductList from "./components/CartProductList.vue";

const totalCount = ref(0);
const selectProductId = reactive([]);
const changeItemLoading = ref(false);

const updateTotalCount = (count) => {
  totalCount.value = count;
};

const updateChangeItemLoading = (loading) => {
  changeItemLoading.value = loading;
};

const updateSelectProductId = (arr) => {
  selectProductId.splice(0, selectProductId.length, ...arr);
};

const cartProductListRef = ref(null);
const handleRemove = () => {
  if (changeItemLoading.value) return;
  cartProductListRef.value.removeSelectCartItem();
};

const createSelectOrder = () => {
  if (changeItemLoading.value) return;
  cartProductListRef.value.createSelectOrder();
};

const createOrderAll = () => {
  if (changeItemLoading.value) return;
  cartProductListRef.value.createOrderAll();
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

.floating-footer {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 999px;
  box-shadow: 0 3.87234px 7.74468px -7.74468px rgba(31, 35, 41, 0.12),
    0 5.80851px 11.617px rgba(31, 35, 41, 0.08),
    0 7.74468px 23.234px 7.74468px rgba(31, 35, 41, 0.08);

  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  z-index: 99;
  padding-left: 50px;
  padding-right: 50px;
  min-height: 60px;
}

.floating-footer-btn {
  color: white;
  cursor: pointer;
  min-height: 60px;
  padding: 20px;
  font-weight: bold;
  font-size: 15px;
  transition: all 0.3s ease-in-out;
}

.floating-footer-btn:hover {
  transform: scale(1.05);
}

.btn-remove {
  background: #adb5bd;
}

.btn-orderPart {
  background: linear-gradient(135deg, #f6d365, #fda085);
}

.btn-orderAll {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}
</style>