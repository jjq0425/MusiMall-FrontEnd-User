<template>
  <div class="user-info">
    <div class="info-container">
      <img src="@/assets/logo/logo.png" alt="MusiMall Logo" class="logo" />
      <h2>{{ greeting }}, {{ userName }}</h2>
      <div class="decoration"></div>
      <div class="intro">
        MusiMall，一个由ByteAndHeartDance项目团队精心打造的全新电商系统，致力于为用户提供更加便捷、有趣的购物体验。打造出一个充满活力和创意的在线购物平台。
      </div>
      <div class="github-link">
        <a href="https://github.com/Fletcher-Luo/MusiMall" target="_blank"
          >访问我们的 GitHub 仓库</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/user";

const userStore = useUserStore();
const userName = ref("");
const greeting = ref("");

// 获取当前时间并设置问候语
const setGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    greeting.value = "早上好";
  } else if (hour < 18) {
    greeting.value = "下午好";
  } else {
    greeting.value = "晚上好";
  }
};

// 模拟获取用户信息
onMounted(() => {
  userName.value = userStore.username;
  setGreeting();
});
</script>

<style scoped>
.user-info {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  border-radius: 12px;
  padding: 20px;
}

.info-container {
  text-align: center;
}

.logo {
  width: 100px;
  height: auto;
  margin-bottom: 20px;
  border-radius: 50%;
  opacity: 0.6;
}

h2 {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.decoration {
  width: 100px;
  height: 4px;
  background-color: #333;
  margin: 0 auto;
  border-radius: 2px;
}

.intro {
  font-size: 16px;
  color: #666;
  margin-top: 20px;
  line-height: 1.5;
  width: 80%;
  margin: 20px auto;
}

.github-link {
  margin-top: 20px;
  font-size: 16px;
}

.github-link a {
  color: #0366d6;
  text-decoration: none;
}

.github-link a:hover {
  text-decoration: underline;
}
</style>