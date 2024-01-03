<template>
  <div>
    <Loading :absolute="false" :loading="loadingForm.globalLoading" :tip="loadingForm.tips" />
    <a-form
      ref="websiteConfigFormRef"
      :model="websiteConfigForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :style="{ height: `calc(${contentHeight - 83.5}px)`, 'overflow-y': 'auto' }"
    >
      <a-card title="站点信息配置">
        <a-form-item label="">
          <span style="display: flex; justify-content: center; font-size: 12px">
            <a-space>
              <a href="https://image.dooo.ng/upload" target="_blank">免费图床1</a>
              <a href="https://tuchuang.wvv.free.hr/" target="_blank">免费图床2</a>
              <a href="https://png.cm/" target="_blank">免费图床3</a>
              <a href="https://img.ax/" target="_blank">免费图床4</a>
              <a href="https://www.locimg.com/" target="_blank">免费图床5</a>
            </a-space>
          </span>
        </a-form-item>

        <a-form-item
          label="Footer（主页底部内容）"
          name="footer"
          :rules="[{ required: false, message: '请输入Footer内容' }]"
        >
          <a-textarea
            v-model:value="websiteConfigForm.footer"
            placeholder="请输入Footer内容"
            :rows="5"
          />
        </a-form-item>
      </a-card>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, toRaw } from 'vue';
  import type { UnwrapRef } from 'vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { MarkDown, MarkDownActionType, MarkdownViewer } from '/@/components/Markdown';
  import {
    ActivityInfoConfig,
    ActivityInfoConfigResp,
    ExtendConfigResp,
    ExtendConfig,
    MjConfigReq,
    MjConfigResp,
    WebsiteConfig,
  } from '/@/api/df/model/systemModel';
  import {
    saveExtendConfig,
    extendConfigInfo,
    saveMjConfig,
    mjConfigInfo,
    saveActivityConfig,
    activityConfigInfo,
    saveWebsiteConfig,
    websiteConfigInfo,
  } from '/@/api/df/system';
  import { loadingFormApi } from './system';
  import { Loading } from '/@/components/Loading';

  const { loadingForm } = loadingFormApi();
  const props = defineProps({
    contentHeight: { type: Number, default: 300 },
    scrollable: { type: Boolean, default: true },
  });

  const labelCol = { span: 5 };
  const wrapperCol = { span: 13 };
  const websiteConfigFormRef = ref();

  const websiteConfigForm: WebsiteConfig = ref({
    footer: null,
  });
  onMounted(async () => {
    loadData();
    console.log(websiteConfigForm.value);
  });

  const loadData = async () => {
    loadingForm.globalLoading = true;
    try {
      const data = await websiteConfigInfo();
      websiteConfigForm.value = data;
    } finally {
      loadingForm.globalLoading = false;
    }
  };

  const onSubmit = async () => {
    loadingForm.globalLoading = true;
    try {
      await websiteConfigFormRef.value.validate();
      await saveWebsiteConfig(websiteConfigForm.value);
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
