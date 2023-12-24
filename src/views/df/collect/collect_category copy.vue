<template>
  <div ref="formRef">
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      style="width: 456px"
      :style="{ height: `calc(${contentHeight - 1}px`, overflow: 'auto' }"
      mode="inline"
    >
      <div
        v-for="categoryItem in collectCategoryViewForm.collectCategoryList"
        :key="categoryItem.id"
      >
        <a-sub-menu :key="categoryItem.id" icon="AppstoreOutlined">
          <template #title>
            <div class="menu-item-content">
              <span>{{ categoryItem.title }} - {{ categoryItem.id }}</span>
              <a-dropdown>
                <a-button type="text"><SvgIcon name="menu2" trigger="click" /></a-button>
                <template #overlay>
                  <a-menu>
                    <!-- <a-popconfirm
                      :title="'【' + categoryItem.title + '】删除提示'"
                      ok-text="立即删除"
                      cancel-text="取消"
                      @confirm="deleteCollectCategory(categoryItem.id)"
                    >
                      <a-menu-item> 删除分类 </a-menu-item>
                    </a-popconfirm> -->

                    <a-menu-item @click="() => modifyView(categoryItem)"> 修改分类 </a-menu-item>
                    <a-menu-item @click="() => showAddView(categoryItem)"> 新增子分类 </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </template>
          <div v-for="childItem in categoryItem.children" :key="childItem.id">
            <a-menu-item icon="MailOutlined" :key="childItem.id" v-if="!childItem.hideFlag">
              <div class="menu-item-content">
                <span>{{ childItem.title }} - {{ childItem.id }}</span>
                <a-dropdown>
                  <a-button type="text"> <SvgIcon name="menu2" /></a-button>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="() => deleteCollectCategory(childItem)">
                        删除分类
                        <!-- <a-popconfirm
                          :title="'【' + childItem.title + '】删除提示'"
                          ok-text="立即删除"
                          cancel-text="取消"
                          @confirm="deleteCollectCategory(childItem.id)"
                        >
                          删除分类
                        </a-popconfirm> -->
                      </a-menu-item>

                      <a-menu-item @click="() => modifyView(childItem)"> 修改分类 </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </a-menu-item>
          </div>
        </a-sub-menu>
        <!-- <a-menu-item v-else :key="categoryItem.id" icon="MailOutlined">
          <div class="menu-item-content">
            <span>{{ categoryItem.title }}</span>

            <a-dropdown>
              <a-button type="text"><SvgIcon name="menu2" trigger="click" /></a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="() => deleteCollectCategory(categoryItem.id)">
                    删除分类
                  </a-menu-item>
                  <a-menu-item @click="() => modifyView(categoryItem)"> 修改分类 </a-menu-item>
                  <a-menu-item @click="() => showAddView(categoryItem)"> 新增子分类 </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </a-menu-item> -->
      </div>
    </a-menu>

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
                <a-input v-model:value="categoryDataForm.title" placeholder="输入分类名称" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { h, ref, onMounted, unref, computed } from 'vue';
  import {
    MailOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    SettingOutlined,
  } from '@ant-design/icons-vue';
  import type { MenuTheme } from 'ant-design-vue';
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
    // 方法
    init,
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

  const selectedKeys = ref(['1']);
  const openKeys = ref(['sub1']);

  onMounted(() => {
    init();
  });
</script>

<style scoped>
  .menu-item-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
</style>
