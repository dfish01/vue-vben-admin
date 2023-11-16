<template>
  <a-layout>
    <a-card>
      <a-button type="primary" @click="openAccountGroup">新增账号组</a-button>
    </a-card>
    <a-table
      :dataSource="tableData"
      rowKey="id"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :scroll="{ x: 'max-content', y: props.contentHeight - 230 }"
      :pagination="false"
      size="small"
    >
      <a-table-column title="记录id" dataIndex="id" key="id" v-if="false" align="center" />
      <a-table-column title="账号组名称" dataIndex="groupName" key="groupName" align="center" />
      <a-table-column title="备注" dataIndex="remark" key="remark" align="center" />
      <!-- <a-table-column
        title="内含账号"
        dataIndex="discordNameList"
        key="discordNameList"
        align="center"

      /> -->
      <a-table-column
        title="内含账号"
        dataIndex="discordNameValueList"
        key="discordNameValueList"
        align="center"
      >
        <template #default="{ record }">
          <div>
            <a-tag
              v-for="(item, index) in record.refAccountList"
              :key="index"
              :color="item.avaFlag === 'false' ? 'gray' : 'blue'"
            >
              {{ item.discordUserName }}
            </a-tag>
          </div>
        </template>
      </a-table-column>
      <!-- <a-table-column title="创建时间" dataIndex="gmtCreate" key="gmtCreate" align="center" /> -->

      <a-table-column title="操作" key="actions" fixed="right" width="200">
        <template #default="{ record }">
          <a-button type="warning" @click="openAccountGroup(record)">编辑</a-button>
        </template>
      </a-table-column>
    </a-table>
    <!-- 新增或编辑账号 -->
    <div>
      <a-modal
        ok-text="提交"
        @ok="onSubmitGroupForm"
        v-model:visible="groupForm.viewFlag"
        title="账号组保存"
      >
        <a-spin size="small" :spinning="groupForm.loading">
          <a-card>
            <a-form :model="groupForm" layout="vertical" ref="groupFormRef">
              <a-row>
                <a-col :span="24">
                  <a-form-item
                    label="账号组名称"
                    :rules="[
                      {
                        required: true,
                        message: '账号组名称是必填项',
                      },
                    ]"
                    name="groupName"
                  >
                    <a-input v-model:value="groupForm.groupName" placeholder="输入账号组名称" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-item label="账号">
                    <a-select
                      v-model:value="groupForm.accountIds"
                      mode="multiple"
                      style="width: 100%"
                      placeholder="勾选账号"
                      :options="groupForm.accountSelector"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-item label="备注">
                    <a-textarea
                      v-model:value="groupForm.remark"
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
          <a-button @click="onSubmitGroupForm" :loading="groupForm.loading" type="primary"
            >提交</a-button
          >
        </template>
      </a-modal>
    </div>
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, onMounted, defineProps } from 'vue';
  import { queryList, saveGroup, queryGroupList, availableList } from '/@/api/df/account';
  import { message } from 'ant-design-vue';

  const props = defineProps({
    contentHeight: Number, // 你的 prop 类型
  });

  const groupForm = ref({
    viewFlag: false,
    id: null,
    loading: false,
    groupName: '',
    remark: '',
    accountIds: [] as string[],
    accountSelector: [] as { label: string; value: string }[],
  });
  const groupFormRef = ref();

  // 提交账号组
  const onSubmitGroupForm = async () => {
    groupForm.value.loading = true;
    try {
      await groupFormRef.value.validate();
      console.log('Form is valid, submitting...');
      await saveGroup({
        id: groupForm.value.id,
        groupName: groupForm.value.groupName,
        remark: groupForm.value.remark,
        accountIds: groupForm.value.accountIds,
      });
      message.success('操作成功');
      onSearch();
      groupForm.value.viewFlag = false;
    } catch (error) {
      console.log('Form validation failed:', error);
    } finally {
      groupForm.value.loading = false;
    }
  };

  const openAccountGroup = (item) => {
    if (item) {
      groupForm.value.id = item.id;
      groupForm.value.groupName = item.groupName;
      groupForm.value.remark = item.remark;
      console.log(item.accountIds);
      groupForm.value.accountIds = item.accountIds === null ? [] : item.accountIds;
    } else {
      groupForm.value.id = null;
      groupForm.value.groupName = '';
      groupForm.value.remark = '';
      groupForm.value.accountIds = [];
    }
    groupForm.value.viewFlag = true;
  };

  const tableLoading = ref(false);

  const onSearch = async () => {
    tableLoading.value = true;
    try {
      const response = await queryGroupList({});
      tableData.value = response;
    } finally {
      tableLoading.value = false;
    }
  };
  onMounted(() => {
    onSearchAccountList();
    onSearch();
  });

  // 主table 数据
  const tableData = ref<{}[]>([
    // 更多数据...
  ]);

  //账户查询
  const onSearchAccountList = async () => {
    const response = await availableList({
      ownerFlag: 'Y',
      accMode: 'SINGLE',
    });

    // 使用 map 方法转换数组
    const transformedList = response.map((item) => ({
      label: item.accountName,
      value: item.id,
    }));

    const finalList = [...transformedList];
    groupForm.value.accountSelector = finalList;
  };
</script>

<style scoped>
  .a-table {
    width: 100%;
    height: calc(80vh - 95px);
    padding: 10px;
    overflow: auto;
  }
</style>
