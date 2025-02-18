<template>
  <a-modal v-model:visible="visible" title="API 配置" @ok="handleOk">
    <a-form :model="formData" layout="vertical">
      <a-form-item label="是否使用网关">
        <a-switch v-model="formData.withGateWay" />
      </a-form-item>
      <a-form-item label="网关 Base URL" v-if="formData.withGateWay">
        <a-input v-model="formData.baseUrlWithGateWay" />
      </a-form-item>
      <a-form-item label="非网关 Base URL" v-else>
        <a-table :data="formData.baseUrlWithoutGateWay" :pagination="false">
          <template #columns>
            <a-table-column title="模块名" dataIndex="title" key="title" />
            <a-table-column title="URL" key="url">
              <template #cell="{ record }">
                <a-input v-model="record.url" />
              </template>
            </a-table-column>
            <a-table-column title="操作" key="action">
              <template #cell="{ record }">
                <a-button @click="saveUrl(record.title, record.url)"
                  >保存</a-button
                >
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-form-item>
    </a-form>
    <a-alert
      title="强烈建议使用【网关】环境，非网关环境没有统一响应体，前端可能解析失败！"
      type="warning"
      show-icon
    />
    <a-alert
      title="请务必拉取最新的gateway代码，否则若存在多个实例，有可能导致请求负载均衡时走向其他人（非你的机器上运行）的实例，导致请求失败！"
      type="warning"
      show-icon
    />
    <div class="version-info">前端版本最后更新: {{ buildTimestampShow }}</div>
  </a-modal>
</template>

<script setup>
import { ref, reactive, onMounted, defineExpose } from "vue";
import { useApiStore } from "@/store/api";
import { Message } from "@arco-design/web-vue";
import { buildTimestamp } from "@/buildTimestamp.js";

const visible = ref(false);
const apiStore = useApiStore();

const formData = reactive({
  withGateWay: true,
  baseUrlWithGateWay: "",
  baseUrlWithoutGateWay: [],
});

const buildTimestampShow = buildTimestamp;

const show = () => {
  // apiStore.baseUrlWithoutGateWay 的proxy 转为普通数组
  formData.baseUrlWithoutGateWay = JSON.parse(
    JSON.stringify(apiStore.baseUrlWithoutGateWay)
  );
  formData.withGateWay = apiStore.withGateWay;
  formData.baseUrlWithGateWay = apiStore.baseUrlWithGateWay;
  visible.value = true;
};

const handleOk = () => {
  apiStore.setWithGateWay(formData.withGateWay);
  if (formData.withGateWay) {
    apiStore.setBaseUrlWithGateWay(formData.baseUrlWithGateWay);
  }
  Message.success("保存成功");
  visible.value = false;
};

const saveUrl = (title, url) => {
  apiStore.setBaseUrlWithoutGateWay(title, url);
  Message.success("保存成功");
};

defineExpose({
  show,
});
</script>

<style scoped>
.version-info {
  text-align: right;
  margin-top: 16px;
  font-size: 12px;
  color: #888;
}
</style>
