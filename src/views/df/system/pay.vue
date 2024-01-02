<template>
  <div>
    <Loading :absolute="false" :loading="loadingForm.globalLoading" :tip="loadingForm.tips" />
    <a-form
      ref="payConfigFormRef"
      :model="payConfigForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :style="{ height: `calc(${contentHeight - 83.5}px)`, 'overflow-y': 'auto' }"
    >
      <a-card title="支付宝当面付配置">
        <a-form-item
          label="商户ID"
          :name="['aliFace2FaceConfig', 'appId']"
          :rules="[{ required: true, message: '请输入商户ID' }]"
        >
          <a-input
            v-model:value="payConfigForm.aliFace2FaceConfig.appId"
            placeholder="请输入商户ID"
          />
        </a-form-item>

        <a-form-item
          label="商户KEY"
          :name="['aliFace2FaceConfig', 'alipayPublicKey']"
          :rules="[{ required: true, message: '请输入商户KEY' }]"
        >
          <a-textarea
            v-model:value="payConfigForm.aliFace2FaceConfig.alipayPublicKey"
            placeholder="请输入商户KEY"
            :rows="4"
          />
        </a-form-item>
        <a-form-item
          label="商户密钥"
          :name="['aliFace2FaceConfig', 'privateKey']"
          :rules="[{ required: true, message: '请输入商户密钥' }]"
        >
          <a-textarea
            v-model:value="payConfigForm.aliFace2FaceConfig.privateKey"
            placeholder="请输入商户密钥"
            :rows="8"
          />
        </a-form-item>

        <a-form-item
          label="支付回调接口"
          :name="['aliFace2FaceConfig', 'notifyUrl']"
          :rules="[{ required: true, message: '请输入支付回调接口' }]"
        >
          <a-input
            v-model:value="payConfigForm.aliFace2FaceConfig.notifyUrl"
            placeholder="支付回调接口"
          />
        </a-form-item>
      </a-card>
      <a-card title="费率配置">
        <a-form-item
          label="用户自定义支付"
          :name="['rateConfig', 'userPayRate']"
          :rules="[{ required: true, message: '请输入用户支付费率' }]"
        >
          <a-switch
            v-model:checked="payConfigForm.rateConfig.enableCustomPay"
            checked-children="开启"
            un-checked-children="关闭"
          />
          <span style="margin-left: 10px; color: red; font-size: 13px"
            >开启后支持用户自己配置当面付</span
          >
        </a-form-item>
        <a-form-item
          label="用户支付费率"
          :name="['rateConfig', 'userPayRate']"
          :rules="[{ required: true, message: '请输入用户支付费率' }]"
        >
          <a-input-number
            v-model:value="payConfigForm.rateConfig.userPayRate"
            :min="0"
            :max="100"
            :formatter="(value) => `${value}%`"
            :parser="(value) => value.replace('%', '')"
          />
          <span style="color: red; font-size: 10px">(比如2%，100元收取2元用户手续费)</span>
        </a-form-item>
      </a-card>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, toRaw, defineProps, watch, defineExpose } from 'vue';
  import type { UnwrapRef } from 'vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { Loading } from '/@/components/Loading';
  import { PayConfig } from '/@/api/df/model/systemModel';
  import { savePayConfig, payConfigInfo } from '/@/api/df/system';
  import { loadingFormApi } from './system';

  const { loadingForm } = loadingFormApi();
  const props = defineProps({
    contentHeight: { type: Number, default: 300 },
    scrollable: { type: Boolean, default: true },
  });

  const labelCol = { span: 5 };
  const wrapperCol = { span: 13 };
  const payConfigFormRef = ref();

  const payConfigForm: PayConfig = ref({
    aliFace2FaceConfig: {
      alipayPublicKey: null,
      privateKey: null,
      appId: null,
      notifyUrl: null,
    },
    rateConfig: {
      userPayRate: '',
      enableCustomPay: false,
    },
  });
  onMounted(async () => {
    loadData();
    console.log(payConfigForm.value);
  });

  const loadData = async () => {
    loadingForm.globalLoading = true;
    try {
      const data = await payConfigInfo();
      payConfigForm.value = data;
    } finally {
      loadingForm.globalLoading = false;
    }
  };

  const onSubmit = async () => {
    loadingForm.globalLoading = true;
    try {
      await payConfigFormRef.value.validate();
      await savePayConfig(payConfigForm.value);
      console.log('values', payConfigForm, toRaw(payConfigForm));
    } catch (error) {
      console.error('error', error);
    } finally {
      loadingForm.globalLoading = false;
    }
  };

  defineExpose({
    onSubmit,
    loadData,
  });
</script>
