<template>
  <div>
    <!-- 商品搜索 -->
    <div class="search">
      <div class="title">
        <h1 style="margin: 0 auto; text-align: center; font-size: 45px">
          优选好物
        </h1>
      </div>
      <div class="search-Btn-Div">
        <a-input-search
          class="search-Btn"
          v-model="searchValue"
          placeholder="输入商品关键词"
          search-button
          @search="searchOrGetNow"
          :loading="productListloading"
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
      <a-empty
        v-if="productListInfo.length === 0 && !productListloading"
        style="padding-top: 80px"
      >
        没有搜索到商品
      </a-empty>
      <a-empty v-else-if="productListloading" style="padding-top: 80px">
        <template #image>
          <icon-loading style="font-size: 68px; color: #165dff" />
        </template>
        <div style="margin-top: 25px; font-size: 20px">加载中，请稍后...</div>
      </a-empty>
      <ProductList :product-list-info="productListInfo" />
      <div style="height: 50px"></div>
      <div class="pagination-div" v-if="productListInfo.length > 0">
        <a-pagination
          :total="totalCount"
          :current="currentPage"
          :page-size="pageSize"
          @change="handlePageChange"
          @page-size-change="handlePageSizeChange"
          :page-size-options="[8, 16, 32, 64]"
          show-total
          show-jumper
          show-page-size
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import ProductList from "@/views/product/components/ProductList.vue";
import { getProductList, searchProduct } from "@/api/product";
import { Message } from "@arco-design/web-vue";

const searchValue = ref("");
const productListloading = ref(false);
const productListInfo = reactive([]);

// 分页
const currentPage = ref(1);
const pageSize = ref(8);
const totalCount = ref(0);

onMounted(() => {
  searchValue.value = "";
  getProductListInfo();
});
const searchOrGetNow = () => {
  if (searchValue.value && searchValue.value.trim() != "") {
    searchProductInfo();
  } else {
    getProductListInfo();
  }
};

const getProductListInfo = async () => {
  productListloading.value = true;
  const res = await getProductList(currentPage.value, pageSize.value);
  productListInfo.splice(0, productListInfo.length, ...res.data);
  totalCount.value = res.totalCount;
  productListloading.value = false;
};
const searchProductInfo = async () => {
  productListloading.value = true;
  currentPage.value = 1;
  const res = await searchProduct(
    searchValue.value,
    currentPage.value,
    pageSize.value
  ).catch((err) => {
    Message.error("搜索失败,请稍后再试:" + err);
    productListloading.value = false;
  });
  productListInfo.splice(0, productListInfo.length, ...res.data);
  totalCount.value = res.totalCount;
  productListloading.value = false;
};

const handlePageChange = (page) => {
  currentPage.value = page;
  if (searchValue.value) {
    searchProductInfo();
  } else {
    getProductListInfo();
  }
};

const handlePageSizeChange = (pageSize_) => {
  currentPage.value = 1;
  pageSize.value = pageSize_;
  if (searchValue.value) {
    searchProductInfo();
  } else {
    getProductListInfo();
  }
};
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
  position: relative;
}

.pagination {
  margin: 20px auto;
  min-width: 100%;
  background: red;
}

.pagination-div {
  position: absolute;
  bottom: 36px;
  right: 36px;
}
</style>