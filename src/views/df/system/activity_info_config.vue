<template>
  <div>
    <Loading :absolute="false" :loading="loadingForm.globalLoading" :tip="loadingForm.tips" />
    <a-form
      ref="activityInfoConfigFormRef"
      :model="activityInfoConfigForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :style="{ height: `calc(${contentHeight - 83.5}px)`, 'overflow-y': 'auto' }"
    >
      <a-card title="活动信息配置">
        <a-form-item label="">
          <span style="display: flex; justify-content: center; font-size: 12px">
            <a-space>
              <a ref="https://image.dooo.ng/upload" target="_blank">免费图床1</a>
              <a ref="https://tuchuang.wvv.free.hr/" target="_blank">免费图床2</a>
              <a ref="https://png.cm/" target="_blank">免费图床3</a>
              <a ref="https://img.ax/" target="_blank">免费图床4</a>
              <a ref="https://www.locimg.com/" target="_blank">免费图床5</a>
            </a-space>
          </span>
        </a-form-item>

        <a-form-item
          label="群图片链接"
          :name="['communicateInfo', 'wchatImage']"
          :rules="[{ required: true, message: '请输入群图片链接' }]"
        >
          <a-input
            v-model:value="activityInfoConfigForm.communicateInfo.wchatImage"
            placeholder="请输入群图片链接"
          />
        </a-form-item>
        <a-form-item
          label="QQ群号"
          :name="['communicateInfo', 'qqGroupList']"
          :rules="[{ required: false, message: '请输入QQ群号' }]"
        >
          <a-input
            v-model:value="activityInfoConfigForm.communicateInfo.qqGroupList"
            placeholder="请输入QQ群号,多个“,”隔开"
          />
        </a-form-item>
        <a-form-item
          label="教程地址"
          name="tutorialInfo"
          :rules="[{ required: true, message: '请输入教程地址' }]"
        >
          <a-input
            v-model:value="activityInfoConfigForm.tutorialInfo"
            placeholder="请输入教程地址"
          />
        </a-form-item>
        <a-form-item
          label="系统公告"
          name="systemNotice"
          :rules="[{ required: true, message: '请输入系统公告' }]"
        >
          <MarkDown
            v-model:value="activityInfoConfigForm.systemNotice"
            @change="handleChange"
            placeholder="请输入公告内容"
          />
          <!-- <a-textarea
          v-model:value="activityInfoConfigForm.systemNotice"
          placeholder="请输入系统公告"
          :rows="8"
        /> -->
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
  import { MarkDown, MarkDownActionType, MarkdownViewer } from '/@/components/Markdown';
  import {
    ActivityInfoConfig,
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
  import { Loading } from '/@/components/Loading';

  const { loadingForm } = loadingFormApi();
  const props = defineProps({
    contentHeight: { type: Number, default: 300 },
    scrollable: { type: Boolean, default: true },
  });

  const labelCol = { span: 5 };
  const wrapperCol = { span: 13 };
  const activityInfoConfigFormRef = ref();

  const activityInfoConfigForm: ActivityInfoConfig = ref({
    communicateInfo: {
      wchatImage: '',
      qqGroupList: '',
    },
    tutorialInfo: null,
    systemNotice: null,
  });
  onMounted(async () => {
    loadData();
    console.log(activityInfoConfigForm.value);
  });

  const loadData = async () => {
    loadingForm.globalLoading = true;
    try {
      const data = await activityConfigInfo();
      activityInfoConfigForm.value = data;
    } finally {
      loadingForm.globalLoading = false;
    }
  };

  const onSubmit = async () => {
    loadingForm.globalLoading = true;
    try {
      await activityInfoConfigFormRef.value.validate();
      await saveActivityConfig(activityInfoConfigForm.value);
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
