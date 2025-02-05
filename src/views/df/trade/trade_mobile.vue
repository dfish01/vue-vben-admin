<template>
  <a-layout class="app" v-loading="loadingRef">
    <a-card :bodyStyle="{ padding: 0, height: '50px' }">
      <a-row
        ref="formRef"
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
          <span style="margin-left: 5px; font-size: 16px; font-weight: bold">交易记录</span>
        </div>
        <div style="display: flex; gap: 5px">
          <a-tooltip title="订单查询">
            <a-button @click="showQueryView" style="padding: 0 5px; border-radius: 10px">
              <Icon icon="uil:search-alt" size="22" />
            </a-button>
          </a-tooltip>
          <a-tooltip title="市场">
            <a-button @click="goView('/goods/index')" style="padding: 0 5px; border-radius: 10px">
              <Icon icon="ph:shopping-cart-bold" size="22" />
            </a-button>
          </a-tooltip>
          <a-tooltip title="去激活">
            <a-button
              @click="goView('/accDiscord/index')"
              style="padding: 0 5px; border-radius: 10px"
            >
              <Icon icon="solar:key-square-2-linear" size="20" />
            </a-button>
          </a-tooltip>
        </div>
      </a-row>
    </a-card>

    <div
      v-if="cards.length === 0"
      style="display: flex; align-items: center; justify-content: center"
      :style="{ height: `calc(${contentHeight}px `, overflow: 'auto', padding: '8px' }"
    >
      <a-empty :image="simpleImage" />
    </div>
    <div
      v-else
      class="cards"
      :style="{
        height: `calc(${contentHeight}px `,
        overflow: 'auto',
        padding: '0 8px',
      }"
    >
      <div v-for="card in cards" :key="card.id" :trigger="['contextmenu']">
        <a-badge-ribbon :text="getStateText(card)" :color="getStateColor(card)">
          <a-card :bodyStyle="{ padding: '0px' }" class="card" hoverable>
            <!-- <a-image :src="card.imageUrl" class="card-image" preview="false" fallback="" /> -->
            <template #extra>
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  width: 250px;
                "
              >
                <div style="justify-content: left">
                  <span>🪧{{ card.goodsTitle }}</span>
                </div>
              </div>
            </template>
            <div style="display: flex; flex-direction: column; padding: 10px">
              <a-row class="card-tags">
                <span>
                  ⚡商品名称：
                  <span style="font-weight: bolder">{{ card.goodsTitle }}</span></span
                >
              </a-row>
              <a-row class="card-tags">
                <span>
                  ⚡订单类型：
                  <span style="font-weight: bolder">{{
                    card.orderType === 'GROUP' ? '拼团' : '单品'
                  }}</span></span
                >
              </a-row>
              <a-row class="card-tags">
                <span>
                  📅下单时间：
                  <span style="font-weight: bolder">{{ card.gmtCreate }}</span></span
                >
              </a-row>
              <a-row class="card-tags">
                <span>
                  📅支付时间：
                  <span style="font-weight: bolder">{{ card.gmtPay }}</span></span
                >
              </a-row>
              <a-row class="card-tags">
                <a-col :span="24" v-if="card.state === 'WAIT_PAY'">
                  <a-button @click="payOrder(card)" style="width: 50%">立即支付 </a-button>
                  <a-button @click="cancelOrder(card)" style="width: 50%">取消交易 </a-button>
                </a-col>
                <a-col :span="24" v-if="card.state === 'WAIT_SEND'">
                  <a-button @click="allText(card)" style="width: 50%">催发货 </a-button>
                  <a-button @click="showConnect(card)" style="width: 50%">联系客服 </a-button>
                </a-col>
                <a-col :span="24" v-if="card.state === 'CANCEL'">
                  <a-button @click="reBuyGoods(card)" style="width: 100%">重新购买</a-button>
                </a-col>
                <a-col :span="24" v-if="card.state === 'FINISHED' || card.state === 'CLOSED'">
                  <a-button @click="reBuyGoods(card)" style="width: 100%">再来一单</a-button>
                </a-col>
              </a-row>
            </div>
            <!-- 更多卡片内容 -->
          </a-card>
        </a-badge-ribbon>
      </div>
    </div>
    <div ref="buttonRef">
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
    <!-- 支付弹窗 -->
    <a-modal
      v-model:visible="payForm.viewFlag"
      title="打开支付宝扫码支付"
      style="width: 410px; height: 450px"
      @cancel="closeView"
    >
      <template #footer>
        <a-button type="primary" @click="closeView"> 我已完成支付 </a-button>
      </template>
      <CollapseContainer title="本地logo示例" class="text-center mb-6 qrcode-demo-item">
        <QrCode :value="payForm.qrCodeUrl" :logo="LogoImg" :width="400" />
      </CollapseContainer>
    </a-modal>

    <!-- 条件查询 -->
    <a-modal
      v-model:visible="tradeForm.viewFlag"
      width="100%"
      title="🔍️条件查询"
      :bodyStyle="{ padding: '7px 12px 7px 12px', width: '100%', 'align-items': 'center' }"
    >
      <template #footer>
        <a-button key="submit" type="primary" @click="doSearch()">立即查询</a-button>
      </template>
      <a-card
        :bordered="false"
        :bodyStyle="{ padding: '1px 1px 1px 1px', width: '100%', 'align-items': 'center' }"
      >
        <a-row :gutter="[0, 2]" type="flex">
          <a-col flex="100px">
            <a-tag class="quality-tag" color="default">🍺订单状态 </a-tag>
          </a-col>
          <a-col flex="auto">
            <a-select
              placeholder="订单状态"
              v-model:value="tradeForm.state"
              class="mobile-select"
              style="width: 100%"
            >
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="WAIT_PAY">待支付</a-select-option>
              <a-select-option value="WAIT_SEND">正在发货</a-select-option>
              <a-select-option value="CANCEL">取消</a-select-option>
              <a-select-option value="CLOSED">关闭</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row type="flex" :gutter="[0, 2]" style="margin-top: 7px">
          <a-col flex="100px">
            <a-tag class="quality-tag" color="default"
              ><Icon icon="fluent-emoji-flat:label" size="20" /> 商品名称
            </a-tag>
          </a-col>
          <a-col flex="auto">
            <a-input
              v-model:value="tradeForm.goodsTitle"
              autofocus
              placeholder="商品名称模糊查询~"
              style="width: 100%"
            />
          </a-col>
        </a-row>
      </a-card>
    </a-modal>
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, computed, unref, toRefs, watch } from 'vue';
  import { QrCode, QrCodeActionType } from '/@/components/Qrcode/index';
  import LogoImg from '/@/assets/images/logo.png';
  import {
    DeleteOutlined,
    InfoCircleOutlined,
    DownloadOutlined,
    EyeFilled,
    EyeInvisibleFilled,
    DiffOutlined,
    DeleteFilled,
    HeartOutlined,
    HeartFilled,
  } from '@ant-design/icons-vue';
  import { downloadByOnlineUrl } from '/@/utils/file/download';
  import {
    TradeListQueryReq,
    CreateTradeReq,
    CreateTradeResp,
    ListResultModel,
    TradeListResp,
  } from '/@/api/df/model/tradeModel';
  import { addGoods, goodsList, deleteGoods } from '/@/api/df/goods';
  import { createTradeApi, tradeListApi, fetchPayResultApi, cancelTradeApi } from '/@/api/df/trade';
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
  import Icon from '/@/components/Icon/Icon.vue';
  import { useGo } from '/@/hooks/web/usePage';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

  const go = useGo();
  const goView = async (routePath) => {
    go(routePath);
  };

  /** 页面高度计算开始 */
  const formRef = ref();
  //页面高度处理
  const buttonRef = ref(null);
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 0);
  //移动设备底部导航栏
  const offsetHeightRef = ref(95);
  const subtractHeightRefs = ref([buttonRef]);

  // 使用hook
  const { contentHeight, redoHeight } = useContentHeight(
    computed(() => true),
    formRef,
    unref(subtractHeightRefs), // 使用 unref 获取数组值
    unref(substractSpaceRefs),
    upwardSpace,
    offsetHeightRef,
  );
  const getStateColor = (card) => {
    //状态 PENDING:排队中 EXECUTING:执行中 FINISHED:已完成 FAIL:失败 取消:CANCEL 中断：DOWN
    console.log(card.state);
    //CREATE','WAIT_PAY','WAIT_SEND','FINISHED','CNACEL','CLOSED
    switch (card.state) {
      case 'WAIT_PAY':
        return '#CDBE78';
      case 'WAIT_SEND':
        return '#066163';
      case 'FINISHED':
        return '#FBD46D';
      case 'CANCEL':
        return '#7D7C7C';
      case 'CLOSED':
        return '#7D7C7C';
      default:
        return 'default';
    }
  };

  const getStateText = (card) => {
    //CREATE','WAIT_PAY','WAIT_SEND','FINISHED','CNACEL','CLOSED
    switch (card.state) {
      case 'WAIT_PAY':
        return '待支付';
      case 'WAIT_SEND':
        return '正在发货';
      case 'FINISHED':
        return '已完成';
      case 'CANCEL':
        return '取消';
      case 'CLOSED':
        return '关闭';
      default:
        return '其他';
    }
  };

  const tradeForm = ref({
    goodsTitle: null,
    state: null,
    viewFlag: false,
  });

  const showQueryView = () => {
    tradeForm.value.viewFlag = true;
  };

  const doSearch = async () => {
    await onSearch(1);
    message.success('已刷新查询结果');
    tradeForm.value.viewFlag = false;
  };

  onMounted(() => {
    onSearch(1);
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
  const cards = ref<TradeListResp[]>([
    // 更多数据...
  ]);

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

  const loadingRef = ref(false);
  const onSearch = async (current?: number) => {
    console.log('************************');
    if (typeof current === 'undefined') {
      current = 1;
    }
    pagination.value.current = current;
    loadingRef.value = true;

    const response = await tradeListApi({
      goodsTitle: tradeForm.value.goodsTitle,
      state: tradeForm.value.state,
      current: current,
      pageSize: pagination.value.pageSize,
    });
    cards.value = response.records;
    pagination.value.total = response.total;

    loadingRef.value = false;
    console.log(111111111111);
  };
  /***************************支付************************* */
  const payForm = ref({
    qrCodeUrl: 'https://qr.alipay.com/bax03494nng4xiqjw5kt5559',
    viewFlag: false,
    outTradeNo: '',
    paySuccess: false,
    intervalId: null as ReturnType<typeof setInterval> | null,
  });

  const payOrder = async (card) => {
    loadingRef.value = true;
    try {
      payForm.value.outTradeNo = card.outTradeNo;
      payForm.value.qrCodeUrl = card.qrCode;
      payForm.value.viewFlag = true;

      //轮询支付结果
      if (payForm.value.intervalId === null) {
        payForm.value.intervalId = setInterval(() => {
          console.log('--------fetchPayResult---------');
          fetchPayResult();
        }, 3000);
      }
    } finally {
      loadingRef.value = false;
    }
  };
  const reBuyGoods = async (card) => {
    loadingRef.value = true;
    try {
      const resp = await createTradeApi({ id: card.goodsId });
      payForm.value.outTradeNo = resp.outTradeNo;
      payForm.value.qrCodeUrl = resp.qrCode;
      payForm.value.viewFlag = true;
      onSearch(1);
      //轮询支付结果
      if (payForm.value.intervalId === null) {
        payForm.value.intervalId = setInterval(() => {
          console.log('--------fetchPayResult---------');
          fetchPayResult();
        }, 3000);
      }
    } finally {
      loadingRef.value = false;
    }
  };
  const cancelOrder = async (card) => {
    loadingRef.value = true;
    try {
      await cancelTradeApi({ id: card.id });
      onSearch(1);
      message.success('取消成功');
    } finally {
      loadingRef.value = false;
    }
  };
  const closeView = async () => {
    if (payForm.value.intervalId) {
      clearInterval(payForm.value.intervalId);
    }
    payForm.value.intervalId = null;
    payForm.value.viewFlag = false;
  };

  /**
   * 查询支付结果
   */
  const fetchPayResult = async () => {
    const resp = await fetchPayResultApi({ content: payForm.value.outTradeNo });
    payForm.value.paySuccess = resp;
    if (resp === true) {
      message.success('支付成功！');
      onSearch(1);
      closeView();
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

  :deep(.ant-card-body) {
    padding: 10px; /* 您想要的padding值 */
  }

  .app {
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100%;
    overflow-y: auto;

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
    grid-template-columns: repeat(auto-fill, minmax(261px, 1fr));
    flex: 1;
    align-content: start;
    margin-top: 1px;
    margin-bottom: 3px;
    padding: 0 10px;
    overflow: auto;
    gap: 3px;
  }

  .card {
    min-width: 261px;
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
</style>
