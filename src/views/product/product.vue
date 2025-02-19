<template>
  <div class="product">
    <h1>{{ product.name }}</h1>
    <p>{{ product.description }}</p>
    <p>价格: {{ product.price }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: {
        name: "示例商品",
        description: "这是一个示例商品的描述。",
        price: "100元",
      },
    };
  },
};
</script>

<style scoped>
.product {
  padding: 20px;
}
</style>
