<template>
  <a-layout style="width: 100%; overflow: hidden">
    <Loading :loading="globalLoading" :absolute="false" tip="正在加载中..." />
    <a-card :style="{ height: `calc(100vh - 49px)`, overflow: 'auto' }">
      <a-card>
        <a-row
          justify="start"
          align="top"
          style="
            margin-bottom: 20px;
            padding: 8px;
            border: 1px solid transparent;
            border-radius: 8px;
            background-color: #fff7e8;
          "
        >
          <span style="padding: 3px 10px; color: rgb(0 0 0 / 70%)">
            <Icon icon="flat-color-icons:idea" color="#91C8E4" />
            您可以将账户内的余额提现，但是该操作将收取10%的手续费。因为工作时间的问题，提现金额将在
            48 小时内到账，请耐心等候！有任何问题可联系客服咨询~
          </span>
        </a-row>

        <a-row justify="start" align="top">
          <span style="margin-bottom: 20px; margin-left: 10px; font-size: 14px; font-weight: 800">
            账户余额
          </span>
        </a-row>
        <a-row align="bottom">
          <span style="margin-left: 10px; color: #ff9500; font-size: 28px; font-weight: 800">
            ¥ {{ balanceForm.remainAmount }}
          </span>
          <a-button
            style="margin-bottom: 5px; margin-left: 20px"
            :disabled="balanceForm.remainAmount < 50"
            type="primary"
            @click="withdrawalOpen"
            >提现</a-button
          >
        </a-row>
        <a-row
          style="align-items: center; height: 42px; margin-left: 10px"
          justify="start"
          align="center"
        >
          <a-divider style="height: 1px; margin: 0" />
        </a-row>

        <a-row justify="start" align="top">
          <a-col flex="auto" style="display: flex; flex-direction: row; justify-content: start">
            <div v-for="(amount, index) in balanceForm.rechargeAmountList" :key="amount">
              <a-popconfirm
                :title="'是否确认充值' + amount + '元?'"
                ok-text="立即充值"
                cancel-text="暂不需要"
                @confirm="doRechargeAmount(amount)"
              >
                <a-button style="margin-left: 10px"> ¥ {{ amount }} </a-button>
              </a-popconfirm>
            </div>
          </a-col>
          <a-col
            flex="230px"
            style="display: flex; flex-direction: row; justify-content: space-between"
          >
            <div style="width: 160px">
              <a-input-number
                v-model:value="balanceForm.rechargeAmount"
                addon-before="¥"
                :min="0.01"
                :step="0.01"
                placeholder="请输入充值金额"
              />
            </div>
            <a-popconfirm
              :title="'是否确认充值' + balanceForm.rechargeAmount + '元?'"
              ok-text="立即充值"
              cancel-text="暂不需要"
              @confirm="doRechargeAmount(balanceForm.rechargeAmount)"
            >
              <a-button type="primary" style="width: 60px; height: 31px; padding: 2px"
                >充值</a-button
              >
            </a-popconfirm>
          </a-col>
        </a-row>
      </a-card>
      <a-card style="margin-top: 24px">
        <a-table
          :dataSource="tableData"
          rowKey="id"
          :loading="tableLoading"
          :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
          :pagination="pagination"
        >
          <a-table-column title="账单名称" dataIndex="title" key="title" align="left" :width="150">
            <template #default="{ record }">
              <div>
                <div>
                  {{ record.title }}
                </div>
                <div style="color: rgb(0 0 0 / 70%); font-size: 13px"> #{{ record.id }} </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="账单金额"
            dataIndex="amount"
            key="amount"
            align="left"
            :width="150"
          />

          <a-table-column
            title="变更前"
            dataIndex="beforeAmount"
            key="beforeAmount"
            align="left"
            :width="100"
          />
          <a-table-column
            title="变更后"
            dataIndex="remainAmount"
            key="remainAmount"
            align="left"
            :width="100"
          />

          <a-table-column
            title="账单时间"
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
      </a-card>
    </a-card>
    <!-- 支付弹窗 -->
    <a-modal
      v-model:open="payForm.viewFlag"
      title="打开支付宝扫码支付"
      @cancel="closeView"
      style="width: 450px"
    >
      <template #footer>
        <a-button type="primary" @click="closeView"> 我已完成支付 </a-button>
      </template>
      <CollapseContainer title="支付码" class="text-center mb-6 qrcode-demo-item">
        <QrCode :value="payForm.qrCodeUrl" :logo="LogoImg" :width="400" />
      </CollapseContainer>
      <span
        style="display: flex; justify-content: center; width: 100%; color: red; font-size: 10px"
      >
        请勿关闭窗口，如果主动关闭，请在支付完成后刷新下页面，即可访问！
      </span>
    </a-modal>
    <!-- 提现申请 -->
    <a-modal v-model:open="withdrawalForm.viewFlag" title="提现到账户余额">
      <template #footer>
        <a-button type="primary" @click="doWithdrawal" :loading="withdrawalForm.loading">
          立即提现
        </a-button>
      </template>

      <a-card>
        <a-form :model="withdrawalForm" layout="vertical" ref="withdrawalFormRef">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: '提现金额',
                  },
                ]"
                name="password"
              >
                <template #label>
                  <span
                    ><Icon icon="ph:wallet-fill" class="vel-icon icon" aria-hidden="true" />提现金额
                  </span>
                </template>
                <a-input-number
                  v-model:value="withdrawalForm.applyAmount"
                  addon-before="¥"
                  :min="0.01"
                  :step="0.01"
                  placeholder="请输入提现金额"
                />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: '提现渠道',
                  },
                ]"
                name="withdrawalChannel"
              >
                <template #label>
                  <span
                    ><Icon icon="uil:channel" class="vel-icon icon" aria-hidden="true" />提现渠道
                  </span>
                </template>
                <a-select v-model:value="createAuthForm.authWay" placeholder="提现渠道">
                  <a-select-option value="WCHT">微信</a-select-option>
                  <a-select-option value="ALIPAY">支付宝</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: '提现账号',
                  },
                ]"
                name="withdrawalAccount"
              >
                <template #label>
                  <span
                    ><Icon
                      icon="solar:user-id-broken"
                      class="vel-icon icon"
                      aria-hidden="true"
                    />提现账号
                  </span>
                </template>
                <a-input
                  v-model:value="withdrawalForm.withdrawalAccount"
                  placeholder="请输入提现账号"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: '提现姓名',
                  },
                ]"
                name="withdrawalName"
              >
                <template #label>
                  <span
                    ><Icon
                      icon="fa-solid:user-tag"
                      class="vel-icon icon"
                      aria-hidden="true"
                    />提现姓名
                  </span>
                </template>
                <a-input
                  v-model:value="withdrawalForm.withdrawalName"
                  placeholder="请输入提现姓名"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: false,
                    message: '其他信息',
                  },
                ]"
                name="otherInfo"
              >
                <template #label>
                  <span
                    ><Icon
                      icon="fluent:textbox-16-regular"
                      class="vel-icon icon"
                      aria-hidden="true"
                    />其他信息
                  </span>
                </template>
                <a-input v-model:value="withdrawalForm.otherInfo" placeholder="请输入其他信息" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <span style="color: red; font-size: 10px">请悉知，提现到渠道账户收取10%服务费！</span>
          </a-row>
        </a-form>
      </a-card>
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
  import { flowInfo, getBalance, flowList, withdrawal } from '/@/api/df/wallet';
  import { useRoute } from 'vue-router';
  import { copyText } from '/@/utils/copyTextToClipboard';
  import { QrCode, QrCodeActionType } from '/@/components/Qrcode/index';
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

  /***************************支付************************* */

  onMounted(async () => {
    const balanceResp = await getBalance({});
    balanceForm.value.remainAmount = balanceResp.remainAmount;
  });
  onMounted(async () => {
    onSearch(1);
  });

  const globalLoading = ref(false);
  const balanceForm = ref({
    remainAmount: 0,
    rechargeAmount: null,
    rechargeAmountList: [50, 100, 200, 500, 1000],
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

  /***************************支付************************* */
  const payForm = ref({
    qrCodeUrl: 'https://qr.alipay.com/bax03494nng4xiqjw5kt5559',
    viewFlag: false,
    outTradeNo: '',
    paySuccess: false,
    intervalId: null as ReturnType<typeof setInterval> | null,
  });

  const doRechargeAmount = async (amount) => {
    if (!amount || amount < 0.01) {
      message.error('请输入正确的充值金额~');
      return;
    }

    globalLoading.value = true;
    try {
      const resp = await createRechargeTrade({ rechargeAmount: amount });
      payForm.value.outTradeNo = resp.outTradeNo;
      payForm.value.qrCodeUrl = resp.qrCode;
      payForm.value.viewFlag = true;

      //轮询支付结果
      if (payForm.value.intervalId === null) {
        payForm.value.intervalId = setInterval(() => {
          fetchPayResult();
        }, 3000);
      }
    } finally {
      globalLoading.value = false;
    }
  };
  const closeView = async () => {
    if (payForm.value.intervalId) {
      clearInterval(payForm.value.intervalId);
    }
    payForm.value.intervalId = null;
    payForm.value.viewFlag = false;
    //再次初始化查询
    initQuery();
  };

  /**
   * 查询支付结果
   */
  const fetchPayResult = async () => {
    const resp = await fetchPayResultApi({ content: payForm.value.outTradeNo });
    payForm.value.paySuccess = resp;
    if (resp === true) {
      message.success('支付成功！');
      closeView();
      onSearch(1);
    }
  };

  const openNewWindow = (url) => {
    window.open(url, '_blank');
  };

  // 分页
  const tradeForm = ref({
    viewFlag: false,
  });
  const tradeShow = () => {
    tradeForm.value.viewFlag = true;
  };

  /***************************提现************************* */
  const withdrawalFormRef = ref();
  const withdrawalForm = ref({
    viewFlag: false,
    loading: false,
    otherInfo: null,
    withdrawalName: null,
    withdrawalAccount: null,
    authWay: 'ALIPAY',
    applyAmount: null,
  });

  const doWithdrawal = async () => {
    if (!withdrawalForm.value.applyAmount || withdrawalForm.value.applyAmount < 50) {
      message.error('提现金额需大于等于50元~');
      return;
    }
    await withdrawalFormRef.value.validate();
    withdrawalForm.value.loading = true;
    try {
      await withdrawal({ applyAmount: withdrawalForm.value.applyAmount });
    } finally {
      withdrawalForm.value.loading = false;
    }
  };

  const withdrawalOpen = () => {
    withdrawalForm.value.viewFlag = true;
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

    /* overflow-x: hidden; */

    /* white-space: nowrap; */
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

  /* 
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  flex: 1;
  align-content: start;
  height: calc(90vh - 80px);
  padding: 20px;
  overflow: auto;
  gap: 20px;
} */

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
