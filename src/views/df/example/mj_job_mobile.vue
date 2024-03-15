<template>
  <a-layout ref="formRef" style="width: 100%; overflow: hidden">
    <a-card class="no-radius" :bodyStyle="{ padding: 0, height: '50px' }">
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
          <a-image src="/logo.png" :width="38" :height="38" :preview="false" />
          <span style="margin-left: 5px; font-size: 16px; font-weight: bold"> MJ画廊 </span>
        </div>
        <div>
          <a-button-group>
                <a-button @click="showQueryView" @click.prevent :style="{}" style="padding: 5px">
                  <SvgIcon name="list_search" size="20" />
                </a-button>
                <a-button  @click="getCollectJobs()" @click.prevent :style="{}" style="padding: 5px">
                  <Icon icon="streamline-emojis:heart-suit" size="20" />
                </a-button>
                <a-button @click="goView('/example2/index')" @click.prevent :style="{}" style="padding: 5px">
                  <Icon icon="quill:sort" size="20" color="#007F73"/>
                </a-button>
                
            </a-button-group>
          </div>
      </a-row>
    </a-card>

    <div>
      <a-card class="no-radius" :bodyStyle="{ padding: '1px' }">
        <a-row :wrap="false" style="display: flex; align-items: center">
           
            <a-button-group class="scroll-item" style="width: 100%">
              <a-button
                :class="'no-border-button'"
                style="height: 20px; padding: 0 5px;  font-size: 10px"
                :style="{ color: feedForm.feedStr === 'random_recent_jobs' ? '#0766AD' : '', 'font-weight': feedForm.feedStr === 'random_recent_jobs' ? '600' : '' }"
                
                @click="selectCategory('random_recent_jobs')"
                > 
                <span>
                  <Icon class="vel-icon icon" icon="noto-v1:shooting-star" />随机
                </span>
              </a-button>

              <a-button
                :class="'no-border-button'"
                style="height: 20px; padding: 0 5px;  font-size: 10px"
                :style="{ color: feedForm.feedStr === 'hot_recent_jobs' ? '#0766AD' : '', 'font-weight': feedForm.feedStr === 'hot_recent_jobs' ? '600' : '' }"
                @click="selectCategory('hot_recent_jobs')"
                >
                <span>
                  <Icon class="vel-icon icon" icon="streamline-emojis:fire" />热门
                </span>
              </a-button>

              <a-button
                :class="'no-border-button'"
                style="height: 20px; padding: 0 5px;  font-size: 10px"
                :style="{ color: feedForm.feedStr === 'top_day' ? '#0766AD' : '', 'font-weight': feedForm.feedStr === 'top_day' ? '600' : '' }"
                @click="selectCategory('top_day')"
                >
                <span>
                  <Icon class="vel-icon icon" icon="noto:glowing-star" />每天
                </span>
              </a-button>

              

              <a-button
                :class="'no-border-button'"
                style="height: 20px; padding: 0 5px;  font-size: 10px"
                :style="{ color: feedForm.feedStr === 'top_week' ? '#0766AD' : '', 'font-weight': feedForm.feedStr === 'top_week' ? '600' : '' }"
                
                @click="selectCategory('top_week')"
                >
                <span>
                  <Icon class="vel-icon icon" icon="noto:glowing-star" />每周
                </span>
              </a-button>

              <a-button
                :class="'no-border-button'"
                style="height: 20px; padding: 0 5px; font-size: 10px"
                :style="{ color: feedForm.feedStr === 'top_month' ? '#0766AD' : '', 'font-weight': feedForm.feedStr === 'top_month' ? '600' : '' }"
                
                @click="selectCategory('top_month')"
                >
                <span>
                  <Icon class="vel-icon icon" icon="noto:glowing-star" />每月
                </span>
              </a-button>
              
            </a-button-group>
            
         
        </a-row>
      </a-card>
    </div>

    <div
      id="scrollbar"
      ref="scrollbarRef"
      :style="{ height: `calc(${contentHeight}px ` }"
      style="flex-wrap: wrap; padding-bottom: 2px; overflow: auto"
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
            @click="showImage(item)"
            class="rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-linear hover:shadow-lg hover:shadow-gray-600 group"
          >
            <div class="overflow-hidden">
              <a-card class="lazyImag" :bodyStyle="{
                  padding: '0px',
                  width: colWidth + 'px',
                  height: `${(item.height / item.width) * colWidth}px`,
                }">
                <LazyImg
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
                        @click.stop="doSearchJob(item.url)"
                        size="small"
                      >
                        <Icon class="vel-icon icon" icon="mdi:search" />
                      </a-button>
                    </a-tooltip>

                    <a-tooltip title="取消收藏" v-if="hasCollect(item)">
                      <a-button
                        type="text"
                        style="color: white"
                        size="small"
                        @click.stop="doRemoveJob(item)"
                      >
                        <Icon class="vel-icon icon" icon="ion:heart" color="red" />
                      </a-button>
                    </a-tooltip>

                    <a-tooltip title="收藏" v-else>
                      <a-button
                        type="text"
                        style="color: white"
                        size="small"
                        @click.stop="doCollectJob(item)"
                      >
                        <Icon class="vel-icon icon" icon="solar:heart-angle-linear" />
                      </a-button>
                    </a-tooltip>
                  </a-button-group>
                </div>
              </div>
              <!-- <div class="move-out" v-else>
                <Icon
                  class="vel-icon icon"
                  icon="ant-design:exclamation-circle-twotone"
                  size="15"
                />
              </div> -->
            </div>
          </div>
        </template>
      </Waterfall>
      <a-row style="justify-content: center" v-if="doLoading === false">
        <div >
          <a-divider v-if="feedForm.hasMore === true">
            <span style="color: rgb(0 0 0 / 50%); font-size:12px">
              <Icon class="vel-icon icon" icon="eos-icons:bubble-loading" size="12"/>正在加载中...</span
            ></a-divider
          >
          <a-divider  v-if="feedForm.hasMore === false">
            <span style=" color: rgb(0 0 0 / 50%);font-size:12px">暂无更多数据 </span>
          </a-divider>
        </div>
      </a-row>
    </div>
    <Loading :loading="doLoading" :absolute="false" tip="正在加载中" />
    <!-- 公告 -->
    <a-modal
      v-model:open="noticeForm.viewFlag"
      title="🧉最新公告"
      style="top: 20px; width: 100%; height: auto"
      :bodyStyle="{ padding: '0', width: '100%', 'align-items': 'center' }"
    >
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

    <!-- 条件查询 -->
    <a-modal
      v-model:open="showQueryViewFlag"
      width="100%"
      title="Prompt查询"
      :bodyStyle="{ padding: '7px 10px 7px 10px', width: '100%', 'align-items': 'center' }"
    >
      <template #footer>
        <a-button key="submit" type="primary" @click="doSearchJob()">立即查询</a-button>
      </template>

        <a-row type="flex" :gutter="[0, 2]" style="margin-top: 3px">
          <a-input
            class="line-input "
              v-model:value="searchPrompt"
              placeholder="Search Prompt"
            />
            <span style="color:red; font-size:10px">注意: 由于资源限制，目前暂时无法支持大批量查询~ 如果查询失败，请稍后再试！</span>
        </a-row>
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
  import { onMounted, onUnmounted, ref, reactive, computed, unref } from 'vue';
  import { MarkdownViewer } from '/@/components/Markdown';
  import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next';
  import 'vue-waterfall-plugin-next/dist/style.css';
  import { Loading } from '/@/components/Loading';
  import { useDrawCard } from './card';
  import Icon from '/@/components/Icon/Icon.vue';
  import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons-vue';
  import 'viewerjs/dist/viewer.css';
  // import { directive as viewer } from 'v-viewer';
  import { api as viewerApi } from 'v-viewer';
  import { message } from 'ant-design-vue';
  // import loading from '/@/assets/images/lazy-loading.svg';
  import loading from '/@/assets/images/loading.svg';
  import error from '/@/assets/images/lazy-error.svg';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { getRecentNotice } from '/@/api/df/utils';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { accountInfoApi } from '../mj/accountInfo';
  import { exampleApi } from '../mj/jobList.pageQuery';
  import { useGo } from '/@/hooks/web/usePage';
  import { SvgIcon } from '/@/components/Icon';
  import {
    listCategory,
    chooseFeedJob,
    searchJob,
    collectJob,
    removeCollectJob,
    myCollectJobs,
  } from '/@/api/df/midjourney';

  const userStore = useUserStore();
  const handleSetting = (key, value) => {
    const setting = {};
    setting[key] = value;
    userStore.syncSetting(setting);
  };
  const { hasPermission } = usePermission();

  /** 页面高度计算开始 */
  const formRef = ref();
  //页面高度处理
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 0);
  //移动设备底部导航栏
  const offsetHeightRef = ref(134);
  const subtractHeightRefs = ref([]);

  // 使用hook
  const { contentHeight, redoHeight } = useContentHeight(
    computed(() => true),
    formRef,
    unref(subtractHeightRefs), // 使用 unref 获取数组值
    unref(substractSpaceRefs),
    upwardSpace,
    offsetHeightRef,
  );
  const showQueryViewFlag = ref(false);
  const showQueryView = () => {
    showQueryViewFlag.value = true;
  };
  const { copyText} = useDrawCard();

  const feedForm = ref({
    feedStr: 'hot_recent_jobs',
    page: 1,
    hasMore: true,
    cacheList: [],
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


  //画同款
  const go = useGo();
  const goDrawing = async (queryParams) => {
    goView('/mmj/index?activeTab=TextToImageForm&prompt=' + queryParams);
  };

  const goView = async (routePath) => {
    go(routePath);
  };
  /****************************** 类目相关  ****************************** */

  const categorySetting = ref({
    categories: [] as { code: string; name: string }[],
    showLeftButton: false,
    showRightButton: true,
  });

  const drawingSampleForm = ref({
    categoryCode: '',
    key: '',
    nextCursorId: '',
    preNextCursorId: '',
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
      if (scrollTop + clientHeight >= scrollHeight - 50 && !doLoading.value) {
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

  const showImage = (item) => {
    console.log('showImage ......');
    if (item.mouseenter === null || item.mouseenter === undefined || item.mouseenter === false) {
      item.mouseenter = true;
    } else {
      item.mouseenter = false;

      const imageList = [];
      imageList.push(item.imageUrl);
      console.log(imageList);
      viewerApi({ images: imageList });
    }
  };
  /************************* 样例相关 ******************** */

  const waterfallRef = ref(null);

  const selectCategory = async (code) => {
    list.value.length = 0;
    list.value.splice(0, list.value.length);
    scrollbarRef.value.scrollTop = 0;

    //初始化数据
    feedForm.value.feedStr = code;
    await sleep(300);
    if (dataMap.has(code)) {
      let cacheData = dataMap.get(code);
      feedForm.value = cacheData;
      list.value.push(...cacheData.cacheList);
      // list.value = Array.from(cacheData.cacheList);
      return;
    }

    feedForm.value.page = 1;
    feedForm.value.hasMore = true;

    //执行查询
    await handleLoadMore(500, true);
    if (feedForm.value.hasMore === true) {
      await handleLoadMore(500, false);
    }
    if (feedForm.value.hasMore === true) {
      await handleLoadMore(500, false);
    }
  };
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function handleLoadMore(cacheTime, neededLoading) {
    if (feedForm.value.hasMore === false) {
      doLoading.value = false;
      return;
    }

    try {
      doLoading.value = neededLoading;
      const more = await loadMore({ feedStr: feedForm.value.feedStr, page: feedForm.value.page });
      if (more && more.length > 0) {
        list.value.push(...more);
      } else {
        feedForm.value.hasMore = false;
      }
      feedForm.value.page = feedForm.value.page + 1;
      console.log('handleMore: value =' + JSON.stringify(feedForm.value));
      //数据存储
      let cacheValue = {
        feedStr: feedForm.value.feedStr,
        page: feedForm.value.page,
        hasMore: feedForm.value.hasMore,
        cacheList: [],
      };
      cacheValue.cacheList = Array.from(list.value);
      dataMap.set(feedForm.value.feedStr, cacheValue);
    } finally {
      // 延迟 1 秒后执行操作
      setTimeout(() => {
        doLoading.value = false;
      }, 2000);
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
        rowPerView: 6,
      },
      1500: {
        // 当屏幕宽度小于等于1200
        rowPerView: 5,
      },
      1200: {
        // 当屏幕宽度小于等于1200
        rowPerView: 4,
      },
      900: {
        // 当屏幕宽度小于等于800
        rowPerView: 3,
      },
      670: {
        // 当屏幕宽度小于等于500
        rowPerView: 2,
      },
      350: {
        // 当屏幕宽度小于等于500
        rowPerView: 1,
      },
    },
    // 动画效果
    animationEffect: 'fadeIn',
    // 动画时间
    animationDuration: 500,
    // 动画延迟
    animationDelay: 300,
    // 背景色
    backgroundColor: 'none',
    // imgSelector
    imgSelector: 'mediaUrl',
    // 加载配置
    // loadProps: {
    //   loading,
    //   error,
    // },
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
    // console.log(`${item.mediaUrl}: 加载完成`);
    // item.isImageLoaded = true;
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
  //***************************** 列宽定义 && 收藏 ************************ */
  const colWidth = ref(0);
  const container = ref(null);
  const updateColWidth = () => {
    let clientWidth = scrollbarRef.value.offsetWidth;
    if (clientWidth < 350) {
      colWidth.value = clientWidth - 10;
    } else if (clientWidth < 670) {
      colWidth.value = (clientWidth - 10) / 2;
    } else if (clientWidth < 900) {
      colWidth.value = (clientWidth - 10) / 3;
    } else if (clientWidth < 1200) {
      colWidth.value = (clientWidth - 15) / 4;
    } else if (clientWidth < 1500) {
      colWidth.value = (clientWidth - 15) / 5;
    } else if (clientWidth < 1800) {
      colWidth.value = (clientWidth - 15) / 6;
    } else {
      colWidth.value = (clientWidth - 20) / 10;
    }
    console.log('updateColWidth clientWidth：' + clientWidth + 'colWidth:' + colWidth.value);
  };

  const dataMap = new Map();

  const collectJobForm = ref({
    jobs: [],
    loaded: false,
    idSet: new Set(),
  });

  const doSearchJob = async (prompt) => {
    console.log("doSearchJob " + prompt)
    doLoading.value = true;
    if (prompt) {
      searchPrompt.value = prompt;
    }else {
      prompt = searchPrompt.value;
    }
    try {
      list.value.length = 0;
      feedForm.value.feedStr = '';
      scrollbarRef.value.scrollTop = 0;
      sleep(150);

      let more = await searchJob({ content: prompt });
      //提取ID set
      list.value = more;
      feedForm.value.hasMore = false;
    } finally {
      showQueryViewFlag.value = false;
      doLoading.value = false;
    }
  };

  const doCollectJob = (item) => {
    item.collect = true;
    let exists = collectJobForm.value.jobs.some((obj) => obj.id === item.id);
    if (!exists) {
      collectJob(item);
      collectJobForm.value.jobs.unshift(item);
      collectJobForm.value.idSet.add(item.id);
    }
    message.success('已收藏');
  };

  const doRemoveJob = (item) => {
    collectJobForm.value.jobs = collectJobForm.value.jobs.filter((obj) => obj.id !== item.id);
    list.value.push(collectJobForm.value.jobs);
    collectJobForm.value.idSet.delete(item.id);
    item.collect = false;
    removeCollectJob({ id: item.id });
  };

  const getCollectJobs = async () => {
    list.value.length = 0;
    feedForm.value.feedStr = 'likes';
    scrollbarRef.value.scrollTop = 0;
    sleep(200);
    console.log('getCollectJobs');
    if (collectJobForm.value.loaded === true) {
      list.value.push(...collectJobForm.value.jobs);
    } else {
      let more = await myCollectJobs({});
      //提取ID set
      collectJobForm.value.idSet = new Set(more.map((item) => item.id));
      collectJobForm.value.jobs = more;
      collectJobForm.value.loaded = true;
      list.value = more;
    }
    feedForm.value.hasMore = false;
  };

  const hasCollect = (item) => {
    return collectJobForm.value.idSet.has(item.id);
  };

  onMounted(async () => {
    updateColWidth();
    window.addEventListener('resize', updateColWidth);

    //查询收藏
    let more = await myCollectJobs({});
    //提取ID set
    collectJobForm.value.idSet = new Set(more.map((item) => item.id));
    collectJobForm.value.jobs.push(...more);
    collectJobForm.value.loaded = true;
  });

  // onUpdated(updateColWidth);

  onUnmounted(() => {
    window.removeEventListener('resize', updateColWidth);
  });

 

</script>

<style scoped>
  

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
    margin: 0 10px;
    font-size: 24px;
    cursor: pointer;
  }

  .scroll-item {
    height: 24px;
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
