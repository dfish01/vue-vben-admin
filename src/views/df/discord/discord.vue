<template>
  <a-layout>
    <a-row style="height: 70px">
      <a-col :span="24">
        <a-card
          style="display: flex; align-items: center; height: 100%"
          :bodyStyle="{ padding: '0 5px 0px 24px' }"
        >
          <a-form layout="inline">
            <a-form-item>
              <a-select
                v-model:value="queryForm.discordState"
                placeholder="请选择discord状态"
                style="width: 150px"
              >
                <a-select-option value="NORMAL">正 常</a-select-option>
                <a-select-option value="EXPIRED">TOKEN过期</a-select-option>
                <a-select-option value="VERIFY_HUMAN">验证人类</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                v-model:value="queryForm.mjState"
                placeholder="请选择mj状态"
                style="width: 150px"
              >
                <a-select-option value="NORMAL">正 常</a-select-option>
                <a-select-option value="STOP">订阅过期</a-select-option>
                <a-select-option value="BAN">BAN</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button-group>
                  <a-button @click="onSearch">查询</a-button>
                  <a-button type="primary" @click="showDiscordForm">新增</a-button>
                </a-button-group>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>

    <div style="margin-top: 1px">
      <a-table
        :dataSource="tableData"
        rowKey="id"
        :loading="tableLoading"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
        :scroll="{ x: 'max-content', y: props.contentHeight - 230 }"
        :pagination="false"
      >
        <a-table-column
          title="账户名"
          dataIndex="userName"
          key="userName"
          v-if="false"
          align="center"
          :width="150"
        />
        <a-table-column
          title="全局名"
          dataIndex="globalName"
          key="globalName"
          align="center"
          :width="150"
        />
        <a-table-column title="邮箱" dataIndex="email" key="email" align="center" :width="150" />

        <a-table-column
          title="USE并发"
          dataIndex="useConcurrent"
          key="useConcurrent"
          align="center"
          :width="100"
        >
          <template #default="{ record }">
            {{ record.useConcurrent }}
            <a-popconfirm
              title="重置会将已并发数置为0，并将当前执行中的任务删除，是否确认操作?"
              ok-text="重置"
              cancel-text="取消"
              @confirm="doResetConUse(record.id)"
            >
              <a-button size="small" :loading="discordSettingForm.loading" type="link">
                <Icon icon="material-symbols:refresh"
              /></a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
        <a-table-column
          title="MAX并发"
          dataIndex="maxConcurrent"
          key="maxConcurrent"
          align="center"
          :width="100"
        />
        <a-table-column
          title="Discord状态"
          dataIndex="discordState"
          key="discordState"
          align="center"
          :width="120"
        >
          <template #default="{ text }">
            <a-badge
              :status="getDiscordStateContent(text).status"
              :text="getDiscordStateContent(text).text"
            />
          </template>
        </a-table-column>
        <a-table-column
          title="MJ状态"
          dataIndex="mjState"
          key="mjState"
          align="center"
          :width="100"
        >
          <template #default="{ text }">
            <a-tag :color="getMjStateContent(text).color">{{ getMjStateContent(text).text }}</a-tag>
          </template>
        </a-table-column>
        <a-table-column
          title="MJ套餐"
          dataIndex="mjSubscribe"
          key="mjSubscribe"
          align="center"
          :width="100"
        />

        <a-table-column
          title="用户TOKEN"
          dataIndex="userToken"
          key="userToken"
          align="center"
          :width="120"
        >
          <template #default="{ text }">
            <a-popover placement="top" trigger="click">
              <template #title></template>
              <template #content>
                {{ text }}
                <a-button size="small" @click="() => copyText(text)"
                  ><Icon icon="mynaui:copy" /> 复制</a-button
                >
              </template>
              <a-button size="small">TOKEN</a-button>
            </a-popover>
          </template>
        </a-table-column>
        <a-table-column
          title="异常信息"
          dataIndex="errorMsg"
          key="errorMsg"
          align="center"
          :width="120"
        >
          <template #default="{ record }">
            <a-popover placement="top" trigger="click" v-if="record.mjState !== 'NORMAL'">
              <template #title></template>
              <template #content> {{ record.errorMsg }} </template>
              <a-button size="small" type="primary" danger
                ><Icon
                  icon="fluent-emoji-high-contrast:information"
                  style="margin-right: 1px"
                />异常</a-button
              >
            </a-popover>
            <span v-else>暂无异常</span>
          </template>
        </a-table-column>

        <a-table-column
          title="运行服务器"
          dataIndex="bindServerName"
          key="bindServerName"
          align="center"
          :width="120"
        >
          <template #default="{ text }">
            <a-tag>{{ text }}</a-tag>
          </template>
        </a-table-column>

        <!-- <a-table-column title="异常信息" dataIndex="errorMsg" key="errorMsg" align="center" /> -->

        <a-table-column title="操作" key="actions" fixed="right" :width="200">
          <template #default="{ record }">
            <a-button-group>
              <!-- <a-button @click="showDiscordForm" disabled>概况</a-button> -->
              <a-button @click="showInfoSetting(record)">配置</a-button>
              <a-button type="warning" @click="showDiscordForm(record)" v-if="record.state != 'Y'"
                >刷新TOKEN</a-button
              >
            </a-button-group>
          </template>
        </a-table-column>
      </a-table>
    </div>
    <!-- 构建discord账号 -->
    <a-modal
      v-model:open="discordForm.viewFlag"
      :title="discordForm.title"
      ok-text="立即执行"
      @ok="addDiscord"
      :confirmLoading="discordForm.loading"
    >
      <a-card>
        <a-spin :spinning="discordForm.loading" :tip="discordForm.loadingTitle">
          <a-form :model="discordForm" layout="vertical" ref="discordFormRef">
            <a-row gutter="24">
              <a-col :span="24">
                <a-form-item
                  label="Discord token"
                  :rules="[
                    {
                      required: true,
                      message: 'token不能为空',
                    },
                  ]"
                  name="token"
                >
                  <a-input v-model:value="discordForm.token" placeholder="输入token" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-card>
    </a-modal>

    <!-- 详情更新 -->
    <a-modal
      v-model:open="discordSettingForm.viewFlag"
      title="账号配置"
      ok-text="立即更新"
      @ok="doUpdateConfig"
      :confirmLoading="discordSettingForm.loading"
    >
      <a-card>
        <a-spin :spinning="discordSettingForm.loading" :tip="discordSettingForm.loadingTitle">
          <a-form :model="discordSettingForm" layout="vertical" ref="discordSettingFormRef">
            <a-row gutter="24">
              <a-col :span="24">
                <a-form-item
                  :rules="[
                    {
                      required: true,
                      message: '绑定的服务器是必填项',
                    },
                  ]"
                  name="bindingServerName"
                >
                  <template #label>
                    <span
                      ><Icon
                        icon="file-icons:moment-timezone"
                        class="vel-icon icon"
                        aria-hidden="true"
                      />绑定的服务器
                    </span>
                  </template>
                  <a-select
                    style="width: 100%; height: 32px"
                    placeholder="请选择要绑定的服务器~"
                    v-model:value="discordSettingForm.bindingServerName"
                    :options="discordSettingForm.bindingServerNameOptions"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  :rules="[
                    {
                      required: true,
                      message: '最大并发线程数',
                    },
                  ]"
                  name="maxConcurrent"
                >
                  <template #label>
                    <span
                      ><Icon
                        icon="ic:round-account-tree"
                        class="vel-icon icon"
                        aria-hidden="true"
                      />输入最大并发线程数
                    </span>
                  </template>
                  <a-input
                    v-model:value="discordSettingForm.maxConcurrent"
                    placeholder="输入最大并发线程数"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-card>
    </a-modal>
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, unref, onMounted, defineProps } from 'vue';
  import {
    discordAddToken,
    discordList,
    discordInfo,
    getValidResult,
    getZoneList,
    updateConfig,
    resetConUse,
  } from '/@/api/df/discord';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { copyText as doCopyText } from '/@/utils/copyTextToClipboard';
  import Icon from '/@/components/Icon/Icon.vue';
  import { usePermission } from '/@/hooks/web/usePermission';

  const { hasPermission } = usePermission();

  const { createMessage, createSuccessModal, createErrorModal, createInfoModal } = useMessage();
  const props = defineProps({
    contentHeight: Number, // 你的 prop 类型
  });

  const queryForm = ref({
    discordState: null,
    mjState: null,
  });

  /********************************************* 账号编辑 *********************************************** */
  const discordSettingForm = ref({
    viewFlag: false,
    loading: false,
    loadingTitle: '数据加载中...',

    discordId: null,
    bindingServerName: null,
    maxConcurrent: 3,
    bindingServerNameOptions: [],
  });
  const showInfoSetting = async (discord) => {
    discordSettingForm.value.discordId = discord.id;
    discordSettingForm.value.bindingServerName = discord.bindingServerName;
    discordSettingForm.value.viewFlag = true;
    discordSettingForm.value.maxConcurrent = discord.maxConcurrent;
  };

  const initBindServerNameList = async () => {
    const response = await getZoneList({});

    // 使用 map 方法转换数组
    const transformedList = response.map((item) => ({
      label: item.zoneName + '(' + item.availableNums + ')',
      value: item.zoneName,
    }));
    // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
    const finalList = [...transformedList];
    discordSettingForm.value.bindingServerNameOptions = finalList;
  };

  const discordSettingFormRef = ref(null);
  const doUpdateConfig = async () => {
    discordSettingFormRef.value
      .validate()
      .then(async () => {
        try {
          discordSettingForm.value.loading = true;
          await updateConfig({
            discordId: discordSettingForm.value.discordId,
            bindingServerName: discordSettingForm.value.bindingServerName,
            maxConcurrent: discordSettingForm.value.maxConcurrent,
          });
          discordSettingForm.value.viewFlag = false;
          onSearch();
        } finally {
          discordSettingForm.value.loading = false;
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  //账号重置
  const doResetConUse = async (id) => {
    discordSettingForm.value.loading = true;
    try {
      await resetConUse({ id: id });
      onSearch();
    } finally {
      discordSettingForm.value.loading = false;
    }
  };
  //************************************** discord 账号添加 ****************************************************//
  const discordFormRef = ref();
  const discordForm = ref({
    viewFlag: false,
    loading: false,
    loadingTitle: '',
    title: '',
    notice: '',
    id: null,
    token: null,
  });
  const showDiscordForm = (record) => {
    if (!hasPermission('2001')) {
      createMessage.warning(
        '嘿，你错过时间了，现在已经关闭自动升级了！联系站长看看能否给你开放权限吧！',
      );
      return;
    }

    if (record) {
      discordForm.value.id = record.id;
      discordForm.value.title = '💡刷新token信息(请确认token值的有效性！)';
      discordForm.value.notice = '💡请确认token值，失败会阻塞！';
      discordForm.value.viewFlag = true;
      discordForm.value.token = null;
      discordForm.value.loadingTitle = '';
    } else {
      discordForm.value.token = null;
      discordForm.value.viewFlag = true;
      discordForm.value.id = null;
      discordForm.value.notice = '💡请确认刷新的token值，失败会阻塞3分钟！';
      discordForm.value.title = '💡添加Discord账号(请确认token值的有效性！)';
      discordForm.value.loadingTitle = '';
    }
  };
  const addDiscord = async () => {
    // 提交新增账户的数据
    discordForm.value.loading = true;
    try {
      await discordFormRef.value.validate();
      const resp = await discordAddToken({ content: discordForm.value.token });
      dealResult(resp);
    } catch (ex) {
      discordForm.value.loading = false;
    }
  };

  const getResult = async () => {
    discordForm.value.loading = true;
    try {
      const resp = await getValidResult({});
      dealResult(resp);
    } catch (ex) {
      discordForm.value.loading = false;
    }
  };

  const dealResult = (resp) => {
    console.log('resp .....' + resp);
    if (resp.code === 0) {
      createMessage.success(resp.message);
      discordForm.value.loading = false;
      discordForm.value.viewFlag = false;
      onSearch();
      return;
    } else if (resp.code === 9999) {
      createMessage.error(resp.message);
      discordForm.value.loading = false;

      return;
    } else {
      discordForm.value.loadingTitle = resp.message;
      //异步循环加载
      setTimeout(() => {
        getResult();
      }, 3000);
    }
  };

  const tableLoading = ref(false);

  const onSearch = async () => {
    tableLoading.value = true;
    try {
      const response = await discordList(queryForm.value);
      tableData.value = response;
    } finally {
      tableLoading.value = false;
    }
  };
  onMounted(() => {
    onSearch();
    initBindServerNameList();
  });

  const copyText = async (text) => {
    const value = unref(text);
    if (!value) {
      createMessage.warning('请输入要拷贝的内容！');
      return;
    }
    doCopyText(value);
  };

  const getDiscordStateContent = (state) => {
    if (state === 'NORMAL') {
      return { text: '正常', color: '#52c41a', status: 'processing' };
    } else if (state === 'EXPIRED') {
      return { text: '过期', color: '#ff4d4f', status: 'error' };
    } else if (state === 'VERIFY_HUMAN') {
      return { text: '验证人类', color: '#d9d9d9', status: 'warning' };
    } else {
      return { text: '未知', color: '#d9d9d9', status: 'default' };
    }
  };

  const getMjStateContent = (state) => {
    // console.log('getMjStateContent   ' + state);
    if (state === 'NORMAL') {
      return { text: '已订阅', color: '#52c41a', status: 'processing' };
    } else if (state === 'BAN') {
      return { text: 'BAN', color: '#ff4d4f', status: 'error' };
    } else if (state === 'STOP') {
      return { text: '未订阅', color: '#d9d9d9', status: 'default' };
    } else {
      return { text: '未知', color: '#d9d9d9', status: 'default' };
    }
  };

  // 主table 数据
  const tableData = ref<{}[]>([
    // 更多数据...
  ]);
</script>

<style scoped>
  .a-table {
    width: 100%;
    height: calc(80vh - 95px);
    padding: 10px;
    overflow: auto;
  }

  .ant-table-body {
    scrollbar-color: transparent transparent;
    scrollbar-width: thin; /* Firefox */

    /* Webkit Browsers (Safari, Chrome) */
    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: transparent;
    }
  }
</style>
