import { SvgIcon } from '/@/components/Icon';

import {
  ref,
  onUnmounted,
  onBeforeUnmount,
  computed,
  unref,
  toRefs,
  reactive,
  watch,
  defineProps,
  defineExpose,
} from 'vue';

let loadingFormApiInstance: any | null = null;

export const loadingRef = ref(false);

//查询相关API
export function loadingFormApi() {
  if (loadingFormApiInstance) {
    return loadingFormApiInstance;
  }
  const loadingForm = reactive({
    globalLoading: false,
    absolute: true,
    tips: '加载中...',
  });

  const api = {
    loadingForm,
  };
  loadingFormApiInstance = api;
  return api;
}
