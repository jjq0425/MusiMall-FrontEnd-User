<template>
  <div class="product-list">
    <a-row :gutter="16">
      <a-col v-for="product in productListInfo" :key="product.id" :span="6">
        <ProductCard
          :product="product"
          @showProductDetailModal="showProductDetailModalNow"
        />
      </a-col>
    </a-row>
    <ProductDetailModal ref="showProductDetailModalRef" />
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import ProductCard from "./ProductCard.vue";
import ProductDetailModal from "./ProductDetailModal.vue";

const props = defineProps({
  productListInfo: {
    type: Array,
    required: true,
  },
});

const showProductDetailModalRef = ref(null);
const showProductDetailModalNow = (productId) => {
  showProductDetailModalRef.value.showModal(productId);
};
</script>

<style scoped>
.product-list {
  padding: 40px;
}
</style>
