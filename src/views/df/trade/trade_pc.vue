<template>
  <a-layout class="app" v-loading="loadingRef">
    <a-card
      :style="{ height: `calc(100vh - 49px)`, overflow: 'auto' }"
      :bodyStyle="{ padding: '0px' }"
    >
      <!-- 查询位置 -->
      <a-row ref="formRef" style="height: 52px; padding: 0 25px" align="middle" justify="end">
        <a-select
          placeholder="订单状态"
          v-model:value="tradeForm.state"
          class="mobile-select"
          @change="onSearch(1)"
          style="width: 100px; margin-right: 10px"
        >
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="WAIT_PAY">待支付</a-select-option>
          <a-select-option value="WAIT_SEND">正在发货</a-select-option>
          <a-select-option value="CANCEL">取消</a-select-option>
          <a-select-option value="CLOSED">关闭</a-select-option>
        </a-select>
        <a-input
          v-model:value="tradeForm.goodsTitle"
          autofocus
          placeholder="商品模糊查询~"
          style="width: 200px; height: 32px; margin-right: 10px"
        />
        <a-button type="primary" @click="onSearch(1)">🔍查询</a-button>
      </a-row>
      <a-row style="align-items: center" justify="start" align="center">
        <a-divider style="height: 1px; margin: 0" />
      </a-row>
      <a-row
        justify="start"
        align="top"
        style="
          margin: 10px 20px;
          padding: 8px;
          border: 1px solid transparent;
          border-radius: 8px;
          background-color: #fff7e8;
        "
      >
        <span style="padding: 3px 20px; color: rgb(0 0 0 / 70%)">
          <Icon icon="flat-color-icons:idea" color="#91C8E4" />
          大多数商品会执行自动发货，你可以关注下邮件或则在系统上查看下发货信息。另外有些产品是自动激活的，请刷新下页面即可！
        </span>
      </a-row>
      <!-- 内容位置 -->
      <div
        v-if="cards.length === 0"
        style="display: flex; align-items: center; justify-content: center"
        :style="{ height: `calc(100vh - 503px)`, overflow: 'auto' }"
      >
        <a-empty :image="simpleImage" />
      </div>
      <div
        v-else
        class="cards"
        :style="{
          height: `calc(100vh - 223px)`,
          overflow: 'auto',
          padding: '8px 20px ',
        }"
      >
        <div v-for="card in cards" :key="card.id" :trigger="['contextmenu']">
          <a-card :bodyStyle="{ padding: '0px' }" class="card" hoverable>
            <!-- <a-image :src="card.imageUrl" class="card-image" preview="false" fallback="" /> -->

            <div style="display: flex; flex-direction: column; padding: 10px">
              <a-row class="card-tags">
                <span>
                  <Icon icon="mdi:tag" class="vel-icon icon" aria-hidden="true" />交易名称：
                  <span style="font-weight: bolder">{{ card.goodsTitle }}</span></span
                >
              </a-row>
              <a-row class="card-tags">
                <span>
                  <Icon
                    icon="fluent-mdl2:tag-unknown"
                    class="vel-icon icon"
                    aria-hidden="true"
                  />订单类型：
                  <span style="font-weight: bolder">{{ card.tradeTypeStr }}</span></span
                >
              </a-row>
              <a-row class="card-tags">
                <span>
                  <Icon
                    icon="mdi:state-machine"
                    class="vel-icon icon"
                    aria-hidden="true"
                  />订单状态：
                  <span style="font-weight: bolder">
                    <a-tag :color="getStateColor(card)">{{ getStateText(card) }} </a-tag>
                  </span></span
                >
              </a-row>

              <a-row class="card-tags">
                <span>
                  <Icon
                    icon="mdi:timer-sync-outline"
                    class="vel-icon icon"
                    aria-hidden="true"
                  />下单时间： <span>{{ card.gmtCreate }}</span></span
                >
              </a-row>
              <a-row class="card-tags">
                <span>
                  <Icon
                    icon="ic:outline-timer"
                    class="vel-icon icon"
                    aria-hidden="true"
                  />支付时间： <span>{{ getPayTimeText(card) }}</span></span
                >
              </a-row>
              <a-row class="card-tags">
                <a-col :span="24" v-if="card.state === 'WAIT_PAY'">
                  <a-button-group style="width: 100%">
                    <a-button type="primary" @click="payOrder(card)" style="width: 50%"
                      >立即支付
                    </a-button>
                    <a-button @click="cancelOrder(card)" style="width: 50%">取消交易 </a-button>
                  </a-button-group>
                </a-col>
                <a-col :span="24" v-if="card.state === 'WAIT_SEND'">
                  <a-button-group style="width: 100%">
                    <a-button type="warning" @click="openSpeedSend(card)" style="width: 50%"
                      >催发货
                    </a-button>
                    <a-button @click="openAfterSaleView(card)" style="width: 50%"
                      >联系客服
                    </a-button>
                  </a-button-group>
                </a-col>
                <a-col :span="24" v-if="card.state === 'CANCEL'">
                  <a-button-group style="width: 100%">
                    <a-button type="primary" @click="reBuyGoods(card)" style="width: 50%"
                      >重新购买</a-button
                    >
                    <a-button @click="delOrder(card)" style="width: 50%" danger>删除记录</a-button>
                  </a-button-group>
                </a-col>
                <a-col :span="24" v-if="card.state === 'FINISHED' || card.state === 'CLOSED'">
                  <a-button-group style="width: 100%">
                    <a-button type="primary" @click="reBuyGoods(card)" style="width: 50%"
                      >再来一单</a-button
                    >
                    <a-button @click="openDeliverInfo(card)" style="width: 50%">发货信息</a-button>
                  </a-button-group>
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
            style="padding: 0 10px"
          />
        </a-card>
      </div>
    </a-card>
    <!-- 支付弹窗 -->
    <a-modal
      v-model:open="payForm.viewFlag"
      title="打开支付宝扫码支付"
      style="width: 410px; height: 450px"
      @cancel="closeView"
    >
      <template #footer>
        <a-button type="primary" @click="closeView"> 我已完成支付 </a-button>
      </template>
      <CollapseContainer title="支付码" class="text-center mb-6 qrcode-demo-item">
        <QrCode :value="payForm.qrCodeUrl" :logo="LogoImg" :width="400" />
      </CollapseContainer>
    </a-modal>

    <!-- 联系客服 -->
    <a-modal v-model:open="systemConfigViewForm.viewFlag">
      <template #title>
        <Icon icon="streamline-emojis:bell" />
        <span> {{ systemConfigViewForm.title }}</span>
      </template>

      <template #footer>
        <a-button
          key="submit"
          type="primary"
          @click="closeAfterSaleView"
          :loading="systemConfigViewForm.loading"
          >已知悉</a-button
        >
      </template>
      <a-spin :spinning="systemConfigViewForm.loading">
        <div style="padding: 10px 20px">
          <MarkdownViewer :value="systemConfigViewForm.content" />
        </div>
      </a-spin>
    </a-modal>
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, computed, unref, toRefs, watch } from 'vue';
  import { QrCode, QrCodeActionType } from '/@/components/Qrcode/index';
  import LogoImg from '/logo.png';
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
  import Icon from '/@/components/Icon/Icon.vue';
  import { addGoods, goodsList, deleteGoods } from '/@/api/df/goods';
  import {
    createTradeApi,
    tradeListApi,
    fetchPayResultApi,
    cancelTradeApi,
    delTradeApi,
  } from '/@/api/df/trade';
  import { IdReq } from '/@/api/model/baseModel';
  import { listCollects, removeCollect, createCollect } from '/@/api/df/drawCollect';
  import {
    AddDrawCollectReq,
    DrawCollectListQueryReq,
    DrawCollectListResp,
  } from '/@/api/df/model/drawCollectModel';
  import { afterSaleInfo } from '/@/api/df/utils';
  import { message, Empty } from 'ant-design-vue';
  import { MarkdownViewer } from '/@/components/Markdown';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  const getStateColor = (card) => {
    //状态 PENDING:排队中 EXECUTING:执行中 FINISHED:已完成 FAIL:失败 取消:CANCEL 中断：DOWN
    console.log(card.state);
    //CREATE','WAIT_PAY','WAIT_SEND','FINISHED','CNACEL','CLOSED
    switch (card.state) {
      case 'WAIT_PAY':
        return 'blue';
      case 'WAIT_SEND':
        return '#066163';
      case 'FINISHED':
        return 'green';
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
  const getPayTimeText = (card) => {
    //CREATE','WAIT_PAY','WAIT_SEND','FINISHED','CNACEL','CLOSED
    switch (card.state) {
      case 'WAIT_PAY':
        return '等待支付中...';
      case 'WAIT_SEND':
        return card.gmtPay;
      case 'FINISHED':
        return card.gmtPay;
      case 'CANCEL':
        return '订单已取消.';
      case 'CLOSED':
        return '订单已关闭.';
      default:
        return card.gmtPay;
    }
  };

  const tradeForm = ref({
    goodsTitle: null,
    state: null,
  });
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
  const delOrder = async (card) => {
    loadingRef.value = true;
    try {
      await delTradeApi({ id: card.id });
      onSearch(1);
      message.success('删除成功');
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

  /****************************** 交流群 && 教程 && 公告 && 活动 && 售后 ******************************** */

  const systemConfigViewForm = ref({
    viewFlag: false,
    content: '',
    title: '',
    loading: false,
  });

  /**
   * 联系客服
   */
  const openAfterSaleView = async () => {
    systemConfigViewForm.value.title = '售后客服';
    systemConfigViewForm.value.content = await afterSaleInfo({});
    systemConfigViewForm.value.viewFlag = true;
  };
  const closeAfterSaleView = async () => {
    systemConfigViewForm.value.title = '';
    systemConfigViewForm.value.content = '';
    systemConfigViewForm.value.viewFlag = false;
  };

  const openDeliverInfo = async (card) => {
    systemConfigViewForm.value.title = '发货信息';
    systemConfigViewForm.value.content = card.deliverObj;
    systemConfigViewForm.value.viewFlag = true;
  };

  const openSpeedSend = async (card) => {
    systemConfigViewForm.value.title = '正在发货中..';
    systemConfigViewForm.value.content =
      '抱歉久等了，系统正在发货中！请耐心等待。或者麻烦您联系客服处理下。';
    systemConfigViewForm.value.viewFlag = true;
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
  }

  .search-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 52px;
    padding: 20px;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(271px, 1fr));
    flex: 1;
    align-content: start;
    padding: 10px;
    overflow: auto;
    gap: 14px;
  }

  .card {
    min-width: 271px;
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
    height: 52px;
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
    height: 52px;
    padding: 10px;
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
</style>
