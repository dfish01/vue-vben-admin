<template>
  <a-layout loading-tip="加载中...">
    <a-card :bodyStyle="{ padding: '0px 20px 0px 20px', height: `calc(${contentHeight}px)` }">
      <!-- <a-card :bodyStyle="{ padding: '0px 20px 0px 20px', height: 'auto' }"> -->
      <a-tabs ref="formRef" v-model="activeKey">
        <a-tab-pane key="1">
          <template #tab>
            <span
              ><Icon
                icon="mdi:account-multiple"
                class="vel-icon icon"
                aria-hidden="true"
                style="margin-right: 2px"
                size="16"
              />MJ账户组
            </span>
          </template>
          <Account :contentHeight="contentHeight" />
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab>
            <span>
              <Icon
                icon="ic:outline-discord"
                class="vel-icon icon"
                style="margin-right: 2px"
                aria-hidden="true"
                size="16"
              />Discord账号</span
            >
          </template>
          <Discord :contentHeight="contentHeight" />
        </a-tab-pane>
        <a-tab-pane key="3" disabled>
          <template #tab>
            <span>
              <Icon
                icon="simple-icons:semanticuireact"
                class="vel-icon icon"
                style="margin-right: 2px"
                aria-hidden="true"
                size="16"
              />
              ChatGpt账号（已关闭）</span
            >
          </template>
          <Chatgpt :contentHeight="contentHeight" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, unref } from 'vue';

  import AccountGroup from './account_group.vue';
  import Account from './account.vue';
  import Discord from './discord.vue';
  import Chatgpt from './chatgpt/chatgpt.vue';
  import Icon from '/@/components/Icon/Icon.vue';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';

  /** 页面高度计算开始 */
  const formRef = ref();
  //页面高度处理
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 0);
  //移动设备底部导航栏
  const offsetHeightRef = ref(1);
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

  const activeKey = ref(null);
</script>

<style scoped>
  /* .a-table {
    width: 100%;
    height: calc(80vh - 95px);
    padding: 10px;
    overflow: auto;
  } */
</style>
