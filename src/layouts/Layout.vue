<template>
  <div class="layout">
    <a-page-header :show-back="false">
      <template #title>
        <div
          style="
            display: flex;
            align-items: center;
            width: 200px;
            justify-content: flex-end;
            cursor: pointer;
          "
          @click="() => router.push({ name: 'Product' })"
        >
          <img
            src="@/assets/logo/logo.png"
            alt="MusiMall Logo"
            class="login-logo"
          />
          <a-space>
            <span>MusiMall</span>
          </a-space>
        </div>
      </template>
      <template #subtitle>
        <a-space>
          <span>ByteAndHeartDance</span>
        </a-space>
      </template>
      <template #extra>
        <div style="">
          <div
            style="
              width: 900px;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <a-menu
              class="navMenu"
              mode="horizontal"
              :default-selected-keys="['Product']"
              :selected-keys="menuKeyNow"
            >
              <a-menu-item key="Product" @click="routeTo('Product')"
                >优选好物</a-menu-item
              >
              <a-menu-item key="ShoppingCart" @click="routeTo('ShoppingCart')"
                >购物小车</a-menu-item
              >
              <a-menu-item key="Order" @click="routeTo('Order')"
                >我的订单</a-menu-item
              >
              <a-menu-item key="UserCenter" @click="routeTo('UserCenter')"
                >个人中心</a-menu-item
              >
            </a-menu>
            <a-tooltip content="API设置" position="bottom">
              <icon-wifi @click="showApiConfigModal" class="right-ICON" />
            </a-tooltip>
            <a-tooltip content="退出登录" position="bottom">
              <icon-export
                @click="handleLogout"
                style="color: red"
                class="right-ICON"
              />
            </a-tooltip>
          </div>

          <!-- <div class="user-actions">
            <a-dropdown trigger="hover">
              <a-button
                type="text"
                style="color: black; font-weight: bold; font-size: 15px"
                shape="round"
              >
                <icon-user style="margin-right: 5px" />
                {{
                  currentUserName == null ? "欢迎" : currentUserName
                }}</a-button
              >
              <template #content>
                <a-doption @click="handleLogout">
                  <template #icon>
                    <icon-export style="color: red" />
                  </template>
                  <template #default
                    ><span style="color: red">退出登录</span></template
                  >
                </a-doption>
                <a-doption @click="showApiConfigModal">
                  <template #icon>
                    <icon-wifi />
                  </template>
                  <template #default>API配置</template>
                </a-doption>
              </template>
            </a-dropdown>
          </div> -->
        </div>
      </template>
    </a-page-header>

    <main class="main">
      <keep-alive>
        <router-view />
      </keep-alive>
    </main>
    <ApiConfigModal ref="apiConfigModalRef" />
    <!-- <footer class="footer">
      <p>&copy; 2025 MusiMall. All rights reserved.</p>
    </footer> -->
  </div>
</template>

<script setup>
import { PageHeader } from "@arco-design/web-vue";
import ApiConfigModal from "@/components/ApiConfigModal.vue";
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "@/store/user";
import router from "@/router";

const userStore = useUserStore();

const menuKeyNow = computed(() => {
  if (router.currentRoute.value.name.includes("Product")) {
    return "Product";
  }
  if (router.currentRoute.value.name.includes("ShoppingCart")) {
    return "ShoppingCart";
  }
  if (router.currentRoute.value.name.includes("Order")) {
    return "Order";
  }
  if (router.currentRoute.value.name.includes("UserCenter")) {
    return "UserCenter";
  }
});

const routeTo = (key) => {
  router.push({ name: key });
};
onMounted(() => {});

const handleLogout = () => {
  userStore.clearUserInfo();
};

const apiConfigModalRef = ref(null);
const showApiConfigModal = () => {
  apiConfigModalRef.value.show();
};
</script>

<style scoped>
* {
  overflow: hidden;
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.login-logo {
  width: 50px;
  height: auto;
  border: 2px solid white;
  border-radius: 50%;
  transform: translateX(-50%) translateY(0%);
}

.header {
  background-color: #333;
  color: white;
}

.right-ICON {
  font-weight: bold;
  font-size: 18px;
  margin-right: 15px;
  cursor: pointer;
}

.nav {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 8px;
  margin: 16px;
}

.nav a {
  color: #333;
  margin-left: 16px;
  text-decoration: none;
}

.nav a:hover {
  text-decoration: underline;
}

.user-actions {
  display: flex;
  align-items: center;
  color: black;
}

.user-actions a {
  margin-left: 16px;
  text-decoration: none;
}

.user-actions a:hover {
  text-decoration: underline;
}

.cart-icon {
  font-size: 24px;
  margin-left: 16px;
  cursor: pointer;
}

.main {
  flex: 1;
  padding: 32px;
  background-color: #f5f5f5;
}

.footer {
  text-align: center;
  padding: 16px;
  background-color: #333;
  color: white;
}

::v-deep .arco-menu-selected {
  color: #165dff;
  font-weight: bold !important;
  position: relative;
}
</style>
