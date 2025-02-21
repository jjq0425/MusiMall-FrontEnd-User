<template>
  <a-modal
    v-model:visible="visible"
    title="选择地址"
    :footer="null"
    :width="800"
  >
    <address-management ref="addressManagementRef" @choose="handleChoose" />
  </a-modal>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from "vue";
import AddressManagement from "./address.vue";

const visible = ref(false);
const addressManagementRef = ref(null);

const showModal = () => {
  addressManagementRef.value.initAddrress("choose");
  visible.value = true;
};

const handleChoose = (address) => {
  // 处理选择的地址
  emit("choose", address);
  visible.value = false;
};

const emit = defineEmits(["choose"]);

defineExpose({
  showModal,
});
</script>

<style scoped>
</style>
