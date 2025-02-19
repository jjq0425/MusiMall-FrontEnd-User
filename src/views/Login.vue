<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img
          src="@/assets/logo/logo.png"
          alt="MusiMall Logo"
          class="login-logo"
        />
        <h2>MusiMall</h2>
        <p>欢迎登录MusiMall用户端</p>
      </div>
      <a-form :model="formData" @submit="handleSubmit" layout="vertical">
        <a-form-item
          field="username"
          label="用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input v-model="formData.username" placeholder="请输入用户名">
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="password"
          label="密码"
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password
            v-model="formData.password"
            placeholder="请输入密码"
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item
          field="captcha"
          label="验证码"
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <a-space>
            <a-input
              v-model="formData.captcha"
              placeholder="请输入验证码"
              style="width: 200px"
            >
              <template #prefix>
                <icon-safe />
              </template>
            </a-input>
            <div class="captcha-img" @click="refreshCaptcha">
              <a-button type="text" v-if="captchaImg.captchaImg === null"
                >刷新验证码</a-button
              >
              <img
                v-else
                :src="captchaImg.captchaImg"
                alt="验证码"
                style="width: 100%; height: 100%"
              />
            </div>
          </a-space>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            long
            :loading="loginLoading"
            >登录</a-button
          >
        </a-form-item>
      </a-form>
      <!-- <a-button type="text">没有账号？点击注册</a-button> -->
    </div>
    <ApiConfigModal ref="apiConfigModalRef" />
    <icon-wifi class="wifi-icon" @click="showApiConfigModal" />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { Message } from "@arco-design/web-vue";
import ApiConfigModal from "@/components/ApiConfigModal.vue";
import { getCaptcha, login } from "@/api/auth";
import { useApiStore } from "@/store/api";
import { useUserStore } from "@/store/user";
import { Notification } from "@arco-design/web-vue";
import { IconWifi } from "@arco-design/web-vue/es/icon";
import router from "@/router";

const apiStore = useApiStore();
const userStore = useUserStore();

const formData = reactive({
  username: "test",
  password: "123456",
  captcha: "",
});

const captchaImg = reactive({
  captchaImg: null,
  uuid: "",
});

onMounted(() => {
  apiStore.setInlocalStorage();
  refreshCaptcha();
  loginLoading.value = false;
});

const loginLoading = ref(false);
const handleSubmit = () => {
  // 校验表单
  if (!formData.username || !formData.password || !formData.captcha) {
    Message.error("请填写完整信息");
    return;
  }
  loginLoading.value = true;
  login({
    username: formData.username,
    password: formData.password,
    code: formData.captcha,
    uuid: captchaImg.uuid,
  })
    .then((res) => {
      console.log(res.token == null);
      if (res.token == null) {
        Notification.warning({
          title: "登录失败",
          content: res.message,
        });
        return;
      } else {
        Notification.success({
          title: "登录成功",
          content: "欢迎回来, " + res.username,
        });
        userStore.setUserInfo(res);
        loginLoading.value = false;
        router.push({ name: "Product" });
      }
    })
    .finally(() => {
      loginLoading.value = false;
    });
};

const refreshCaptcha = () => {
  // 这里处理刷新验证码逻辑，实际项目中需要对接后端API
  getCaptcha().then((res) => {
    console.log(res);
    captchaImg.captchaImg = res.img;
    captchaImg.uuid = res.uuid;
  });
};

const apiConfigModalRef = ref(null);
const showApiConfigModal = () => {
  apiConfigModalRef.value.show();
};
</script>

<style scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-box {
  width: 480px;
  padding: 48px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.login-header {
  margin-bottom: 48px;
  position: relative;
}

.login-header h2 {
  color: #1d2129;
  margin: 0;
  font-size: 32px;
  font-weight: 600;
}

.login-header p {
  color: #86909c;
  margin: 12px 0 0;
  font-size: 16px;
}

.captcha-img {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 32px;
  cursor: pointer;
}

:deep(.arco-form-item) {
  margin-bottom: 18px;
}

:deep(.arco-input-wrapper) {
  height: 40px;
}

:deep(.arco-btn-primary) {
  height: 40px;
  font-size: 16px;
}

.login-logo {
  width: 100px;
  height: auto;
  margin-bottom: 16px;
  border: 2px solid white;
  border-radius: 50%;
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
}

.wifi-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 24px;
  color: white;
  cursor: pointer;
}
</style>