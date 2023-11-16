<template>
  <a-modal :visible="isVisible" title="账号统计详情" @ok="closeModal" @cancel="closeModal">
    <template #footer>
      <a-button key="submit" type="primary" @click="closeModal">确定</a-button>
    </template>
    <a-spin :spinning="isLoading">
      <a-descriptions
        layout="vertical"
        bordered
        :column="{ xxl: 4, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }"
        class="centered-text"
      >
        <!-- <a-descriptions-item label="账号ID">  {{ details?.accountId }}</a-descriptions-item>
        <a-descriptions-item label="Discord用户ID">{{
          details?.discordUserId
        }}</a-descriptions-item> -->
        <a-descriptions-item label="Discord用户名">{{
          details?.discordUserName
        }}</a-descriptions-item>
        <a-descriptions-item label="账号人数">{{ details?.userCounts }}</a-descriptions-item>
        <a-descriptions-item label="队列数">{{ details?.queuedTaskCounts }}</a-descriptions-item>
        <a-descriptions-item label="执行数">{{ details?.executingCounts }}</a-descriptions-item>
        <a-descriptions-item label="失败数">{{ details?.failedTaskCounts }}</a-descriptions-item>
        <a-descriptions-item label="成功数">{{
          details?.successfulTaskCounts
        }}</a-descriptions-item>
        <a-descriptions-item label="并发上限">{{ details?.totalConcurrency }}</a-descriptions-item>
        <a-descriptions-item label="已并发数">{{ details?.useConcurrency }}</a-descriptions-item>
      </a-descriptions>
    </a-spin>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, watch, computed, defineEmits } from 'vue';
  import { AuthAccountStatistics } from '/@/api/df/model/accountModel';
  import { getAccountStatisticalInfo } from '/@/api/df/account';
  import { IdReq } from '/@/api/model/baseModel';

  const isLoading = ref(true);
  // 从外部传入的ID
  const props = defineProps<{
    id: string;
    visible: boolean;
  }>();

  const isVisible = computed(() => props.visible);
  const details = ref<AuthAccountStatistics>({
    accountId: '', // 账号ID
    discordUserId: '', // discord用户ID
    discordUserName: '', // discord用户名
    userCounts: 0, // 账号持有人
    executingCounts: 0, // 执行数
    queuedTaskCounts: 0, // 队列数
    failedTaskCounts: 0, // 失败数
    successfulTaskCounts: 0, // 成功数
    totalConcurrency: 0, // 并发上限
    useConcurrency: 0, // 已并发数
  });

  // 关闭模态窗口
  const closeModal = () => {
    // 发送事件通知父组件
    emit('update-visible', false);
  };

  // 定义事件，用于与父组件通信
  const emit = defineEmits<{
    (event: 'update-visible', value: boolean): void;
  }>();

  // 监听ID的变化，并调用后端接口获取数据
  watch(
    () => props.id,
    async (newId) => {
      console.log(newId);
      if (newId && isVisible.value) {
        isLoading.value = true; // 开始加载
        const param: IdReq = { id: newId };
        details.value = await getAccountStatisticalInfo(param);
        isLoading.value = false; // 加载完成
      }
    },
  );
</script>
<style scoped>
  .centered-text .ant-descriptions-item-content {
    text-align: center;
  }
</style>
