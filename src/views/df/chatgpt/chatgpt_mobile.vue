<template>
  <a-layout  >
    
    <a-card :bodyStyle="{padding: 0}">
      <a-card   class="no-radius"  :bodyStyle="{ padding: 0, height: '50px' }">
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
          <span style="margin-left: 5px; font-size: 16px; font-weight: bold"> AI对话 </span>
        </div>
        <div style="display: flex; gap: 5px"> </div>
      </a-row>
    </a-card>

    <div :style="{  height: `calc(${contentHeight}px)`, overflow: 'auto' }">
   
      <div style="margin-bottom: 64px" class="container" >
        <a-card style="margin:10px" :bodyStyle="{padding: '10px', display:'flex', }">
          <p> <Icon icon="flat-color-icons:idea" />  收集一些常用的白嫖资源，让大家能更低门槛的接触到AI，提高做事效率。资源内可能有部分链接带有收费事项，白嫖点到为止就好。如果好用就快点个收藏吧~</p>

        </a-card>
      </div>
      <div class="VPFeatures VPHomeFeatures" style="margin-bottom: 64px" v-for="category in categories" :key="category.title">
        <div class="container" >
          <div class="VPTeamPageTitle" style="display: flex; ">
            <h1 style="margin-bottom: 24px; font-size:22px; font-weight: bold"> 
              <Icon :icon="category.icon" size="20" /> {{category.title}} </h1>
          </div>
          <div class="items">
            <div class="item grid-6" v-for="(feature, index) in categoryItems(category.title)" :key="index">
              <a-card class="nav-card" :bodyStyle="{padding:'0'}" :bordered="true" :hoverable="false">

              <a @click="skipUrl(feature.id)"  class="VPLink no-icon VPFeature">
                <article class="box">
                  <!-- <img data-v-8043377a="" class="VPImage" :src="feature.iconSrc" height="48" width="48" alt=""> -->
                  <h2 class="title">{{ feature.title }}</h2>
                  <p class="details">{{ feature.summary }}</p>
                  <!--v-if-->
                  <div  class="link-text">
                    <p  class="link-text-value"> 立即前往
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="link-text-icon">
                        <path d="M19.9,12.4c0.1-0.2,0.1-0.5,0-0.8c-0.1-0.1-0.1-0.2-0.2-0.3l-7-7c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l5.3,5.3H5c-0.6,0-1,0.4-1,1s0.4,1,1,1h11.6l-5.3,5.3c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l7-7C19.8,12.6,19.9,12.5,19.9,12.4z">
                        </path>
                      </svg>
                    </p>
                  </div>
                </article>
              </a>
            </a-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    </a-card>
    <Loading :loading="loadingRef" :absolute="true" tip="数加载中..." />
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, unref, nextTick } from 'vue';
  import ChatgptMobile from './chatgpt_mobile.vue';
  import ChatgptPc from './chatgpt_pc.vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { allChatgptShare, getUrl  } from '/@/api/df/chatgptShare';
  import data from './data.json';
  import { Loading } from '/@/components/Loading';
  import Icon from '@/components/Icon/Icon.vue';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';

  /** 页面高度计算开始 */
  const formRef = ref();
  //页面高度处理
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 51);
  //移动设备底部导航栏
  const offsetHeightRef = ref(105);
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


  const categories = ref([]);

  const recordMap = ref({});
  const loadingRef = ref(false);

  onMounted(async () => {
    loadingRef.value = true;
    try {
      const resp = await allChatgptShare();
      categories.value = resp.categories;
      recordMap.value = resp.categoryItemMap;
    } finally {
      loadingRef.value = false;
    }
  });

  const categoryItems = (categoryCode) => {
    console.log(123  )
    if (!recordMap.value) {
      console.error('recordMap is not defined.');
      return null;
    }

    if (!recordMap.value.hasOwnProperty(categoryCode)) {
      console.error(`Category code "${categoryCode}" does not exist in recordMap.`);
      return null;
    }

    return recordMap.value[categoryCode];
  };


  const skipUrl = async(id) => {
    loadingRef.value = true;
    try{
      const url = await getUrl({id:id})
      console.log("url 111")
      window.open(url, '_blank');
    }finally{
      loadingRef.value = false;
    }
  };

  // const categories = computed(() => {
  //   const uniqueCategories = Array.from(new Set(data.map((item) => item.category)));
  //   return uniqueCategories.filter((category) => categorizedItems[category]);
  // });

  // const categorizedItems = computed(() => {
  //   const result = {};
  //   data.forEach((item) => {
  //     if (!result[item.category]) {
  //       result[item.category] = [];
  //     }
  //     result[item.category].push(item);
  //   });
  //   return result;
  // });
</script>

<style scoped>
  @media (min-width: 640px) {
    .item.grid-2,
    .item.grid-4,
    .item.grid-6 {
      width: calc(100% / 2);
    }

    .VPFeatures {
      padding: 0 48px;
    }
  }

  @media (min-width: 768px) {
    .item.grid-3,
    .item.grid-6 {
      width: calc(100% / 3);
    }
  }

  @media (min-width: 960px) {
    .VPFeatures {
      padding: 0 64px;
    }
  }

  .VPFeatures {
    position: relative;
    padding: 0 24px;
  }

  .item {
    width: 100%;
    padding: 8px;
  }

  .items {
    display: flex;
    flex-wrap: wrap;
    margin: -8px;
  }

  .link-text-icon {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-left: 6px;
    fill: currentcolor;
  }

  .link-text {
    padding-top: 8px;
  }

  .link-text-value {
    display: flex;
    align-items: center;
    color: #30a46c;
    font-size: 14px;
    font-weight: 500;
  }

  .details {
    flex-grow: 1;
    height: 60px;
    padding-top: 8px;
    color: var(--vp-c-text-2);
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  }

  .box {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 18px;
  }

  .box .VPImage {
    margin-bottom: 15px;
  }

  .VPFeature {
    display: block;
    height: 100%;
    transition:
      border-color 0.25s,
      background-color 0.25s;
    border: 1px solid var(--vp-c-bg-soft);
    border-radius: 12px;
    background-color: var(--vp-c-bg-soft);
  }
  
  .nav-card:hover {
    border: 1px solid #30a46c;
  }

  .container {
    max-width: 1152px;
    margin: 0 auto;
  }

  a {
      color: inherit;
      text-decoration: inherit;
  }
</style>
