<template>
  <div class="price-stock">
    <div class="price" v-if="!isStockOut">
      <!-- <img
        src="@/assets/coin/coin.png"
        alt="coin"
        style="width: 22px; height: 22px; margin-right: 1px"
      /> -->￥
      {{ price }}
    </div>
    <div class="price" v-if="isStockOut" style="color: grey">已售罄</div>
    <div class="stock">
      <span style="color: #f76707" v-if="isStockApprochOut"
        >库存告急，仅剩{{ remainQuantity }}件</span
      >
      <span v-else-if="isNewStock">新品上架，欢迎选购</span>
      <span v-else-if="isStockOut">商品已售罄，关注其他商品吧</span>
      <span v-else
        >已售：{{ totalQuantity - remainQuantity }} 库存:
        {{ remainQuantity }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";
const props = defineProps({
  price: {
    type: Number,
    required: true,
  },
  remainQuantity: {
    type: Number,
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
  },
});

const price = computed(() => {
  return props.price.toFixed(2);
});

const isStockOut = computed(() => {
  return props.remainQuantity <= 0;
});

const isStockApprochOut = computed(() => {
  return props.remainQuantity <= 100 && props.remainQuantity > 0;
});

const isNewStock = computed(() => {
  return props.totalQuantity - props.remainQuantity <= 100;
});
</script>

<style scoped>
.price-stock {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.price {
  font-size: 24px;
  color: red;
  font-weight: bold;
}

.stock {
  font-size: 12px;
  color: gray;
  margin-top: 5px;
}
</style>