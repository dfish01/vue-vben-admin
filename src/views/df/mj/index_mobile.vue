<template>
  <a-layout v-loading="loadingRef" loading-tip="加载中...">
    <a-row class="flex-container">
      <a-col style="width: 100%">
        <a-sider theme="light">
          <a-card
            :bordered="true"
            class="no-padding-header ar-card"
            :bodyStyle="{ padding: '1px 0px 1px 0px', width: '100%' }"
            :headStyle="{ padding: '0px' }"
          >
            <template #title>
              <div style="height: 50px">
                <a-row
                  ref="formRef"
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 50px;
                    padding: 0 10px;
                  "
                >
                  <div style="display: flex; align-items: center">
                    <a-image src="/logo.png" :width="38" :height="38" :preview="false" />
                    <span style="margin-left: 5px; font-size: 16px; font-weight: bold">
                      AI工作区 -
                    </span>
                    <span> {{ accountForm.currentSpaceTitle }}</span>
                  </div>
                  <div style="display: flex; gap: 5px">
                    <a-button-group>
                      <a-tooltip title="任务列表">
                        <a-button @click="showJobList" style="padding: 5px" ref="jobLstStep">
                          <SvgIcon name="task-list" size="20" />
                        </a-button>
                      </a-tooltip>
                      <a-tooltip title="">
                        <a-button
                          v-if="systemInfoForm.groupInfo"
                          @click="openCommunicateView"
                          style="padding: 5px"
                        >
                          <SvgIcon name="QQ" size="20" />
                        </a-button>
                      </a-tooltip>
                      <a-tooltip title="🥤系统相关操作说明以及Midjouney教程文档库 ~">
                        <a-button ref="teachStep" @click="openNewWindow" style="padding: 5px"
                          ><SvgIcon name="jiaocheng"
                        /></a-button>
                      </a-tooltip>
                      <a-tooltip title="🥤系统相关操作说明以及Midjouney教程文档库 ~" v-if="false">
                        <a-button
                          @click="openTutorialView"
                          style="padding: 5px"
                          v-if="systemInfoForm.tutorialInfo"
                          ><SvgIcon name="jiaocheng" size="20"
                        /></a-button>
                      </a-tooltip>

                      <a-tooltip title="工作空间管理">
                        <a-button @click="showWorkerSpace" style="padding: 5px" ref="workspaceStep">
                          <SvgIcon name="space" size="20" />
                        </a-button>
                      </a-tooltip>
                    </a-button-group>
                  </div>
                </a-row>
              </div>
            </template>

            <a-card
              style="margin: 2px 0"
              :bordered="false"
              :bodyStyle="{ padding: '2px 3px 2px 3px' }"
            >
              <a-segmented block v-model:value="tabValue" :options="tabOptions" style="width: 100%">
                <template #label="{ payload }">
                  <div style="padding: 4px">
                    <div>
                      <Icon :icon="payload.icon" style="margin: 0" aria-hidden="true" />{{
                        payload.subTitle
                      }}
                    </div>
                  </div>
                </template>
              </a-segmented>
            </a-card>

            <Describe
              v-if="tabValue === 'desc'"
              @startLoading="startLoadingHandler"
              @endLoading="endLoadingHandler"
            />
            <Blend
              v-if="tabValue === 'blend'"
              @startLoading="startLoadingHandler"
              @endLoading="endLoadingHandler"
            />
            <TextToImage
              v-if="tabValue === 'TextToImageForm'"
              ref="textToImageRef"
              style="text-align: center"
              @startLoading="startLoadingHandler"
              @endLoading="endLoadingHandler"
            />
          </a-card>
        </a-sider>
      </a-col>
    </a-row>
    <div>
      <a-modal width="100%" v-model:open="isShowWorkSpace" title="工作空间管理">
        <a-spin :spinning="compState.loading" tip="数据加载中...">
          <a-card :bodyStyle="{ padding: '0px' }" :bordered="false">
            <a-button
              type="primary"
              class="editable-add-btn"
              style="margin-top: 8px; margin-bottom: 8px; margin-left: 5px"
              @click="addUserSpace(null)"
              >新增</a-button
            >

            <a-table
              :dataSource="tableData"
              rowKey="id"
              :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
              :scroll="{ x: 'max-content', y: 380 }"
              :pagination="false"
              size="small"
            >
              <a-table-column title="记录id" dataIndex="id" key="id" v-if="false" align="center" />
              <a-table-column
                title="工作空间"
                dataIndex="title"
                key="title"
                align="center"
                style="width: 200"
              />
              <a-table-column
                title="备注"
                dataIndex="remark"
                v-if="false"
                key="remark"
                align="center"
              />

              <a-table-column
                title="创建时间"
                dataIndex="gmtCreate"
                key="gmtCreate"
                align="center"
                v-if="false"
              />

              <a-table-column title="操作" key="actions" width="99">
                <template #default="{ record }">
                  <a-button-group>
                    <!-- <a-popconfirm
                      title="删除后该空间图片将丢失（目前暂未做迁移逻辑），是否确认删除?"
                      ok-text="确认删除"
                      cancel-text="取消"
                      @confirm="deleteHandle(record.id)"
                    >
                      <a-button type="primary" danger v-if="record.sort != 0">删除</a-button>
                    </a-popconfirm>
                    <a-button type="primary" @click="addUserSpace(record)" size="small"
                      >编辑</a-button
                    > -->

                    <a-button @click="selectSpace(record)" size="small">选择</a-button>

                    <a-button
                      size="small"
                      type="warning"
                      :loading="compState.loading"
                      @click="doSetTop(record)"
                      v-if="record.sort != 0"
                      >置顶</a-button
                    >

                    <a-button type="primary" size="small" @click="doGenCode(record, 'topRight')"
                      >编码</a-button
                    >
                  </a-button-group>
                </template>
              </a-table-column>
            </a-table>
          </a-card>
        </a-spin>
        <template #footer>
          <a-button key="submit" :loading="compState.loading" @click="closeWorkSpace"
            >暂不操作</a-button
          >
        </template>
      </a-modal>
    </div>
    <div>
      <a-modal
        style="width: 90%"
        ok-text="提交"
        @ok="onSubmitUserSpace"
        v-model:open="isShowUserSpaceSave"
        title="工作空间保存"
      >
        <a-spin size="small" :spinning="compState.loading">
          <a-card>
            <a-form :model="userSpaceForm" layout="vertical" ref="userSpaceFormRef">
              <a-row gutter="24">
                <a-col :span="24">
                  <a-form-item
                    label="工作空间名"
                    :rules="[
                      {
                        required: true,
                        message: '工作空间名是必填项',
                      },
                    ]"
                    name="title"
                  >
                    <a-input v-model:value="userSpaceForm.title" placeholder="输入空间名称" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row gutter="24">
                <a-col :span="24">
                  <a-form-item label="备注">
                    <a-textarea
                      v-model:value="userSpaceForm.remark"
                      placeholder="请输入备注~"
                      allow-clear
                      :maxlength="128"
                      :auto-size="{ minRows: 3, maxRows: 5 }"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-card>
        </a-spin>
        <template #footer>
          <a-button @click="onSubmitUserSpace" :loading="compState.loading" type="primary"
            >提交</a-button
          >
        </template>
      </a-modal>
    </div>

    <!-- 交流群 -->
    <a-modal v-model:open="viewForm.viewFlag" :title="viewForm.title">
      <template #footer>
        <a-button key="back" @click="closeView">我已知晓</a-button>
      </template>
      <a-spin size="small" :spinning="viewForm.loading">
        <a-row>
          <a-col :span="24" style="display: flex; justify-content: center">
            <MarkdownViewer :value="viewForm.content" />
          </a-col>
        </a-row>
      </a-spin>
    </a-modal>
    <div class="custom-tour">
      <a-tour
        :open="indexStep.open"
        :steps="indexStep.steps"
        @change="changeStep"
        @close="indexStepOpen(false)"
        :width="100"
      />
    </div>
  </a-layout>
</template>

<script lang="ts" setup>
  import Blend from './mobile/Blend.vue';
  import { ref, onMounted, reactive, nextTick, computed, provide } from 'vue';
  import TextToImage from './mobile/TextToImg.vue';
  import Icon from '/@/components/Icon/Icon.vue';
  import { SvgIcon } from '/@/components/Icon';
  import Describe from './mobile/Describe.vue';
  import { MarkdownViewer } from '/@/components/Markdown';
  import { SettingOutlined, CloudSyncOutlined, ClusterOutlined } from '@ant-design/icons-vue';
  import { WorkSpaceListResp, WorkSpaceSaveReq } from '/@/api/df/model/workSpaceModel'; // 请替换为您的请求模型路径
  import { userStep } from '/@/api/df/user';
  import {
    saveUserSpace,
    deleteSpace,
    allUserSpace,
    importMessage,
    channelList,
    genCode,
    setTop,
  } from '/@/api/df/workSpace';
  import { downloadImage, copyText } from './tools';
  import { addSuggest, communicateInfo, tutorialInfo, systemInfo } from '/@/api/df/utils';
  import { useGo } from '/@/hooks/web/usePage';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { notification } from 'ant-design-vue';
  import type { NotificationPlacement } from 'ant-design-vue';
  import { accountInfoApi } from './accountInfo';
  import { spaceInfoApi, systemInfoApi } from './index';
  import { getCustomCache, setCustomCache } from '/@/utils/custom';
  import { MJ_DRAW_MOBILE_TOUR } from '/@/enums/cacheEnum';

  const {
    accountForm,
    accountViewForm,
    initAccountList,
    initAccountInfo,
    doGetChannelsByGroup,
    handleAccountSetting,
    handleSetting,
  } = accountInfoApi();
  const {
    tableData,
    isShowWorkSpace,
    isShowUserSpaceSave,
    userSpaceFormRef,
    compState,
    doSetTop,
    querySpace,
    doGenCode,
    userSpaceForm,
    showWorkerSpace,
    closeWorkSpace,
    selectSpace,
    addUserSpace,
    onSubmitUserSpace,
    deleteHandle,
  } = spaceInfoApi();
  const {
    systemInfoForm,
    viewForm,
    loadSystemInfoConfig,
    openCommunicateView,
    closeView,
    openTutorialView,
  } = systemInfoApi();
  // 使用 ref 包装，以确保 computed 可以正确监听变化
  const route = useRoute();
  const activeTab = ref(route.query.activeTab || 'TextToImageForm');
  const go = useGo();
  const loadingRef = ref(false);
  const jobListRef = ref();
  const isMobile = ref(window.innerWidth < 768);
  const showTabs = ref(true);

  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768;
  });

  const startLoadingHandler = () => {
    loadingRef.value = true;
  };

  const endLoadingHandler = () => {
    setTimeout(() => {
      loadingRef.value = false;
    }, 2);
    if (jobListRef.value) {
      jobListRef.value.onSearch();
    } else {
      console.warn('jobListRef is not yet initialized');
    }
  };

  onMounted(async () => {
    await initAccountInfo();
    if (tableData.value.length > 1) {
      return;
    }
    await querySpace();
    if (accountForm.currentSpaceId === null) {
      const item = tableData.value[0];
      accountForm.currentSpaceId = item.id;
      accountForm.currentSpaceTitle = item.title;
    }
    await loadSystemInfoConfig();
    //引导
    await nextTick();
    indexStepOpen(true);
  });

  const showJobList = () => {
    // go('/jobList/index/' + currentSpace.id + '/' + currentSpace.title);
    // go('/jobList/index?spaceId=' + currentSpace.id + '&spaceTitle=' + currentSpace.title);
    go('/jobList/index');
  };

  //课程
  const openNewWindow = () => {
    window.open('https://www.midjourneyers.com', '_blank');
  };

  /************************漫游引导********************** */
  const jobLstStep = ref(null);
  const workspaceStep = ref(null);

  const indexStep = ref({
    open: false,
    current: 0,
    steps: [
      {
        title: '工作空间',
        description: '每个空间的任务相互独立，类似Discord的频道，方便你们管理图片。',
        placement: 'bottom',
        target: () => workspaceStep.value && workspaceStep.value.$el,
      },
      {
        title: '任务列表',
        description: '提交后的空间任务都在这里哦，如果点进去没发现任务请确认是否选对了任务空间',
        placement: 'bottom',
        target: () => jobLstStep.value && jobLstStep.value.$el,
      },
      {
        title: '任务列表',
        description: '提交后的空间任务都在这里哦，如果点进去没发现任务请确认是否选对了任务空间',
        placement: 'bottom',
      },
    ],
  });

  const textToImageRef = ref();
  const indexStepOpen = (val: boolean): void => {
    // if (val === true) {
    //   const needShow = getCustomCache(MJ_DRAW_MOBILE_TOUR);
    //   if (needShow && needShow === true) {
    //     return;
    //   }
    //   setCustomCache(MJ_DRAW_MOBILE_TOUR, true);
    // }
    indexStep.value.open = val;
  };
  const changeStep = (current: number): void => {
    if (current === 2) {
      indexStep.value.open = false;
      textToImageRef.value.textToImageStepOpen(true);
    }
  };

  //***********************  tab  ***************************** */
  const tabOptions = ref([
    {
      value: 'TextToImageForm',
      payload: {
        icon: 'streamline-emojis:robot-face-1',
        subTitle: '文生图',
      },
    },
    {
      value: 'blend',
      payload: {
        icon: 'streamline-emojis:robot-face-2',
        subTitle: '混合图',
      },
    },
    {
      value: 'desc',
      payload: {
        icon: 'streamline-emojis:robot-face-3',
        subTitle: '解析图',
      },
    },
    // {
    //   value: 'other',
    //   payload: {
    //     icon: '🎎',
    //     subTitle: '🎎待开发',
    //   },
    // },
  ]);
  const tabValue = ref('TextToImageForm');
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
    width: 300px !important;
  }

  .custom-tour ::v-deep .ant-tour {
    width: 300px !important;
  }

  .custom-tour ::v-deep .ant-tour-content {
    width: 300px !important;
  }

  .custom-tour >>> .ant-tour-content {
    width: 300px !important;
  }

  :deep(.ant-tour-content) {
    width: 300px !important;
  }

  ::v-deep .ant-tour-content {
    width: 300px !important;
  }

  :global(.ant-tour-content) {
    width: 350px !important;
  }
</style>
