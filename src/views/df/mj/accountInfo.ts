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
import { addTag, removeTaskTag } from '/@/api/df/drawTaskTag';
import { genPromptList, genTagList } from '/@/api/df/dataCache';
import { ListQueryParams, ListResultModel, AccountListItem } from '/@/api/df/model/accountModel';
import { availableList, getChannelsByGroup } from '/@/api/df/account';
import type { UploadFile } from 'ant-design-vue/es/upload/interface';
import { message, UploadProps, Upload } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { useMessage } from '/@/hooks/web/useMessage';
import { getCustomCache, setCustomCache } from '/@/utils/custom';
import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
import { MJ_TASK_ACCOUNT_KEY } from '/@/enums/cacheEnum';
import {
  DrawCollectCategoryAddReq,
  DrawCollectCategoryListResp,
} from '/@/api/df/model/drawCollectCategoryModel';
import {
  deleteCategory,
  allCollectCategory,
  saveCategory,
  selectOptions,
  setTop,
} from '/@/api/df/drawCollectCategory';
import { addToCategory, removeFromCategory } from '/@/api/df/drawCollect';

const { createMessage, createSuccessModal, createErrorModal, createInfoModal } = useMessage();

let accountInstance: any | null = null;
let tagInstance: any | null = null;
let drawCollectCategoryInstance: any | null = null;
export const loadingRef = ref(false);

// 在你的代码中获取 accountForm 对象的引用
const { accountForm } = accountInfoApi();

// 使用 watch 监视 accountForm 对象的变化
watch(
  () => accountForm,
  (newVal) => {
    // 在这里执行你的方法
    setCustomCache(MJ_TASK_ACCOUNT_KEY, newVal);
  },
  { deep: true }, // 使用 deep 选项以便深度监视对象内部属性的变化
);

//查询相关API
export function accountInfoApi() {
  if (accountInstance) {
    return accountInstance;
  }

  const accountForm = reactive({
    useAccountId: null as string | null | undefined,
    useAccountName: null as string | null | undefined,
    useChannelId: null as string | null | undefined,
    useChannelName: null as string | null | undefined,
    mode: 'relax' as string | undefined,
    currentSpaceId: null,
    currentSpaceTitle: null,
  });

  const accountViewForm = reactive({
    viewFlag: false,
    loading: false,
    accountSelector: {
      size: 'default',
      options: [
        { label: '默认账户', value: '' },
        // { label: 'niji・journey', value: 'niji・journey' },
        // { label: 'insightface', value: 'insightface' },
      ],
    },
    channelSelector: {
      size: 'default',
      options: [{ label: '默认', value: '' }],
    },
    spaceOptions: [{ label: '默认', value: '' }],
    drawingSampleCategory: [],
  });

  const showAccountConfig = () => {
    accountViewForm.viewFlag = true;
    accountViewForm.loading = false;
  };
  const closeAccountConfig = () => {
    accountViewForm.viewFlag = false;
    accountViewForm.loading = false;
  };

  const initAccountInfo = async () => {
    //初始化偏好
    console.log('初始化偏好');
    const getPersonalSetting = getCustomCache(MJ_TASK_ACCOUNT_KEY);
    if (getPersonalSetting) {
      accountForm.mode = getPersonalSetting.mode;
      accountForm.currentSpaceId = getPersonalSetting.currentSpaceId;
      accountForm.currentSpaceTitle = getPersonalSetting.currentSpaceTitle;
      accountForm.useAccountId = getPersonalSetting.useAccountId;
      accountForm.useAccountName = getPersonalSetting.useAccountName;

      if (accountViewForm.accountSelector.options.length === 1) {
        await initAccountList();
      }

      if (getPersonalSetting.useAccountId === null || getPersonalSetting.useAccountId === '') {
        return;
      }
      const isAvaliable = accountViewForm.accountSelector.options.some((obj) =>
        obj.value.includes(getPersonalSetting.useAccountId as string),
      );
      if (isAvaliable && getPersonalSetting.useAccountId !== '') {
        accountForm.useAccountId = getPersonalSetting.useAccountId;
        //渲染频道下拉
        if (accountViewForm.channelSelector.options.length === 1) {
          await doGetChannelsByGroup(accountForm.useAccountId);
        }

        accountForm.useChannelId = getPersonalSetting.useChannelId;
        accountForm.useChannelName = getPersonalSetting.useChannelName;
        console.log(getPersonalSetting.useChannelId);
        const channelAvaliable = accountViewForm.channelSelector.options.some((obj) =>
          obj.value.includes(getPersonalSetting.useChannelId as string),
        );
        if (!channelAvaliable) {
          accountForm.useChannelId = null;
          accountForm.useChannelName = null;
        }
      } else {
        accountForm.useAccountId = null;
        accountForm.useAccountName = null;
        accountForm.useChannelId = null;
        accountForm.useChannelName = null;
      }
    }
  };
  const doGetChannelsByGroup = async (id) => {
    if (!id) {
      return;
    }
    accountViewForm.loading = true;
    try {
      const response = await getChannelsByGroup({ id: id });
      // 使用 map 方法转换数组
      const transformedList = response.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
      const finalList = [{ label: '默认频道', value: '' }, ...transformedList];
      accountViewForm.channelSelector.options = finalList;
    } finally {
      accountViewForm.loading = false;
    }
  };

  const handleAccountSetting = async (value, option) => {
    accountForm.useAccountName = option.label;
    accountForm.useChannelId = null;
    await doGetChannelsByGroup(value);
  };

  const handleChannelSetting = async (value, option) => {
    accountForm.useChannelName = option.label;
  };

  const initAccountList = async () => {
    const response = await availableList({
      accMode: '',
      ownerFlag: '',
    });

    // 使用 map 方法转换数组
    const transformedList = response.map((item) => ({
      label: item.accountName,
      value: item.id,
    }));

    // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
    const finalList = [{ label: '默认账号', value: '' }, ...transformedList];
    accountViewForm.accountSelector.options = finalList;
  };

  const doSetCustomCache = () => {
    // 在这里添加 setCustomCache 的实现，根据你的需求
    // 例如：setCustomCache(MJ_TASK_ACCOUNT_KEY, accountForm);
    setCustomCache(MJ_TASK_ACCOUNT_KEY, accountForm);
  };

  const api = {
    doSetCustomCache,
    accountViewForm,
    accountForm,
    initAccountList,
    handleAccountSetting,
    handleChannelSetting,
    initAccountInfo,
    doGetChannelsByGroup,
    showAccountConfig,
    closeAccountConfig,
  };
  accountInstance = api;
  return api;
}

//标签相关API
export function tagInfoApi() {
  if (tagInstance) {
    return tagInstance;
  }

  const initTag = () => {
    drawTagForm.value.drawTaskId = null;
    drawTagForm.value.tagName = null;
    drawTagForm.value.viewFlag = false;
    drawTagForm.value.loading = false;
    if (drawTagForm.value.tagNameOptions.length === 0) {
      loadTagList();
    }
  };
  /*************************添加标签*************************** */
  const drawTagForm = ref({
    drawTaskId: null,
    tagName: null,
    viewFlag: false,
    loading: false,
    tagNameOptions: [] as { value: string; label: string }[],
    infoData: null,
  });

  const showDrawTaskTagModel = (card) => {
    drawTagForm.value.drawTaskId = card.id;
    drawTagForm.value.viewFlag = true;
  };

  const addDrawTaskTag = async () => {
    drawTagForm.value.loading = true;
    try {
      await addTag({
        drawTaskId: drawTagForm.value.drawTaskId,
        tagName: drawTagForm.value.tagName,
      });
      drawTagForm.value.viewFlag = false;
      console.log(11123);
      // if (taskInfo && taskInfo.id && taskInfo.id === drawTagForm.value.drawTaskId) {
      //   taskInfo.tagList.push(drawTagForm.value.tagName);
      // }

      //加载新的
      const resp = await genTagList({});
      const options = resp.map((item) => ({
        value: item,
        label: item,
      }));
      drawTagForm.value.tagNameOptions = options;
    } finally {
      drawTagForm.value.loading = false;
    }
  };

  const removeDrawTaskTag = async (id, tagName) => {
    loadingRef.value = true;
    try {
      await removeTaskTag({
        drawTaskId: id,
        tagName: tagName,
      });
    } finally {
      loadingRef.value = false;
    }
  };

  const loadTagList = async () => {
    // if (drawTagForm.value.tagNameOptions.length > 0) {
    //   return;
    // }
    //查询最近使用的tag
    const resp = await genTagList({});
    const options = resp.map((item) => ({
      value: item,
      label: item,
    }));
    drawTagForm.value.tagNameOptions = options;
  };

  const onChangeLabel = (selectedOption) => {
    console.log(selectedOption);
    // 获取选中项的值，不包含 @ 符号
    drawTagForm.value.tagName = drawTagForm.value.tagName.replace(/@/g, '');
  };
  const onChangeSearchLabel = (selectedOption) => {
    console.log(selectedOption);
    // 获取选中项的值，不包含 @ 符号
    drawTagForm.value.tagName = drawTagForm.value.tagName.replace(/@/g, '');
  };
  const api = {
    // 响应式引用
    initTag,
    drawTagForm,
    showDrawTaskTagModel,
    addDrawTaskTag,
    removeDrawTaskTag,
    loadTagList,
    onChangeLabel,
    onChangeSearchLabel,
  };
  tagInstance = api;
  return api;
}

//收藏类目API
export function drawCollectCategoryApi() {
  if (drawCollectCategoryInstance) {
    return drawCollectCategoryInstance;
  }

  const collectCategoryViewForm = ref({
    title: '',
    viewFlag: false,
    loading: false,
    collectCategoryOptions: [] as TransformedItem[],
    collectCategoryList: [] as DrawCollectCategoryListResp[],
  });

  const collectTaskForm = ref({
    taskIds: [],
    oriCategoryId: null,
    categoryId: null,
  });

  // 监听 collectCategoryList 的变化
  watch(
    () => collectCategoryViewForm.value.collectCategoryList,
    (newList) => {
      // 提取新的 collectCategoryOptions
      collectCategoryViewForm.value.collectCategoryOptions = transformCategoryList(newList);
    },
  );

  const showAddCollectCategoryModel = (card) => {
    collectTaskForm.value.taskIds = [card.id];
    collectTaskForm.value.oriCategoryId = null;
    collectCategoryViewForm.value.title = '添加到收藏';
    collectCategoryViewForm.value.loading = false;
    collectCategoryViewForm.value.viewFlag = true;
  };

  const showMoveCollectCategoryModel = (card) => {
    console.log('showMoveCollectCategoryModel');
    collectTaskForm.value.taskIds = [card.id];
    collectTaskForm.value.oriCategoryId = card.collectCategoryId;
    collectCategoryViewForm.value.title = '移动收藏分类';
    collectCategoryViewForm.value.loading = false;
    collectCategoryViewForm.value.viewFlag = true;
  };

  const closeCollectCategoryModel = () => {
    collectTaskForm.value.taskIds = [];
    collectTaskForm.value.oriCategoryId = null;
    collectCategoryViewForm.value.title = '';
    collectCategoryViewForm.value.loading = false;
    collectCategoryViewForm.value.viewFlag = false;
  };

  /**
   *
   * @returns 初始化类目
   */
  const initAllCollectCategory = async () => {
    if (collectCategoryViewForm.value.collectCategoryList.length > 0) {
      return collectCategoryViewForm.value.collectCategoryList;
    }
    const resp = await allCollectCategory({});
    collectCategoryViewForm.value.collectCategoryList = resp;
    // collectCategoryViewForm.value.collectCategoryOptions = transformCategoryList(resp);
    return resp;
  };

  const refreshCollectCategory = async () => {
    const resp = await allCollectCategory({});
    collectCategoryViewForm.value.collectCategoryList = resp;
    return resp;
  };

  interface TransformedItem {
    label: string;
    value: string;
    children?: TransformedItem[];
  }

  function transformCategoryList(list: DrawCollectCategoryListResp[]): TransformedItem[] {
    return list.map((item) => {
      const transformedItem: TransformedItem = {
        label: item.title || '',
        value: item.id || '',
      };

      if (item.children && item.children.length > 0) {
        transformedItem.children = transformCategoryList(item.children);
      }

      return transformedItem;
    });
  }

  /**
   * 任务添加到收藏类目收藏
   */
  const addToCollectCategory = async () => {
    collectCategoryViewForm.value.loading = true;
    try {
      await addToCategory(collectTaskForm.value);
      collectCategoryViewForm.value.viewFlag = false;
    } finally {
      collectCategoryViewForm.value.loading = false;
    }
  };

  /**
   * 任务移除收藏类目收藏
   */
  const removeFromCollectCategory = async (card) => {
    collectCategoryViewForm.value.loading = true;
    try {
      await removeFromCategory({ categoryId: card.collectCategoryId, taskIds: [card.id] });
      collectCategoryViewForm.value.viewFlag = false;
    } finally {
      collectCategoryViewForm.value.loading = false;
    }
  };

  const api = {
    refreshCollectCategory,
    collectCategoryViewForm,
    collectTaskForm,
    initAllCollectCategory,
    showAddCollectCategoryModel,
    showMoveCollectCategoryModel,
    closeCollectCategoryModel,

    addToCollectCategory,
    removeFromCollectCategory,
  };
  drawCollectCategoryInstance = api;
  return api;
}
