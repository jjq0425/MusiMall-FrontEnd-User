<template>
  <a-list :data="tradeItems" bordered>
    <template #item="{ item }">
      <a-list-item>
        <a-list-item-meta>
          <template #title>
            <div style="font-size: 16px; font-weight: bold">
              {{ item.productName }}
              <span style="font-size: 16px; color: red; font-weight: bold">
                ￥{{ (item.price * item.quantity).toFixed(2) }}
              </span>
            </div>
          </template>
          <template #description>
            <a-descriptions
              column="3"
              size="small"
              style="margin-top: 10px; width: 55vh"
            >
              <a-descriptions-item label="型号/描述" :span="3">{{
                item.model
              }}</a-descriptions-item>
              <a-descriptions-item label="单价"
                >￥{{ item.price.toFixed(2) }}</a-descriptions-item
              >
              <a-descriptions-item label="购买数量">{{
                item.quantity
              }}</a-descriptions-item>
            </a-descriptions>
          </template>
        </a-list-item-meta>
        <template #extra>
          <div class="trade-item-picture">
            <a-image
              :src="item.picture"
              :alt="item.productName"
              width="110px"
              height="110px"
            />
          </div>
        </template>
      </a-list-item>
    </template>
  </a-list>
</template>

<script setup>
const props = defineProps({
  tradeItems: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.trade-item-picture {
  margin-top: 10px;
}
</style>
