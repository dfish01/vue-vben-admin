<template>
  <a-layout style="width: 100%; overflow: hidden">
    <Loading :loading="globalLoading" :absolute="false" tip="正在加载中..." />
    <div
      id="scrollbar"
      ref="scrollbarRef"
      style="flex-wrap: wrap; height: calc(100vh - 98px); overflow: auto"
    >
      <Waterfall
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
                    >复制</a-button
                  >
                  <a-button
                    @click.stop="goDrawing(item.prompt)"
                    style="background-color: #ce6872; color: white"
                    size="small"
                    >同款作画</a-button
                  >

                  <a-button
                    v-if="hasPermission('9999')"
                    @click.stop="showSampleView(item)"
                    style="background-color: #ce6872; color: white"
                    size="small"
                    >分类</a-button
                  >
                  <a-button
                    v-if="hasPermission('9999')"
                    style="background-color: #b70d1e; color: white"
                    size="small"
                    @click.stop="showDeleteConfirm(item.id)"
                    >删除</a-button
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
        </template>
      </Waterfall>
    </div>

    <!-- 分享收藏 -->
    <a-modal
      v-model:open="shareViewForm.viewFlag"
      title="访问申请"
      ok-text="立即提交"
      @ok="activeAndLoadMore"
      :confirmLoading="shareViewForm.loading"
    >
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
                      icon="ic:sharp-account-box"
                      class="vel-icon icon"
                      aria-hidden="true"
                    />访问密码
                  </span>
                </template>
                <a-input
                  disabled
                  v-model:value="shareViewForm.password"
                  placeholder="输入访问密码"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>
    <Loading :loading="doLoading" :absolute="false" tip="正在加载中" />
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
  import {
    CaretLeftOutlined,
    CaretRightOutlined,
    ExclamationCircleOutlined,
  } from '@ant-design/icons-vue';
  import 'viewerjs/dist/viewer.css';
  import { directive as viewer } from 'v-viewer';
  import { message, Modal } from 'ant-design-vue';
  // import loading from '/@/assets/images/lazy-loading.svg';
  import loading from '/@/assets/images/loading.svg';
  import error from '/@/assets/images/lazy-error.svg';
  import { collectShareInfo, showShareView, showShareTaskList } from '/@/api/df/drawCollectShare';
  import { useRoute } from 'vue-router';

  const { hasPermission } = usePermission();
  const route = useRoute();
  const id = ref(route.query.shareId);
  onMounted(async () => {
    console.log(1123);
    const shareViewInfo = await showShareView({ id: id });
    if (shareViewInfo.needPassword) {
      shareViewOpen();
      return;
    }
    handleLoadMore(500, true);
  });

  /****************************** 类目相关  ****************************** */

  const shareViewForm = ref({
    loading: false,
    viewFlag: false,
    categoryTitle: null,
    userName: null,
    password: null,
  });

  const shareViewOpen = () => {
    shareViewForm.value.viewFlag = true;
    shareViewForm.value.password = null;
  };

  const activeAndLoadMore = async () => {
    shareViewForm.value.viewFlag = true;
    drawingSampleForm.value.id = id;
    drawingSampleForm.value.password = shareViewForm.value.password;
    await handleLoadMore(500, true);
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
        rowPerView: 12,
      },
      1800: {
        // 当屏幕宽度小于等于1200
        rowPerView: 9,
      },
      1600: {
        // 当屏幕宽度小于等于1200
        rowPerView: 8,
      },
      1200: {
        // 当屏幕宽度小于等于1200
        rowPerView: 6,
      },
      800: {
        // 当屏幕宽度小于等于800
        rowPerView: 4,
      },
      500: {
        // 当屏幕宽度小于等于500
        rowPerView: 2,
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
    imgSelector: 'imageUrl',
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

  interface ViewCard {
    src: any;
    id?: string;
    name?: string;
    star?: boolean;
    backgroundColor?: string;
    [attr: string]: any;
  }
  // 列表
  const list = ref<{ ViewCard }[]>([]);

  // 删除
  function handleDelete(item: ViewCard, index: number) {
    list.value.splice(index, 1);
  }

  function handleClick(item: ViewCard) {
    emits('cardClick', item);
  }

  function imageLoad(url: string) {
    // console.log(`${url}: 加载完成`)
  }

  /*********************** 案例相关 ********************* */
  const exampleForm = ref({
    drawingSampleCategory: [],
    categoryCodes: [],
    drawTaskId: null,
    viewFlag: false,
    loading: false,
  });
  const showExampleViewFlag = ref(false);
  const addSample = async () => {
    exampleForm.value.loading = true;
    console.log(11231);
    try {
      await moveDrawingSample({
        id: exampleForm.value.drawTaskId,
        categoryCodes: exampleForm.value.categoryCodes,
      });
      message.success('添加成功！优质案例可以找客服领取奖励哦！');
      showExampleViewFlag.value = false;
    } finally {
      exampleForm.value.loading = false;
    }
  };
  const showSampleView = (card) => {
    exampleForm.value.drawTaskId = card.id;
    showExampleViewFlag.value = true;
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
