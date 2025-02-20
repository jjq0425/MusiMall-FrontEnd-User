<template>
  <div :class="['order-header', headerClass]">
    <div class="header-content">
      <h1>{{ mainTitle }}</h1>
      <p style="margin-top: 10px">{{ subTitle }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  orderStatus: {
    type: Number,
    required: true,
  },
});

const mainTitle = computed(() => {
  switch (props.orderStatus) {
    case 1:
      return "订单待支付，快去付款吧！";
    case 2:
      return "已支付，宝贝正在路上~";
    case 4:
      return "订单已完成，感谢您的购买！";
    case 5:
      return "订单已取消，期待下次光临~";
    case 6:
      return "订单已退款，钱钱已退回~";
    default:
      return "订单状态未知";
  }
});

const subTitle = computed(() => {
  switch (props.orderStatus) {
    case 1:
      return "支付勿延俄顷间，订单将失君莫叹。尽快完成支付办，以免向隅空悲叹。";
    case 2:
      return "宝贝打包正忙时，请君耐心稍等候。不久便将寄君手，欢欣期待莫心焦。";
    case 4:
      return "喜得宝物愿君欢，使用愉快常相伴。欢迎再次来光顾，宾至如归情不散。";
    case 5:
      return "订单取消已成空，缘分散尽暂分别。期待下次再相遇，再见之时情更浓。";
    case 6:
      return "退款已回君账户，查收无误心自宽。钱钱归位喜盈怀，服务周到愿君还。";
    default:
      return "订单状态未可知，疑问重重心惑之。联系客服解君忧，答疑解惑不迟疑。";
  }
});

const headerClass = computed(() => {
  switch (props.orderStatus) {
    case 1:
      return "status-pending";
    case 2:
      return "status-paid";
    case 4:
      return "status-completed";
    case 5:
      return "status-cancelled";
    case 6:
      return "status-refunded";
    default:
      return "status-unknown";
  }
});
</script>

<style scoped>
.order-header {
  border-radius: 12px;
  padding: 20px;
  color: white;
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

p {
  font-size: 16px;
  margin: 5px 0 0 0;
}

.status-pending {
  background: linear-gradient(90deg, #ff7e5f, #feb47b);
}

.status-paid {
  background: linear-gradient(90deg, #6a11cb, #2575fc);
}

.status-completed {
  background: linear-gradient(90deg, #43cea2, #185a9d);
}

.status-cancelled {
  background: linear-gradient(90deg, #ff4b1f, #ff9068);
}

.status-refunded {
  background: linear-gradient(90deg, #ffafbd, #ffc3a0);
}

.status-unknown {
  background: linear-gradient(90deg, #bdc3c7, #2c3e50);
}
</style>
