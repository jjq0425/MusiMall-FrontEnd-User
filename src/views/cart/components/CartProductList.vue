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
                v-if="props.canChange"
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
                    v-if="props.canChange"
                  />
                  <span v-else>{{ item.quantity }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="" v-if="props.canChange">
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
    <OrderConfirmationDrawer ref="orderConfirmationDrawerRef" />
  </div>
</template>

<script setup>
import {
  reactive,
  ref,
  onMounted,
  watch,
  computed,
  defineExpose,
  defineEmits,
  defineProps,
} from "vue";
import {
  getCartList,
  removeCartItem,
  removeCartItems,
  updateCartItemQuantity,
} from "@/api/cart";
import { Message } from "@arco-design/web-vue";
import { debounce } from "lodash-es";
import OrderConfirmationDrawer from "@/views/order/components/OrderConfirmationDrawer.vue";

const cartData = reactive([]);
const currentPage = ref(1);
let pageSize = 10;
const totalCount = ref(0);
const hasReachedBottom = ref(false);
const fetchCartDataLoading = ref(false);
const changeItemLoading = ref(false);

const selectProductId = reactive([]);

const props = defineProps({
  canChange: {
    type: Boolean,
    default: true,
  },
});

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
  } else if (pageSize > 0) {
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
  calculateTotalPrice();
};

const removeItem = async (id) => {
  Message.loading({ content: "删除中...", id: "cart-data" });
  const res = await removeCartItem(id);
  if (res.code === 200) {
    Message.success({
      content: res.message == null ? "删除成功" : res.message,
      id: "cart-data",
    });
    // const index = cartData.findIndex((item) => item.id === id);
    // if (index !== -1) {
    //   cartData.splice(index, 1);
    //   totalCount.value--;
    // }
    // 直接重新刷新购物车数据
    refreshShoppingCartFromZero();
  } else {
    Message.error({
      content: res.message == null ? "删除失败" : res.message,
      id: "cart-data",
    });
  }
};

const removeSelectCartItem = async () => {
  console.log(selectProductId);
  if (selectProductId.length === 0) {
    Message.warning({
      content: "请先选择要删除的商品",
    });
    return;
  }
  Message.loading({ content: "删除中...", id: "cart-data" });
  const res = await removeCartItems(selectProductId);
  if (res.code === 200) {
    Message.success({
      content: res.message == null ? "删除成功" : res.message,
      id: "cart-data",
    });
    refreshShoppingCartFromZero();
  } else {
    Message.error({
      content: res.message == null ? "删除失败" : res.message,
      id: "cart-data",
    });
  }
};

const refreshShoppingCartFromZero = () => {
  cartData.splice(0, cartData.length);
  currentPage.value = 1;
  selectProductId.splice(0, selectProductId.length);
  fetchCartData();
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

const orderConfirmationDrawerRef = ref(null);
const createSelectOrder = () => {
  if (selectProductId.length === 0) {
    Message.warning({
      content: "请先选择要结算的商品",
    });
    return;
  }
  const selectItems = cartData.filter((item) =>
    selectProductId.includes(item.id)
  );
  const selectProducts = selectItems.map((item) => {
    return {
      cartId: item.id,
      productId: item.productId,
      quantity: item.quantity,
      productName: item.name,
      price: item.price,
      model: item.model,
      picture: item.cover,
    };
  });
  orderConfirmationDrawerRef.value.showDrawer(
    JSON.stringify(selectProducts),
    "cartPart"
  );
};

const totalPrice = ref(0);
const calculateTotalPrice = () => {
  totalPrice.value = cartData.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  console.log(totalPrice.value);
};

const createOrderAll = () => {
  if (cartData.length === 0) {
    Message.warning({
      content: "购物车为空，无法结算",
    });
    return;
  }
  orderConfirmationDrawerRef.value.showDrawer(null, "cartAll");
};

onMounted(() => {
  fetchCartData();
  // 如果不允许修改购物车，那么就是订单页面，那么就展示全部数据（不分页=每页数量设置为0）
  if (!props.canChange) {
    pageSize = 0;
  }
});

watch(totalCount, (newCount) => {
  emit("updateTotalCount", newCount);
});
watch(selectProductId, (newSelectProductId) => {
  emit("updateSelectProductId", newSelectProductId);
});
watch(changeItemLoading, (newChangeItemLoading) => {
  emit("updateChangeItemLoading", newChangeItemLoading);
});
watch(totalPrice, (newTotalPrice) => {
  emit("updateTotalPrice", newTotalPrice);
});

const emit = defineEmits([
  "updateTotalCount",
  "updateSelectProductId",
  "updateChangeItemLoading",
  "updateTotalPrice",
]);

defineExpose({
  removeSelectCartItem,
  createOrderAll,
  createSelectOrder,
});
</script>

<style>
.trade-item-picture {
  /* 样式代码 */
}
</style>
