<template>
  <div class="app" ref="formRef">
    <a-row style="height: 55px">
      <a-col :span="24">
        <a-card
          style="display: flex; align-items: center; height: 100%"
          :bodyStyle="{ padding: '0 5px 0px 24px' }"
        >
          <a-form layout="inline">
            <a-form-item>
              <a-input v-model:value="search.title" placeholder="输入故事标题" />
            </a-form-item>
            <a-form-item>
            <a-select
              v-model:value="search.genType"
              placeholder="生成类型"
              style="width: 100px;"
            >
          
            <a-select-option value="">全部</a-select-option>
              <a-select-option value="AI">AI故事</a-select-option>
              <a-select-option value="NOVEL">小说分镜</a-select-option>
            </a-select>
          </a-form-item>
            <a-form-item>
              <a-space>
                <a-button-group>
                  <a-button type="primary" @click="onSearch">查询</a-button>
                  <a-button @click="onReset">重置</a-button>
                </a-button-group>
                <!-- <a-button-group> -->
                  <!-- <a-button @click="showDiscordForm">配置Discord账号</a-button> -->
                  <a-button @click="showStoryForm" style=" background-color: none;
    background-image: linear-gradient(to right, #e82d81, #3fe0b5); /* 从左到右的渐变 */
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%); color:white" >AI故事</a-button>
                  <a-button @click="showNovelForm" style=" background-color: none;
    background-image: linear-gradient(to right, #677af4, #9f3fe0); /* 从左到右的渐变 */
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%); color:white" 
                    >小说分镜</a-button
                  >
                  <!-- <a-button @click="onShowActive" ref="activeStep">授权激活</a-button> -->
                  <!-- <a-button type="success" @click="openGoodsShop">授权市场</a-button> -->

                  <!-- <a-button type="success" @click="openAccountGroup"
                    >账号组管理{{ props.contentHeight }}</a-button
                  > -->
                <!-- </a-button-group> -->

                <a-button @click="doTextToVoice('https://ttsmaker.cn/')" > <span><Icon
                    icon="iconamoon:volume-down"
                    class="vel-icon icon"
                    aria-hidden="true"
                    style="margin-right: 1px"
                    size="16"
                />文本转语音</span></a-button>
                <!-- <a-button-group>
                  <a-button @click="goThirdShop('/goods/index')" ref="goodsStep">
                    <Icon
                      icon="simple-icons:shopee"
                      class="vel-icon icon"
                      aria-hidden="true"
                      color="#86A789"
                      size="17"
                    />
                    购买账号
                  </a-button>
                  <a-button @click="goThirdShop('/sec_goods/index')">
                    <Icon
                      icon="simple-icons:shopee"
                      class="vel-icon icon"
                      aria-hidden="true"
                      color="#EE4266"
                      size="17"
                    />
                    转售市场
                  </a-button>
                </a-button-group> -->
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>

    <div
      :style="{
        height: `calc(${contentHeight}px  - 77px)`,
        width: '100%',
        padding: '0px 10px',
      }"
    >
      <a-table :dataSource="tableData" rowKey="id" :loading="globalLoading">
        <a-table-column title="记录id" dataIndex="id" key="id" v-if="false" align="center" />
        <a-table-column
          title="故事标题"
          dataIndex="title"
          key="title"
          align="center"
          width="250px"
        />
        <a-table-column
          title="生成类型"
          dataIndex="genType"
          key="genType"
          align="center"
          width="130px"
        >
          <template #default="{ record }">
            <div v-if="record.genType === 'AI'">
              <a-tag> AI故事 </a-tag>
            </div>
            <div v-else>
              <a-tag> 小说分镜 </a-tag>
            </div>
          </template>
        </a-table-column>
        <a-table-column
          title="风格参考图"
          dataIndex="srefUrl"
          key="srefUrl"
          align="center"
          width="160px"
        >
          <template #default="{ record }">
            <div v-if="record.srefUrl">
              <a-image :src="record.srefUrl" :width="100" :preview="true" />
            </div>
            <div v-else>
              <span>暂未指定</span>
            </div>
          </template>
        </a-table-column>
        <a-table-column title="故事背景" dataIndex="background" key="background" align="center" />

        <a-table-column title="账号状态" dataIndex="state" key="state" align="center">
          <template #default="{ text }">
            <a-tag color="#d9d9d9" v-if="text === 'await_role'">角色待生成</a-tag>
            <a-tag color="#FAA300" v-else-if="text === 'role_creating'">角色生成中</a-tag>
            <a-tag color="#d9d9d9" v-else-if="text === 'await_pic'">分镜待生成</a-tag>
            <a-tag color="#86469C" v-else-if="text === 'pic_creating'">分镜生成中</a-tag>
            <a-tag color="#52c41a" v-else-if="text === 'success'">已全部生成</a-tag>
            <a-tag color="#008DDA" v-else-if="text === 'submitting'">任务提交中</a-tag>
            <a-tag color="#d9d9d9" v-else>其他</a-tag>
          </template>
        </a-table-column>
        <a-table-column
          title="创建时间"
          width="160px"
          dataIndex="gmtCreate"
          key="gmtCreate"
          align="center"
        />

        <a-table-column title="操作" key="actions" fixed="right" width="150px" align="center">
          <template #default="{ record }">
            <a-button-group>
              <a-button @click="editStorySplitForm(record.id)"
                ><Icon
                  icon="uil:edit"
                  class="vel-icon icon"
                  aria-hidden="true"
                  style="margin-right: 1px"
                  size="16"
              /></a-button>
              <a-button @click="doStoryRemove(record.id)"
                ><Icon
                  icon="fluent:delete-32-regular"
                  class="vel-icon icon"
                  aria-hidden="true"
                  style="margin-right: 1px"
                  size="16"
              /></a-button>
              <a-tooltip title="启动AI生成">
                <a-button :disabled="record.state === 'success'" @click="doStartStoryJob(record.id)"
                  ><Icon
                    icon="codicon:run-all"
                    class="vel-icon icon"
                    aria-hidden="true"
                    style="margin-right: 1px"
                    size="16"
                /></a-button>
              </a-tooltip>
              <a-tooltip title="分镜图片下载">
                <a-button :disabled="record.state !== 'success'" @click="doDownloadImages(record.id)"
                  ><Icon
                    icon="icon-park-outline:down-picture"
                    class="vel-icon icon"
                    aria-hidden="true"
                    style="margin-right: 1px"
                    size="16"
                /></a-button>
              </a-tooltip>
              <a-tooltip title="分镜字幕拼接复制">
                <a-button :disabled="record.state !== 'success'" @click="doCopySplitText(record.id)"
                  ><Icon
                    icon="solar:copy-bold"
                    class="vel-icon icon"
                    aria-hidden="true"
                    style="margin-right: 1px"
                    size="16"
                /></a-button>
              </a-tooltip>
              <!-- <a-tooltip title="将分镜字幕进行语音合成">
                <a-button disabled @click="doDownloadImages(record.id)"
                  ><Icon
                    icon="iconamoon:volume-down"
                    class="vel-icon icon"
                    aria-hidden="true"
                    style="margin-right: 1px"
                    size="16"
                /></a-button>
              </a-tooltip> -->
              
            </a-button-group>
          </template>
        </a-table-column>
      </a-table>
    </div>
    <div ref="button">
      <a-card class="pagination">
        <a-pagination
          size="small"
          :current="pagination.current"
          :pageSize="pagination.pageSize"
          :pageSizeOptions="pagination.pageSizeOptions"
          :total="pagination.total"
          :showSizeChanger="pagination.showSizeChanger"
          :showTotal="pagination.showTotal"
          @change="pageChange"
          @showSizeChange="pageSizeChange"
          style="margin-left: 10px"
        />
      </a-card>
    </div>

    <!-- AI故事生成 -->
    <a-modal
      v-model:open="storyForm.viewFlag"
      title="AI创作"
      ok-text="提交"
      @cancel="closeStoryForm"
      :bodyStyle="{ padding: 0 }"
    >
      <template #footer>
        <a-button @click="closeStoryForm">取消</a-button>
        <a-button :loading="storyForm.storyLoading || globalLoading" @click="doGenStory" style=" background-color: none;
    background-image: linear-gradient(to right, #e82d81, #3fe0b5); /* 从左到右的渐变 */
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%); color:white" 
          >AI故事生成</a-button
        >
        <a-button
          type="primary"
          style=" background-color: none;
    background-image: linear-gradient(to right, #2850bc, #600e96); /* 从左到右的渐变 */
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%); color:white" 
          v-if="
            storyForm.aiStory && storyForm.aiStory.length > 0 && storyForm.storyLoading === false
          "
          :loading="storyForm.storyLoading || globalLoading"
          @click="doGenStorySplit"
          >AI故事分镜</a-button
        >
      </template>
      <a-spin :spinning="globalLoading" tip="内容过多，需要的时间稍长。请耐心等待！">
        <a-row style="padding: 0 10px">
          <div
            v-if="storyForm.storyLoading"
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 53px;
            "
          >
            <Icon icon="svg-spinners:bars-fade" size="40" />
            <span style="color: red; font-size: 10px">内容较多，生成时间稍长，请耐心等候</span>
          </div>
          <a-textarea
            v-else
            :bordered="true"
            v-model:value="storyForm.text"
            :rows="2"
            placeholder="请输入你要生成的故事主题，比如：“一只猫大战老虎的悲伤故事” 100字以内"
            :maxlength="100"
          />
        </a-row>

        <a-row
          style="margin-top: 20px; padding: 0 10px"
          v-if="
            storyForm.aiStory && storyForm.aiStory.length > 0 && storyForm.storyLoading === false
          "
        >
          <div
            justify="start"
            align="top"
            style="
              width: 100%;
              margin-bottom: 10px;
              padding: 8px;
              border: 1px solid transparent;
              border-radius: 8px;
              background-color: #fff7e8;
            "
          >
            <span style="padding: 3px 10px; color: rgb(0 0 0 / 70%); font-size: 10px">
              <Icon icon="flat-color-icons:idea" color="#91C8E4" />
              这是一个大纲内容，如果生成的内容不理想，你可以手动修改下。大体结构不变就好。</span
            >
          </div>
          <a-textarea
            :bordered="true"
            v-model:value="storyForm.aiStory"
            :rows="10"
            placeholder="一只猫大战老虎的悲伤故事2"
            :maxlength="1024"
          />
        </a-row>
      </a-spin>
    </a-modal>

    <!-- AI分镜故事 -->
    <a-modal
      v-model:open="storySplitForm.viewFlag"
      @cancel="closeStorySplitForm"
      width="100%"
      wrap-class-name="full-modal"
    >
      <template #title>
        <span
          >AI故事分镜
          </span
        >
      </template>

      <template #footer>
        <a-button @click="closeStorySplitForm">取消</a-button>
        <a-button type="primary" target="" :loading="globalLoading" @click="doCommitSplitContent" style=" background-color: none;
    background-image: linear-gradient(to right, #2850bc, #600e96); /* 从左到右的渐变 */
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%); color:white" >
          {{ storySplitForm.item.id ? '保存修改' : '提交分镜' }}</a-button
        >
        <!-- <a-button
          type="primary"
          v-if="storySplitForm.item?.process === 'NONE'"
          :loading="globalLoading"
          target=""
          @click="doStartStoryJob(storySplitForm.value.item.id)"
          >启动任务</a-button
        > -->
        <a-button
          v-if="storySplitForm.item?.process === 'SPLIT_PIC_COMPLETED'"
          target=""
          :loading="globalLoading"
          @click="doDownloadImages"
          >下载</a-button
        >
      </template>
      <a-spin :spinning="globalLoading">
        <div style="flex-wrap: wrap; height: 82vh; overflow: auto">
          <StoryInfo ref="storyInfoRef" :storySplitForm="storySplitForm" />
        </div>
      </a-spin>
    </a-modal>

    <!-- 小说转分镜 -->
    <a-modal
      v-model:open="novelForm.viewFlag"
      title="小说章节转分镜"
      @cancel="closeNovelForm"
      :bodyStyle="{ padding: 0 }"
    >
      <template #footer>
        <a-button @click="closeNovelForm">取消</a-button>
        <a-button type="primary" :loading="novelForm.loading || globalLoading" @click="doNovelExtract" style=" background-color: none;
    background-image: linear-gradient(to right, #677af4, #9f3fe0); /* 从左到右的渐变 */
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%); color:white" 
          >小说转分镜</a-button
        >
      </template>
      <a-spin :spinning="globalLoading" tip="内容过多，需要的时间稍长。请耐心等待！">
        <a-row style="padding: 0 10px">
          <div
            v-if="novelForm.loading"
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 53px;
            "
          >
            <Icon icon="svg-spinners:bars-fade" size="40" />
            <span style="color: red; font-size: 10px">内容较多，生成时间稍长，请耐心等候</span>
          </div>
          <a-textarea
            v-else
            :bordered="true"
            v-model:value="novelForm.content"
            :rows="15"
            placeholder="复制小说章节到此。如：
　　第1章矿奴
　　昏暗潮湿的矿道中，陆叶背着矿篓，手中提着矿镐，一步步朝前行去。
　　少年的表情有些忧伤，双目聚焦在面前的空处，似在盯着什么东西。
　　外人看来，陆叶前方空无一物，但实际上在少年的视野中，却能看到一个半透明的影子。
　　那像是一棵树的影子，灰蒙蒙的，叫人看不真切，枝叶繁茂，树杈从树身三分之一的位置朝左右分开，支撑起一个半圆形的树冠。
　　来到这个叫九州的世界已经一年多时间，陆叶至今没搞明白这到底是什么东西，他只知道当自己的注意力足够集中的时候，这棵影子树就有几率出现在视野中，而且别人完全不会察觉。
　　“真是悲催的人生。”少年一声叹息。
　　一年前，他突兀地在这个陌生的世界醒来，还不等他熟悉下环境，所处的势力便被一伙贼人攻占了，很多人被杀，他与另外一些年轻的男女成了那伙贼人的俘虏，然后被送进了这处矿脉，成为一名低贱的矿奴。
　　事后他才从旁人的零散交谈中得知，他所处的势力是隶属浩天盟，一个叫做玄天宗的宗门。
　　这个宗门的名字听起来炫酷狂霸，但实际上只是个不入流的小宗门。
　　攻占玄天宗的，是万魔岭麾下的邪月谷。
"
            :maxlength="5000"
          />
        </a-row>
      </a-spin>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, unref, nextTick } from 'vue';
  import { Loading } from '/@/components/Loading';
  import Icon from '/@/components/Icon/Icon.vue';
  import { IdReq } from '/@/api/model/baseModel';
  import AccountGroup from './account_group.vue';
  import {
    novelExtract,
    genSimpleStory,
    genStory,
    storyList,
    storyRemove,
    storyInfo,
    startStoryJob,
    saveStoryRole,
    genSplitPicture,
    extractSplitContent,
    commitSplitContent,
  } from '/@/api/df/story';
  import { message, UploadProps, Upload } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { useGo } from '/@/hooks/web/usePage';
  import { func } from 'vue-types';
  import { getCustomLocalCache, setCustomLocalCache } from '/@/utils/custom';
  import { useUserStore } from '/@/store/modules/user';
  import type { UploadFile } from 'ant-design-vue/es/upload/interface';
  import { getAppEnvConfig } from '/@/utils/env';
  import StoryInfo from './story_info.vue';
  import { downloadByOnlineUrl } from '/@/utils/file/download';
  import useClipboard from 'vue-clipboard3';

  const { toClipboard } = useClipboard();

  const copyText = async (prompt) => {
    try {
      await toClipboard(prompt);
      message.success('合并字幕复制成功');
    } catch (e) {
      message.error('复制失败!' + e.message);
    }
  };


  const userStore = useUserStore();
  const token = userStore.getToken;
  const userInfo = ref(userStore.getUserInfo); // 直接赋值

  /** 页面高度计算开始 */
  const button = ref(null);
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 0);
  const offsetHeightRef = ref(0);
  const subtractHeightRefs = ref([button]);
  const formRef = ref();
  // 使用hook
  const { contentHeight, redoHeight } = useContentHeight(
    computed(() => true),
    formRef,
    unref(subtractHeightRefs), // 使用 unref 获取数组值
    unref(substractSpaceRefs),
    upwardSpace,
    offsetHeightRef,
  );
  const { createMessage, createSuccessModal, createErrorModal, createInfoModal } = useMessage();
  const { VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL, VITE_GLOB_API_URL_PREFIX, VITE_GLOB_UPLOAD_URL } =
    getAppEnvConfig();

  //故事查询
  const search = ref({
    title: null,
    genType:null,
  });
  // 分页
  const pagination = ref({
    // 表格分页的配置
    current: 1,
    pageSize: 10,
    showSizeChanger: true, // 用于控制展示每页多少条的下拉
    showQuickJumper: true,
    total: 0,
    pageSizeOptions: ['10', '20', '50'],
    showTotal: (total) => `共 ${total} 条`,
    onShowSizeChange: pageSizeChange,
    onChange: pageChange,
  });

  const onReset = () => {
    search.value = {
      title: null,
    };
  };
  // 页数改变的方法
  function pageSizeChange(val, pageNum) {
    pagination.value.pageSize = pageNum; // 修改每页显示的条数
    pagination.value.current = 1;
    onSearch();
  }
  // 点击上一页下一页的方法
  function pageChange(page, val) {
    console.log(page, val);
    pagination.value.current = page;
    onSearch();
  }

  const globalLoading = ref(false);
  const onSearch = async () => {
    globalLoading.value = true;
    try {
      const params = search.value;
      params.current = pagination.value.current;
      params.pageSize = pagination.value.pageSize;
      console.log(params);
      const response = await storyList(params);
      tableData.value = response.records;
      pagination.value.total = response.total;
    } finally {
      globalLoading.value = false;
    }
  };

  onMounted(async () => {
    await onSearch();
  });

  // 主table 数据
  const tableData = ref<any[]>([
    // 更多数据...
  ]);

  const doTextToVoice = (url) => {
    window.open(url, '_blank');
  };

  //************************************** 故事创建 ***********************************//

  const storyForm = ref({
    viewFlag: false,
    text: null,
    storyLoading: false,
    mode: 'gpt-4-0125-preview',
    aiStory: null,
  });

  const showStoryForm = async () => {
    storyForm.value.viewFlag = true;
  };
  const closeStoryForm = async () => {
    storyForm.value = {
      viewFlag: false,
      text: null,
      storyLoading: false,
      mode: 'gpt-4-0125-preview',
      aiStory: null,
    };
  };

  // 生成故事
  const doGenStory = async () => {
    storyForm.value.storyLoading = true;
    try {
      const resp = await genStory({
        mode: storyForm.value.mode,
        content: storyForm.value.text,
      });
      storyForm.value.aiStory = resp;
      message.success("创作成功!");
      // onSearch();
    } finally {
      storyForm.value.storyLoading = false;
    }
  };

  // 生成故事分镜
  const doGenStorySplit = async () => {
    globalLoading.value = true;
    try {
      const resp = await genSimpleStory({
        mode: storyForm.value.mode,
        content: storyForm.value.aiStory,
      });

      console.log(resp);
      storyForm.value.viewFlag = false;

      //打开明细创建页面
      showStorySplitForm(resp);
    } finally {
      globalLoading.value = false;
    }
  };

  // ti
  const doStoryExtract = async () => {
    globalLoading.value = true;
    try {
      const resp = await storyExtract({
        mode: storyForm.value.mode,
        content: storyForm.value.aiStory,
      });

      console.log(resp);
      storyForm.value.viewFlag = false;

      //打开明细创建页面
      showStorySplitForm(resp);
    } finally {
      globalLoading.value = false;
    }
  };
  

  // 删除sotry
  const doStoryRemove = async (id) => {
    globalLoading.value = true;
    const param: IdReq = { id: id };
    try {
      await storyRemove(param);
      message.success('删除成功');
      onSearch();
    } finally {
      globalLoading.value = false;
    }
  };

  //启动任务
  const doStartStoryJob = async (id) => {
    console.log('doStartStoryJob');
    globalLoading.value = true;
    const param: IdReq = { id: id };
    try {
      await startStoryJob(param);
      message.success('启动成功，请耐心等待~');
      onSearch();
    } finally {
      globalLoading.value = false;
    }
  };

  //下载图片
  const doDownloadImages = async (id) => {
    globalLoading.value = true;
    try {
      if(id) {
        //查询详情
        const resp = await storyInfo({ id: id });
        storySplitForm.value.item = resp;
      }

      let chapterList = storySplitForm.value.item.storyChapterList;
      chapterList.forEach((element, index) => {
        let pictureList = element.storyPictureList;

        pictureList.forEach((e, j) => {
          downloadByOnlineUrl(
            e.imageInfo.url,
            storySplitForm.value.item.title +
              '-' +
              index +
              '-' +
              j +
              '.' +
              e.imageInfo.url.split('.').pop(),
          );
        });
      });
    } finally {
      globalLoading.value = false;
    }
  };

  const doCopySplitText = async (id) => {
    globalLoading.value = true;
    try {
      if(id) {
        //查询详情
        const resp = await storyInfo({ id: id });
        storySplitForm.value.item = resp;
      }

      let chapterList = storySplitForm.value.item.storyChapterList;
      let allCaption = '';
      chapterList.forEach((element, index) => {
        let pictureList = element.storyPictureList;
        const concatenatedText = pictureList.reduce((accumulator, current) => {
          return accumulator + current.caption + '。';
        }, '');
        allCaption = allCaption + concatenatedText;
      });
      copyText(allCaption);
      console.log("allCaption {}", allCaption)
      
    } finally {
      globalLoading.value = false;
    }
  };


  function getFileExtension(url) {
    return url.split('.').pop();
  }

  //************************************** 故事分镜 ***********************************//

  //SparkDesk-v3.5
  const novelForm = ref({
    viewFlag: false,
    content: '',
    loading: false,
    mode: 'gpt-4-0125-preview',
  });

  const showNovelForm = async () => {
    novelForm.value.viewFlag = true;
  };
  const closeNovelForm = async () => {
    novelForm.value ={
      viewFlag: false,
      content: '',
      loading: false,
      mode: 'gpt-4-0125-preview',
    };
  };


    //执行小说分镜
  const doNovelExtract = async () => {
    // globalLoading.value = true;
    novelForm.value.loading = true;
    try {
      const resp = await novelExtract({
        mode: novelForm.value.mode,
        content: novelForm.value.content,
      });
      
      novelForm.value.viewFlag = false;
      console.log(resp);
      novelForm.value.viewFlag = false;

      //打开明细创建页面
      showStorySplitForm(resp);

    } finally {
      // globalLoading.value = false;
      novelForm.value.loading = false;
    }
  };


  const storySplitForm = ref({
    viewFlag: false,
    item: null,
    loading: false,
  });

  const storyInfoRef = ref<InstanceType<typeof StoryInfo> | null>(null);

  const editStorySplitForm = async (id) => {
    console.log('showStorySplitForm');
    globalLoading.value = true;
    try {
      const resp = await storyInfo({ id: id });
      storySplitForm.value.item = resp;
      storySplitForm.value.viewFlag = true;
      nextTick(() => {
        storyInfoRef.value.getInitSrefUrl(storySplitForm.value.item.srefUrl);
      });
    } finally {
      globalLoading.value = false;
    }
  };

  const showStorySplitForm = async (item) => {
    storySplitForm.value.viewFlag = true;
    storySplitForm.value.item = item;
    console.log('showStorySplitForm');
    nextTick(() => {
      storyInfoRef.value?.getInitSrefUrl(storySplitForm.value.item.srefUrl);
    });
  };
  const closeStorySplitForm = async () => {
    storySplitForm.value.viewFlag = false;
    // storySplitForm.value.item = null;
    storySplitForm.value.loading = false;
  };

  //提交故事分镜
  const doCommitSplitContent = async () => {
    globalLoading.value = true;
    try {
      const resp = await commitSplitContent(storySplitForm.value.item);
      console.log(resp);
      storySplitForm.value.viewFlag = false;
      //打开明细创建页面
      onSearch();
    } finally {
      globalLoading.value = false;
    }
  };

  /*********************************** 角色 ******************************** */

  const storyRoleForm = ref({
    viewFlag: false,
    loading: false,
    item: {
      roleName: null,
      description: null,
      prompt: null,
    },
  });

  const closeStoryRoleForm = () => {
    storyRoleForm.value.viewFlag = false;
  };
  const saveStoryRoleForm = () => {
    // let index = storyPictureForm.value.chapterIndex;
    let indexItem = storyRoleForm.value.item.key;
    if (indexItem) {
      storySplitForm.value.item.storyRoleList[indexItem] = storyRoleForm.value.item;
    } else {
      //新增
      storySplitForm.value.item.storyRoleList.push(storyRoleForm.value.item);
    }
    storyRoleForm.value.viewFlag = false;
  };
  const removeStoryRoleForm = (item) => {
    const index = storySplitForm.value.item.storyRoleList.findIndex(
      (i) => i.roleName === item.roleName,
    );
    storySplitForm.value.item.storyRoleList.splice(index, 1);
  };
  const showStoryRoleForm = (item) => {
    //新增场景
    if (item === null) {
      item = {
        roleName: null,
        description: null,
        prompt: null,
      };
    }
    if (item.imageInfo === null || item.imageInfo === undefined) {
      item.imageInfo = {
        tabKey: 'AI',
      };
      //图片清空
      roleFileList.value = [];
    } else if (item.imageInfo && item.imageInfo.url) {
      //初始化图片
      roleFileList.value = [
        {
          uid: '-1',
          name: 'init.png',
          status: 'done',
          url: item.imageInfo.url,
        },
      ];
    }
    console.log('showStoryRoleForm');
    storyRoleForm.value.item = item;

    storyRoleForm.value.viewFlag = true;
  };

  const uploadInfo = ref({
    url: VITE_GLOB_API_URL + '/open/system/upload',
    token: token,
    srefUrls: [],
  });
  const roleFileList = ref([]);

  const previewVisible = ref(false);
  const previewImage = ref('');
  const previewTitle = ref('');
  const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
  };
  const handlePreview = async (file: UploadProps['fileList'][number]) => {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj)) as string;
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
  };

  function getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log('File successfully read as data URL'); // 日志输出
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        console.error('Error reading the file:', error); // 错误输出
        reject(error);
      };
    });
  }

  const beforeFileUpload = async (file: File) => {
    try {
      // 判断是否为图片
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        throw new Error('只能上传图片文件！');
      }
      // 获取图片文件的大小
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        throw new Error('图片大小不能超过5MB！');
      }
    } catch (error) {
      console.error('Error converting to Base64:', error);
      // 弹出异常消息
      message.error(error.message);
      //移除这个文件
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleRoleFileChange = async (info: { file: UploadFile; fileList: UploadFile[] }) => {
    console.log('handleChange'); // 日志输出
    if (info.file.status === 'done') {
      if (info.file.response.result === null) {
        info.file.status = 'error';
      } else {
        storyRoleForm.value.item.imageInfo.url = info.file.response.result;
      }
    } else if (info.file.status === 'removed') {
      storyRoleForm.value.item.imageInfo.url = getSuccessFileUrlStr(roleFileList.value)[0];
    }
  };

  const storyPictureForm = ref({
    chapterIndex: null,

    viewFlag: false,
    loading: false,
    item: {
      caption: null,
      description: null,
      prompt: null,
    },
  });

  const savePictureForm = () => {
    let index = storyPictureForm.value.chapterIndex;
    let indexItem = storyPictureForm.value.item.key;
    console.log('savePictureForm...');
    if (indexItem) {
      storySplitForm.value.item.storyChapterList[index].storyPictureList[indexItem] =
        storyPictureForm.value.item;
    } else {
      //新增
      storySplitForm.value.item.storyChapterList[index].storyPictureList.push(
        storyPictureForm.value.item,
      );
    }

    storyPictureForm.value.viewFlag = false;
  };

  const closeStoryPictureForm = () => {
    storyPictureForm.value.viewFlag = false;
  };
  const removeStoryPictureForm = (item, index) => {
    const indexItem = storySplitForm.value.item.storyChapterList[index].storyPictureList.findIndex(
      (i) => i.description === item.description,
    );

    console.log('removeStoryPictureForm');
    storySplitForm.value.item.storyChapterList[index].storyPictureList.splice(indexItem, 1);
  };

  const storyPictureMoveUp = (item, index) => {
    console.log('storyPictureMoveUp');

    const indexItem = storySplitForm.value.item.storyChapterList[index].storyPictureList.findIndex(
      (i) => i.description === item.description,
    );
    // 如果找到了 id 为 1 的记录，并且索引大于 0
    if (indexItem > 0) {
      // 交换记录
      const temp =
        storySplitForm.value.item.storyChapterList[index].storyPictureList[indexItem - 1];
      storySplitForm.value.item.storyChapterList[index].storyPictureList[indexItem - 1] =
        storySplitForm.value.item.storyChapterList[index].storyPictureList[indexItem];
      storySplitForm.value.item.storyChapterList[index].storyPictureList[indexItem] = temp;
    }
  };
  const showStoryPictureForm = (item, index) => {
    //新增场景
    if (item === null) {
      item = {
        caption: null,
        description: null,
      };
    }

    if (item.imageInfo === null || item.imageInfo === undefined) {
      item.imageInfo = {
        tabKey: 'AI',
      };
      //图片清空
      pictureFileList.value = [];
    } else if (item.imageInfo && item.imageInfo.url) {
      //初始化图片
      pictureFileList.value = [
        {
          uid: '-1',
          name: 'init.png',
          status: 'done',
          url: item.imageInfo.url,
        },
      ];
    }
    console.log('showStoryRoleForm');
    storyPictureForm.value.chapterIndex = index;
    storyPictureForm.value.item = item;
    storyPictureForm.value.viewFlag = true;
  };

  const pictureFileList = ref([]);
  const handlePictureFileChange = async (info: { file: UploadFile; fileList: UploadFile[] }) => {
    console.log('handleChange'); // 日志输出
    if (info.file.status === 'done') {
      if (info.file.response.result === null) {
        info.file.status = 'error';
      } else {
        storyPictureForm.value.item.imageInfo.url = info.file.response.result;
      }
    } else if (info.file.status === 'removed') {
      storyPictureForm.value.item.imageInfo.url = getSuccessFileUrlStr(roleFileList.value)[0];
    }
  };

  /********************************* 章节 **************************** */
  const storyChapterForm = ref({
    chapterIndex: null,
    viewFlag: false,
    loading: false,
    item: {},
  });

  const showChapterForm = (item, index) => {
    if (item === null) {
      item = {};
    }
    storyChapterForm.value.chapterIndex = index;
    storyChapterForm.value.item = item;
    storyChapterForm.value.viewFlag = true;
  };

  const closeChapterForm = () => {
    storyChapterForm.value.viewFlag = false;
  };

  const saveChapterForm = () => {
    console.log('saveChapterForm');
    if (storyChapterForm.value.chapterIndex === null) {
      //新增
      storyChapterForm.value.item.storyPictureList = [];
      storySplitForm.value.item.storyChapterList.push(storyChapterForm.value.item);
    } else {
      storySplitForm.value.item.storyChapterList[storyChapterForm.value.chapterIndex] =
        storyChapterForm.value.item;
    }
    storyChapterForm.value.viewFlag = false;
  };

  const chapterMoveUp = (index) => {
    if (index > 0) {
      const temp = storySplitForm.value.item.storyChapterList[index - 1];
      storySplitForm.value.item.storyChapterList[index - 1] =
        storySplitForm.value.item.storyChapterList[index];
      storySplitForm.value.item.storyChapterList[index] = temp;
    }
  };
  const removeChapter = (index) => {
    storySplitForm.value.item.storyChapterList.splice(index, 1);
  };

  const getSuccessFileUrlStr = (list) => {
    let urls = '';
    list.forEach((item) => {
      if (item.iw) {
        urls = urls + item.response.result + ' ::' + item.iw + ' ';
      } else {
        urls = urls + item.response.result + ' ';
      }
    });
    return urls;
  };

  const getProcessColor = (processLabel) => {
    if (processLabel === '分镜已完成') {
      return { text: '分镜任务完成', color: '#52c41a', status: 'processing' };
    } else if (processLabel === '角色生成中') {
      return { text: '角色生成中', color: '#ff4d4f', status: 'error' };
    } else if (processLabel === '分镜生成中') {
      return { text: '分镜生成中', color: '#ff4d4f', status: 'warning' };
    } else if (processLabel === '角色任务未启动') {
      return { text: '角色任务未启动', color: '#d9d9d9', status: 'warning' };
    } else {
      return { text: '分镜任务未启动', color: '#d9d9d9', status: 'default' };
    }
  };
</script>

<style scoped>
  .pagination {
    display: flex;
    align-content: center;
    align-items: center;
    height: 53px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent; /* 设置滚动条背景为透明 */
  }


  .color-button {
    border: none;
    background-color: none;
    background-image: linear-gradient(to right, #e82d81, #3fe0b5); /* 从左到右的渐变 */
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%); /* 阴影效果 */
    color: white;
  }

  /* 鼠标悬停按钮效果 */
  .color-button:hover {
    background-image: linear-gradient(to right,  #e82d81, #3fe0b5); /* 鼠标悬停时的渐变变化 */
  }

  /* 按钮点击效果 */
  .color-button2:active {
    transform: translateY(4px); /* 点击时按钮下沉效果 */
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%); /* 点击时的阴影变化 */
  }
</style>
<style lang="less">
  .full-modal {
    .ant-modal {
      top: 0;
      bottom: 0;
      max-width: 100%;
      height: calc(100vh);
      margin: 0;
      padding-bottom: 0;
    }

    .ant-modal-content {
      display: flex;
      flex-direction: column;
      height: calc(100vh);
    }

    .ant-modal-body {
      flex: 1;
    }
  }
</style>
