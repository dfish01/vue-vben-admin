<template>
  <a-layout class="layout">
    <a-tabs type="card">
      <a-tab-pane key="请求部分" tab="请求部分">
        <a-card>
          <div v-if="drawTask.taskType === '文生图'">
            <p>命令描述: {{ drawTask.commandDescription }}</p>
            <p>机器人名称: {{ drawTask.robotName }}</p>
            <p>任务模式: {{ drawTask.taskMode }}</p>
          </div>
          <div v-else-if="drawTask.taskType === '混图'">
            <a-space>
              <a-image
                v-for="(url, index) in drawTask.requestImages"
                :key="index"
                :src="url"
                :preview="{ src: url }"
              />
            </a-space>
          </div>
          <div v-else-if="drawTask.taskType === '解析图'">
            <a-image :src="drawTask.requestImage" :preview="{ src: drawTask.requestImage }" />
          </div>
          <p>是否公开: {{ drawTask.isPublic ? '是' : '否' }}</p>
          <p>创建时间: {{ drawTask.createTime }}</p>
          <p>任务状态: {{ drawTask.taskStatus }}</p>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="操作成功部分" tab="操作成功部分" v-if="drawTask.taskStatus === '已完成'">
        <a-card>
          <div v-if="drawTask.taskType === '文生图' || drawTask.taskType === '混图'">
            <a-image :src="drawTask.resultImage" :preview="{ src: drawTask.resultImage }" />
          </div>
          <div v-else-if="drawTask.taskType === '解析图'">
            <a-row>
              <a-col :span="12">
                <a-image :src="drawTask.resultImage" :preview="{ src: drawTask.resultImage }" />
              </a-col>
              <a-col :span="12">
                <p>{{ drawTask.description1 }}</p>
                <p>{{ drawTask.description2 }}</p>
                <p>{{ drawTask.description3 }}</p>
                <p>{{ drawTask.description4 }}</p>
              </a-col>
            </a-row>
          </div>
          <p>Discord开始时间: {{ drawTask.discordStartTime }}</p>
          <p>任务完成时间: {{ drawTask.taskCompleteTime }}</p>
          <p>排队时长: {{ drawTask.queueDuration }}</p>
          <p>任务消耗时长: {{ drawTask.taskDuration }}</p>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="操作失败部分" tab="操作失败部分">
        <a-card v-if="drawTask.taskStatus === '失败'">
          <p>失败原因: {{ drawTask.failureReason }}</p>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="账号部分" tab="账号部分">
        <a-card>
          <p>账号名称: {{ drawTask.accountName }}</p>
          <p>使用次数: {{ drawTask.usageCount }}</p>
          <p>成功次数: {{ drawTask.successCount }}</p>
          <p>失败次数: {{ drawTask.failureCount }}</p>
          <p>使用时长: {{ drawTask.usageDuration }}</p>
          <p>账号权限: {{ drawTask.ownerFlag }}</p>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="标注部分" tab="标注部分">
        <a-card>
          <a-tag v-for="(tag, index) in drawTask.tags" :key="index" :color="randomColor()">
            {{ tag }}
          </a-tag>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </a-layout>
</template>

<script lang="ts">
  import { ref } from 'vue';

  export default {
    setup() {
      const colors = [
        'magenta',
        'red',
        'volcano',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'blue',
        'geekblue',
        'purple',
      ];

      const randomColor = () => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
      };

      const drawTask = ref({
        // 模拟数据
        taskType: '解析图',
        commandDescription: '这是命令描述',
        robotName: '机器人A',
        taskMode: '模式A',
        isPublic: true,
        createTime: '2023-07-18 10:00:00',
        taskStatus: '失败',
        failureReason: '这是失败的原因',
        resultImage: 'https://cdn1.dahiti.com/WEB-UTIL/2023/07/16/1680564706161479682.png',
        description1: '描述1',
        description2: '描述2',
        description3: '描述3',
        description4: '描述4',
        discordStartTime: '2023-07-18 10:00:00',
        taskCompleteTime: '2023-07-18 10:10:00',
        queueDuration: '10分钟',
        taskDuration: '10分钟',
        accountName: '账号A',
        usageCount: 10,
        successCount: 8,
        failureCount: 2,
        usageDuration: '1小时',
        accountType: '类型A',
        tags: ['标签1', '标签2', '标签3', '标签4'],
      });

      return { drawTask, randomColor };
    },
  };
</script>

<style scoped>
  .layout {
    padding: 24px;
  }

  a-card {
    margin-bottom: 16px;
  }

  a-image {
    width: 100%;
  }

  a-row {
    margin-bottom: 16px;
  }
</style>
