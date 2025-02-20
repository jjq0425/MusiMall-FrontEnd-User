<template>
  <div>
    <a-tag
      v-if="orderStatus == 1"
      color="blue"
      size="large"
      style="margin-right: 10px"
    >
      <template #icon>
        <a-badge status="processing" style="scale: 0.7; margin-right: 5px" />
      </template>
      待支付
    </a-tag>
    <a-tag
      v-if="orderStatus == 2"
      color="green"
      size="large"
      style="margin-right: 10px"
    >
      <template #icon>
        <a-badge status="success" style="scale: 0.7; margin-right: 5px" />
      </template>
      已支付
    </a-tag>
    <a-tag
      v-if="orderStatus == 4"
      color="green"
      size="large"
      style="margin-right: 10px"
    >
      <template #icon>
        <a-badge color="lime" style="scale: 0.7; margin-right: 5px" />
      </template>
      已完成
    </a-tag>
    <a-tag
      v-if="orderStatus == 5"
      color="gray"
      size="large"
      style="margin-right: 10px"
    >
      <template #icon>
        <a-badge status="normal" style="scale: 0.7; margin-right: 5px" />
      </template>
      交易取消
    </a-tag>
    <a-tag
      v-if="orderStatus == 6"
      color="orange"
      size="large"
      style="margin-right: 10px"
    >
      <template #icon>
        <a-badge status="warning" style="scale: 0.7; margin-right: 5px" />
      </template>
      退款退货
    </a-tag>
  </div>
</template>

<script setup>
const props = defineProps({
  orderStatus: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped>
/* Add any additional styles if needed */
::v-deep .arco-tag {
  border-radius: 120px;
  padding: 0px 15px 0 15px;
  font-weight: bold;
}
</style>
