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
  retryDrawTask,
  getTaskSeed,
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
import { addTag, removeTaskTag } from '/@/api/df/drawTaskTag';
import { useAppInject } from '/@/hooks/web/useAppInject';
import { useUserStore as useUserStoreApi } from '/@/store/modules/user';
import { listCategory, queryDrawingSample, addDrawingSample } from '/@/api/df/drawingSample';
import { splitPrompt } from './tools';
import { useMessage } from '/@/hooks/web/useMessage';

const { createMessage, createSuccessModal, createErrorModal, createInfoModal } = useMessage();
let jobListQueryApiInstance: any | null = null;
let jobOptionApiInstance: any | null = null;
let userSettingApiInstance: any | null = null;
let jobTagApiInstance: any | null = null;
let lightBoxApiInstance: any | null = null;
let exampleApiInstance: any | null = null;
export const loadingRef = ref(false);

//查询相关API
export function exampleApi() {
  if (exampleApiInstance) {
    return exampleApiInstance;
  }
  //初始化类目
  const drawingSampleCategory = async () => {
    return await listCategory({});
  };
  const doAddDrawingSample = async (params) => {
    await addDrawingSample(params);
  };

  const api = {
    drawingSampleCategory,
    doAddDrawingSample,
  };
  exampleApiInstance = api;
  return api;
}

//查询相关API
export function jobListQueryApi() {
  if (jobListQueryApiInstance) {
    return jobListQueryApiInstance;
  }

  // 参数
  const searchForm = ref({
    tagName: null,
    state: null,
    commandType: null,
    spaceId: null,
  });
  // 分页
  const pagination = ref({
    // 表格分页的配置
    current: 1,
    pageSize: 12,
    showSizeChanger: true, // 用于控制展示每页多少条的下拉
    showQuickJumper: true,
    total: 0,
    pageSizeOptions: ['12', '24', '36', '48'],
    showTotal: (total) => `共 ${total} 条`,
    onShowSizeChange: pageSizeChange,
    onChange: pageChange,
  });

  const cards = ref<DrawTaskListResp[]>([
    // 更多数据...
  ]);

  let intervalId: ReturnType<typeof setInterval> | null = null;

  // 页数改变的方法
  function pageSizeChange(val, pageNum) {
    pagination.value.pageSize = pageNum; // 修改每页显示的条数
    // pagination.value.current = 1
    onSearch(1);
  }
  // 点击上一页下一页的方法
  function pageChange(page, val) {
    // pagination.value.current = page
    onSearch(page);
  }

  //异步查询，无loading
  const onSearchNoLoading = async () => {
    const params: DrawTaskListQueryReq = {
      spaceId: searchForm.value.spaceId,
      tagName: searchForm.value.tagName,
      commandType: searchForm.value.commandType,
      state: searchForm.value.state,
      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
    };
    const response = await drawTaskList(params);
    setTimerIfNecessary(response);
    cards.value = response.records;
    pagination.value.total = response.total;
  };

  //判断是否添加定时查询任务
  const setTimerIfNecessary = async (response) => {
    const loopQueryFlag = response.records.some(
      (item) => item.state === 'QUEUED' || item.state === 'RUNNING' || item.state === 'READY',
    );
    console.log('setTimerIfNecessary...' + loopQueryFlag + 'intervalId=' + intervalId);
    if (loopQueryFlag && intervalId === null) {
      intervalId = setInterval(() => {
        console.log('-----------------');
        onSearchNoLoading();
      }, 5000); // 5秒
    } else if (!loopQueryFlag && intervalId != null) {
      removeTimer();
    }
  };

  //移除定时器
  const removeTimer = () => {
    if (intervalId != null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
  //重置

  const onReset = () => {
    searchForm.value.tagName = null;
    searchForm.value.state = null;
    searchForm.value.commandType = null;
    searchForm.value.spaceId = null;
  };

  //查询
  const onSearch = async (current?: number) => {
    if (typeof current === 'undefined') {
      current = 1;
    }
    pagination.value.current = current;
    loadingRef.value = true;
    const params: DrawTaskListQueryReq = {
      tagName: searchForm.value.tagName,
      commandType: searchForm.value.commandType,
      spaceId: searchForm.value.spaceId,
      state: searchForm.value.state,

      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
    };

    const response = await drawTaskList(params);
    setTimerIfNecessary(response);
    cards.value = response.records;
    pagination.value.total = response.total;
    loadingRef.value = false;
    console.log(111111111111);
  };

  /***********************************明细*************************** */
  const infoData: DrawTaskInfoResp = reactive({
    viewFlag: false,
    tip: '正在处理中...',
    card: null,
    id: '',
    taskInfo: {
      imageUrls: [],
      bootName: 'Boot1',
      oriPrompt: '原始提示',
      contentStripped: '剥离的内容',
      commandTypeName: '命令类型1',
      modeName: '模式1',
      accountName: '账户1',
      discordUserName: '用户1',
      channelName: '频道1',
      guildName: '公会1',
      privacyMode: 'Y',
    },
    processList: [
      { title: '任务创建', description: '2023-01-01 12:00:00' },
      { title: '任务分配', description: '2023-01-02 12:00:00' },
      { title: '开始执行', description: '2023-01-03 12:00:00' },
      { title: '任务完成', description: '2023-01-04 12:00:00' },
    ],
    tagList: ['标签1', '标签2'],
    taskSpaceList: [
      { spaceId: 1, spaceName: '空间1' },
      { spaceId: 2, spaceName: '空间2' },
    ],
  });

  const showTaskInfo = async (card) => {
    if (card.state != 'SUCCESS') {
      return;
    }
    infoData.card = card;
    loadingRef.value = true;
    try {
      const resp = await getTaskInfo({ id: card.id });
      Object.assign(infoData, resp);
      infoData.viewFlag = true;
    } finally {
      loadingRef.value = false;
    }
  };
  const closeTaskInfo = async () => {
    infoData.viewFlag = false;
  };

  const api = {
    closeTaskInfo,
    showTaskInfo,
    infoData,
    cards,
    searchForm,
    pagination,
    pageChange,
    pageSizeChange,
    onSearchNoLoading,
    onSearch,
    onReset,
    removeTimer,
  };
  jobListQueryApiInstance = api;
  return api;
}

export function jobOptionApi() {
  if (jobOptionApiInstance) {
    return jobOptionApiInstance;
  }

  //删除卡片
  const deleteCard = async (card) => {
    const idReq: IdReq = { id: card.id };
    loadingRef.value = true;
    console.log('---------------------------------');
    await delDrawTask(idReq);
    jobListQueryApi().onSearch(jobListQueryApi().pagination.value.current);
  };

  //获取seed
  const getSeed = async (id, infoFlag) => {
    const idReq: IdReq = { id: id };
    loadingRef.value = true;
    try {
      await getTaskSeed(idReq);
      if (infoFlag) {
        message.success('Seed获取成功，正在刷新详情数据');
        const resp = await getTaskInfo({ id: id });
        Object.assign(jobListQueryApiInstance.infoData, resp);
      } else {
        message.success('获取成功，请至详情页查看');
      }
    } finally {
      loadingRef.value = false;
    }
  };

  //批量删除
  const deleteBatchHandle = async (state) => {
    loadingRef.value = true;
    try {
      console.log('---------------------------------');
      await deleteBatch({ spaceId: jobListQueryApi().searchForm.value.spaceId, state: state });
      jobListQueryApi().onSearch(jobListQueryApi().pagination.value.current);
      // message.success('删除成功！');
    } finally {
      loadingRef.value = false;
    }
  };

  //公开|非公开
  const toggleVisibility = async (card) => {
    loadingRef.value = true;
    card.privacyMode = card.privacyMode === 'Y' ? 'N' : 'Y';
    console.log('------------------');
    console.log(card.privacyMode);
    const param: DrawTaskChangePublicReq = {
      id: card.id,
      privacyMode: card.privacyMode,
    };
    await changePublic(param);
    loadingRef.value = false;
  };

  /**
   * 添加到收藏
   * @param card
   */
  const addDrawCollect = async (card) => {
    loadingRef.value = true;
    card.collectFlag = card.collectFlag === 'Y' ? 'N' : 'Y';
    console.log('------------------');
    try {
      if (card.collectFlag === 'Y') {
        const param: AddDrawCollectReq = {
          taskId: card.id,
          collectCategoryId: null,
        };
        await createCollect(param);
        message.success('已添加到收藏~~~');
        // notification.success({
        //   message: '操作成功！',
        //   description: '已添加到收藏~~~',
        //   duration: 3,
        // });
        return;
      }
      const param: IdReq = {
        id: card.id,
      };
      await removeCollect(param);
      message.success('取消收藏~~~');
    } finally {
      loadingRef.value = false;
    }
  };

  /**
   * 失败任务重新提交
   * @param card
   */
  const doRetryDrawTask = async (card) => {
    loadingRef.value = true;
    const getPersonalSetting = userStore.getPersonalSetting;
    try {
      await retryDrawTask({
        id: card.id,
        mode: getPersonalSetting.mode,
        refAccountId: getPersonalSetting.userAccountId,
      });
      message.success('已重新提交任务~~~');
    } finally {
      loadingRef.value = false;
    }
  };

  /**************************** 画图任务相关 ************************* */
  const handleU = async (card, key, upscaleType) => {
    // 这里的 event.key 将是您点击的菜单项的 key
    console.log('Selected card: ${JSON.stringify(card)}');
    const getPersonalSetting = userStore.getPersonalSetting;
    const buttonObj = card.buttonMap[key];
    const customId = buttonObj.id === undefined ? buttonObj.custom_id : buttonObj.id;
    const addTaskParam: AddDrawTaskParams = {
      spaceId: jobListQueryApi().searchForm.value.spaceId,
      refAccountId: getPersonalSetting.userAccountId,
      channel: 'MJ',
      priority: 0,
      privacyMode: 'Y',
      commandType: 'UPSCALE',
      invokeTimes: 1,
      prompt: {
        customId: customId,
        upscaleType: upscaleType,
        commandType: 'UPSCALE',
        refTaskId: card.id,
        mode: getPersonalSetting.mode,
      },
    };
    loadingRef.value = true;
    try {
      await addDrawTask(addTaskParam);
      message.success('添加任务成功~~~');
    } finally {
      loadingRef.value = false;
    }
    refreshIfNecessary();
  };

  const handleZoom = async (card, type, event) => {
    const buttonObj = card.buttonMap[event.key];
    const customId = buttonObj.id === undefined ? buttonObj.custom_id : buttonObj.id;
    if ('Custom Zoom' === event.key) {
      showZoomCustomer(card, customId);
      return;
    }
    const getPersonalSetting = userStore.getPersonalSetting;
    // 这里的 event.key 将是您点击的菜单项的 key
    console.log('Selected card: ${JSON.stringify(card)}');
    console.log('Zoom option selected: ${event.key}');
    const addTaskParam: AddDrawTaskParams = {
      spaceId: jobListQueryApi().searchForm.value.spaceId,
      refAccountId: getPersonalSetting.userAccountId,
      channel: 'MJ',
      priority: 0,
      privacyMode: 'Y',
      commandType: type,
      invokeTimes: 1,
      prompt: {
        customId: customId,
        commandType: type,
        refTaskId: card.id,
        mode: getPersonalSetting.mode,
      },
    };
    loadingRef.value = true;
    try {
      await addDrawTask(addTaskParam);
      message.success('添加任务成功~~~');
    } finally {
      loadingRef.value = false;
    }
    refreshIfNecessary();
  };

  const refreshIfNecessary = () => {
    if (userSettingApi().userSetting.value.taskRefresh) {
      jobListQueryApi().onSearch();
    }
  };

  const handlePan = async (card, type, event) => {
    console.log(11122);
    if ('zoom-cus' === event.key) {
      return;
    }
    if (remix.value.enable_flag) {
      showPanRemixCustomer(card, type, event.key);
      return;
    }
    const getPersonalSetting = userStore.getPersonalSetting;
    // 这里的 event.key 将是您点击的菜单项的 key
    console.log('Selected card: ${JSON.stringify(card)}');
    console.log('Zoom option selected: ${event.key}');
    const addTaskParam: AddDrawTaskParams = {
      spaceId: jobListQueryApi().searchForm.value.spaceId,
      refAccountId: getPersonalSetting.userAccountId,
      channel: 'MJ',
      priority: 0,
      privacyMode: 'Y',
      commandType: type,
      invokeTimes: 1,
      prompt: {
        index: event.key,
        commandType: type,
        refTaskId: card.id,
        mode: getPersonalSetting.mode,
      },
    };
    loadingRef.value = true;
    try {
      await addDrawTask(addTaskParam);
      message.success('添加任务成功~~~');
    } finally {
      loadingRef.value = false;
    }
    refreshIfNecessary();
  };

  const handleV = async (card, type, key) => {
    const buttonObj = card.buttonMap[key];
    const customId = buttonObj.id === undefined ? buttonObj.custom_id : buttonObj.id;
    // console.log('customId:' + customId);
    if (remix.value.enable_flag) {
      showRemixCustomer(card, type, customId);
      return;
    }
    const getPersonalSetting = userStore.getPersonalSetting;
    console.log(55555);
    // 这里的 event.key 将是您点击的菜单项的 key
    console.log('Selected card: ${JSON.stringify(card)}');
    const addTaskParam: AddDrawTaskParams = {
      spaceId: jobListQueryApi().searchForm.value.spaceId,
      refAccountId: getPersonalSetting.userAccountId,
      channel: 'MJ',
      priority: 0,
      privacyMode: 'Y',
      commandType: 'VARIATION',
      invokeTimes: 1,
      prompt: {
        customId: key,
        commandType: 'VARIATION',
        variationType: type,
        refTaskId: card.id,
        mode: getPersonalSetting.mode,
      },
    };
    loadingRef.value = true;
    try {
      await addDrawTask(addTaskParam);
      message.success('添加任务成功~~~');
    } finally {
      loadingRef.value = false;
    }
    refreshIfNecessary();
  };

  const handleDraw = async (card, event) => {
    // 这里的 event.key 将是您点击的菜单项的 key
    console.log('handleDraw card: ${JSON.stringify(card)}');
    const promptList = splitPrompt(card.prompt);
    console.log(promptList[event.key]);
    const promptArray: string[] = [];
    let prompt = '';
    if (event.key < 4) {
      // promptArray.push(promptList[event.key]);
      prompt = promptList[event.key];
    } else {
      const resultArray = promptList.map((item) => '/imagine:' + item);
      prompt = resultArray.join(' ');
      // promptArray = promptList;
    }
    const getPersonalSetting = userStore.getPersonalSetting;
    const addTaskParam: AddDrawTaskParams = {
      refAccountId: getPersonalSetting.userAccountId,
      spaceId: jobListQueryApi().searchForm.value.spaceId,
      channel: 'MJ',
      priority: 0,
      // refTaskId: null,
      privacyMode: 'N',
      commandType: 'IMAGINE',
      invokeTimes: 1,
      prompt: {
        prompt: prompt,
        paramsDataMap: {},
        paramsStr: '',
        commandType: 'IMAGINE',
        bootId: card.bootId,
        mode: getPersonalSetting.mode,
      },
    };
    loadingRef.value = true;
    try {
      await addDrawTask(addTaskParam);
      message.success('添加任务成功~~~');
    } finally {
      loadingRef.value = false;
    }
    refreshIfNecessary();
  };

  /****************************** remix 相关 *************************** */
  const userStore = useUserStoreApi();
  const varyRegionForm = ref({
    viewFlag: false,
    varyRegionUrl: '',
    customId: '',
    token: '',
    card: null,
    mode: null,
    refAccountId: null,
  });
  const openVaryRegion = (card, type, key) => {
    // MJ::Inpaint::1::a65a6904-6f26-43fd-93a2-db88a9a2d2a1::SOLO
    const buttonObj = card.buttonMap[key];
    const idStr = buttonObj.id === undefined ? buttonObj.custom_id : buttonObj.id;

    const customId = encodeURIComponent(idStr);
    console.log(customId);
    const token = userStore.getToken;
    const getPersonalSetting = userStore.getPersonalSetting;
    // varyRegionForm.value.refAccountId =
    //   getPersonalSetting.userAccountId && getPersonalSetting.userAccountId != ''
    //     ? getPersonalSetting.userAccountId
    //     : card.refAccountId;
    varyRegionForm.value.refAccountId =
      getPersonalSetting.userAccountId && getPersonalSetting.userAccountId != ''
        ? getPersonalSetting.userAccountId
        : null;
    varyRegionForm.value.card = card;
    varyRegionForm.value.customId = idStr;
    varyRegionForm.value.mode = getPersonalSetting.mode;
    varyRegionForm.value.token = token;
    varyRegionForm.value.varyRegionUrl = '/mjTools.html?customId=' + customId;
    varyRegionForm.value.viewFlag = true;
    console.log('openVaryRegion getPersonalSetting ' + getPersonalSetting);
    console.log('openVaryRegion ' + varyRegionForm.value);
  };

  const remixCard = ref({});
  const remix = ref({
    enable_flag: true,
    loading: false,
    variationType: '',
    commandType: '',
    prompt: '',
    index: '',
    view: false,
    title: '',
    secTitle: '',
    customId: '',
    id: '',
  });
  const changeRemix = () => {
    remix.value.enable_flag = !remix.value.enable_flag;
    message.success(remix.value.enable_flag ? '已开启remix弹窗' : '已关闭remix弹窗');
  };

  const showZoomCustomer = (card, customId) => {
    remixCard.value = card;
    remix.value.view = true;
    remix.value.loading = false;
    remix.value.commandType = 'ZOOM';
    remix.value.prompt = card.prompt + ' --zoom 2';
    remix.value.title = '自定义缩放（ZOOM OUT）';
    remix.value.secTitle = '⚠️仅支持--ar和--zoom 参数';
    remix.value.customId = customId;
  };
  const showRemixCustomer = async (card, type, customId) => {
    console.log('===========' + customId);
    remixCard.value = card;
    remix.value.view = true;
    remix.value.customId = customId;
    remix.value.loading = false;
    remix.value.prompt = card.prompt;
    remix.value.variationType = type;
    remix.value.commandType = 'VARIATION';
    remix.value.title = '重新改词（Remix Prompt）';
    remix.value.secTitle = '⚠️请勿分享密码和其他任何敏感信息。⚠️确认账号已开启Remix！';
  };
  const showPanRemixCustomer = async (card, type, index) => {
    console.log('===========');
    remixCard.value = card;
    remix.value.view = true;
    remix.value.index = index;
    remix.value.loading = false;
    remix.value.prompt = card.prompt;
    remix.value.variationType = '';
    remix.value.commandType = type;
    remix.value.title = ' 重新改词（pan ' + index + '）';
    remix.value.secTitle = '⚠️请勿分享密码和其他任何敏感信息。⚠️确认账号已开启Remix！';
  };

  const doZoomCus = async () => {
    console.log('==================================remix.value===================================');
    console.log(remix.value);
    // 使用正则表达式匹配 "--zoom" 后面的数字
    if ('ZOOM' === remix.value.commandType) {
      const zoomRegex = /--zoom\s+(\d+(\.\d+)?)/;
      const match = remix.value.prompt.match(zoomRegex);
      if (!match) {
        message.error('--zoom 不存在');
        return; // 直接返回异常情况
      }
      const zoomValue = parseFloat(match[1]); // 提取匹配到的数字并转换为浮点数
      if (zoomValue < 1.0 || zoomValue > 2.0) {
        message.error('--zoom 的值必须再[1.0 ~ 2.0]之间');
        return; // 直接返回异常情况
      }
    }
    const getPersonalSetting = userStore.getPersonalSetting;
    const addTaskParam: AddDrawTaskParams = {
      refAccountId: getPersonalSetting.userAccountId,
      spaceId: jobListQueryApi().searchForm.value.spaceId,
      channel: 'MJ',
      priority: 0,
      // refTaskId: null,
      privacyMode: 'N',
      commandType: remix.value.commandType,
      invokeTimes: 1,
      prompt: {
        prompt: remix.value.prompt,
        commandType: remix.value.commandType,
        variationType: remix.value.variationType,
        index: remix.value.index,
        refTaskId: remixCard.value.id,
        customId: remix.value.customId,
        mode: getPersonalSetting.mode,
      },
    };
    remix.value.loading = true;
    // loadingRef.value = true;
    try {
      await addDrawTask(addTaskParam);
      message.success('添加任务成功~~~');
      remix.value.view = false;
    } finally {
      remix.value.loading = false;
      // loadingRef.value = false;
    }
    refreshIfNecessary();
  };
  const api = {
    // 方法
    getSeed,
    deleteCard,
    deleteBatchHandle,
    toggleVisibility,
    addDrawCollect,
    handleU,
    handleZoom,
    refreshIfNecessary,
    handlePan,
    handleV,
    handleDraw,
    doRetryDrawTask,
    // Remix 相关
    userStore,
    varyRegionForm,
    openVaryRegion,
    remixCard,
    remix,
    changeRemix,
    showZoomCustomer,
    showRemixCustomer,
    showPanRemixCustomer,
    doZoomCus,
  };
  jobOptionApiInstance = api;
  return api;
}

export function jobTagApi() {
  if (jobTagApiInstance) {
    return jobTagApiInstance;
  }
  /*************************添加标签*************************** */
  const drawTagForm = ref({
    drawTaskId: '',
    tagName: '',
    viewFlag: false,
    loading: false,
    tagNameOptions: [] as { value: string; label: string }[],
  });

  const showDrawTaskTagModel = (card) => {
    drawTagForm.value.drawTaskId = card.id;
    drawTagForm.value.viewFlag = true;
    loadTagList();
  };

  const addDrawTaskTag = async () => {
    drawTagForm.value.loading = true;
    try {
      await addTag({
        drawTaskId: drawTagForm.value.drawTaskId,
        tagName: drawTagForm.value.tagName,
      });
      if (
        jobListQueryApiInstance.infoData.id &&
        jobListQueryApiInstance.infoData.id === drawTagForm.value.drawTaskId
      ) {
        jobListQueryApiInstance.infoData.tagList.push(drawTagForm.value.tagName);
      }
      drawTagForm.value.viewFlag = false;
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
      if (jobListQueryApiInstance.infoData.id && jobListQueryApiInstance.infoData.id === id) {
        jobListQueryApiInstance.infoData.tagList = jobListQueryApiInstance.infoData.tagList.filter(
          (element) => element !== tagName,
        );
      }
    } finally {
      loadingRef.value = false;
    }
  };

  const loadTagList = async () => {
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
    jobListQueryApi().searchForm.value.tagName = jobListQueryApi().searchForm.value.tagName.replace(
      /@/g,
      '',
    );
  };
  const api = {
    // 响应式引用
    drawTagForm,

    showDrawTaskTagModel,
    addDrawTaskTag,
    removeDrawTaskTag,
    loadTagList,
    onChangeLabel,
    onChangeSearchLabel,
  };
  jobTagApiInstance = api;
  return api;
}

/*********************************** 基础配置 ******************************** */
export function userSettingApi() {
  if (userSettingApiInstance) {
    return userSettingApiInstance;
  }
  const userSetting = ref({
    useUpImage: false,
    usePersonNet: false,
    taskRefresh: false,
  });
  const setUseUpImage = (): void => {
    userSetting.value.useUpImage = !userSetting.value.useUpImage;
  };

  const setUsePersonNet = (): void => {
    userSetting.value.usePersonNet = !userSetting.value.usePersonNet;
  };
  const setTaskRefresh = (): void => {
    userSetting.value.taskRefresh = !userSetting.value.taskRefresh;
  };

  const api = {
    userSetting,
    setUseUpImage,
    setUsePersonNet,
    setTaskRefresh,
  };
  userSettingApiInstance = api;
  return api;
}
/******************************灯箱**************** */
export function lightBoxApi() {
  if (lightBoxApiInstance) {
    return lightBoxApiInstance;
  }
  const lightBoxOptions = reactive({
    visibleRef: false,
    indexRef: 0,
    imgsRef: [] as any[],
    currentItem: null,
  });

  const showImage = (item) => {
    const baseImageSource = item.taskImage.imageUrl;
    const newArray = [
      {
        src: baseImageSource,
        item,
      },
    ];
    console.log(newArray);
    lightBoxOptions.imgsRef.length = 0;
    lightBoxOptions.imgsRef.push(...newArray);
    lightBoxOptions.indexRef = 0;
    lightBoxOptions.visibleRef = true;
    lightBoxOptions.currentItem = lightBoxOptions.imgsRef[lightBoxOptions.indexRef].item;
  };
  //展示当前页所有图片
  const showAllImage = (oriFlag) => {
    const newArray = jobListQueryApi().cards.value.map((item) => {
      return {
        src: oriFlag ? item.taskImage.imageUrl : item.taskImage.mediaImageUrl,
        item,
      };
    });
    console.log(newArray);
    lightBoxOptions.imgsRef.length = 0;
    lightBoxOptions.imgsRef.push(...newArray);
    // lightBoxOptions.indexRef = 0;
    lightBoxOptions.visibleRef = true;
    lightBoxOptions.currentItem = lightBoxOptions.imgsRef[lightBoxOptions.indexRef].item;
  };

  const onPrevClick = (oldIndex, newIndex) => {
    console.log('onPrevClick oldIndex=' + oldIndex + ' newIndex=' + newIndex);
    lightBoxOptions.currentItem = lightBoxOptions.imgsRef[newIndex].item;
  };
  const onNextClick = (oldIndex, newIndex) => {
    console.log('onNextClick oldIndex=' + oldIndex + ' newIndex=' + newIndex);
    lightBoxOptions.currentItem = lightBoxOptions.imgsRef[newIndex].item;
  };

  const imageLoad = (item) => {
    // item.load = true;
  };
  const nextImage = (func) => {
    if (lightBoxOptions.imgsRef.length === lightBoxOptions.indexRef) {
      return;
    }
    lightBoxOptions.indexRef = lightBoxOptions.indexRef + 1;
    console.log('nextImage  ' + lightBoxOptions.indexRef);
    func();
  };
  const preImage = (func) => {
    if (lightBoxOptions.indexRef === 0) {
      return;
    }
    lightBoxOptions.indexRef = lightBoxOptions.indexRef - 1;
    console.log('preImage  ' + lightBoxOptions.indexRef);
    func();
  };

  const executeFunc = (func) => {
    const param = lightBoxOptions.imgsRef[lightBoxOptions.indexRef].item;
    console.log('executeFunc  ' + param);
    func(param);
  };
  const onHide = () => (lightBoxOptions.visibleRef = false);

  const api = {
    // 响应式对象
    lightBoxOptions,

    // 方法
    showImage,
    showAllImage,
    onPrevClick,
    onNextClick,
    imageLoad,
    nextImage,
    preImage,
    executeFunc,
    onHide,
  };
  lightBoxApiInstance = api;
  return api;
}

//图片切割下载
export function splitAndDownloadImage(card) {
  const imageUrl = card.taskImage.imageUrl;
  loadingRef.value = true;
  const image = new Image();
  image.crossOrigin = 'Anonymous'; // 设置跨域属性以允许获取图像数据

  image.onload = () => {
    const canvas = document.createElement('canvas');
    const canvasWidth = image.width / 2; // 根据需求调整分割大小
    const canvasHeight = image.height / 2;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          ctx.drawImage(
            image,
            col * canvasWidth,
            row * canvasHeight,
            canvasWidth,
            canvasHeight,
            0,
            0,
            canvasWidth,
            canvasHeight,
          );

          const dataUrl = canvas.toDataURL();
          const downloadLink = document.createElement('a');
          // 获取原始文件名
          const originalFileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
          // 设置下载链接的文件名，带有索引编号
          downloadLink.href = dataUrl;
          downloadLink.download = `split_image_${originalFileName}_${row * 2 + col + 1}.png`;
          downloadLink.click();
        }
      }
    }
    loadingRef.value = false;
  };
  image.src = imageUrl;
}
