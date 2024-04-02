<template>
  <a-layout class="app" ref="formRef">
    <StoryInfo :storySplitForm="storySplitForm" />
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, unref, nextTick } from 'vue';
  import StoryInfo from './story_info.vue';
  import { Loading } from '/@/components/Loading';
  import Icon from '/@/components/Icon/Icon.vue';
  import {
    ListQueryParams,
    AccountListItem,
    ChangeAuthParams,
    AccountAuthListResp,
    AccountStatisticsModel,
  } from '/@/api/df/model/accountModel';
  import {
    queryList,
    changeAuth,
    del,
    deleteAuth,
    activeAuthAccount,
    accountAuthList,
    createAccountAuth,
    disabledAccount,
    addOwnerAccount,
    getAccountStatisticalInfo,
    appendDiscordAccount,
    setDefault,
    getGroupAccounts,
  } from '/@/api/df/account';
  import AccountDetailsModal from './accountDetailsModal.vue';
  import { IdReq } from '/@/api/model/baseModel';
  import Goods from './goods.vue';
  import AccountGroup from './account_group.vue';
  import { deployNewGoods, deploySecondHandGoods, cancelSecondHandGoods } from '/@/api/df/goods';
  import Discord from './discord.vue';
  import { message } from 'ant-design-vue';
  import {
    discordAddToken,
    discordList,
    discordInfo,
    channelList,
    guildList,
  } from '/@/api/df/discord';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { discordApi } from './discord';
  import { useGo } from '/@/hooks/web/usePage';
  import { func } from 'vue-types';
  import { getCustomLocalCache, setCustomLocalCache } from '/@/utils/custom';
  import { MJ_ACCOUNT_TOUR } from '/@/enums/cacheEnum';
  import { userStep } from '/@/api/df/user';
  import { useUserStore } from '/@/store/modules/user';
  import { useRoute } from 'vue-router';

  const userStore = useUserStore();
  const userInfo = ref(userStore.getUserInfo); // 直接赋值

  /** 页面高度计算开始 */
  const button = ref(null);
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 0);
  const offsetHeightRef = ref(0);
  const subtractHeightRefs = ref([button]);
  const formRef = ref();
  // 使用hook
  const { contentHeight, redoHeight } = useContentHeight(
    computed(() => true),
    formRef,
    unref(subtractHeightRefs), // 使用 unref 获取数组值
    unref(substractSpaceRefs),
    upwardSpace,
    offsetHeightRef,
  );

  const { createMessage, createSuccessModal, createErrorModal, createInfoModal } = useMessage();
  const {
    accountFormRef,
    accountForm,
    onAdd,
    onSelectDiscordUser,
    onSelectGuild,
    queryDiscordList,
  } = discordApi();

  const route = useRoute();

  const storyId = ref(route.query.storyId || 'storyId');

  //查询
  const search = ref({
    ownerFlag: null,
    accountName: '',
    accountStatus: null,
  });
  // 分页
  const pagination = ref({
    // 表格分页的配置
    current: 1,
    pageSize: 10,
    showSizeChanger: true, // 用于控制展示每页多少条的下拉
    showQuickJumper: true,
    total: 0,
    pageSizeOptions: ['10', '20', '50'],
    showTotal: (total) => `共 ${total} 条`,
    onShowSizeChange: pageSizeChange,
    onChange: pageChange,
  });

  const onReset = () => {
    search.value = {
      ownerFlag: null,
      accountName: '',
      accountStatus: null,
    };
  };
  // 页数改变的方法
  function pageSizeChange(val, pageNum) {
    pagination.value.pageSize = pageNum; // 修改每页显示的条数
    pagination.value.current = 1;
    onSearch();
  }
  // 点击上一页下一页的方法
  function pageChange(page, val) {
    console.log(page, val);
    pagination.value.current = page;
    onSearch();
  }

  const globalLoading = ref(false);
  const onSearch = async () => {
    globalLoading.value = true;
    try {
      const params: ListQueryParams = search.value;
      params.current = pagination.value.current;
      params.pageSize = pagination.value.pageSize;
      console.log(params);
      const response = await queryList(params);
      tableData.value = response.records;
      pagination.value.total = response.total;
    } finally {
      globalLoading.value = false;
    }
  };

  onMounted(async () => {
    await onSearch();
    queryDiscordList({});
    await nextTick();
    accountStepOpen(true);
  });

  // 主table 数据
  const tableData = ref<AccountListItem[]>([
    // 更多数据...
  ]);

  //授权列表相关 开始
  const authListForm = ref({
    tabKey: 'TIMES',
    accountId: null,
    loading: false,
    isAuthModalVisible: false,
    authList: {},
  });
  const authListTableData = ref<AccountAuthListResp[]>([
    // 更多数据...
  ]);

  const timeAuthColumns = [
    // { title: 'ID', dataIndex: 'id', key: 'id', hidden: true },
    // { title: '授权码', dataIndex: 'authCode', key: 'authCode', width: 100 },
    { title: '激活用户', dataIndex: 'activeUserEmail', key: 'activeUserEmail', width: 100 },
    { title: '激活时间', dataIndex: 'gmtActive', key: 'gmtActive', width: 100 },
    { title: 'Turbo次数', dataIndex: 'turboTimes', key: 'turboTimes', width: 100 },
    { title: 'Fast次数', dataIndex: 'fastTimes', key: 'fastTimes', width: 100 },
    { title: 'Relax次数', dataIndex: 'relaxTimes', key: 'relaxTimes', width: 100 },
    { title: '提交任务数', dataIndex: 'maxSubmit', key: 'maxSubmit', width: 100 },
    { title: '并发线程数', dataIndex: 'conExecute', key: 'conExecute', width: 100 },
    { title: '生成时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 100 },
    { title: '授权方式', dataIndex: 'authWayLabel', key: 'authWayLabel', width: 100 },
    { title: '天数/效期', dataIndex: 'authDays', key: 'authDays', width: 100 },
  ];
  const integralAuthColumns = [
    // { title: 'ID', dataIndex: 'id', key: 'id', hidden: true },
    // { title: '授权码', dataIndex: 'authCode', key: 'authCode', width: 100 },
    { title: '激活用户', dataIndex: 'activeUserEmail', key: 'activeUserEmail', width: 100 },
    { title: '激活时间', dataIndex: 'gmtActive', key: 'gmtActive', width: 100 },
    { title: '积分', dataIndex: 'score', key: 'score', width: 100 },
    { title: '提交任务数', dataIndex: 'maxSubmit', key: 'maxSubmit', width: 100 },
    { title: '并发线程数', dataIndex: 'conExecute', key: 'conExecute', width: 100 },
    { title: '生成时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 100 },
    { title: '授权方式', dataIndex: 'authWayLabel', key: 'authWayLabel', width: 100 },
    { title: '天数/效期', dataIndex: 'authDays', key: 'authDays', width: 100 },
  ];

  const changeBillingCount = async (activeKey) => {
    // 显示授权列表
    authListForm.value.loading = true;
    try {
      authListTableData.value = await accountAuthList({
        accountId: authListForm.value.accountId,
        source: 'MJ',
        billingMethod: activeKey,
      });
    } finally {
      authListForm.value.loading = false;
    }
  };
  const showAuthorizationList = async (id) => {
    // 显示授权列表
    authListForm.value.loading = true;
    authListForm.value.accountId = id;
    authListForm.value.tabKey = 'TIMES';
    try {
      authListForm.value.isAuthModalVisible = true;
      changeBillingCount(authListForm.value.tabKey);
    } finally {
      authListForm.value.loading = false;
    }
  };
  const closeAuthModal = () => {
    authListForm.value.isAuthModalVisible = false;
  };
  //授权列表相关 结束

  //**************************************新增或者编辑 ****************************************************//

  const onSubmitAdd = async () => {
    // if (accountForm.value.accountName === '' || accountForm.value.accountName === null) {
    //   createMessage.error('请输入账号名！');
    //   return;
    // }
    // if (accountForm.value.discordUserId === '' || accountForm.value.discordUserId === null) {
    //   createMessage.error('请选择执行账号！');
    //   return;
    // }
    // if (accountForm.value.guildId === '' || accountForm.value.guildId === null) {
    //   createMessage.error('请选择执行服务器！');
    //   return;
    // }
    // if (accountForm.value.channelId === '' || accountForm.value.channelId === null) {
    //   createMessage.error('请选择执行频道！');
    //   return;
    // }
    // 提交新增账户的数据
    accountForm.value.loading = true;
    try {
      await accountFormRef.value.validate();
      await addOwnerAccount(accountForm.value);
      accountForm.value.viewFlag = false;
      onSearch();
    } finally {
      accountForm.value.loading = false;
    }
  };

  const deleteAccount = async (id) => {
    // 删除账户
    globalLoading.value = true;
    const param: IdReq = { id: id };
    try {
      await del(param);
      onSearch();
    } finally {
      globalLoading.value = false;
    }
  };

  const doSetDefault = async (id) => {
    globalLoading.value = true;
    try {
      await setDefault({ id: id });
    } finally {
      globalLoading.value = false;
    }
  };

  const getStateContent = (state) => {
    if (state === 'normal') {
      return { text: '正常', color: '#52c41a', status: 'processing' };
    } else if (state === 'error') {
      return { text: '异常', color: '#ff4d4f', status: 'error' };
    } else if (state === 'unvalid') {
      return { text: '待验证', color: '#d9d9d9', status: 'warning' };
    } else if (state === 'sale') {
      return { text: '出售中', color: '#337357', status: 'warning' };
    } else {
      return { text: '过期', color: '#d9d9d9', status: 'default' };
    }
  };

  const getDiscordStateContent = (state) => {
    if (state === 'NORMAL') {
      return { text: '正常', color: '#52c41a', status: 'processing' };
    } else if (state === 'EXPIRED') {
      return { text: '过期', color: '#ff4d4f', status: 'error' };
    } else if (state === 'VERIFY_HUMAN') {
      return { text: '验证人类', color: '#d9d9d9', status: 'warning' };
    } else {
      return { text: '未知', color: '#d9d9d9', status: 'default' };
    }
  };

  const getMjStateContent = (state) => {
    console.log('getMjStateContent   ' + state);
    if (state === 'NORMAL') {
      return { text: '已订阅', color: '#52c41a', status: 'processing' };
    } else if (state === 'BAN') {
      return { text: 'BAN', color: '#ff4d4f', status: 'error' };
    } else if (state === 'STOP') {
      return { text: '未订阅', color: '#d9d9d9', status: 'default' };
    } else {
      return { text: '未知', color: '#d9d9d9', status: 'default' };
    }
  };

  /*****************************追加账户*************************************** */
  const accountModifiedForm = ref({
    viewFlag: false,
    loading: false,
    id: null,
    accountName: null,
    discordUserIds: null as string[] | null,
    discordFilterUserOptions: [] as { label: string; value: string }[],
  });

  const showAccountModified = async (record) => {
    accountModifiedForm.value.accountName = record.accountName;
    accountModifiedForm.value.id = record.id;
    accountModifiedForm.value.viewFlag = true;
    accountModifiedForm.value.loading = true;
    try {
      const resp = await getGroupAccounts({ id: record.id });
      accountModifiedForm.value.discordUserIds = resp;
      const response = await discordList({ guildId: record.guildId });
      // 使用 map 方法转换数组
      const transformedList = response.map((item) => ({
        label: item.globalName,
        value: item.id,
      }));
      // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
      const finalList = [...transformedList];
      accountModifiedForm.value.discordFilterUserOptions = finalList;
    } catch (e) {
      console.log(e);
      accountModifiedForm.value.loading = false;
    } finally {
      accountModifiedForm.value.loading = false;
    }
  };

  const onAppendDiscordAccount = async () => {
    accountModifiedForm.value.loading = true;
    try {
      await appendDiscordAccount(accountModifiedForm.value);
      accountModifiedForm.value.viewFlag = false;
      onSearch();
    } finally {
      accountModifiedForm.value.loading = false;
    }
  };

  //******************************账号统计相关***********************************/

  const statisticsForm = ref({
    viewFlag: false,
    loading: false,
    formData: {} as AccountStatisticsModel,
  });
  const isDetailsModalVisible = ref(false);
  const showDetails = async (id: string) => {
    console.log('11111');
    statisticsForm.value.viewFlag = true;
    statisticsForm.value.loading = true;
    try {
      const resp = await getAccountStatisticalInfo({ id: id });
      statisticsForm.value.formData = resp;
    } finally {
      statisticsForm.value.loading = false;
    }
  };
  const closeDetail = () => {
    statisticsForm.value.viewFlag = false;
  };

  // 更新模态窗口的可见性，由子组件触发
  const updateModalVisible = (value: boolean) => {
    isDetailsModalVisible.value = value;
  };

  /************************************发布商品********************************* */
  const deployGoodsFormRef = ref();
  const deployGoodsForm = ref({
    loading: false,
    isActiveVisible: false,
    goodsTitle: null,
    goodsRemark: null,
    goodsPrice: null,
    oriGoodsPrice: null,
    stock: null,
    accountId: null,
    otherInfo: {
      authType: 'DAY',
      authDays: null,
      maxNumExecute: 300,
      authExpireTimes: null,

      turboTimes: null,
      fastTimes: null,
      relaxTimes: null,
      maxSubmit: null,
    },
  });
  const showDeployGoods = async (card) => {
    deployGoodsForm.value.isActiveVisible = true;
    deployGoodsForm.value.accountId = card.id;
    deployGoodsForm.value.maxNumExecute = card.maxSubmit;

    deployGoodsForm.value.stock = null;
    deployGoodsForm.value.otherInfo.turboTimes = null;
    deployGoodsForm.value.otherInfo.fastTimes = null;
    deployGoodsForm.value.otherInfo.relaxTimes = null;
    deployGoodsForm.value.otherInfo.maxSubmit = null;
    deployGoodsForm.value.authDays = null;
    deployGoodsForm.value.authExpireTimes = null;
  };

  const hideDeployGoods = async () => {
    createAuthForm.value.isActiveVisible = false;
  };
  const onDeployGoods = async () => {
    deployGoodsForm.value.loading = true;
    try {
      await deployGoodsFormRef.value.validate();
      await deployNewGoods(deployGoodsForm.value);

      deployGoodsForm.value.isActiveVisible = false;
      // onSearch();
    } finally {
      deployGoodsForm.value.loading = false;
    }
  };

  /************************************发布二手商品********************************* */
  const redeployFormRef = ref();
  const redeployForm = ref({
    loading: false,
    isActiveVisible: false,
    goodsTitle: null,
    goodsRemark: null,
    goodsPrice: null,
    accountId: null,
  });

  const showRedeploy = async (card) => {
    redeployForm.value.isActiveVisible = true;
    redeployForm.value.accountId = card.id;
  };

  const hideRedeploy = async () => {
    redeployForm.value.isActiveVisible = false;
  };

  const onRedeploy = async () => {
    redeployForm.value.loading = true;
    try {
      await redeployFormRef.value.validate();
      await deploySecondHandGoods(redeployForm.value);
      const foundItem = tableData.value.find((item) => item.id === redeployForm.value.accountId);
      foundItem.state = 'sale';

      redeployForm.value.isActiveVisible = false;
      // onSearch();
    } finally {
      redeployForm.value.loading = false;
    }
  };

  const doCancelSecondHandGoods = async (card) => {
    globalLoading.value = true;
    try {
      const state = await cancelSecondHandGoods({ id: card.id });
      card.state = state;
    } finally {
      globalLoading.value = false;
    }
  };

  /************************************生成授权********************************* */
  //生成账户授权
  const createAuthFormRef = ref();
  const createAuthForm = ref({
    loading: false,
    isActiveVisible: false,
    num: null,
    accountId: null,
    authType: 'DAY',
    authDays: null,
    maxNumExecute: 300,
    authExpireTimes: null,
    billingMethod: 'TIMES',
    otherInfo: {
      score: 100,
      turboTimes: null,
      fastTimes: null,
      relaxTimes: null,
      maxSubmit: null,
      conExecute: null,
    },
  });
  const showCreateAuth = async (card) => {
    createAuthForm.value.isActiveVisible = true;
    createAuthForm.value.accountId = card.id;
    createAuthForm.value.maxNumExecute = card.maxSubmit;

    createAuthForm.value.num = null;
    createAuthForm.value.otherInfo.turboTimes = null;
    createAuthForm.value.otherInfo.fastTimes = null;
    createAuthForm.value.otherInfo.relaxTimes = null;
    createAuthForm.value.otherInfo.maxSubmit = null;
    createAuthForm.value.otherInfo.conExecute = null;

    createAuthForm.value.authDays = null;
    createAuthForm.value.authExpireTimes = null;
  };

  const onHideCreateAuth = async () => {
    createAuthForm.value.isActiveVisible = false;
  };
  const onCreateAuth = async () => {
    createAuthForm.value.loading = true;
    try {
      await createAuthFormRef.value.validate();
      await createAccountAuth(createAuthForm.value);
      createMessage.success('已成功创建授权码~');
      createAuthForm.value.isActiveVisible = false;
      // onSearch();
    } finally {
      createAuthForm.value.loading = false;
    }
  };

  /**
   * 删除授权
   */
  const doDeleteAuth = async (id, accountId) => {
    globalLoading.value = true;
    try {
      await deleteAuth({ id: id });
      authListForm.value.isAuthModalVisible = true;
      authListTableData.value = await accountAuthList({ accountId: accountId, source: 'MJ' });
    } finally {
      globalLoading.value = false;
    }
  };

  const onChangePicker = (value: [Dayjs, Dayjs], dateString: [string, string]) => {
    createAuthForm.value.authDays = dateString;
  };
  const changeAuthWay = () => {
    if (createAuthForm.value.authWay === 'DAY') {
      createAuthForm.value.authDays = '1';
    } else if (createAuthForm.value.authWay === 'TIME') {
      createAuthForm.value.authDays = '';
      createAuthForm.value.authExpireTimes = null;
    }
  };

  //激活账户相关
  const activeData = ref({
    loading: false,
    isActiveVisible: false,
    activeCode: '',
  });

  const onShowActive = async () => {
    activeData.value.isActiveVisible = true;
  };

  const onActiveAccount = async () => {
    activeData.value.loading = true;
    try {
      await activeAuthAccount(activeData.value);
      activeData.value.isActiveVisible = false;
      message.success('🎉恭喜！你已成功激活一个账户！');
      onSearch();
    } finally {
      activeData.value.loading = false;
    }
  };

  /******************* 店铺跳转 ***************** */

  //跳转商品页面
  const go = useGo();
  const goThirdShop = async (uri) => {
    go(uri);
  };
  const closeModal = () => {
    isDetailsModalVisible.value = false;
  };

  /************************漫游引导********************** */
  const activeStep = ref(null);
  const goodsStep = ref(null);
  const discordStep = ref(null);
  const accountGroupStep = ref(null);

  const accountStep = ref({
    open: false,
    current: 0,
    steps: [
      {
        title: '托管账号',
        description:
          '如果有自己的Discord账号，可以先获取Discord的token然后到Discord账号页签进行账号一键托管。',
        placement: 'center',
      },
      {
        title: '账号组',
        description:
          '托管Discord账号后即可点击这里进行创建Discord账号组，账号组是一个Discord的集合，用于突破Midjourney并发上限！',
        placement: 'right',
        target: () => accountGroupStep.value && accountGroupStep.value.$el,
      },

      {
        title: '激活账号',
        description:
          '如果你从集市或者朋友那分享获取到了授权码，可以点这里进行激活。激活后你就可以使用该账号进行作图了~',
        placement: 'right',
        target: () => activeStep.value && activeStep.value.$el,
      },
      {
        title: '商品集市',
        description: '如果你没有自己的账号，并且需要进行作图。可以考虑到这里购买~',
        placement: 'right',
        target: () => goodsStep.value && goodsStep.value.$el,
      },
    ],
  });

  const accountStepClosed = async (val) => {
    accountStep.value.open = val;
  };

  const accountStepOpen = async (val) => {
    // if (val === true) {
    //   const needShow = getCustomLocalCache(MJ_ACCOUNT_TOUR);
    //   if (needShow && needShow === true) {
    //     return;
    //   }
    //   setCustomLocalCache(MJ_ACCOUNT_TOUR, true);
    // }

    const userInfo = userStore.getUserInfo; // 直接赋值

    if (userInfo.coursePop === 2 || userInfo.coursePop == 3) {
      return;
    }
    accountStep.value.open = val;
    const resp = await userStep({ content: 'MJ_ACCOUNT_TOUR' });
    userInfo.coursePop = resp;
    userStore.setUserInfo(userInfo);
    indexStep.value.open = val;
  };

  defineExpose({
    closeModal,
    accountStepOpen,
  });
</script>

<style scoped>
  .quality-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 32px;
    margin-right: 0;
    font-size: 15px;
  }

  .app {
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100%;

    /* overflow-y: auto; */
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    flex: 1;
    align-content: start;
    margin-top: 10px;
    padding: 10px;
    overflow: auto;
    gap: 14px;
  }

  .card {
    min-width: 300px;
    border-radius: 7%;
  }

  .card >>> .ant-card-extra {
    margin-left: 0;

    /* height: 150px; */
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
    height: 53px;

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

  .card-tags {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;
    margin-right: 0;
    margin-left: 0;
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

  .account-card >>> .ant-card-head {
    padding: 0 10px;
  }
</style>
