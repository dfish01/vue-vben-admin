<template>
  <a-form
    ref="pandoraFormRef"
    :model="extendConfigForm"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item label="百度翻译" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-item label="appid" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <a-input v-model:value="extendConfigForm.translateConfigReq.appid" />
      </a-form-item>
      <a-form-item label="appSecret" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <a-input v-model:value="extendConfigForm.translateConfigReq.appSecret" />
      </a-form-item>
    </a-form-item>

    <a-form-item label="pandora配置" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-item ref="name" label="HOST地址" name="host">
        <a-input v-model:value="extendConfigForm.pandoraConfigReq.host">
          <template #addonBefore>
            <a-select style="width: 90px">
              <a-select-option value="Http://">Http://</a-select-option>
              <a-select-option value="Https://" selected>Https://</a-select-option>
            </a-select>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="API前缀" name="apiPrefix">
        <a-input
          v-model:value="extendConfigForm.pandoraConfigReq.apiPrefix"
          placeholder="请输入API前缀"
        />
      </a-form-item>
      <a-form-item label="PoolToken" name="poolToken">
        <a-textarea
          v-model:value="extendConfigForm.pandoraConfigReq.poolToken"
          placeholder="请输入PoolToken"
          :rows="3"
        />
      </a-form-item>

      <a-form-item label="自动刷新" name="enableAutoRefresh">
        <a-switch
          v-model:checked="extendConfigForm.pandoraConfigReq.enableAutoRefresh"
          checked-children="开启"
          un-checked-children="关闭"
        />
      </a-form-item>

      <div v-if="extendConfigForm.enableAutoRefresh === true">
        <a-form-item label="账号名" name="accountName">
          <a-input
            v-model:value="extendConfigForm.pandoraConfigReq.accountName"
            placeholder="请输入账号名"
          />
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input-password
            v-model:value="extendConfigForm.pandoraConfigReq.password"
            placeholder="请输入账号密码"
          />
        </a-form-item>
      </div>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">保存</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
  import { reactive, ref, toRaw } from 'vue';
  import type { UnwrapRef } from 'vue';
  import type { Rule } from 'ant-design-vue/es/form';

  import {
    ActivityInfoConfigReq,
    ActivityInfoConfigResp,
    ExtendConfigResp,
    ExtendConfigReq,
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

  const labelCol = { span: 5 };
  const wrapperCol = { span: 13 };
  const pandoraFormRef = ref();

  const rules: Record<string, Rule[]> = {
    'pandoraConfigReq.host': [{ required: true, message: '请输入Pandora地址', trigger: 'change' }],
    'pandoraConfigReq.poolToken': [
      { required: true, message: '请输入初始的PoolToken', trigger: 'change' },
    ],
    'pandoraConfigReq.apiPrefix': [
      { required: true, message: '请输入Pandora Api前缀', trigger: 'change' },
    ],
    'pandoraConfigReq.accountName': [
      { required: true, message: '请输入OpenAi账号', trigger: 'change' },
    ],
    'pandoraConfigReq.password': [
      { required: true, message: '请输入OpenAi密码', trigger: 'change' },
    ],
  };

  const extendConfigForm: ExtendConfigReq = reactive({
    translateConfigReq: {
      appid: '',
      appSecret: '',
    },
    pandoraConfigReq: {
      host: '',
      poolToken: '',
      accountName: '',
      password: '',
      apiPrefix: '',
      autoRefresh: false,
      expireTime: '',
    },
    discordImageProxyList: [],
    promptProxyList: [],
  });

  const onSubmit = () => {
    pandoraFormRef.value
      .validate()
      .then(() => {
        console.log('values', extendConfigForm, toRaw(extendConfigForm));
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
</script>
