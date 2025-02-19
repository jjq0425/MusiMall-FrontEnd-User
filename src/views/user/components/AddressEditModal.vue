<template>
  <a-modal
    v-model:visible="visible"
    :title="editType == 'add' ? '新增地址' : '编辑地址'"
    @ok="handleOk"
    :width="750"
  >
    <a-form
      :model="address"
      :rules="rules"
      ref="addressFormRef"
      label-col="{ span: 4 }"
      wrapper-col="{ span: 20 }"
    >
      <a-form-item label="收件人联系方式" field="receiverName">
        <a-input v-model="address.receiverName" />
      </a-form-item>
      <a-form-item label="收件人电话" field="receiverPhone">
        <a-input v-model="address.receiverPhone" />
      </a-form-item>
      <a-form-item label="省-市-区" field="fullAddress">
        <a-input-search
          v-model="fullAddress"
          readonly
          search-button
          @search="showPickerRef = true"
        >
          <template #button-icon>
            <SvgIcon name="addressWhite" size="13px" />
          </template>
          <template #button-default>
            {{ editType == "add" ? "点击选择" : "点击修改" }}
          </template>
        </a-input-search>
      </a-form-item>
      <a-form-item v-if="showPickerRef">
        <vue-next-address-picker
          :visible="showPickerRef"
          @choice="choiceAddress"
          :pickerLevel="3"
        />
      </a-form-item>
      <a-form-item label="详细地址" field="detailAddress">
        <a-textarea v-model="address.detailAddress" />
      </a-form-item>
      <a-form-item label="邮编" field="postCode">
        <a-input v-model="address.postCode" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, reactive, defineExpose, computed } from "vue";
import VueNextAddressPicker from "vue-next-address-picker";
import SvgIcon from "@/components/SvgIcon.vue";
import { Message } from "@arco-design/web-vue";

const visible = ref(false);
const editType = ref("add");
const showPickerRef = ref(false);
const addressFormRef = ref(null);
const address = reactive({
  id: "",
  receiverName: "",
  receiverPhone: "",
  detailAddress: "",
  postCode: "",
  province: "",
  provinceId: "",
  city: "",
  cityId: "",
  district: "",
  districtId: "",
  postCode: "",
});

const fullAddress = computed(() => {
  if (address.province && address.city && address.district)
    return `${address.province} / ${address.city} / ${address.district}`;
  else return "请选择省市区";
});

const validateAddress = (value, callback) => {
  if (!address.province || !address.city || !address.district) {
    callback(new Error("请选择省市区"));
  } else {
    callback();
  }
};

const rules = {
  receiverName: [
    { required: true, message: "请输入收件人姓名", trigger: "blur" },
  ],
  receiverPhone: [
    { required: true, message: "请输入收件人电话", trigger: "blur" },
  ],
  fullAddress: [
    { required: true, validator: validateAddress, trigger: "change" },
  ],
  detailAddress: [
    { required: true, message: "请输入详细地址", trigger: "blur" },
  ],
  postCode: [{ required: true, message: "请输入邮编", trigger: "blur" }],
};

const showModal = (addr = null) => {
  if (addr) {
    editType.value = "edit";
    Object.assign(address, addr);
  } else {
    editType.value = "add";
    Object.assign(address, {
      id: null,
      receiverName: "",
      receiverPhone: "",
      detailAddress: "",
      postCode: "",
      province: "",
      provinceId: "",
      city: "",
      cityId: "",
      district: "",
      districtId: "",
    });
  }
  visible.value = true;
};

const choiceAddress = (data) => {
  const { province, city, area } = data;
  address.province = province;
  address.city = city;
  address.district = area;
  address.provinceId = Math.floor(Math.random() * 1000000);
  address.cityId = Math.floor(Math.random() * 1000000);
  address.districtId = Math.floor(Math.random() * 1000000);
  showPickerRef.value = false;
};

const handleOk = () => {
  addressFormRef.value.validate((err) => {
    if (!err) {
      if (editType.value === "add") {
        insertAddress();
      } else {
        updateAddressApi();
      }
    } else {
      Message.warning("请填写完整信息");
      visible.value = true;
    }
  });
};

// API
import { addAddress, updateAddress } from "@/api/address";
import { defineEmits } from "vue";

const insertAddress = async () => {
  const res = await addAddress(address);
  if (res == 1) {
    Message.success("添加成功");
    visible.value = false;
    emits("needRefresh");
  } else {
    Message.error("添加失败");
  }
};

const updateAddressApi = async () => {
  const res = await updateAddress(address);
  if (res == 1) {
    Message.success("修改成功");
    visible.value = false;
    emits("needRefresh");
  } else {
    Message.error("修改失败");
  }
};

const emits = defineEmits(["needRefresh"]);

defineExpose({
  showModal,
});
</script>

<style scoped>
</style>
