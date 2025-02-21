<script setup>
// 不需要额外的导入，因为路由视图组件会自动处理
</script>

<template>
  <keep-alive>
    <router-view />
  </keep-alive>
</template>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
}
</style>
