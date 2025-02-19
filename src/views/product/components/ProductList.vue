<template>
  <div class="product-list">
    <a-row :gutter="16">
      <a-col v-for="product in productListInfo" :key="product.id" :span="6">
        <ProductCard :product="product" />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import ProductCard from "./ProductCard.vue";

const props = defineProps({
  productListInfo: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.product-list {
  padding: 40px;
}
</style>
