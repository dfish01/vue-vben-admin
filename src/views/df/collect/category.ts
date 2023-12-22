import { SvgIcon } from '/@/components/Icon';

import {
  ref,
  onMounted,
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

import { downloadByOnlineUrl } from '/@/utils/file/download';
import {
  drawTaskList,
  addDrawTask,
  changePublic,
  delDrawTask,
  deleteBatch,
  getTaskInfo,
} from '/@/api/df/drawTask';
import {
  AddDrawTaskParams,
  DrawTaskListQueryReq,
  DrawTaskListResp,
  DrawTaskChangePublicReq,
  DrawTaskInfoResp,
} from '/@/api/df/model/drawTaskModel';
import { IdReq } from '/@/api/model/baseModel';
import { listCollects, removeCollect, createCollect } from '/@/api/df/drawCollect';
import {
  AddDrawCollectReq,
  DrawCollectListQueryReq,
  DrawCollectListResp,
} from '/@/api/df/model/drawCollectModel';
import { genPromptList, genTagList } from '/@/api/df/dataCache';
import { message, Empty } from 'ant-design-vue';
import { useContentHeight } from '/@/hooks/web/useContentHeight';
import { addTag } from '/@/api/df/drawTaskTag';
import { useAppInject } from '/@/hooks/web/useAppInject';
import { useUserStore as useUserStoreApi } from '/@/store/modules/user';

import { accountInfoApi, drawCollectCategoryApi } from '../mj/accountInfo';
import {
  deleteCategory,
  allCollectCategory,
  saveCategory,
  selectOptions,
  setTop,
} from '/@/api/df/drawCollectCategory';
import { splitPrompt } from './tools';

const {
  collectCategoryViewForm,
  collectTaskForm,
  initAllCollectCategory,
  showAddCollectCategoryModel,
  showMoveCollectCategoryModel,
  closeCollectCategoryModel,
  refreshCollectCategory,
  addToCollectCategory,
  removeFromCollectCategory,
} = drawCollectCategoryApi();

let collectCategoryApiApiInstance: any | null = null;

export const loadingRef = ref(false);

export function collectCategoryApi() {
  if (collectCategoryApiApiInstance) {
    return collectCategoryApiApiInstance;
  }
  const globalLoading = ref(false);

  const globalForm = ref({
    currentCategoryId: null,
    title: null,
  });

  const categoryDataForm = ref({
    id: null as null | string,
    title: null,
    parentId: null as null | string,
    sort: null as null | number,
  });

  const categoryDataViewForm = ref({
    viewFlag: false,
    loading: false,
    title: '',
    refItem: null,
  });

  /**
   * 新增分类
   * @param item
   */
  const showAddView = async (item) => {
    categoryDataViewForm.value.viewFlag = true;
    categoryDataViewForm.value.loading = false;
    categoryDataViewForm.value.refItem = null;
    console.log(222);
    if (item) {
      //添加子类目
      const children = item.children;
      const lastItem = children[children.length - 1];
      categoryDataForm.value.sort = lastItem ? lastItem.sort + 1 : 1;
      categoryDataForm.value.parentId = item.id;
      categoryDataViewForm.value.title = '新增【' + item.title + '】收藏子分类';
      categoryDataViewForm.value.refItem = item;
    } else {
      const lastItem =
        collectCategoryViewForm.value.collectCategoryList[
          collectCategoryViewForm.value.collectCategoryList.length - 1
        ];
      categoryDataForm.value.sort = lastItem.sort + 1;
      categoryDataForm.value.parentId = '0';
      categoryDataViewForm.value.title = '新增收藏分类';
    }
  };

  /**
   * 关闭收藏分类view
   */
  const closedView = async () => {
    categoryDataForm.value.id = null;
    categoryDataForm.value.sort = 0;
    categoryDataForm.value.parentId = '0';
    categoryDataViewForm.value.title = '';
    categoryDataViewForm.value.viewFlag = false;
    categoryDataViewForm.value.loading = false;
    categoryDataViewForm.value.refItem = null;
  };

  /**
   * 编辑收藏分类view
   */
  const modifyView = async (item) => {
    categoryDataForm.value.id = item.id;
    categoryDataViewForm.value.title = '分类编辑';
    categoryDataViewForm.value.viewFlag = true;
    categoryDataViewForm.value.loading = false;
    categoryDataViewForm.value.refItem = item;
  };

  const addCollectCategory = async () => {
    categoryDataViewForm.value.loading = true;
    try {
      const resp = await saveCategory(categoryDataForm.value);
      await refreshCollectCategory();
      //编辑的话，更新title
      // if (categoryDataForm.value.id) {
      //   const matchedItem = collectCategoryViewForm.value.collectCategoryList.find(
      //     (item) => item.id === categoryDataForm.value.parentId,
      //   );
      //   if (matchedItem) {
      //     matchedItem.title = categoryDataForm.value.title;
      //   }
      //   return;
      // }
      // if (categoryDataForm.value.parentId === '0') {
      //   collectCategoryViewForm.value.collectCategoryList.push(resp);
      // } else {
      //   // 找到匹配项的索引
      //   const index = collectCategoryViewForm.value.collectCategoryList.findIndex(
      //     (item) => item.id === categoryDataForm.value.parentId,
      //   );

      //   // 如果找到了匹配项
      //   if (index !== -1) {
      //     // 找到匹配项
      //     const matchedItem = collectCategoryViewForm.value.collectCategoryList[index];

      //     // 确保 matchedItem 有 children 属性
      //     if (!matchedItem.children) {
      //       matchedItem.children = [];
      //     }

      //     // 给匹配项的 children 添加额外的数据
      //     matchedItem.children.push(resp);
      //   }
      // }
      console.log(111111);
      categoryDataViewForm.value.viewFlag = false;
    } finally {
      categoryDataViewForm.value.loading = false;
    }
  };

  /**
   * 删除分类
   */
  const deleteCollectCategory = async (id) => {
    globalLoading.value = true;
    try {
      await deleteCategory({ id: id });
      await refreshCollectCategory();
      //移除数据
      // collectCategoryViewForm.value.collectCategoryList =
      //   collectCategoryViewForm.value.collectCategoryList.filter((item) => item.id !== id);
    } finally {
      globalLoading.value = false;
    }
  };

  /**
   * 选择菜单
   */
  const clickMenu = async (item) => {
    globalForm.value.currentCategoryId = item.id;
    globalForm.value.title = item.title;
  };

  /**
   * 初始化
   */
  const init = async () => {
    globalLoading.value = true;
    try {
      await initAllCollectCategory();
      //首个默认分类
      const item = collectCategoryViewForm.value.collectCategoryList[0];
      globalForm.value.currentCategoryId = item.id;
      globalForm.value.title = item.title;
    } finally {
      globalLoading.value = false;
    }
  };

  const api = {
    globalForm,
    globalLoading,
    categoryDataForm,
    categoryDataViewForm,
    // 方法
    init,
    clickMenu,
    showAddView,
    closedView,
    modifyView,
    addCollectCategory,
    deleteCollectCategory,
  };
  collectCategoryApiApiInstance = api;
  return api;
}
