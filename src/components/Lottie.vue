<script setup>
import { ref, onMounted } from "vue";
import lottie from "lottie-web";

// 设置组件参数
const props = defineProps({
  renderer: {
    type: String,
    default: "svg",
  },
  // 循环播放
  loop: {
    type: Boolean,
    default: true,
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  animationData: {
    type: Object,
    default: () => ({}),
  },
  name: {
    type: String,
    default: "",
  },
  startSegment: {
    type: Number,
    default: 0,
  },
});

// 创建 lottie 接收变量和获取dom
const animation = ref(null);
const dom = ref(null);

// 创建事件返回初始化lottie对象
const emits = defineEmits(["getAnimation", "getDom"]);

// 初始化渲染 lottie动画，并返回lottie对象
onMounted(() => {
  animation.value = lottie.loadAnimation({
    container: dom.value, // 用于渲染的容器
    // 渲染方式 svg、canvas、html
    renderer: props.renderer,
    // 是否循环
    loop: props.loop,
    autoplay: props.autoplay, // 自动播放
    // UED 提供的 动画的 json 文件
    animationData: props.animationData,
    name: props.name,
  });
  emits("getAnimation", animation.value);
  animation.value.addEventListener("complete", function () {
    animation.value.goToAndPlay(props.startSegment, true);
  });
});

const destoryAnimation = () => {
  animation.value.destroy(); // 销毁动画
};

defineExpose({
  destoryAnimation,
});
</script>
 
<template>
  <!-- 渲染 lottie 动画 -->
  <div id="lottieId" ref="dom"></div>
</template>
 
<style scoped>
#lottieId {
  width: 100%;
  height: 100%;
}
</style>