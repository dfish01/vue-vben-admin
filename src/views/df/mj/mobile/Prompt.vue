<template>
  <a-drawer
    ref="promptFormRef"
    class="drawer"
    :bodyStyle="{ padding: '0px' }"
    width="100%"
    :visible="isDrawerVisible"
    title="3600+关键词"
    @close="handleDrawerClose(false)"
    @afterOpenChange="calculateHeights"
  >
    <template #extra>
      <a-row style="display: flex; justify-content: space-between; height: 20px">
        <a-col>
          <div style="justify-content: left; margin-right: 10px">
            <a-tooltip title="右键可添加到收藏哦~设置好权重值后，记得启用哦~">
              <Icon icon="icon-park-solid:info" />
            </a-tooltip>
          </div>
        </a-col>
        <a-col>
          <div>
            <a-button
              size="small"
              style="margin-right: 8px"
              type="primary"
              @click="handleDrawerClose(true)"
              >启用</a-button
            >
          </div>
        </a-col>
      </a-row>
    </template>

    <a-card :bodyStyle="{ padding: '0px 0px 0px 0px' }">
      <div v-loading="loadingRef" style="overflow: hidden">
        <div ref="promptCategoryRef">
          <a-card :bodyStyle="{ padding: '1px 1px 0px 0px' }">
            <a-row
              :gutter="[1, 3]"
              :wrap="true"
              style="display: flex; justify-content: space-around"
            >
              <a-col
                v-for="category in categories"
                :key="category.categoryCode"
                class="category-col"
              >
                <div class="row-wapper" style="border-radius: 10%">
                  <a-checkable-tag
                    :checked="selectedCategory === category.categoryCode"
                    @change="handleCategoryClick(category.categoryCode)"
                    class="category-col-tag"
                  >
                    {{ category.categoryName }}
                  </a-checkable-tag>
                </div>
              </a-col>
              <a-col class="category-col">
                <div style="display: flex; align-items: center">
                  <a-input
                    v-model:value="queryName"
                    placeholder="输入艺术家吧！"
                    style="width: 200px; height: 32px"
                  />
                  <a-button style="height: 32px" @click="onSearch(1)">查询</a-button>
                </div>
              </a-col>
            </a-row>
          </a-card>
        </div>
        <!-- 列表项 -->
        <div
          v-if="items.length === 0"
          style="display: flex; align-items: center; justify-content: center"
        >
          <a-empty :image="simpleImage" />
        </div>
        <div
          v-else
          :style="{
            height: `calc(${windowHeight}px - ${promptCategoryHeight}px - 115px)`,
            overflowY: 'auto',
          }"
        >
          <a-card
            :style="{ height: '100%', overflow: 'auto' }"
            :bodyStyle="{ padding: '10px 7px 10px 7px', height: '100%' }"
          >
            <a-row :gutter="[3, 7]" wrap style="display: flex; justify-content: space-around">
              <a-col
                v-for="item in items"
                :key="item.id"
                class="item"
                :class="{ 'item-selected': selectedItems[item.id] }"
                @click="() => selectItem(item)"
              >
                <a-dropdown :trigger="['contextmenu']">
                  <div class="prompt-wrapper">
                    <img :src="item.imageUrl" alt="Item Image" />
                    <div class="prompt-wrapper-name">{{ item.question }}</div>
                    <!-- 显示标签 -->

                    <a-popover title="权重值设置" trigger="click">
                      <template #content>
                        <a-input-number
                          size="small"
                          style="width: 50%"
                          :value="getItemValue(item.id)"
                          @change="(value) => handleValueChange(value, item.id)"
                        />
                      </template>
                      <div class="prompt-wrapper-tag-wrapper" @click.stop="togglePopover(item.id)">
                        <a-checkable-tag
                          size="small"
                          :checked="getItemValue(item.id)"
                          v-if="selectedItems[item.id]"
                        >
                          {{ getItemValue(item.id) ? '::' + getItemValue(item.id) : '设置值' }}
                        </a-checkable-tag>
                      </div>
                    </a-popover>
                  </div>

                  <template #overlay>
                    <a-menu>
                      <a-menu-item
                        key="2"
                        v-if="selectedCategory == 'shoucang'"
                        @click="removeUse(item)"
                        >移出收藏</a-menu-item
                      >
                      <a-menu-item key="1" v-else @click="addUse(item)">添加收藏</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-col>
            </a-row>
          </a-card>
        </div>

        <div ref="promptButton" v-if="items && items.length > 0">
          <a-card class="prompt-pagination">
            <a-Pagination
              size="small"
              :current="promptPagination.current"
              :pageSize="promptPagination.pageSize"
              :pageSizeOptions="promptPagination.pageSizeOptions"
              :total="promptPagination.total"
              :showSizeChanger="promptPagination.showSizeChanger"
              :showTotal="promptPagination.showTotal"
              @change="pageChange"
              @showSizeChange="pageSizeChange"
              style="margin-left: 10px"
            />
          </a-card>
        </div>
      </div>
    </a-card>
  </a-drawer>
</template>

<script setup lang="ts">
  import Icon from '/@/components/Icon/Icon.vue';
  import {
    ref,
    onUnmounted,
    computed,
    onMounted,
    onBeforeUnmount,
    unref,
    defineProps,
    defineEmits,
    watch,
    nextTick,
  } from 'vue';
  import { Empty, message } from 'ant-design-vue';
  import { addEnjoyPromptDict, removeEnjoyPromptDict, promptDictQuery } from '/@/api/df/prompt';
  import { PromptDictListResultModel, PromptDictListResp } from '/@/api/df/model/promptModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  const props = defineProps({
    isDrawerVisible: Boolean,
  });

  const emits = defineEmits(['updateData', 'closeDrawer']);

  const handleDrawerClose = (flag) => {
    emits('closeDrawer'); // 通知父组件关闭 Drawer

    // 在这里，你可以添加传递数据到 B 页面的逻辑
    if (flag) {
      emits('updateData', selectedItems.value);
    }
  };

  const promptCategoryHeight = ref(0);
  const windowHeight = ref(window.innerHeight);
  const promptCategoryRef = ref(null);
  const calculateHeights = async () => {
    await nextTick(); // 确保在DOM更新后运行
    console.log(11126);
    // 检查 ref 是否已经关联到 DOM 元素
    if (promptCategoryRef.value) {
      // 直接使用 .offsetHeight 来获取高度，不需querySelector
      promptCategoryHeight.value = promptCategoryRef.value.offsetHeight;
    }
    console.log('高度：' + promptCategoryHeight.value);
  };

  //************************************ 高度自己计算 *************************** */

  // let contentHeight;
  // // 监听 isDrawerVisible 的变化
  const isFirstLoading = ref(true);
  watch(
    () => props.isDrawerVisible,
    (newValue) => {
      if (newValue && isFirstLoading.value) {
        // 只有当 isDrawerVisible 为 true 时才触发
        onSearch(1);
        isFirstLoading.value = false;
      }
    },
  );

  const loadingRef = ref(false);
  // 分页相关 B
  const promptPagination = ref({
    // 表格分页的配置
    current: 1,
    pageSize: 60,
    showSizeChanger: true, // 用于控制展示每页多少条的下拉
    showQuickJumper: true,
    total: 0,
    pageSizeOptions: ['60', '120', '180'],
    showTotal: (total) => `共 ${total} 条`,
    onShowSizeChange: pageSizeChange,
    onChange: pageChange,
  });
  function pageSizeChange(val, pageNum) {
    promptPagination.value.pageSize = pageNum; // 修改每页显示的条数
    // promptPagination.value.current = 1
    onSearch(1);
  }
  function pageChange(page, val) {
    console.log(page, val);
    // promptPagination.value.current = page
    onSearch(page);
  }

  const categories = [
    {
      categoryName: '当前已选',
      categoryCode: 'select',
    },
    {
      categoryName: '我的收藏',
      categoryCode: 'shoucang',
    },
    {
      categoryName: '颜色色彩',
      categoryCode: 'yanse',
    },
    {
      categoryName: '中国元素',
      categoryCode: 'zhongguoyuansu',
    },
    {
      categoryName: '灯光照明',
      categoryCode: 'dengguang',
    },
    {
      categoryName: '构图技巧',
      categoryCode: 'goutujiqiao',
    },
    {
      categoryName: '表现技巧',
      categoryCode: 'biaoxianjiqiao',
    },
    {
      categoryName: '摄影技巧',
      categoryCode: 'sheyingjiqiao',
    },
    {
      categoryName: '人像特征',
      categoryCode: 'renxiang',
    },
    {
      categoryName: '场景地点',
      categoryCode: 'changjing',
    },

    {
      categoryName: '动漫漫画',
      categoryCode: 'dongman',
    },
    {
      categoryName: '插画大师',
      categoryCode: 'chahua',
    },
    {
      categoryName: '画家大师',
      categoryCode: 'huajia',
    },
    {
      categoryName: '摄影大师',
      categoryCode: 'sheyingshi',
    },
    {
      categoryName: '导演名家',
      categoryCode: 'daoyan',
    },
    {
      categoryName: '设计大师',
      categoryCode: 'shejishi',
    },
    {
      categoryName: '建筑设计',
      categoryCode: 'jianzhusheji',
    },
    {
      categoryName: '时尚设计',
      categoryCode: 'shishangsheji',
    },
    {
      categoryName: '街头艺术',
      categoryCode: 'jietouyishu',
    },
    {
      categoryName: '艺术流派',
      categoryCode: 'yishuliupai',
    },
    {
      categoryName: '展览雕塑',
      categoryCode: 'zhanlandiaosu',
    },

    {
      categoryName: '材质材料',
      categoryCode: 'caizhi',
    },
    {
      categoryName: '其他艺术',
      categoryCode: 'qitayisu',
    },
  ];

  const items = ref<PromptDictListResp[]>([]);

  const selectedCategory = ref('shoucang'); // 当前选中的分类
  const showPopover = ref({}); // 存储当前显示气泡框的列表项的id

  const selectedItems = ref<Record<string, PromptDictListResp>>({}); // 存储多个选中的列表项及其对应的标签值

  const selectItem = (item: PromptDictListResp) => {
    if (selectedItems.value[item.id]) {
      delete selectedItems.value[item.id];
      showPopover.value[item.id] = false; // 关闭弹窗
    } else {
      selectedItems.value[item.id] = { ...item, selected: true };
      showPopover.value[item.id] = true; // 打开弹窗
    }
  };

  const getItemValue = (itemId: string | number) => {
    return selectedItems.value[itemId]?.value || 1;
  };

  const handleValueChange = (value: number, itemId: string | number) => {
    if (selectedItems.value[itemId]) {
      selectedItems.value[itemId].value = value;
    }
    console.log(1111);
  };

  const handleCategoryClick = async (categoryCode: string) => {
    if (categoryCode === selectedCategory.value) {
      selectedCategory.value = '';
    } else {
      selectedCategory.value = categoryCode;
    }
    // 你可以在这里根据categoryCode来过滤或重新加载items
    onSearch(1);
  };

  const queryName = ref('');
  const onSearch = async (current?: number) => {
    loadingRef.value = true;
    if (selectedCategory.value === 'select') {
      items.value = Object.values(selectedItems.value);
      loadingRef.value = false;
      promptPagination.value.total = items.value.length;
      promptPagination.value.current = 1;
      return;
    }
    if (typeof current === 'undefined') {
      current = 1;
    }
    promptPagination.value.current = current;
    // loadingRef.value = true;
    try {
      const response = await promptDictQuery({
        question: queryName.value,
        categoryCode: selectedCategory.value,
        current: promptPagination.value.current,
        pageSize: promptPagination.value.pageSize,
      });

      items.value = response.records;
      promptPagination.value.total = response.total;
    } finally {
      loadingRef.value = false;
    }
  };

  const togglePopover = (itemId: string | number) => {
    showPopover.value[itemId] = !showPopover.value[itemId];
  };

  const addUse = async (item) => {
    loadingRef.value = true;
    try {
      await addEnjoyPromptDict({ id: item.id });
    } finally {
      loadingRef.value = false;
    }
  };
  const removeUse = async (item) => {
    loadingRef.value = true;
    try {
      await removeEnjoyPromptDict({ id: item.id });
      onSearch(1);
    } finally {
      loadingRef.value = false;
    }
  };
  const loadMore = () => {
    // 在这里加载更多的items数据
  };
</script>
<style scoped>
  .category-col {
    display: flex; /* 使用 Flexbox 布局 */
    align-items: stretch; /* 使子元素填充满容器的高度 */
    height: 35px; /* 设置你想要的高度 */
  }

  .category-col-tag {
    display: flex; /* 使用 Flexbox 布局 */
    flex: 1; /* 使标签填充满容器 */
    align-items: center; /* 垂直居中标签的内容 */
    justify-content: center; /* 水平居中标签的内容 */
    width: 100%;
    height: 100%;
  }

  .category-col >>> .ant-tag {
    padding: 0;
  }

  .prompt-wrapper {
    position: relative;
    width: 58px;
    height: 58px;
    padding: 0;
    overflow: hidden;
    transition: transform 0.3s ease;
    border-radius: 10%;
    cursor: pointer;
  }

  .prompt-wrapper img {
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease;
    border-radius: 15%;
  }

  .prompt-wrapper-name {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 2px 0;
    border-radius: 0 0 15% 15%;

    /* background-color: rgb(0 0 0 / 60%); */
    color: white;
    font-size: 10px; /* 调整字体大小以适应空间 */

    /* line-height: 1.2; */
    text-align: center;
  }

  .item-selected img {
    transform: scale(1.1);
  }

  .prompt-wrapper-tag-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    border-radius: 15% 15% 0 0;

    /* background-color: rgb(0 0 0 / 60%); */
    font-size: 10px; /* 调整字体大小以适应空间 */
    line-height: 1.2;
    text-align: right;
  }

  .prompt-wrapper-tag-wrapper >>> .ant-tag {
    margin-right: 0;
  }

  .prompt-pagination {
    display: flex;
    align-content: center;
    align-items: center; /* 垂直居中 */
    height: 55px;

    /* padding: 20px; */
  }

  .drawer >>> .ant-drawer-header {
    height: 10px;
  }
</style>
