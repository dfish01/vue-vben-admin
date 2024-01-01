<template>
  <a-layout loading-tip="加载中..." style="overflow: hidden">
    <a-card :bodyStyle="{ padding: '0px 20px 0px 20px' }">
      <!-- <a-card :bodyStyle="{ padding: '0px 20px 0px 20px', height: 'auto' }"> -->

      <a-tabs ref="formRef" v-model:activeKey="activeKey">
        <a-tab-pane key="1">
          <template #tab>
            <span>扩展功能</span>
          </template>
          <ExtendConfig
            :contentHeight="contentHeight"
            :scrollable="scrollableFlag"
            ref="extendConfigRef"
          />
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab>
            <span> MJ配置</span>
          </template>
          <MjConfig :contentHeight="contentHeight" :scrollable="scrollableFlag" ref="mjConfigRef" />
        </a-tab-pane>
        <a-tab-pane key="3">
          <template #tab>
            <span> 活动信息</span>
          </template>
          <ActivityInfoConfig
            :contentHeight="contentHeight"
            :scrollable="scrollableFlag"
            ref="activityInfoConfigRef"
          />
        </a-tab-pane>
      </a-tabs>
      <div style="display: flex; justify-content: right">
        <a-button class="bottom-button" @click="handleSubmit" type="primary" ref="buttonRef"
          >立即保存</a-button
        >
      </div>
    </a-card>
  </a-layout>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, toRaw, computed, unref } from 'vue';
  import type { UnwrapRef } from 'vue';
  import ExtendConfig from './extend_config.vue';
  import MjConfig from './mj_config.vue';
  import ActivityInfoConfig from './activity_info_config.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { Loading } from '/@/components/Loading';
  import { loadingFormApi } from './system';

  const { loadingForm } = loadingFormApi();

  /** 页面高度计算开始 */
  const scrollableFlag = ref(true);
  const formRef = ref();
  const buttonRef = ref();
  //页面高度处理
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 0);
  const offsetHeightRef = ref(0);
  const subtractHeightRefs = ref([buttonRef]);

  // const contentHeight = ref(400);
  // 使用hook
  const { contentHeight } = useContentHeight(
    computed(() => true),
    formRef,
    unref(subtractHeightRefs), // 使用 unref 获取数组值
    unref(substractSpaceRefs),
    upwardSpace,
    offsetHeightRef,
  );
  const activeKey = ref('1');
  const extendConfigRef = ref();
  const mjConfigRef = ref();
  const activityInfoConfigRef = ref();

  const handleSubmit = async () => {
    console.log(3324);
    loadingForm.globalLoading = true;
    loadingForm.tips = '正在提交数据...';
    try {
      // 在这里触发相应页面的 form 提交
      if (activeKey.value === '1') {
        await extendConfigRef.value?.onSubmit();
        // extendConfigRef.value?.loadData();
      } else if (activeKey.value === '2') {
        await mjConfigRef.value?.onSubmit();
        // mjConfigRef.value?.loadData();
      } else if (activeKey.value === '3') {
        await activityInfoConfigRef.value?.onSubmit();
        // activityInfoConfigRef.value?.loadData();
      }
      // loadingForm.value.tips = '正在加载数据...';
    } finally {
      loadingForm.tips = '加载中...';
      loadingForm.globalLoading = false;
    }
  };
</script>

<style scoped>
  .bottom-button {
    right: 8px;
    bottom: 0;

    /* background: #f0f0f0; */
    height: 32px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
