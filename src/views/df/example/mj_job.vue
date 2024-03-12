<template>
  <a-layout style="width: 100%; overflow: hidden">
    <Loading :loading="globalLoading" :absolute="false" tip="正在加载中..." />
    <div>
      <a-card :bodyStyle="{ padding: '8px' }">
        <a-row :wrap="false" style="display: flex; align-items: center;justify-content: space-between;width:100%">
          <div style=" display: flex; flex-direction: row; align-items: center; ">
            <div :key="item.code" v-for="item in categorySetting.categories" class="scroll-item">
              <a-button
                :class="feedForm.feedStr === item.code ? '' : 'no-border-button'"
                style="padding: 0 10px; font-weight: 600"
                @click="selectCategory(item.code)"
                >{{ item.name }}</a-button
              >
            </div>
            
          </div>
          <div>
              <a-input-search
                v-model:value="searchPrompt"
                placeholder="Search Prompt"
                style="width: 200px"
                @search="onSearchPrompt"
              />
            </div>
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
        :width="colWidth"
        :delay="500"
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
              <a-card :bodyStyle="{ padding: '0px' }" :bordered="true" class="lazyImag" >
                <div 
                  :style="{ 'width': colWidth+'px' ,  height: `${(item.height / item.width) * colWidth}px` }"
                >

                <a-image
                v-viewer
                  :preview="false"
                  :style="{height: `${(item.height / item.width) * 100}%` }"
                  :src="item.url"
                  class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105"
                >
                  <template #placeholder>
                    <a-image
                      :src="url"
                      :preview="false"
                    />
                  </template>
                </a-image>

                <!-- <LazyImg
                v-show="item.isImageLoaded && item.isImageLoaded === true"
                  v-viewer
                  :url="url"
                  class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105"
                  :success="imageLoad(item)"
                /> -->
                </div>
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
                  <!-- <span style="font-size: 14px">
                    {{ item.fullCommand }}
                  </span> -->
                </div>
                <!-- 下面的 div，按钮靠右 -->
                <div
                  style="
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    margin: 10px 8px;
                  "
                >
                  <span
                    style="
                      display: block; /* 这个样式可能不需要，取决于你想要达到的效果 */
                      align-items: flex-end;
                      width: 100px; /* 你需要设置宽度，否则文字不会溢出 */
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    "
                  >
                    {{ item.username }}
                  </span>

                  <a-button-group>
                    <a-tooltip title="复制">
                      <a-button
                        type="text"
                        style="color: white"
                        @click.stop="copyText(item.fullCommand)"
                        size="small"
                      >
                        <Icon class="vel-icon icon" icon="icon-park-outline:text" />
                      </a-button>
                    </a-tooltip>

                    <a-tooltip title="画同款">
                      <a-button
                        type="text"
                        style="color: white"
                        @click.stop="goDrawing(item.fullCommand)"
                        size="small"
                      >
                        <Icon class="vel-icon icon" icon="fluent:image-edit-16-regular" />
                      </a-button>
                    </a-tooltip>

                    <a-tooltip title="查询">
                      <a-button
                        type="text"
                        style="color: white"
                        @click.stop="goDrawing(item.fullCommand)"
                        size="small"
                      >
                        <Icon class="vel-icon icon" icon="mdi:search" />
                      </a-button>
                    </a-tooltip>

                    <a-tooltip title="收藏">
                      <a-button
                        type="text"
                        style="color: white"
                        size="small"
                        @click.stop="collectJob(item.id)"
                      >
                        <Icon class="vel-icon icon" icon="solar:heart-angle-linear" />
                      </a-button>
                    </a-tooltip>
                  </a-button-group>
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

    <!-- 公告 -->
    <a-modal v-model:open="noticeForm.viewFlag" title="🧉最新公告">
      <template #footer>
        <a-button key="submit" type="primary" @click="hasRead()" :loading="noticeForm.loading"
          >已知悉，今日不在弹出</a-button
        >
      </template>
      <a-spin :spinning="noticeForm.loading">
        <div style="padding: 10px 20px">
          <MarkdownViewer :value="noticeForm.content" />
        </div>
      </a-spin>
    </a-modal>

    <!-- 案例添加 -->
    <a-modal
      v-model:open="showExampleViewFlag"
      title="🧉添加到官方案例"
      :bodyStyle="{ padding: '7px 20px', 'align-items': 'center' }"
    >
      <template #footer>
        <a-button key="submit" type="primary" @click="addSample()" :loading="exampleForm.loading"
          >添加到官方案例</a-button
        >
      </template>

      <Loading :loading="exampleForm.loading" :absolute="true" tip="数据发送中..." />
      <a-card
        :bordered="false"
        :bodyStyle="{ padding: '1px 1px 1px 1px', width: '100%', 'align-items': 'center' }"
      >
        <a-row :gutter="[0, 2]" type="flex">
          <a-col flex="auto">
            <a-select
              v-model:value="exampleForm.categoryCodes"
              mode="multiple"
              style="width: 100%"
              placeholder="请选择分类"
              :options="exampleForm.drawingSampleCategory"
            />
          </a-col>
        </a-row>
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
  import { useDrawCard } from './card';
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
  import { getRecentNotice } from '/@/api/df/utils';
  import { accountInfoApi } from '../mj/accountInfo';
  import { exampleApi } from '../mj/jobList.pageQuery';
  import {
    listCategory,
    chooseFeedJob,
    searchJob,
    collectJob,
    removeCollectJob,
    myCollectJobs,
  } from '/@/api/df/midjourney';

  const { hasPermission } = usePermission();
  const { copyText, goDrawing } = useDrawCard();

  const feedForm = ref({
    feedStr: 'hot_recent_jobs',
    page: 1,
    hasMore: true,
  });

  const searchPrompt = ref(null);

  onMounted(async () => {
    categorySetting.value.categories = await listCategory({});
    exampleForm.value.drawingSampleCategory = categorySetting.value.categories.map((item) => ({
      label: item.name,
      value: item.code,
    }));
    await handleLoadMore(500, true);
    await handleLoadMore(500, false);
    await handleLoadMore(500, false);
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
  });

  const categoryScrollContainer = ref(null);

  /***************************滚动相关**************************** */
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

  const onSearchPrompt = async () => {
    if (!searchPrompt.value) {
      return;
    }
    doLoading.value = true;
    try {
      const more = await searchJob({ content: searchPrompt.value });
      feedForm.value.hasMore = false;
      if (more && more.length > 0) {
        list.value.push(...more);
      }
    } finally {
      doLoading.value = false;
    }
  };

  const waterfallRef = ref(null);

  const selectCategory = async (code) => {
    list.value.length = 0;
    scrollbarRef.value.scrollTop = 0;

    //初始化数据
    feedForm.value.feedStr = code;
    feedForm.value.page = 1;
    feedForm.value.hasMore = true;
    loadAllData.value = false;
    //执行查询
    await handleLoadMore(500, true);
    await handleLoadMore(500, false);
    await handleLoadMore(500, false);
  };

  // 加载更多
  const loadAllData = ref(false);

  async function handleLoadMore(cacheTime, neededLoading) {
    if (feedForm.value.hasMore === false) {
      // message.warning('暂无更多数据！');
      loadAllData.value = true;
      doLoading.value = false;
      return;
    }

    try {
      doLoading.value = neededLoading;
      const more = await loadMore(feedForm.value);
      if (more && more.length > 0) {
        list.value.push(...more);
      } else {
        message.warning('暂无更多数据！');
        feedForm.value.hasMore = false;
      }
      feedForm.value.page = feedForm.value.page + 1;
    } finally {
      // 延迟 1 秒后执行操作
      doLoading.value = false;
    }
  }

  //加载数据
  const loadMore = async (queryParams) => {
    const response = await chooseFeedJob(queryParams);
    return response;
  };

  /*********************************** 公告 ******************************** */
  const noticeForm = ref({
    content: '',
    viewFlag: false,
    loading: false,
  });
  const hasRead = (): void => {
    noticeForm.value.viewFlag = false;
  };
  onMounted(async () => {
    // const response = await getRecentNotice();
    // if (response) {
    //   noticeForm.value.viewFlag = true;
    //   noticeForm.value.content = response;
    // }
  });
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
        rowPerView: 7,
      },
      1600: {
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
    animationEffect: 'fadeIn',
    // 动画时间
    animationDuration: 1000,
    // 动画延迟
    animationDelay: 300,
    // 背景色
    backgroundColor: 'none',
    // imgSelector
    imgSelector: 'mediaUrl',
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

  function imageLoad(item) {
    console.log(`${item.mediaUrl}: 加载完成`)
    item.isImageLoaded = true
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
  //***************************** 列宽定义 ************************ */
  const colWidth = ref(0);

const updateColWidth = () => {
  if (window.innerWidth < 500) {
    colWidth.value = (window.innerWidth - 20) / 2;
  } else if (window.innerWidth < 640) {
    colWidth.value = (window.innerWidth - 20) / 2;
  }else if (window.innerWidth < 900) {
    colWidth.value = (window.innerWidth - 20) / 3;
  } else if (window.innerWidth < 1200) {
    colWidth.value = (window.innerWidth - 20) / 4;
  } else if (window.innerWidth < 1500) {
    colWidth.value = (window.innerWidth - 20) / 5;
  } else if (window.innerWidth < 1800) {
    colWidth.value = (window.innerWidth - 20) / 6;
  } else if (window.innerWidth < 3800) {
    colWidth.value = (window.innerWidth - 20) / 11;
  } else {
    colWidth.value = (window.innerWidth - 40) / 9;
  }
};
const updateColWidth2 = () => {
  if (window.innerWidth < 500) {
    colWidth.value = window.innerWidth - 20 / 2;
  } else if (window.innerWidth < 900) {
    colWidth.value = window.innerWidth - 20 / 3;
  } else if (window.innerWidth < 1200) {
    colWidth.value = window.innerWidth - 20 / 4;
  } else if (window.innerWidth < 1500) {
    colWidth.value = window.innerWidth - 20 / 5;
  } else if (window.innerWidth < 1800) {
    colWidth.value = window.innerWidth - 20 / 6;
  } else if (window.innerWidth < 3800) {
    colWidth.value = window.innerWidth - 20 / 11;
  } else {
    colWidth.value = window.innerWidth - 20 / 11;
  }
};
onMounted(() => {
  updateColWidth();
  window.addEventListener('resize', updateColWidth);
});

// onUpdated(updateColWidth);

onUnmounted(() => {
  window.removeEventListener('resize', updateColWidth);
});

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
    background: linear-gradient(to top, rgb(105 101 101 / 70%), rgb(105 101 101 / 0%));
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
    margin: 0 3px;
    font-size: 24px;
    cursor: pointer;
  }

  .scroll-item {
    height: 32px;
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
    position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  }

  .lazyImag ::v-deep .lazy__img[lazy='loaded'] {
    position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  }

  .lazyImag ::v-deep .lazy__img[lazy='error'] {
    position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  }

.image-placeholder {
  position: relative;
  width: 100%;
  background-color: #f0f0f0; /* 占位符的背景色 */
}

.image-placeholder img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
