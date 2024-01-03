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
              <a href="https://image.dooo.ng/upload" target="_blank">免费图床1</a>
              <a href="https://tuchuang.wvv.free.hr/" target="_blank">免费图床2</a>
              <a href="https://png.cm/" target="_blank">免费图床3</a>
              <a href="https://img.ax/" target="_blank">免费图床4</a>
              <a href="https://www.locimg.com/" target="_blank">免费图床5</a>
            </a-space>
          </span>
        </a-form-item>

        <a-form-item
          label="群信息"
          name="groupInfo"
          :rules="[{ required: false, message: '请输入群信息' }]"
        >
          <MarkDown v-model:value="activityInfoConfigForm.groupInfo" placeholder="请输入群信息" />
        </a-form-item>
        <a-form-item
          label="售后信息"
          name="afterSaleInfo"
          :rules="[{ required: false, message: '请输入售后信息' }]"
        >
          <MarkDown
            v-model:value="activityInfoConfigForm.afterSaleInfo"
            placeholder="请输入售后信息"
          />
        </a-form-item>
        <a-form-item
          label="教程内容"
          name="tutorialInfo"
          :rules="[{ required: true, message: '请输入教程内容' }]"
        >
          <MarkDown
            v-model:value="activityInfoConfigForm.tutorialInfo"
            placeholder="请输入教程内容"
          />
        </a-form-item>
        <a-form-item
          label="系统活动"
          name="activityNotice"
          :rules="[{ required: false, message: '请输入系统活动内容' }]"
        >
          <MarkDown
            v-model:value="activityInfoConfigForm.activityNotice"
            placeholder="请输入系统活动内容"
          />
          <!-- <a-textarea
          v-model:value="activityInfoConfigForm.systemNotice"
          placeholder="请输入系统公告"
          :rows="8"
        /> -->
        </a-form-item>

        <a-form-item
          label="系统公告"
          name="systemNotice"
          :rules="[{ required: true, message: '请输入系统公告' }]"
        >
          <MarkDown
            v-model:value="activityInfoConfigForm.systemNotice"
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
  import { SystemConfig } from '/@/api/df/model/systemModel';
  import { saveSystemConfig, systemConfigInfo } from '/@/api/df/system';
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

  const activityInfoConfigForm: SystemConfig = ref({
    groupInfo: null,
    afterSaleInfo: null,
    tutorialInfo: null,
    systemNotice: null,
    activityNotice: null,
  });
  onMounted(async () => {
    loadData();
    console.log(activityInfoConfigForm.value);
  });

  const loadData = async () => {
    loadingForm.globalLoading = true;
    try {
      const data = await systemConfigInfo();
      activityInfoConfigForm.value = data;
    } finally {
      loadingForm.globalLoading = false;
    }
  };

  const onSubmit = async () => {
    loadingForm.globalLoading = true;
    try {
      await activityInfoConfigFormRef.value.validate();
      await saveSystemConfig(activityInfoConfigForm.value);
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
