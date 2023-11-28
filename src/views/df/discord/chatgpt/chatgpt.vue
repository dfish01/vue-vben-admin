<template>
  <div class="app" ref="formRef">
    <Loading :loading="globalLoading" :absolute="false" tip="正在加载中..." />
    <a-row style="height: 55px">
      <a-col :span="24">
        <a-card
          style="display: flex; align-items: center; height: 100%"
          :bodyStyle="{ padding: '0 5px 0px 24px' }"
        >
          <a-form layout="inline">
            <a-form-item>
              <a-input v-model:value="searchForm.accountName" placeholder="输入账号名称" />
            </a-form-item>
            <a-form-item>
              <a-select
                v-model:value="searchForm.authType"
                placeholder="账号权限"
                style="width: 150px"
              >
                <a-select-option value="A">授权</a-select-option>
                <a-select-option value="O">主账号</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                v-model:value="searchForm.state"
                placeholder="账户状态"
                style="width: 150px"
              >
                <a-select-option value="N">禁用</a-select-option>
                <a-select-option value="Y">正常</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item>
              <a-space>
                <a-button-group>
                  <a-button @click="onSearch">查询</a-button>
                  <a-button @click="onReset">重置</a-button>
                </a-button-group>
                <a-button-group>
                  <a-button type="primary" @click="onAdd">新增账户</a-button>
                  <a-button @click="onShowActive">授权激活</a-button>
                </a-button-group>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
    <div
      v-if="tableData.length === 0"
      style="display: flex; align-items: center; justify-content: center"
      :style="{ height: `calc(${contentHeight}px - 75px)`, overflow: 'auto' }"
    >
      <a-empty :image="simpleImage" />
    </div>
    <div
      v-else
      class="cards"
      :style="{
        height: `calc(${contentHeight}px - 75px)`,
        overflow: 'auto',
        padding: '0px 10px',
      }"
    >
      <div v-for="card in tableData" :key="card.id" :trigger="['contextmenu']">
        <a-card :bodyStyle="{ padding: '0px' }" class="card account-card" hoverable>
          <template #extra> </template>
          <div style="display: flex; flex-direction: column; padding: 10px">
            <a-row class="card-tags">
              <span>
                <Icon
                  icon="material-symbols:category-outline"
                  class="vel-icon icon"
                  aria-hidden="true"
                  size="13"
                />
                <span style="font-size: 12px">
                  类型： {{ card.authType === 'O' ? '主账号' : '授权' }}</span
                ></span
              >

              <span>
                <a-button
                  v-if="card.state === 'Y'"
                  size="small"
                  style="
                    align-items: center;
                    background-color: #749bc2;
                    color: #ffff;
                    font-size: 12px;
                  "
                  @click="goChatgpt(card.id)"
                  >立即前往<Icon
                    icon="mdi:go-kart"
                    class="vel-icon icon"
                    aria-hidden="true"
                    size="15"
                  />
                </a-button>
              </span>
            </a-row>
            <a-row class="card-tags">
              <span>
                <Icon
                  icon="material-symbols:attach-email-outline"
                  class="vel-icon icon"
                  aria-hidden="true"
                  size="13"
                />
                <span style="font-size: 12px"> 邮箱： {{ card.accountName }}</span></span
              >
            </a-row>

            <a-row class="card-tags">
              <span>
                <Icon
                  icon="solar:lock-password-broken"
                  class="vel-icon icon"
                  aria-hidden="true"
                  size="13"
                />
                <span style="font-size: 12px">
                  密码：{{ card.authType === 'O' ? card.password : '暂无权限查看' }}</span
                ></span
              >
            </a-row>
            <a-row class="card-tags">
              <span>
                <Icon
                  icon="material-symbols:mfg-nest-yale-lock-sharp"
                  class="vel-icon icon"
                  aria-hidden="true"
                  size="13"
                />
                <span style="font-size: 12px">
                  MFA：{{ card.authType === 'O' ? card.mfaCode : '暂无权限查看' }}</span
                ></span
              >
            </a-row>
            <a-row class="card-tags" v-if="card.authType === 'O'">
              <span style="font-size: 12px">
                <Icon
                  icon="streamline:computer-battery-medium-1-phone-mobile-charge-medium-device-electricity-power-battery"
                  class="vel-icon icon"
                  aria-hidden="true"
                  size="13"
                />

                状态：<a-badge
                  v-if="card.gptState === 'Y'"
                  style="font-size: 12px"
                  :status="card.gptState === 'Y' ? 'processing' : 'default'"
                />
                <span style="font-size: 12px">
                  {{ card.gptState === 'Y' ? '正常' : 'TOKEN失效' }}
                </span>
              </span>

              <span
                ><a-button
                  v-if="card.authType === 'O' && card.state === 'N'"
                  size="small"
                  style="font-size: 12px"
                  @click="doRefreshToken(card.chatGptId)"
                  ><Icon
                    icon="material-symbols:cloud-sync"
                    class="vel-icon icon"
                    aria-hidden="true"
                    size="13"
                  />刷新Token</a-button
                >
              </span>
            </a-row>
            <a-row class="card-tags" v-else>
              <span style="font-size: 12px">
                <Icon
                  icon="streamline:computer-battery-medium-1-phone-mobile-charge-medium-device-electricity-power-battery"
                  class="vel-icon icon"
                  aria-hidden="true"
                  size="13"
                />

                <span style="font-size: 12px">
                  状态：<a-tooltip :title="card.desc">
                    <Icon
                      v-if="card.state != 'Y'"
                      icon="material-symbols:warning-outline-rounded"
                      class="vel-icon icon"
                      aria-hidden="true"
                      size="17"
                  /></a-tooltip>
                  {{ card.state === 'Y' ? ' 正常' : ' 到期' }}
                </span>
              </span>

              <span> </span>
            </a-row>
            <a-row class="card-tags">
              <span>
                <Icon
                  icon="material-symbols:nest-clock-farsight-analog-outline-rounded"
                  class="vel-icon icon"
                  aria-hidden="true"
                  size="13"
                />
                <span style="font-size: 12px">
                  创建时间：
                  {{ card.gmtCreate }}
                </span>
              </span>
            </a-row>
            <a-row class="card-tags">
              <span>
                <Icon
                  icon="material-symbols:punch-clock-outline-rounded"
                  class="vel-icon icon"
                  aria-hidden="true"
                  size="13"
                />
                <span style="font-size: 12px" v-if="card.authTYpe === 'A'">
                  到期时间：
                  {{ card.gmtExpired }}
                </span>
                <span style="font-size: 12px" v-else>
                  过期时间：
                  {{ card.gmtAccessExpire }}
                </span>
              </span>
              <a-button
                :disabled="card.sort === 0"
                size="small"
                style="font-size: 12px"
                @click="doSetTop(card.id)"
              >
                账号置顶</a-button
              >
              <a-col :span="24">
                <a-divider
                  style="width: 100%; margin-top: 8px; margin-bottom: 1px; margin-left: 0"
                />
              </a-col>
            </a-row>

            <a-row class="card-tags" style="margin-top: 10px" v-if="card.authType === 'O'">
              <a-col :span="24" style="display: flex; justify-content: center">
                <a-button-group style="width: 100%">
                  <a-popconfirm
                    title="是否确认删除账户？存在授权的账户无法删除！"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="deleteAccount(card.id)"
                  >
                    <a-tooltip title="删除账号">
                      <a-button type="text" style="width: 100%">
                        <Icon
                          icon="material-symbols:delete-outline"
                          class="vel-icon icon"
                          aria-hidden="true"
                          size="17"
                        />
                      </a-button>
                    </a-tooltip>
                  </a-popconfirm>
                  <a-tooltip title="授权列表">
                    <a-button
                      type="text"
                      @click="showAuthorizationList(card.chatGptId)"
                      style="width: 100%"
                    >
                      <Icon
                        icon="ph:user-list-bold"
                        class="vel-icon icon"
                        aria-hidden="true"
                        size="17"
                      />
                    </a-button>
                  </a-tooltip>
                  <a-popconfirm
                    title="是否确认生成授权？目前生成授权后账户禁止删除！"
                    ok-text="立即生成"
                    cancel-text="下次吧"
                    @confirm="showCreateAuth(card)"
                  >
                    <a-tooltip title="生成授权">
                      <a-button type="text" style="width: 100%">
                        <Icon
                          icon="mdi:genie-lamp"
                          class="vel-icon icon"
                          aria-hidden="true"
                          size="17"
                        />
                      </a-button>
                    </a-tooltip>
                  </a-popconfirm>
                  <a-tooltip title="编辑账号">
                    <a-button type="text" @click="onModified(card)" style="width: 100%">
                      <Icon
                        icon="material-symbols:edit-calendar-outline-sharp"
                        class="vel-icon icon"
                        aria-hidden="true"
                        size="17"
                      />
                    </a-button>
                  </a-tooltip>
                </a-button-group>
              </a-col>
            </a-row>
            <a-row class="card-tags" v-else>
              <a-col :span="24">
                <a-popconfirm
                  title="是否确认删除账户？存在授权的账户无法删除！"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="deleteAccount(card.id)"
                >
                  <a-tooltip title="删除账号">
                    <a-button type="text" style="width: 100%">
                      <Icon
                        icon="material-symbols:delete-outline"
                        class="vel-icon icon"
                        aria-hidden="true"
                        size="17"
                      />
                    </a-button>
                  </a-tooltip>
                </a-popconfirm>
              </a-col>
            </a-row>
          </div>
          <!-- 更多卡片内容 -->
        </a-card>
      </div>
    </div>
    <div ref="button">
      <a-card class="pagination">
        <a-pagination
          size="small"
          :current="pagination.current"
          :pageSize="pagination.pageSize"
          :pageSizeOptions="pagination.pageSizeOptions"
          :total="pagination.total"
          :showSizeChanger="pagination.showSizeChanger"
          :showTotal="pagination.showTotal"
          @change="pageChange"
          @showSizeChange="pageSizeChange"
          style="margin-left: 10px"
        />
      </a-card>
    </div>

    <!-- 新增用户 -->
    <a-modal
      v-model:open="accountForm.viewFlag"
      :title="accountForm.title"
      ok-text="立即执行"
      @ok="onSubmitAdd"
      :confirmLoading="accountForm.loading"
    >
      <a-card>
        <Loading :loading="accountForm.loading" :absolute="true" tip="数据发送中..." />
        <a-form :model="accountForm" layout="vertical" ref="accountFormRef">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item
                label="🐵登录邮箱"
                :rules="[
                  {
                    required: true,
                    message: '登录邮箱是必填项',
                  },
                ]"
                name="accountName"
              >
                <a-input v-model:value="accountForm.accountName" placeholder="输入登录邮箱" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="🍵登录密码"
                :rules="[
                  {
                    required: true,
                    message: '登录密码是必填项',
                  },
                ]"
                name="password"
              >
                <a-input v-model:value="accountForm.password" placeholder="输入登录密码" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="🍙MFA（二次验证密码-选填）">
                <a-input v-model:value="accountForm.mfaCode" placeholder="输入MFA" />
              </a-form-item>
            </a-col>
            <a-col :span="24" v-if="accountForm.id">
              <a-form-item label="🐥ACCESS-TOKEN（无法生成时，手动填写）">
                <a-input v-model:value="accountForm.accessToken" placeholder="输入ACCESS-TOKEN" />
              </a-form-item>
            </a-col>
            <a-col :span="24" v-if="accountForm.id">
              <a-form-item label="🐥ACCESS-TOKEN过期时间（填写ACCESS-TOKEN时，补充）">
                <a-date-picker
                  show-time
                  style="width: 100%"
                  width="100%"
                  v-model:value="accountForm.gmtAccessExpire"
                  placeholder="请输入过期时间~"
                  @change="onChangePicker"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>

    <!-- 激活授权账号 -->
    <a-modal
      v-model:open="activeData.viewFlag"
      title="ChatGpt授权激活"
      ok-text="提交"
      @ok="onActiveAccount"
    >
      <a-card>
        <a-form layout="vertical">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item label="账号授权码">
                <a-input v-model:value="activeData.activeCode" placeholder="输入授权码" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>

    <!-- 生成授权码 -->
    <a-modal
      v-model:open="createAuthForm.viewFlag"
      :style="{ top: '50px' }"
      title="生成授权码"
      ok-text="提交"
      @ok="onCreateAuth"
      :confirmLoading="createAuthForm.loading"
    >
      <a-card>
        <Loading :loading="createAuthForm.loading" :absolute="true" tip="数据发送中..." />
        <a-form layout="vertical" :model="createAuthForm" ref="createAuthFormRef">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item
                label="生成授权数量(1~50)"
                name="num"
                :rules="[{ required: true, message: '请输入生成授权码的数量!' }]"
              >
                <a-input-number
                  v-model:value="createAuthForm.num"
                  placeholder="请输入生成授权码的数量~"
                  min="1"
                  max="50"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="授权类型"
                name="authWay"
                :rules="[{ required: true, message: '请输入生成授权码的数量!' }]"
              >
                <a-select
                  v-model:value="createAuthForm.authWay"
                  @change="changeAuthWay"
                  placeholder="授权方式"
                >
                  <a-select-option value="DAY">按天计算</a-select-option>
                  <a-select-option value="TIME">指定到期时间</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="24" v-if="createAuthForm.authWay === 'DAY'">
              <a-form-item label="授权天数（0~365）" name="authDays">
                <a-input-number
                  v-model:value="createAuthForm.authDays"
                  placeholder="请输入授权天数，为空则是永久~"
                  min="0"
                  max="365"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24" v-if="createAuthForm.authWay === 'TIME'">
              <a-form-item label="到期时间">
                <a-date-picker
                  show-time
                  style="width: 100%"
                  width="100%"
                  v-model:value="createAuthForm.authExpireTimes"
                  placeholder="到期时间，为空则是永久~"
                  @change="onChangePicker"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>

    <!-- 授权列表 -->
    <a-modal v-model:open="authListForm.viewFlag" title="授权列表" width="75%" ok-text="">
      <template #footer>
        <a-button key="submit" type="primary" @click="closeAuthModal">已知晓</a-button>
      </template>
      <Loading :loading="authListForm.loading" :absolute="true" tip="数据加载中..." />
      <div style="width: 100%; padding: 5px 10px; overflow-x: auto">
        <a-table :dataSource="authListTableData" class="a-table" :scroll="{ x: 'max-content' }">
          <a-table-column
            v-for="column in authColumns"
            :v-if="!column.hidden"
            :key="column.key"
            :title="column.title"
            :dataIndex="column.dataIndex"
            size="small"
          />
        </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, unref } from 'vue';
  import { Loading } from '/@/components/Loading';
  import {
    ActiveAccountReq,
    CreateAuthCodeReq,
    AccountAuthListResp,
    ListQueryParams,
    AccountGptListItem,
    AddGptAccountReq,
  } from '/@/api/df/model/chatgptModel';
  import {
    queryChatgptList,
    AddChatgptAccount,
    removeChatgptAccount,
    pageList,
    setTop,
    refreshToken,
    activeAccount,
    createAuth,
    getChatgptUrl,
  } from '/@/api/df/chatgpt';
  import { accountAuthList } from '/@/api/df/account';
  import { IdReq } from '/@/api/model/baseModel';
  import Icon from '/@/components/Icon/Icon.vue';
  import { message } from 'ant-design-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';

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

  /******************************  查询  ************************************* */
  const searchForm = ref({
    accountName: null,
    state: null,
    authType: null,
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
    searchForm.value = {
      authType: null,
      accountName: '',
      state: null,
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
      const params: ListQueryParams = searchForm.value;
      params.current = pagination.value.current;
      params.pageSize = pagination.value.pageSize;
      console.log(params);
      const response = await pageList(params);
      tableData.value = response.records;
      pagination.value.total = response.total;
    } finally {
      globalLoading.value = false;
    }
  };

  onMounted(() => {
    onSearch();
  });

  // 主table 数据
  const tableData = ref<AccountGptListItem[]>([
    // 更多数据...
  ]);
  /******************************  查询END  ************************************* */
  //***************************** 新增或者编辑 ****************************************************//
  const accountFormRef = ref();
  const accountForm = ref({
    accountName: null,
    id: null,
    password: null,
    mfaCode: null,
    viewFlag: false,
    loading: false,
    accessToken: null,
    gmtAccessExpire: null,
    title: '',
  });

  const onAdd = () => {
    accountForm.value.accountName = null;
    accountForm.value.password = null;
    accountForm.value.mfaCode = null;
    accountForm.value.viewFlag = true;
    accountForm.value.accessToken = null;
    accountForm.value.gmtAccessExpire = null;
    accountForm.value.title = '🐣新增Chatgpt账号';
  };

  const onModified = (card) => {
    accountForm.value.accountName = card.accountName;
    accountForm.value.password = card.password;
    accountForm.value.mfaCode = card.mfaCode;
    accountForm.value.viewFlag = true;
    accountForm.value.accessToken = null;
    accountForm.value.gmtAccessExpire = null;
    accountForm.value.id = card.chatGptId;
    accountForm.value.title = '🐓更新Chatgpt账号';
  };

  const onSubmitAdd = async () => {
    if (accountForm.value.accessToken != null && accountForm.value.gmtAccessExpire == null) {
      message.error('填写accessToken时，请补充它的过期时间！');
      return;
    }

    accountForm.value.loading = true;
    try {
      await accountFormRef.value.validate();
      await AddChatgptAccount(accountForm.value);
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
      await removeChatgptAccount(param);
      onSearch();
    } finally {
      globalLoading.value = false;
    }
  };

  const doSetTop = async (id) => {
    globalLoading.value = true;
    try {
      await setTop({ id: id });
      onSearch();
    } finally {
      globalLoading.value = false;
    }
  };

  const doRefreshToken = async (id) => {
    globalLoading.value = true;
    try {
      await refreshToken({ id: id });
    } finally {
      globalLoading.value = false;
    }
  };
  /************************************生成授权 & 激活********************************* */
  //生成账户授权
  const createAuthFormRef = ref();
  const createAuthForm = ref({
    loading: false,
    viewFlag: false,
    num: 1,
    accountId: null,
    authWay: 'DAY',
    authDays: '1',
    authExpireTimes: null,
  });
  const showCreateAuth = async (card) => {
    createAuthForm.value.viewFlag = true;
    createAuthForm.value.accountId = card.chatGptId;
    createAuthForm.value.num = 1;
    createAuthForm.value.authWay = 'DAY';
    createAuthForm.value.authDays = '1';
    createAuthForm.value.authExpireTimes = null;
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

  const onHideCreateAuth = async () => {
    createAuthForm.value.viewFlag = false;
  };
  const onCreateAuth = async () => {
    createAuthForm.value.loading = true;
    try {
      await createAuthFormRef.value.validate();
      await createAuth(createAuthForm.value);
      createMessage.success('已成功创建授权码~');
      createAuthForm.value.viewFlag = false;
      onSearch();
    } finally {
      createAuthForm.value.loading = false;
    }
  };

  //激活账户相关
  const activeData = ref({
    loading: false,
    viewFlag: false,
    activeCode: '',
  });

  const onShowActive = async () => {
    activeData.value.viewFlag = true;
  };

  const onActiveAccount = async () => {
    activeData.value.loading = true;
    try {
      await activeAccount(activeData.value);
      activeData.value.viewFlag = false;
      message.success('🎉恭喜！你已成功激活Chatgpt账户！');
      onSearch();
    } finally {
      activeData.value.loading = false;
    }
  };

  //跳转CHATGPT页面
  const go = useGo();
  const goChatgpt = async (id) => {
    const url = await getChatgptUrl({ id: id });
    window.open(url, '_blank');
    // go('/chatgpt/index?openUrl=' + url);
  };
  //*****************************************授权列表相关 开始************************************/
  const authListForm = ref({
    loading: false,
    viewFlag: false,
    authList: {},
  });
  const authListTableData = ref<AccountAuthListResp[]>([
    // 更多数据...
  ]);

  const authColumns = [
    // { title: 'ID', dataIndex: 'id', key: 'id', hidden: true },
    { title: '授权码', dataIndex: 'authCode', key: 'authCode', width: 100 },
    { title: '生成时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 100 },
    { title: '授权方式', dataIndex: 'authWayLabel', key: 'authWayLabel', width: 100 },
    { title: '天数/效期', dataIndex: 'authDays', key: 'authDays', width: 100 },
    { title: '激活用户', dataIndex: 'activeUserEmail', key: 'activeUserEmail', width: 100 },
    { title: '激活时间', dataIndex: 'gmtActive', key: 'gmtActive', width: 100 },
  ];

  const showAuthorizationList = async (id) => {
    // 显示授权列表
    authListForm.value.loading = true;
    try {
      authListForm.value.viewFlag = true;
      authListTableData.value = await accountAuthList({ accountId: id, source: 'CHATGPT' });
    } finally {
      authListForm.value.loading = false;
    }
    // console.log(response);
    // authListForm.value.authList = response;
  };
  const closeAuthModal = () => {
    authListForm.value.viewFlag = false;
  };
  //*****************************************授权列表相关 结束 *************************************/

  // defineExpose({
  //   closeModal: () => {
  //     isDetailsModalVisible.value = false;
  //   },
  // });
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

  .search-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 53px;
    padding: 20px;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    flex: 1;
    align-content: start;
    margin-top: 10px;
    padding: 10px;
    overflow: auto;
    gap: 14px;
  }

  .card {
    min-width: 290px;
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
    height: 24px;
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

  .ant-badge-status-text {
    font-size: 13px !important;
  }

  .account-card >>> .ant-card-head {
    padding: 0 10px;
  }
</style>
