<template>
  <div class="app" ref="formRef" v-loading="loadingRef">
    <div
      class="cards"
      :style="{ height: `calc(${contentHeight}px - 11vh)`, overflow: 'auto', padding: '0px' }"
    >
      <div v-for="card in cards" :key="card.id" :trigger="['contextmenu']">
        <a-badge-ribbon
          :text="card.goodsType == 'GOODS' ? '单品' : '拼团'"
          :color="card.goodsType == 'GOODS' ? 'pink' : 'blue'"
        >
          <a-card :bodyStyle="{ padding: '0px 10px 0px 10px' }" class="card" hoverable>
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
                  ⚡Turbo次数
                  <span style="font-weight: bolder">{{ card.infoBody.turboTimes }}</span></span
                >
                <span>
                  🐇Fast次数
                  <span style="font-weight: bolder">{{ card.infoBody.fastTimes }}</span></span
                >
              </a-row>

              <a-row class="card-tags">
                <span>
                  🐢Relax次数
                  <span style="font-weight: bolder">{{ card.infoBody.relaxTimes }}</span></span
                >
                <span>
                  📅天数 <span style="font-weight: bolder">{{ card.infoBody.authDays }}</span></span
                >
              </a-row>
              <a-row class="card-tags">
                <a-col>
                  <div>
                    <span>🙆‍♂️人数 </span>
                    <span style="font-weight: bolder" v-if="card.maxGroupMembers === 1">
                      独享
                    </span>
                    <span style="font-weight: bolder" v-if="card.maxGroupMembers === -1">
                      不限
                    </span>
                    <span v-if="card.maxGroupMembers > 1">
                      <span style="font-weight: bolder">{{ card.minGroupMembers }}</span> ~
                      <span style="font-weight: bolder">{{ card.maxGroupMembers }}</span>
                    </span>
                  </div>
                </a-col>
                <a-col>
                  <div>
                    <a-tag disabled>🚩账号情况</a-tag>
                  </div>
                </a-col>
              </a-row>
              <a-row class="card-tags">
                <a-col>
                  <a-tag color="red">🔥官方</a-tag>
                </a-col>
              </a-row>
              <a-row class="card-tags">
                <a-button @click="buyGoods(card)" style="width: 100%"
                  >立即购买 💰{{ card.goodsPrice }}</a-button
                >
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
  </div>
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
    GoodsAddParams,
    GoodsListReq,
    GoodsListResp,
    ListResultModel,
  } from '/@/api/df/model/goodsModel';
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
  import { message } from 'ant-design-vue';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { addTag } from '/@/api/df/drawTaskTag';

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
  const cards = ref<GoodsListResp[]>([
    // 更多数据...
  ]);

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

    const response = await goodsList({ current: current, pageSize: pagination.value.pageSize });
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

  const buyGoods = async (card) => {
    if (card.skipType === 'THIRD') {
      openNewWindow(card.skipLink);
    } else {
      loadingRef.value = true;
      try {
        const resp = await createTradeApi({ id: card.id });
        payForm.value.outTradeNo = resp.outTradeNo;
        payForm.value.qrCodeUrl = resp.qrCode;
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
      closeView();
    }
  };

  const openNewWindow = (url) => {
    window.open(url, '_blank');
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
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    flex: 1;
    align-content: start;
    padding: 10px;
    overflow: auto;
    gap: 14px;
  }

  .card {
    min-width: 200px;
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
    height: 10vh;
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
