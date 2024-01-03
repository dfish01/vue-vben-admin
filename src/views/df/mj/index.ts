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
import { WorkSpaceListResp, WorkSpaceSaveReq } from '/@/api/df/model/workSpaceModel'; // 请替换为您的请求模型路径
import {
  saveUserSpace,
  deleteSpace,
  allUserSpace,
  importMessage,
  channelList,
  genCode,
  setTop,
} from '/@/api/df/workSpace';
import { notification, message, UploadProps, Upload } from 'ant-design-vue';
import type { NotificationPlacement } from 'ant-design-vue';
import { ListQueryParams, ListResultModel, AccountListItem } from '/@/api/df/model/accountModel';
import { availableList, getChannelsByGroup } from '/@/api/df/account';
import type { UploadFile } from 'ant-design-vue/es/upload/interface';
import { useRoute } from 'vue-router';
import { useMessage } from '/@/hooks/web/useMessage';
import { getCustomCache, setCustomCache } from '/@/utils/custom';
import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
import { MJ_TASK_ACCOUNT_KEY } from '/@/enums/cacheEnum';
import { accountInfoApi } from './accountInfo';
import { downloadImage, copyText } from './tools';
import { addSuggest, communicateInfo, tutorialInfo, systemInfo } from '/@/api/df/utils';

const {
  accountForm,
  accountViewForm,
  initAccountList,
  initAccountInfo,
  doGetChannelsByGroup,
  handleAccountSetting,
  handleSetting,
} = accountInfoApi();
const { createMessage, createSuccessModal, createErrorModal, createInfoModal } = useMessage();

let spaceInfoInstance: any | null = null;
let systemInfoInstance: any | null = null;
export const loadingRef = ref(false);

//查询相关API
export function spaceInfoApi() {
  if (spaceInfoInstance) {
    return spaceInfoInstance;
  }

  // 主table 数据,工作空间数据
  const tableData = ref<WorkSpaceListResp[]>([
    // 更多数据...
  ]);

  const compState = reactive({
    absolute: true,
    loading: false,
    tip: '加载中...',
  });

  const doSetTop = async (record) => {
    compState.loading = true;
    try {
      await setTop({ id: record.id });
      querySpace();
    } finally {
      compState.loading = false;
    }
  };

  //显示工作空间
  const doGenCode = async (record, placement: NotificationPlacement) => {
    const result = await genCode({ id: record.id });
    copyText(result);
    notification.open({
      message: '【' + result + '】空间码生成成功！已复制到剪切板~',
      description: '导入的空间编码在5分钟内有效，请及时使用~',
      placement,
    });
  };

  const isShowWorkSpace = ref(false);
  const isShowUserSpaceSave = ref(false);
  const userSpaceFormRef = ref();
  const userSpaceForm = reactive<WorkSpaceSaveReq>({
    id: null,
    title: '',
    remark: '',
  });

  //显示工作空间
  const showWorkerSpace = () => {
    isShowWorkSpace.value = true;
    compState.loading = false;
  };

  const closeWorkSpace = () => {
    isShowWorkSpace.value = false;
    compState.loading = false;
  };

  //工作空间列表
  const querySpace = async () => {
    compState.loading = true;
    try {
      const response = await allUserSpace({});
      console.log(response);
      tableData.value = response;
      // 使用 map 方法转换数组
      const transformedList = response.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
      const finalList = [{ label: '请选择导入空间', value: '' }, ...transformedList];
      accountViewForm.spaceOptions = finalList;
    } finally {
      compState.loading = false;
    }
  };

  //改用全局共享变量
  const selectSpace = (item) => {
    accountForm.currentSpaceId = item.id;
    accountForm.currentSpaceTitle = item.title;

    isShowWorkSpace.value = false;
  };

  const addUserSpace = (item) => {
    if (item) {
      for (const key in userSpaceForm) {
        if (item[key] !== undefined) {
          userSpaceForm[key] = item[key];
        }
      }
    } else {
      userSpaceForm.id = null;
      userSpaceForm.title = '';
      userSpaceForm.remark = '';
    }
    isShowUserSpaceSave.value = true;
  };

  const onSubmitUserSpace = async () => {
    try {
      compState.loading = true;
      await userSpaceFormRef.value.validate();
      console.log('Form is valid, submitting...');
      await saveUserSpace(userSpaceForm);
      isShowUserSpaceSave.value = false;
      querySpace();
    } catch (error) {
      console.log('Form validation failed:', error);
    } finally {
      compState.loading = false;
    }
  };
  const deleteHandle = async (id) => {
    compState.loading = true;
    console.log('Form is valid, submitting...');
    try {
      await deleteSpace({ id });
      querySpace();
    } finally {
      compState.loading = false;
    }
  };

  const api = {
    tableData,
    isShowWorkSpace,
    isShowUserSpaceSave,
    userSpaceFormRef,
    compState,

    doSetTop,
    querySpace,
    doGenCode,
    userSpaceForm,
    showWorkerSpace,
    closeWorkSpace,
    selectSpace,
    addUserSpace,
    onSubmitUserSpace,
    deleteHandle,
  };
  spaceInfoInstance = api;
  return api;
}

//系统加载相关
export function systemInfoApi() {
  if (systemInfoInstance) {
    return systemInfoInstance;
  }
  const systemInfoForm = ref({
    loaded: false,
    groupInfo: null,
    afterSaleInfo: null,
    tutorialInfo: null,
  });

  const viewForm = ref({
    viewFlag: false,
    loading: false,
    content: '',
    title: '',
  });

  //加载配置
  const loadSystemInfoConfig = async () => {
    console.log('loadSystemInfoConfig');
    if (systemInfoForm.value.loaded) {
      return;
    }
    const resp = await systemInfo();
    systemInfoForm.value = resp;
    systemInfoForm.value.loaded = true;
  };

  const openCommunicateView = async () => {
    viewForm.value.content = systemInfoForm.value.groupInfo;
    viewForm.value.title = '交流群';
    viewForm.value.viewFlag = true;
  };

  const openTutorialView = async () => {
    viewForm.value.content = systemInfoForm.value.tutorialInfo;
    viewForm.value.title = '教程信息';
    viewForm.value.viewFlag = true;
  };
  const closeView = () => {
    viewForm.value.content = null;
    viewForm.value.title = '';
    viewForm.value.viewFlag = false;
  };

  const handleImageLoad = async () => {
    viewForm.value.communicateLoading = false;
  };

  // const openTutorial = async () => {
  //   if (systemInfoForm.value.tutorialInfo) {
  //     window.open(systemInfoForm.value.tutorialInfo, '_blank');
  //   }
  // };

  const api = {
    systemInfoForm,
    viewForm,
    loadSystemInfoConfig,
    openCommunicateView,
    openTutorialView,
    closeView,
    handleImageLoad,
  };
  systemInfoInstance = api;
  return api;
}
