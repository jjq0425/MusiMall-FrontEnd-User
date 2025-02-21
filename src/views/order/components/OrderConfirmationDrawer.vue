<template>
  <a-drawer
    v-model:visible="visible"
    title="请确认订单"
    placement="bottom"
    :height="650"
    :footer="null"
    unmountOnClose
    :drawer-style="{
      borderRadius: '12px 12px 0 0',
      boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
    }"
  >
    <div class="order-confirmation">
      <div class="card">
        <h2 style="margin-bottom: 10px">收货地址</h2>

        <OrderAddressChoosedCard
          ref="orderAddressChoosedCardRef"
          @changeAddress="changeAddress"
        />
      </div>

      <div class="card">
        <h2 style="margin-bottom: 10px">商品列表</h2>
        <TradeList :tradeItems="products" />
      </div>
      <a-divider />
      <div class="card">
        <h3>备注信息</h3>
        <a-textarea v-model="remark" placeholder="填写备注信息" />
      </div>
      <div style="min-height: 50px"></div>
    </div>
    <AddressChooseModal
      ref="addressChooseModalRef"
      @choose="chooseNewAddress"
    />
    <div class="floating-footer">
      <div class="total-price">
        <a-statistic
          title="总金额"
          :value="totalPrice"
          :precision="2"
          :value-from="0"
          :start="true"
          animation
        >
          <template #prefix> ￥ </template>
        </a-statistic>
      </div>
      <div class="button-group">
        <a-button
          @click="cancelOrder"
          type="text"
          style="margin-right: 20px; color: grey"
          >取消</a-button
        >
        <div class="purchase-btn" @click="comfirmOrder">
          <span style="color: white; font-weight: bold; font-size: 15px">
            <!-- <icon-plus-circle /> -->

            确认并结算
          </span>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, defineExpose, computed } from "vue";
import { getDefaultAddress } from "@/api/address";
import { preCreateTradeId, createByDirect } from "@/api/trade";
import OrderAddressChoosedCard from "@/views/user/components/OrderAddressChoosedCard.vue";
import AddressChooseModal from "@/views/user/components/AddressChooseModal.vue";
import { Message, Notification } from "@arco-design/web-vue";

import TradeList from "@/views/order/components/TradeList.vue";
import router from "@/router";

const visible = ref(false);
const selectedAddress = ref(null);
const remark = ref("");
const products = reactive([]);
const orderId = ref(null);
const createOrderloading = ref(false);

const confirmOrder = () => {
  // 处理确认订单逻辑
  console.log("确认订单", {
    selectedAddress: selectedAddress.value,
    products,
    remark: remark.value,
  });
  visible.value = false;
};

const cancelOrder = () => {
  visible.value = false;
};

const preCreateTradeIdNow = async () => {
  const res = await preCreateTradeId();
  orderId.value = res;
};

const comfirmOrder = async () => {
  if (createOrderloading.value == true) {
    return;
  }
  createOrderloading.value = true;
  Message.loading({
    content: "下单中...",
    id: "createOrder",
  });
  if (!selectedAddress.value.id) {
    Message.warning("请选择收货地址");
    return;
  }
  if (products.length == 0) {
    Message.warning("请选择商品");
    return;
  }
  const products_post = products.map((item) => {
    return {
      productId: item.productId,
      quantity: item.quantity,
    };
  });
  const res = await createByDirect(
    orderId.value == null ? null : orderId.value,
    selectedAddress.value.id,
    products_post,
    remark.value
  );

  if (res.traceNo) {
    setTimeout(() => {
      Notification.success({
        title: "下单成功",
        description: "即将跳转到订单详情页，请尽快完成支付",
      });
      visible.value = false;
      router.push({
        name: "Order-Detail",
        params: { id: res.traceNo },
      });
    }, 1000);
  } else {
    createOrderloading.value = false;
    Notification.warning({
      title: "下单失败",
      description: res?.message,
    });
  }
};

const orderAddressChoosedCardRef = ref(null);
const fetchDefaultAddress = async () => {
  const res = await getDefaultAddress();
  selectedAddress.value = res || null;
  orderAddressChoosedCardRef.value.setAddress(selectedAddress.value);
};

const showDrawer = (objStr) => {
  Notification.info("请确认订单信息");
  visible.value = true;
  fetchDefaultAddress();
  products.splice(0, products.length, ...JSON.parse(objStr));
  calculateTotalPrice();
  preCreateTradeIdNow();
};

const addressChooseModalRef = ref(null);
const changeAddress = () => {
  addressChooseModalRef.value.showModal();
};

const chooseNewAddress = (address) => {
  selectedAddress.value = address;
  orderAddressChoosedCardRef.value.setAddress(address);
};

const calculateTotalPrice = () => {
  totalPrice.value = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
};
const totalPrice = ref(0);

defineExpose({
  showDrawer,
});
</script>

<style scoped>
.order-confirmation {
  padding: 50px;
  padding-top: 10px;
  margin: 10px;
}

.product-picture {
  margin-top: 10px;
}

.card {
  margin-bottom: 30px;
}

.floating-footer {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 12px;
  box-shadow: 0 3.87234px 7.74468px -7.74468px rgba(31, 35, 41, 0.12),
    0 5.80851px 11.617px rgba(31, 35, 41, 0.08),
    0 7.74468px 23.234px 7.74468px rgba(31, 35, 41, 0.08);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  z-index: 9999;
}

.total-price {
  font-size: 18px;
  font-weight: bold;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-right: 30px;
}

.purchase-btn {
  border-radius: 8px;
  width: 120px;
  text-align: center;
  padding: 5px;
  cursor: pointer;
  background: linear-gradient(135deg, #feb692, #ea5455);
  scale: 1.2;
}
</style>
