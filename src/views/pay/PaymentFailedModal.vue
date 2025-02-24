<template>
  <a-modal
    v-model:visible="visible"
    title="提示"
    :footer="null"
    :closable="false"
    :mask-closable="false"
    :esc-to-close="false"
  >
    <a-result status="warning">
      <template #icon>
        <IconFaceFrownFill style="font-size: 48px; color: #faad14" />
      </template>
      <template #title>
        <a-typography-paragraph class="important-text">{{
          failObserveBy === "system"
            ? "系统校验未完成支付"
            : "很遗憾您未完成支付"
        }}</a-typography-paragraph>
      </template>
      <template #subtitle>
        <a-typography
          style="
            background: var(--color-fill-2);
            padding: 24px;
            text-align: left;
          "
        >
          <a-typography-paragraph>请您留意:</a-typography-paragraph>
          <ul>
            <li>
              可能由于网络波动同步有延时，若已经支付，请等待5分钟再刷新订单。若仍未支付，请联系人工客服。
            </li>
            <li>若在支付过程中有问题，可联系支付宝客服。</li>
          </ul>
        </a-typography>
      </template>

      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleClose">好的</a-button>
        </a-space>
      </template>
    </a-result>
  </a-modal>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from "vue";

const visible = ref(false);
const failObserveBy = ref("system"); // system, manual

const open = (failObserveBy_ = "system") => {
  visible.value = true;
  failObserveBy.value = failObserveBy_;
};

const handleClose = () => {
  visible.value = false;
  emit("paymentComplete");
};

const emit = defineEmits(["paymentComplete"]);
defineExpose({
  open,
});
</script>

<style scoped>
.modal-content {
  text-align: center;
  padding: 20px;
}

.important-text {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.button-container {
  margin-top: 20px;
}
</style>
