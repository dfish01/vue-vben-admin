import { defineComponent, unref, ref, onMounted, onUnmounted } from 'vue';
import { message } from 'ant-design-vue';
import { listCategory, queryDrawingSample, addDrawingSample } from '/@/api/df/drawingSample';
import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
import { useGo } from '/@/hooks/web/usePage';

export function useDrawCard() {
  //初始化类目
  const initDrawingSampleCategory = async () => {
    return await listCategory({});
  };

  //加载数据
  const loadMore = async (queryParams) => {
    if (queryParams.nextCursorId === '-1') {
      message.warning('暂无更多数据咯~');
      return null;
    }
    const response = await queryDrawingSample(queryParams);
    return response;
  };

  //复制数据
  const { clipboardRef, copiedRef } = useCopyToClipboard();
  const copyText = (prompt) => {
    const value = unref(prompt);
    if (!value) {
      message.warning('请输入要拷贝的内容！');
      return;
    }
    clipboardRef.value = value;
    if (unref(copiedRef)) {
      message.success('copy success！');
    }
  };

  //画同款
  const go = useGo();
  const goDrawing = async (queryParams) => {
    go('/mj/index?activeTab=TextToImageForm&prompt=' + queryParams);
  };

  return {
    loadMore,
    copyText,
    goDrawing,
    initDrawingSampleCategory,
  };
}
