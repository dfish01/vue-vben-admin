<template>
  <a-layout v-loading="loadingRef" loading-tip="加载中...">
    <a-row class="flex-container">
      <!-- 抽屉部分，仅在移动端显示 -->
      <a-drawer :visible="isDrawerVisible" width="95%" @close="isDrawerVisible = false">
        <a-card style="padding-bottom: 0">
          <a-tabs v-model="activeTab">
            <a-tab-pane key="TextToImg" tab="文生图">
              <TextToImage
                style="text-align: center"
                @startLoading="startLoadingHandler"
                @endLoading="endLoadingHandler"
              />
            </a-tab-pane>
            <a-tab-pane key="MixImage" tab="混图">
              <Blend @startLoading="startLoadingHandler" @endLoading="endLoadingHandler" />
            </a-tab-pane>
            <a-tab-pane key="Describe" tab="解析图">
              <Describe @startLoading="startLoadingHandler" @endLoading="endLoadingHandler" />
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-drawer>

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
                <span style="font-weight: bold">🏢AI绘画工作区</span>-{{ currentSpace.title }}
              </div>
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  justify-content: right;
                  margin-right: 10px;
                  font-size: 15px;
                "
                ><a-tooltip title="🍧导入DISCORD记录，可以将discord的图片导入进来进行管理哦~">
                  <a-button @click="showImportView" style="padding: 0 5px; border-radius: 5px"
                    ><Icon icon="mingcute:discord-line" size="22"
                  /></a-button>
                </a-tooltip>
                <a-tooltip title="🥃工作空间管理，各空间数据隔离，后续可邀请好友加入你的空间~">
                  <a-button
                    @click="showWorkerSpace"
                    style="margin-left: 5px; padding: 0 5px; border-radius: 5px"
                    ><Icon icon="material-symbols:space-dashboard-outline" size="22"
                  /></a-button>
                </a-tooltip>
              </div>
            </div>
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
              />
            </a-tab-pane>
            <a-tab-pane key="Describe" tab="🌑解析图">
              <Describe
                @startLoading="startLoadingHandler"
                @endLoading="endLoadingHandler"
                :spaceId="currentSpace.id"
              />
            </a-tab-pane>
            <a-tab-pane key="other" disabled tab="🎎其它" />
          </a-tabs>
        </a-card>
      </a-col>

      <a-col class="right-content">
        <a-content>
          <JobList
            :spaceId="currentSpace.id"
            ref="jobListRef"
            @openDrawer="isDrawerVisible = true"
          />
        </a-content>
      </a-col>
    </a-row>
    <div>
      <a-modal width="80%" v-model:visible="isShowWorkSpace" title="工作空间管理">
        <template #footer>
          <a-button key="submit" :loading="compState.loading" @click="closeWorkSpace"
            >暂不操作</a-button
          >
        </template>
        <a-spin :spinning="compState.loading" tip="数据加载中...">
          <a-card :bodyStyle="{ padding: '0px 10px 6px ' }">
            <!-- <div style="width: 100%; overflow-x: auto"> -->
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
                title="工作空间名称"
                dataIndex="title"
                key="title"
                align="center"
                width="150px"
              />
              <a-table-column title="备注" dataIndex="remark" key="remark" align="center" />

              <a-table-column
                title="创建时间"
                dataIndex="gmtCreate"
                key="gmtCreate"
                align="center"
              />

              <a-table-column title="操作" key="actions" style="width: 150px">
                <template #default="{ record }">
                  <a-button-group>
                    <a-popconfirm
                      title="删除后该空间图片将丢失（目前暂未做迁移逻辑），是否确认删除?"
                      ok-text="确认删除"
                      cancel-text="取消"
                      @confirm="deleteHandle(record.id)"
                    >
                      <a-button type="primary" danger v-if="record.defaultFlag === 'N'"
                        >删除</a-button
                      >
                    </a-popconfirm>
                    <a-button
                      type="primary"
                      @click="addUserSpace(record)"
                      v-if="record.defaultFlag === 'N'"
                      >编辑</a-button
                    >
                    <a-button @click="selectSpace(record)">选择</a-button>
                  </a-button-group>
                </template>
              </a-table-column>
            </a-table>
          </a-card>
        </a-spin>
      </a-modal>
    </div>
    <div>
      <a-modal
        style="width: 300px"
        ok-text="提交"
        @ok="onSubmitUserSpace"
        v-model:visible="isShowUserSpaceSave"
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

    <!-- Discord数据导入弹窗  -->
    <div>
      <a-modal
        v-model:visible="importForm.viewFlag"
        title="🔥导入Discord数据"
        :confirmLoading="importForm.loading"
        @ok="importDiscordMessage()"
      >
        <a-spin :spinning="importForm.loading">
          <a-card
            :bordered="false"
            :bodyStyle="{
              padding: '10px 15px',
              width: '100%',
              'align-items': 'center',
              'font-size': '10px',
            }"
          >
            <a-row style="padding: 15px">
              <a-col span="24">
                <span style="font-size: 10"
                  >📌
                  只能选自有的DISCORD账号！如果channel没找到的话，请去账户管理同步Discord更新下！并刷新当前页面！</span
                >
              </a-col>
            </a-row>
            <a-row :gutter="[0, 2]" type="flex">
              <a-col flex="120px">
                <a-tag class="quality-tag" color="default">🍺导入空间 </a-tag>
              </a-col>
              <a-col flex="auto">
                <a-select
                  v-model:value="importForm.spaceId"
                  style="width: 100%"
                  placeholder="请选择导入空间"
                  :options="importForm.spaceOptions"
                />
              </a-col>
            </a-row>
            <!-- <a-row :gutter="[0, 2]" type="flex" style="margin-top: 7px">
              <a-col flex="80px">
                <a-tag class="quality-tag" color="default">🍋执行账号 </a-tag>
              </a-col>
              <a-col flex="auto">
                <a-select
                  @change="handleSelectAccount"
                  style="width: 100%; height: 32px"
                  v-model:value="importForm.accountId"
                  :options="importForm.accountOptions"
                />
              </a-col>
            </a-row> -->
            <a-row :gutter="[0, 2]" type="flex" style="margin-top: 7px">
              <a-col flex="120px">
                <a-tag class="quality-tag" color="default">🍋Discord账号 </a-tag>
              </a-col>
              <a-col flex="auto">
                <a-select
                  @change="onSelectDiscordUser"
                  style="width: 100%; height: 32px"
                  v-model:value="importForm.discordUserId"
                  :options="importForm.discordUserOptions"
                  placeholder="请选择Discord账号"
                />
              </a-col>
            </a-row>
            <a-row :gutter="[0, 2]" type="flex" style="margin-top: 7px">
              <a-col flex="120px">
                <a-tag class="quality-tag" color="default">🍵同步服务器 </a-tag>
              </a-col>
              <a-col flex="auto">
                <a-select
                  @change="onSelectGuild"
                  style="width: 100%; height: 32px"
                  v-model:value="importForm.guildId"
                  :options="importForm.guildOptions"
                  placeholder="请选择执行的服务器"
                />
              </a-col>
            </a-row>
            <a-row :gutter="[0, 2]" type="flex" style="margin-top: 7px">
              <a-col flex="120px">
                <a-tag class="quality-tag" color="default">🍥同步频道 </a-tag>
              </a-col>
              <a-col flex="auto">
                <a-select
                  v-model:value="importForm.channelId"
                  style="width: 100%"
                  placeholder="请选择ChannelId"
                  :options="importForm.channelOptions"
                />
              </a-col>
            </a-row>
          </a-card>
        </a-spin>
      </a-modal>
    </div>
  </a-layout>
</template>

<script lang="ts" setup>
  import JobList from './JobList.vue';
  import Icon from '/@/components/Icon/Icon.vue';
  import Blend from './Blend.vue';
  import { ref, onMounted, reactive } from 'vue';
  import TextToImage from './TextToImg.vue';
  import Describe from './Describe.vue';
  import {
    RightOutlined,
    LeftOutlined,
    SettingOutlined,
    ClusterOutlined,
  } from '@ant-design/icons-vue';
  import {
    saveUserSpace,
    deleteSpace,
    allUserSpace,
    importMessage,
    channelList,
  } from '/@/api/df/workSpace';

  import {
    WorkSpaceListResp,
    WorkSpaceSaveReq,
    ImportDiscordMessageReq,
    DiscordChannel,
  } from '/@/api/df/model/workSpaceModel';
  import { availableList } from '/@/api/df/account';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { discordApi } from './discord';

  const { createMessage, createSuccessModal, createErrorModal, createInfoModal } = useMessage();
  const {
    importFormRef,
    importForm,
    showImportView,
    onSelectDiscordUser,
    onSelectGuild,
    queryDiscordList,
  } = discordApi();
  const userStore = useUserStore();

  const route = useRoute();

  const activeTab = ref(route.query.activeTab || 'TextToImageForm');
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

  //===================================== 导入discod记录 ================================
  onMounted(async () => {
    await queryDiscordList();
  });

  const importDiscordMessage = async () => {
    if (importForm.value.spaceId === '') {
      createMessage.error('请选择导入空间！');
      return;
    }
    if (importForm.value.discordUserId === '') {
      createMessage.error('请选择Discord账号！');
      return;
    }
    if (importForm.value.discordUserId === '') {
      createMessage.error('请选择同步服务器！');
      return;
    }
    if (importForm.value.channelId === '') {
      createMessage.error('请选择同步频道！');
      return;
    }
    importForm.value.loading = true;
    console.log('---------------------------------');
    try {
      await importMessage({
        accountId: importForm.value.accountId,
        spaceId: importForm.value.spaceId,
        discordUserId: importForm.value.discordUserId,
        guildId: importForm.value.guildId,
        channelId: importForm.value.channelId,
      });
      importForm.value.viewFlag = false;
      createMessage.success('消息导入成功！请到相关空间查看！');
    } finally {
      importForm.value.loading = false;
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
  //工作空间列表
  const querySpace = async () => {
    compState.loading = true;
    try {
      const response = await allUserSpace({});
      console.log(response);
      tableData.value = response;
      // 使用 map 方法转换数组
      const transformedList = response.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
      const finalList = [{ label: '请选择导入空间', value: '' }, ...transformedList];
      importForm.value.spaceOptions = finalList;
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
    await deleteSpace({ id });
    querySpace();
  };
</script>

<style scoped>
  .flex-container {
    display: flex;
    position: relative;
  }

  .left-menu {
    position: relative;
    flex: 0 0 370px;
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
