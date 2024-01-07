<template>
  <a-layout class="app" v-loading="loadingRef">
    <a-card ref="formRef" :bodyStyle="{ padding: 0, height: '50px' }">
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
          <a-image src="/logo.png" :width="38" :height="38" :preview="false" />
          <span style="margin-left: 5px; font-size: 16px; font-weight: bold">市场</span>
        </div>
        <div style="display: flex; gap: 5px">
          <a-button-group>
            <a-tooltip title="商品查询">
              <a-button @click="showQueryView" style="padding: 5px">
                <SvgIcon name="list_search" size="20" />
              </a-button>
            </a-tooltip>
            <a-tooltip title="交易记录">
              <a-button @click="goView('/trade/index')" style="padding: 5px">
                <SvgIcon name="trade" size="20" />
              </a-button>
            </a-tooltip>
          </a-button-group>
        </div>
      </a-row>
    </a-card>

    <div
      v-if="cards.length === 0"
      style="display: flex; align-items: center; justify-content: center"
      :style="{ height: `calc(${contentHeight}px)`, overflow: 'auto', padding: '8px' }"
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
        <!-- Midjourney -->
        <a-card
          v-if="card.goodsType === 'MIDJOURNEY'"
          :bodyStyle="{ padding: '0px', opacity: '0.75', 'line-height': 1 }"
          class="account-card"
          hoverable
        >
          <!-- <a-image :src="card.imageUrl" class="card-image" preview="false" fallback="" /> -->
          <template #title>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                width: 250px;
              "
            >
              <div style="justify-content: left">
                <Icon icon="ic:outline-bookmark-add" /><span style="margin-left: 5px">
                  {{ card.goodsTitle }}</span
                >
              </div>
            </div>
          </template>
          <div style="display: flex; flex-direction: column; padding: 10px">
            <a-row class="card-tags">
              <a-col flex="90px">
                <span style="font-weight: bolder">
                  <Icon icon="emojione-v1:lightning-mood" /> Turbo
                </span>
              </a-col>
              <a-col flex="auto">
                <span>
                  可用<span>{{
                    card.infoBody.turboTimes !== null ? card.infoBody.turboTimes : '无限'
                  }}</span
                  >次
                </span>
              </a-col>
            </a-row>
            <a-row class="card-tags">
              <a-col flex="90px">
                <span style="font-weight: bolder"> <Icon icon="openmoji:rabbit" /> Fast </span>
              </a-col>
              <a-col flex="auto">
                <span>
                  可用{{ card.infoBody.fastTimes !== null ? card.infoBody.fastTimes : '无限' }}次
                </span>
              </a-col>
            </a-row>
            <a-row class="card-tags">
              <a-col flex="90px">
                <span style="font-weight: bolder">
                  <Icon icon="streamline-emojis:turtle" /> Relax
                </span>
              </a-col>
              <a-col flex="auto">
                <span>
                  可用{{ card.infoBody.relaxTimes !== null ? card.infoBody.relaxTimes : '无限' }}次
                </span>
              </a-col>
            </a-row>
            <a-row
              class="card-tags"
              style="display: flex; justify-content: space-between"
              v-if="card.infoBody.infoBodyStr"
            >
              <div style="width: 90px">
                <span style="font-weight: bolder">
                  <Icon icon="material-symbols:other-admission-outline" /> 其他
                </span>
              </div>
              <div style="flex: 1; flex-wrap: true">
                <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
                  <span v-for="(line, index) in formatLines(card)" :key="index">
                    {{ line }}
                    <br />
                    <!-- 可选：添加换行符 -->
                  </span>
                </div>
              </div>
            </a-row>
            <a-row class="card-tags">
              <a-col flex="90px">
                <span style="font-weight: bolder"> <Icon icon="openmoji:timer" /> 有效期至 </span>
              </a-col>
              <a-col flex="auto">
                <span v-if="card.infoBody.authWay === 'DAY'">
                  激活后 {{ card.infoBody.authDays }} 天
                </span>
                <span v-else> {{ card.infoBody.authExpireTimes }} </span>
              </a-col>
            </a-row>

            <a-row class="card-tags">
              <a-col flex="90px">
                <span style="font-weight: bolder">
                  <Icon icon="flat-color-icons:shipped" /> 发货方式
                </span>
              </a-col>
              <a-col flex="auto">
                <span v-if="card.shipType === 'AUTO'"> 拍下后自动发货 </span>
                <span v-if="card.shipType === 'HAND'"> 请联系客服手动发货 </span>
                <span v-if="card.shipType === 'SYSTEM_ACTIVE'"> 拍下后自动发货并激活 </span>
              </a-col>
            </a-row>

            <a-row class="card-tags">
              <a-col flex="90px">
                <span style="font-weight: bolder"> <Icon icon="jam:box" /> 库存 </span>
              </a-col>
              <a-col flex="auto">
                {{ card.stock }}
              </a-col>
            </a-row>

            <a-row class="card-tags">
              <a-col v-if="card.specialLabel">
                <a-tag color="red">{{ card.specialLabel }} </a-tag>
              </a-col>
            </a-row>

            <a-row class="card-tags" style="display: flex; justify-content: space-between">
              <div style="display: flex; align-items: center; width: 100px">
                <span style="color: #e36414; font-size: 20px; font-weight: orange">
                  <Icon icon="icon-park-solid:paper-money" size="23px" /> {{ card.goodsPrice }}
                </span>
              </div>

              <div style="display: flex; flex: 1; justify-content: flex-end">
                <a-button type="primary" @click="buyGoods(card)">立即购买 </a-button>
              </div>
            </a-row>
            <a-row v-if="card.editFlag && card.editFlag == true" class="card-tags">
              <a-col :span="24">
                <a-button-group style="width: 100%">
                  <a-button style="width: 25%" @click="showModifiedNewGoods(card)">编辑 </a-button>
                  <a-button
                    v-if="card.goodsState === 'DOWN'"
                    style="width: 25%"
                    @click="doChangeGoodsState(card, 'UP')"
                    >上架
                  </a-button>
                  <a-button
                    v-if="card.goodsState === 'UP'"
                    style="width: 25%"
                    @click="doChangeGoodsState(card, 'DOWN')"
                    >下架
                  </a-button>
                  <a-button style="width: 25%" @click="doDeleteGoods(card.id)">删除 </a-button>
                  <a-button style="width: 25%" @click="showStockList(card)">库存 </a-button>
                </a-button-group>
              </a-col>
            </a-row>
          </div>
          <!-- 更多卡片内容 -->
        </a-card>
        <!-- chatGPt -->
        <a-card
          v-else
          :bodyStyle="{ padding: '0px', opacity: '0.75', 'line-height': 1 }"
          class="account-card"
          hoverable
        >
          <template #title>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                width: 250px;
              "
            >
              <div style="justify-content: left">
                <Icon icon="ic:outline-bookmark-add" /><span style="margin-left: 5px">
                  {{ card.goodsTitle }}</span
                >
              </div>
            </div>
          </template>
          <div style="display: flex; flex-direction: column; padding: 10px">
            <a-row class="card-tags">
              <MarkdownViewer :value="card.infoBody.infoBodyStr" />
            </a-row>
            <a-divider style="height: 1px; margin: 4px" />
            <a-row class="card-tags">
              <a-col flex="90px">
                <span style="font-weight: bolder"> <Icon icon="openmoji:timer" /> 有效期至 </span>
              </a-col>
              <a-col flex="auto">
                <span v-if="card.infoBody.authWay === 'DAY'">
                  激活后 {{ card.infoBody.authDays }} 天
                </span>
                <span v-else> {{ card.infoBody.authExpireTimes }} </span>
              </a-col>
            </a-row>
            <a-row class="card-tags">
              <a-col flex="90px">
                <span style="font-weight: bolder">
                  <Icon icon="flat-color-icons:shipped" /> 发货方式
                </span>
              </a-col>
              <a-col flex="auto">
                <span v-if="card.shipType === 'AUTO'"> 拍下后自动发货 </span>
                <span v-if="card.shipType === 'HAND'"> 请联系客服手动发货 </span>
                <span v-if="card.shipType === 'SYSTEM_ACTIVE'"> 拍下后自动发货并激活 </span>
              </a-col>
            </a-row>
            <a-row class="card-tags">
              <a-col flex="90px">
                <span style="font-weight: bolder"> <Icon icon="jam:box" /> 库存 </span>
              </a-col>
              <a-col flex="auto">
                {{ card.stock }}
              </a-col>
            </a-row>
            <a-row class="card-tags" style="display: flex; justify-content: space-between">
              <div style="display: flex; align-items: center; width: 100px">
                <span style="color: #e36414; font-size: 20px; font-weight: orange">
                  <Icon icon="icon-park-solid:paper-money" size="23px" /> {{ card.goodsPrice }}
                </span>
              </div>

              <div style="display: flex; flex: 1; justify-content: flex-end">
                <a-button type="primary" @click="buyGoods(card)">立即购买 </a-button>
              </div>
            </a-row>
            <a-row v-if="card.editFlag && card.editFlag == true" class="card-tags">
              <a-col :span="24">
                <a-button-group style="width: 100%">
                  <a-button style="width: 25%" @click="showModifiedNewGoods(card)">编辑 </a-button>
                  <a-button
                    v-if="card.goodsState === 'DOWN'"
                    style="width: 25%"
                    @click="doChangeGoodsState(card, 'UP')"
                    >上架
                  </a-button>
                  <a-button
                    v-if="card.goodsState === 'UP'"
                    style="width: 25%"
                    @click="doChangeGoodsState(card, 'DOWN')"
                    >下架
                  </a-button>
                  <a-button style="width: 25%" @click="doDeleteGoods(card.id)">删除 </a-button>
                  <a-button style="width: 25%" @click="showStockList(card)">库存 </a-button>
                </a-button-group>
              </a-col>
            </a-row>
          </div>
          <!-- 更多卡片内容 -->
        </a-card>
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
      v-model:open="payForm.viewFlag"
      title="打开支付宝扫码支付"
      style="width: 100%; height: 450px"
      @cancel="closeView"
    >
      <template #footer>
        <a-button type="primary" @click="closeView"> 我已完成支付 </a-button>
      </template>
      <CollapseContainer title="本地logo示例" class="text-center mb-6 qrcode-demo-item">
        <QrCode :value="payForm.qrCodeUrl" :logo="LogoImg" :width="300" />
      </CollapseContainer>
    </a-modal>

    <!-- 条件查询 -->
    <a-modal
      v-model:open="searchForm.viewFlag"
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
            <a-tag class="quality-tag" color="default">🍺商品类型 </a-tag>
          </a-col>
          <a-col flex="auto">
            <a-select
              placeholder="商品类型"
              v-model:value="searchForm.goodsType"
              class="mobile-select"
              style="width: 100%"
            >
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="MIDJOURNEY">midjourney</a-select-option>
              <a-select-option value="GPT">chatGPt</a-select-option>
              <a-select-option value="SYSTEM">系统</a-select-option>
              <a-select-option value="GROUP">拼团</a-select-option>
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
              v-model:value="searchForm.goodsTitle"
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
  import LogoImg from '/logo.png';
  import { SvgIcon } from '/@/components/Icon';
  import { Loading } from '/@/components/Loading';
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
  import { message, Empty } from 'ant-design-vue';
  import Icon from '/@/components/Icon/Icon.vue';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { addTag } from '/@/api/df/drawTaskTag';
  import { useGo } from '/@/hooks/web/usePage';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  const go = useGo();
  const goView = async (routePath) => {
    go(routePath);
  };

  //页面高度处理
  const buttonRef = ref(null);
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 0);
  const offsetHeightRef = ref(100);
  const subtractHeightRefs = ref([buttonRef]);
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

  const searchForm = ref({
    goodsTitle: null,
    goodsType: 'MIDJOURNEY',
    viewFlag: false,
    ownerFlag: 'false',
  });

  const showQueryView = () => {
    searchForm.value.viewFlag = true;
  };

  const doSearch = async () => {
    await onSearch(1);
    message.success('已刷新查询结果');
    searchForm.value.viewFlag = false;
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

    const response = await goodsList({
      current: current,
      pageSize: pagination.value.pageSize,
      goodsTitle: searchForm.value.goodsTitle,
      goodsType: searchForm.value.goodsType,
      ownerFlag: searchForm.value.ownerFlag,
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

  const formatLines = (card) => {
    // 获取infoBodyStr内容
    const infoBodyStr = card.infoBody.infoBodyStr;
    if (infoBodyStr) {
      return infoBodyStr.split('\n');
    }
    return '';
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
    height: 45;
    padding: 20px;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    flex: 1;
    align-content: start;
    margin-top: 2px;
    margin-bottom: 2px;
    padding: 0;
    overflow: auto;
    gap: 3px;
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
