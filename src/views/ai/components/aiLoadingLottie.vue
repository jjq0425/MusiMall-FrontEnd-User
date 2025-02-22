<template>
  <div id="lottie" style="z-index: 80; width: auto"></div>
</template>
      
      <script setup>
import lottie from "lottie-web";
import animationData_ from "@/assets/lottie/aiLoading.json"; //这个json动画文件是UI给的
import { onMounted, ref, defineExpose } from "vue";

const animation = ref(null);
const animationData = ref(animationData_);
const num = ref(0);

const openL = () => {
  num.value++;
  if (num.value > 1) {
    animation.value.play();
  } else {
    animation.value = lottie.loadAnimation({
      container: document.getElementById("lottie"),
      renderer: "svg",
      loop: true, //循环播放 true/number/false
      autoplay: true,
      animationData: animationData.value,
    });
    animation.value.play();
  }
};

onMounted(() => {
  num.value = 0;
});

defineExpose({
  openL,
});
</script>
      
      <style>
</style>