<template>
  <div ref="formRef" v-loading="loadingRef" loading-tip="加载中...">
    <a-card
      :bodyStyle="{
        'align-items': 'center',
        'justify-content': 'center',
        height: `calc(100vh - 50px) `,
      }"
    >
      <!-- 内容区域 -->

      <!-- 查询框 -->
      <a-row>
        <a-col :span="24" style="display: flex; justify-content: center; margin-top: 20px">
          <a-input-group compact style="display: flex; justify-content: center">
            <a-input
              v-model:value="searchForm.url"
              placeholder="这里粘贴你的小红书笔记链接~"
              style="width: 500px; height: 40px"
            />
            <a-button style="height: 40px" type="primary" @click="doAnalysis">立即解析</a-button>
          </a-input-group>
        </a-col>
      </a-row>

      <!-- 解析内容框 -->
      <a-row style="margin-top: 20px" v-if="analysisResult.title">
        <a-col :span="24" style="display: flex; align-items: center">
          <span style="font-size: 18px; font-weight: bold"> 🏷标题：</span>
          <span style="text-align: center">{{ analysisResult.title }}</span>
        </a-col>
      </a-row>
      <a-row style="margin-top: 20px">
        <a-col :span="24" style="display: flex; flex-flow: row nowrap; overflow-x: auto">
          <a-image-preview-group>
            <a-image-preview-group
              :width="200"
              v-for="(imageUrl, index) in analysisResult.images"
              :style="{ width: '200px', flexShrink: 0 }"
              :key="index"
              :src="imageUrl"
            />
          </a-image-preview-group>
        </a-col>
      </a-row>
      <a-row style="margin-top: 20px" v-if="analysisResult.title">
        <a-col :span="24" style="display: flex; justify-content: right">
          <a-popconfirm
            title="📢1.将图片保存到本地2.到'解析图'上传图片解析3.将图片与关键词合并进行生成！(⚠注意选好机器人，niji是专门二次元制作。后续会迭代一键任务)"
            ok-text="马上就去"
            cancel-text="暂不需要"
            @confirm="openDraw"
          >
            <a-button type="primary" shape="round"> 制作🎨同款 </a-button>
          </a-popconfirm>
        </a-col>
      </a-row>
    </a-card>

    <Loading :loading="loadingRef" absolute="false" tip="正在加载中~" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, reactive, computed, unref } from 'vue';
  import { analysisLink } from '/@/api/df/utils';
  import { message } from 'ant-design-vue';
  import { Loading } from '/@/components/Loading';
  import { useGo } from '/@/hooks/web/usePage';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import Icon from '/@/components/Icon/Icon.vue';

  /** 页面高度计算开始 */
  const formRef = ref();
  //页面高度处理
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 0);
  //移动设备底部导航栏
  const offsetHeightRef = ref(97);
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
  const go = useGo();
  const loadingRef = ref(false);

  //查询
  const searchForm = ref({
    type: 'image',
    url: '',
  });

  const analysisResult = ref({
    type: '',
    title: '',
    cover: '',
    images: [] as string[],
    videoUrl: '',
  });

  const openDraw = async () => {
    go('/mj/index');
  };

  const doAnalysis = async () => {
    // 验证消息来源和内容，然后关闭 iframe
    loadingRef.value = true;
    try {
      const response = await analysisLink(searchForm.value);
      analysisResult.value = response;
      message.success('解析成功~');
    } finally {
      loadingRef.value = false;
    }
  };
</script>

<style scoped>
  .search-card {
    display: flex;
    align-items: center;
    height: 45px;
    border-radius: 4px;
  }
</style>
