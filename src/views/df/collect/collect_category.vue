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
                        <a-menu-item @click="() => showAddView(childItem)">
                          新增子分类
                        </a-menu-item>
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
