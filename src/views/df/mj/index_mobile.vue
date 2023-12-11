<template>
  <a-layout v-loading="loadingRef" loading-tip="加载中...">
    <a-row class="flex-container">
      <a-col style="width: 100%">
        <a-sider theme="light">
          <a-card
            :bordered="true"
            class="no-padding-header ar-card"
            :bodyStyle="{ padding: '1px 10px 1px 10px', width: '100%' }"
            :headStyle="{ padding: '0px' }"
          >
            <template #title>
              <a-card :bodyStyle="{ padding: 0, height: '50px' }">
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
                    <a-image src="./logo.png" :width="38" :height="38" :preview="false" />
                    <span style="margin-left: 5px; font-size: 16px; font-weight: bold"
                      >AI工作区</span
                    >-{{ currentSpace.title }}
                  </div>
                  <div style="display: flex; gap: 5px">
                    <a-tooltip title="">
                      <a-button
                        @click="openCommunicateView"
                        style="padding: 0 6px; border-radius: 5px"
                      >
                        <SvgIcon name="QQ" />
                      </a-button>
                    </a-tooltip>
                    <a-tooltip title="任务列表">
                      <a-button @click="showJobList" style="padding: 0 5px; border-radius: 5px">
                        <SvgIcon name="task-list" />
                      </a-button>
                    </a-tooltip>
                    <a-tooltip title="工作空间管理">
                      <a-button @click="showWorkerSpace" style="padding: 0 5px; border-radius: 5px">
                        <SvgIcon name="space" />
                      </a-button>
                    </a-tooltip>
                  </div>
                </a-row>
              </a-card>
            </template>

            <a-tabs class="edit-tab" v-model="activeTab">
              <a-tab-pane key="TextToImg" tab="🌕文生图">
                <TextToImage
                  style="text-align: center"
                  @startLoading="startLoadingHandler"
                  @endLoading="endLoadingHandler"
                  :spaceId="currentSpace.id"
                />
              </a-tab-pane>
              <a-tab-pane key="MixImage" tab="🌗混图">
                <Blend
                  @startLoading="startLoadingHandler"
                  @endLoading="endLoadingHandler"
                  :spaceId="currentSpace.id"
                  style="width: 100%"
                />
              </a-tab-pane>
              <a-tab-pane key="Describe" tab="🌑解析图">
                <Describe
                  @startLoading="startLoadingHandler"
                  @endLoading="endLoadingHandler"
                  :spaceId="currentSpace.id"
                  style="width: 100%"
                />
              </a-tab-pane>
              <a-tab-pane key="other" disabled tab="🎎其它" />
            </a-tabs>
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
    <a-modal
      v-model:open="communicateForm.viewFlag"
      title="🐵扫码进群吧~"
      width="100%"
      :bodyStyle="{
        padding: '0',
        display: 'flex',
        'justify-content': 'center',
        'align-item': 'center',
      }"
    >
      <template #footer>
        <a-button key="back" @click="closeCommunicateView">我已知晓</a-button>
      </template>
      <a-spin size="small" :spinning="communicateForm.loading">
        <a-row>
          <a-col :span="24" style="display: flex; justify-content: center">
            <img
              :src="communicateForm.wchatImage"
              @onload="handleImageLoad()"
              width="300"
              alt="微信二维码"
            />
          </a-col>
        </a-row>
      </a-spin>
    </a-modal>
  </a-layout>
</template>

<script lang="ts" setup>
  import Blend from './mobile/Blend.vue';
  import { ref, onMounted, reactive } from 'vue';
  import TextToImage from './mobile/TextToImg.vue';
  import Icon from '/@/components/Icon/Icon.vue';
  import { SvgIcon } from '/@/components/Icon';
  import Describe from './mobile/Describe.vue';
  import { SettingOutlined, CloudSyncOutlined, ClusterOutlined } from '@ant-design/icons-vue';
  import { WorkSpaceListResp, WorkSpaceSaveReq } from '/@/api/df/model/workSpaceModel'; // 请替换为您的请求模型路径
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
  import { addSuggest, communicateInfo } from '/@/api/df/utils';
  import { useGo } from '/@/hooks/web/usePage';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { notification } from 'ant-design-vue';
  import type { NotificationPlacement } from 'ant-design-vue';

  const userStore = useUserStore();

  const route = useRoute();
  const activeTab = ref(route.query.activeTab || 'TextToImageForm');
  const go = useGo();
  const loadingRef = ref(false);
  const jobListRef = ref();
  const isDrawerVisible = ref(false);
  const isMobile = ref(window.innerWidth < 768);
  const showTabs = ref(true);
  const currentSpace = reactive<WorkSpaceSaveReq>({
    id: null,
    title: '',
    remark: '',
  });

  const toggleTabs = () => {
    showTabs.value = !showTabs.value;
  };

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

  //=====================================工作空间相关====================================
  const compState = reactive({
    absolute: true,
    loading: false,
    tip: '加载中...',
  });

  const isShowWorkSpace = ref(false);
  const isShowUserSpaceSave = ref(false);
  const userSpaceFormRef = ref();
  const userSpaceForm = reactive<WorkSpaceSaveReq>({
    id: null,
    title: '',
    remark: '',
  });

  // 主table 数据
  const tableData = ref<WorkSpaceListResp[]>([
    // 更多数据...
  ]);
  //显示工作空间
  const showWorkerSpace = () => {
    isShowWorkSpace.value = true;
    compState.loading = false;
  };

  const closeWorkSpace = () => {
    isShowWorkSpace.value = false;
    compState.loading = false;
  };

  const showJobList = () => {
    console.log('showJobList ' + currentSpace.id);
    // go('/jobList/index/' + currentSpace.id + '/' + currentSpace.title);
    go('/jobList/index?spaceId=' + currentSpace.id + '&spaceTitle=' + currentSpace.title);
    // go({
    //   name: 'JobList', // 路由名称
    //   params: { spaceId: currentSpace.id }, // 路由参数
    //   query: { filter: 'active' }, // 查询参数
    // });
  };

  //工作空间列表
  const querySpace = async () => {
    compState.loading = true;
    try {
      const response = await allUserSpace({});
      console.log(response);
      tableData.value = response;
    } finally {
      compState.loading = false;
    }
  };

  const selectSpace = (item) => {
    currentSpace.title = item.title;
    currentSpace.id = item.id;
    isShowWorkSpace.value = false;

    //缓存
    const setting = {};
    setting['spaceId'] = item.id;
    setting['spaceName'] = item.title;
    userStore.syncSetting(setting);
  };

  onMounted(async () => {
    await querySpace();
    const item = tableData.value[0];
    currentSpace.id = item.id;
    currentSpace.title = item.title;
  });

  const addUserSpace = (item) => {
    if (item) {
      for (let key in userSpaceForm) {
        if (item[key] !== undefined) {
          userSpaceForm[key] = item[key];
        }
      }
    } else {
      console.log(111111);
      userSpaceForm.id = null;
      userSpaceForm.title = '';
      userSpaceForm.remark = '';
    }
    isShowUserSpaceSave.value = true;
  };

  const onSubmitUserSpace = async () => {
    try {
      compState.loading = true;
      await userSpaceFormRef.value.validate();
      console.log('Form is valid, submitting...');
      await saveUserSpace(userSpaceForm);
      isShowUserSpaceSave.value = false;
      querySpace();
    } catch (error) {
      console.log('Form validation failed:', error);
    } finally {
      compState.loading = false;
    }
  };
  const deleteHandle = async (id) => {
    compState.loading = true;
    console.log('Form is valid, submitting...');
    try {
      await deleteSpace({ id });
      querySpace();
    } finally {
      compState.loading = false;
    }
  };

  const doSetTop = async (record) => {
    compState.loading = true;
    try {
      await setTop({ id: record.id });
      querySpace();
    } finally {
      compState.loading = false;
    }
  };

  //显示工作空间
  const doGenCode = async (record, placement: NotificationPlacement) => {
    const result = await genCode({ id: record.id });
    copyText(result);
    notification.open({
      message: '【' + result + '】空间码生成成功！已复制到剪切板~',
      description: '导入的空间编码在5分钟内有效，请及时使用~',
      placement,
    });
  };

  /****************************** 交流群 ******************************** */

  const communicateForm = ref({
    viewFlag: false,
    wchatImage: '',
    loading: false,
    qqGroupList: [] as string[],
  });

  const openCommunicateView = async () => {
    communicateForm.value.loading = true;
    try {
      const resp = await communicateInfo({});
      communicateForm.value.qqGroupList = resp.qqGroupList;
      communicateForm.value.wchatImage = resp.wchatImage;
      communicateForm.value.viewFlag = true;
    } finally {
      setTimeout(() => {
        communicateForm.value.loading = false;
      }, 3000);
    }
  };
  const closeCommunicateView = async () => {
    communicateForm.value.viewFlag = false;
  };
  const handleImageLoad = async () => {
    communicateForm.value.loading = false;
  };
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
</style>
