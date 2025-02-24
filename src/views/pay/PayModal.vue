<template>
  <a-modal v-model:visible="visible" title="选择支付方式" :footer="null">
    <div class="pay-options">
      <div class="pay-button alipay" @click="payWithAlipay">
        <img src="@/assets/logo/alipay.png" alt="支付宝支付" class="pay-icon" />
        <span>支付宝支付</span>
      </div>
      <div
        class="pay-button coins"
        :class="{ disabled: isCoinsDisabled }"
        @click="payWithCoins"
      >
        <img src="@/assets/coin/coin.png" alt="金币支付" class="pay-icon" />
        <span>金币支付</span>
      </div>
    </div>
  </a-modal>
  <AliPayModal ref="aliPayModalRef" @paymentComplete="paymentComplete" />
</template>

<script setup>
import { reactive, ref, defineExpose, defineEmits } from "vue";
import { Message } from "@arco-design/web-vue";
import AliPayModal from "./AliPayModal.vue";

const visible = ref(false);
const orderInfo = reactive({
  orderId: 0,
  totalAmount: 0,
});
const isCoinsDisabled = ref(false); // 设置金币支付按钮的禁用状态

const open = (orderId, totalAmount) => {
  orderInfo.orderId = orderId;
  orderInfo.totalAmount = totalAmount;
  visible.value = true;
};

import { goToAlipay } from "@/api/pay";
import { useApiStore } from "../../store/api";
const apiStore = useApiStore();
const aliPayModalRef = ref(null);

const payWithAlipay = () => {
  apiStore.setInlocalStorage();
  aliPayModalRef.value.open(orderInfo.orderId);
  setTimeout(() => {
    window.open(
      goToAlipay(
        "商城订单" + orderInfo.orderId,
        "order_" + orderInfo.orderId,
        orderInfo.totalAmount.toFixed(2)
      )
    );
  }, 1000);
};

const payWithCoins = () => {
  if (isCoinsDisabled.value) return;
  Message.info("金币支付功能暂未开放");
};

const paymentComplete = () => {
  visible.value = false;
  emit("paymentComplete");
};
const emit = defineEmits(["paymentComplete"]);

defineExpose({
  open,
});
</script>

<style scoped>
.pay-options {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.pay-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  font-size: 18px;
  padding: 15px 30px;
  border: 2px solid #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.pay-button:hover {
  box-shadow: 0 4px 28px rgba(0, 0, 0, 0.1);
  scale: 1.05;
  transform: translateY(-2px);
}

.pay-icon {
  width: 32px;
  height: 32px;
}

.pay-button.alipay {
  color: #1677ff;
  border-color: #1677ff;
}

.pay-button.coins {
  color: #ff9900;
  border-color: #ff9900;
}

.pay-button.disabled {
  color: #bfbfbf;
  border-color: #bfbfbf;
  cursor: not-allowed;
}

.pay-button.disabled:hover {
  box-shadow: none;
  scale: 1;
  transform: none;
}
</style>
