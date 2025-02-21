<template>
  <div>
    <!-- 无值 -->
    <div
      class="address-item address-empty"
      v-if="!address?.id"
      @click="changeAddress"
    >
      <a-icon type="exclamation-circle" />
      <p>您还没有选择收货地址</p>
      <a-button type="primary">选择收货地址</a-button>
    </div>
    <!-- 有值 -->
    <div class="address-item" v-else>
      <div class="address-info">
        <p class="receiver-name">
          {{ address.receiverName }}
        </p>
        <p class="receiver-phone">{{ address?.receiverPhone }}</p>
        <p class="full-address">
          {{ address?.province }} / {{ address?.city }} /
          {{ address?.district }} /
          {{ address?.detailAddress }}
        </p>
      </div>
      <div class="address-actions">
        <a-button type="primary" @click="changeAddress">切换</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, defineExpose, defineEmits } from "vue";

const address = reactive({
  id: "",
  receiverName: "",
  receiverPhone: "",
  province: "",
  city: "",
  district: "",
  detailAddress: "",
  postCode: "",
});

const setAddress = (addr) => {
  Object.assign(address, addr);
};

defineExpose({
  setAddress,
});

const changeAddress = () => {
  emit("changeAddress");
};

const emit = defineEmits(["changeAddress"]);
</script>

<style scoped>
.address-info {
  flex: 1;
}

.receiver-name {
  font-weight: bold;
  color: black;
  font-size: 18px;
}

.receiver-phone {
  font-size: 12px;
  color: gray;
}

.full-address {
  margin-top: 10px;
}

.address-actions {
  display: flex;
  gap: 10px;
}

.action-icon {
  font-size: 18px;
  margin-right: 10px;
  cursor: pointer;
}

.address-item {
  padding: 20px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 5px 15px 0 rgba(176, 191, 231, 0.15);
  transition: all 0.3s ease-in-out;
}

.address-item:hover {
  border-color: #165dff !important;
}

.address-empty {
  /* 虚线边框 */
  border: 2px dashed #dee2e6;
  cursor: pointer;
}
</style>