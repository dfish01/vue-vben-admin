import { defineComponent, unref, ref, onMounted, onUnmounted } from 'vue';
import { message } from 'ant-design-vue';
import {
  listCategory,
  queryDrawingSample,
  addDrawingSample,
  delExample,
} from '/@/api/df/drawingSample';
import { useGo } from '/@/hooks/web/usePage';
import useClipboard from 'vue-clipboard3';

const { toClipboard } = useClipboard();

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
  const copyText = async (prompt) => {
    try {
      await toClipboard(prompt);
      message.success('复制成功');
    } catch (e) {
      message.error('复制失败!' + e.message);
    }

    // const value = unref(prompt);
    // if (!value) {
    //   message.warning('请输入要拷贝的内容！');
    //   return;
    // }
    // doCopyText(value);
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
