<template>
  <a-layout style="width: 100%; overflow: hidden">
    <div>
      <a-card :bodyStyle="{ padding: '8px' }">
        <a-row :wrap="false" style="display: flex; align-items: center">
          <a-tag
            v-if="categorySetting.showLeftButton"
            style="
              display: flex;
              align-items: center;
              width: 25px;
              height: 32px;
              font-size: 20px;
              text-align: center;
            "
            @click="scrollToLeft"
          >
            <CaretLeftOutlined />
          </a-tag>
          <div
            class="horizontal-scroll-container"
            style="flex: 1; overflow: auto"
            ref="categoryScrollContainer"
          >
            <div :key="item.code" v-for="item in categorySetting.categories" class="scroll-item">
              <a-button
                :class="drawingSampleForm.categoryCode === item.code ? '' : 'no-border-button'"
                @click="selectCategory(item.code, drawingSampleForm.key)"
                >{{ item.name }}</a-button
              >
            </div>
          </div>
          <a-tag
            v-if="categorySetting.showRightButton"
            style="
              display: flex;
              align-items: center;
              width: 25px;
              height: 32px;
              font-size: 20px;
              text-align: center;
            "
            @click="scrollToRight"
          >
            <CaretRightOutlined />
          </a-tag>
        </a-row>
      </a-card>
    </div>

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
            class="bg-gray-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-linear hover:shadow-lg hover:shadow-gray-600 group"
          >
            <div class="overflow-hidden">
              <LazyImg
                v-viewer
                :url="url"
                class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105"
                @load="imageLoad(url)"
              />
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
    <Loading :loading="doLoading" :absolute="false" tip="正在加载中" />
  </a-layout>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref, reactive } from 'vue';
  // import { LazyImg, Waterfall } from '../../lib/index'
  import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next';
  import 'vue-waterfall-plugin-next/dist/style.css';
  import loading from '/image/loading.png';
  import { Loading } from '/@/components/Loading';
  import error from '/image/error.png';
  import { useDrawCard } from './card';
  import Icon from '/@/components/Icon/Icon.vue';
  import {
    CaretLeftOutlined,
    CaretRightOutlined,
    ExclamationCircleOutlined,
  } from '@ant-design/icons-vue';
  import 'viewerjs/dist/viewer.css';
  import { directive as viewer } from 'v-viewer';
  import { message } from 'ant-design-vue';

  const { copyText, goDrawing, loadMore, initDrawingSampleCategory } = useDrawCard();

  onMounted(async () => {
    handleLoadMore(3000);
    categorySetting.value.categories = await initDrawingSampleCategory();
  });

  /****************************** 类目相关  ****************************** */
  const doMouseenter = (item) => {
    item.mouseenter = true;
  };
  const doMouseleave = (item) => {
    item.mouseenter = false;
  };
  const categorySetting = ref({
    categories: [] as { code: string; name: string }[],
    showLeftButton: false,
    showRightButton: true,
  });

  const drawingSampleForm = ref({
    categoryCode: '',
    key: '',
    nextCursorId: '',
  });

  const categoryScrollContainer = ref(null);

  const scrollToLeft = () => {
    const element = categoryScrollContainer.value;
    element.scrollTo({
      left: element.scrollLeft - 300,
      behavior: 'smooth', // 添加平滑滚动效果
    });
    if (element.scrollLeft === 0) {
      categorySetting.value.showLeftButton = false;
    }
    if (!categorySetting.value.showRightButton) {
      categorySetting.value.showRightButton = true;
    }
  };

  const scrollToRight = () => {
    const element = categoryScrollContainer.value;
    element.scrollTo({
      left: categoryScrollContainer.value.scrollLeft + 300,
      behavior: 'smooth', // 添加平滑滚动效果
    });

    if (element.scrollLeft + element.clientWidth >= element.scrollWidth) {
      categorySetting.value.showRightButton = false;
    }
    if (!categorySetting.value.showLeftButton) {
      categorySetting.value.showLeftButton = true;
    }
  };

  /***************************滚动相关**************************** */
  const scrollbarRef = ref(null);
  const doLoading = ref(false);

  const handleScroll = () => {
    if (scrollbarRef.value !== null) {
      console.log('handleScroll');
      const { scrollTop, scrollHeight, clientHeight } = scrollbarRef.value;
      if (scrollTop + clientHeight >= scrollHeight - 50 && !loading.value) {
        handleLoadMore(1500);
      }
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
  const selectCategory = async (code, key) => {
    // doLoading.value = true;
    list.value.length = 0;
    scrollbarRef.value.scrollTop = 0;
    drawingSampleForm.value.categoryCode = code;
    drawingSampleForm.value.key = key;
    drawingSampleForm.value.nextCursorId = '';
    //执行查询
    await handleLoadMore(drawingSampleForm.value);
  };

  // 加载更多
  async function handleLoadMore(cacheTime) {
    if (drawingSampleForm.value.nextCursorId === '-1') {
      message.warning('暂无更多数据！');
      return;
    }
    doLoading.value = true;
    try {
      const more = await loadMore(drawingSampleForm.value);
      if (more.recordList && more.recordList.length > 0) {
        list.value.push(...more.recordList);
      } else {
        message.warning('暂无更多数据！');
      }
      drawingSampleForm.value.nextCursorId = more.nextCursorId;
    } finally {
      // 延迟 1 秒后执行操作
      if (drawingSampleForm.value.nextCursorId != '-1') {
        setTimeout(function () {
          doLoading.value = false;
        }, cacheTime);
      }
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
    gutter: 5,
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
        rowPerView: 6,
      },
      1200: {
        // 当屏幕宽度小于等于1200
        rowPerView: 5,
      },
      800: {
        // 当屏幕宽度小于等于800
        rowPerView: 3,
      },
      500: {
        // 当屏幕宽度小于等于500
        rowPerView: 2,
      },
    },
    // 动画效果
    animationEffect: 'animate__fadeInUp',
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
</style>
