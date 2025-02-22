<template>
  <!-- AI -->
  <div
    style="
      padding: 20px 20px;
      padding-right: 40px;
      margin-bottom: 24px;
      background: linear-gradient(90deg, #f3f4fd 0, #fcf2fc 100%);
      border-radius: 999px;
      min-height: 80px;
      font-size: 50px;
      font-weight: 900;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-shadow: 0 5px 15px 0 rgba(176, 191, 231, 0.45);
      cursor: pointer;
    "
    @click="openAiChat"
    class="aiCard"
  >
    <div id="lottie_ai"></div>
    <aiLottie style="width: 100px; margin-right: 20px"></aiLottie>
    <div style="">
      <div style="font-size: 30px; color: black">AI 导购</div>
      <div
        style="
          font-size: 40px;
          background: linear-gradient(90deg, #4752e6, #de81de);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        "
      >
        为您服务
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import aiLottie from "./aiLottie.vue";

const openAiChat = () => {
  console.log("AI Chat");
};

onMounted(() => {
  console.log("AI Card Mounted");
});
</script>

<style scoped>
.aiCard {
  transform: scale(0.75);
  transition: all 0.3s ease-in-out;
}
.aiCard:hover {
  transform: translate3d(0, -5px, -20px) scale(0.95);
}
</style>