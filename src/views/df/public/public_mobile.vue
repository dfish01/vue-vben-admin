<template>
  <a-layout ref="formRef" id="apps" class="app" >
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
          <span style="margin-left: 5px; font-size: 16px; font-weight: bold"> 公开广场 </span>
        </div>
        <div style="display: flex; gap: 5px">
          <a-tooltip>
            <a-button
              @click="showQueryView"
              @click.prevent
              style="padding: 0 5px; border-radius: 5px"
            >
              <Icon icon="uil:search-alt" size="22" />
            </a-button>
          </a-tooltip>

          <a-tooltip>
            <a-dropdown :trigger="['click']">
              <a-button style="padding: 0 5px; border-radius: 5px"
                ><Icon icon="tabler:picture-in-picture" size="22"
              /></a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="4">
                    <a-popconfirm
                      title="该选项默认暂时未作存储，默认关闭状态，刷新就失效了！分割图场景适用~"
                      :ok-text="userSetting.useUpImage ? '确认关闭' : '确认开启'"
                      cancel-text="取消"
                      @confirm="setUseUpImage()"
                    >
                      🍝{{ userSetting.useUpImage ? '开启缩略图' : '开启原图' }}
                    </a-popconfirm>
                  </a-menu-item>

                  <a-menu-item key="5">
                    <a-popconfirm
                      title="我的网速无懈可击！！！"
                      :ok-text="userSetting.usePersonNet ? '还是加速吧' : '就是要原连接'"
                      cancel-text="取消"
                      @confirm="setUsePersonNet()"
                    >
                      🏄{{ userSetting.usePersonNet ? '加速连接' : '使用原连接' }}
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-tooltip>
          <a-tooltip title="保存查看进度">
            <a-button @click="saveProcess" style="padding: 0 5px; border-radius: 5px">
              <Icon icon="akar-icons:save" size="22" />
            </a-button>
          </a-tooltip>
        </div>
      </a-row>
    </a-card>
    

    <!-- 正文列表 -->
    <div id="card-body" ref="scrollbarRef" :style="{ height: `calc(${contentHeight}px `, overflow: 'auto' }" style=" overflow: auto; flex-wrap: wrap;">
      <Waterfall
ref="waterfallRef"
      :list="cards"
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
          <a-card
            v-if="url"
            style="border-radius: 10px;"
            :bodyStyle="{padding:0}"
            @click="showImage(item)"
            class="rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-linear hover:shadow-lg hover:shadow-gray-600 group"
          >
            <div class="overflow-hidden">
                <a-card :bodyStyle="{ padding: '0px' }" class="lazyImag">
              <LazyImg
                
                :url="getImageSource(item)"
                class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105"
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
                  <span style="font-size: 12px">
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
              <div class="move-out" v-else >
                <Icon
                  class="vel-icon icon"
                  icon="ant-design:exclamation-circle-twotone"
                  size="20"
                />
              </div>
            </div>
          </a-card>
        </template>
      </Waterfall>
      <Loading :loading="loadingRef" :absolute="true" tip="正在加载中" />
    </div>

     <!-- 条件查询 -->
     <a-modal
      v-model:visible="showQueryViewFlag"
      width="100%"
      title="🔍️条件查询"
      :bodyStyle="{ padding: '7px 12px 7px 12px', width: '100%', 'align-items': 'center' }"
    >
      <template #footer>
        <a-button key="submit" type="primary" @click="doModelSearch">立即查询</a-button>
      </template>
      <a-card
        :bordered="false"
        :bodyStyle="{ padding: '1px 1px 1px 1px', width: '100%', 'align-items': 'center' }"
      >
      <a-row :gutter="[0, 2]" type="flex">
          <a-col flex="80px">
            <a-tag class="quality-tag"  color="default">🍺类型 </a-tag>
          </a-col>
          <a-col flex="auto">
            <a-select v-model:value="searchForm.upscaleFlag" style="width: 100%" class="mobile-select">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="Y">单图</a-select-option>
              <a-select-option value="N">网格图</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row type="flex" :gutter="[0, 2]" style="margin-top: 7px">
          <a-col flex="80px">
            <a-tag class="quality-tag" color="default">🍺标签 </a-tag>
          </a-col>
          <a-col flex="auto">
            <a-mentions
              v-model:value="searchForm.tagName"
              autofocus
              placeholder="输入标签查询（暂时关闭哦）~"
              :options="drawTagForm.tagNameOptions"
              @select="onChangeSearchLabel"
            />
          </a-col>
        </a-row>
      </a-card>
    </a-modal>
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, onMounted,  onUnmounted,reactive,computed,unref } from 'vue';
  import { downloadByOnlineUrl } from '/@/utils/file/download';
  import { removeCollect , createCollect } from '/@/api/df/drawCollect';
  import {
    AddDrawCollectReq,
  } from '/@/api/df/model/drawCollectModel';
  import { publicList } from '/@/api/df/drawTask';
  import {
    DrawTaskListResp,
  } from '/@/api/df/model/drawTaskModel';
  import { IdReq } from '/@/api/model/baseModel';
  import { message} from 'ant-design-vue';
  import { genTagList } from '/@/api/df/dataCache';
  import { Loading } from '/@/components/Loading';
  import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next';
  import 'vue-waterfall-plugin-next/dist/style.css';
  import { api as viewerApi } from "v-viewer"
  import 'viewerjs/dist/viewer.css';
  import loading from '/@/assets/images/lazy-loading.svg';
  import error from '/@/assets/images/lazy-error.svg';
  import Icon from '/@/components/Icon/Icon.vue';
  import { useDrawCard } from './card';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();
  const handleSetting = (key, value) => {
    const setting = {};
    setting[key] = value;
    userStore.syncSetting(setting);
  };
    /** 页面高度计算开始 */
  const formRef = ref();
  //页面高度处理
  const buttonRef = ref(null);
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 1);
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

  const { copyText, goDrawing, loadMore, initDrawingSampleCategory } = useDrawCard();
  const doMouseenter = (item) => {
    item.mouseenter = true;
  };
  const doMouseleave = (item) => {
    item.mouseenter = false;
  };
  const showQueryViewFlag = ref(false);
  const showQueryView = () => {
    showQueryViewFlag.value = true;
  };
  const doModelSearch = () => {
    // 验证消息来源和内容，然后关闭 iframe
    showQueryViewFlag.value = false;
    onQuerySearch(null);
  };

  const cardContainerRef = ref<HTMLElement | null>(null);
  const searchForm = ref({
    tagName: null,
    upscaleFlag:'Y',
    state: '',
    nextCursorId: '',
    preNextCursorId:''
  });

  const cards = ref<DrawTaskListResp[]>([
    // 更多数据...
  ]);

  const getImageSource = (card) => {
    const baseImageSource = userSetting.value.usePersonNet
      ? card.cdnResultImage
      : card.resultImage;

    return userSetting.value.useUpImage ? baseImageSource : card.mediaImageUrl;
  };

  const handleScroll = () => {
    const element = document.querySelector('#card-body');
    if (element) {
        const { scrollTop, scrollHeight, clientHeight } = element;
        if (scrollTop + clientHeight >= scrollHeight - 50 && !loadingRef.value) {
            onSearch(searchForm.value.nextCursorId);
        }
    } else {
        // console.error('Element #card-body not found');
    }
  }
    
  const throttledScroll = debounce(handleScroll, 500);
  onMounted(() => {
      // onSearch(null);
      // console.log("singleCardRef.value after mounted:", cardContainerRef.value);
      loadTagList();
    window.addEventListener('scroll', throttledScroll, true);
  });

onUnmounted(() => {
  window.removeEventListener('scroll', throttledScroll);
});

function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
  const handleDownloadByUrl = async (url: string) => {
    const path = url.split('?')[0];
    const segments = path.split('/');
    const fileName = segments[segments.length - 1];
    downloadByOnlineUrl(url, fileName);
    message.success('已添加下载任务~');
  };

  
  const onSearch = async (cursorId) => {
    if(searchForm.value.nextCursorId === '-1') {
      message.warning("暂无更多数据咯~")
    }

    loadingRef.value = true
    const response = await publicList({
      nextCursorId:cursorId,
      tagName: searchForm.value.tagName,
      upscaleFlag: searchForm.value.upscaleFlag
    });
    cards.value = [...cards.value, ...response.recordList];
    searchForm.value.preNextCursorId = searchForm.value.nextCursorId;
    searchForm.value.nextCursorId = response.nextCursorId;

    loadingRef.value = false
  };

  
  const onQuerySearch = async (cursorId) => {
    loadingRef.value = true 
    searchForm.value.nextCursorId = cursorId
    searchForm.value.preNextCursorId = cursorId
    scrollToTop();
    const response = await publicList({
      nextCursorId:cursorId,
      tagName: searchForm.value.tagName,
      upscaleFlag: searchForm.value.upscaleFlag
    });
   
    cards.value = [...response.recordList];
    searchForm.value.preNextCursorId = searchForm.value.nextCursorId;
    searchForm.value.nextCursorId = response.nextCursorId;
   
    loadingRef.value = false
    if (cards.value.length === 0) {
      message.warning("无匹配数据")
    }     
  };

// 滚动到页面顶部的函数
const scrollToTop = () => {
  const scrollContainer = document.querySelector('#card-body');
  if (scrollContainer) {
    scrollContainer.scrollTop = 0;
  }
};
  /**
   * 添加到收藏
   * @param card
   */
  const addDrawCollect = async (card) => {
    loadingRef.value = true;
    card.collectFlag = card.collectFlag === 'Y' ? 'N' : 'Y';
    if (card.collectFlag === 'Y') {
      const param: AddDrawCollectReq = {
        taskId: card.id,
        collectCategoryId: null,
      };
      await createCollect(param);
      message.success('已添加到收藏~~~');
      loadingRef.value = false;
      return;
    }

    const param: IdReq = {
      id: card.id,
    };
    await removeCollect(param);
    message.success('取消收藏~~~');
    loadingRef.value = false;
  };


  /*************************添加标签*************************** */
  const drawTagForm = ref({
    drawTaskId: '',
    tagName: '',
    viewFlag: false,
    loading: false,
    tagNameOptions: [] as { value: string; label: string }[],
  });

  

  const loadTagList = async () => {
    //查询最近使用的tag
    const resp = await genTagList({});
    const options = resp.map((item) => ({
      value: item,
      label: item,
    }));
    drawTagForm.value.tagNameOptions = options;
  };

  const onChangeSearchLabel = (selectedOption) => {
    // 获取选中项的值，不包含 @ 符号
    searchForm.value.tagName = searchForm.value.tagName.replace(/@/g, '');
  };

  //*************************这里是图片切割的地方************************ */

  const loadingRef = ref(false);

/********************  缓存  **************** */

  const saveProcess = (): void => {
    handleSetting('publicQuery', searchForm.value);
    message.success('查看进度已保存到本地缓存~');
  };

  onMounted(() => {
    console.log(11111);
    const setting = userStore.getPersonalSetting;
    if (setting && setting.exampleQuery) {
      searchForm.value = setting.publicQuery;
      searchForm.value.nextCursorId = searchForm.value.preNextCursorId;
    }
    onSearch(searchForm.value.nextCursorId);
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

  /*********************** 瀑布流配置 ************** */
  
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
        rowPerView: 5,
      },
      1200: {
        // 当屏幕宽度小于等于1200
        rowPerView: 4,
      },
      800: {
        // 当屏幕宽度小于等于800
        rowPerView: 2,
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
    imgSelector: 'resultImage',
    // 加载配置
    loadProps: {
      loading,
      error
    },
    // 是否懒加载
    lazyload: true,
  })

  const showImage = (item) => {
    console.log("showImage ......")
    if(item.mouseenter === null || item.mouseenter === undefined || item.mouseenter === false) {
      item.mouseenter = true;
    }else {
      item.mouseenter = false;
      const baseImageSource = userSetting.value.usePersonNet
        ? item.cdnResultImage
        : item.resultImage;
      const imageList = [];
      imageList.push(baseImageSource);
      console.log(imageList)
      viewerApi({images: imageList})
    }
    
  }

  const imageLoad = (item) => {
    item.load = true;
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

  :deep(.ant-card-body) {
    padding: 10px; /* 您想要的padding值 */
  }

  .app {
    display: grid;
    grid-template-rows: auto 1fr auto;

    /* height: 100vh; */
  }

  .search-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 10vh;
    padding: 20px;
  }

  .card-container {
    width: 100%;
    column-gap: 10px;
    column-count: 4;
  }

  .card {
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    margin-bottom: 10px;
    break-inside: avoid;
    padding: 5px;
    border-radius: 15%;
    
  }

  .card >>> img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 15%;
    /* height: 150px; */
  }

  .card >>> .ant-image-mask {
    border-radius: 15%;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    flex: 1;
    align-content: start;
    height: calc(90vh - 80px);
    padding: 20px;
    overflow: auto;
    gap: 20px;
  }

  .image-wrapper {
  position: relative;
  width: 100%;
  height:calc(100% / var(--aspect-ratio));
}

.image-wrapper2::before {
  content: "";
  display: block;
  padding-top: calc(100% / var(--aspect-ratio));
}

.hide-before::before {
  display: none;
}

.placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
}

.actual-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

  .pagination {
    height: 10vh;
    padding: 20px;
  }

  .card-image{

  }
  .card-image img {
    position: relative;
    align-content: center;
    width: 100%;
    height: 360px;
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
    padding: 5px;
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
    margin-right: 10px;
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
    height: 45px;
    padding: 10px;
    border-radius: 4px;
    display: flex;
    justify-content: end;
    align-items: center;
  }

  .search-row {
    align-items: center;
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

  .custom-radio-group >>> .ant-tag {
    margin-right: 0;
  }


  .gallery {
  column-count: 4;
  column-gap: 16px;
}

.image-item {
  break-inside: avoid;
  position: relative;
  margin-bottom: 16px;
}

.lazy {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
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
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgb(130 124 124 / 70%);
    color: white;
    font-size: 15px;
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
