<template>
  <a-layout style="width: 100%; overflow: hidden">
    <Loading :loading="doLoading" :absolute="false" tip="正在加载中" />

    <!-- 查询框 -->
    <a-row>
      <a-col
        :span="24"
        style="display: flex; flex-direction: row; justify-content: center; margin-top: 20px"
      >
        <div style="display: flex; flex-direction: row; justify-content: center">
          <a-input-group compact style="display: flex; justify-content: center">
            <a-input
              v-model:value="searchForm.url"
              placeholder="这里输入作者的作品编号或者用户名~"
              style="width: 500px; height: 40px"
            />
            <a-button style="height: 40px" type="primary" @click="doAnalysis">立即查询</a-button>
          </a-input-group>
          <a-button style="height: 40px; margin-left: 10px" @click="clear">清空</a-button>
        </div>
      </a-col>

      <a-col
        :span="24"
        style="
          display: flex;
          justify-content: center;
          margin-top: 20px;
          border: 1px solid transparent;
          border-radius: 8px;
        "
      >
        <div
          style="
            width: 800px;
            padding: 8px;
            border: 1px solid transparent;
            border-radius: 8px;
            background-color: #fff7e8;
          "
        >
          <span style="padding: 3px 10px; color: rgb(0 0 0 / 70%)"
            >小提示：复制小红书的分享链接即可一键解析获取无水印原图，点击大图后右键下载！后续可用MJ账号进行一键二创作哦~</span
          >
        </div>
      </a-col>
    </a-row>

    <div v-else>
      <a-card style="width: 100%">
        <template #title>
          <Icon class="vel-icon icon" icon="fluent:tag-28-regular" /> {{ shareViewForm.title }}
          <a-button
            v-if="!shareViewForm.passwordPass && shareViewForm.needPassword === 'true'"
            @click="shareViewOpen"
            size="small"
            style="margin-left: 20px"
          >
            请求访问
          </a-button>
        </template>
        <span v-if="shareViewForm.content && shareViewForm.content.length > 0">{{
          shareViewForm.content
        }}</span>
        <div v-else>
          <a-empty :image="simpleImage" />
        </div>
      </a-card>
    </div>

    <div id="scrollbar" ref="scrollbarRef" style="flex-wrap: wrap; overflow: auto">
      <a-card>
        <template #title>
          <Icon class="vel-icon icon" icon="mynaui:image" /> 图片列表- {{ shareViewForm.totalPics }}
          张（请使用国内网络访问！）
        </template>
        <div
          v-if="list.length === 0"
          style="display: flex; align-items: center; justify-content: center"
        >
          <a-empty :image="simpleImage" />
        </div>

        <Waterfall
          v-else
          ref="waterfallRef"
          :list="list"
          :row-key="options.rowKey"
          :gutter="options.gutter"
          :has-around-gutter="options.hasAroundGutter"
          :width="options.width"
          :breakpoints="options.breakpoints"
          :img-selector="options.imgSelector"
          :background-color="options.backgroundColor"
          :animation-effect="options.animationEffect"
          :animation-duration="options.animationDuration"
          :animation-delay="options.animationDelay"
          :lazyload="options.lazyload"
          :load-props="options.loadProps"
          :cross-origin="options.crossOrigin"
        >
          <template #item="{ item, url, index }">
            <div
              v-if="url"
              @mouseenter="doMouseenter(item)"
              @mouseleave="doMouseleave(item)"
              class="rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-linear hover:shadow-lg hover:shadow-gray-600 group"
            >
              <div class="overflow-hidden">
                <a-card :bodyStyle="{ padding: '0px' }" class="lazyImag">
                  <LazyImg
                    v-viewer
                    :url="url"
                    class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105"
                    @load="imageLoad(url)"
                  />
                </a-card>
                <div v-if="item.prompt && item.prompt.length > 0">
                  <div class="move-in" v-if="item.mouseenter">
                    <!-- 上面的 div，最多显示两行文本 -->
                    <div
                      style="
                        display: -webkit-box;
                        flex-grow: 1;
                        width: 100%;
                        padding: 0 3px;
                        overflow: hidden;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                      "
                    >
                      <span style="font-size: 14px">
                        {{ item.prompt }}
                      </span>
                    </div>
                    <!-- 下面的 div，按钮靠右 -->
                    <div
                      style="
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-end;
                        margin: 5px 5px 5px 8px;
                      "
                    >
                      <a-button
                        v-if="!hasPermission('9999')"
                        @click.stop="copyText(item.prompt)"
                        size="small"
                        style="background-color: #5ba585; color: #fff"
                      >
                        复制
                      </a-button>
                      <a-button
                        @click.stop="goDrawing(item.prompt)"
                        style="background-color: #ce6872; color: white"
                        size="small"
                        >同款作画</a-button
                      >
                    </div>
                  </div>
                  <div class="move-out" v-else>
                    <Icon
                      class="vel-icon icon"
                      icon="ant-design:exclamation-circle-twotone"
                      size="15"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Waterfall>
      </a-card>
    </div>

    <!-- 分享收藏 -->
    <a-modal
      v-model:open="shareViewForm.viewFlag"
      title="访问申请"
      ok-text="立即提交"
      @ok="activeAndLoadMore"
      :confirmLoading="doLoading"
    >
      <template #footer>
        <a-button
          v-if="!token && shareViewForm.needPassword === true && shareViewForm.price > 0"
          @click="buyGoods"
        >
          <Icon class="vel-icon icon" icon="fluent-emoji:shopping-cart" size="15" />登录后购买（{{
            shareViewForm.price
          }}元）
        </a-button>

        <a-button
          v-if="token && shareViewForm.needPassword === true && shareViewForm.price > 0"
          @click="buyGoods"
        >
          <Icon class="vel-icon icon" icon="fluent-emoji:shopping-cart" size="15" />购买激活（{{
            shareViewForm.price
          }}元）
        </a-button>
        <a-button type="primary" :loading="shareViewForm.loading" @click="activeAndLoadMore">
          立即提交
        </a-button>
      </template>

      <a-card>
        <a-form :model="shareViewForm" layout="vertical" ref="shareViewFormRef">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: '访问密码',
                  },
                ]"
                name="password"
              >
                <template #label>
                  <span
                    ><Icon
                      icon="teenyicons:password-solid"
                      class="vel-icon icon"
                      aria-hidden="true"
                    />访问密码
                  </span>
                </template>
                <a-input v-model:value="shareViewForm.password" placeholder="输入访问密码" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <span style="color: red; font-size: 10px">如果之前购买过，请登录后刷新即可访问~</span>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>

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
      <span style="color: red; font-size: 10px"
        >请勿关闭窗口，如果主动关闭，请在支付完成后刷新下页面，即可访问！</span
      >
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
  import { collectShareInfo, showShareView, showShareTaskList } from '/@/api/df/drawCollectShare';
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

  const { hasPermission } = usePermission();
  const route = useRoute();
  const id = ref(route.query.id);
  onMounted(async () => {
    initQuery();
  });

  const initQuery = async () => {
    const shareViewInfo = await showShareView({ id: id.value });
    shareViewForm.value.title = shareViewInfo.title;
    shareViewForm.value.content = shareViewInfo.content;
    shareViewForm.value.numSale = shareViewInfo.numSale;
    shareViewForm.value.visitTimes = shareViewInfo.visitTimes;
    shareViewForm.value.needPassword = shareViewInfo.needPassword;
    shareViewForm.value.price = shareViewInfo.price;
    shareViewForm.value.totalPics = shareViewInfo.totalPics;
    shareViewForm.value.id = shareViewInfo.id;
    drawingSampleForm.value.id = shareViewInfo.id;
    if (shareViewInfo.needPassword) {
      shareViewOpen();
      return;
    }
    handleLoadMore(500, true);
  };
  /****************************** 类目相关  ****************************** */

  const shareViewForm = ref({
    loading: false,
    viewFlag: false,
    needPassword: true,
    userName: null,
    password: null,
    title: null,
    content: null,
    visitTimes: 0,
    numSale: 0,
    passwordPass: false,
    totalPics: 0,
    price: 0,
    id: null,
  });

  const shareViewOpen = () => {
    shareViewForm.value.viewFlag = true;
    shareViewForm.value.password = null;
  };

  const activeAndLoadMore = async () => {
    drawingSampleForm.value.id = shareViewForm.value.id;
    drawingSampleForm.value.password = shareViewForm.value.password;
    try {
      shareViewForm.value.loading = true;
      const more = await showShareTaskList(drawingSampleForm.value);
      if (more && more.recordList && more.recordList.length > 0) {
        shareViewForm.value.passwordPass = true;
        list.value.push(...more.recordList);
      } else {
        message.warning('暂无更多数据！');
      }
      drawingSampleForm.value.nextCursorId = more.nextCursorId;
      shareViewForm.value.viewFlag = false;
    } finally {
      shareViewForm.value.loading = false;
    }
  };

  const categoryScrollContainer = ref(null);

  /***************************滚动相关**************************** */
  const drawingSampleForm = ref({
    id: '',
    password: '',
    nextCursorId: '',
  });

  const scrollbarRef = ref(null);
  const doLoading = ref(false);

  const handleScroll = () => {
    if (scrollbarRef.value !== null) {
      console.log('handleScroll');
      const { scrollTop, scrollHeight, clientHeight } = scrollbarRef.value;
      // 计算滚动到一半的位置
      const scrollPosition = scrollTop + clientHeight;
      const thirdWayPoint = (scrollHeight - clientHeight) / 3;
      const halfwayPoint = (scrollHeight - clientHeight) * 0.5;
      const tenWayPoint = (scrollHeight - clientHeight) * 0.9;

      // 当滚动到一半时触发加载
      // if(!doLoading.value && !loadAllData.value) {
      if (!loadAllData.value) {
        if (
          scrollPosition >= thirdWayPoint ||
          scrollPosition >= halfwayPoint ||
          scrollPosition >= tenWayPoint
        ) {
          handleLoadMore(500, false);
        }
      }

      // if (scrollTop + clientHeight >= scrollHeight - 50 && !doLoading.value) {
      //   handleLoadMore(500, false);
      // }
    }
  };
  const throttledScroll = debounce(handleScroll, 700);
  onMounted(() => {
    window.addEventListener('scroll', throttledScroll, true);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', throttledScroll);
  });

  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  /************************* 放大图片*************************** */
  // const images = ref<{src:string, msrc:string,alt:string}[]>([])

  // const showImage = (imageUrl:string) => {
  //   images.value = [{src:imageUrl, msrc:imageUrl, alt:'123'}];
  //   const imageList = [];
  //   imageList.push(imageUrl);
  //   viewerApi({
  //           options: {
  //             toolbar: true,
  //             url: 'data-source',
  //             initialViewIndex: 1
  //           },
  //           images: imageList
  //         })
  // }

  /************************* 样例相关 ******************** */

  const waterfallRef = ref(null);

  // 加载更多
  const loadAllData = ref(false);
  async function handleLoadMore(cacheTime, neededLoading) {
    if (drawingSampleForm.value.nextCursorId === '-1') {
      // message.warning('暂无更多数据！');
      loadAllData.value = true;
      doLoading.value = false;
      return;
    }

    try {
      doLoading.value = neededLoading;
      const more = await showShareTaskList(drawingSampleForm.value);
      if (more && more.recordList && more.recordList.length > 0) {
        list.value.push(...more.recordList);
      } else {
        message.warning('暂无更多数据！');
      }
      drawingSampleForm.value.nextCursorId = more.nextCursorId;
    } finally {
      // 延迟 1 秒后执行操作
      doLoading.value = false;
      // if (drawingSampleForm.value.nextCursorId != '-1') {
      //   setTimeout(function () {
      //     doLoading.value = false;
      //   }, cacheTime);
      // }
    }
  }
  /*********************************** 基础配置 ******************************** */
  const userSetting = ref({
    useUpImage: false,
    usePersonNet: false,
  });
  const setUseUpImage = (): void => {
    userSetting.value.useUpImage = !userSetting.value.useUpImage;
  };

  const setUsePersonNet = (): void => {
    userSetting.value.usePersonNet = !userSetting.value.usePersonNet;
  };

  const getImageSource = (card) => {
    const baseImageSource = userSetting.value.usePersonNet ? card.cdnResultImage : card.resultImage;

    return userSetting.value.useUpImage ? baseImageSource : card.mediaImageUrl;
  };

  const options = reactive({
    // 唯一key值
    rowKey: 'id',
    // 卡片之间的间隙
    gutter: 1,
    // 是否有周围的gutter
    hasAroundGutter: true,
    // 卡片在PC上的宽度
    width: 0,
    // 自定义行显示个数，主要用于对移动端的适配
    breakpoints: {
      3800: {
        // 当屏幕宽度小于等于1200
        rowPerView: 10,
      },
      1800: {
        // 当屏幕宽度小于等于1200
        rowPerView: 5,
      },
      1600: {
        // 当屏幕宽度小于等于1200
        rowPerView: 4,
      },
      1200: {
        // 当屏幕宽度小于等于1200
        rowPerView: 3,
      },
      800: {
        // 当屏幕宽度小于等于800
        rowPerView: 2,
      },
      500: {
        // 当屏幕宽度小于等于500
        rowPerView: 1,
      },
    },
    // 动画效果
    animationEffect: 'fadeIn',
    // 动画时间
    animationDuration: 1000,
    // 动画延迟
    animationDelay: 300,
    // 背景色
    backgroundColor: 'none',
    // imgSelector
    imgSelector: 'taskImage.imageUrl',
    // 加载配置
    loadProps: {
      loading,
      error,
    },
    // 是否懒加载
    lazyload: true,
  });

  const emits = defineEmits({
    cardClick: null,
  });

  const doMouseenter = (item) => {
    item.mouseenter = true;
  };
  const doMouseleave = (item) => {
    item.mouseenter = false;
  };

  interface ViewCard {
    // src: any;
    // id?: string;
    // name?: string;
    // star?: boolean;
    // backgroundColor?: string;
    // [attr: string]: any;

    taskImage: any;

    /**
     * 关键词内容JSON
     */
    prompt: string;
  }

  // 列表
  const list = ref<{ ViewCard }[]>([]);

  function handleClick(item: ViewCard) {
    emits('cardClick', item);
  }

  function imageLoad(url: string) {
    // console.log(`${url}: 加载完成`)
  }

  //画同款
  const go = useGo();
  const goDrawing = async (queryParams) => {
    go('/mj/index?activeTab=TextToImageForm&prompt=' + queryParams);
  };

  /***************************支付************************* */
  const payForm = ref({
    qrCodeUrl: 'https://qr.alipay.com/bax03494nng4xiqjw5kt5559',
    viewFlag: false,
    outTradeNo: '',
    paySuccess: false,
    intervalId: null as ReturnType<typeof setInterval> | null,
  });

  const buyGoods = async () => {
    // if (!token) {
    //   message.error('请登录后再购买~');
    //   return;
    // }

    shareViewForm.value.loading = true;
    try {
      const resp = await createShareTrade({ id: shareViewForm.value.id });
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
      shareViewForm.value.loading = false;
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
