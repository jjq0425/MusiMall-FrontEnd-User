<template>
  <a-modal
    v-model:visible="visible"
    title="商品详情"
    :width="1200"
    :footer="null"
  >
    <div class="product-detail-modal">
      <div class="image-section">
        <div>
          <a-image
            :src="product.picture"
            :alt="product.name"
            class="product-image"
            width="400px"
            height="400px"
          />
        </div>
      </div>
      <div class="info-section">
        <h2 class="product-name">{{ product.name }}</h2>
        <p class="description">{{ product.description }}</p>
        <div class="price" v-if="product.remainQuantity > 0">
          单价: ￥{{ product.price }}/件
        </div>
        <div class="price" style="color: grey" v-else>已售罄</div>

        <div class="stock-info">
          <span class="stock-text">
            已售: {{ product.quantity - product.remainQuantity }}
          </span>
          <span class="stock-text">
            剩余库存: {{ product.remainQuantity }}
          </span>
          <a-tag
            v-if="product.remainQuantity <= 0"
            color="red"
            style="font-size: 12px"
          >
            已售罄
          </a-tag>
          <a-tag
            v-else-if="product.remainQuantity <= 20"
            color="orange"
            style="font-size: 12px"
          >
            库存告急
          </a-tag>
          <a-tag
            v-else-if="product.quantity - product.remainQuantity <= 20"
            color="green"
            style="font-size: 12px"
          >
            新品发售
          </a-tag>
          <a-tag v-else color="blue" style="font-size: 12px">备货充足</a-tag>
        </div>
        <div style="border-radius: 12px" class="footer">
          <div class="total-price" v-if="product.remainQuantity > 0">
            <span style="font-weight: bold">总金额：</span> ￥{{ totalPrice }}
          </div>
          <div class="purchase" v-if="product.remainQuantity > 0">
            <div>
              <a-input-number
                :style="{ width: '220px' }"
                placeholder="Please Enter"
                mode="button"
                size="large"
                class="input-demo"
                v-model="count"
                :min="1"
                :max="product.remainQuantity"
              />
            </div>

            <div class="purchase-btn-group">
              <div class="purchase-btn" @click="addToCart">
                <SvgIcon name="shoppingCartWhite" size="12px" />
                <span style="color: white; font-weight: bold; font-size: 15px">
                  <!-- <icon-plus-circle /> -->

                  加入购物车
                </span>
              </div>
              <div class="purchase-btn-2" @click="makeOrderDirect">
                <SvgIcon name="makeOrderWhite" size="13px" />
                <span style="color: white; font-weight: bold; font-size: 15px">
                  <!-- <icon-plus-circle /> -->

                  直接购买
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <OrderConfirmationDrawer ref="OrderConfirmationDrawerRef" />
  </a-modal>
</template>

<script setup>
import { reactive, ref, defineExpose, computed } from "vue";
import { getProductById } from "@/api/product";
import { addCart } from "@/api/cart";
import { Message } from "@arco-design/web-vue";
import SvgIcon from "@/components/SvgIcon.vue";
import OrderConfirmationDrawer from "@/views/order/components/OrderConfirmationDrawer.vue";

const visible = ref(false);
const count = ref(1);
const product = reactive({
  id: 1,
  name: "商品名称",
  description: "商品描述",
  picture: "",
  price: 100,
  quantity: 1000,
  remainQuantity: 1000,
});
const showModal = async (productId) => {
  count.value = 1;
  Message.loading({
    content: "加载中...",
    id: "productDetail",
  });
  const res = await getProductById(productId).catch((err) => {
    Message.error({
      content: `获取商品详情失败,请稍后再试:${err}`,
      id: "productDetail",
    });
  });
  if (res.id != null) {
    Object.assign(product, res);
    console.log(product);
    visible.value = true;
    Message.success({
      content: "加载成功",
      id: "productDetail",
      duration: 500,
    });
  }
};
defineExpose({ showModal });

const addToCartLoading = ref(false);
const addToCart = async () => {
  if (addToCartLoading.value) {
    return;
  }
  addToCartLoading.value = true;
  Message.loading({
    content: "加入购物车中...",
    id: "addToCart",
  });
  if (count.value > product.remainQuantity) {
    Message.error("购买数量超过库存");
    return;
  }
  if (count.value <= 0) {
    Message.error("购买数量不能小于1");
    return;
  }
  const res = await addCart(product.id, count.value).finally(() => {
    addToCartLoading.value = false;
  });
  if (res.code == 200) {
    Message.success({
      content: res.message == null ? "加入购物车成功" : res.message,
      id: "addToCart",
      duration: 500,
    });
  } else {
    Message.error({
      content: "加入购物车失败",
      id: "addToCart",
      duration: 500,
    });
  }
  addToCartLoading.value = false;

  visible.value = false;
};

const OrderConfirmationDrawerRef = ref(null);
const makeOrderDirect = () => {
  visible.value = false;
  const objStr = JSON.stringify([
    {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: count.value,
      model: product.model,
      picture: product.picture,
    },
  ]);
  OrderConfirmationDrawerRef.value.showDrawer(objStr);
};

const totalPrice = computed(() => {
  return (product.price * count.value).toFixed(2);
});
</script>

<style scoped>
.product-detail-modal {
  display: flex;
  gap: 16px;
  padding: 16px;
  min-height: 400px;
}

.image-section {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image {
  width: 400px;

  border-radius: 8px;
  border: 1px solid #eee;
}

.info-section {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 16px;
}

.product-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 0;
}

.description {
  font-size: 14px;
  line-height: 1.5;
  color: #666;
}

.price {
  color: red;
  font-weight: bold;
  font-size: 22px;
  margin: 8px 0;
}

.total-price {
  font-size: 16px;
  color: grey;
  /* font-weight: bold; */
  /* position: absolute; */
  bottom: 0px;
}

.stock-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 8px 0;
}

.stock-text {
  font-size: 12px;
  color: #888;
}

.quantity-input {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 40px;
}

.purchase {
  margin-top: 0px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  /* position: absolute; */
  bottom: 60px;
}

.purchase-btn {
  border-radius: 12px 0 0 12px;
  width: 120px;
  text-align: center;
  padding: 5px;
  margin-left: 10px;
  border: 1px solid rgb(255, 119, 0);
  cursor: pointer;
  background: linear-gradient(90deg, rgb(255, 119, 0), rgb(255, 73, 0));
}

.purchase-btn-2 {
  border-radius: 0 12px 12px 0;
  width: 120px;
  text-align: center;
  padding: 5px;
  border: 1px solid rgb(255, 203, 0);
  cursor: pointer;
  background: linear-gradient(90deg, rgb(255, 203, 0), rgb(255, 148, 2));
}

.purchase-btn-group {
  display: flex;
  gap: 0px;
}

.footer {
  position: absolute;
  bottom: 80px;
  padding: 10px;
  border-radius: 12px;
  background: rgb(248, 249, 252);
  /* 背景透明度 */
}
</style>
