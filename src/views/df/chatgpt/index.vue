<template>
  <a-layout v-loading="loadingRef" loading-tip="加载中...">
    <div style="margin-bottom: 64px">

    </div>
    <div class="VPFeatures VPHomeFeatures" style="margin-bottom: 64px" v-for="category in categories" :key="categoryCode">
      <div class="container" >
        <div class="VPTeamPageTitle" style="display: flex; ">
          <h1 style="margin-bottom: 24px; font-size:22px; font-weight: bold"> {{category.title}} </h1>
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
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, unref, nextTick } from 'vue';
  import ChatgptMobile from './chatgpt_mobile.vue';
  import ChatgptPc from './chatgpt_pc.vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { allChatgptShare, getUrl  } from '/@/api/df/chatgptShare';
  import data from './data.json';


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
    padding: 24px;
  }

  .box .VPImage {
    margin-bottom: 20px;
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
