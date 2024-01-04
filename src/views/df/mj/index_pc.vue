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
                <span style="font-weight: bold">🏢绘画工作区</span>-{{
                  accountForm.currentSpaceTitle
                }}
              </div>
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  justify-content: right;
                  margin-right: 10px;
                  font-size: 15px;
                "
              >
                <a-button-group>
                  <a-tooltip title="🥤系统相关操作说明以及Midjouney教程文档库 ~">
                    <a-button
                      @click="openTutorialView"
                      style="padding: 5px"
                      v-if="systemInfoForm.tutorialInfo"
                      ><SvgIcon name="jiaocheng"
                    /></a-button>
                  </a-tooltip>
                  <a-tooltip title="🍸相关问题、建议、优化等可群内留言或者私聊群主 ~">
                    <a-button
                      @click="openCommunicateView"
                      style="padding: 5px"
                      v-if="systemInfoForm.groupInfo"
                      ><SvgIcon name="QQ"
                    /></a-button>
                  </a-tooltip>
                  <a-tooltip title="🍧导入DISCORD记录，可以将discord的图片导入进来进行管理哦~">
                    <a-button @click="showImportView" style="padding: 5px"
                      ><SvgIcon name="discord"
                    /></a-button>
                  </a-tooltip>
                  <a-tooltip title="🥃工作空间管理，各空间数据隔离，后续可邀请好友加入你的空间~">
                    <a-button @click="showWorkerSpace" style="padding: 0 5px"
                      ><SvgIcon name="space"
                    /></a-button>
                  </a-tooltip>
                </a-button-group>
              </div>
            </div>
          </template>

          <a-tabs class="edit-tab" v-model="activeTab">
            <a-tab-pane key="TextToImg">
              <template #tab>
                <span>
                  <Icon
                    icon="streamline-emojis:robot-face-1"
                    style="margin: 0"
                    aria-hidden="true"
                  />
                  <b>文生图</b>
                </span>
              </template>
              <TextToImage
                style="text-align: center"
                @startLoading="startLoadingHandler"
                @endLoading="endLoadingHandler"
              />
            </a-tab-pane>
            <a-tab-pane key="MixImage">
              <template #tab>
                <span>
                  <Icon
                    icon="streamline-emojis:robot-face-2"
                    style="margin: 0"
                    aria-hidden="true"
                  />
                  <b>混图</b>
                </span>
              </template>
              <Blend @startLoading="startLoadingHandler" @endLoading="endLoadingHandler" />
            </a-tab-pane>
            <a-tab-pane key="Describe">
              <template #tab>
                <span>
                  <Icon
                    icon="streamline-emojis:robot-face-3"
                    style="margin: 0"
                    aria-hidden="true"
                  />
                  <b>解析图</b>
                </span>
              </template>

              <Describe @startLoading="startLoadingHandler" @endLoading="endLoadingHandler" />
            </a-tab-pane>
            <a-tab-pane key="other" disabled tab="🎎其它" />
          </a-tabs>
        </a-card>
      </a-col>

      <a-col class="right-content">
        <a-content>
          <JobList ref="jobListRef" @openDrawer="isDrawerVisible = true" />
        </a-content>
      </a-col>
    </a-row>
    <div>
      <a-modal width="80%" v-model:open="isShowWorkSpace" title="🏢工作空间管理">
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
                      <a-button type="primary" danger v-if="record.sort != 0">删除</a-button>
                    </a-popconfirm>
                    <a-button
                      type="warning"
                      @click="addUserSpace(record)"
                      v-if="record.defaultFlag === 'N'"
                      >编辑</a-button
                    >
                    <a-button
                      :loading="compState.loading"
                      @click="doSetTop(record)"
                      v-if="record.sort != 0"
                      >置顶</a-button
                    >

                    <a-button @click="selectSpace(record)">选择</a-button>
                    <a-button type="primary" @click="doGenCode(record, 'topRight')"
                      >生成编码</a-button
                    >
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

    <!-- Discord数据导入弹窗  -->
    <div>
      <a-modal
        v-model:open="importForm.viewFlag"
        :confirmLoading="importForm.loading"
        @ok="importDiscordMessage()"
      >
        <template #title>
          <span> <Icon icon="streamline-emojis:fire" size="20" /> 导入Discord数据 </span>
        </template>
        <a-spin :spinning="importForm.loading" tip="正在处理...">
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
                <Icon icon="streamline-emojis:beaming-face-with-smiling-eyes" size="22" />
                <span style="font-size: 13px">
                  导入权限控制在<b>主账号</b>这边!
                  授权账号需要导入的话，需生成<b>授权空间码</b>给主账号进行导入。如果channel没找到的话，请去账户管理同步Discord更新下！并刷新当前页面！</span
                >
              </a-col>
            </a-row>
            <a-row :gutter="[0, 2]" type="flex">
              <a-segmented
                v-model:value="importForm.importMode"
                @change="changeImportMode()"
                :options="importForm.modeOptions"
              >
                <template #label="{ payload }">
                  <div style="padding: 4px">
                    <div>{{ payload.title }}</div>
                  </div>
                </template>
              </a-segmented>
            </a-row>

            <a-row
              :gutter="[0, 2]"
              type="flex"
              style="margin-top: 7px"
              v-if="importForm.importMode === 'owner'"
            >
              <a-col flex="120px">
                <a-tag class="quality-tag" color="default"
                  ><Icon icon="streamline-emojis:ant" size="22" />导入空间
                </a-tag>
              </a-col>
              <a-col flex="auto">
                <a-select
                  v-model:value="importForm.spaceId"
                  style="width: 100%"
                  placeholder="请选择导入空间"
                  :options="accountViewForm.spaceOptions"
                />
              </a-col>
            </a-row>

            <a-row :gutter="[0, 2]" type="flex" style="margin-top: 7px" v-else>
              <a-col flex="120px">
                <a-tag class="quality-tag" color="default"
                  ><Icon icon="streamline-emojis:anchor" size="22" />空间编码
                </a-tag>
              </a-col>

              <a-col flex="auto">
                <a-input v-model:value="importForm.spaceCode" placeholder="导入的空间编码" />
              </a-col>
            </a-row>
            <a-divider style="margin: 10px 0" />

            <a-row :gutter="[0, 2]" type="flex" style="margin-top: 7px">
              <a-col flex="120px">
                <a-tag class="quality-tag" color="default"
                  ><Icon icon="streamline-emojis:beer-mug" size="22" />执行账户
                </a-tag>
              </a-col>
              <a-col flex="auto">
                <a-select
                  @change="onSelectAccount"
                  style="width: 100%; height: 32px"
                  v-model:value="importForm.accountId"
                  :options="importForm.accountOptions"
                  placeholder="请选择账户组"
                />
              </a-col>
            </a-row>
            <a-row :gutter="[0, 2]" type="flex" style="margin-top: 7px">
              <a-col flex="120px">
                <a-tag class="quality-tag" color="default"
                  ><Icon icon="streamline-emojis:hot-beverage-2" size="22" />Discord账号
                </a-tag>
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
                <a-tag class="quality-tag" color="default"
                  ><Icon icon="streamline-emojis:snail" size="22" />同步服务器
                </a-tag>
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
                <a-tag class="quality-tag" color="default"
                  ><Icon icon="streamline-emojis:rooster" size="22" />同步频道
                </a-tag>
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
  </a-layout>
</template>

<script lang="ts" setup>
  import JobList from './JobList.vue';
  import Icon from '/@/components/Icon/Icon.vue';
  import { SvgIcon } from '/@/components/Icon';
  import Blend from './Blend.vue';
  import { ref, onMounted, reactive } from 'vue';
  import TextToImage from './TextToImg.vue';
  import Describe from './Describe.vue';
  import { MarkdownViewer } from '/@/components/Markdown';
  import {
    RadiusUpleftOutlined,
    RadiusUprightOutlined,
    RadiusBottomleftOutlined,
    RadiusBottomrightOutlined,
    BorderTopOutlined,
    BorderBottomOutlined,
    RightOutlined,
    LeftOutlined,
    SettingOutlined,
    ClusterOutlined,
  } from '@ant-design/icons-vue';
  import { notification } from 'ant-design-vue';
  import { downloadImage, copyText } from './tools';
  import { accountInfoApi } from './accountInfo';
  import { addSuggest, communicateInfo, tutorialInfo, systemInfo } from '/@/api/df/utils';
  import type { NotificationPlacement } from 'ant-design-vue';
  import {
    saveUserSpace,
    deleteSpace,
    allUserSpace,
    importMessage,
    channelList,
    genCode,
    setTop,
  } from '/@/api/df/workSpace';

  import {
    WorkSpaceListResp,
    WorkSpaceSaveReq,
    ImportDiscordMessageReq,
    DiscordChannel,
  } from '/@/api/df/model/workSpaceModel';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { discordApi } from './discord';
  import { spaceInfoApi, systemInfoApi } from './index';

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
  const { createMessage, createSuccessModal, createErrorModal, createInfoModal } = useMessage();
  const {
    importFormRef,
    importForm,
    showImportView,
    onSelectDiscordUser,
    onSelectGuild,
    onSelectAccount,
    queryDiscordList,
    queryAccountList,
  } = discordApi();

  const userStore = useUserStore();

  const route = useRoute();

  const activeTab = ref(route.query.activeTab || 'TextToImageForm');
  const loadingRef = ref(false);
  const jobListRef = ref();
  const isDrawerVisible = ref(false);
  const isMobile = ref(window.innerWidth < 768);
  const showTabs = ref(true);

  const toggleTabs = () => {
    showTabs.value = !showTabs.value;
  };

  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768;
  });

  const startLoadingHandler = () => {
    // loadingRef.value = true;
    if (jobListRef.value) {
      jobListRef.value.onSearch();
    }
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
    await queryAccountList();
    loadSystemInfoConfig();
  });

  const changeImportMode = () => {
    importForm.value.spaceId = null;
  };

  const importDiscordMessage = async () => {
    if (importForm.value.importMode === 'other' && importForm.value.spaceCode === '') {
      createMessage.error('请输入空间编码！');
      return;
    }
    if (importForm.value.importMode === 'owner' && importForm.value.spaceId === '') {
      createMessage.error('请选择导入空间！');
      return;
    }
    if (importForm.value.spaceId === '') {
      createMessage.error('请选择导入账户！');
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
    try {
      await importMessage({
        importMode: importForm.value.importMode,
        spaceCode: importForm.value.spaceCode,
        spaceId: importForm.value.spaceId,
        accountId: importForm.value.accountId,

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
    loadSystemInfoConfig();
  });
</script>

<style scoped>
  @media screen and (max-width: 3048px) {
    .left-menu {
      position: relative;
      flex: 0 0 450px;
    }
  }

  @media screen and (max-width: 2260px) {
    .left-menu {
      position: relative;
      flex: 0 0 400px;
    }
  }

  @media screen and (max-width: 1680px) {
    .left-menu {
      position: relative;
      flex: 0 0 370px;
    }
  }

  .flex-container {
    display: flex;
    position: relative;
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
