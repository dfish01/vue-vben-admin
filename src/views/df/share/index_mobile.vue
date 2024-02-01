<template>
  <a-layout v-loading="loadingRef" loading-tip="加载中..." />
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive, nextTick, computed, provide } from 'vue';

  const loadingRef = ref();
</script>

<style scoped>
  .flex-container {
    display: flex;
    position: relative;
    width: '100%';
  }

  .left-menu {
    position: relative;
    flex: 0 0 350px;
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

  .custom-tour >>> .ant-tour {
    width: 100% !important;
  }

  ::v-deep(.ant-tour) {
    width: 100% !important;
  }
</style>
