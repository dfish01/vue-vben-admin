<template>
  <a-layout class="app" v-loading="loadingRef">
    <a-row ref="formRef" style="height: 52px">
      <a-col :span="24">
        <a-card>
          <a-space>
            <a-select
              v-model:value="goodsForm.goodsType"
              class="mobile-select"
              placeholder="商品类型~"
              @change="onSearch(1)"
            >
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="GROUP">拼团</a-select-option>
              <a-select-option value="GOODS">单品</a-select-option>
              <a-select-option value="AUTH_CODE">授权</a-select-option>
            </a-select>
            <a-input
              v-model:value="goodsForm.goodsTitle"
              autofocus
              placeholder="商品模糊查询~"
              style="width: 200px"
            />

            <a-select
              v-model:value="goodsForm.ownerFlag"
              placeholder="商品归属"
              style="width: 80px"
              @change="onSearch(1)"
            >
              <a-select-option value="false">集市</a-select-option>
              <a-select-option value="true">我的</a-select-option>
            </a-select>

            <a-button-group>
              <a-button @click="onSearch(1)">🔍查询</a-button>
              <a-button type="primary" @click="showDeployGoods">添加商品</a-button>
              <a-button @click="goView('/trade')">订单记录</a-button>
            </a-button-group>
          </a-space>
        </a-card>
      </a-col>
    </a-row>

    <div
      v-if="cards.length === 0"
      style="display: flex; align-items: center; justify-content: center"
      :style="{ height: `calc(100vh - 153px)`, overflow: 'auto' }"
    >
      <a-empty :image="simpleImage" />
    </div>
    <div
      v-else
      class="cards"
      :style="{
        height: `calc(100vh - 153px)`,
        overflow: 'auto',
        padding: '8px 12px 8px 8px',
      }"
    >
      <div v-for="card in cards" :key="card.id" :trigger="['contextmenu']">
        <a-card
          :bodyStyle="{ padding: '0px', opacity: '0.75', 'line-height': 1 }"
          class="account-card"
          hoverable
        >
          <!-- <a-image :src="card.imageUrl" class="card-image" preview="false" fallback="" /> -->
          <template #title>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                width: 250px;
              "
            >
              <div style="justify-content: left">
                <Icon icon="ic:outline-bookmark-add" /><span style="margin-left: 5px">
                  {{ card.goodsTitle }}</span
                >
              </div>
            </div>
          </template>
          <div style="display: flex; flex-direction: column; padding: 10px">
            <a-row class="card-tags">
              <a-col flex="90px">
                <span style="font-weight: bolder">
                  <Icon icon="emojione-v1:lightning-mood" /> Turbo
                </span>
              </a-col>
              <a-col flex="auto">
                <span>
                  可用<span>{{ card.infoBody.turboTimes ? card.infoBody.turboTimes : '无限' }}</span
                  >次
                </span>
              </a-col>
            </a-row>
            <a-row class="card-tags">
              <a-col flex="90px">
                <span style="font-weight: bolder"> <Icon icon="openmoji:rabbit" /> Fast </span>
              </a-col>
              <a-col flex="auto">
                <span>
                  可用{{ card.infoBody.fastTimes ? card.infoBody.fastTimes : '无限' }}次
                </span>
              </a-col>
            </a-row>
            <a-row class="card-tags">
              <a-col flex="90px">
                <span style="font-weight: bolder">
                  <Icon icon="streamline-emojis:turtle" /> Relax
                </span>
              </a-col>
              <a-col flex="auto">
                <span>
                  可用{{ card.infoBody.relaxTimes ? card.infoBody.relaxTimes : '无限' }}次
                </span>
              </a-col>
            </a-row>

            <a-row class="card-tags">
              <a-col flex="90px">
                <span style="font-weight: bolder"> <Icon icon="openmoji:timer" /> 有效期至 </span>
              </a-col>
              <a-col flex="auto">
                <span v-if="card.infoBody.authWay === 'DAY'">
                  激活后 {{ card.infoBody.authDays }} 天
                </span>
                <span v-else> {{ card.infoBody.authExpireTimes }} </span>
              </a-col>
            </a-row>

            <a-row class="card-tags">
              <a-col flex="90px">
                <span style="font-weight: bolder">
                  <Icon icon="flat-color-icons:shipped" /> 发货方式
                </span>
              </a-col>
              <a-col flex="auto">
                <span v-if="card.shipType === 'AUTO'"> 拍下后自动发货 </span>
                <span v-else> 请联系客服手动发货 </span>
              </a-col>
            </a-row>
            <a-row class="card-tags" style="display: flex; justify-content: space-between">
              <div style="width: 90px">
                <span style="font-weight: bolder">
                  <Icon icon="material-symbols:other-admission-outline" /> 其他优惠
                </span>
              </div>
              <div style="flex: 1; flex-wrap: true">
                <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
                  <span> chatgpt 3.5 模型 </span>
                  <span> Midjourney 画廊</span>
                </div>
              </div>
            </a-row>
            <a-row class="card-tags">
              <a-col flex="90px">
                <span style="font-weight: bolder"> <Icon icon="jam:box" /> 库存 </span>
              </a-col>
              <a-col flex="auto">
                {{ card.stock }}
              </a-col>
            </a-row>

            <a-row class="card-tags">
              <a-col v-if="card.specialLabel">
                <a-tag color="red">{{ card.specialLabel }} </a-tag>
              </a-col>
            </a-row>

            <a-row class="card-tags" style="display: flex; justify-content: space-between">
              <div style="display: flex; align-items: center; width: 100px">
                <span style="color: #e36414; font-size: 20px; font-weight: orange">
                  <Icon icon="streamline-emojis:money-bag" size="23px" /> {{ card.goodsPrice }}
                </span>
              </div>

              <div style="display: flex; flex: 1; justify-content: flex-end">
                <a-button type="primary" @click="buyGoods(card)">购买 </a-button>
              </div>
            </a-row>
            <a-row v-if="card.editFlag && card.editFlag == true" class="card-tags">
              <a-col :span="24">
                <a-button-group style="width: 100%">
                  <a-button style="width: 25%" @click="showModifiedNewGoods(card)">编辑 </a-button>
                  <a-button
                    v-if="card.goodsState === 'DOWN'"
                    style="width: 25%"
                    @click="doChangeGoodsState(card, 'UP')"
                    >上架
                  </a-button>
                  <a-button
                    v-if="card.goodsState === 'UP'"
                    style="width: 25%"
                    @click="doChangeGoodsState(card, 'DOWN')"
                    >下架
                  </a-button>
                  <a-button style="width: 25%" @click="doDeleteGoods(card.id)">删除 </a-button>
                  <a-button style="width: 25%" @click="showStockList(card)">库存 </a-button>
                </a-button-group>
              </a-col>
            </a-row>
          </div>
          <!-- 更多卡片内容 -->
        </a-card>
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
    <!-- 支付弹窗 -->
    <a-modal
      v-model:open="payForm.viewFlag"
      title="打开支付宝扫码支付"
      style="width: 410px; height: 450px"
      @cancel="closeView"
    >
      <template #footer>
        <a-button type="primary" @click="closeView"> 我已完成支付 </a-button>
      </template>
      <CollapseContainer title="支付码" class="text-center mb-6 qrcode-demo-item">
        <QrCode :value="payForm.qrCodeUrl" :logo="LogoImg" :width="400" />
      </CollapseContainer>
    </a-modal>

    <!-- 交易信息 -->
    <a-drawer
      :visible="tradeForm.viewFlag"
      width="800px"
      root-class-name="root-class-name"
      :root-style="{ color: 'blue' }"
      title="交易记录"
      placement="right"
    >
      <TradePc />
    </a-drawer>

    <!-- 发布商品 -->
    <a-modal
      v-model:open="deployGoodsForm.isActiveVisible"
      :style="{ top: '50px' }"
      :width="750"
      :ok-text="deployGoodsForm.id ? '提交更新' : '立即创建'"
      @ok="onDeployGoods"
      @cancel="hideDeployGoods"
      :confirmLoading="deployGoodsForm.loading"
    >
      <template #title>
        <span
          ><Icon icon="fluent:drawer-add-24-filled" class="vel-icon icon" aria-hidden="true" />{{
            deployGoodsForm.title
          }}</span
        >
      </template>
      <a-card>
        <Loading :loading="deployGoodsForm.loading" :absolute="true" tip="正在生成中..." />
        <a-form layout="vertical" :model="deployGoodsForm" ref="deployGoodsFormRef">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item
                label="商品标题"
                name="goodsTitle"
                :rules="[{ required: true, message: '请输入商品标题!' }]"
              >
                <a-input v-model:value="deployGoodsForm.goodsTitle" placeholder="请输入商品标题" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="商品说明"
                name="goodsRemark"
                :rules="[{ required: false, message: '请输入商品说明!' }]"
              >
                <a-textarea
                  v-model:value="deployGoodsForm.goodsRemark"
                  placeholder="请输入商品说明"
                  :rows="3"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="商品售价"
                name="goodsPrice"
                :rules="[{ required: true, message: '请输入出售价格!' }]"
              >
                <a-input v-model:value="deployGoodsForm.goodsPrice" placeholder="请输入出售价格~" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="商品原价"
                name="oriGoodsPrice"
                :rules="[{ required: true, message: '请输入商品原价格!' }]"
              >
                <a-input
                  v-model:value="deployGoodsForm.oriGoodsPrice"
                  placeholder="请输入商品原价格~"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item
                label="发货方式"
                name="shipType"
                :rules="[{ required: true, message: '请选择发货方式!' }]"
              >
                <a-select
                  v-model:value="deployGoodsForm.shipType"
                  style="width: 100%"
                  placeholder="发货方式"
                >
                  <a-select-option value="AUTO">自动发货</a-select-option>
                  <a-select-option value="HAND">手动发货</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="库存"
                name="stock"
                :rules="[{ required: true, message: '请输入出售的库存!' }]"
              >
                <a-input-number
                  v-model:value="deployGoodsForm.stock"
                  placeholder="请输入出售的库存~"
                  min="1"
                  max="50"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24" v-if="deployGoodsForm.shipType === 'AUTO'">
              <a-form-item
                label="商品库存"
                name="stockInfo"
                :rules="[{ required: false, message: '请输入商品库存!' }]"
              >
                <a-textarea
                  v-model:value="deployGoodsForm.stockInfo"
                  placeholder="请输入商品库存，多个用|分割"
                  :rows="3"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item
                label="授权类型"
                :name="['infoBody', 'authWay']"
                :rules="[{ required: true, message: '请选择授权类型' }]"
              >
                <a-select
                  v-model:value="deployGoodsForm.infoBody.authWay"
                  @change="changeAuthWay"
                  placeholder="授权方式"
                >
                  <a-select-option value="DAY">按天计算</a-select-option>
                  <a-select-option value="TIME">指定到期时间</a-select-option>
                  <a-select-option value="NONE">无需时间</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="12" v-if="deployGoodsForm.infoBody.authWay === 'DAY'">
              <a-form-item
                label="授权天数（0~365）"
                :name="['infoBody', 'authDays']"
                :rules="[{ required: true, message: '请输入授权天数' }]"
              >
                <a-input-number
                  v-model:value="deployGoodsForm.infoBody.authDays"
                  placeholder="请输入授权天数，为空则是永久~"
                  min="0"
                  max="365"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12" v-if="deployGoodsForm.infoBody.authWay === 'TIME'">
              <a-form-item
                label="到期时间"
                :name="['infoBody', 'authExpireTimes']"
                :rules="[{ required: true, message: '请选择到期时间' }]"
              >
                <a-date-picker
                  show-time
                  style="width: 100%"
                  width="100%"
                  v-model:value="deployGoodsForm.infoBody.authExpireTimes"
                  placeholder="到期时间，为空则是永久~"
                  @change="onChangePicker"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row gutter="24">
            <a-col :span="24">
              <a-tabs v-model:activeKey="deployGoodsForm.goodsType" @change="changeTab">
                <a-tab-pane key="MIDJOURNEY" tab="Midjourney">
                  <a-row gutter="24">
                    <a-col :span="12">
                      <a-form-item
                        label="TURBO模式次数（0~9999）"
                        :name="['infoBody', 'turboTimes']"
                      >
                        <a-input-number
                          v-model:value="deployGoodsForm.infoBody.turboTimes"
                          placeholder="请输入TURBO次数，为空则是永久~"
                          min="0"
                          max="9999"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="FAST模式次数（0~9999）" :name="['infoBody', 'fastTimes']">
                        <a-input-number
                          v-model:value="deployGoodsForm.infoBody.fastTimes"
                          placeholder="请输入Fast次数，为空则是永久~"
                          min="0"
                          max="365"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item
                        label="Relax模式次数（0~9999）"
                        :name="['infoBody', 'relaxTimes']"
                      >
                        <a-input
                          v-model:value="deployGoodsForm.infoBody.relaxTimes"
                          placeholder="请输入Relax次数，为空则是永久~"
                          min="0"
                          max="9999"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="提交任务数" :name="['infoBody', 'numExecute']">
                        <a-input-number
                          v-model:value="deployGoodsForm.infoBody.numExecute"
                          placeholder="请输提交任务数，为空则上限为主账号上限~"
                          min="1"
                          :max="deployGoodsForm.infoBody.maxNumExecute"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-tab-pane>
                <a-tab-pane key="GPT" tab="Chatgpt" force-render>
                  <MarkDown
                    v-model:value="deployGoodsForm.infoBodyStr"
                    placeholder="请输入教程内容"
                  />
                  <span style="color: red; font-size: 12px"> 请自行调节内容，以保证最佳显示 </span>
                </a-tab-pane>
                <a-tab-pane key="CUSTOM" tab="自定义">
                  <MarkDown
                    v-model:value="deployGoodsForm.infoBodyStr"
                    placeholder="请输入教程内容"
                  />
                  <span style="color: red; font-size: 12px"> 请自行调节内容，以保证最佳显示 </span>
                </a-tab-pane>
              </a-tabs>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>

    <!-- 库存列表 -->
    <a-modal v-model:open="stockListForm.viewFlag" title="授权列表" width="75%" ok-text="">
      <template #footer>
        <a-button key="submit" type="primary" @click="closeStockModal">已知晓</a-button>
      </template>
      <Loading :loading="stockListForm.loading" :absolute="true" tip="数据加载中..." />
      <div style="width: 100%; padding: 5px 10px; overflow-x: auto">
        <a-table :dataSource="stockListTableData" class="a-table" :scroll="{ x: 'max-content' }">
          <a-table-column
            v-for="column in stockColumns"
            :v-if="!column.hidden"
            :key="column.key"
            :title="column.title"
            :dataIndex="column.dataIndex"
            size="small"
          />
          <a-table-column title="操作" key="actions" fixed="right" :width="200">
            <template #default="{ record }">
              <a-button-group>
                <a-button danger @click="showAppendStock">追加</a-button>
                <a-button danger @click="doDiscardStock(record)">丢弃</a-button>
                <a-button danger type="warning" @click="doDeleteStock(record.id)">删除</a-button>
              </a-button-group>
            </template>
          </a-table-column>
        </a-table>
      </div>
    </a-modal>

    <!-- 发布商品 -->
    <a-modal
      v-model:open="appendStockForm.showFlag"
      :style="{ top: '50px' }"
      :width="750"
      ok-text="立即追加"
      @ok="onAppendStock"
      :confirmLoading="appendStockForm.loading"
    >
      <template #title>
        <span
          ><Icon icon="fluent:drawer-add-24-filled" class="vel-icon icon" aria-hidden="true" />{{
            appendStockForm.title
          }}</span
        >
      </template>
      <a-card>
        <Loading :loading="appendStockForm.loading" :absolute="true" tip="正在生成中..." />
        <a-form layout="vertical" :model="deployGoodsForm" ref="deployGoodsFormRef">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item
                label="商品库存"
                name="stockInfo"
                :rules="[{ required: true, message: '请输入商品库存!' }]"
              >
                <a-textarea
                  v-model:value="appendStockForm.stockInfo"
                  placeholder="请输入商品库存，多个用|分割"
                  :rows="3"
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
  import { ref, onMounted, onUnmounted, computed, unref, toRefs, watch } from 'vue';
  import { QrCode, QrCodeActionType } from '/@/components/Qrcode/index';
  import LogoImg from '/logo.png';
  import Icon from '/@/components/Icon/Icon.vue';
  import { MarkDown, MarkDownActionType, MarkdownViewer } from '/@/components/Markdown';
  import {
    DeleteOutlined,
    InfoCircleOutlined,
    DownloadOutlined,
    EyeFilled,
    EyeInvisibleFilled,
    DiffOutlined,
    DeleteFilled,
    HeartOutlined,
    HeartFilled,
  } from '@ant-design/icons-vue';
  import { downloadByOnlineUrl } from '/@/utils/file/download';
  import {
    GoodsAddParams,
    GoodsListReq,
    GoodsListResp,
    ListResultModel,
  } from '/@/api/df/model/goodsModel';
  import {
    addGoods,
    goodsList,
    deleteGoods,
    deployNewGoods,
    deploySecondHandGoods,
    changeGoodsState,
    modifiedNewGoods,
    goodsInfo,
  } from '/@/api/df/goods';
  import { createTradeApi, tradeListApi, fetchPayResultApi, cancelTradeApi } from '/@/api/df/trade';
  import { IdReq } from '/@/api/model/baseModel';
  import { listCollects, removeCollect, createCollect } from '/@/api/df/drawCollect';
  import {
    AddDrawCollectReq,
    DrawCollectListQueryReq,
    DrawCollectListResp,
  } from '/@/api/df/model/drawCollectModel';
  import { genPromptList, genTagList } from '/@/api/df/dataCache';
  import { message, Empty } from 'ant-design-vue';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import TradePc from '/@/views/df/trade/trade_pc.vue';
  import { addTag } from '/@/api/df/drawTaskTag';
  import { useGo } from '/@/hooks/web/usePage';
  import { appendStock, stockList, discardStock, deleteStock } from '/@/api/df/goodsStock';

  const go = useGo();
  const goView = async (routePath) => {
    go(routePath);
  };

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  //页面高度处理
  const button = ref(null);
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 0);
  const offsetHeightRef = ref(0);
  const subtractHeightRefs = ref([button]);
  const formRef = ref();
  // 使用hook
  const { contentHeight } = useContentHeight(
    computed(() => true),
    formRef,
    unref(subtractHeightRefs), // 使用 unref 获取数组值
    unref(substractSpaceRefs),
    upwardSpace,
    offsetHeightRef,
  );

  const goodsForm = ref({
    goodsTitle: '',
    goodsType: '',
    ownerFlag: 'false',
  });
  onMounted(() => {
    onSearch(1);
  });

  // 分页
  const pagination = ref({
    // 表格分页的配置
    current: 1,
    pageSize: 12,
    showSizeChanger: true, // 用于控制展示每页多少条的下拉
    showQuickJumper: true,
    total: 0,
    pageSizeOptions: ['12', '24', '36', '48'],
    showTotal: (total) => `共 ${total} 条`,
    onShowSizeChange: pageSizeChange,
    onChange: pageChange,
  });
  const cards = ref<GoodsListResp[]>([
    // 更多数据...
  ]);

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

  // 页数改变的方法
  function pageSizeChange(val, pageNum) {
    pagination.value.pageSize = pageNum; // 修改每页显示的条数
    // pagination.value.current = 1
    onSearch(1);
  }
  // 点击上一页下一页的方法
  function pageChange(page, val) {
    console.log(page, val);
    // pagination.value.current = page
    onSearch(page);
  }

  const loadingRef = ref(false);
  const onSearch = async (current?: number) => {
    console.log('************************');
    if (typeof current === 'undefined') {
      current = 1;
    }
    pagination.value.current = current;
    loadingRef.value = true;

    const response = await goodsList({
      goodsTitle: goodsForm.value.goodsTitle,
      goodsType: goodsForm.value.goodsType,
      ownerFlag: goodsForm.value.ownerFlag,
      current: current,
      pageSize: pagination.value.pageSize,
    });
    cards.value = response.records;
    pagination.value.total = response.total;

    loadingRef.value = false;
    console.log(111111111111);
  };
  /***************************支付************************* */
  const payForm = ref({
    qrCodeUrl: 'https://qr.alipay.com/bax03494nng4xiqjw5kt5559',
    viewFlag: false,
    outTradeNo: '',
    paySuccess: false,
    intervalId: null as ReturnType<typeof setInterval> | null,
  });

  const buyGoods = async (card) => {
    if (card.skipType === 'THIRD') {
      openNewWindow(card.skipLink);
    } else {
      loadingRef.value = true;
      try {
        const resp = await createTradeApi({ id: card.id });
        payForm.value.outTradeNo = resp.outTradeNo;
        payForm.value.qrCodeUrl = resp.qrCode;
        payForm.value.viewFlag = true;

        //轮询支付结果
        if (payForm.value.intervalId === null) {
          payForm.value.intervalId = setInterval(() => {
            console.log('--------fetchPayResult---------');
            fetchPayResult();
          }, 3000);
        }
      } finally {
        loadingRef.value = false;
      }
    }
  };
  const closeView = async () => {
    if (payForm.value.intervalId) {
      clearInterval(payForm.value.intervalId);
    }
    payForm.value.intervalId = null;
    payForm.value.viewFlag = false;
  };

  /**
   * 查询支付结果
   */
  const fetchPayResult = async () => {
    const resp = await fetchPayResultApi({ content: payForm.value.outTradeNo });
    payForm.value.paySuccess = resp;
    if (resp === true) {
      message.success('支付成功！');
      closeView();
    }
  };

  const openNewWindow = (url) => {
    window.open(url, '_blank');
  };

  // 分页
  const tradeForm = ref({
    viewFlag: false,
  });
  const tradeShow = () => {
    tradeForm.value.viewFlag = true;
  };

  /************************************发布商品********************************* */
  const deployGoodsFormRef = ref();
  const deployGoodsForm = ref({
    id: null,
    title: '',
    loading: false,
    isActiveVisible: false,
    goodsTitle: null,
    goodsRemark: null,
    goodsPrice: null,
    oriGoodsPrice: null,
    stock: null,
    accountId: null,
    shipType: 'AUTO',
    goodsType: 'MIDJOURNEY',
    stockInfo: null,
    infoBody: {
      authWay: 'DAY',
      authDays: null,
      authExpireTimes: null,
      maxNumExecute: 50,
      turboTimes: null,
      fastTimes: null,
      relaxTimes: null,
      numExecute: null,
      infoBodyStr: '',
    },
  });
  const showDeployGoods = async (card) => {
    deployGoodsForm.value.title = '发布新商品';

    deployGoodsForm.value.accountId = card.id;
    deployGoodsForm.value.infoBody.maxNumExecute = card.numExecute;

    deployGoodsForm.value.stock = null;
    deployGoodsForm.value.infoBody.authWay = 'DAY';
    deployGoodsForm.value.infoBody.authDays = null;
    deployGoodsForm.value.infoBody.authExpireTimes = null;
    deployGoodsForm.value.infoBody.turboTimes = null;
    deployGoodsForm.value.infoBody.turboTimes = null;
    deployGoodsForm.value.infoBody.fastTimes = null;
    deployGoodsForm.value.infoBody.relaxTimes = null;
    deployGoodsForm.value.infoBody.numExecute = null;
    deployGoodsForm.value.isActiveVisible = true;
  };

  const hideDeployGoods = async () => {
    deployGoodsForm.value.isActiveVisible = false;
  };
  const onDeployGoods = async () => {
    deployGoodsForm.value.loading = true;
    try {
      await deployGoodsFormRef.value.validate();
      if (deployGoodsForm.value.id) {
        await modifiedNewGoods(deployGoodsForm.value);
      } else {
        await deployNewGoods(deployGoodsForm.value);
      }

      deployGoodsForm.value.isActiveVisible = false;
      // onSearch();
    } finally {
      deployGoodsForm.value.loading = false;
    }
  };

  const onChangePicker = (value: [Dayjs, Dayjs], dateString: [string, string]) => {
    deployGoodsForm.value.authDays = dateString;
  };
  const changeAuthWay = () => {
    if (deployGoodsForm.value.authWay === 'DAY') {
      deployGoodsForm.value.authDays = '1';
    } else if (deployGoodsForm.value.authWay === 'TIME') {
      deployGoodsForm.value.authDays = null;
      deployGoodsForm.value.authExpireTimes = null;
    }
  };

  const changeTab = (activeKey) => {};

  /**
   * 上下架
   */
  const doChangeGoodsState = async (card, state) => {
    loadingRef.value = true;
    try {
      await changeGoodsState({ id: card.id, goodsState: state });
      card.goodsState = state;
    } finally {
      loadingRef.value = false;
    }
  };
  /**
   * 删除商品
   */
  const doDeleteGoods = async (id) => {
    loadingRef.value = true;
    try {
      await deleteGoods({ id: id });
      onSearch(1);
    } finally {
      loadingRef.value = false;
    }
  };

  const showModifiedNewGoods = async (card) => {
    deployGoodsForm.value.title = '更新【' + card.goodsTitle + '】';

    deployGoodsForm.value = card;
    deployGoodsForm.value.loading = false;
    console.log(1112);
    deployGoodsForm.value.isActiveVisible = true;
  };

  //*****************************************库存 开始************************************/
  const stockListForm = ref({
    loading: false,
    viewFlag: false,
    goodsId: null,
    goodsTitle: null,
  });
  const stockListTableData = ref<any[]>([
    // 更多数据...
  ]);

  const stockColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', hidden: true },
    { title: '商品ID', dataIndex: 'goodsId', key: 'id', hidden: true },
    { title: '内容', dataIndex: 'infoBody', key: 'infoBody', width: 100 },
    { title: '邮件模板', dataIndex: 'emailTemplate', key: 'emailTemplate', width: 100 },
    { title: '状态', dataIndex: 'state', key: 'authWayLabel', width: 100 },
    { title: '关联单号', dataIndex: 'orderId', key: 'orderId', width: 100 },
    { title: '激活时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 100 },
  ];

  const showStockList = async (card) => {
    stockListForm.value.goodsId = card.id;
    stockListForm.value.goodsTitle = card.goodsTitle;
    // 显示授权列表
    stockListForm.value.loading = true;
    try {
      stockListForm.value.viewFlag = true;
      stockListTableData.value = await stockList({ goodsId: card.id });
    } finally {
      stockListForm.value.loading = false;
    }
    // console.log(response);
    // stockListForm.value.authList = response;
  };
  const doDiscardStock = async (record) => {
    stockListForm.value.loading = true;
    try {
      stockListForm.value.viewFlag = true;
      await discardStock({ id: record.id });
      record.state = 'DISCARD';
    } finally {
      stockListForm.value.loading = false;
    }
    // console.log(response);
    // stockListForm.value.authList = response;
  };
  const doDeleteStock = async (id) => {
    stockListForm.value.loading = true;
    try {
      stockListForm.value.viewFlag = true;
      await deleteStock({ id: id });
      stockListTableData.value = await stockList({ goodsId: stockListForm.value.goodsId });
    } finally {
      stockListForm.value.loading = false;
    }
  };

  const closeStockModal = () => {
    stockListForm.value.viewFlag = false;
  };

  const showAppendStock = () => {
    appendStockForm.value.title = '追加【' + stockListForm.value.goodsTitle + '】库存';
    appendStockForm.value.viewFlag = true;
  };

  const appendStockForm = ref({
    title: '',
    viewFlag: false,
    loading: false,
    goodsId: null,
    stockInfo: null,
  });
  //*****************************************库存相关 结束 *************************************/
</script>

<style scoped>
  /* 增加移动端样式 */
  @media screen and (max-width: 767px) {
    .search-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .search-input {
      margin-top: 10px;
    }
  }

  :deep(.ant-card-body) {
    padding: 10px; /* 您想要的padding值 */
  }

  .app {
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100%;
    overflow-y: auto;

    /* height: 100vh; */
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
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    flex: 1;
    align-content: start;
    padding: 10px;
    overflow: auto;
    gap: 14px;
  }

  .card {
    min-width: 280px;
    border-radius: 7%;
  }

  .card >>> .ant-card-extra {
    margin-left: 0;

    /* height: 150px; */
  }

  .account-card >>> .ant-card-head {
    min-height: 40px;
    padding: 0 10px;
  }

  .account-card >>> .ant-card {
    opacity: 0.5;
    line-height: 1;
  }

  .card >>> img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 7%;

    /* height: 150px; */
  }

  .card >>> .ant-image-mask {
    border-radius: 7%;
  }

  .pagination {
    display: flex;
    align-content: center;
    align-items: center; /* 垂直居中 */
    height: 52px;

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
    margin-top: 10px;
    margin-right: 5px;
    margin-left: 5px;
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

  .quality-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 32px;
    margin-right: 0;
    font-size: 15px;
  }
</style>
