<template>
  <a-layout>
    <a-layout-sider :width="350" :collapsedWidth="0" :collapsible="true" :style="siderStyle">
      <template #trigger>
        <Icon icon="streamline-emojis:four-leaf-clover" style="margin: 0" aria-hidden="true" />
      </template>

      <!-- 文本生成区域 -->
      <div style="flex-direction: column">
        <a-card
          class="story-text no-radius"
          :bodyStyle="{ padding: '0px' }"
          size="small"
          title="联想文本"
        >
          <a-input
            :bordered="false"
            v-model:value="storyInputForm.storyText"
            placeholder="一只猫大战老虎的悲伤故事"
            :maxlength="200"
            disabled
          />
        </a-card>

        <a-card
          class="story-text no-radius"
          style="margin-top: 10px"
          :bodyStyle="{ padding: '0px' }"
          size="small"
          title="故事概述"
        >
          <template #extra>
            <a href="#">
              重新生成<Icon icon="typcn:refresh-outline" style="margin: 0" aria-hidden="true" />
            </a>
          </template>
          <a-textarea
            :bordered="false"
            v-model:value="storyInputForm.storyText"
            :rows="10"
            placeholder="一只猫大战老虎的悲伤故事"
            :maxlength="100"
          />
        </a-card>

        <a-card
          title="剧本分镜"
          class="story-text no-radius"
          :bodyStyle="{ padding: '0px' }"
          size="small"
        >
          <template #extra>
            <a href="#"
              >重新生成<Icon icon="typcn:refresh-outline" style="margin: 0" aria-hidden="true"
            /></a>
          </template>

          <a-textarea
            v-model:value="storyInputForm.storySplitText"
            :rows="10"
            :bordered="false"
            placeholder="一只猫大战老虎的悲伤故事"
            :maxlength="100"
          />
        </a-card>
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="headerStyle">Header</a-layout-header>
      <a-layout-content :style="contentStyle">
        <Loading :loading="globalLoading" :absolute="false" tip="正在加载中..." />

        <div style="display: flex; flex-direction: row">
          <div style="display: flex; flex-direction: column; width: 40%">
            <div style="text-align: start"> 标题 </div>

            <a-textarea
              :bordered="false"
              v-model:value="storyInputForm.storyText"
              :rows="10"
              placeholder="一只猫大战老虎的悲伤故事"
              :maxlength="100"
            />
          </div>
          <div style="width: 60%; text-align: left">
            <!--  角色表  -->
            <a-card size="small">
              <template #title>
                <span>故事角色定义</span>
              </template>
              <a-table size="small" :columns="roleColumns" :data-source="roleDataSource" bordered>
                <template #bodyCell="{ column, text, record }">
                  <template
                    v-if="['roleName', 'description', 'imageUrl'].includes(column.dataIndex)"
                  >
                    <div>
                      <a-input
                        v-if="editableData[record.key]"
                        v-model:value="editableData[record.key][column.dataIndex]"
                        style="margin: -5px 0"
                      />
                      <template v-else>
                        {{ text }}
                      </template>
                    </div>
                  </template>
                  <template v-else-if="column.dataIndex === 'operation'">
                    <div class="editable-row-operations">
                      <span v-if="editableData[record.key]">
                        <a-typography-link @click="save(record.key)">保存</a-typography-link>
                        <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.key)">
                          <a style="margin-left: 5px">取消</a>
                        </a-popconfirm>
                      </span>
                      <span v-else>
                        <a @click="edit(record.key)">编辑</a>
                        <a style="margin-left: 5px">选择图片</a>
                      </span>
                    </div>
                  </template>
                </template>
              </a-table>
            </a-card>
          </div>
        </div>

        <!-- 分镜记录表 -->
        <div style="margin-top: 30px; text-align: left">
          <a-card class="story-text" :bodyStyle="{ padding: '0px' }" size="small" title="分镜记录">
            <a-table size="small" :columns="roleColumns" :data-source="roleDataSource" bordered>
              <template #bodyCell="{ column, text, record }">
                <template v-if="['roleName', 'description', 'imageUrl'].includes(column.dataIndex)">
                  <div>
                    <a-input
                      v-if="editableData[record.key]"
                      v-model:value="editableData[record.key][column.dataIndex]"
                      style="margin: -5px 0"
                    />
                    <template v-else>
                      {{ text }}
                    </template>
                  </div>
                </template>
                <template v-else-if="column.dataIndex === 'operation'">
                  <div class="editable-row-operations">
                    <span v-if="editableData[record.key]">
                      <a-typography-link @click="save(record.key)">保存</a-typography-link>
                      <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.key)">
                        <a style="margin-left: 5px">取消</a>
                      </a-popconfirm>
                    </span>
                    <span v-else>
                      <a @click="edit(record.key)">编辑</a>
                      <a style="margin-left: 5px">选择图片</a>
                    </span>
                  </div>
                </template>
              </template>
            </a-table>
          </a-card>
        </div>
      </a-layout-content>
      <a-layout-footer :style="footerStyle">Footer</a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
  import { cloneDeep } from 'lodash-es';
  import { ref, UnwrapRef, reactive, onMounted, computed, unref, nextTick } from 'vue';
  import { Loading } from '/@/components/Loading';
  import Icon from '/@/components/Icon/Icon.vue';

  import type { CSSProperties } from 'vue';

  /***************************************** 角色编辑 *************************************** */
  const roleColumns = [
    {
      title: '角色名',
      dataIndex: 'roleName',
      width: '25%',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      width: '15%',
    },
    {
      title: '角色图片',
      dataIndex: 'imageUrl',
      width: '40%',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
    },
  ];

  interface DataItem {
    roleName: string;
    description: string;
    imageUrl: string;
  }
  const data: DataItem[] = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i.toString(),
      roleName: `Edrward ${i}`,
      description: '32',
      imageUrl: `London Park no. ${i}`,
    });
  }
  const roleDataSource = ref(data);
  const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

  const edit = (key: string) => {
    editableData[key] = cloneDeep(roleDataSource.value.filter((item) => key === item.key)[0]);
  };
  const save = (key: string) => {
    Object.assign(roleDataSource.value.filter((item) => key === item.key)[0], editableData[key]);
    delete editableData[key];
  };
  const cancel = (key: string) => {
    delete editableData[key];
  };

  const headerStyle: CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 50,
    lineHeight: '64px',
    backgroundColor: '#7dbcea',
  };

  const contentStyle: CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#108ee9',
  };

  const siderStyle: CSSProperties = {
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#3ba0e9',
  };

  const footerStyle: CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#7dbcea',
  };

  const globalLoading = ref(false);
  const storyInputForm = ref({
    inputText: null,
    storyText: null,
    storySplitText: null,
  });
</script>

<style scoped>
  .story-text {
    min-width: 240px;
  }

  .content {
    display: flex;
    justify-content: enter;
    max-width: 1280px;
  }
</style>
