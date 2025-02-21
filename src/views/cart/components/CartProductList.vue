<template>
  <div>
    <a-empty v-if="cartData.length === 0 && !fetchCartDataLoading">
      购物车空空如也
    </a-empty>
    <a-empty v-else-if="fetchCartDataLoading && cartData.length == 0">
      <template #image>
        <icon-loading style="font-size: 68px; color: #165dff" />
      </template>
      <div style="margin-top: 25px; font-size: 20px">加载中，请稍后...</div>
    </a-empty>
    <a-list
      v-show="cartData.length > 0"
      :data="cartData"
      :max-height="500"
      @reach-bottom="fetchCartData"
      :scrollbar="true"
      style="overflow-y: always; cursor: pointer"
      hoverable
    >
      <template #scroll-loading>
        <div
          v-if="hasReachedBottom && !fetchCartDataLoading"
          @click="fetchCartData"
          style="cursor: pointer; color: grey"
        >
          —— 我是有底线的 ——
        </div>
        <a-spin v-else />
      </template>
      <template #item="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #avatar>
              <a-checkbox
                :model-value="isCheked(item.id)"
                @change="handleCheckChange(item.id)"
              />
            </template>
            <template #title>
              <div style="font-size: 16px; font-weight: bold">
                {{ item.productName }}
                <span style="font-size: 16px; color: red; font-weight: bold">
                  ￥{{ (item.price * item.quantity).toFixed(2) }}
                </span>
              </div>
            </template>

            <template #description>
              <a-descriptions
                :column="3"
                size="small"
                style="margin-top: 10px; width: 95vh"
              >
                <a-descriptions-item label="型号/描述" :span="3">{{
                  item.model
                }}</a-descriptions-item>
                <a-descriptions-item label="单价"
                  >￥{{ item.price.toFixed(2) }}</a-descriptions-item
                >
                <a-descriptions-item label="购买数量">
                  <a-input-number
                    v-model="item.quantity"
                    :min="1"
                    :max="item.stock"
                    mode="button"
                    style="width: 150px"
                    @change="updateQuantity(item.id, item.quantity)"
                  />
                </a-descriptions-item>
                <a-descriptions-item label="">
                  <a-button
                    type="text"
                    @click="removeItem(item.id)"
                    style="color: red; transform: translateX(-10vh)"
                  >
                    移除
                  </a-button>
                </a-descriptions-item>
              </a-descriptions>
            </template>
          </a-list-item-meta>

          <template #extra>
            <div class="trade-item-picture">
              <a-image
                :src="item.cover"
                :alt="item.productName"
                width="110px"
                height="110px"
              />
            </div>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup>
import {
  reactive,
  ref,
  onMounted,
  watch,
  defineExpose,
  defineEmits,
} from "vue";
import {
  getCartList,
  removeCartItem,
  updateCartItemQuantity,
} from "@/api/cart";
import { Message } from "@arco-design/web-vue";
import { debounce } from "lodash-es";

const cartData = reactive([]);
const currentPage = ref(1);
const pageSize = 10;
const totalCount = ref(0);
const getTotalCount = () => totalCount.value;
const hasReachedBottom = ref(false);
const fetchCartDataLoading = ref(false);

const selectProductId = reactive([]);

const fetchCartData = async () => {
  fetchCartDataLoading.value = true;
  Message.loading({ content: "加载中...", id: "cart-data" });
  const response = await getCartList(currentPage.value, pageSize).finally(
    () => {
      fetchCartDataLoading.value = false;
    }
  );
  if (!hasReachedBottom.value) {
    cartData.push(...response.data);
  } else {
    cartData.splice(
      (currentPage.value - 1) * pageSize,
      pageSize,
      ...response.data
    );
  }
  Message.success({ content: "加载成功", id: "cart-data" });
  fetchCartDataLoading.value = false;
  if (cartData.length >= response.totalCount) {
    hasReachedBottom.value = true;
  } else {
    hasReachedBottom.value = false;
    currentPage.value++;
  }
  totalCount.value = response.totalCount;
};

const removeItem = async (id) => {
  Message.loading({ content: "删除中...", id: "cart-data" });
  const res = await removeCartItem(id);
  if (res.code === 200) {
    Message.success({
      content: res.message == null ? "删除成功" : res.message,
      id: "cart-data",
    });
    const index = cartData.findIndex((item) => item.id === id);
    if (index !== -1) {
      cartData.splice(index, 1);
      totalCount.value--;
    }
  } else {
    Message.error({
      content: res.message == null ? "删除失败" : res.message,
      id: "cart-data",
    });
  }
};

const updateQuantity = debounce(async (id, quantity) => {
  const res = await updateCartItemQuantity(id, quantity);
  if (res.code === 200) {
  } else {
    Message.error({
      content: res.message == null ? "更新失败" : res.message,
    });
  }
}, 1000);

const isCheked = (id) => {
  return selectProductId.includes(id);
};

const handleCheckChange = (id) => {
  if (selectProductId.includes(id)) {
    const index = selectProductId.findIndex((item) => item === id);
    selectProductId.splice(index, 1);
  } else {
    selectProductId.push(id);
  }
};

onMounted(() => {
  fetchCartData();
});

watch(totalCount, (newCount) => {
  emit("updateTotalCount", newCount);
});

const emit = defineEmits(["updateTotalCount"]);

defineExpose({
  getTotalCount,
});
</script>

<style>
.trade-item-picture {
  /* 样式代码 */
}
</style>
