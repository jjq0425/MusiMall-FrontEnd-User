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
      <a-form-item label="支付宝沙箱 URL">
        <a-input v-model="formData.payUrl" />
      </a-form-item>
      <a-form-item label="AI服务使用测试环境（测试环境仅会输出固定句式）">
        <a-switch v-model="formData.isAiTest" />
      </a-form-item>
    </a-form>
    <a-form-item label="商品库存Redis同步">
      <a-button @click="syncInventory" type="primary">同步库存</a-button>
    </a-form-item>

    <a-alert
      title="强烈建议使用【网关】环境，非网关环境没有统一响应体，前端可能解析失败！前端测试均使用【网关】环境，不保证非网关环境的适配性。"
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
import { SyncProduct } from "@/api/product";

const visible = ref(false);
const apiStore = useApiStore();

const formData = reactive({
  withGateWay: true,
  baseUrlWithGateWay: "",
  baseUrlWithoutGateWay: [],
  payUrl: "",
  isAiTest: null,
});

const buildTimestampShow = buildTimestamp;

const show = () => {
  // apiStore.baseUrlWithoutGateWay 的proxy 转为普通数组
  formData.baseUrlWithoutGateWay = JSON.parse(
    JSON.stringify(apiStore.baseUrlWithoutGateWay)
  );
  formData.withGateWay = apiStore.withGateWay;
  formData.baseUrlWithGateWay = apiStore.baseUrlWithGateWay;
  formData.payUrl = apiStore.payUrl;
  formData.isAiTest =
    localStorage.getItem("aiTest") === "true" ||
    localStorage.getItem("aiTest") === null;
  visible.value = true;
};

const handleOk = () => {
  apiStore.setWithGateWay(formData.withGateWay);
  if (formData.withGateWay) {
    apiStore.setBaseUrlWithGateWay(formData.baseUrlWithGateWay);
  }
  apiStore.setPayUrl(formData.payUrl);
  if (formData.isAiTest) {
    localStorage.setItem("aiTest", "true");
  } else {
    localStorage.setItem("aiTest", "false");
  }
  Message.success("保存成功");
  visible.value = false;
};

const saveUrl = (title, url) => {
  apiStore.setBaseUrlWithoutGateWay(title, url);
  Message.success("保存成功");
};

const syncInventory = () => {
  SyncProduct();
  Message.success("同步任务已发送，请稍等");
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
