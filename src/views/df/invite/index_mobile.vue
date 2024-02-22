<template>
  <a-layout style="width: 100%; overflow: auto">
    <Loading :loading="globalLoading" :absolute="false" tip="正在加载中..." />
    <a-card
      :style="{ height: `calc(100vh - 56px - 45px)`, overflow: 'auto' }"
      :bodyStyle="{ padding: '0px' }"
    >
      <a-card title="邀请中心" :bodyStyle="{ padding: '5px' }">
        <a-row
          justify="start"
          align="top"
          style="
            padding: 8px;
            border: 1px solid transparent;
            border-radius: 8px;
            background-color: #fff7e8;
          "
        >
          <span style="padding: 3px 10px; color: rgb(0 0 0 / 70%)"
            >您可以通过分享邀请链接，邀请用户进行购买官方套餐您获得10%的佣金奖励，该用户续费您可获得5%的佣金奖励，快邀请好友来使用吧！</span
          >
        </a-row>
        <a-row justify="space-between" style="margin-top: 20px; padding: 0 20px">
          <a-flex vertical style="min-width: 100px">
            <div style="height: 25px; color: rgb(0 0 0 / 70%)">
              <span>待提现收益</span>
            </div>
            <div style="display: flex; align-items: center">
              <span style="color: #ff9500; font-size: 24px; font-weight: 800"
                >{{ inviteForm.remainAmount }} 元
              </span>
              <a-button
                style="margin-left: 10px"
                size="small"
                :disabled="inviteForm.remainAmount < 50"
                type="primary"
                @click="withdrawalOpen"
                >提现</a-button
              >
            </div>
          </a-flex>
          <a-flex vertical style="min-width: 100px">
            <div style="height: 25px; color: rgb(0 0 0 / 70%)">
              <span>总收益</span>
            </div>
            <div>
              <span style="font-size: 28px; font-weight: 800"
                >{{ inviteForm.totalAmount }} 元
              </span>
            </div>
          </a-flex>
          <a-flex vertical style="min-width: 100px">
            <div style="height: 25px; color: rgb(0 0 0 / 70%)">
              <span>已提现</span>
            </div>
            <div>
              <span style="font-size: 28px; font-weight: 800"
                >{{ inviteForm.withdrawalAmount }} 元
              </span>
            </div>
          </a-flex>
          <a-flex vertical style="min-width: 100px">
            <div style="height: 25px; color: rgb(0 0 0 / 70%)">
              <span>总邀请人数</span>
            </div>
            <div>
              <span style="font-size: 28px; font-weight: 800">{{ inviteForm.numInvite }} 人 </span>
            </div>
          </a-flex>
        </a-row>

        <a-row justify="start" align="top" style="margin-top: 20px; padding: 0 10px">
          <span style="height: 25px; color: rgb(0 0 0 / 70%)">
            提示：待提现收益金额必须 >=￥50 才能提现到账户余额。
          </span>
        </a-row>

        <a-row
          style="align-items: center; height: 42px; margin-left: 10px"
          justify="start"
          align="center"
        >
          <a-divider style="height: 1px; margin: 0" />
        </a-row>

        <a-row justify="start" align="top">
          <a-col
            flex="80px"
            style="display: flex; flex-direction: row; justify-content: space-between"
          >
            邀请链接
          </a-col>
          <a-col flex="auto" style="display: flex; flex-direction: row; justify-content: start">
            <a-input-group compact :bordered="false" style="width: 100%">
              <a-input v-model:value="inviteForm.inviteLink" style="width: 300px" disabled />
              <a-tooltip trigger="hover" title="复制我的专属链接~">
                <a-button @click="copyText(inviteForm.inviteLink)" style="width: 40px">
                  <template #icon>
                    <Icon icon="ion:copy" class="vel-icon icon" aria-hidden="true" />
                  </template>
                </a-button>
              </a-tooltip>
            </a-input-group>
          </a-col>
        </a-row>
      </a-card>
      <div style="margin-top: 24px">
        <a-table
          :dataSource="tableData"
          rowKey="id"
          :loading="tableLoading"
          :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
          :pagination="pagination"
        >
          <a-table-column title="订单号" dataIndex="bizId" key="bizId" align="left" :width="100" />

          <a-table-column title="事件" dataIndex="title" key="title" align="left" :width="80">
            <template #default="{ record }">
              <a-tag color="#ff4d4f" v-if="record.eventType === 20">提到账户</a-tag>
              <a-tag color="#52c41a" v-else-if="record.eventType === 1">用户下单</a-tag>
              <a-tag color="#d9d9d9" v-else>未定义</a-tag>
            </template>
          </a-table-column>

          <a-table-column title="用户ID" dataIndex="buyerId" key="buyerId" align="left" :width="90">
            <template #default="{ record }">
              <a-tag v-if="record.buyerId"> 自己</a-tag>

              <a-tag v-else>{{ record.buyerId }}</a-tag>
            </template>
          </a-table-column>

          <a-table-column
            title="金额"
            dataIndex="orderAmount"
            key="orderAmount"
            align="left"
            :width="120"
          />
          <a-table-column title="佣金" dataIndex="amount" key="amount" align="left" :width="100" />

          <a-table-column
            title="剩余佣金"
            dataIndex="remainAmount"
            key="remainAmount"
            align="left"
            :width="100"
          />

          <a-table-column
            title="创建时间"
            dataIndex="gmtCreate"
            key="gmtCreate"
            align="left"
            :width="120"
          />

          <!-- <a-table-column title="操作" key="actions" fixed="right" :width="200">
            <template #default="{ record }">
              <a-button-group>
                <a-button @click="showDiscordForm" disabled>查看订单</a-button>
              </a-button-group>
            </template>
          </a-table-column> -->
        </a-table>
      </div>
    </a-card>
    <!-- 提现到账户 -->
    <a-modal v-model:open="withdrawalForm.viewFlag" title="提现到账户余额">
      <template #footer>
        <a-button
          :disabled="(parseFloat(withdrawalForm.applyAmount) || 0) > inviteForm.remainAmount"
          type="primary"
          @click="doWithdrawal"
          :loading="withdrawalForm.loading"
        >
          {{
            (parseFloat(withdrawalForm.applyAmount) || 0) <= inviteForm.remainAmount
              ? '立即提现'
              : `超出可提现余额 `
          }}
        </a-button>
      </template>

      <a-form
        :model="withdrawalForm"
        layout="vertical"
        ref="withdrawalFormRef"
        style="padding: 20px"
      >
        <a-row gutter="24">
          <a-col :span="24">
            <a-form-item
              :rules="[
                {
                  required: true,
                  message: '请输入提现金额（需大于50元）',
                },
              ]"
              name="applyAmount"
            >
              <template #label>
                <span
                  ><Icon
                    icon="teenyicons:password-solid"
                    class="vel-icon icon"
                    aria-hidden="true"
                  />提现金额
                </span>
              </template>
              <a-input-number
                v-model:value="withdrawalForm.applyAmount"
                addon-before="¥"
                :min="50"
                :step="0.01"
                placeholder="请输入金额"
                string-mode
                :formatter="(value) => (parseFloat(value) || 0).toFixed(2)"
                :parser="
                  (value) => {
                    const parsedValue = parseFloat(value);
                    return isNaN(parsedValue) ? 50 : parsedValue;
                  }
                "
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-layout>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref, reactive, createVNode } from 'vue';
  import { MarkdownViewer } from '/@/components/Markdown';
  import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next';
  import 'vue-waterfall-plugin-next/dist/style.css';
  import { Loading } from '/@/components/Loading';
  import Icon from '/@/components/Icon/Icon.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useGo } from '/@/hooks/web/usePage';
  import {
    CaretLeftOutlined,
    CaretRightOutlined,
    ExclamationCircleOutlined,
  } from '@ant-design/icons-vue';
  import 'viewerjs/dist/viewer.css';
  import { directive as viewer } from 'v-viewer';
  import { message, Modal, Empty } from 'ant-design-vue';
  // import loading from '/@/assets/images/lazy-loading.svg';
  import loading from '/@/assets/images/loading.svg';
  import error from '/@/assets/images/lazy-error.svg';
  import { getCommission, withdrawal, flowList } from '/@/api/df/commission';
  import { useRoute } from 'vue-router';
  import { copyText } from '/@/utils/copyTextToClipboard';
  import {
    createTradeApi,
    tradeListApi,
    fetchPayResultApi,
    cancelTradeApi,
    createRechargeTrade,
    createShareTrade,
  } from '/@/api/df/trade';
  import { useUserStoreWithOut } from '/@/store/modules/user';

  const userStore = useUserStoreWithOut();
  const token = userStore.getToken;

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

  /**************************提现************************* */

  onMounted(async () => {
    await loadInfo();
  });

  const loadInfo = async () => {
    const commissionResp = await getCommission({});
    inviteForm.value.totalAmount = commissionResp.totalAmount;
    inviteForm.value.remainAmount = commissionResp.remainAmount;
    inviteForm.value.withdrawalAmount = commissionResp.withdrawalAmount;
    inviteForm.value.numInvite = commissionResp.numInvite;
    const currentDomain = window.location.origin;
    inviteForm.value.inviteLink =
      currentDomain + '/#/login?inviteCode=' + commissionResp.inviteCode;
  };

  onMounted(async () => {
    onSearch(1);
  });

  const globalLoading = ref(false);
  const inviteForm = ref({
    totalAmount: 0,
    remainAmount: 0 as number,
    withdrawalAmount: 0,
    numInvite: 0,
    inviteLink: null,
  });

  const tableLoading = ref(false);
  // 主table 数据
  const tableData = ref<{}[]>([
    // 更多数据...
  ]);
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

  //查询
  const onSearch = async (current?: number) => {
    if (typeof current === 'undefined') {
      current = 1;
    }
    pagination.value.current = current;
    globalLoading.value = true;
    try {
      const response = await flowList({
        current: pagination.value.current,
        pageSize: pagination.value.pageSize,
      });
      tableData.value = response.records;
      pagination.value.total = response.total;
    } finally {
      globalLoading.value = false;
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
    // pagination.value.current = page
    onSearch(page);
  }

  /***************************提现************************* */
  const withdrawalFormRef = ref();
  const withdrawalForm = ref({
    applyAmount: null as number | null,
    viewFlag: false,
    loading: false,
  });

  const doWithdrawal = async () => {
    await withdrawalFormRef.value.validate();
    const applyAmount = parseFloat(withdrawalForm.value.applyAmount) || 0;
    if (applyAmount < 50) {
      message.error('提现金额需大于等于50元~');
      return;
    }

    if (applyAmount > inviteForm.value.remainAmount) {
      message.error('可提现金额不足~');
      return;
    }

    withdrawalForm.value.loading = true;
    try {
      await withdrawal({ applyAmount: withdrawalForm.value.applyAmount });
      await loadInfo();
      onSearch(1);
      withdrawalForm.value.viewFlag = false;
    } finally {
      withdrawalForm.value.loading = false;
    }
  };

  const withdrawalOpen = () => {
    withdrawalForm.value.viewFlag = true;
  };

  // 分页
  const tradeForm = ref({
    viewFlag: false,
  });
  const tradeShow = () => {
    tradeForm.value.viewFlag = true;
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

  .move-in {
    display: flex;
    position: absolute;
    bottom: 0;
    flex-direction: column;
    width: 100%;
    height: 80px;
    background: rgb(130 124 124 / 70%);
    color: white;
  }

  .move-out {
    display: flex;
    position: absolute;
    right: 3px;
    bottom: 3px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: rgb(130 124 124 / 70%);
    color: white;
    font-size: 15px;
  }

  .horizontal-scroll-container {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    overflow: auto;
  }

  .scroll-button {
    margin: 0 10px;
    font-size: 24px;
    cursor: pointer;
  }

  .scroll-item {
    width: 100px;
    height: 32px;
    margin: 0 5px;
  }

  /* 隐藏滚动条，但保留滚动功能 */
  .horizontal-scroll-container::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }

  /* 
:deep(.ant-card-body) {
  padding: 10px; 
} */

  /* .app {
  display: grid;
  grid-template-rows: auto 1fr auto;
} */

  .search-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 10vh;
    padding: 20px;
  }

  /* .card-container {
  width: 100%;
  column-gap: 10px;
  column-count: 4;
} */

  .card {
    display: inline-block;
    box-sizing: border-box;
    width: 100%;

    /* margin-bottom: 10px; */
    break-inside: avoid;
    padding: 0;
    border-radius: 15%;
  }

  .card >>> img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 15%;
  }

  .card img:hover {
    transform: scale(1.05); /* 鼠标悬停时放大 5% */
    transition: transform 0.3s ease; /* 添加过渡效果，可根据需要调整持续时间和缓动函数 */
  }

  .card >>> .ant-image-mask {
    border-radius: 15%;
  }

  .card-tags {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
  }

  .card-status {
    display: flex;
    align-items: center;

    /* margin-right: 10px; */
  }

  .card-date {
    color: #8c8c8c;
    font-size: 0.8em;
  }

  .search-card {
    height: 60px;
    padding: 0;
    border-radius: 4px;
  }

  .search-row {
    margin: 0 !important;
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

  .custom-radio-group >>> .ant-tag {
    margin-right: 0;
  }

  .no-border-button {
    border: 1px solid transparent !important;
  }

  .lazyImag ::v-deep .lazy__img[lazy='loading'] {
    width: 100%;
    padding: 5em 0;
  }

  .lazyImag ::v-deep .lazy__img[lazy='loaded'] {
    width: 100%;
  }

  .lazyImag ::v-deep .lazy__img[lazy='error'] {
    width: 100%;
    padding: 5em 0;
  }
</style>
