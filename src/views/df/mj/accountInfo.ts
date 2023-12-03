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

import { ListQueryParams, ListResultModel, AccountListItem } from '/@/api/df/model/accountModel';
import { availableList, getChannelsByGroup } from '/@/api/df/account';
import type { UploadFile } from 'ant-design-vue/es/upload/interface';
import { message, UploadProps, Upload } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '/@/store/modules/user';
import { useMessage } from '/@/hooks/web/useMessage';

const userStore = useUserStore();

const { createMessage, createSuccessModal, createErrorModal, createInfoModal } = useMessage();

let accountInstance: any | null = null;
export const loadingRef = ref(false);

//查询相关API
export function accountInfoApi() {
  if (accountInstance) {
    return accountInstance;
  }

  const accountForm = reactive({
    loading: false,
    useAccountId: null as string | null | undefined,
    useChannelId: null as string | null | undefined,
    mode: 'relax' as string | undefined,
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
  });

  const initAccountInfo = async () => {
    //初始化偏好
    const getPersonalSetting = userStore.getPersonalSetting;
    console.log('getPersonalSetting ' + getPersonalSetting);
    if (getPersonalSetting) {
      accountForm.mode = getPersonalSetting.mode;
      const isAvaliable = accountForm.accountSelector.options.some((obj) =>
        obj.value.includes(getPersonalSetting.userAccountId as string),
      );
      if (isAvaliable && getPersonalSetting.userAccountId != '') {
        accountForm.useAccountId = getPersonalSetting.userAccountId;
        //渲染频道下拉
        await doGetChannelsByGroup(accountForm.useAccountId);
        accountForm.useChannelId = getPersonalSetting.useChannelId;
        console.log(getPersonalSetting.useChannelId);
        const channelAvaliable = accountForm.channelSelector.options.some((obj) =>
          obj.value.includes(getPersonalSetting.useChannelId as string),
        );
        if (!channelAvaliable) {
          accountForm.useChannelId = null;
          userStore.syncSetting({ userAccountId: null });
        }
      } else {
        userStore.syncSetting({ userAccountId: null });
      }
    }
  };

  const doGetChannelsByGroup = async (id) => {
    accountForm.loading = true;
    try {
      const response = await getChannelsByGroup({ id: id });
      // 使用 map 方法转换数组
      const transformedList = response.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
      const finalList = [...transformedList];
      accountForm.channelSelector.options = finalList;
    } finally {
      accountForm.loading = false;
    }
  };

  const handleAccountSetting = async (value, option) => {
    const setting = {};
    setting['userAccountId'] = value;
    setting['userAccountName'] = option.label;
    userStore.syncSetting(setting);
    accountForm.useChannelId = null;
    await doGetChannelsByGroup(value);
  };

  const handleSetting = (key, value) => {
    const setting = {};
    setting[key] = value;
    userStore.syncSetting(setting);
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
    const finalList = [...transformedList];
    accountForm.accountSelector.options = finalList;
  };

  const api = {
    accountForm,
    initAccountList,
    handleAccountSetting,
    handleSetting,
    initAccountInfo,
    doGetChannelsByGroup,
  };
  accountInstance = api;
  return api;
}
