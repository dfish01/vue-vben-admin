<template>
  <div class="app" ref="formRef" v-loading="loadingRef">
    <!-- 查询选项卡 -->
    <a-card
      class="search-card"
      :bodyStyle="{ padding: '1px 1px 1px 1px', width: '100%', 'align-items': 'center' }"
    >
      <div style="display: flex; align-items: center; justify-content: space-between">
        <div style="margin-left: 10px">
          <span style="font-size: 16px; font-weight: bold">🏬授权市场 </span>
        </div>
        <div style="margin-right: 10px; font-size: 15px"> </div>
      </div>
    </a-card>

    <!-- 内容区域 -->
    <div
      class="cards"
      :style="{ height: `calc(100vh - 135px)`, overflow: 'auto', padding: '10px' }"
    >
      <div v-for="card in cards" :key="card.id" :trigger="['contextmenu']">
        <a-badge-ribbon
          :text="card.goodsType == 'GOODS' ? '单品' : '拼团'"
          :color="card.goodsType == 'GOODS' ? 'pink' : 'blue'"
        >
          <a-card :bodyStyle="{ padding: '0px' }" class="card" hoverable>
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
                  <span>🪧{{ card.goodsTitle }}</span>
                </div>
              </div>
            </template>
            <div style="display: flex; flex-direction: column; padding: 10px">
              <a-row class="card-tags">
                <span>
                  ⚡Turbo次数
                  <span style="font-weight: bolder">{{ card.infoBody.turboTimes }}</span></span
                >
                <span>
                  🐇Fast次数
                  <span style="font-weight: bolder">{{ card.infoBody.fastTimes }}</span></span
                >
              </a-row>

              <a-row class="card-tags">
                <span>
                  🐢Relax次数
                  <span style="font-weight: bolder">{{ card.infoBody.relaxTimes }}</span></span
                >
                <span>
                  📅天数 <span style="font-weight: bolder">{{ card.infoBody.authDays }}</span></span
                >
              </a-row>
              <a-row class="card-tags">
                <a-col>
                  <div>
                    <span>🙆‍♂️人数 </span>
                    <span style="font-weight: bolder" v-if="card.maxGroupMembers === 1">
                      独享
                    </span>
                    <span style="font-weight: bolder" v-if="card.maxGroupMembers === -1">
                      不限
                    </span>
                    <span v-if="card.maxGroupMembers > 1">
                      <span style="font-weight: bolder">{{ card.minGroupMembers }}</span> ~
                      <span style="font-weight: bolder">{{ card.maxGroupMembers }}</span>
                    </span>
                  </div>
                </a-col>
                <a-col>
                  <!-- <div>
                    <a-tag disabled>🚩账号情况</a-tag>
                  </div> -->
                </a-col>
              </a-row>
              <a-row class="card-tags">
                <a-col>
                  <a-tag color="red">🔥官方</a-tag>
                </a-col>
              </a-row>
              <a-row class="card-tags">
                <a-button @click="openNewWindow(card.skipLink)" style="width: 100%"
                  >立即购买 💰{{ card.goodsPrice }}</a-button
                >
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
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { GoodsListResp } from '/@/api/df/model/goodsModel';
  import { goodsList } from '/@/api/df/goods';

  const formRef = ref();

  onMounted(() => {
    onSearch(1);
  });

  const openNewWindow = (url) => {
    window.open(url, '_blank');
  };
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

    const response = await goodsList({ current: current, pageSize: pagination.value.pageSize });
    cards.value = response.records;
    pagination.value.total = response.total;

    loadingRef.value = false;
    console.log(111111111111);
  };
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
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    flex: 1;
    align-content: start;
    padding: 10px;
    overflow: auto;
    gap: 14px;
  }

  .card {
    min-width: 250px;
    border-radius: 7%;
  }

  .card >>> .ant-card-extra {
    margin-left: 0;

    /* height: 150px; */
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
    height: 45px;

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

  .search-card {
    display: flex;
    align-items: center;
    height: 45px;
    border-radius: 4px;
  }
</style>
