<template>
  <a-layout>
    <a-card>
      <a-form layout="inline">
        <a-form-item label="账号名称">
          <a-input v-model="search.accountName" placeholder="输入账号名称" />
        </a-form-item>
        <a-form-item label="账号类型">
          <a-select v-model="search.ownerFlag" placeholder="账号权限" style="width: 120px">
            <a-select-option value="N">授权</a-select-option>
            <a-select-option value="Y">自有</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="账号状态">
          <a-select v-model="search.accountStatus" placeholder="账号状态" style="width: 120px">
            <a-select-option value="待验证">待验证</a-select-option>
            <a-select-option value="正常">正 常</a-select-option>
            <a-select-option value="异常">异 常</a-select-option>
            <a-select-option value="过期">结 束</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="onSearch">查询</a-button>
            <a-button @click="onReset">重置</a-button>
            <a-button type="success" @click="onAdd">新增</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
    <a-table
      :dataSource="tableData"
      rowKey="id"
      :loading="tableLoading"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :scroll="{ x: 'max-content', y: 380 }"
      :pagination="pagination"
      style="margin-top: 10px"
    >
      <a-table-column title="记录id" dataIndex="id" key="id" v-if="false" align="center" />
      <a-table-column
        title="Discord用户名"
        dataIndex="discordUserName"
        key="discordUserName"
        align="center"
        width="150px"
      />
      <a-table-column title="服务器ID" dataIndex="guildId" key="guildId" align="center" />
      <a-table-column
        title="服务器名称"
        dataIndex="guildTitle"
        key="guildTitle"
        align="center"
        width="150px"
      />
      <a-table-column title="账号权限" dataIndex="ownerFlag" key="ownerFlag" align="center">
        <template #default="{ text }">
          <a-tag color="#fa8c16" v-if="text === 'N'">授权</a-tag>
          <a-tag color="#52c41a" v-else>自有</a-tag>
        </template>
      </a-table-column>
      <!-- <a-table-column title="授权" dataIndex="authFlag" key="authFlag" align="center">
        <template #default="{ record }">
          <a-switch
            :checked="record.authFlag === 'N'"
            :disabled="record.ownerFlag === 'A'"
            checked-children="已开启"
            un-checked-children="已关闭"
            @click="toggleAuthorization(record)"
          />
        </template>
      </a-table-column> -->
      <a-table-column title="账号状态" dataIndex="state" key="state" align="center">
        <template #default="{ text }">
          <a-tag color="#d9d9d9" v-if="text === 'unvalid'">待验证</a-tag>
          <a-tag color="#52c41a" v-else-if="text === 'normal'">正常</a-tag>
          <a-tag color="#ff4d4f" v-else-if="text === 'error'">异常</a-tag>
          <a-tag color="#d9d9d9" v-else>过期</a-tag>
        </template>
      </a-table-column>
      <a-table-column title="创建时间" dataIndex="gmtCreate" key="gmtCreate" align="center" />
      <!-- <template #authorizationCount="{ text, record }">
        <a v-if="text > 0" @click="showAuthorizationModal(record.id)">{{ text }}</a>
        <template v-else>{{ text }}</template>
      </template> -->
      <a-table-column title="账号使用情况" key="actions" width="150px">
        <template #default="{ record }">
          <a-button @click="showDetails(record.id)">使用情况</a-button>
        </template>
      </a-table-column>
      <a-table-column title="操作" key="actions" fixed="right" width="200">
        <template #default="{ record }">
          <a-button type="danger" @click="deleteAccount(record.id)">移除</a-button>
          <a-button-group v-if="record.ownerFlag === 'Y'">
            <!-- <a-button type="warning" @click="editAccount(record.id)">编辑</a-button> -->
            <a-button type="primary" @click="showAuthorizationList(record.id)">授权列表</a-button>
          </a-button-group>
        </template>
      </a-table-column>
    </a-table>
    <!-- 新增用户 -->
    <a-modal v-model:open="isAddModalVisible" title="新增账户" ok-text="提交" @ok="onSubmitAdd">
      <a-card>
        <a-form layout="vertical">
          <a-row gutter="24">
            <a-col :span="12">
              <a-form-item label="账号名">
                <a-input v-model:value="addForm.accountName" placeholder="输入账号名" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="授权数">
                <a-input-number v-model:value="addForm.authorizationCount" min="0" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row gutter="24">
            <a-col :span="12">
              <a-form-item label="Token">
                <a-input v-model:value="addForm.token" placeholder="输入Token" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="服务ID">
                <a-input v-model:value="addForm.serviceId" placeholder="输入服务ID" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item label="Channel ID">
                <a-input v-model:value="addForm.channelId" placeholder="输入Channel ID" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>
    <!-- 授权列表 -->
    <a-modal v-model:open="isAuthModalVisible" @ok="closeAuthModal">
      <template #title>
        <Icon
          icon="streamline-emojis:beaming-face-with-smiling-eyes"
          class="vel-icon icon"
          aria-hidden="true"
        />
        授权列表
      </template>

      <a-table :dataSource="authList" :columns="authColumns" class="a-table">
        <template #header>
          <a-row>
            <a-col :span="6">
              <b>ID</b>
            </a-col>
            <a-col :span="6">
              <b>授权码</b>
            </a-col>
            <a-col :span="6">
              <b>用户</b>
            </a-col>
            <a-col :span="6">
              <b>授权时间</b>
            </a-col>
          </a-row>
        </template>
        <template #default="{ record }">
          <a-row>
            <a-col :span="6">
              {{ record.id }}
            </a-col>
            <a-col :span="6">
              {{ record.authCode }}
            </a-col>
            <a-col :span="6">
              {{ record.user }}
            </a-col>
            <a-col :span="6">
              {{ record.authTime }}
            </a-col>
          </a-row>
        </template>
      </a-table>
    </a-modal>
    <!-- 详情模态窗口组件 -->
    <account-details-modal
      :id="selectedAccountId"
      :visible="isDetailsModalVisible"
      @update-visible="updateModalVisible"
    />
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import {
    ListQueryParams,
    ListResultModel,
    AccountListItem,
    ChangeAuthParams,
  } from '/@/api/df/model/accountModel';
  import Icon from '/@/components/Icon/Icon.vue';
  import { queryList, changeAuth } from '/@/api/df/account';
  import AccountDetailsModal from './accountDetailsModal.vue';

  const tableLoading = ref(false);
  //查询
  const search = ref({
    ownerFlag: '',
    accountName: '',
    accountStatus: '',
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
      ownerFlag: '',
      accountName: '',
      accountStatus: '',
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

  const onSearch = async () => {
    tableLoading.value = true;
    const params: ListQueryParams = search.value;
    params.current = pagination.value.current;
    params.pageSize = pagination.value.pageSize;
    console.log(params);
    const response = await queryList(params);
    tableData.value = response.records;
    pagination.value.total = response.total;
    tableLoading.value = false;
  };
  onMounted(onSearch);

  // 主table 数据
  const tableData = ref<AccountListItem[]>([
    // 更多数据...
  ]);

  //授权模态窗
  const isAuthModalVisible = ref(false);
  const authList = ref([
    { id: '1', authCode: '123456', user: '张三', authTime: '2023-07-20 18:00:00' },
    { id: '2', authCode: '789012', user: '李四', authTime: '2023-07-21 18:00:00' },
  ]);
  const authColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '授权码', dataIndex: 'authCode', key: 'authCode' },
    { title: '用户', dataIndex: 'user', key: 'user' },
    { title: '授权时间', dataIndex: 'authTime', key: 'authTime' },
  ];
  const showAuthorizationModal = (id) => {
    // 显示授权数的模态框
    console.log(1111111);
    isAuthModalVisible.value = true;
  };
  const showAuthorizationList = (id) => {
    // 显示授权列表
    isAuthModalVisible.value = true;
  };
  const closeAuthModal = () => {
    isAuthModalVisible.value = false;
  };

  //新增或者编辑
  const isAddModalVisible = ref(false);
  const addForm = ref({
    id: null,
    accountName: '',
    authorizationCount: 0,
    token: '',
    serviceId: '',
    channelId: '',
  });
  const onAdd = () => {
    isAddModalVisible.value = true;
  };
  const editAccount = (id) => {
    isAddModalVisible.value = true;
    // 编辑账户
    addForm.value.accountName = '123';
    addForm.value.authorizationCount = 123;
  };
  const onSubmitAdd = () => {
    // 提交新增账户的数据
    isAddModalVisible.value = false;
  };

  const toggleAuthorization = async (record) => {
    // 你可以根据需要修改开关状态
    const newStatus = record.authFlag === 'Y' ? 'N' : 'Y';
    record.authFlag = newStatus;
    console.log(record);
    // 调用后端接口来更新授权状态
    // 你可以根据你的后端接口进行相应的调用
    try {
      const params: ChangeAuthParams = {
        id: record.id,
        authFlag: record.authFlag,
      };
      await changeAuth(params);
      // 更新成功后，你可以根据需要进行其他操作，例如刷新表格等
    } catch (error) {
      // 如果更新失败，你可能想撤消更改并向用户显示错误消息
      record.authFlag = newStatus === 'Y' ? 'N' : 'Y';
      console.error('授权状态更新失败:', error);
    }
  };

  const deleteAccount = (id) => {
    // 删除账户
  };

  //账号统计相关
  const selectedAccountId = ref('');
  const isDetailsModalVisible = ref(false);
  const showDetails = (id: string) => {
    selectedAccountId.value = id;
    isDetailsModalVisible.value = true;
    console.log(9999999);
    console.log('id:' + id + '   isDetailsModalVisible:' + isDetailsModalVisible.value);
  };

  // 更新模态窗口的可见性，由子组件触发
  const updateModalVisible = (value: boolean) => {
    isDetailsModalVisible.value = value;
  };

  defineExpose({
    closeModal: () => {
      isDetailsModalVisible.value = false;
    },
  });
</script>

<style scoped>
  .a-table {
    width: 100%;
    height: calc(80vh - 95px);
    padding: 10px;
    overflow: auto;
  }
</style>
