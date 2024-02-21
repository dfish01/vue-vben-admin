<template>
  <div ref="formRef" v-loading="loadingRef" loading-tip="加载中...">
    <a-card
      :bodyStyle="{
        'align-items': 'center',
        'justify-content': 'center',
        height: `calc(100vh - 50px) `,
      }"
    >
      <!-- 查询框 -->
      <a-row>
        <a-col
          :span="24"
          style="display: flex; flex-direction: row; justify-content: center; margin-top: 20px"
        >
          <div style="display: flex; flex-direction: row; justify-content: center">
            <a-input-group compact style="display: flex; justify-content: center">
              <a-input
                v-model:value="searchForm.url"
                placeholder="这里粘贴你的小红书笔记链接~"
                style="width: 500px; height: 40px"
              />
              <a-button style="height: 40px" type="primary" @click="doAnalysis">立即解析</a-button>
            </a-input-group>
            <a-button style="height: 40px; margin-left: 10px" @click="clear">清空</a-button>
          </div>
        </a-col>

        <a-col
          :span="24"
          style="
            display: flex;
            justify-content: center;
            margin-top: 20px;
            border: 1px solid transparent;
            border-radius: 8px;
          "
        >
          <div
            style="
              width: 800px;
              padding: 8px;
              border: 1px solid transparent;
              border-radius: 8px;
              background-color: #fff7e8;
            "
          >
            <span style="padding: 3px 10px; color: rgb(0 0 0 / 70%)">
              <Icon
                icon="flat-color-icons:idea"
              />小提示：复制小红书的分享链接即可一键解析获取无水印原图，点击大图后右键下载！后续可进行一键二创作哦~</span
            >
          </div>
        </a-col>
      </a-row>

      <!-- 解析内容框 -->
      <a-row
        style="display: flex; align-items: center; justify-content: center; margin-top: 30px"
        v-if="analysisResult.title"
      >
        <a-col :span="24" style="display: flex; align-items: center; justify-content: center">
          <span style="font-size: 18px; font-weight: bold"> 🏷标题：</span>
          <span style="text-align: center">{{ analysisResult.title }}</span>
        </a-col>
      </a-row>
      <a-row style="display: flex; align-items: center; justify-content: center; margin-top: 20px">
        <div v-for="card in analysisResult.imageObjList" :key="card.url" style="margin: 1px">
          <a-card :bodyStyle="{ padding: '0px' }" class="card" :hoverable="false">
            <a-card
              :bodyStyle="{ padding: '0px' }"
              class="my-transparent-card"
              style="
                width: 300px;
                height: 400px;
                overflow: hidden;
                border: none;
                background: transparent;
              "
              :bordered="false"
              :hoverable="true"
            >
              <img
                @click="showInfoImage(analysisResult.images, card.url)"
                @mouseenter="card.enterFlag = true"
                @mouseleave="card.enterFlag = false"
                v-lazy.container="card.url"
                fallback=""
                alt=""
                style="max-width: 100%; transition: transform 0.3s ease; border-radius: 9px"
                :class="{ 'item-selected': card.taskImage && card.taskImage.enterFlag }"
              />
            </a-card>
            <div
              style="display: flex; flex-direction: column; padding-right: 4px; padding-bottom: 5px"
            >
              <a-popconfirm
                title="📢1.将图片保存到本地2.到'解析图'上传图片解析3.将图片与关键词合并进行生成！(⚠注意选好机器人，niji是专门二次元制作。后续会迭代一键任务)"
                ok-text="马上就去"
                cancel-text="暂不需要"
                @confirm="openDraw"
              >
                <a-button type="primary" shape="round"> 🎨同款绘制 </a-button>
              </a-popconfirm>
            </div>
          </a-card>
        </div>
      </a-row>
    </a-card>
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
  import { directive as viewer, api as viewerApi } from 'v-viewer';
  import 'viewerjs/dist/viewer.css';

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
  const loadingRef = ref(false);

  //查询
  const searchForm = ref({
    type: 'image',
    url: '80 小小缺的审美日记发布了一篇小红书笔记，快来看吧！ 😆 KkZz0xBErjbDLoZ 😆 http://xhslink.com/whWPVA，复制本条信息，打开【小红书】App查看精彩内容！',
  });

  const analysisResult = ref({
    type: '',
    title: '',
    cover: '',
    images: [] as string[],
    imageObjList: [] as any[],
    videoUrl: '',
  });

  const openDraw = async () => {
    go('/mj/index');
  };

  const doAnalysis = async () => {
    if (!searchForm.value.url || searchForm.value.url.length < 10) {
      message.error('请输入正确的分享链接');
      return;
    }
    // 验证消息来源和内容，然后关闭 iframe
    loadingRef.value = true;
    try {
      const response = await analysisLink(searchForm.value);

      analysisResult.value.cover = response.cover;
      analysisResult.value.title = response.title;
      analysisResult.value.images = response.images;
      analysisResult.value.type = response.type;
      analysisResult.value.imageObjList = response.imageObjList;
      analysisResult.value.videoUrl = response.videoUrl;
      console.log(analysisResult.value);
      message.success('解析成功~');
    } finally {
      loadingRef.value = false;
    }
  };

  const clear = () => {
    searchForm.value.url = null;
  };

  //画同款
  const go = useGo();
  const goDrawing = async (queryParams) => {
    go('/mj/index?activeTab=TextToImageForm&prompt=' + queryParams);
  };

  function showInfoImage(infoImageList, showUrl) {
    // 检查数组中是否存在 showUrl
    const showUrlIndex = infoImageList.findIndex((url) => url === showUrl);
    let imageList = infoImageList;
    // 如果存在，则创建一个新数组，将 showUrl 放在第一个位置，其余元素按原顺序添加
    if (showUrlIndex !== -1) {
      imageList = [
        showUrl,
        ...infoImageList.slice(showUrlIndex + 1),
        ...infoImageList.slice(0, showUrlIndex),
      ];
    }

    // 如果不存在 showUrl，则返回原数组
    viewerApi({ images: imageList });
  }
</script>

<style scoped>
  .search-card {
    display: flex;
    align-items: center;
    height: 45px;
    border-radius: 4px;
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
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: rgb(130 124 124 / 70%);
    color: white;
    font-size: 15px;
  }

  .my-transparent-card {
    padding: 0; /* 可能还需要设置 padding 为 0 */
    border: none;
    background: transparent;
    box-shadow: none; /* 可能还需要禁用阴影 */
  }
</style>
