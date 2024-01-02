<template>
  <a-layout ref="formRef">
    <a-card :bodyStyle="{ padding: 0, height: '50px' }">
      <a-row
        ref="formRef"
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 50px;
          padding: 0 10px;
        "
      >
        <div style="display: flex; align-items: center">
          <a-image src="/logo.png" :width="38" :height="38" :preview="false" />
          <span style="margin-left: 5px; font-size: 16px; font-weight: bold"> AI对话 </span>
        </div>
        <div style="display: flex; gap: 5px"> </div>
      </a-row>
    </a-card>

    <div :style="{ height: `calc(${contentHeight}px `, width: '100%', padding: 0 }">
      <iframe
        src="https://chat.gfish.top"
        :style="{ height: '100%', width: '100%', padding: 0 }"
      ></iframe>
    </div>
  </a-layout>
</template>

<script lang="ts" setup>
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { ref, onMounted, onUnmounted, reactive, computed, unref } from 'vue';
  import Icon from '/@/components/Icon/Icon.vue';

  /** 页面高度计算开始 */
  const formRef = ref();
  //页面高度处理
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 1);
  //移动设备底部导航栏
  const offsetHeightRef = ref(95);
  const subtractHeightRefs = ref([]);

  // 使用hook
  const { contentHeight, redoHeight } = useContentHeight(
    computed(() => true),
    formRef,
    unref(subtractHeightRefs), // 使用 unref 获取数组值
    unref(substractSpaceRefs),
    upwardSpace,
    offsetHeightRef,
  );
</script>

<style scoped>
  .search-card {
    display: flex;
    align-items: center;
    height: 45px;
    border-radius: 4px;
  }
</style>
