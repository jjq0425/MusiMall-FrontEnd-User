<template>
  <div id="lottie" style="z-index: 80; width: auto"></div>
</template>
    
    <script setup>
import lottie from "lottie-web";
import animationData_ from "@/assets/lottie/ai.json"; //这个json动画文件是UI给的
import { onMounted, ref } from "vue";

const animation = ref(null);
const animationData = ref(animationData_);

onMounted(() => {
  animation.value = lottie.loadAnimation({
    container: document.getElementById("lottie"),
    renderer: "svg",
    loop: true, //循环播放 true/number/false
    autoplay: true,
    animationData: animationData.value,
  });
  animation.value.play();
});
</script>
    
    <style>
</style>