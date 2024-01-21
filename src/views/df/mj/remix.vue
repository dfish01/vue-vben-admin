<template>
  <!-- remix弹窗-->
  <div>
    <a-modal
      v-model:open="remix.view"
      :title="remix.title"
      @ok="doZoomCus()"
      :confirmLoading="remix.loading"
    >
      <a-spin :spinning="remix.loading">
        <a-row style="padding: 15px">
          <a-col span="24">
            <span>{{ remix.secTitle }}</span>
          </a-col>
          <a-col span="24">
            <a-textarea
              style="width: 100%"
              v-model:value="remix.prompt"
              placeholder="请输入相关的文本~"
              allow-clear
              :maxlength="2000"
              :auto-size="{ minRows: 5, maxRows: 8 }"
            />
          </a-col>
        </a-row>
      </a-spin>
    </a-modal>
  </div>
  <!-- 标签弹窗  -->
  <div>
    <a-modal v-model:open="drawTagForm.viewFlag" title="🔥添加标签" @ok="addDrawTaskTag()">
      <a-spin :spinning="drawTagForm.loading">
        <a-row style="padding: 15px">
          <a-col span="24">
            <span style="font-size: 14"
              >📌给你的任务添加相关的标签吧！打造属于你自己的图片系列管理！</span
            >
          </a-col>
          <a-col span="24">
            <a-mentions
              style="width: 100%; text-align: left"
              v-model:value="drawTagForm.tagName"
              rows="3"
              placeholder="用@可以触发最近使用的标签哦！多个标签'空格符'隔开,最多5个标签。每个标签长度不超过16个字。~"
              :options="drawTagForm.tagNameOptions"
              @select="onChangeLabel"
            />
          </a-col>
        </a-row>
      </a-spin>
    </a-modal>
  </div>

  <a-modal v-model:open="isModalVisible" width="80%">
    <template #title> 图片查看 </template>
    <img :src="currentImage" style="width: 100%; height: auto" />
  </a-modal>

  <a-modal
    v-model:open="varyRegionForm.viewFlag"
    title="🎨Midjourney局部变化"
    style="top: 20px; width: 75%; height: auto"
  >
    <template #footer> </template>
    <iframe
      :src="varyRegionForm.varyRegionUrl"
      title="🎨Midjourney局部变化"
      style="width: 100%; height: 80vh"
    ></iframe>
  </a-modal>
</template>

<script lang="ts" setup>
  import { SvgIcon } from '/@/components/Icon';
  import Icon from '/@/components/Icon/Icon.vue';
  import { copyText as doCopyText } from '/@/utils/copyTextToClipboard';
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
  } from 'vue';
  import {
    DeleteOutlined,
    InfoCircleOutlined,
    DownloadOutlined,
    EyeFilled,
    EyeInvisibleFilled,
    SearchOutlined,
    DeleteFilled,
    HeartOutlined,
    ClockCircleOutlined,
    HeartFilled,
  } from '@ant-design/icons-vue';
  import { downloadByOnlineUrl } from '/@/utils/file/download';
  import {
    drawTaskList,
    addDrawTask,
    changePublic,
    delDrawTask,
    deleteBatch,
  } from '/@/api/df/drawTask';
  import {
    AddDrawTaskParams,
    DrawTaskListQueryReq,
    DrawTaskListResp,
    DrawTaskChangePublicReq,
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
  import { useUserStore } from '/@/store/modules/user';
  import 'vue-easy-lightbox/external-css/vue-easy-lightbox.css';
  import VueEasyLightbox from 'vue-easy-lightbox';
  import VueLazyload from 'vue-lazyload';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

  const userStore = useUserStore();
  //页面高度处理
  const button = ref(null);
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 0);
  const offsetHeightRef = ref(0);
  const subtractHeightRefs = ref([button]);
  const formRef = ref();
  // 使用hook
  const { contentHeight } = useContentHeight(
    computed(() => true),
    formRef,
    unref(subtractHeightRefs), // 使用 unref 获取数组值
    unref(substractSpaceRefs),
    upwardSpace,
    offsetHeightRef,
  );
  const { getIsMobile } = useAppInject();
  const loadingRef = ref(false);

  const copyText = async (text) => {
    const value = unref(text);
    if (!value) {
      message.warning('请输入要拷贝的内容！');
      return;
    }
    doCopyText(value);
  };

  //初始化加载
  const props = defineProps({
    spaceId: {
      type: String,
      default: '',
    },
  });
  const { spaceId } = toRefs(props);
  const loopQuery = ref(false);

  watch(spaceId, (newId) => {
    if (newId) {
      onSearchNoLoading();
    }
  });

  onMounted(() => {
    (window as any).varyRegionForm = varyRegionForm;
    // onSearch(1);
    loadTagList();
  });

  // 监听来自 iframe 的消息
  const handleMessage = (event: MessageEvent) => {
    // 验证消息来源和内容，然后关闭 iframe
    if (event.data === 'close_iframe') {
      varyRegionForm.value.viewFlag = false;
    }
  };

  onMounted(() => {
    window.addEventListener('message', handleMessage, false);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('message', handleMessage);
  });

  const handleDownloadByUrl = async (url: string) => {
    const path = url.split('?')[0];
    const segments = path.split('/');
    const fileName = segments[segments.length - 1];
    downloadByOnlineUrl(url, fileName);
    message.success('已添加下载任务~');
  };

  const searchForm = ref({
    tagName: null,
    state: '',
    commandType: '',
  });
  // const { notification, createErrorModal, createMessage } = useMessage()

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
  const isModalVisible = ref(false);
  const currentImage = ref('');

  const tagColor = (status) => {
    //状态 PENDING:排队中 EXECUTING:执行中 FINISHED:已完成 FAIL:失败 取消:CANCEL 中断：DOWN
    console.log(status);
    switch (status) {
      case 'SUCCESS':
        return '#339966';
      case 'FAILED':
        return '#cd201f';
      case 'CANCEL':
        return '#faeeef';
      case 'QUEUED':
        return '#b4b4a4';
      case 'RUNNING':
        return '#8cc0aa';
      case 'READY':
        return '#afcce0';
      case 'DOWN':
        return '#e4abb1';
      default:
        return 'default';
    }
  };

  const formattedPrompt = (prompt) => {
    const parts = prompt.split('\n\n').filter((part) => part.trim() !== '');
    return parts.map((part) => `<p>${part.trim()}</p>`).join('');
  };
  const splitPrompt = (prompt: string) => {
    return prompt.split(/\d️⃣/).filter(Boolean);
  };

  const deleteCard = async (card) => {
    const idReq: IdReq = { id: card.id };
    loadingRef.value = true;
    console.log('---------------------------------');
    await delDrawTask(idReq);
    onSearch(pagination.value.current);
  };

  const deleteHandle = async (state) => {
    loadingRef.value = true;
    try {
      console.log('---------------------------------');
      await deleteBatch({ spaceId: spaceId.value, state: state });
      onSearch(pagination.value.current);
      // message.success('删除成功！');
    } finally {
      loadingRef.value = false;
    }
  };

  // 页数改变的方法
  function pageSizeChange(val, pageNum) {
    pagination.value.pageSize = pageNum; // 修改每页显示的条数
    // pagination.value.current = 1
    onSearch(1);
  }
  // 点击上一页下一页的方法
  function pageChange(page, val) {
    console.log(page, val);
    // pagination.value.current = page
    onSearch(page);
  }

  const onSearchNoLoading = async () => {
    const params: DrawTaskListQueryReq = {
      spaceId: spaceId.value,
      tagName: searchForm.value.tagName,
      commandType: searchForm.value.commandType,
      state: searchForm.value.state,
      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
    };
    const response = await drawTaskList(params);
    loopQuery.value = response.records.some(
      (item) => item.state === 'QUEUED' || item.state === 'RUNNING' || item.state === 'READY',
    );
    if (loopQuery.value && intervalId == null) {
      intervalId = setInterval(() => {
        console.log('-----------------');
        if (loopQuery.value) {
          onSearchNoLoading(); // 调用你的函数
        }
      }, 3000); // 5秒
    } else {
      if (intervalId) {
        clearInterval(intervalId); // 清除定时器
      }
    }

    cards.value = response.records;
    pagination.value.total = response.total;
  };

  const onSearch = async (current?: number) => {
    console.log('************************' + spaceId.value);
    if (typeof current === 'undefined') {
      current = 1;
    }
    pagination.value.current = current;
    loadingRef.value = true;
    const params: DrawTaskListQueryReq = {
      tagName: searchForm.value.tagName,
      commandType: searchForm.value.commandType,
      spaceId: spaceId.value,
      state: searchForm.value.state,
      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
    };

    console.log(params);
    const response = await drawTaskList(params);
    loopQuery.value = response.records.some((item) => item.state === 'QUEUED');
    cards.value = response.records;
    pagination.value.total = response.total;

    loadingRef.value = false;
    console.log(111111111111);
  };
  let intervalId: ReturnType<typeof setInterval> | null = null;

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId); // 清除定时器
    }
  });

  const downloadImage = (image) => {
    const link = document.createElement('a');
    link.href = image.value;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
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
    console.log(card.collectFlag);
    if (card.collectFlag === 'Y') {
      const param: AddDrawCollectReq = {
        taskId: card.id,
        collectCategoryId: null,
      };
      await createCollect(param);
      message.success('已添加到收藏~~~');
      loadingRef.value = false;
      return;
    }

    const param: IdReq = {
      id: card.id,
    };
    await removeCollect(param);
    message.success('取消收藏~~~');
    loadingRef.value = false;
  };

  const handleU = async (card, index) => {
    // 这里的 event.key 将是您点击的菜单项的 key
    console.log('Selected card: ${JSON.stringify(card)}');
    const addTaskParam: AddDrawTaskParams = {
      spaceId: spaceId.value,
      refAccountId: null,
      channel: 'MJ',
      priority: 0,
      privacyMode: 'Y',
      commandType: 'UPSCALE',
      invokeTimes: 1,
      prompt: {
        index: index,
        commandType: 'UPSCALE',
        refTaskId: card.id,
      },
    };
    loadingRef.value = true;
    try {
      await addDrawTask(addTaskParam);
      message.success('添加任务成功~~~');
    } finally {
      loadingRef.value = false;
    }
    if (userSetting.value.taskRefresh) {
      onSearch();
    }
  };

  const handleZoom = async (card, type, event) => {
    console.log(11122);
    if ('zoom-cus' === event.key) {
      return;
    }
    // 这里的 event.key 将是您点击的菜单项的 key
    console.log('Selected card: ${JSON.stringify(card)}');
    console.log('Zoom option selected: ${event.key}');
    const addTaskParam: AddDrawTaskParams = {
      spaceId: spaceId.value,
      refAccountId: null,
      channel: 'MJ',
      priority: 0,
      privacyMode: 'Y',
      commandType: type,
      invokeTimes: 1,
      prompt: {
        customId: event.key,
        commandType: type,
        refTaskId: card.id,
      },
    };
    loadingRef.value = true;
    try {
      await addDrawTask(addTaskParam);
      message.success('添加任务成功~~~');
    } finally {
      loadingRef.value = false;
    }
    if (userSetting.value.taskRefresh) {
      onSearch();
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

    // 这里的 event.key 将是您点击的菜单项的 key
    console.log('Selected card: ${JSON.stringify(card)}');
    console.log('Zoom option selected: ${event.key}');
    const addTaskParam: AddDrawTaskParams = {
      spaceId: spaceId.value,
      refAccountId: null,
      channel: 'MJ',
      priority: 0,
      privacyMode: 'Y',
      commandType: type,
      invokeTimes: 1,
      prompt: {
        index: event.key,
        commandType: type,
        refTaskId: card.id,
      },
    };
    loadingRef.value = true;
    try {
      await addDrawTask(addTaskParam);
      message.success('添加任务成功~~~');
    } finally {
      loadingRef.value = false;
    }
    if (userSetting.value.taskRefresh) {
      onSearch();
    }
  };

  const handleV = async (card, type, key) => {
    if (remix.value.enable_flag) {
      showRemixCustomer(card, type, key);
      return;
    }
    console.log(55555);
    // 这里的 event.key 将是您点击的菜单项的 key
    console.log('Selected card: ${JSON.stringify(card)}');
    const addTaskParam: AddDrawTaskParams = {
      spaceId: spaceId.value,
      refAccountId: null,
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
      },
    };
    loadingRef.value = true;
    try {
      await addDrawTask(addTaskParam);
      message.success('添加任务成功~~~');
    } finally {
      loadingRef.value = false;
    }
    if (userSetting.value.taskRefresh) {
      onSearch();
    }
  };

  const handleDraw = async (card, event) => {
    // 这里的 event.key 将是您点击的菜单项的 key
    console.log('handleDraw card: ${JSON.stringify(card)}');
    const promptList = splitPrompt(card.prompt);
    console.log(promptList[event.key]);
    let promptArray: string[] = [];
    let prompt = '';
    if (event.key < 4) {
      // promptArray.push(promptList[event.key]);
      prompt = promptList[event.key];
    } else {
      const resultArray = promptList.map((item) => '/imagine:' + item);
      prompt = resultArray.join(' ');
      // promptArray = promptList;
    }
    const addTaskParam: AddDrawTaskParams = {
      refAccountId: null,
      spaceId: spaceId.value,
      channel: 'MJ',
      priority: 0,
      // refTaskId: null,
      privacyMode: 'Y',
      commandType: 'IMAGINE',
      invokeTimes: 1,
      prompt: {
        prompt: prompt,
        paramsDataMap: {},
        paramsStr: '',
        commandType: 'IMAGINE',
        bootId: card.bootId,
      },
    };
    loadingRef.value = true;
    try {
      await addDrawTask(addTaskParam);
      message.success('添加任务成功~~~');
    } finally {
      loadingRef.value = false;
    }
    if (userSetting.value.taskRefresh) {
      onSearch();
    }
  };

  /************************************* remix ************************** */

  const varyRegionForm = ref({
    viewFlag: false,
    varyRegionUrl: '',
    customId: '',
    token: '',
    card: null,
  });
  const openVaryRegion = (card, type, key) => {
    // MJ::Inpaint::1::a65a6904-6f26-43fd-93a2-db88a9a2d2a1::SOLO
    const customId = encodeURIComponent(key);
    console.log(customId);
    const token = userStore.getToken;
    varyRegionForm.value.card = card;
    varyRegionForm.value.customId = key;
    varyRegionForm.value.token = token;
    varyRegionForm.value.varyRegionUrl = '/mjTools.html?customId=' + customId;
    varyRegionForm.value.viewFlag = true;
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
  });
  const changeRemix = () => {
    remix.value.enable_flag = !remix.value.enable_flag;
    message.success(remix.value.enable_flag ? '已开启remix弹窗' : '已关闭remix弹窗');
  };

  const showZoomCustomer = (card) => {
    remixCard.value = card;
    remix.value.view = true;
    remix.value.loading = false;
    remix.value.commandType = 'ZOOM';
    remix.value.prompt = card.prompt + ' --zoom 2';
    remix.value.title = '自定义缩放（ZOOM OUT）';
    remix.value.secTitle = '⚠️仅支持--ar和--zoom 参数';
  };
  const showRemixCustomer = async (card, type, customId) => {
    console.log('===========');
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
    const addTaskParam: AddDrawTaskParams = {
      refAccountId: null,
      spaceId: spaceId.value,
      channel: 'MJ',
      priority: 0,
      // refTaskId: null,
      privacyMode: 'Y',
      commandType: remix.value.commandType,
      invokeTimes: 1,
      prompt: {
        prompt: remix.value.prompt,
        commandType: remix.value.commandType,
        variationType: remix.value.variationType,
        index: remix.value.index,
        refTaskId: remixCard.value.id,
        customId: remix.value.customId,
      },
    };
    loadingRef.value = true;
    try {
      await addDrawTask(addTaskParam);
      message.success('添加任务成功~~~');
      remix.value.view = false;
    } finally {
      loadingRef.value = false;
    }
    if (userSetting.value.taskRefresh) {
      onSearch();
    }
  };

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
    await addTag({ drawTaskId: drawTagForm.value.drawTaskId, tagName: drawTagForm.value.tagName });
    drawTagForm.value.loading = false;
    drawTagForm.value.viewFlag = false;
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
    searchForm.value.tagName = searchForm.value.tagName.replace(/@/g, '');
  };

  //*************************这里是图片切割的地方************************ */
  const visible = ref<boolean>(false);
  const setVisible = (value): void => {
    visible.value = value;
  };

  const setSlicedImageVisible = (value): void => {
    console.log('1111111111111111111111');
    visible.value = value;
  };

  /*********************************** 基础配置 ******************************** */
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

  /******************************灯箱**************** */
  const lightBoxOptions = reactive({
    visibleRef: false,
    indexRef: 0,
    imgsRef: [] as any[],
    currentItem: null,
  });

  const onPrevClick = (oldIndex, newIndex) => {
    console.log('onPrevClick oldIndex=' + oldIndex + ' newIndex=' + newIndex);
    lightBoxOptions.currentItem = lightBoxOptions.imgsRef[newIndex].item;
  };
  const onNextClick = (oldIndex, newIndex) => {
    console.log('onNextClick oldIndex=' + oldIndex + ' newIndex=' + newIndex);
    lightBoxOptions.currentItem = lightBoxOptions.imgsRef[newIndex].item;
  };

  const imageLoad = (item) => {
    item.load = true;
  };
  const index = ref(0);
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
  // 导出此方法以便外部访问
  defineExpose({ onSearch });
</script>

<style scoped>
  /* 增加移动端样式 */
  @media screen and (max-width: 767px) {
    .search-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .search-input {
      margin-top: 10px;
    }
  }

  :deep(.ant-card-body) {
    padding: 10px; /* 您想要的padding值 */
  }

  .app {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-width: 830px;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;

    /* height: 100vh; */
  }

  .search-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 10vh;
    padding: 20px;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(235px, 1fr));
    flex: 1;
    align-content: start;
    padding: 5px;
    overflow: auto;
    gap: 7px;
  }

  .card {
    min-width: 235px;
    border-radius: 7%;
  }

  .card >>> img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 7%;

    /* height: 150px; */
  }

  .card >>> .ant-image-mask {
    border-radius: 7%;
  }

  .pagination {
    display: flex;
    align-content: center;
    align-items: center; /* 垂直居中 */
    height: 9vh;

    /* padding: 20px; */
  }

  .card-image img {
    position: relative;
    align-content: center;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 用于控制图片的宽高比 */
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    cursor: pointer;
  }

  /* .card-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    cursor: pointer;
  } */

  .card-tags {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    margin-right: 5px;
    margin-left: 5px;
  }

  .card-actions {
    display: flex;
    gap: 0;
  }

  .image-tag {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }

  .tag-public {
    background-color: transparent;
    color: rgb(255 255 255);
  }

  .card-status {
    display: flex;
    align-items: center;
  }

  .status-tag {
    margin-right: 10px;
  }

  .visibility-tag {
    margin-right: 10px;
  }

  .icon-public {
    color: #16c82b;
  }

  .icon-private {
    color: #8c8c8c;
  }

  .card-date-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;
    margin-right: 5px;
    margin-left: 5px;
  }

  .card-date {
    color: #8c8c8c;
    font-size: 0.8em;
  }

  .search-card {
    height: 50px;
    padding-right: 10px;
    padding-left: 10px;
    border-radius: 4px;
  }

  .search-row {
    margin: 0 !important;
  }

  .search-button {
    width: 100%;
  }

  .a-radio-group {
    display: flex;
    justify-content: flex-start;
  }

  .search-input {
    display: flex;
    justify-content: flex-end;
  }

  :deep(.ant-tooltip-inner) {
    width: auto !important;
    min-width: 600px; /* 设置你想要的最大宽度 */
  }

  .custom-radio-group span.anticon {
    vertical-align: -0.125em !important;
  }

  .delete span.anticon {
    vertical-align: -0.125em !important;
  }

  .quality-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 32px;
    margin-right: 0;
    font-size: 15px;
  }

  .vel-img-title {
    display: -webkit-box;
    position: absolute;
    bottom: 60px;
    left: 50%;
    max-width: 80%;
    overflow: hidden;
    transform: translate(-50%);
    transition: opacity 0.15s;
    opacity: 0.8;
    color: #ccc;
    font-size: 12px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: normal; /* 使用normal来允许多行文本 */
    cursor: default;
    -webkit-line-clamp: 4; /* 限制最多显示3行文本 */
    -webkit-box-orient: vertical;
  }

  .opt-top-center >>> .vel-toolbar {
    top: 5px;
    bottom: initial;
    left: 50%;
  }
</style>
