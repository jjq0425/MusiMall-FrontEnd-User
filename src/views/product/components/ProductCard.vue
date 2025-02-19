<template>
  <a-card hoverable class="product-card" @click="showProductDetailModal">
    <template #cover>
      <div style="border-radius: 12px">
        <img
          :style="{
            width: '240px',
            height: '135px',
            overflow: 'hidden',
          }"
          style="border-radius: 12px 12px 12px 0"
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
import { ref, defineEmits } from "vue";
import PriceAndStockShow from "@/views/product/components/PriceAndStockShow.vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const showProductDetailModal = () => {
  emit("showProductDetailModal", props.product.id);
};
const emit = defineEmits(["showProductDetailModal"]);
</script>

<style scoped>
.product-card {
  width: 240px;
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease-in-out;
}

.product-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
  scale: 1.02;
  border: 1px solid #15aabf;
}

.product-info {
  margin-top: 10px;
}
</style>
