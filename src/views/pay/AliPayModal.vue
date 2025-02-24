<template>
  <a-modal
    v-model:visible="visible"
    title="支付提示"
    :footer="null"
    :closable="false"
    :mask-closable="false"
    :esc-to-close="false"
  >
    <div class="modal-content">
      <p class="important-text">浏览器将在新的页面打开支付宝，请完成支付。</p>
      <p>请不要关闭此窗口和刷新页面，支付后点击下面的按钮校验支付状态</p>
      <p>若支付成功但系统校验失败，请联系客服处理。</p>
      <div class="button-container">
        <a-button type="primary" @click="handlePaymentComplete"
          >我已完成支付</a-button
        >
        <a-button style="margin-left: 20px" @click="handlePaymentProblem"
          >我支付遇到问题</a-button
        >
      </div>
    </div>
  </a-modal>
  <PaymentFailedModal
    ref="paymentFailedModalRef"
    @paymentComplete="paymentComplete"
  />
  <PaymentSuccessModal
    ref="paymentSuccessModalRef"
    @paymentComplete="paymentComplete"
  />
</template>

<script setup>
import { ref, defineExpose, defineEmits } from "vue";
import PaymentFailedModal from "./PaymentFailedModal.vue";
import PaymentSuccessModal from "./PaymentSuccessModal.vue";
import { Message } from "@arco-design/web-vue";

const visible = ref(false);
const orderId = ref(null);
const paymentFailedModalRef = ref(null);
const paymentSuccessModalRef = ref(null);

const open = (orderId_) => {
  visible.value = true;
  orderId.value = orderId_;
};

import { getOrderDetailById } from "../../api/trade";
const handlePaymentComplete = async () => {
  // 获取订单详情
  const msg = Message.loading({
    content: "正在校验支付状态...",
    id: "payment-status",
    duration: 3000,
  });
  // 等待1s
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = await getOrderDetailById(orderId.value);
  const data = res?.data[0];
  if (data?.payStatus === 2) {
    handlePaymentSuccess();
    emit("paymentComplete");
  } else {
    handlePaymentProblem("system");
  }
  msg.close();
};

const handlePaymentProblem = (failObserveBy_ = "manual") => {
  visible.value = false;
  paymentFailedModalRef.value.open(failObserveBy_);
};

const handlePaymentSuccess = () => {
  visible.value = false;
  paymentSuccessModalRef.value.open();
};

const paymentComplete = () => {
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