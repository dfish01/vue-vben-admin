<template>
  <a-layout class="app" style="overflow-y: hidden">
    <Loading :loading="globalLoading" :absolute="false" tip="正在加载中..." />
    <a-row ref="formRef" style="height: 52px">
      <a-col :span="24">
        <a-card
          style="display: flex; align-items: center; height: 100%"
          :bodyStyle="{ padding: '0 5px 0px 24px' }"
        >
          <a-form layout="inline">
            <a-form-item>
              <a-input v-model:value="searchForm.shopName" placeholder="输入店铺名称" />
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button-group>
                  <a-button type="primary" @click="queryShop">查询店铺</a-button>
                  <a-button @click="onReset">重置</a-button>
                </a-button-group>
                <a-button-group>
                  <a-button @click="onAdd">添加店铺</a-button>
                  <a-button type="primary" @click="queryMyShop">我的店铺</a-button>
                </a-button-group>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
    <div
      v-if="tableData.length === 0"
      style="display: flex; align-items: center; justify-content: center"
      :style="{
        height: `calc(${contentHeight}px - 53px - 9px )`,
      }"
    >
      <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" />
    </div>
    <div
      class="cards"
      :style="{
        height: `calc(${contentHeight}px - 53px - 9px )`,
        overflow: 'auto',
        padding: '0px 10px 5px 10px',
      }"
    >
      <div v-for="card in tableData" :key="card.id" :trigger="['contextmenu']">
        <a-badge-ribbon :text="card.shopLabel" :color="card.shopLabel === '官方' ? 'red' : 'green'">
          <a-card :bodyStyle="{ padding: '0px' }" class="card account-card" hoverable>
            <template #extra>
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  width: 250px;
                "
              >
                <div style="justify-content: left">
                  <span style="font-weight: bold"> {{ card.shopName }} </span>
                  <span style="font-size: 12px"> - N.{{ card.shopNo }} </span>
                </div>
              </div>
            </template>
            <div style="display: flex; flex-direction: column; padding: 10px">
              <a-row class="card-tags">
                <a-col :span="24" class="card-tags">
                  <span style="font-size: 13px">
                    <Icon
                      icon="fluent-emoji:bookmark-tabs"
                      class="vel-icon icon"
                      aria-hidden="true"
                      size="13"
                    />
                    店铺自述
                  </span>
                  <a-tag v-if="card.shopType === 'THIRD'" color="orange"> 外部店铺 </a-tag>
                  <a-tag color="blue" v-else>内置店铺</a-tag>
                </a-col>
                <a-col :span="24">
                  <a-divider
                    style="width: 100%; margin-top: 4px; margin-bottom: 5px; margin-left: 0"
                  />
                </a-col>
                <a-col
                  :span="24"
                  style="
                    width: 100%;
                    min-height: 100px;
                    max-height: 125px;
                    margin-top: 1px;
                    margin-bottom: 5px;
                    margin-left: 2px;
                  "
                >
                  <span
                    style="font-size: 12px; line-height: 1.5; filter: brightness(50%) saturate(20%)"
                  >
                    {{ card.describeInfo }}
                  </span>
                </a-col>
              </a-row>

              <a-row class="card-tags">
                <a-col :span="24" style="margin-top: 2px">
                  <span style="font-size: 13px">
                    <Icon
                      icon="fluent-emoji:currency-exchange"
                      class="vel-icon icon"
                      aria-hidden="true"
                      size="13"
                    />
                    营业范围
                  </span>
                </a-col>
                <a-col :span="24">
                  <a-divider
                    style="width: 100%; margin-top: 4px; margin-bottom: 5px; margin-left: 0"
                  />
                </a-col>

                <a-col
                  :span="24"
                  style="
                    width: 100%;
                    height: 55px;
                    margin-top: 1px;
                    margin-bottom: 5px;
                    margin-left: 2px;
                  "
                >
                  <a-tag
                    v-for="tag in card.tagList"
                    :key="tag"
                    :bordered="false"
                    :color="stringToColor(tag)"
                    style="margin-top: 3px; margin-bottom: 3px"
                    >{{ tag }}</a-tag
                  >
                </a-col>
                <a-col :span="24">
                  <a-divider
                    style="width: 100%; margin-top: 4px; margin-bottom: 5px; margin-left: 0"
                  />
                </a-col>
              </a-row>
              <a-row v-if="card.applyStatus !== 'SUCCESS'">
                <a-col :span="24" class="card-tags">
                  <span style="font-size: 13px">
                    <Icon
                      icon="solar:mask-happly-broken"
                      class="vel-icon icon"
                      aria-hidden="true"
                      size="13"
                    />
                    审核状态
                  </span>
                  <span style="font-size: 13px">
                    <a-tag v-if="card.applyStatus === 'APPLY'"> 申请中 </a-tag>
                    <a-tooltip :title="card.rejectReason" v-if="card.applyStatus === 'REJECT'">
                      <a-tag color="red">
                        <Icon
                          icon="akar-icons:info"
                          class="vel-icon icon"
                          aria-hidden="true"
                          size="13"
                        />
                        已驳回
                      </a-tag>
                    </a-tooltip>
                  </span>
                </a-col>
                <a-col :span="24" class="card-tags">
                  <span style="font-size: 13px">
                    <Icon
                      icon="fluent-emoji:timer-clock"
                      class="vel-icon icon"
                      aria-hidden="true"
                      size="13"
                    />
                    申请时间
                  </span>
                  <span style="font-size: 13px">
                    {{ card.gmtCreate }}
                  </span>
                </a-col>
                <a-col :span="24">
                  <a-divider
                    style="width: 100%; margin-top: 4px; margin-bottom: 5px; margin-left: 0"
                  />
                </a-col>
              </a-row>

              <a-row class="card-tags" v-if="card.applyStatus === 'SUCCESS'">
                <a-col :span="24" class="card-tags">
                  <span style="font-size: 13px">
                    <Icon
                      icon="fluent-emoji:timer-clock"
                      class="vel-icon icon"
                      aria-hidden="true"
                      size="13"
                    />
                    开店时间
                  </span>
                  <span style="font-size: 13px">
                    {{ card.gmtCreate }}
                  </span>
                </a-col>
                <a-col :span="24" class="card-tags">
                  <span style="font-size: 13px">
                    <Icon
                      icon="twemoji:credit-card"
                      class="vel-icon icon"
                      aria-hidden="true"
                      size="13"
                    />
                    信用等级
                  </span>
                  <span style="font-size: 13px">
                    {{ card.creditLevel }}
                  </span>
                </a-col>
                <a-col :span="24">
                  <a-divider
                    style="width: 100%; margin-top: 4px; margin-bottom: 5px; margin-left: 0"
                  />
                </a-col>
              </a-row>

              <a-row class="card-tags" style="margin-top: 10px" v-if="card.ownerFlag === 'Y'">
                <a-col :span="24" style="display: flex; justify-content: center">
                  <a-button-group style="width: 100%">
                    <a-tooltip title="删除店铺">
                      <a-popconfirm
                        title="是否确认删除店铺？"
                        ok-text="立即删除"
                        cancel-text="我再想想"
                        @confirm="doDeleteShop(card.id)"
                      >
                        <a-button type="text" style="width: 100%">
                          <Icon
                            icon="material-symbols:delete-outline"
                            class="vel-icon icon"
                            aria-hidden="true"
                            size="17"
                          />
                        </a-button>
                      </a-popconfirm>
                    </a-tooltip>
                    <a-tooltip title="立即前往">
                      <a-button type="text" @click="goThirdShop(card)" style="width: 100%">
                        <Icon
                          icon="mdi:go-kart"
                          class="vel-icon icon"
                          aria-hidden="true"
                          size="17"
                        />
                      </a-button>
                    </a-tooltip>
                    <div v-if="card.applyStatus === 'SUCCESS'">
                      <a-tooltip title="开启店铺" v-if="card.status === 'CLOSED'">
                        <a-popconfirm
                          title="是否立即开启店铺？"
                          ok-text="立即开启"
                          cancel-text="容我再想想"
                          @confirm="doOpenShop(card.id)"
                        >
                          <a-button type="text" style="width: 100%">
                            <Icon
                              icon="pepicons-print:lock-open-circle"
                              class="vel-icon icon"
                              aria-hidden="true"
                              size="17"
                            />
                          </a-button>
                        </a-popconfirm>
                      </a-tooltip>
                      <a-tooltip title="关闭店铺" v-else>
                        <a-popconfirm
                          title="是否立即关闭店铺？"
                          ok-text="立即关闭"
                          cancel-text="容我再想想"
                          @confirm="doCloseShop(card.id)"
                        >
                          <a-button type="text" style="width: 100%">
                            <Icon
                              icon="pepicons-print:lock-closed-circle-filled"
                              class="vel-icon icon"
                              aria-hidden="true"
                              size="17"
                            />
                          </a-button>
                        </a-popconfirm>
                      </a-tooltip>
                    </div>

                    <a-tooltip title="编辑店铺">
                      <a-button type="text" @click="onModified(card)" style="width: 100%">
                        <Icon
                          icon="material-symbols:edit-calendar-outline-sharp"
                          class="vel-icon icon"
                          aria-hidden="true"
                          size="17"
                        />
                      </a-button>
                    </a-tooltip>
                  </a-button-group>
                </a-col>
              </a-row>
              <a-row class="card-tags" v-else>
                <a-col :span="24">
                  <a-button @click="goThirdShop(card)" style="width: 100%">
                    <Icon icon="mdi:go-kart" class="vel-icon icon" aria-hidden="true" size="17" />
                    前往店铺
                  </a-button>
                </a-col>
              </a-row>
            </div>
            <!-- 更多卡片内容 -->
          </a-card>
        </a-badge-ribbon>
      </div>
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

    <!-- 新增店铺 -->
    <a-modal
      v-model:visible="shopFormOther.viewFlag"
      :title="shopForm.title"
      :ok-text="
        shopForm.applyStatus === 'APPLY' || shopForm.applyStatus === 'REJECT'
          ? '重新提交'
          : '立即保存'
      "
      @ok="onSubmitAdd"
      :confirmLoading="shopFormOther.loading"
    >
      <a-card>
        <Loading :loading="shopFormOther.loading" :absolute="true" tip="数据发送中..." />
        <a-form :model="shopForm" layout="vertical" ref="accountFormRef">
          <a-row gutter="24">
            <a-col :span="24" v-if="shopForm.id">
              <a-form-item label="🍥店铺编号" name="shopNo">
                <a-input v-model:value="shopForm.shopNo" placeholder="输入登录邮箱" disabled />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item
                label="🍚店铺名"
                :rules="[
                  {
                    required: true,
                    message: '店铺名是必填项',
                  },
                ]"
                name="shopName"
              >
                <a-textarea
                  v-model:value="shopForm.shopName"
                  placeholder="输入店铺名"
                  :maxlength="32"
                  show-count
                  auto-size
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="🍨店铺LOGO"
                :rules="[
                  {
                    required: true,
                    message: '店铺Logo是必填项',
                  },
                ]"
                name="shopIcon"
              >
                <div style="height: 112px">
                  <a-upload
                    class="no-preview-icon"
                    v-model:file-list="shopFormOther.fileList"
                    :before-upload="beforeUpload"
                    list-type="picture-card"
                    show-upload-list="false"
                  >
                    <div v-if="shopFormOther.fileList.length < 1">
                      <plus-outlined />
                      <div style="margin-top: 8px">上传图片</div>
                    </div>
                  </a-upload>
                </div>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item
                label="🍵店铺描述"
                :rules="[
                  {
                    required: true,
                    message: '店铺描述是必填项',
                  },
                ]"
                name="describeInfo"
              >
                <a-textarea
                  v-model:value="shopForm.describeInfo"
                  placeholder="输入店铺描述"
                  show-count
                  :maxlength="125"
                  :rows="4"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="🍝店铺连接"
                :rules="[
                  {
                    required: true,
                    message: '店铺连接是必填项',
                  },
                ]"
                name="linkUrl"
              >
                <a-input v-model:value="shopForm.linkUrl" placeholder="输入店铺连接" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="🥗店铺标签"
                :rules="[
                  {
                    required: true,
                    message: '店铺标签是必填项',
                  },
                ]"
                name="tagList"
              >
                <a-select
                  v-model:value="shopForm.tagList"
                  :options="shopFormOther.tagOptions"
                  mode="multiple"
                  placeholder="请选择店铺标签"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="🍗加入原因"
                :rules="[
                  {
                    required: true,
                    message: '加入原因是必填项',
                  },
                ]"
                name="applyReason"
              >
                <a-textarea
                  v-model:value="shopForm.applyReason"
                  placeholder="输入加入原因"
                  show-count
                  :maxlength="256"
                  :rows="4"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, unref } from 'vue';
  import { Loading } from '/@/components/Loading';
  import {
    ShopListReq,
    ShopCreateReq,
    ShopListResp,
    ListResultModel,
  } from '/@/api/df/model/shopModel';
  import { Empty, message } from 'ant-design-vue';
  import { saveShop, shopList, openShop, closeShop, deleteShop } from '/@/api/df/shop';
  import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
  import { IdReq } from '/@/api/model/baseModel';
  import Icon from '/@/components/Icon/Icon.vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { getAppEnvConfig } from '/@/utils/env';

  const { VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL, VITE_GLOB_API_URL_PREFIX, VITE_GLOB_UPLOAD_URL } =
    getAppEnvConfig();
  /** 页面高度计算开始 */
  const button = ref(null);
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 10);
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

  /***************************** 查询 ***************************** */
  const searchForm = ref({
    shopName: null,
    ownerFlag: false,
  });

  const queryMyShop = async () => {
    searchForm.value.ownerFlag = true;
    onSearch();
  };

  const queryShop = async () => {
    searchForm.value.ownerFlag = false;
    onSearch();
  };

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
    searchForm.value = {
      shopName: null,
      ownerFlag: false,
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
      const params: ShopListReq = searchForm.value;
      params.current = pagination.value.current;
      params.pageSize = pagination.value.pageSize;
      console.log(params);
      const response = await shopList(params);
      tableData.value = response.records;
      pagination.value.total = response.total;
    } finally {
      globalLoading.value = false;
    }
  };

  onMounted(() => {
    onSearch();
  });

  // 主table 数据
  const tableData = ref<ShopListResp[]>([
    // 更多数据...
  ]);
  /******************************  查询END  ************************************* */
  //***************************** 新增或者编辑 ****************************************************//
  const accountFormRef = ref();
  const shopForm = ref<ShopCreateReq>({});
  const shopFormOther = ref({
    loading: false,
    uploadLoading: false,
    title: '',
    fileList: [] as UploadProps['fileList'],
    viewFlag: false,
    tagOptions: [
      {
        value: 'MJ',
        label: 'MJ',
      },
      {
        value: 'Chatgpt',
        label: 'Chatgpt',
      },
      {
        value: 'GV',
        label: 'GV',
      },
      {
        value: '小火箭',
        label: '小火箭',
      },
      {
        value: '魔法',
        label: '魔法',
      },
      {
        value: '邮箱',
        label: '邮箱',
      },
      {
        value: 'VPS',
        label: 'VPS',
      },
      {
        value: '壁纸头像',
        label: '壁纸头像',
      },
      {
        value: 'Prompt',
        label: 'Prompt',
      },
      {
        value: '技术服务',
        label: '技术服务',
      },

      {
        value: '其他',
        label: '其他',
      },
    ],
  });

  const onAdd = () => {
    shopForm.value = {};
    shopFormOther.value.viewFlag = true;
    shopFormOther.value.fileList = [];
    shopFormOther.value.title = '🐣新增店铺';
  };

  const onModified = (card) => {
    shopForm.value = card;
    shopFormOther.value.fileList = [
      {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: card.shopIcon,
      },
    ];

    shopFormOther.value.viewFlag = true;
    shopFormOther.value.title = '🐓编辑店铺';
  };

  /**
   * 保存店铺
   */
  const onSubmitAdd = async () => {
    shopFormOther.value.loading = true;
    try {
      await accountFormRef.value.validate();
      await saveShop(shopForm.value);
      shopForm.value.viewFlag = false;
      onSearch();
    } finally {
      shopFormOther.value.loading = false;
    }
  };

  const doDeleteShop = async (id) => {
    // 删除账户
    shopFormOther.value.loading = true;
    const param: IdReq = { id: id };
    try {
      await deleteShop(param);
      onSearch();
    } finally {
      shopFormOther.value.loading = false;
    }
  };

  const doOpenShop = async (id) => {
    shopFormOther.value.loading = true;
    try {
      await openShop({ id: id });
      onSearch();
    } finally {
      shopFormOther.value.loading = false;
    }
  };

  const doCloseShop = async (id) => {
    shopFormOther.value.loading = true;
    try {
      await doCloseShop({ id: id });
    } finally {
      shopFormOther.value.loading = false;
    }
  };

  /********************** 图片上传  ********************* */

  const beforeUpload = async (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    if (isJpgOrPng && isLt2M) {
      try {
        const base64 = await getBase64(file);
        shopForm.value.shopIcon = base64;
        // 获取并存储图片的尺寸
        // const dimensions = await getImageDimensions(base64);
        // base64Images.value = [
        //   {
        //     base64Content: base64,
        //     height: dimensions.height,
        //     width: dimensions.width,
        //   },
        // ];
      } catch (error) {
        console.error('Error:', error);
      }
    }
    return false;
  };

  // 新增函数：获取图片的宽度和高度
  async function getImageDimensions(base64: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = base64;
    });
  }

  function getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('-----------------');
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

  /******************** 颜色函数 ******************* */

  //跳转CHATGPT页面
  const go = useGo();
  const goThirdShop = async (card) => {
    if (card.shopType === 'THIRD') {
      window.open(card.linkUrl, '_blank');
    } else {
      go('/goods/index');
    }
  };

  function stringToColor(str) {
    // Convert the string to a hash code
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate a color based on the hash
    const color = '#' + (hash & 0x00ffffff).toString(16).toUpperCase();

    // Check if the color is too light (close to white or gray)
    const threshold = 0xbbbbbb; // You can adjust this threshold as needed
    const isLightColor = hash < threshold;

    // If it's too light, generate a new color
    return isLightColor ? stringToColor(str + 'salt') : color;
  }
</script>

<style scoped>
  /* .a-table {
    width: 100%;
    height: calc(80vh - 95px);
    padding: 10px;
    overflow: auto;
  } */
  .quality-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 32px;
    margin-right: 0;
    font-size: 15px;
  }

  .app {
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100%;

    /* overflow-y: auto; */
  }

  .search-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 10vh;
    padding: 20px;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    flex: 1;
    align-content: start;
    margin-top: 10px;
    padding: 10px;
    overflow: auto;
    gap: 14px;
  }

  .card {
    min-width: 350px;
    border-radius: 2%;
  }

  .card >>> .ant-card-extra {
    margin-left: 0;

    /* height: 150px; */
  }

  .pagination {
    display: flex;
    align-content: center;
    align-items: center; /* 垂直居中 */
    height: 53px;

    /* padding: 20px; */
  }

  .card-image img {
    position: relative;
    align-content: center;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 用于控制图片的宽高比 */
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    cursor: pointer;
  }

  .card-tags {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;
    margin-right: 0;
    margin-left: 0;
  }

  .card-actions {
    display: flex;
    gap: 0;
  }

  .image-tag {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }

  .tag-public {
    background-color: transparent;
    color: rgb(255 255 255);
  }

  .card-status {
    display: flex;
    align-items: center;
  }

  .status-tag {
    margin-right: 10px;
  }

  .visibility-tag {
    margin-right: 10px;
  }

  .icon-public {
    color: #16c82b;
  }

  .icon-private {
    color: #8c8c8c;
  }

  .card-date-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;
    margin-right: 5px;
    margin-left: 5px;
  }

  .card-date {
    color: #8c8c8c;
    font-size: 0.8em;
  }

  .search-card {
    height: 10vh;
    padding: 10px;
    border-radius: 4px;
  }

  .search-row {
    margin: 0 !important;
  }

  .search-button {
    width: 100%;
  }

  .a-radio-group {
    display: flex;
    justify-content: flex-start;
  }

  .search-input {
    display: flex;
    justify-content: flex-end;
  }

  :deep(.ant-tooltip-inner) {
    width: auto !important;
    min-width: 600px; /* 设置你想要的最大宽度 */
  }

  .custom-radio-group span.anticon {
    vertical-align: -0.125em !important;
  }

  .delete span.anticon {
    vertical-align: -0.125em !important;
  }

  .ant-badge-status-text {
    font-size: 13px !important;
  }

  .account-card >>> .ant-card-head {
    padding: 0 10px;
  }

  .no-preview-icon >>> .ant-upload-list-item-actions .anticon-eye {
    display: none;
  }
</style>
