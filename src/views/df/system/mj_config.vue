<template>
  <div>
    <Loading :absolute="false" :loading="loadingForm.globalLoading" :tip="loadingForm.tips" />
    <a-form
      ref="mjConfigFormRef"
      :model="mjConfigForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :style="{ height: `calc(${contentHeight - 83.5}px)`, 'overflow-y': 'auto' }"
    >
      <a-card title="代理配置" style="margin-top: 10px">
        <a-form-item
          label="Discord图片代理"
          :name="['proxyConfig', 'discordImageProxy']"
          :rules="[{ required: true, message: '请输入Discord图片代理' }]"
        >
          <a-textarea
            v-model:value="mjConfigForm.proxyConfig.discordImageProxy"
            placeholder="请输入Discord图片代理,多个使用“,”隔开"
            :rows="4"
          />
        </a-form-item>

        <a-form-item
          label="Prompt图片代理"
          :name="['proxyConfig', 'promptImageProxy']"
          :rules="[{ required: false, message: '请输入Prompt图片代理' }]"
        >
          <a-textarea
            v-model:value="mjConfigForm.proxyConfig.promptImageProxy"
            placeholder="请输入Discord图片代理,多个使用“,”隔开"
            :rows="4"
          />
        </a-form-item>
        <!-- <div style="display: flex; justify-content: right">
        <a-button type="primary" @click="onSubmit">保存</a-button>
      </div> -->
      </a-card>

      <a-card title="Midjourney使用限制">
        <a-form-item
          label="导入额度"
          name="discordImportLimit"
          :rules="[{ required: true, message: '请输入Discord导入额度限制' }]"
        >
          <a-input
            v-model:value="mjConfigForm.discordImportLimit"
            placeholder="请输入Discord导入额度限制"
          />
        </a-form-item>
        <a-form-item
          label="默认discord账号"
          name="defaultDiscordId"
          :rules="[{ required: true, message: '请输入默认discord账号ID' }]"
        >
          <a-input
            v-model:value="mjConfigForm.defaultDiscordId"
            placeholder="请输入默认discord账号ID"
          />
        </a-form-item>
        <a-form-item
          label="敏感词"
          name="midjourneyBan"
          :rules="[{ required: true, message: '请输入PoolToken' }]"
        >
          <a-textarea
            v-model:value="mjConfigForm.midjourneyBan"
            placeholder="请输入敏感词，多个用“,”隔开。如，AAA,BBB,CCC"
            :rows="10"
          />
        </a-form-item>

        <!-- <div style="display: flex; justify-content: right">
        <a-button type="primary" @click="onSubmit">保存</a-button>
      </div> -->
      </a-card>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, toRaw } from 'vue';
  import type { UnwrapRef } from 'vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { loadingFormApi } from './system';
  import {
    ActivityInfoConfigReq,
    ActivityInfoConfigResp,
    ExtendConfigResp,
    ExtendConfig,
    MjConfig,
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
  import { Loading } from '/@/components/Loading';

  const { loadingForm } = loadingFormApi();

  const props = defineProps({
    contentHeight: { type: Number, default: 300 },
    scrollable: { type: Boolean, default: true },
  });

  const labelCol = { span: 5 };
  const wrapperCol = { span: 13 };
  const mjConfigFormRef = ref();

  const mjConfigForm: MjConfig = ref({
    discordImportLimit: null,
    defaultDiscordId: null,
    midjourneyBan: null,
    proxyConfig: {
      promptImageProxy: null,
      discordImageProxy: null,
    },
  });
  onMounted(async () => {
    loadData();
  });

  const loadData = async () => {
    loadingForm.globalLoading = true;
    try {
      const data = await mjConfigInfo();
      mjConfigForm.value = data;
    } finally {
      loadingForm.globalLoading = false;
    }
  };

  const onSubmit = async () => {
    loadingForm.globalLoading = true;
    try {
      await mjConfigFormRef.value.validate();
      await saveMjConfig(mjConfigForm.value);
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
