<template>
  <a-layout v-loading="loadingRef" loading-tip="加载中...">
    <a-row class="flex-container">
      <!-- 抽屉部分，仅在移动端显示 -->
      <div v-if="!isMobile && !showTabs" class="toggle-button-left" @click="toggleTabs">
        <a-button shape="circle" size="small">
          <Icon
            icon="bx:right-arrow"
            class="vel-icon icon"
            aria-hidden="true"
            size="16"
            v-if="!showTabs"
          />
          <Icon icon="bx:left-arrow" class="vel-icon icon" aria-hidden="true" size="16" v-else />
        </a-button>
      </div>

      <a-col v-show="!isMobile && showTabs" class="left-menu">
        <div class="toggle-button-right" @click="toggleTabs">
          <a-button shape="circle" size="small" style="align-items: center">
            <Icon icon="bx:left-arrow" class="vel-icon icon" aria-hidden="true" size="16" />
          </a-button>
        </div>
        <a-card
          :bordered="true"
          class="no-padding-header ar-card"
          :bodyStyle="{ padding: '0px 5px' }"
          :headStyle="{ padding: '0px' }"
        >
          <template #title>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 45px;
              "
            >
              <div style="margin-left: 10px">
                <span style="font-weight: bold">🏢绘画收藏夹</span>
              </div>
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  justify-content: right;
                  margin-right: 10px;
                  font-size: 15px;
                "
              >
                <a-button type="text" @click="showAddView"><SvgIcon name="add" /></a-button>
              </div>
            </div>
          </template>

          <CollectCategory />
        </a-card>
      </a-col>

      <a-col class="right-content">
        <a-content>
          <CollectPc />
        </a-content>
      </a-col>
    </a-row>
  </a-layout>
</template>

<script lang="ts" setup>
  import JobList from './JobList.vue';
  import Icon from '/@/components/Icon/Icon.vue';
  import { SvgIcon } from '/@/components/Icon';
  import CollectPc from './collect_pc.vue';
  import CollectCategory from './collect_category.vue';

  import { ref, onMounted, reactive, watch } from 'vue';

  import { useRoute } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { collectCategoryApi } from './category';

  const {
    globalForm,
    categoryDataForm,
    categoryDataViewForm,
    // 方法
    init,
    showAddView,
    closedView,
    modifyView,
    addCollectCategory,
    deleteCollectCategory,
  } = collectCategoryApi();

  const { createMessage, createSuccessModal, createErrorModal, createInfoModal } = useMessage();

  const route = useRoute();

  const loadingRef = ref(false);
  const jobListRef = ref();
  const isMobile = ref(window.innerWidth < 768);
  const showTabs = ref(true);

  const toggleTabs = () => {
    showTabs.value = !showTabs.value;
  };

  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768;
  });
</script>

<style scoped>
  @media screen and (max-width: 3048px) {
    .left-menu {
      position: relative;
      flex: 0 0 200px;
    }
  }

  @media screen and (max-width: 2260px) {
    .left-menu {
      position: relative;
      flex: 0 0 200px;
    }
  }

  @media screen and (max-width: 1680px) {
    .left-menu {
      position: relative;
      flex: 0 0 200px;
    }
  }

  .flex-container {
    display: flex;
    position: relative;
  }

  .right-content {
    flex: 1;
    overflow-x: auto;
  }

  .toggle-button-left {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 5px; /* 将按钮放在左侧 */
    transform: translateY(-50%);
  }

  .toggle-button-right {
    position: absolute;
    z-index: 2;
    top: 50%;
    right: 0; /* 将按钮放在左侧菜单的右侧 */
    transform: translateY(-50%);
  }

  .flex-container:not(.showTabs) .my-button-icon {
    right: 10px; /* 当左侧菜单隐藏时 */
  }

  .toggle-button-right span.anticon {
    vertical-align: -0.125em !important;
  }

  .toggle-button-left span.anticon {
    vertical-align: -0.125em !important;
  }

  .no-padding-header >>> .ant-card-head-title {
    padding: 0 !important;
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
