<template>
  <div class="address-management">
    <a-button
      type="primary"
      @click="addAddressNow"
      :disabled="addressListloading"
      >新增地址</a-button
    >

    <div class="address-list">
      <a-empty v-if="addresses.length === 0"
        >暂无地址信息，点击左上角添加</a-empty
      >
      <a-empty v-else-if="addressListloading">
        <template #image>
          <icon-loading style="font-size: 68px; color: #165dff" />
        </template>
        <div style="margin-top: 25px; font-size: 20px">加载中，请稍后...</div>
      </a-empty>

      <div
        v-else
        v-for="address in addresses"
        :key="address.id"
        class="address-item"
        :class="{
          'default-address': address.addressIsDefault && showType === 'detail',
        }"
      >
        <div class="address-info">
          <p class="receiver-name">
            {{ address.receiverName }}
            <a-tag
              v-if="address.addressIsDefault"
              color="blue"
              style="margin-left: 30px"
            >
              默认收货地址
            </a-tag>
          </p>
          <p class="receiver-phone">{{ address.receiverPhone }}</p>
          <p class="full-address">
            {{ address.province }} / {{ address.city }} /
            {{ address.district }} / {{ address.detailAddress }}
          </p>
        </div>
        <div class="address-actions">
          <a-tooltip
            content="设为默认"
            placement="top"
            v-if="!address.addressIsDefault"
          >
            <svg-icon
              name="flag"
              @click="setDefaultAddressNow(address.id)"
              class="action-icon"
            />
          </a-tooltip>
          <a-tooltip content="查看" placement="top">
            <icon-eye @click="viewAddressNow(address)" class="action-icon" />
          </a-tooltip>
          <a-tooltip content="编辑" placement="top">
            <icon-edit @click="editAddressNow(address)" class="action-icon" />
          </a-tooltip>
          <a-tooltip content="删除" placement="top">
            <icon-delete
              @click="deleteAddressNow(address.id)"
              class="action-icon"
              style="color: red"
            />
          </a-tooltip>
        </div>
        <div
          class="address-actions"
          v-if="showType === 'choose'"
          style="margin-left: 20px"
        >
          <a-button type="primary" @click="chooseAddress(address)"
            >选择</a-button
          >
        </div>
      </div>
      <a-pagination
        v-if="addresses.length !== 0 && !addressListloading"
        :total="totalCount"
        :current="currentPage"
        :page-size="pageSize"
        @change="handlePageChange"
        show-total
        style="margin-top: 20px"
      />
    </div>

    <address-detail-modal ref="addressDetailModalRef" />
    <address-edit-modal
      ref="addressEditModalRef"
      @needRefresh="getAddressListNow"
    />
  </div>
</template>

<script setup>
import { ref, reactive, defineExpose, defineEmits } from "vue";
import AddressDetailModal from "./AddressDetailModal.vue";
import AddressEditModal from "./AddressEditModal.vue";
import { Message } from "@arco-design/web-vue";
import SvgIcon from "@/components/SvgIcon.vue";

const addresses = reactive([]);

const addressDetailModalRef = ref(null);
const addressEditModalRef = ref(null);

const showType = ref("detail"); // detail, choose

const addAddressNow = () => {
  addressEditModalRef.value.showModal();
};

const viewAddressNow = (address) => {
  addressDetailModalRef.value.showModal(address.id);
};

const editAddressNow = (address) => {
  addressEditModalRef.value.showModal(address);
};

const chooseAddress = (address) => {
  emit("choose", address);
};

const emit = defineEmits(["choose"]);

import {
  getAddressList,
  deleteAddress,
  setDefaultAddress,
} from "@/api/address";

const currentPage = ref(1);
const pageSize = ref(5);
const totalCount = ref(0);
const addressListloading = ref(false);
const getAddressListNow = () => {
  addressListloading.value = true;
  getAddressList(currentPage.value, pageSize.value).then((res) => {
    addressListloading.value = false;
    addresses.splice(0, addresses.length, ...res.data);
    totalCount.value = res.totalCount;
  });
};

const handlePageChange = (page) => {
  addressListloading.value = true;
  currentPage.value = page;
  getAddressListNow();
};
const deleteAddressNow = (id) => {
  addressListloading.value = true;
  deleteAddress(id).then(() => {
    Message.success("删除成功");
    currentPage.value = 1;
    getAddressListNow();
  });
};

const setDefaultAddressNow = (id) => {
  addressListloading.value = true;
  setDefaultAddress(id).then(() => {
    Message.success("设置默认地址成功");
    getAddressListNow();
  });
};

const initAddrress = (type = "detail") => {
  showType.value = type;
  addressListloading.value = true;
  getAddressListNow();
};

defineExpose({
  initAddrress,
});
</script>

<style scoped>
.address-management {
  padding: 20px;
}

.address-list {
  margin-top: 20px;
}

.address-item {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 5px 15px 0 rgba(176, 191, 231, 0.15);
}

.default-address {
  border-color: #165dff;
}

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
</style>