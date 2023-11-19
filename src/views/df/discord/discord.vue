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
        />
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
                <a-button size="small" @click="() => copyText(text)">🐣复制</a-button>
              </template>
              <a-button size="small">🙉查看TOKEN</a-button>
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
          <template #default="{ text }">
            <a-popover placement="top" trigger="click">
              <template #title></template>
              <template #content> {{ text }} </template>
              <a-button size="small" type="danger" v-if="text">🙊异常信息</a-button>
            </a-popover>
          </template>
        </a-table-column>

        <!-- <a-table-column title="异常信息" dataIndex="errorMsg" key="errorMsg" align="center" /> -->

        <a-table-column title="操作" key="actions" fixed="right" :width="200">
          <template #default="{ record }">
            <a-button-group>
              <!-- <a-button @click="showDiscordForm" disabled>概况</a-button> -->
              <a-button @click="showDiscordForm" disabled>配置</a-button>
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
      v-model:visible="discordForm.viewFlag"
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
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, unref, onMounted, defineProps } from 'vue';
  import { discordAddToken, discordList, discordInfo, getValidResult } from '/@/api/df/discord';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { copyText as doCopyText } from '/@/utils/copyTextToClipboard';

  const { createMessage, createSuccessModal, createErrorModal, createInfoModal } = useMessage();
  const props = defineProps({
    contentHeight: Number, // 你的 prop 类型
  });

  const queryForm = ref({
    discordState: null,
    mjState: null,
  });

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
    console.log('getMjStateContent   ' + state);
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
