<template>
  <a-card hoverable class="product-card">
    <template #cover>
      <div>
        <img
          :style="{
            width: '240px',
            height: '135px',
            overflow: 'hidden',
          }"
          :src="product.picture"
          :alt="product.name"
        />
      </div>
    </template>
    <a-card-meta :title="product.name" :description="product.description">
      <template #avatar>
        <!-- 金额显示 -->
        <price-and-stock-show
          style="transform: translateX(-5px)"
          :price="product.price"
          :totalQuantity="product.quantity"
          :remainQuantity="product.remainQuantity"
        />
      </template>
    </a-card-meta>
  </a-card>
</template>

<script setup>
import { ref } from "vue";
import PriceAndStockShow from "@/views/product/components/priceAndStockShow.vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});
console.log("product", props.product);
</script>

<style scoped>
.product-card {
  width: 240px;
}

.product-info {
  margin-top: 10px;
}
</style>
