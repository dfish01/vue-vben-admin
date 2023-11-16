<template>
  <a-layout v-loading="loadingRef" loading-tip="加载中...">
    <a-row>
      <!-- 抽屉部分，仅在移动端显示 -->
      <a-drawer :visible="isDrawerVisible" width="95%" @close="isDrawerVisible = false">
        <a-card style="padding-bottom: 0">
          <a-tabs v-model="activeTab">
            <a-tab-pane key="TextToImg" tab="文生图">
              <TextToImage
                style="text-align: center"
                @startLoading="startLoadingHandler"
                @endLoading="endLoadingHandler"
              />
            </a-tab-pane>
            <a-tab-pane key="MixImage" tab="混图">
              <Blend @startLoading="startLoadingHandler" @endLoading="endLoadingHandler" />
            </a-tab-pane>
            <a-tab-pane key="Describe" tab="解析图">
              <Describe @startLoading="startLoadingHandler" @endLoading="endLoadingHandler" />
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-drawer>
    </a-row>
    <a-row>
      <div
        v-if="!isMobile && !showTabs"
        class="my-button-icon"
        style="
          display: flex;
          position: absolute;
          z-index: 1;
          top: 50%;
          left: 10px;
          align-items: center;
          justify-content: center;
          transform: translateY(-50%);
          cursor: pointer;
        "
        @click="toggleTabs"
      >
        <a-button shape="circle" size="small">
          <RightOutlined />
        </a-button>
      </div>
      <a-col v-if="!isMobile && showTabs" :span="5">
        <a-sider theme="light">
          <div
            class="my-button-icon"
            style="
              display: flex;
              position: absolute;
              z-index: 1;
              top: 50%;
              right: 10px;
              align-items: center;
              justify-content: center;
              transform: translateY(-50%);
              cursor: pointer;
            "
            @click="toggleTabs"
          >
            <a-button shape="circle" size="small">
              <LeftOutlined />
            </a-button>
          </div>
          <a-card>
            <a-tabs v-model="activeTab">
              <a-tab-pane key="TextToImg" tab="文生图">
                <TextToImage
                  style="text-align: center"
                  @startLoading="startLoadingHandler"
                  @endLoading="endLoadingHandler"
                />
              </a-tab-pane>
              <a-tab-pane key="MixImage" tab="混图">
                <Blend @startLoading="startLoadingHandler" @endLoading="endLoadingHandler" />
              </a-tab-pane>
              <a-tab-pane key="Describe" tab="解析图">
                <Describe @startLoading="startLoadingHandler" @endLoading="endLoadingHandler" />
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </a-sider>
      </a-col>
      <a-col :span="rightColSpan">
        <a-content>
          <JobList ref="jobListRef" @openDrawer="isDrawerVisible = true" />
        </a-content>
      </a-col>
    </a-row>
  </a-layout>
</template>
<script lang="ts" setup>
  import JobList from './JobList.vue';
  import Blend from './Blend.vue';
  import { ref, inject } from 'vue';
  import TextToImage from './TextToImg.vue';
  import Describe from './Describe.vue';
  import { RightOutlined, LeftOutlined } from '@ant-design/icons-vue';

  const activeTab = ref('TextToImageForm');

  const loadingRef = ref(false);
  const jobListRef = ref();
  // 响应式变量，用于控制抽屉的显示
  const isDrawerVisible = ref(false);

  // 检测是否为移动端
  const isMobile = ref(window.innerWidth < 768);
  // 新增变量控制左侧标签的显示
  const showTabs = ref(true);
  const rightColSpan = ref(!isMobile.value && showTabs.value ? 19 : 24);
  // 新增方法切换左侧标签的显示和隐藏
  const toggleTabs = () => {
    showTabs.value = !showTabs.value;
    rightColSpan.value = showTabs.value ? 19 : 24;
  };

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768;
    if (isMobile.value) {
      rightColSpan.value = 24;
    } else {
      rightColSpan.value = showTabs.value ? 19 : 24;
    }
  });

  const startLoadingHandler = () => {
    loadingRef.value = true;
  };
  // const onSearch = inject('onSearch') as () => Promise<void>
  const endLoadingHandler = () => {
    setTimeout(() => {
      loadingRef.value = false;
    }, 2);
    // loadingRef.value = false
    if (jobListRef.value) {
      jobListRef.value.onSearch(); // 通过 ref 调用内层组件的 onSearch 方法
    } else {
      console.warn('jobListRef is not yet initialized');
    }
  };
</script>
<style scoped>
  .fixed-bottom-container {
    position: fixed;
    right: calc(100% / 6);
    bottom: 0;
    left: 0;

    /* 这里添加按钮的样式 */
  }

  .my-button-icon span.anticon {
    vertical-align: -0.125em !important;
  }
</style>
