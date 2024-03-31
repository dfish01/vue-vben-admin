<template>
  <div class="app" ref="formRef">
    <Loading :loading="globalLoading" :absolute="false" tip="正在加载中..." />
    <a-row style="height: 55px">
      <a-col :span="24">
        <a-card
          style="display: flex; align-items: center; height: 100%"
          :bodyStyle="{ padding: '0 5px 0px 24px' }"
        >
          <a-form layout="inline">
            <a-form-item>
              <a-input v-model:value="search.accountName" placeholder="输入账号名称" />
            </a-form-item>
            <a-form-item>
              <a-select
                v-model:value="search.ownerFlag"
                placeholder="账号权限"
                style="width: 150px"
              >
                <a-select-option value="N">授权</a-select-option>
                <a-select-option value="Y">自有</a-select-option>
              </a-select>
            </a-form-item>
            <!-- <a-form-item>
              <a-select
                v-model:value="search.accountStatus"
                placeholder="账号状态"
                style="width: 150px"
              >
                <a-select-option value="待验证">待验证</a-select-option>
                <a-select-option value="正常">正 常</a-select-option>
                <a-select-option value="异常">异 常</a-select-option>
                <a-select-option value="过期">结 束</a-select-option>
              </a-select>
            </a-form-item> -->
            <a-form-item>
              <a-space>
                <a-button-group>
                  <a-button @click="onSearch">查询</a-button>
                  <a-button @click="onReset">重置</a-button>
                </a-button-group>
                <a-button-group>
                  <!-- <a-button @click="showDiscordForm">配置Discord账号</a-button> -->
                  <a-button type="primary" @click="showStoryForm" ref="accountGroupStep">新增账户</a-button>
                  <a-button @click="onShowActive" ref="activeStep">授权激活</a-button>
                  <!-- <a-button type="success" @click="openGoodsShop">授权市场</a-button> -->

                  <!-- <a-button type="success" @click="openAccountGroup"
                    >账号组管理{{ props.contentHeight }}</a-button
                  > -->
                </a-button-group>
                <a-button-group>
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
                </a-button-group>
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
      <a-table 
      :dataSource="tableData"
      rowKey="id"
      :loading="globalLoading"
     >
        
      <a-table-column title="记录id" dataIndex="id" key="id" v-if="false" align="center" />
      <a-table-column
        title="标题"
        dataIndex="title"
        key="title"
        align="center"
        width="250px"
      />
      <a-table-column title="描述" dataIndex="description" key="description" align="center" />

      <a-table-column title="账号状态" dataIndex="state" key="state" align="center">
        <template #default="{ text }">
          <a-tag color="#d9d9d9" v-if="text === 'unvalid'">待验证</a-tag>
          <a-tag color="#52c41a" v-else-if="text === 'normal'">正常</a-tag>
          <a-tag color="#ff4d4f" v-else-if="text === 'error'">异常</a-tag>
          <a-tag color="#d9d9d9" v-else>过期</a-tag>
        </template>
      </a-table-column>
      <a-table-column title="创建时间" dataIndex="gmtCreate" key="gmtCreate" align="center" />
      
      <a-table-column title="联想内容" key="actions" width="150px">
        <template #default="{ record }">
          <a-button @click="showDetails(record.id)">查看</a-button>
        </template>
      </a-table-column>
      <a-table-column title="操作" key="actions" fixed="right" width="200">
        <template #default="{ record }">
         
          <a-button-group v-if="record.ownerFlag === 'Y'">
            <a-button type="primary" @click="showAuthorizationList(record.id)">查看</a-button>
            <a-button type="danger" @click="deleteAccount(record.id)">删除</a-button>
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
      :bodyStyle="{padding : 0}"
    >
    <template #footer>
      <a-button  @click="closeStoryForm"
          >取消</a-button
        >
        <a-button  :loading="storyForm.storyLoading || globalLoading" @click="doGenStory"
          >AI故事生成</a-button
        >
        <a-button type="primary" v-if="storyForm.aiStory && storyForm.aiStory.length > 0 && storyForm.storyLoading === false"  :loading="storyForm.storyLoading || globalLoading" @click="doGenStorySplit"
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
              <span style=" color: red;font-size: 10px;">内容较多，生成时间稍长，请耐心等候</span>
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
        
        <a-row style=" margin-top: 20px;padding: 0 10px;" v-if="storyForm.aiStory && storyForm.aiStory.length > 0 && storyForm.storyLoading === false">
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
          <span style="padding: 3px 10px; color: rgb(0 0 0 / 70%); font-size: 10px;">
            <Icon icon="flat-color-icons:idea" color="#91C8E4" />
            这是一个大纲内容，如果生成的内容不理想，你可以手动修改下。大体结构不变就好。</span
          >
        </div>
          <a-textarea
              :bordered="true"
              v-model:value="storyForm.aiStory"
              :rows="10"
              placeholder="一只猫大战老虎的悲伤故事2"
              :maxlength="100"
            />
        </a-row>
        </a-spin>
    </a-modal>

    <!-- AI分镜故事 -->
    <a-modal
      v-model:open="storySplitForm.viewFlag"
      title="AI分镜"
      @cancel="closeStorySplitForm"
      :bodyStyle="{padding : 0}"
      width="80%"
    >
    <template #footer>
      <a-button  @click="closeStoryForm"
          >取消</a-button
        >
        
        <a-button type="primary" target="" @click="doGenStorySplit"
          >提交分镜</a-button
        >
       
      </template>
      <a-spin :spinning="globalLoading">
        <!-- 提示区域 -->
        <a-row style=" margin-top: 20px;padding: 0 10px;" >
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
          <span style="padding: 3px 10px; color: rgb(0 0 0 / 70%); font-size: 10px;">
            <Icon icon="flat-color-icons:idea" color="#91C8E4" />
            这是一个AI联想的分镜内容，如果生成的内容不理想，你可以手动修改下。</span
          >
        </div>
        </a-row>
        <!-- 故事主体 -->
        <div style=" margin-top: 20px;padding: 0 20px;" >
          <a-descriptions bordered title="故事主题" size="small">
            <template #extra>
            </template>
            <a-descriptions-item label="故事标题" :span="3" :style="{ width: '180px' }">{{storySplitForm.item?.title}}</a-descriptions-item>
            <a-descriptions-item label="故事背景" :span="3" :style="{ width: '180px' }">{{storySplitForm.item?.background}}</a-descriptions-item>
          </a-descriptions>
        </div>
        <!-- 故事角色 -->
        <div style=" margin-top: 20px;padding: 0 20px;" >
          <a-button  @click="showStoryRoleForm(null)" type="primary" style="margin-bottom: 5px" size="small">添加角色</a-button>
          <a-table 
            :dataSource="storySplitForm.item.storyRoleList"
            rowKey="id"
            :loading="globalLoading"
            :pagination="false"

          >
            <a-table-column title="角色记录id" dataIndex="id" key="id" v-if="false" align="center" />
            <a-table-column
              title="角色名"
              dataIndex="roleName"
              key="roleName"
              align="center"
              width="100px"
            />
            <a-table-column width="250px" title="角色描述" dataIndex="description" key="description" align="center" />

            <a-table-column title="角色图片" dataIndex="imageUrl" key="imageUrl" align="center">
              <template #default="{ record }">
                <div v-if="record.imageInfo?.url">
                  <a-image
                    :src="record.imageInfo?.url"
                    :width="150"
                    :preview="false"
                  />
                </div>
                <div v-else>
                  <div v-if="record.taskId">
                    <div v-if="record.imageInfo.taskState !== 'FINISHED'">
                      {{ record.taskState }}
                    </div>
                  </div>
                  <div v-else>
                    <span>暂未指定，请编辑选择MJ生成或者手动上传</span>
                    
                  </div>

                </div>
                  
              </template>

            </a-table-column>
            <a-table-column title="操作" align="center" key="actions" fixed="right" :width="80">
                <template #default="{ record }">
                  <a-button-group>
                    <a-button
                      type="primary"
                      @click="showStoryRoleForm(record)"
                      >编辑</a-button
                    >
                    <a-button
                      type="primary"
                      danger
                      @click="removeStoryRoleForm(record)"
                      >删除</a-button
                    >
                  </a-button-group>
                </template>
              </a-table-column>
          </a-table>
        </div>

        <!-- 分镜内容 -->
        <div style=" margin-top: 0;padding: 0 10px;" >
          <div v-for="(storyChapter, index) in storySplitForm.item.storyChapterList" :key="index" style="padding: 10px 15px">
            <!-- 章节内容 -->
            <a-descriptions bordered :title="storyChapter.title" size="small">
                <template #extra>
                  <!-- <a-button type="primary">Edit</a-button> -->
                </template>
                <a-descriptions-item label="章节标题" :span="3" :style="{ width: '180px' }">{{storyChapter.title}}</a-descriptions-item>
                <a-descriptions-item label="章节描述" :span="3" :style="{ width: '180px' }">{{storyChapter.description}}</a-descriptions-item>
              </a-descriptions>
            <!-- 章节的分镜内容 -->
            <div style="margin-top: 10px">
              <a-button  @click="showStoryPictureForm(null, index)"   type="primary" style="margin-bottom: 5px" size="small">添加分镜</a-button>
              <a-table 
                  :dataSource="storyChapter.storyPictureList"
                  rowKey="id"
                  :loading="globalLoading"
                  :pagination="false"
                >
                    
                  <a-table-column title="分镜id" dataIndex="id" key="id" v-if="false" align="center" />
                  <a-table-column
                    title="字幕"
                    dataIndex="caption"
                    key="caption"
                    align="center"
                    width="200px"
                  />
                  <a-table-column title="分镜描述"  width="200px" dataIndex="description" key="description" align="center" />

                  <a-table-column title="分镜图片" dataIndex="imageUrl" key="imageUrl" align="center">
                    <template #default="{ record }">
                      <div v-if="record.imageInfo?.url">
                        <a-image
                          :src="record.imageInfo?.url"
                          :width="150"
                          :preview="false"
                        />
                      </div>
                      <div v-else>
                        <div v-if="record.taskId">
                          <div v-if="record.imageInfo.taskState !== 'FINISHED'">
                            {{ record.taskState }}
                          </div>
                        </div>
                        <div v-else>
                          <span>暂未指定，请编辑选择MJ生成或者手动上传</span>
                          
                        </div>

                      </div>
                        
                    </template>

                  </a-table-column>
                  <a-table-column title="操作" align="center" key="actions" fixed="right" :width="80">
                    <template #default="{ record }">
                      <a-button-group>
                        <a-button
                          type="primary"
                          @click="showStoryPictureForm(record, index)"
                          >编辑</a-button
                        >
                        <a-button
                          type="primary"
                          danger
                          @click="removeStoryPictureForm(record, index)"
                          >删除</a-button
                        >
                      </a-button-group>
                    </template>
                  </a-table-column>
                </a-table>
            </div>
            
      
          </div>


        </div>
        </a-spin>
    </a-modal>

    <!-- 角色modal -->
    <a-modal
      v-model:open="storyRoleForm.viewFlag"
      title="角色编辑"
      @cancel="closeStoryRoleForm"
      :bodyStyle="{padding : 0}"
    >
    <template #footer>
      <a-button  @click="closeStoryRoleForm"
          >取消</a-button
        >
        
        <a-button type="primary" target="" @click="saveStoryRoleForm"
          >保存</a-button
        >
       
      </template>
      <a-spin :spinning="globalLoading">

        <a-form layout="vertical" :model="storyRoleForm" ref="storyRoleFormRef" style="padding: 10 10px">
          <a-row style="padding: 0 15px">
            <a-col :span="24">
              <a-form-item
                label="角色名"
                :name="['item', 'roleName']"
                :rules="[{ required: true, message: '请输入角色名!' }]"
              >
                <a-input show-count :maxlength="15" v-model:value="storyRoleForm.item.roleName" placeholder="请输入角色名" />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item
                label="角色描述"
                :name="['item', 'description']"
                :rules="[{ required: false, message: '请输入角色描述!' }]"
              >
                <a-textarea
                  v-model:value="storyRoleForm.item.description"
                  placeholder="请输入商品说明"
                  :rows="3"
                  show-count :maxlength="60"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-tabs ref="formRef" v-model:activeKey="storyRoleForm.item.imageInfo.tabKey" @change="changeBillingCount">
                <a-tab-pane key="AI">
                  <template #tab>
                    <span
                      ><Icon
                        icon="fluent:calendar-arrow-counterclockwise-20-regular"
                        class="vel-icon icon"
                        aria-hidden="true"
                        style="margin-right: 2px"
                        size="16"
                      />AI生成
                    </span>
                  </template>
                  <a-row >
                    <a-textarea
                    style="width: 100%"
                    v-model:value="storyRoleForm.item.imageInfo.prompt"
                    placeholder="输入生成的prompt,可以输入中文，不填就默认使用描述生成"
                    :rows="3"
                    show-count :maxlength="300"
                  />
                  </a-row>
                  <a-row v-if="storyRoleForm.item.imageInfo.taskId">
                    <div v-if="storyRoleForm.item.imageInfo.imageList">
                      <a-image
                        v-for="(url, index) in storyRoleForm.item.imageInfo.imageList"
                        :key="index"
                        :src="url"
                        :width="150"
                        :preview="false"
                      />
                    </div>
                  </a-row>

                </a-tab-pane>
                <a-tab-pane key="HANDLE">
                  <template #tab>
                    <span>
                      <Icon
                        icon="material-symbols:money-outline-rounded"
                        class="vel-icon icon"
                        style="margin-right: 2px"
                        aria-hidden="true"
                        size="16"
                      />手动上传</span
                    >
                  </template>
                  <a-upload
                    v-model:file-list="roleFileList"
                    :action="uploadInfo.url"
                    :multiple="false"
                    :maxCount="1"
                    :headers="{ Authorization: uploadInfo.token }"
                    list-type="picture-card"
                    :before-upload="beforeFileUpload"
                    @preview="handlePreview"
                    @change="handleRoleFileChange"
                    :withCredentials="true"
                    style="display: flex; align-items: flex-start; justify-content: flex-start"
                  >
                    <div v-if="roleFileList.length < 1">
                      <plus-outlined />
                      <div style="margin-top: 8px"> 上传图片</div>
                    </div>
                  </a-upload>
                </a-tab-pane>
              </a-tabs>
            </a-col>
          </a-row>
        </a-form>

   
        </a-spin>
    </a-modal>

    <!-- 分镜modal -->
    <a-modal
      v-model:open="storyPictureForm.viewFlag"
      title="分镜编辑"
      @cancel="closeStoryPictureForm"
      :bodyStyle="{padding : 0}"
    >
    <template #footer>
      <a-button  @click="closeStoryPictureForm"
          >取消</a-button
        >
        
        <a-button type="primary" target="" @click="savePictureForm"
          >提交</a-button
        >
       
      </template>
      <a-spin :spinning="globalLoading">

        <a-form layout="vertical" :model="storyPictureForm" ref="storyPictureFormRef" style="padding: 10 10px">
          <a-row style="padding: 0 15px">
            <a-col :span="24">
              <a-form-item
                label="字幕"
                
                :name="['item', 'caption']"
                :rules="[{ required: true, message: '请输入字幕!' }]"
              >
                <a-input show-count :maxlength="15" v-model:value="storyPictureForm.item.caption" placeholder="请输入字幕" />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item
                label="分镜描述"
                :name="['item', 'description']"
                :rules="[{ required: true, message: '请输入分镜画面描述!' }]"
              >
                <a-input show-count :maxlength="15" v-model:value="storyPictureForm.item.description" placeholder="请输入分镜画面描述" />
              </a-form-item>
            </a-col>
            
            <a-col :span="24">
              <a-tabs ref="formRef" v-model:activeKey="storyPictureForm.item.imageInfo.tabKey" @change="changeBillingCount">
                <a-tab-pane key="AI">
                  <template #tab>
                    <span
                      ><Icon
                        icon="fluent:calendar-arrow-counterclockwise-20-regular"
                        class="vel-icon icon"
                        aria-hidden="true"
                        style="margin-right: 2px"
                        size="16"
                      />AI生成
                    </span>
                  </template>
                  <a-row >
                    <a-textarea
                    style="width: 100%"
                    v-model:value="storyPictureForm.item.imageInfo.prompt"
                    placeholder="输入生成的prompt,可以输入中文，不填就默认使用描述生成"
                    :rows="3"
                    show-count :maxlength="300"
                  />
                  </a-row>
                  <a-row v-if="storyPictureForm.item.imageInfo.taskId">
                    <div v-if="storyPictureForm.item.imageInfo.imageList">
                      <a-image
                        v-for="(url, index) in storyPictureForm.item.imageInfo.imageList"
                        :key="index"
                        :src="url"
                        :width="150"
                        :preview="false"
                      />
                    </div>
                  </a-row>

                </a-tab-pane>
                <a-tab-pane key="HANDLE">
                  <template #tab>
                    <span>
                      <Icon
                        icon="material-symbols:money-outline-rounded"
                        class="vel-icon icon"
                        style="margin-right: 2px"
                        aria-hidden="true"
                        size="16"
                      />手动上传</span
                    >
                  </template>
                  <a-upload
                    v-model:file-list="pictureFileList"
                    :action="uploadInfo.url"
                    :multiple="false"
                    :maxCount="1"
                    :headers="{ Authorization: uploadInfo.token }"
                    list-type="picture-card"
                    :before-upload="beforeFileUpload"
                    @preview="handlePreview"
                    @change="handlePictureFileChange"
                    :withCredentials="true"
                    style="display: flex; align-items: flex-start; justify-content: flex-start"
                  >
                    <div v-if="pictureFileList.length < 1">
                      <plus-outlined />
                      <div style="margin-top: 8px"> 上传图片</div>
                    </div>
                  </a-upload>
                </a-tab-pane>
              </a-tabs>
            </a-col>
          </a-row>
        </a-form>

   
        </a-spin>
    </a-modal>

    <!-- 上传图片预览 -->
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, unref, nextTick } from 'vue';
  import { Loading } from '/@/components/Loading';
  import Icon from '/@/components/Icon/Icon.vue';
  import { IdReq } from '/@/api/model/baseModel';
  import AccountGroup from './account_group.vue'; 
  import {genSimpleStory, genStory, storyList, storyRemove,storyInfo,saveStoryRole,genSplitPicture,extractSplitContent,commitSplitContent } from '/@/api/df/story';
  import { message, UploadProps, Upload } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { useGo } from '/@/hooks/web/usePage';
  import { func } from 'vue-types';
  import { getCustomLocalCache, setCustomLocalCache } from '/@/utils/custom';
  import { useUserStore } from '/@/store/modules/user';
  import type { UploadFile } from 'ant-design-vue/es/upload/interface';
  import { getAppEnvConfig } from '/@/utils/env';

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
    ownerFlag: null,
    accountName: '',
    accountStatus: null,
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
      ownerFlag: null,
      accountName: '',
      accountStatus: null,
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


  //************************************** 故事创建 ***********************************//
  
  const storyForm = ref({
    viewFlag: false,
    text: null,
    storyLoading : false,
    mode: "SparkDesk-v3.5",
    aiStory: null,
  })

  const showStoryForm = async () => {
    storyForm.value.viewFlag = true;
  };
  const closeStoryForm = async () => {
    storyForm.value = {
      viewFlag: false,
      text: null,
      storyLoading : false,
      mode: "qwen-plus",
      aiStory: null,
    };
  };

  // 生成故事
  const doGenStory = async () => {
    
    storyForm.value.storyLoading = true;
    try {
      const resp = await genStory({
        mode: storyForm.value.mode,
        content:  storyForm.value.text,
      });
      storyForm.value.aiStory = resp;
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
        content:  storyForm.value.aiStory,
      });
     
      console.log(resp)
      storyForm.value.viewFlag = false;

      //打开明细创建页面
      showStorySplitForm(resp)

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
      onSearch();
    } finally {
      globalLoading.value = false;
    }
  };

  //************************************** 故事分镜 ***********************************//
  
  const storySplitForm = ref({
    viewFlag: false,
    item: null,
    loading: false
  })

  const showStorySplitForm = async (item) => {
    storySplitForm.value.viewFlag = true;
    storySplitForm.value.item = item;
  };
  const closeStorySplitForm = async () => {
    storySplitForm.value = {
    viewFlag: false,
    item: null,
    loading: false
  };
  };

  

 
  /*********************************** 角色 ******************************** */

  const storyRoleForm = ref({
    viewFlag: false,
    loading: false,
    item: {
      roleName: null,
      description: null,
      prompt: null
    }
  })

  const closeStoryRoleForm = () => {
    storyRoleForm.value.viewFlag = false;
  }
  const saveStoryRoleForm = () => {
    // let index = storyPictureForm.value.chapterIndex;
    let indexItem = storyRoleForm.value.item.key;
    if(indexItem) {
      storySplitForm.value.item.storyRoleList[indexItem] = storyRoleForm.value.item;
    }else {
      
      //新增
      storySplitForm.value.item.storyRoleList.push(storyRoleForm.value.item);
    }
    storyRoleForm.value.viewFlag = false;
  }
  const removeStoryRoleForm = (item) => {
    let index = item.key;
    storySplitForm.value.item.storyRoleList.splice(index, 1);
  }
  const showStoryRoleForm = (item) => {
    //新增场景
    if(item === null) {
      item = {
        roleName: null,
        description: null,
        prompt: null
      }
    }
    if(item.imageInfo === null || item.imageInfo === undefined) {
      item.imageInfo = {
        tabKey: 'AI',
      };
      //图片清空
      roleFileList.value = [];
    }else if(item.imageInfo && item.imageInfo.url){
      //初始化图片
      roleFileList.value = [  {
        uid: '-1',
        name: 'init.png',
        status: 'done',
        url: item.imageInfo.url,
      }];
    }
    console.log("showStoryRoleForm");
    storyRoleForm.value.item = item;

    storyRoleForm.value.viewFlag = true;
  }

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
      prompt: null
    }
  })

  
  const savePictureForm = () => {
    let index = storyPictureForm.value.chapterIndex;
    let indexItem = storyPictureForm.value.item.key;
    console.log("savePictureForm...")
    if(indexItem) {
     
      storySplitForm.value.item.storyChapterList[index].storyPictureList[indexItem] = storyPictureForm.value.item;
    }else {
       //新增
       storySplitForm.value.item.storyChapterList[index].storyPictureList.push(storyPictureForm.value.item);
    }
    
    storyPictureForm.value.viewFlag = false;
  }

  const closeStoryPictureForm = () => {
    storyPictureForm.value.viewFlag = false;
  }
  const removeStoryPictureForm = (item, index) => {
    let indexItem = item.key;
    storySplitForm.value.item.storyChapterList[index].storyPictureList.splice(indexItem, 1);
  }
  const showStoryPictureForm = (item, index) => {
    //新增场景
    if(item === null) {
      item = {
        caption: null,
        description: null,
      }
    }

    if(item.imageInfo === null || item.imageInfo === undefined) {
      item.imageInfo = {

        tabKey: 'AI',
      };
       //图片清空
       pictureFileList.value = [];
    }else if(item.imageInfo && item.imageInfo.url){
      //初始化图片
      pictureFileList.value = [  {
        uid: '-1',
        name: 'init.png',
        status: 'done',
        url: item.imageInfo.url,
      }];
    }
    console.log("showStoryRoleForm");
    storyPictureForm.value.chapterIndex = index;
    storyPictureForm.value.item = item;
    storyPictureForm.value.viewFlag = true;
  }


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

  const getStateContent = (state) => {
    if (state === 'normal') {
      return { text: '正常', color: '#52c41a', status: 'processing' };
    } else if (state === 'error') {
      return { text: '异常', color: '#ff4d4f', status: 'error' };
    } else if (state === 'unvalid') {
      return { text: '待验证', color: '#d9d9d9', status: 'warning' };
    } else if (state === 'sale') {
      return { text: '出售中', color: '#337357', status: 'warning' };
    } else {
      return { text: '过期', color: '#d9d9d9', status: 'default' };
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



</style>
