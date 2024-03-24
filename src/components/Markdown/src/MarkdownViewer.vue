<template>
  <Loading :loading="markDownloading" :absolute="true" tip="内容加载中..." />
  <div ref="viewerRef" id="markdownViewer" :class="$props.class"></div>
</template>

<script lang="ts" setup>
  import { onBeforeUnmount, onDeactivated, Ref, ref, unref, watch, nextTick } from 'vue';
  import VditorPreview from 'vditor/dist/method.min';
  import { onMountedOrActivated } from '@vben/hooks';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { getTheme } from './getTheme';
  import { Loading } from '/@/components/Loading';

  const props = defineProps({
    value: { type: String },
    class: { type: String },
  });
  const viewerRef = ref(null);
  const vditorPreviewRef = ref(null) as Ref<VditorPreview | null>;
  const { getDarkMode } = useRootSetting();
  const markDownloading = ref(false);
  function init() {
    markDownloading.value = true;
    const viewerEl = unref(viewerRef);
    vditorPreviewRef.value = VditorPreview.preview(viewerEl, props.value, {
      mode: getTheme(getDarkMode.value, 'content'),
      theme: {
        // 设置内容主题
        current: getTheme(getDarkMode.value, 'content'),
      },
      hljs: {
        // 设置代码块主题
        style: getTheme(getDarkMode.value, 'code'),
      },
      cdn: 'https://vditor-cdn.midjourneyers.cn',
      after: () => {
        markDownloading.value = false;
      },
    });
  }
  watch(
    () => getDarkMode.value,
    (val) => {
      VditorPreview.setContentTheme(getTheme(val, 'content'));
      VditorPreview.setCodeTheme(getTheme(val, 'code'));
      init();
    },
  );

  watch(
    () => props.value,
    (v, oldValue) => {
      v !== oldValue && init();
    },
  );

  function destroy() {
    const vditorInstance = unref(vditorPreviewRef);
    if (!vditorInstance) return;
    try {
      vditorInstance?.destroy?.();
    } catch (error) {
      //
    }
    vditorPreviewRef.value = null;
  }

  onMountedOrActivated(init);

  onBeforeUnmount(destroy);
  onDeactivated(destroy);
</script>
