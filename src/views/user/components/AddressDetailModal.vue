<template>
  <a-modal v-model:visible="visible" title="地址详情" :footer="null">
    <a-descriptions bordered column="1">
      <a-descriptions-item label="收件人">{{
        address.receiverName
      }}</a-descriptions-item>
      <a-descriptions-item label="电话">{{
        address.receiverPhone
      }}</a-descriptions-item>
      <a-descriptions-item label="省市区"
        >{{ address.province }} / {{ address.city }} /
        {{ address.district }}</a-descriptions-item
      >
      <a-descriptions-item label="详细地址">{{
        address.detailAddress
      }}</a-descriptions-item>
      <a-descriptions-item label="邮编">{{
        address.postCode
      }}</a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script setup>
import { reactive, ref } from "vue";
import { getAddressById } from "@/api/address";
import { Message } from "@arco-design/web-vue";

const visible = ref(false);
const address = reactive({
  receiverName: "",
  receiverPhone: "",
  province: "",
  city: "",
  district: "",
  detailAddress: "",
  postCode: "",
});

const showModal = (addrId) => {
  Message.loading({
    content: "加载中...",
    id: "addressDetail",
  });
  getAddressById(addrId).then((res) => {
    Object.assign(address, res);
    visible.value = true;
    Message.success({
      content: "加载成功",
      id: "addressDetail",
      duration: 500,
    });
  });
};

defineExpose({
  showModal,
});
</script>

<style scoped>
.address-detail {
  padding: 20px;
}
</style>
