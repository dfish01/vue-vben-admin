<template>
  <div>
    <Loading :absolute="false" :loading="loadingForm.globalLoading" :tip="loadingForm.tips" />
    <a-form
      ref="pandoraFormRef"
      :model="extendConfigForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :style="{ height: `calc(${contentHeight - 83.5}px)`, 'overflow-y': 'auto' }"
    >
      <a-card title="邮箱配置">
        <a-form-item
          label="发信服务器"
          :name="['mailConfig', 'host']"
          :rules="[{ required: true, message: '请输入发信服务器' }]"
        >
          <a-input
            v-model:value="extendConfigForm.mailConfig.host"
            placeholder="请输入发信服务器"
          />
        </a-form-item>
        <a-form-item
          label="发信端口"
          :name="['mailConfig', 'port']"
          :rules="[{ required: true, message: '请输入发信端口' }]"
        >
          <a-input v-model:value="extendConfigForm.mailConfig.port" placeholder="请输入发信端口" />
        </a-form-item>
        <a-form-item
          label="启用TLS"
          :name="['mailConfig', 'enableStartTLS']"
          :rules="[{ required: true, message: '请选择是否启用TLS' }]"
        >
          <a-switch
            v-model:checked="extendConfigForm.mailConfig.enableStartTLS"
            checked-children="开启"
            un-checked-children="关闭"
          />
          <span style="margin-left: 10px; color: red; font-size: 13px">默认开启就好</span>
        </a-form-item>
        <a-form-item
          label="账号"
          :name="['mailConfig', 'username']"
          :rules="[{ required: true, message: '请输入发信账号' }]"
        >
          <a-input
            v-model:value="extendConfigForm.mailConfig.username"
            placeholder="请输入发信账号"
          />
        </a-form-item>
        <a-form-item
          label="发信人名称"
          :name="['mailConfig', 'alias']"
          :rules="[{ required: true, message: '请输入发信人名称' }]"
        >
          <a-input
            v-model:value="extendConfigForm.mailConfig.alias"
            placeholder="请输入发信人名称"
          />
        </a-form-item>
        <a-form-item
          label="密码"
          :name="['mailConfig', 'password']"
          :rules="[{ required: true, message: '请输入发信密码' }]"
        >
          <a-input-password
            v-model:value="extendConfigForm.mailConfig.password"
            placeholder="请输入发信密码"
          />
        </a-form-item>
      </a-card>
      <a-card title="百度翻译配置">
        <a-form-item
          label="appid"
          :name="['translateConfig', 'appid']"
          :rules="[{ required: true, message: '请输入appId' }]"
        >
          <a-input
            v-model:value="extendConfigForm.translateConfig.appid"
            placeholder="请输入appId"
          />
        </a-form-item>
        <a-form-item
          label="appSecret"
          :name="['translateConfig', 'appSecret']"
          :rules="[{ required: true, message: '请输入appSecret' }]"
        >
          <a-input
            v-model:value="extendConfigForm.translateConfig.appSecret"
            placeholder="请输入appSecret"
          />
        </a-form-item>
      </a-card>
      <a-card title="pandora配置" style="margin-top: 10px">
        <a-form-item
          label="HOST地址"
          :name="['pandoraConfig', 'host']"
          :rules="[{ required: true, message: '请输入Host' }]"
        >
          <a-input v-model:value="extendConfigForm.pandoraConfig.host" placeholder="请输入Host" />
        </a-form-item>
        <a-form-item
          label="API前缀"
          :name="['pandoraConfig', 'apiPrefix']"
          :rules="[{ required: true, message: '请输入API前缀' }]"
        >
          <a-input
            v-model:value="extendConfigForm.pandoraConfig.apiPrefix"
            placeholder="请输入API前缀"
          />
        </a-form-item>
        <a-form-item
          label="PoolToken"
          :name="['pandoraConfig', 'poolToken']"
          :rules="[{ required: true, message: '请输入PoolToken' }]"
        >
          <a-textarea
            v-model:value="extendConfigForm.pandoraConfig.poolToken"
            placeholder="请输入PoolToken"
            :rows="3"
          />
        </a-form-item>

        <a-form-item label="自动刷新" name="autoRefresh">
          <a-switch
            v-model:checked="extendConfigForm.pandoraConfig.autoRefresh"
            checked-children="开启"
            un-checked-children="关闭"
          />
          <span style="margin-left: 10px; color: red; font-size: 13px">预留使用，待研发</span>
        </a-form-item>

        <div v-if="extendConfigForm.pandoraConfig.autoRefresh === true">
          <a-form-item label="OPEN AI账号名" name="accountName">
            <a-input
              v-model:value="extendConfigForm.pandoraConfig.accountName"
              placeholder="请输入账号名"
            />
          </a-form-item>

          <a-form-item label="OPEN AI密码" name="password">
            <a-input-password
              v-model:value="extendConfigForm.pandoraConfig.password"
              placeholder="请输入账号密码"
            />
          </a-form-item>
        </div>
      </a-card>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, toRaw, defineProps, watch, defineExpose } from 'vue';
  import type { UnwrapRef } from 'vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { Loading } from '/@/components/Loading';
  import {
    ActivityInfoConfigReq,
    ActivityInfoConfigResp,
    ExtendConfigResp,
    ExtendConfig,
    MjConfigReq,
    MjConfigResp,
  } from '/@/api/df/model/systemModel';
  import {
    saveExtendConfig,
    extendConfigInfo,
    saveMjConfig,
    mjConfigInfo,
    saveActivityConfig,
    activityConfigInfo,
  } from '/@/api/df/system';
  import { loadingFormApi } from './system';

  const { loadingForm } = loadingFormApi();
  const props = defineProps({
    contentHeight: { type: Number, default: 300 },
    scrollable: { type: Boolean, default: true },
  });

  const labelCol = { span: 5 };
  const wrapperCol = { span: 13 };
  const pandoraFormRef = ref();

  const extendConfigForm: ExtendConfig = ref({
    mailConfig: {
      host: null,
      port: null,
      username: null,
      password: null,
      enableStartTLS: true,
      alias: null,
    },
    translateConfig: {
      appid: '',
      appSecret: '',
    },
    pandoraConfig: {
      host: '',
      poolToken: '',
      accountName: '',
      password: '',
      apiPrefix: '',
      autoRefresh: false,
      expireTime: '',
    },
  });
  onMounted(async () => {
    loadData();
    console.log(extendConfigForm.value);
  });

  const loadData = async () => {
    loadingForm.globalLoading = true;
    try {
      const data = await extendConfigInfo();
      extendConfigForm.value = data;
    } finally {
      loadingForm.globalLoading = false;
    }
  };

  const onSubmit = async () => {
    loadingForm.globalLoading = true;
    try {
      await pandoraFormRef.value.validate();
      await saveExtendConfig(extendConfigForm.value);
      console.log('values', extendConfigForm, toRaw(extendConfigForm));
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
