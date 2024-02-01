<template>
  <div ref="formRef">
    <div
      style="width: 270px"
      :style="{ height: `calc(${contentHeight - 1}px`, overflow: 'auto' }"
      mode="inline"
    >
      <div
        v-for="categoryItem in collectCategoryViewForm.collectCategoryList"
        :key="categoryItem.id"
      >
        <div
          style="margin: 4px; padding-left: 14px"
          class="custom-menu"
          @mouseover="doMouseover(categoryItem)"
          :class="calItemClass(categoryItem)"
        >
          <a-row style="height: 40px">
            <a-col flex="auto" style="height: 100%" @click="doClick(categoryItem)">
              <span
                :class="{
                  'parent-item-selected': isParentItemSelected(categoryItem),
                }"
                style="display: flex; align-items: center; height: 40px; font-size: 14px"
                >{{ categoryItem.title }}</span
              >
            </a-col>
            <a-col
              flex="50px"
              style="display: flex; align-items: center; justify-content: flex-end; height: 40px"
            >
              <span @click="setChildrenShow(categoryItem)" v-if="categoryItem.children.length > 0">
                <SvgIcon
                  v-if="categoryItem.childShow && categoryItem.childShow === true"
                  name="up"
                />
                <SvgIcon v-else name="down" />
              </span>
              <a-dropdown>
                <span style="padding: 8px"> <SvgIcon name="menu2" /> </span>
                <template #overlay>
                  <a-menu>
                    <a-popconfirm
                      :title="'【' + categoryItem.title + '】删除提示'"
                      ok-text="立即删除"
                      cancel-text="取消"
                      @confirm="deleteCollectCategory(categoryItem)"
                    >
                      <a-menu-item v-if="categoryItem.sort > 0"> 删除分类 </a-menu-item>
                    </a-popconfirm>

                    <a-menu-item @click="() => modifyView(categoryItem)"> 修改分类 </a-menu-item>
                    <a-menu-item v-if="categoryItem.sort > 0" @click="() => doSetTop(categoryItem)">
                      置顶
                    </a-menu-item>
                    <a-menu-item @click="() => showAddView(categoryItem)"> 新增子分类 </a-menu-item>
                    <a-menu-item @click="() => openCollectShareView(categoryItem)">
                      分享收藏
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-col>
          </a-row>
        </div>
        <div
          v-if="categoryItem.childShow && categoryItem.childShow === true"
          class="item-background"
        >
          <div v-for="childItem in categoryItem.children" :key="childItem.id">
            <div
              style="margin: 4px"
              class="custom-menu"
              @click="doClick(childItem)"
              @mouseover="doMouseover(childItem)"
              :class="calItemClass(childItem)"
            >
              <a-row style="height: 40px; padding-left: 32px">
                <a-col flex="auto" style="height: 100%">
                  <span style="display: flex; align-items: center; height: 40px">{{
                    childItem.title
                  }}</span>
                </a-col>

                <a-col
                  flex="32px"
                  style="display: flex; align-items: center; justify-content: right; height: 40px"
                >
                  <a-dropdown>
                    <span style="padding: 8px"> <SvgIcon name="menu2" /> </span>
                    <template #overlay>
                      <a-menu>
                        <a-popconfirm
                          :title="'【' + childItem.title + '】删除提示'"
                          ok-text="立即删除"
                          cancel-text="取消"
                          @confirm="deleteCollectCategory(childItem)"
                        >
                          <a-menu-item> 删除分类 </a-menu-item>
                        </a-popconfirm>

                        <a-menu-item @click="() => modifyView(childItem)"> 修改分类 </a-menu-item>
                        <a-menu-item @click="() => openCollectShareView(childItem)">
                          分享收藏
                        </a-menu-item>
                        <!-- <a-menu-item @click="() => showAddView(childItem)">
                          新增子分类
                        </a-menu-item> -->
                      </a-menu>
                    </template>
                  </a-dropdown>
                </a-col>
              </a-row>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑封面类 -->
    <a-modal
      v-model:open="categoryDataViewForm.viewFlag"
      :title="categoryDataViewForm.title"
      ok-text="提交"
      @ok="addCollectCategory"
      @cancel="closedView"
      :confirmLoading="categoryDataViewForm.loading"
    >
      <a-card>
        <a-form layout="vertical">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item label="收藏分类名称">
                <a-input
                  v-model:value="categoryDataForm.title"
                  placeholder="输入分类名称"
                  show-count
                  :maxlength="13"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>

    const collectShare = ref({ viewFlag: false, loading: false, collectCategoryId: null, : 'N', :
    null, promptView: false, : null, });
    <!-- 分享收藏 -->
    <a-modal
      v-model:open="collectShareFrom.viewFlag"
      title="收藏分享"
      ok-text="提交"
      @ok="doSaveOrUpdateShare"
      :confirmLoading="collectShareFrom.loading"
    >
      <a-card>
        <a-form :model="collectShareFrom" layout="vertical" ref="collectShareFromRef">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: false,
                    message: '分类名称',
                  },
                ]"
                name="collectCategoryTitle"
              >
                <template #label>
                  <span
                    ><Icon
                      icon="ic:sharp-account-box"
                      class="vel-icon icon"
                      aria-hidden="true"
                    />要分享的分类名
                  </span>
                </template>
                <a-input
                  disabled
                  v-model:value="collectShareFrom.collectCategoryTitle"
                  placeholder="输入分类名"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: '请选择是否显示Prompt',
                  },
                ]"
                name="promptChargeFlag"
              >
                <template #label>
                  <span
                    ><Icon
                      icon="lucide:view"
                      class="vel-icon icon"
                      aria-hidden="true"
                    />是否显示Prompt
                  </span>
                </template>

                <a-select
                  style="width: 100%"
                  v-model:value="collectShareFrom.promptChargeFlag"
                  placeholder="是否显示Prompt"
                >
                  <a-select-option value="Y">显示Prompt</a-select-option>
                  <a-select-option value="N">不显示Prompt</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: false,
                    message: '访问密码',
                  },
                ]"
                name="password"
              >
                <template #label>
                  <span
                    ><Icon
                      icon="teenyicons:password-solid"
                      class="vel-icon icon"
                      aria-hidden="true"
                    />访问密码（为空则可允许直接访问）
                  </span>
                </template>
                <a-input v-model:value="collectShareFrom.password" placeholder="输入访问密码" />
              </a-form-item>
            </a-col>
            <a-col
              :span="24"
              v-if="collectShareFrom.password && collectShareFrom.password.length > 0"
            >
              <a-form-item
                :rules="[
                  {
                    required: false,
                    message: '查看价格',
                  },
                ]"
                name="price"
              >
                <template #label>
                  <span
                    ><Icon
                      icon="solar:tag-price-bold"
                      class="vel-icon icon"
                      aria-hidden="true"
                    />查看价格（配置密码时，允许用户支付获取密码）
                  </span>
                </template>
                <a-input-number
                  v-model:value="collectCategoryViewForm.price"
                  style="width: 100%"
                  :min="1"
                  :max="2"
                  placeholder="输入查看价格"
                  :step="0.01"
                  string-mode
                />
              </a-form-item>
            </a-col>
            <a-card title="分享链接" style="width: 100%">
              <a-row>
                <a-col :span="24">
                  <a-input-group compact :bordered="false" style="width: 100%">
                    <a-input
                      v-model:value="collectShareFrom.linkUrl"
                      style="width: calc(100% - 40px)"
                      disabled
                    />
                    <a-button @click="copyText(collectShareFrom.linkUrl)" style="width: 40px">
                      <template #icon>
                        <Icon icon="solar:copy-bold" class="vel-icon icon" aria-hidden="true" />
                      </template>
                    </a-button>
                  </a-input-group>
                </a-col>
              </a-row>
            </a-card>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { h, ref, onMounted, unref, computed, reactive, watch } from 'vue';
  import {
    MailOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    SettingOutlined,
  } from '@ant-design/icons-vue';
  import { SvgIcon } from '/@/components/Icon';
  import Icon from '/@/components/Icon/Icon.vue';
  import {
    deleteCategory,
    allCollectCategory,
    saveCategory,
    selectOptions,
    setTop,
  } from '/@/api/df/drawCollectCategory';
  import { drawCollectCategoryApi } from '../mj/accountInfo';
  import { collectCategoryApi } from './category';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { copyText } from '/@/utils/copyTextToClipboard';
  import {
    saveOrUpdate,
    showShareTaskList,
    showShareView,
    collectShareInfo,
  } from '/@/api/df/drawCollectShare';

  const {
    categoryDataForm,
    categoryDataViewForm,
    globalForm,
    globalLoading,
    // 方法
    init,
    doSetTop,
    clickMenu,
    showAddView,
    closedView,
    modifyView,
    addCollectCategory,
    deleteCollectCategory,
  } = collectCategoryApi();

  const {
    collectCategoryViewForm,
    collectTaskForm,
    initAllCollectCategory,
    showAddCollectCategoryModel,
    showMoveCollectCategoryModel,
    closeCollectCategoryModel,

    addToCollectCategory,
    removeFromCollectCategory,
  } = drawCollectCategoryApi();

  const formRef = ref();
  //页面高度处理
  const button = ref(null);
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 0);
  const offsetHeightRef = ref(0);
  const subtractHeightRefs = ref([]);

  // 使用hook
  const { contentHeight } = useContentHeight(
    computed(() => true),
    formRef,
    unref(subtractHeightRefs), // 使用 unref 获取数组值
    unref(substractSpaceRefs),
    upwardSpace,
    offsetHeightRef,
  );

  const menuEventForm = reactive({
    clickItem: null,
    mouseoverItem: null,
  });

  const doMouseover = (item) => {
    menuEventForm.mouseoverItem = item;
  };

  const doClick = (item) => {
    menuEventForm.clickItem = item;
    // globalForm.value.currentCategoryId = item.id;
    // globalForm.value.currentCategoryTitle = item.title;
    clickMenu(item);
    console.log(globalForm.value.currentCategoryId);
  };
  const setChildrenShow = (item) => {
    if (item.childShow === null) {
      item.childShow = true;
    } else {
      item.childShow = !item.childShow;
    }
  };

  const calItemClass = (item) => {
    if (menuEventForm.clickItem && menuEventForm.clickItem.id === item.id) {
      return {
        'item-selected': true,
        'item-mouseover': false,
      };
    }

    return {
      'item-selected': menuEventForm.clickItem && menuEventForm.clickItem.id === item.id,
      'item-mouseover': menuEventForm.mouseoverItem && menuEventForm.mouseoverItem.id === item.id,
    };
  };

  const isParentItemSelected = (item) => {
    return menuEventForm.clickItem && menuEventForm.clickItem.parentId === item.id;
  };

  onMounted(() => {
    init();
  });

  /***********************************收藏分享******************************* */
  const collectShareFrom = ref({
    viewFlag: false,
    loading: false,
    collectCategoryTitle: null,
    collectCategoryId: null,
    promptChargeFlag: 'N',
    price: null,
    promptView: false,
    password: null,
    linkUrl: null,
  });
  const openCollectShareView = async (item) => {
    collectShareFrom.value.viewFlag = true;
    collectShareFrom.value.loading = true;
    try {
      const resp = await collectShareInfo({ id: item.id });
      // const resp = respObj.result;
      console.log(resp);
      collectShareFrom.value.promptChargeFlag = resp ? resp.promptChargeFlag : 'N';
      collectShareFrom.value.price = resp ? resp.price : null;
      collectShareFrom.value.promptView = resp ? resp.promptView : false;
      collectShareFrom.value.password = resp ? resp.password : null;
    } finally {
      collectShareFrom.value.loading = false;
    }
    collectShareFrom.value.collectCategoryTitle = item.title;
    collectShareFrom.value.collectCategoryId = item.id;

    const base64Encoded = btoa(item.id);
    const currentDomain = window.location.origin;
    collectShareFrom.value.linkUrl =
      currentDomain + '/open/drawCollectShare/showShareView/' + base64Encoded;
    console.log(collectShareFrom.value.linkUrl);
  };

  const collectShareFromRef = ref();
  const doSaveOrUpdateShare = async () => {
    collectShareFrom.value.loading = true;
    try {
      await collectShareFromRef.value.validate();
      saveOrUpdate(collectShareFrom.value);
      collectShareFrom.value.viewFlag = false;
    } finally {
      collectShareFrom.value.loading = false;
    }
  };
</script>

<style scoped>
  .custom-menu {
    transition:
      border 0.3s ease,
      border-radius 0.3s ease; /* 添加过渡效果 */

    border: 1px solid transparent; /* 初始边框样式 */
    border-radius: 10px;
    cursor: pointer;
  }

  .item-mouseover {
    background: rgb(0 0 0 / 6%);
  }

  .custom-menu p {
    margin: 0; /* 清除段落的默认外边距 */
  }
</style>
