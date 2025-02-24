<template>
  <a-modal
    v-model:visible="visible"
    title="支付成功"
    :footer="null"
    :closable="false"
    :mask-closable="false"
    :esc-to-close="false"
  >
    <a-result status="success">
      <template #icon>
        <IconCheckCircleFill style="font-size: 48px; color: #52c41a" />
      </template>
      <template #title>
        <a-typography-paragraph class="important-text"
          >支付成功</a-typography-paragraph
        >
      </template>
      <template #subtitle>
        <a-typography
          style="
            background: var(--color-fill-2);
            padding: 24px;
            text-align: left;
          "
        >
          <a-typography-paragraph
            >感谢您的支付，订单已成功处理。</a-typography-paragraph
          >
          <ul>
            <li>您可以在订单详情页面查看订单状态。</li>
            <li>若有任何问题，请联系客服。</li>
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

const open = () => {
  visible.value = true;
};

const handleClose = () => {
  visible.value = false;
  //   emit("paymentComplete");已经在handlePaymentComplete中调用
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
