<template>
  <div class="user-center">
    <div class="side-nav">
      <a-menu
        mode="vertical"
        v-model:selected-keys="activeKey"
        style="width: 200px"
      >
        <a-menu-item key="info" @click="changMenu('info')"
          >基础信息</a-menu-item
        >
        <a-menu-item key="address" @click="changMenu('address')"
          >地址管理</a-menu-item
        >
      </a-menu>
    </div>
    <div class="content">
      <user-info v-show="activeKey === 'info'" />
      <AddressManagement
        v-show="activeKey === 'address'"
        ref="AddressManagementRef"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import UserInfo from "./components/userInfo.vue";
import AddressManagement from "./components/address.vue";

const activeKey = ref("info");
const AddressManagementRef = ref(null);
const changMenu = (key) => {
  activeKey.value = key;
  if (key === "address") {
    AddressManagementRef.value.initAddrress();
  }
};
</script>

<style scoped>
.user-center {
  display: flex;
  min-height: 500px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(176, 191, 231, 0.15);
  border-radius: 12px;
  padding: 20px;
}

.side-nav {
  margin-right: 20px;
}

.content {
  flex: 1;
  border-left: 1px solid #ebeef5;
  padding-left: 20px;
}

.address-item {
  margin-bottom: 16px;
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
}
</style>