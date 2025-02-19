<template>
  <div>
    <!-- 商品搜索 -->
    <div class="search">
      <div class="title">
        <h1 style="margin: 0 auto; text-align: center; font-size: 30px">
          优选好物
        </h1>
      </div>
      <div class="search-Btn-Div">
        <a-input-search
          class="search-Btn"
          v-model="searchValue"
          placeholder="输入商品关键词"
          search-button
        >
          <template #button-icon>
            <icon-search />
          </template>
          <template #button-default> 搜好物 </template>
        </a-input-search>
      </div>
    </div>
    <!-- 商品列表 -->
    <div class="product-list-div">
      <a-spin :loading="productListloading" tip="加载中...">
        <ProductList :product-list-info="productListInfo" />
      </a-spin>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import ProductList from "@/views/product/components/ProductList.vue";

const searchValue = ref("");
const productListloading = ref(false);
const productListInfo = reactive([
  {
    id: 1833339862330556415,
    name: "华为笔记本 华为",
    description: "高:100 长:101 宽:201",
    picture: "http://117.72.88.11:9002/mall-dev/WX20240815-213011.png",
    price: 3998.0,
    quantity: 3000,
    remainQuantity: 0,
    categories: [],
  },
  // ...更多商品
]);

console.log("productListInfo", productListInfo);
</script>

<style scoped>
.search {
  width: 100vh;
  margin: 10px auto;
}

.title {
  margin: 0 auto;
  margin-bottom: 20px;
  font-weight: bold;
}

.search-Btn {
  width: 500px;
  /* 阴影 */
  box-shadow: 0 5px 15px 0 rgba(176, 191, 231, 0.55);
  transition: all 0.4s ease-in-out;
}

.search-Btn:hover {
  width: 800px;
}

::v-deep .search-Btn:focus-within {
  width: 800px;
}
.search-Btn-Div {
  display: flex;
  justify-content: center;
  scale: 1.2;
}

::v-deep .arco-input-wrapper {
  border: 1px solid #165dff !important;
  background-color: white !important;
}

::v-deep .arco-input-wrapper .arco-input:focus {
  background-color: white !important;
}

.product-list-div {
  margin: 10px auto;
  margin-top: 40px;
  width: 93%;
  min-height: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(176, 191, 231, 0.15);
}
</style>