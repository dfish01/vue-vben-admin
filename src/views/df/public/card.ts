import { defineComponent, unref, ref,onMounted,onUnmounted } from 'vue';
import { message } from 'ant-design-vue';
import { listCategory, queryDrawingSample } from '/@/api/df/drawingSample';
import { copyText as doCopyText } from '/@/utils/copyTextToClipboard';
import { useGo } from '/@/hooks/web/usePage';

export function useDrawCard() {

  //初始化类目
  const initDrawingSampleCategory = async () => {
    return await listCategory({})
  };

  //加载数据
  const loadMore = async  (queryParams) => {
    if (queryParams.nextCursorId === '-1') {
      message.warning('暂无更多数据咯~');
      return;
    }
    const response = await queryDrawingSample(queryParams);
    return response
  };

  //复制数据
  const copyText = (prompt) => {
    const value = unref(prompt);
    if (!value) {
      message.warning('请输入要拷贝的内容！');
      return;
    }
    doCopyText(value);
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
