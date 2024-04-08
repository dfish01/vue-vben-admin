<template>
  <div>
    <div
      :style="{
        width: '100%',
        padding: '0px 10px',
      }"
    >
      <!-- 提示区域 -->
      <a-row style="margin-top: 20px; padding: 0 10px">
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
          <span v-if="storySplitForm.item.genType === 'AI'" style="padding: 3px 10px; color: rgb(0 0 0 / 70%); font-size: 10px">
            <Icon icon="flat-color-icons:idea" color="#91C8E4" />
            这是一个AI联想的分镜内容，如果生成的内容不理想，你可以手动修改下。另外，考虑到有些是购买的账号，所以把任务自动开启改成手动触发了。</span
          >
          <span v-else style="padding: 3px 10px; color: rgb(0 0 0 / 70%); font-size: 10px">
            <Icon icon="flat-color-icons:idea" color="#91C8E4" />
            这是一个小说通过AI提取的分镜内容，如果提取的内容不理想，你可以手动修改下。另外，考虑到有些是购买的账号，所以把任务自动开启改成手动触发了。</span
          >
        </div>
      </a-row>
      <!-- 故事主体 -->
      <div style="margin-top: 20px; padding: 0 20px">
        <a-descriptions bordered title="故事主题" size="small">
          <template #extra> </template>
          <a-descriptions-item label="故事标题" :span="3" :style="{ width: '180px' }">
          <a-input-group v-if="storySplitForm.item?.titleEdit && storySplitForm.item?.titleEdit === true" compact style="display: flex">
           <a-input  v-model:value="storySplitForm.item.title" style="width:150px"></a-input>
           <a-button @click="() => storySplitForm.item.titleEdit = false"><Icon icon="fluent:save-20-filled"/></a-button>
          </a-input-group>

          <div v-else>
          {{
            storySplitForm.item?.title
          }} <a-button type="link" @click="() => storySplitForm.item.titleEdit = true" style="padding: 0; "><Icon icon="basil:edit-outline" /></a-button>
          </div>

         </a-descriptions-item>
          <a-descriptions-item label="当前进度" :span="3" :style="{ width: '180px' }" v-if="storySplitForm.item?.state">
            <a-tag color="#d9d9d9" v-if="storySplitForm.item?.state === 'await_role'">角色待生成</a-tag>
            <a-tag color="#FAA300" v-else-if="storySplitForm.item?.state === 'role_creating'">角色生成中</a-tag>
            <a-tag color="#d9d9d9" v-else-if="storySplitForm.item?.state === 'await_pic'">分镜待生成</a-tag>
            <a-tag color="#86469C" v-else-if="storySplitForm.item?.state === 'pic_creating'">分镜生成中</a-tag>
            <a-tag color="#52c41a" v-else-if="storySplitForm.item?.state === 'success'">已全部生成</a-tag>
            <a-tag color="#008DDA" v-else-if="storySplitForm.item?.state === 'submitting'">任务提交中</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="故事背景" :span="3" :style="{ width: '180px' }">
          
          <a-input-group v-if="storySplitForm.item?.backgroundEdit && storySplitForm.item?.backgroundEdit === true" compact style="display: flex">
           <a-input  v-model:value="storySplitForm.item.background" style="width: calc(100% - 48px)"></a-input>
           <a-button @click="() => storySplitForm.item.backgroundEdit = false"><Icon icon="fluent:save-20-filled"/></a-button>
          </a-input-group>

          <div v-else>
          {{
             storySplitForm.item?.background
          }} <a-button type="link" @click="() => storySplitForm.item.backgroundEdit = true" style="padding: 0; "><Icon icon="basil:edit-outline" /></a-button>
          </div>
          
          </a-descriptions-item>

          <a-descriptions-item label="一致性风格图" :span="3" :style="{ width: '180px' }">
            <a-upload
              v-model:file-list="srefFileList"
              :action="uploadInfo.url"
              :multiple="false"
              :maxCount="1"
              :headers="{ Authorization: uploadInfo.token }"
              list-type="picture-card"
              :before-upload="beforeFileUpload"
              @preview="handlePreview"
              @change="handleSrefFileChange"
              :withCredentials="true"
              style="display: flex; align-items: flex-start; justify-content: flex-start"
            >
              <div v-if="srefFileList.length < 1">
                <plus-outlined />
                <div style="margin-top: 8px"> 上传图片</div>
              </div>
            </a-upload>
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <!-- 故事角色 -->
      <div style="margin-top: 20px; padding: 0 20px">
        <a-collapse v-model:activeKey="activeKey" accordion>
          <a-collapse-panel key="1" header="故事角色定义">
            <a-button-group>
              <a-button
                @click="showStoryRoleForm(null)"
                type="primary"
                style="margin-bottom: 5px"
                size="small"
                ><Icon
                  icon="gg:add"
                  class="vel-icon icon"
                  aria-hidden="true"
                  style="margin-right: 1px"
                  size="16"
                />添加角色</a-button
              ><a-button
                @click="showChapterForm(null, null)"
                style="margin-bottom: 5px"
                size="small"
              >
                <Icon
                  icon="gg:add"
                  class="vel-icon icon"
                  aria-hidden="true"
                  style="margin-right: 1px"
                  size="16"
                />追加章节</a-button
              >
            </a-button-group>

            <a-table
              :dataSource="storySplitForm.item.storyRoleList"
              rowKey="id"
              :loading="globalItemLoading"
              :pagination="false"
            >
              <a-table-column
                title="角色记录id"
                dataIndex="id"
                key="id"
                v-if="false"
                align="center"
              />
              <a-table-column
                title="角色名"
                dataIndex="roleName"
                key="roleName"
                align="center"
                width="100px"
              />
              <a-table-column
                width="250px"
                title="角色描述"
                dataIndex="description"
                key="description"
                align="center"
              />
              <a-table-column
                title="角色别名（分镜上下文替换）"
                width="200px"
                dataIndex="alias"
                key="description"
                align="center"
              />
              <!-- <a-table-column
                title="状态"
                dataIndex="taskState"
                key="taskState"
                align="center"
                width="120px"
              >
                <template #default="{ record }">
                  <a-tag :color="tagColor(record.taskState)"> {{ record.taskState }} </a-tag>
                </template>
              </a-table-column> -->

              <a-table-column
                title="角色图片(一致性)"
                dataIndex="imageUrl"
                key="imageUrl"
                align="center"
                width="200px"
              >
                <template #default="{ record }">
                  <div v-if="record.imageInfo?.url">
                    <a-image :src="record.imageInfo?.url" :width="100" :preview="true" />
                  </div>
                  <div v-else>
                    <div v-if="record.imageInfo?.taskId">
                      <div v-if="record.imageInfo?.taskState !== 'FINISHED'">
                        <a-tag :color="tagColor(record.imageInfo.taskState)">
                          {{ record.imageInfo.taskState }}
                        </a-tag>
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
                      ><Icon
                        icon="uil:edit"
                        class="vel-icon icon"
                        aria-hidden="true"
                        style="margin-right: 1px"
                        size="16"
                    /></a-button>
                    <a-button type="primary" danger @click="removeStoryRoleForm(record)"
                      ><Icon
                        icon="fluent:delete-32-regular"
                        class="vel-icon icon"
                        aria-hidden="true"
                        style="margin-right: 1px"
                        size="16"
                    /></a-button>
                  </a-button-group>
                </template>
              </a-table-column>
            </a-table>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <!-- 分镜内容 -->
      <div style="margin-top: 0; padding: 0 10px">
        <div
          v-for="(storyChapter, index) in storySplitForm.item.storyChapterList"
          :key="index"
          style="padding: 10px 15px"
        >
          <!-- 章节内容 -->
          <a-descriptions bordered :title="storyChapter.title" size="small">
            <template #extra>
              <a-button-group>
                <a-button @click="showChapterForm(storyChapter, index)"
                  ><Icon
                    icon="uil:edit"
                    class="vel-icon icon"
                    aria-hidden="true"
                    style="margin-right: 1px"
                    size="16"
                /></a-button>
                <a-button @click="removeChapter(index)"
                  ><Icon
                    icon="fluent:delete-32-regular"
                    class="vel-icon icon"
                    aria-hidden="true"
                    style="margin-right: 1px"
                    size="16"
                /></a-button>
                <a-button v-if="index > 0" @click="chapterMoveUp(index)"
                  ><Icon
                    icon="octicon:move-to-top-24"
                    class="vel-icon icon"
                    aria-hidden="true"
                    style="margin-right: 1px"
                    size="16"
                /></a-button>
              </a-button-group>
            </template>
            <a-descriptions-item label="章节标题" :span="3" :style="{ width: '180px' }">{{
              storyChapter.title
            }}</a-descriptions-item>
            <a-descriptions-item label="章节描述" :span="3" :style="{ width: '180px' }">{{
              storyChapter.description
            }}</a-descriptions-item>
          </a-descriptions>
          <!-- 章节的分镜内容 -->
          <div style="margin-top: 15px">
            <a-button
              @click="showStoryPictureForm(null, index)"
              style="margin-bottom: 5px"
              size="small"
            >
              <Icon
                icon="gg:add"
                class="vel-icon icon"
                aria-hidden="true"
                style="margin-right: 1px"
                size="16"
              />添加分镜</a-button
            >
            <a-table
              :dataSource="storyChapter.storyPictureList"
              rowKey="id"
              :loading="globalItemLoading"
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
              <!-- <a-table-column
                title="状态"
                dataIndex="taskState"
                key="taskState"
                align="center"
                width="120px"
              >
                <template #default="{ record }">
                  <a-tag :color="tagColor(record.taskState)"> {{ record.taskState }} </a-tag>
                </template>
              </a-table-column> -->

              <a-table-column
                title="分镜描述"
                width="250px"
                dataIndex="description"
                key="description"
                align="center"
              />
              <a-table-column title="执行prompt" dataIndex="prompt" key="prompt" align="center"   width="250px">
                <template #default="{ record }">
                  <div v-if="record.imageInfo?.prompt">
                    {{record.imageInfo?.prompt}}
                  </div>
                  
                    <div v-else>
                      <span>未指定AI生成</span>
                    </div>
                 
                </template>
              </a-table-column>

              <a-table-column title="分镜图片" dataIndex="imageUrl" key="imageUrl" align="center"   width="160px">
                <template #default="{ record }">
                  <div v-if="record.imageInfo?.url">
                    <a-image :src="record.imageInfo?.url" :width="150" :preview="true" />
                  </div>
                  <div v-else>
                    <div v-if="record.imageInfo?.taskId">
                      <div v-if="record.imageInfo?.taskState !== 'FINISHED'">
                        <a-tag :color="tagColor(record.imageInfo.taskState)">
                          {{ record.imageInfo.taskState }}
                        </a-tag>
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
                      ><Icon
                        icon="uil:edit"
                        class="vel-icon icon"
                        aria-hidden="true"
                        style="margin-right: 1px"
                        size="16"
                    /></a-button>
                    <a-button type="primary" danger @click="removeStoryPictureForm(record, index)"
                      ><Icon
                        icon="fluent:delete-32-regular"
                        class="vel-icon icon"
                        aria-hidden="true"
                        style="margin-right: 1px"
                        size="16"
                    /></a-button>
                    <a-button type="primary" @click="storyPictureMoveUp(record, index)"
                      ><Icon
                        icon="octicon:move-to-top-24"
                        class="vel-icon icon"
                        aria-hidden="true"
                        style="margin-right: 1px"
                        size="16"
                    /></a-button>
                  </a-button-group>
                </template>
              </a-table-column>
            </a-table>
          </div>
        </div>
      </div>
    </div>

    <!-- 角色modal -->
    <a-modal
      v-model:open="storyRoleForm.viewFlag"
      title="角色编辑"
      @cancel="closeStoryRoleForm"
      :bodyStyle="{ padding: 0 }"
    >
      <template #footer>
        <a-button @click="closeStoryRoleForm">取消</a-button>

        <a-button type="primary" target="" @click="saveStoryRoleForm">保存</a-button>
        <a-popconfirm
          title="是否确认清空当前关联的图片？"
          ok-text="确认"
          cancel-text="取消"
          @confirm="resetRoleForm"
        >
          <a-button type="warning" target="">清空</a-button>
        </a-popconfirm>
      </template>
      <a-spin :spinning="globalItemLoading">
        <a-form
          layout="vertical"
          :model="storyRoleForm"
          ref="storyRoleFormRef"
          style="padding: 10 10px"
        >
          <a-row style="margin-top: 20px; padding: 0 10px">
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
              <span style="padding: 3px 10px; color: rgb(0 0 0 / 70%); font-size: 10px">
                <Icon icon="flat-color-icons:idea" color="#91C8E4" />
                注意下，只有配置了角色别名的时候。在分镜描述中包含该角色名才能使用该角色图片进行风格和一致性进行处理。如果效果不佳，可以自己手动处理。更多的优化建议可以私下我</span
              >
            </div>
          </a-row>

          <a-row style="padding: 0 15px">
            <a-col :span="24">
              <a-form-item
                label="角色名"
                :name="['item', 'roleName']"
                :rules="[{ required: true, message: '请输入角色名!' }]"
              >
                <a-input
                  show-count
                  :maxlength="15"
                  v-model:value="storyRoleForm.item.roleName"
                  placeholder="请输入角色名"
                />
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
                  placeholder="请输入角色描述"
                  :rows="3"
                  :maxlength="128"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="启用风格一致性（配合故事的风格图片）">
                <a-switch
                  v-model:checked="storyRoleForm.item.imageInfo.enableSref"
                  checked-children="开"
                  un-checked-children="关"
                />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item
                label="角色别名（不填则使用角色描述替换）"
                :name="['item', 'alias']"
                :rules="[{ required: false, message: '请输入角色别名!' }]"
              >
                <a-textarea
                  v-model:value="storyRoleForm.item.alias"
                  placeholder="角色名：小白 角色别名：一只小白猫 分镜：小白看着天空发呆 -> 一只小白猫看着天空发呆"
                  :rows="3"
                  :maxlength="64"
                />
              </a-form-item>
            </a-col>

            <a-col :span="24" v-if="storyRoleForm.item.imageInfo?.url">
              <a-form-item
                label="角色图片(用于后续画面的一致性处理)"
                :name="['item', 'imageInfo', 'url']"
                :rules="[{ required: false, message: '角色图片!' }]"
              >
                <a-image :width="200" :src="storyRoleForm.item.imageInfo?.url" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-tabs
                ref="formRef"
                v-model:activeKey="storyRoleForm.item.imageInfo.tabKey"
                @change="changeBillingCount"
              >
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
                  <a-row>
                    <a-textarea
                      style="width: 100%"
                      v-model:value="storyRoleForm.item.imageInfo.prompt"
                      placeholder="输入生成的prompt,可以输入中文，不填就默认使用描述生成"
                      :rows="3"
                      show-count
                      :maxlength="300"
                    />
                  </a-row>
                  <a-row v-if="storyRoleForm.item.imageInfo.taskId" style="margin-top: 20px">
                    <span>可选图片：</span>
                    <div
                      v-if="
                        storyRoleForm.item.imageInfo.mjUrls &&
                        storyRoleForm.item.imageInfo.mjUrls.length > 1
                      "
                    >
                      <a-image
                        v-for="(url, index) in storyRoleForm.item.imageInfo.mjUrls"
                        @click="() => (storyRoleForm.item.imageInfo.url = url)"
                        :key="index"
                        :src="url"
                        :width="120"
                        :preview="false"
                      />
                    </div>
                  </a-row>
                </a-tab-pane>
                <a-tab-pane key="HAND">
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

    <!-- 故事章节Modal -->
    <a-modal
      v-model:open="storyChapterForm.viewFlag"
      title="章节编辑"
      @cancel="closeChapterForm"
      :bodyStyle="{ padding: 0 }"
    >
      <template #footer>
        <a-button @click="closeChapterForm">取消</a-button>

        <a-button type="primary" target="" @click="saveChapterForm">保存</a-button>
      </template>
      <a-spin :spinning="globalItemLoading">
        <a-form
          layout="vertical"
          :model="storyChapterForm"
          ref="storyChapterFormRef"
          style="padding: 10 10px"
        >
          <a-row style="padding: 0 15px">
            <a-col :span="24">
              <a-form-item
                label="章节标题"
                :name="['item', 'title']"
                :rules="[{ required: true, message: '请输入章节标题!' }]"
              >
                <a-input
                  show-count
                  :maxlength="15"
                  v-model:value="storyChapterForm.item.title"
                  placeholder="请输入章节标题"
                />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item
                label="章节描述"
                :name="['item', 'description']"
                :rules="[{ required: false, message: '请输入章节描述!' }]"
              >
                <a-textarea
                  v-model:value="storyChapterForm.item.description"
                  placeholder="请输入章节描述"
                  :rows="3"
                  show-count
                  :maxlength="60"
                />
              </a-form-item>
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
      :bodyStyle="{ padding: 0 }"
    >
      <template #footer>
        <a-button @click="closeStoryPictureForm">取消</a-button>

        <a-button type="primary" target="" @click="savePictureForm">保存</a-button>
        <a-popconfirm
          title="是否确认清空当前关联的图片？"
          ok-text="确认"
          cancel-text="取消"
          @confirm="resetPictureForm"
        >
          <a-button type="warning" target="">清空</a-button>
        </a-popconfirm>
      </template>
      <a-spin :spinning="globalItemLoading">
        <a-form
          layout="vertical"
          :model="storyPictureForm"
          ref="storyPictureFormRef"
          style="padding: 10 10px"
        >
          <a-row style="padding: 0 15px">
            <a-col :span="24">
              <a-form-item
                label="字幕"
                :name="['item', 'caption']"
                :rules="[{ required: true, message: '请输入字幕!' }]"
              >
              <a-textarea
              v-model:value="storyPictureForm.item.caption"
                  placeholder="请输入字幕"
                  :rows="3"
                  :maxlength="128"
                  show-count
                />
               
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item
                label="分镜描述"
                :name="['item', 'description']"
                :rules="[{ required: true, message: '请输入分镜画面描述!' }]"
              >
              <a-textarea
              v-model:value="storyPictureForm.item.description"
                  placeholder="请输入分镜画面描述"
                  :rows="3"
                  :maxlength="128"
                  show-count
                />
                
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="启用风格一致性（配合故事的风格图片）">
                <a-switch
                  v-model:checked="storyPictureForm.item.imageInfo.enableSref"
                  checked-children="开"
                  un-checked-children="关"
                />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="启用角色一致性（配合主角的图片）">
                <a-switch
                  v-model:checked="storyPictureForm.item.imageInfo.enableCref"
                  checked-children="开"
                  un-checked-children="关"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24" v-if="storyPictureForm.item.imageInfo?.url">
              <a-form-item
                label="分镜图片"
                :name="['item', 'imageInfo', 'url']"
                :rules="[{ required: false, message: '分镜图片' }]"
              >
                <a-image :width="200" :src="storyPictureForm.item.imageInfo?.url" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-tabs
                ref="formRef"
                v-model:activeKey="storyPictureForm.item.imageInfo.tabKey"
                @change="changeBillingCount"
              >
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
                  <a-row>
                    <a-textarea
                      style="width: 100%"
                      v-model:value="storyPictureForm.item.imageInfo.prompt"
                      placeholder="输入生成的prompt,可以输入中文，不填就默认使用描述生成"
                      :rows="3"
                      show-count
                      :maxlength="300"
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

                  <a-row v-if="storyPictureForm.item.imageInfo.taskId" style="margin-top: 20px">
                    <span>可选图片：</span>
                    <div
                      v-if="
                        storyPictureForm.item.imageInfo.mjUrls &&
                        storyPictureForm.item.imageInfo.mjUrls.length > 1
                      "
                    >
                      <a-image
                        v-for="(url, index) in storyPictureForm.item.imageInfo.mjUrls"
                        @click="() => (storyPictureForm.item.imageInfo.url = url)"
                        :key="index"
                        :src="url"
                        :width="120"
                        :preview="false"
                      />
                    </div>
                  </a-row>
                </a-tab-pane>
                <a-tab-pane key="HAND">
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
  import { ref, defineProps, defineExpose, computed, onMounted, unref, nextTick } from 'vue';
  import { Loading } from '/@/components/Loading';
  import Icon from '/@/components/Icon/Icon.vue';
  import { IdReq } from '/@/api/model/baseModel';
  import AccountGroup from './account_group.vue';
  import {
    genSimpleStory,
    genStory,
    storyList,
    storyRemove,
    storyInfo,
    saveStoryRole,
    genSplitPicture,
    extractSplitContent,
    commitSplitContent,
  } from '/@/api/df/story';
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

  const { createMessage, createSuccessModal, createErrorModal, createInfoModal } = useMessage();
  const { VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL, VITE_GLOB_API_URL_PREFIX, VITE_GLOB_UPLOAD_URL } =
    getAppEnvConfig();

  //************************************** 故事分镜 ***********************************//

  // 定义从父组件接收的属性
  const props = defineProps<{
    storySplitForm: any;
  }>();

  const globalItemLoading = ref(false);
  const storySplitForm = ref(props.storySplitForm);

  // const showStorySplitForm = async (item) => {
  //   storySplitForm.value.viewFlag = true;
  //   storySplitForm.value.item = item;
  // };

  // const closeStorySplitForm = async () => {
  //   storySplitForm.value = {
  //     viewFlag: false,
  //     item: null,
  //     loading: false,
  //   };
  // };

  // //提交故事分镜
  // const doCommitSplitContent = async () => {
  //   globalItemLoading.value = true;
  //   try {
  //     const resp = await commitSplitContent(storySplitForm.value.item);
  //     console.log(resp);
  //     storySplitForm.value.viewFlag = false;
  //     //打开明细创建页面
  //     onSearch();
  //   } finally {
  //     globalItemLoading.value = false;
  //   }
  // };

  const srefFileList = ref([]);

  const handleSrefFileChange = async (info: { file: UploadFile; fileList: UploadFile[] }) => {
    console.log('handleChange'); // 日志输出
    if (info.file.status === 'done') {
      if (info.file.response.result === null) {
        info.file.status = 'error';
      } else {
        storySplitForm.value.item.srefUrl = info.file.response.result;
      }
    } else if (info.file.status === 'removed') {
      storySplitForm.value.item.srefUrl = getSuccessFileUrlStr(srefFileList.value)[0];
    }
  };

  const getInitSrefUrl = (url) => {
    console.log('getInitSrefUrl');
    srefFileList.value = [];
    if (url) {
      srefFileList.value = [
        {
          uid: '-1',
          name: 'init.png',
          status: 'done',
          url: url,
        },
      ];
    }
  };

  // 使用defineExpose暴露方法给父组件
  defineExpose({
    getInitSrefUrl,
  });

  /*********************************** 角色 ******************************** */

  const storyRoleForm = ref({
    viewFlag: false,
    addFlag: false,
    loading: false,
    item: {
      roleName: null,
      description: null,
      prompt: null,
    },
  });

  const resetRoleForm = () => {
    storyRoleForm.value.item.imageInfo.taskId = null;
    storyRoleForm.value.item.imageInfo.url = null;
    storyRoleForm.value.item.imageInfo.mjUrls = [];
  };

  const closeStoryRoleForm = () => {
    storyRoleForm.value.addFlag = false;
    storyRoleForm.value.viewFlag = false;
  };
  const saveStoryRoleForm = () => {
    // let index = storyPictureForm.value.chapterIndex;
    // let indexItem = storyRoleForm.value.item.key;
    if (storyRoleForm.value.addFlag) {
      //新增
      storySplitForm.value.item.storyRoleList.push(storyRoleForm.value.item);
    } else {
      // storySplitForm.value.item.storyRoleList[indexItem] = storyRoleForm.value.item;
    }
    storyRoleForm.value.viewFlag = false;
  };
  const removeStoryRoleForm = (item) => {
    const index = storySplitForm.value.item.storyRoleList.findIndex(
      (i) => i.roleName === item.roleName,
    );
    storySplitForm.value.item.storyRoleList.splice(index, 1);
  };
  const showStoryRoleForm = (item) => {
    //新增场景
    if (item === null) {
      storyRoleForm.value.addFlag = true;
      item = {
        roleName: null,
        description: null,
        prompt: null,
      };
    }
    //图片清空
    roleFileList.value = [];
    if (item.imageInfo === null || item.imageInfo === undefined) {
      item.imageInfo = {
        tabKey: 'AI',
        enableSref: true,
        enableCref: true,
      };
    } else if (item.imageInfo && item.imageInfo.url) {
      //初始化图片
      // roleFileList.value = [
      //   {
      //     uid: '-1',
      //     name: 'init.png',
      //     status: 'done',
      //     url: item.imageInfo.url,
      //   },
      // ];
    }
    console.log('showStoryRoleForm');
    storyRoleForm.value.item = item;

    storyRoleForm.value.viewFlag = true;
  };

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

  /********************************* 分镜 **************************** */

  const storyPictureForm = ref({
    chapterIndex: null,
    addFlag: false,
    viewFlag: false,
    loading: false,
    item: {
      caption: null,
      description: null,
      prompt: null,
    },
  });

  const savePictureForm = () => {
    let index = storyPictureForm.value.chapterIndex;
    // const indexItem = storySplitForm.value.item.storyChapterList[index].storyPictureList.findIndex(
    //   (i) => i.description === storyPictureForm.value.item.description,
    // );

    console.log('savePictureForm...');
    if (storyPictureForm.value.addFlag) {
      //新增
      storySplitForm.value.item.storyChapterList[index].storyPictureList.push(
        storyPictureForm.value.item,
      );
    } else {
      // storySplitForm.value.item.storyChapterList[index].storyPictureList[indexItem] =
      //   storyPictureForm.value.item;
    }

    storyPictureForm.value.viewFlag = false;
  };

  const resetPictureForm = () => {
    storyPictureForm.value.item.imageInfo.taskId = null;
    storyPictureForm.value.item.imageInfo.url = null;
    storyPictureForm.value.item.imageInfo.mjUrls = [];
  };
  const closeStoryPictureForm = () => {
    storyPictureForm.value.viewFlag = false;
  };
  const removeStoryPictureForm = (item, index) => {
    console.log('removeStoryPictureForm');
    const indexItem = storySplitForm.value.item.storyChapterList[index].storyPictureList.findIndex(
      (i) => i.description === item.description,
    );
    storySplitForm.value.item.storyChapterList[index].storyPictureList.splice(indexItem, 1);
  };

  const storyPictureMoveUp = (item, index) => {
    console.log('storyPictureMoveUp');

    const indexItem = storySplitForm.value.item.storyChapterList[index].storyPictureList.findIndex(
      (i) => i.description === item.description,
    );
    
    // 如果找到了 id 为 1 的记录，并且索引大于 0
    if (indexItem > 0) {
      // 交换记录
      const temp =
        storySplitForm.value.item.storyChapterList[index].storyPictureList[indexItem - 1];
      storySplitForm.value.item.storyChapterList[index].storyPictureList[indexItem - 1] =
        storySplitForm.value.item.storyChapterList[index].storyPictureList[indexItem];
      storySplitForm.value.item.storyChapterList[index].storyPictureList[indexItem] = temp;
    }
  };
  const showStoryPictureForm = (item, index) => {
    //新增场景
    storyPictureForm.value.addFlag = false;
    if (item === null) {
      storyPictureForm.value.addFlag = true;
      item = {
        caption: null,
        description: null,
      };
    }
    pictureFileList.value = [];
    if (item.imageInfo === null || item.imageInfo === undefined) {
      item.imageInfo = {
        tabKey: 'AI',
        enableSref: true,
        enableCref: true,
      };
      
    } else if (item.imageInfo && item.imageInfo.url) {
      //初始化图片
      // pictureFileList.value = [
      //   {
      //     uid: '-1',
      //     name: 'init.png',
      //     status: 'done',
      //     url: item.imageInfo.url,
      //   },
      // ];
    }
    console.log('showStoryRoleForm');
    storyPictureForm.value.chapterIndex = index;
    storyPictureForm.value.item = item;
    storyPictureForm.value.viewFlag = true;
  };

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

  /********************************* 章节 **************************** */
  const storyChapterForm = ref({
    chapterIndex: null,
    viewFlag: false,
    loading: false,
    item: {},
  });

  const showChapterForm = (item, index) => {
    if (item === null) {
      item = {};
    }
    storyChapterForm.value.chapterIndex = index;
    storyChapterForm.value.item = item;
    storyChapterForm.value.viewFlag = true;
  };

  const closeChapterForm = () => {
    storyChapterForm.value.viewFlag = false;
  };

  const saveChapterForm = () => {
    console.log('saveChapterForm');
    if (storyChapterForm.value.chapterIndex === null) {
      //新增
      storyChapterForm.value.item.storyPictureList = [];
      storySplitForm.value.item.storyChapterList.push(storyChapterForm.value.item);
    } else {
      storySplitForm.value.item.storyChapterList[storyChapterForm.value.chapterIndex] =
        storyChapterForm.value.item;
    }
    storyChapterForm.value.viewFlag = false;
  };

  const chapterMoveUp = (index) => {
    if (index > 0) {
      const temp = storySplitForm.value.item.storyChapterList[index - 1];
      storySplitForm.value.item.storyChapterList[index - 1] =
        storySplitForm.value.item.storyChapterList[index];
      storySplitForm.value.item.storyChapterList[index] = temp;
    }
  };
  const removeChapter = (index) => {
    storySplitForm.value.item.storyChapterList.splice(index, 1);
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

  const tagColor = (status) => {
    //状态 PENDING:排队中 EXECUTING:执行中 FINISHED:已完成 FAIL:失败 取消:CANCEL 中断：DOWN
    console.log(status);
    switch (status) {
      case 'SUCCESS':
        return '#339966';
      case 'FAILED':
        return '#cd201f';
      case 'CANCEL':
        return '#faeeef';
      case 'QUEUED':
        return '#b4b4a4';
      case 'RUNNING':
        return '#8cc0aa';
      case 'READY':
        return '#afcce0';
      case 'DOWN':
        return '#e4abb1';
      default:
        return 'default';
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
