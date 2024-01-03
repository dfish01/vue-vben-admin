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
            :rows="2"
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
            :rows="2"
          />
        </a-form-item>
        <!-- <div style="display: flex; justify-content: right">
        <a-button type="primary" @click="onSubmit">保存</a-button>
      </div> -->
      </a-card>

      <a-card title="Midjourney任务配置" style="margin-top: 10px">
        <a-form-item
          label="任务超时时间"
          :name="['mjTaskConfig', 'taskTimeoutMinus']"
          :rules="[{ required: false, message: '请输入任务超时时间（分钟）' }]"
        >
          <a-input
            v-model:value="mjConfigForm.mjTaskConfig.taskTimeoutMinus"
            placeholder="请输入任务超时时间（分钟）"
          />
        </a-form-item>
        <a-form-item
          label="敏感词校验"
          :name="['mjTaskConfig', 'enableBanCheck']"
          :rules="[{ required: false, message: '启用敏感词校验' }]"
        >
          <a-switch
            v-model:checked="mjConfigForm.mjTaskConfig.enableBanCheck"
            checked-children="开启"
            un-checked-children="关闭"
          />
        </a-form-item>
        <a-form-item
          label="中文翻译敏感词校验"
          :name="['mjTaskConfig', 'chineseBanCheck']"
          :rules="[{ required: false, message: '启用中文翻译英文敏感词校验' }]"
        >
          <a-switch
            disabled
            v-model:checked="mjConfigForm.mjTaskConfig.chineseBanCheck"
            checked-children="开启"
            un-checked-children="关闭"
          />
          <span style="margin-left: 10px; color: red; font-size: 10px">默认开启，暂时无法编辑</span>
        </a-form-item>
        <a-form-item
          label="参数合法性校验"
          :name="['mjTaskConfig', 'enableParamCheck']"
          :rules="[{ required: false, message: '启用参数合法性校验' }]"
        >
          <a-switch
            v-model:checked="mjConfigForm.mjTaskConfig.enableParamCheck"
            checked-children="开启"
            un-checked-children="关闭"
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
      </a-card>

      <a-card title="Midjourneye额度相关配置" style="margin-top: 10px">
        <a-form-item
          label="导入额度"
          :name="['mjQuotaConfig', 'discordImportLimit']"
          :rules="[{ required: true, message: '请输入Discord导入额度限制' }]"
        >
          <a-input
            v-model:value="mjConfigForm.mjQuotaConfig.discordImportLimit"
            placeholder="请输入Discord导入额度限制"
          />
        </a-form-item>
        <a-form-item
          label="账户组账号唯一"
          :name="['mjQuotaConfig', 'discordGroupUnique']"
          :rules="[{ required: false, message: '请选择账户组账号唯一' }]"
        >
          <a-switch
            v-model:checked="mjConfigForm.mjQuotaConfig.discordGroupUnique"
            checked-children="开启"
            un-checked-children="关闭"
          />
        </a-form-item>
        <a-form-item
          label="帐户组队列数上限"
          :name="['mjQuotaConfig', 'taskQueueLimit']"
          :rules="[{ required: true, message: '请输入帐户组队列数上限' }]"
        >
          <a-input
            v-model:value="mjConfigForm.mjQuotaConfig.taskQueueLimit"
            placeholder="请输入帐户组队列数上限"
          />
        </a-form-item>
        <a-form-item
          label="默认discord账号"
          :name="['mjQuotaConfig', 'defaultDiscordId']"
          :rules="[{ required: true, message: '请输入默认discord账号ID' }]"
        >
          <a-input
            v-model:value="mjConfigForm.mjQuotaConfig.defaultDiscordId"
            placeholder="请输入默认discord账号ID"
          />
          <span style="color: red; font-size: 10px"
            >用于同步discord的相关任务ID，不设置则随机选取可用账号</span
          >
        </a-form-item>
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
    midjourneyBan: null,
    proxyConfig: {
      promptImageProxy: null,
      discordImageProxy: null,
    },
    mjTaskConfig: {
      taskTimeoutMinus: 20,
      enableBanCheck: true,
      chineseBanCheck: true,
      enableParamCheck: true,
    },
    mjQuotaConfig: {
      discordImportLimit: 500,
      defaultDiscordId: null,
      discordGroupUnique: false,
      taskQueueLimit: 50,
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
