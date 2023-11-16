<template>
  <a-layout v-loading="loadingRef" class="app" loading-tip="加载中...">
    <!-- 查询选项卡 -->
    <a-card :bodyStyle="{ padding: 0, height: '50px' }" ref="formRef">
      <a-row
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 50px;
          padding: 0 10px;
        "
      >
        <div style="display: flex; align-items: center">
          <a-image src="./logo.png" :width="38" :height="38" :preview="false" />
          <span style="margin-left: 5px; font-size: 16px; font-weight: bold">账号管理</span>
        </div>
        <div style="display: flex; gap: 5px">
          <a-tooltip title="偷个懒，请去PC端添加~">
            <a-dropdown :trigger="['click']" disabled>
              <a-button style="padding: 0 5px; border-radius: 5px"
                ><Icon icon="mdi:account-multiple-add" size="22"
              /></a-button>
              <template #overlay>
                <a-menu disabled>
                  <a-menu-item key="5" disabled>
                    <a-popconfirm
                      title="⚠️新增账号"
                      ok-text="立即预览"
                      cancel-text="取消"
                      @confirm="onAdd"
                    >
                      📺新增账户
                    </a-popconfirm>
                  </a-menu-item>
                  <a-menu-item key="5" disabled>
                    <a-popconfirm
                      title="⚠️创建账号组"
                      ok-text="立即预览"
                      cancel-text="取消"
                      @confirm="onAdd"
                    >
                      📝创建账号组
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-tooltip>
          <a-tooltip title="">
            <a-button
              @click="showQueryView"
              @click.prevent
              style="padding: 0 5px; border-radius: 10px"
            >
              <Icon icon="uil:search-alt" size="22" />
            </a-button>
          </a-tooltip>
          <a-tooltip title="市场">
            <a-button @click="openGoodsShop" style="padding: 0 5px; border-radius: 10px">
              <Icon icon="ph:shopping-cart-bold" size="22" />
            </a-button>
          </a-tooltip>
          <a-tooltip title="">
            <a-button @click="onShowActive" style="padding: 0 5px; border-radius: 10px">
              <Icon icon="solar:key-square-2-linear" size="22" />
            </a-button>
          </a-tooltip>
        </div>
      </a-row>
    </a-card>

    <!-- 内容区域 -->
    <div
      class="cards"
      :style="{ height: `calc(${contentHeight}px `, overflow: 'auto', padding: '2px 10px' }"
    >
      <div v-for="card in tableData" :key="card.id" :trigger="['contextmenu']">
        <a-badge-ribbon
          :text="card.ownerFlag == 'Y' ? '自有' : '授权'"
          :color="card.ownerFlag == 'Y' ? '#11698E' : '#00C1D4'"
        >
          <a-card
            :bodyStyle="{ padding: '0px' }"
            :headStyle="{
              padding: '0px',
              display: 'flex',
              'flex-direction': 'row',
              'justify-content': 'space-between',
            }"
            class="card"
            hoverable
          >
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                width: 100%;
                padding: 15px;
              "
            >
              <div style="justify-content: left">
                <span>🪧 {{ ' ' + card.discordUserName }}</span>
              </div>
              <div style="margin-right: 15px"> </div>
            </div>
            <a-divider style="margin: 0" />
            <div style="display: flex; flex-direction: column; padding: 10px">
              <a-row class="card-tags">
                <span>
                  🚌服务器:
                  <span style="font-weight: bolder">{{ card.guildTitle }}</span></span
                >
              </a-row>

              <a-row class="card-tags">
                <span>
                  🧽类型:
                  <a-tag v-if="card.accMode === 'SINGLE'">单账号</a-tag>
                  <a-tag color="purple" v-else>账号组</a-tag>
                </span>
                <span>
                  🍰状态:
                  <a-tag :color="getTagColor(card.state)" v-if="card.state === 'unvalid'"
                    >待验证</a-tag
                  >
                  <a-tag :color="getTagColor(card.state)" v-else-if="card.state === 'normal'"
                    >正常</a-tag
                  >
                  <a-tag :color="getTagColor(card.state)" v-else-if="card.state === 'error'"
                    >异常</a-tag
                  >
                  <a-tag :color="getTagColor(card.state)" v-else>过期</a-tag>
                </span>
              </a-row>

              <a-row class="card-tags" v-if="card.ownerFlag == 'N'">
                <span>
                  ⚡Turbo次数:
                  <span style="font-weight: bolder">{{ card.turboTimes }}</span></span
                >
                <span>
                  🐇Fast次数:
                  <span style="font-weight: bolder">{{ card.fastTimes }}</span></span
                >
              </a-row>

              <a-row class="card-tags" v-if="card.ownerFlag == 'N'">
                <span>
                  🐢Relax次数:
                  <span style="font-weight: bolder">{{ card.relaxTimes }}</span></span
                >
                <span v-if="card.expireTime">
                  📅到期: <span style="font-weight: bolder">{{ card.expireTime }}</span></span
                >
              </a-row>
              <a-row class="card-tags" v-if="card.ownerFlag == 'N'">
                <span>
                  ☎管理员:
                  <span style="font-weight: bolder">{{ card.connect }}</span></span
                >
              </a-row>
              <a-divider style="margin-top: 15px; margin-bottom: 1px; margin-left: 0" />
              <a-row class="card-tags">
                <span>
                  <a-button size="small" disabled @click="showDetails(card.id)">📝概况</a-button>
                </span>
                <span>
                  <a-button
                    type="warning"
                    size="small"
                    @click="showCreateAuth(card.id)"
                    v-if="card.ownerFlag == 'Y'"
                    >⛏授权</a-button
                  >
                </span>
                <span>
                  <a-button
                    size="small"
                    @click="showAuthorizationList(card.id)"
                    v-if="card.ownerFlag == 'Y'"
                    >🛒列表</a-button
                  >
                </span>
                <span>
                  <a-switch
                    :checked="card.disabledFlag === 'N'"
                    checked-children="启用"
                    un-checked-children="禁用"
                    @click="toggleDisabled(card)"
                  />
                </span>
              </a-row>
            </div>
            <!-- 更多卡片内容 -->
          </a-card>
        </a-badge-ribbon>
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
      v-model:visible="isAddModalVisible"
      title="🥰新增账户"
      ok-text="提交"
      @ok="onSubmitAdd"
    >
      <a-card>
        <a-form layout="vertical">
          <a-row gutter="24">
            <a-col :span="12">
              <a-form-item label="账号名">
                <a-input v-model:value="addForm.accountName" placeholder="输入账号名" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="授权数">
                <a-input-number v-model:value="addForm.authorizationCount" min="0" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row gutter="24">
            <a-col :span="12">
              <a-form-item label="Token">
                <a-input v-model:value="addForm.token" placeholder="输入Token" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="服务ID">
                <a-input v-model:value="addForm.serviceId" placeholder="输入服务ID" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item label="Channel ID">
                <a-input v-model:value="addForm.channelId" placeholder="输入Channel ID" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>

    <!-- 生成授权码 -->
    <a-modal
      v-model:visible="createAuthForm.isActiveVisible"
      wrap-class-name="full-modal"
      :bodyStyle="{ padding: '0' }"
      title="⛏生成授权码"
      ok-text="提交"
      @ok="onCreateAuth"
    >
      <a-card>
        <a-form layout="vertical">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item label="生成授权数量">
                <a-input-number v-model:value="createAuthForm.num" min="1" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="授权天数">
                <a-input-number
                  id="authDays"
                  v-model:value="createAuthForm.authDays"
                  :min="-1"
                  :max="999999"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="TURBO模式次数">
                <a-input-number
                  id="turboTimes"
                  v-model:value="createAuthForm.turboTimes"
                  :min="-1"
                  :max="999999"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="FAST模式次数">
                <a-input-number
                  id="fastTimes"
                  v-model:value="createAuthForm.fastTimes"
                  :min="-1"
                  :max="999999"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="Relax模式次数">
                <a-input-number
                  id="relaxTimes"
                  v-model:value="createAuthForm.relaxTimes"
                  :min="-1"
                  :max="999999"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>

    <!-- 激活授权账号 -->
    <a-modal
      v-model:visible="activeData.isActiveVisible"
      title="🎈激活授权账号"
      :style="{ width: '100%', height: '35vh' }"
      ok-text="立即激活"
      @ok="onActiveAccount"
    >
      <div style="padding: 15px">
        <a-input v-model:value="activeData.activeCode" placeholder="输入授权码" />
      </div>
    </a-modal>

    <!-- 授权列表 -->
    <a-modal
      v-model:visible="authListForm.isAuthModalVisible"
      title="📝授权列表"
      width="100%"
      wrap-class-name="full-modal"
      :bodyStyle="{ padding: '0' }"
    >
      <template #footer>
        <a-button key="back" @click="closeAuthListModal">关闭</a-button>
      </template>

      <div class="cards" :style="{ height: '75vh', overflow: 'auto', padding: '0 2px' }">
        <div v-for="card in authListTableData" :key="card.id" :trigger="['contextmenu']">
          <a-card
            :bodyStyle="{ padding: '0px' }"
            :headStyle="{
              padding: '0px',
              display: 'flex',
              'flex-direction': 'row',
              'justify-content': 'space-between',
            }"
            class="card"
            hoverable
          >
            <div style="display: flex; flex-direction: column; padding: 10px">
              <a-row class="card-tags">
                <a-col :span="24">
                  🚌服务器:
                  <span style="font-weight: bolder">{{ card.guildTitle }}</span></a-col
                >
              </a-row>
              <a-row class="card-tags" :gutter="[0, 5]">
                <a-col :span="24">
                  🧽授权码:
                  <span style="font-weight: bolder">{{ card.authCode }}</span>
                </a-col>
                <a-col :span="24">
                  🍰状态:
                  <a-tag color="green" v-if="card.activeUserEmail">已激活</a-tag>
                  <a-tag color="gray" v-else>未激活</a-tag>
                </a-col>
                <a-col :span="24">
                  📩激活用户:
                  <span style="font-weight: bolder">{{ card.activeUserEmail }}</span></a-col
                >
                <a-col :span="24">
                  🕘激活时间:
                  <span style="font-weight: bolder">{{ card.gmtActive }}</span></a-col
                >
                <a-col :span="24">
                  🕐生成时间: <span style="font-weight: bolder">{{ card.gmtCreate }}</span></a-col
                >
              </a-row>
            </div>
            <!-- 更多卡片内容 -->
          </a-card>
        </div>
      </div>
      <Loading :loading="tableLoading" absolute="true" tip="正在加载中~" />
    </a-modal>

    <!-- 详情模态窗口组件 -->
    <account-details-modal
      style="top: 80px"
      :id="selectedAccountId"
      :visible="isDetailsModalVisible"
      @update-visible="updateModalVisible"
    />

    <!-- 条件查询 -->
    <a-modal
      v-model:visible="showQueryViewFlag"
      width="100%"
      title="🔍️条件查询"
      :bodyStyle="{ padding: '7px 12px 7px 12px', width: '100%', 'align-items': 'center' }"
    >
      <template #footer>
        <a-button key="submit" type="primary" @click="doModelSearch()">立即查询</a-button>
      </template>
      <a-card
        :bordered="false"
        :bodyStyle="{ padding: '1px 1px 1px 1px', width: '100%', 'align-items': 'center' }"
      >
        <a-row :gutter="[0, 2]" type="flex">
          <a-col flex="80px">
            <a-tag class="quality-tag" color="default">🍺状态 </a-tag>
          </a-col>
          <a-col flex="auto">
            <a-select v-model:value="search.state" style="width: 100%" class="mobile-select">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="待验证">待验证</a-select-option>
              <a-select-option value="正常">正 常</a-select-option>
              <a-select-option value="异常">异 常</a-select-option>
              <a-select-option value="过期">结 束</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row :gutter="[0, 2]" type="flex" style="margin-top: 7px">
          <a-col flex="80px">
            <a-tag class="quality-tag" color="default">🍥权限 </a-tag>
          </a-col>
          <a-col flex="auto">
            <a-select v-model:value="search.ownerFlag" class="mobile-select" style="width: 100%">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="N">授权</a-select-option>
              <a-select-option value="Y">自有</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row type="flex" :gutter="[0, 2]" style="margin-top: 7px">
          <a-col flex="auto">
            <a-input v-model:value="search.accountName" placeholder="输入账号名称" />
          </a-col>
        </a-row>
      </a-card>
    </a-modal>
    <Loading :loading="tableLoading" absolute="false" tip="正在加载中~" />
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, reactive, computed, unref } from 'vue';
  import {
    ListQueryParams,
    AccountListItem,
    ChangeAuthParams,
    AccountAuthListResp,
  } from '/@/api/df/model/accountModel';
  import {
    queryList,
    changeAuth,
    del,
    activeAuthAccount,
    accountAuthList,
    createAccountAuth,
    disabledAccount,
  } from '/@/api/df/account';
  import AccountDetailsModal from './accountDetailsModal.vue';
  import { IdReq } from '/@/api/model/baseModel';
  import { message } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { useGo } from '/@/hooks/web/usePage';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import Icon from '/@/components/Icon/Icon.vue';

  /** 页面高度计算开始 */
  const formRef = ref();
  //页面高度处理
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 0);
  //移动设备底部导航栏
  const offsetHeightRef = ref(141);
  const subtractHeightRefs = ref([]);

  // 使用hook
  const { contentHeight, redoHeight } = useContentHeight(
    computed(() => true),
    formRef,
    unref(subtractHeightRefs), // 使用 unref 获取数组值
    unref(substractSpaceRefs),
    upwardSpace,
    offsetHeightRef,
  );

  const go = useGo();
  const showQueryViewFlag = ref(false);
  const showQueryView = () => {
    showQueryViewFlag.value = true;
  };
  const doModelSearch = () => {
    // 验证消息来源和内容，然后关闭 iframe
    showQueryViewFlag.value = false;
    onSearch();
  };

  const loadingRef = ref(false);
  const tableLoading = ref(false);
  //查询
  const search = ref({
    ownerFlag: '',
    accountName: '',
    state: '',
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
      ownerFlag: '',
      accountName: '',
      accountStatus: '',
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

  const onSearch = async () => {
    tableLoading.value = true;
    const params: ListQueryParams = search.value;
    params.current = pagination.value.current;
    params.pageSize = pagination.value.pageSize;
    console.log(params);
    const response = await queryList(params);
    tableData.value = response.records;
    pagination.value.total = response.total;
    tableLoading.value = false;
  };

  onMounted(() => {
    onSearch();
  });

  // 主table 数据
  const tableData = ref<AccountListItem[]>([
    // 更多数据...
  ]);

  //授权列表相关 开始
  const authListForm = ref({
    isAuthModalVisible: false,
    authList: {},
  });
  const closeAuthListModal = () => {
    authListForm.value.isAuthModalVisible = false;
  };
  const authListTableData = ref<AccountAuthListResp[]>([
    // 更多数据...
  ]);

  const showAuthorizationList = async (id) => {
    // 显示授权列表
    authListForm.value.isAuthModalVisible = true;
    tableLoading.value = true;
    try {
      authListTableData.value = await accountAuthList({ accountId: id, source: 'MJ' });
    } finally {
      tableLoading.value = false;
    }
  };

  //授权列表相关 结束

  //新增或者编辑
  const isAddModalVisible = ref(false);
  const addForm = ref({
    id: null,
    accountName: '',
    authorizationCount: 0,
    token: '',
    serviceId: '',
    channelId: '',
  });
  const onAdd = () => {
    isAddModalVisible.value = true;
  };
  const editAccount = (id) => {
    isAddModalVisible.value = true;
    // 编辑账户
    addForm.value.accountName = '123';
    addForm.value.authorizationCount = 123;
  };
  const onSubmitAdd = () => {
    // 提交新增账户的数据
    isAddModalVisible.value = false;
  };

  //账号统计相关
  const selectedAccountId = ref('');
  const isDetailsModalVisible = ref(false);
  const showDetails = (id: string) => {
    selectedAccountId.value = id;
    isDetailsModalVisible.value = true;
  };

  // 更新模态窗口的可见性，由子组件触发
  const updateModalVisible = (value: boolean) => {
    isDetailsModalVisible.value = value;
  };

  //生成账户授权
  const createAuthForm = ref({
    isActiveVisible: false,
    num: 1,
    accountId: null,
    turboTimes: 0,
    fastTimes: 0,
    relaxTimes: 0,
    authType: 'DAY',
    authDays: 0,
  });
  const showCreateAuth = async (id) => {
    createAuthForm.value.isActiveVisible = true;
    createAuthForm.value.accountId = id;
  };

  const onHideCreateAuth = async () => {
    createAuthForm.value.isActiveVisible = false;
  };
  const onCreateAuth = async () => {
    tableLoading.value = true;
    console.log('onCreateAuth');
    try {
      await createAccountAuth(createAuthForm.value);
      createAuthForm.value.isActiveVisible = false;
    } finally {
      tableLoading.value = false;
    }
  };

  //激活账户相关
  const activeData = ref({
    isActiveVisible: false,
    activeCode: '',
  });

  const onShowActive = async () => {
    activeData.value.isActiveVisible = true;
  };

  const openGoodsShop = async () => {
    go('/goods/index');
  };

  const onHideActive = async () => {
    activeData.value.isActiveVisible = false;
  };
  const onActiveAccount = async () => {
    tableLoading.value = true;
    await activeAuthAccount(activeData.value);
    activeData.value.isActiveVisible = false;
    onSearch();
  };

  defineExpose({
    closeModal: () => {
      isDetailsModalVisible.value = false;
    },
  });

  const getTagColor = (state) => {
    switch (state) {
      case 'unvalid':
        return '#d9d9d9';
      case 'normal':
        return '#52c41a';
      case 'error':
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };
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

  .app {
    display: grid;
    grid-template-rows: auto 1fr auto;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    flex: 1;
    align-content: start;
    padding: 2px;
    overflow: auto;
    gap: 4px;
  }

  .card {
    min-width: 250px;
    border-radius: 10px;
  }

  .card >>> img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 7%;
  }

  .card >>> .ant-image-mask {
    border-radius: 7%;
  }

  .pagination {
    display: flex;
    align-content: center;
    align-items: center; /* 垂直居中 */
    height: 45px;

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

  .search-card {
    display: flex;
    align-items: center;
    height: 45px;
    border-radius: 4px;
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
</style>
<style lang="less">
  .full-modal {
    .ant-modal {
      top: 0;
      max-width: 100%;
      margin: 0;
      padding-bottom: 0;
    }

    .ant-modal-content {
      display: flex;
      flex-direction: column;
      height: calc(100vh);
    }

    .ant-modal-body {
      flex: 1;
    }
  }
</style>
