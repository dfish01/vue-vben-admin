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
                  <a-button type="primary" @click="onAdd" ref="accountGroupStep">新增账户</a-button>
                  <a-button @click="onShowActive" ref="activeStep">授权激活</a-button>
                  <!-- <a-button type="success" @click="openGoodsShop">授权市场</a-button> -->

                  <!-- <a-button type="success" @click="openAccountGroup"
                    >账号组管理{{ props.contentHeight }}</a-button
                  > -->
                </a-button-group>
                <a-button @click="goThirdShop(card)" ref="goodsStep">
                  <Icon
                    icon="simple-icons:shopee"
                    class="vel-icon icon"
                    aria-hidden="true"
                    color="#86A789"
                    size="17"
                  />
                  购买账号
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
    <div
      v-if="tableData.length === 0"
      style="display: flex; align-items: center; justify-content: center"
      :style="{ height: `calc(${contentHeight}px - 77px)`, overflow: 'auto' }"
    >
      <a-empty :image="simpleImage" />
    </div>

    <div
      class="cards"
      v-else
      :style="{
        height: `calc(${contentHeight}px  - 77px)`,
        overflow: 'auto',
        padding: '0px 10px',
      }"
    >
      <div v-for="card in tableData" :key="card.id" :trigger="['contextmenu']">
        <a-badge-ribbon
          :text="card.ownerFlag == 'Y' ? '主账号' : '授权'"
          :color="card.ownerFlag == 'Y' ? 'red' : ''"
        >
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
                  <span style="font-weight: bold"> {{ card.accountName }}</span>
                </div>
              </div>
            </template>
            <div style="display: flex; flex-direction: column; padding: 10px">
              <a-row class="card-tags">
                <span>
                  <Icon icon="uil:server" class="vel-icon icon" aria-hidden="true" size="14" />
                  服务器： <span style="font-size: 13px">{{ card.guildTitle }}</span></span
                >
              </a-row>
              <a-row class="card-tags">
                <span>
                  <Icon icon="uil:server" class="vel-icon icon" aria-hidden="true" size="14" />
                  频道： <span style="font-size: 13px">{{ card.channelTitle }}</span></span
                >
                <span v-if="card.state === 'normal' && card.canSale !== 'Y'">
                  <a-popconfirm
                    v-if="card.ownerFlag === 'N'"
                    title="发布商品到交易市场，将停止账号的使用。是否确认？"
                    ok-text="立即发布"
                    cancel-text="取消"
                    @confirm="showDeployGoods(card)"
                  >
                    <a-button size="small" style="font-size: 12px" @click="showDeployGoods(card)">
                      <span
                        ><Icon
                          icon="material-symbols:deployed-code"
                          class="vel-icon icon"
                          aria-hidden="true"
                          size="14"
                        />
                        出售商品</span
                      ></a-button
                    >
                  </a-popconfirm>
                </span>

                <span v-if="card.state === 'sale'">
                  <a-popconfirm
                    v-if="card.ownerFlag === 'N'"
                    title="是否取消该商品的二次售出？"
                    ok-text="立即取消"
                    cancel-text="关闭"
                    @confirm="doCancelSecondHandGoods(card)"
                  >
                    <a-button size="small" style="font-size: 12px">
                      <span>
                        <Icon
                          icon="mingcute:sale-line"
                          class="vel-icon icon"
                          aria-hidden="true"
                          size="14"
                        />
                        取消出售
                      </span>
                    </a-button>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a-button size="small" style="font-size: 12px" @click="showRedeploy(card)">
                    <span>
                      <Icon
                        icon="mingcute:sale-line"
                        class="vel-icon icon"
                        aria-hidden="true"
                        size="14"
                      />
                      再次出售
                    </span>
                  </a-button>
                </span>
              </a-row>

              <a-row class="card-tags">
                <span style="font-size: 13px">
                  <Icon
                    icon="streamline:computer-battery-medium-1-phone-mobile-charge-medium-device-electricity-power-battery"
                    class="vel-icon icon"
                    aria-hidden="true"
                    size="17"
                  />
                  状态：<a-badge
                    v-if="card.ownerFlag === 'Y'"
                    style="font-size: 13px"
                    :status="card.numAvailableDiscordAccount > 0 ? 'processing' : 'default'"
                    :text="
                      (card.numAvailableDiscordAccount > 0 ? '正常' : '无效') +
                      '（账号：' +
                      card.numAvailableDiscordAccount +
                      ' / ' +
                      card.numTotalDiscordAccount +
                      '）'
                    "
                  /><a-badge
                    v-else
                    style="font-size: 13px"
                    :status="getStateContent(card.state).status"
                    :text="
                      getStateContent(card.state).text +
                      '(账号：' +
                      card.numAvailableDiscordAccount +
                      '/' +
                      card.numTotalDiscordAccount +
                      ')'
                    "
                  />
                </span>
                <span>
                  <a-button size="small" style="font-size: 12px" @click="showDetails(card.id)">
                    <span
                      ><Icon
                        icon="basil:info-rect-outline"
                        class="vel-icon icon"
                        aria-hidden="true"
                        size="14"
                      />
                      使用概况</span
                    >
                  </a-button>
                </span>
              </a-row>
              <a-row class="card-tags">
                <span>
                  <Icon icon="subway:time-4" class="vel-icon icon" aria-hidden="true" size="17" />
                  <span style="font-size: 12px">{{ card.gmtCreate }}</span></span
                >
                <a-button
                  :disabled="card.defaultFlag === 'Y'"
                  size="small"
                  style="font-size: 12px"
                  @click="doSetDefault(card.id)"
                >
                  <span
                    ><Icon
                      icon="fluent:tap-double-20-filled"
                      class="vel-icon icon"
                      aria-hidden="true"
                      size="14"
                    />
                    {{ card.defaultFlag === 'Y' ? '默认账号' : '设置默认' }}</span
                  >
                </a-button>
                <a-col :span="24">
                  <a-divider
                    style="width: 100%; margin-top: 8px; margin-bottom: 1px; margin-left: 0"
                  />
                </a-col>
              </a-row>

              <a-row class="card-tags" style="margin-top: 5px" v-if="card.ownerFlag === 'Y'">
                <a-col
                  :span="24"
                  style="display: flex; align-items: center; justify-content: center"
                >
                  <a-button-group type="text" style="width: 100%">
                    <a-popconfirm
                      title="是否确认删除账户？"
                      ok-text="Yes"
                      cancel-text="No"
                      @confirm="deleteAccount(card.id)"
                    >
                      <a-tooltip title="删除账号">
                        <a-button type="text" style="width: 100%">
                          <Icon
                            icon="material-symbols:delete-outline"
                            class="vel-icon icon"
                            aria-hidden="true"
                            size="17"
                          />
                        </a-button>
                      </a-tooltip>
                    </a-popconfirm>
                    <a-tooltip title="授权列表">
                      <a-button
                        type="text"
                        @click="showAuthorizationList(card.id)"
                        style="width: 100%"
                      >
                        <Icon
                          icon="ph:user-list-bold"
                          class="vel-icon icon"
                          aria-hidden="true"
                          size="17"
                        />
                      </a-button>
                    </a-tooltip>
                    <a-popconfirm
                      title="是否确认生成授权？目前生成授权后账户禁止删除！"
                      ok-text="立即生成"
                      cancel-text="下次吧"
                      @confirm="showCreateAuth(card)"
                    >
                      <a-tooltip title="生成授权">
                        <a-button type="text" style="width: 100%">
                          <Icon
                            icon="mdi:genie-lamp"
                            class="vel-icon icon"
                            aria-hidden="true"
                            size="17"
                          />
                        </a-button>
                      </a-tooltip>
                    </a-popconfirm>

                    <a-tooltip title="追加账号">
                      <a-button type="text" @click="showAccountModified(card)" style="width: 100%">
                        <Icon
                          icon="clarity:update-line"
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
                  <a-popconfirm
                    title="是否确认删除账户？"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="deleteAccount(card.id)"
                  >
                    <a-tooltip title="删除账号">
                      <a-button type="text" style="width: 100%">
                        <Icon
                          icon="material-symbols:delete-outline"
                          class="vel-icon icon"
                          aria-hidden="true"
                          size="17"
                        />
                      </a-button>
                    </a-tooltip>
                  </a-popconfirm>
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

    <!-- 使用情况 -->
    <a-modal
      v-model:open="statisticsForm.viewFlag"
      title="🔋账户使用情况"
      style="width: 80%"
      :style="statisticsForm.formData.ownerFlag === 'Y' ? 'top: 5px;' : ''"
      @ok="closeDetail"
      :confirmLoading="statisticsForm.loading"
    >
      <template #footer>
        <a-button key="submit" type="primary" :loading="statisticsForm.loading" @click="closeDetail"
          >已知晓</a-button
        >
      </template>
      <a-card :bordered="false">
        <Loading :loading="statisticsForm.loading" :absolute="true" tip="数据加载中..." />
        <a-descriptions title="" bordered>
          <a-descriptions-item label="账户名">{{
            statisticsForm.formData.accountName
          }}</a-descriptions-item>
          <a-descriptions-item label="账号模式">{{
            statisticsForm.formData.accMode === 'GROUP' ? '账号组' : '单账号'
          }}</a-descriptions-item>
          <a-descriptions-item label="账号权限">{{
            statisticsForm.formData.ownerFlag === 'N' ? '授权' : '主账号'
          }}</a-descriptions-item>
          <a-descriptions-item :span="3" label="负载信息" v-if="statisticsForm.formData.loadInfo">
            <span>
              Discord账号数:
              {{
                statisticsForm.formData.loadInfo ? statisticsForm.formData.loadInfo.numDiscord : 0
              }}
              <br />
              队列数上限:
              {{
                statisticsForm.formData.loadInfo ? statisticsForm.formData.loadInfo.maxSubmit : 0
              }}
              <br />
              并发执行线程:
              {{
                statisticsForm.formData.loadInfo
                  ? statisticsForm.formData.loadInfo.userConExecute
                    ? statisticsForm.formData.loadInfo.userConExecute
                    : '主账号的上限数【' + statisticsForm.formData.loadInfo.maxConcurrency + '】'
                  : 0
              }}
              <br />
              <span v-if="statisticsForm.formData.loadInfo.userConExecute">
                已使用线程:
                {{
                  statisticsForm.formData.loadInfo
                    ? statisticsForm.formData.loadInfo.useConExecute
                    : 0
                }}
              </span>
              <br />
              <span v-if="statisticsForm.formData.ownerFlag === 'Y'">
                主账号已用并发数:
                {{
                  statisticsForm.formData.loadInfo
                    ? statisticsForm.formData.loadInfo.useConcurrency
                    : 0
                }}
                <br />
                主账号最大并发数:
                {{
                  statisticsForm.formData.loadInfo
                    ? statisticsForm.formData.loadInfo.maxConcurrency
                    : 0
                }}
              </span>
            </span>
          </a-descriptions-item>
          <a-descriptions-item
            :span="3"
            label="授权使用情况"
            v-if="statisticsForm.formData.ownerFlag === 'N'"
          >
            <span v-if="statisticsForm.billingMethod === 'TIMES'">
              turbo次数:
              {{ statisticsForm.formData.authUseInfo.turboTimes }}
              /
              {{
                statisticsForm.formData.authUseInfo.totalTurboTimes === null
                  ? ' 不限制'
                  : statisticsForm.formData.authUseInfo.totalTurboTimes
              }}
              <br />
              fast次数:
              {{ statisticsForm.formData.authUseInfo.fastTimes }}
              /

              {{
                statisticsForm.formData.authUseInfo.totalFastTimes === null
                  ? ' 不限制'
                  : statisticsForm.formData.authUseInfo.totalFastTimes
              }}
              <br />
              relax次数:
              {{ statisticsForm.formData.authUseInfo.relaxTimes }}
              /{{
                statisticsForm.formData.authUseInfo.totalRelaxTimes === null
                  ? ' 不限制'
                  : statisticsForm.formData.authUseInfo.totalRelaxTimes
              }}
              <br />
              <!-- 成功次数:{{ statisticsForm.formData.authUseInfo.numSuccess }} -->
              <br />
              到期时间:{{ statisticsForm.formData.authUseInfo.expireTime }}
            </span>
            <span v-else>
              总积分:
              {{
                statisticsForm.ownerFlag === 'Y'
                  ? '不限制'
                  : statisticsForm.formData.authUseInfo.totalScore
              }}

              <br />
              已用积分:
              {{
                statisticsForm.ownerFlag === 'Y'
                  ? '-'
                  : statisticsForm.formData.authUseInfo.usedScore
              }}
              <br />
              剩余积分:
              {{
                statisticsForm.ownerFlag === 'Y'
                  ? '不限制'
                  : statisticsForm.formData.authUseInfo.remainScore
              }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item
            :span="3"
            label="授权账号概况"
            v-if="statisticsForm.formData.ownerFlag === 'Y'"
          >
            <span v-if="statisticsForm.formData.ownerInfo">
              总账号个数: {{ statisticsForm.formData.ownerInfo.countAccounts }}
              <br />
              总可用账号数:{{ statisticsForm.formData.ownerInfo.countNormalAccounts }}
              <br />
              总异常账号数:{{ statisticsForm.formData.ownerInfo.countErrorAccounts }}
              <br />
              到期账号数: {{ statisticsForm.formData.ownerInfo.countStopAccounts }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item
            label="Discord账号情况"
            :span="3"
            v-if="statisticsForm.formData.ownerFlag === 'Y'"
          >
            <a-table :data-source="statisticsForm.formData.discordList" rowKey="email">
              <a-table-column
                title="账号名"
                align="center"
                dataIndex="globalName"
                key="globalName"
                :width="200"
              />
              <a-table-column title="邮箱" align="center" dataIndex="email" key="email" />
              <a-table-column
                title="Discord状态"
                dataIndex="discordState"
                key="discordState"
                align="center"
                :width="120"
              >
                <template #default="{ text }">
                  <a-badge
                    :status="getDiscordStateContent(text).status"
                    :text="getDiscordStateContent(text).text"
                  />
                </template>
              </a-table-column>
              <a-table-column
                title="MJ状态"
                align="center"
                dataIndex="mjState"
                key="mjState"
                :width="100"
              >
                <template #default="{ text }">
                  <a-badge
                    :status="getMjStateContent(text).status"
                    :text="getMjStateContent(text).text"
                  />
                </template>
              </a-table-column>
            </a-table>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
    </a-modal>

    <!-- 新增用户 -->
    <a-modal
      v-model:open="accountForm.viewFlag"
      ok-text="立即创建"
      @ok="onSubmitAdd"
      :confirmLoading="accountForm.loading"
    >
      <template #title>
        <span
          ><Icon
            icon="fluent:guest-add-24-filled"
            class="vel-icon icon"
            aria-hidden="true"
          />新建账户</span
        >
      </template>

      <a-card>
        <Loading :loading="accountForm.loading" :absolute="true" tip="正在提交..." />
        <a-form :model="accountForm" layout="vertical" ref="accountFormRef">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: '账号名名称是必填项',
                  },
                ]"
                name="accountName"
              >
                <template #label>
                  <span
                    ><Icon
                      icon="ic:sharp-account-box"
                      class="vel-icon icon"
                      aria-hidden="true"
                    />账号名（账号多的时候方便记）
                  </span>
                </template>
                <a-input v-model:value="accountForm.accountName" placeholder="输入账号名" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: 'discord账号是必填项',
                  },
                ]"
                name="discordUserId"
              >
                <template #label>
                  <span
                    ><Icon
                      icon="ic:round-account-tree"
                      class="vel-icon icon"
                      aria-hidden="true"
                    />分配Discord账号
                  </span>
                </template>
                <a-select
                  @change="onSelectDiscordUser"
                  style="width: 100%; height: 32px"
                  v-model:value="accountForm.discordUserId"
                  :options="accountForm.discordUserOptions"
                  placeholder="请选择Discord账号"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: '执行服务器是必填项',
                  },
                ]"
                name="guildId"
              >
                <template #label>
                  <span
                    ><Icon icon="uil:server" class="vel-icon icon" aria-hidden="true" />执行服务器
                  </span>
                </template>
                <a-select
                  @change="onSelectGuild"
                  style="width: 100%; height: 32px"
                  v-model:value="accountForm.guildId"
                  :options="accountForm.guildOptions"
                  placeholder="请选择执行的服务器"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: '默认频道是必填项',
                  },
                ]"
                name="channelId"
              >
                <template #label>
                  <span
                    ><Icon
                      icon="ri:wechat-channels-line"
                      class="vel-icon icon"
                      aria-hidden="true"
                    />默认频道
                  </span>
                </template>
                <a-select
                  v-model:value="accountForm.channelId"
                  style="width: 100%"
                  placeholder="请选择默认频道"
                  :options="accountForm.channelOptions"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: false,
                    message: '请选择任务分配策略',
                  },
                ]"
                name="allocateStrategy"
              >
                <template #label>
                  <span
                    ><Icon
                      icon="clarity:display-solid-alerted"
                      class="vel-icon icon"
                      aria-hidden="true"
                    />分配策略
                  </span>
                </template>

                <a-select
                  style="width: 100%"
                  v-model:value="accountForm.allocateStrategy"
                  placeholder="分配策略"
                >
                  <a-select-option value="FCFS">先到先运行</a-select-option>
                  <a-select-option value="MLQ">按人运行</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: false,
                    message: '最大并发数是必填项',
                  },
                ]"
                name="conExecute"
              >
                <template #label>
                  <span
                    ><Icon
                      icon="tabler:needle-thread"
                      class="vel-icon icon"
                      aria-hidden="true"
                    />最大并发数
                  </span>
                </template>
                <a-input
                  disabled
                  v-model:value="accountForm.conExecute"
                  placeholder="输入最大并发数"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: false,
                    message: '提交任务数是必填项',
                  },
                ]"
                name="maxSubmit"
              >
                <template #label>
                  <span
                    ><Icon
                      icon="tabler:needle-thread"
                      class="vel-icon icon"
                      aria-hidden="true"
                    />最大提交任务数
                  </span>
                </template>
                <a-input-number
                  v-model:value="accountForm.maxSubmit"
                  placeholder="请输入最大提交任务数~"
                  min="1"
                  max="300"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>

    <!-- 追加账户 -->
    <a-modal
      v-model:open="accountModifiedForm.viewFlag"
      title="🍏追加账户组账户"
      ok-text="立即保存"
      @ok="onAppendDiscordAccount"
      :confirmLoading="accountModifiedForm.loading"
    >
      <a-card>
        <Loading :loading="accountModifiedForm.loading" :absolute="true" tip="正在提交..." />
        <a-form :model="accountModifiedForm" layout="vertical" ref="accountModifiedFormRef">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item label="🐵账号名" name="accountName">
                <a-input
                  v-model:value="accountModifiedForm.accountName"
                  disabled
                  placeholder="输入账号名"
                />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="账户组账号">
                <a-select
                  v-model:value="accountModifiedForm.discordUserIds"
                  mode="multiple"
                  style="width: 100%"
                  placeholder="请勾选账号组账号"
                  :options="accountModifiedForm.discordFilterUserOptions"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>

    <!-- 生成授权码 -->
    <a-modal
      v-model:open="createAuthForm.isActiveVisible"
      :style="{ top: '50px' }"
      title="生成授权码"
      ok-text="提交"
      @ok="onCreateAuth"
      :confirmLoading="createAuthForm.loading"
    >
      <a-card>
        <Loading :loading="createAuthForm.loading" :absolute="true" tip="正在生成中..." />
        <a-form layout="vertical" :model="createAuthForm" ref="createAuthFormRef">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item
                label="生成授权数量(1~50)"
                name="num"
                :rules="[{ required: true, message: '请输入生成授权码的数量!' }]"
              >
                <a-input-number
                  v-model:value="createAuthForm.num"
                  placeholder="请输入生成授权码的数量~"
                  min="1"
                  max="50"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="授权类型"
                name="authWay"
                :rules="[{ required: true, message: '请输入生成授权码的数量!' }]"
              >
                <a-select
                  v-model:value="createAuthForm.authWay"
                  @change="changeAuthWay"
                  placeholder="授权方式"
                >
                  <a-select-option value="DAY">按天计算</a-select-option>
                  <a-select-option value="TIME">指定到期时间</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="24" v-if="createAuthForm.authWay === 'DAY'">
              <a-form-item label="授权天数（0~365）" name="authDays">
                <a-input-number
                  v-model:value="createAuthForm.authDays"
                  placeholder="请输入授权天数，为空则是永久~"
                  min="0"
                  max="365"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24" v-if="createAuthForm.authWay === 'TIME'">
              <a-form-item label="到期时间">
                <a-date-picker
                  show-time
                  style="width: 100%"
                  width="100%"
                  v-model:value="createAuthForm.authExpireTimes"
                  placeholder="到期时间，为空则是永久~"
                  @change="onChangePicker"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="提交任务数" name="maxSubmit">
                <a-input-number
                  v-model:value="createAuthForm.otherInfo.maxSubmit"
                  placeholder="请输入提交任务数，为空则上限为主账号上限~"
                  min="1"
                  :max="createAuthForm.maxNumExecute"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="并发线程数" name="maxSubmit">
                <a-input-number
                  v-model:value="createAuthForm.otherInfo.conExecute"
                  placeholder="请输入并发线程数，为空则上限为主账号上限~"
                  min="1"
                  :max="createAuthForm.conExecute"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: '请选择计费方式',
                  },
                ]"
                name="billingMethod"
              >
                <template #label>
                  <span
                    ><Icon
                      icon="clarity:display-solid-alerted"
                      class="vel-icon icon"
                      aria-hidden="true"
                    />计费方式{{ createAuthForm.billingMethod }}
                  </span>
                </template>

                <a-select
                  style="width: 100%"
                  v-model:value="createAuthForm.billingMethod"
                  placeholder="计费方式"
                >
                  <a-select-option value="TIMES">按次数</a-select-option>
                  <a-select-option value="INTEGRAL">按积分</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="createAuthForm.billingMethod === 'TIMES'">
            <a-col :span="24">
              <a-form-item label="TURBO模式次数（0~9999）" name="turboTimes">
                <a-input-number
                  v-model:value="createAuthForm.otherInfo.turboTimes"
                  placeholder="请输入TURBO次数，为空则是永久~"
                  min="0"
                  max="9999"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="FAST模式次数（0~9999）" name="fastTimes">
                <a-input-number
                  v-model:value="createAuthForm.otherInfo.fastTimes"
                  placeholder="请输入Fast次数，为空则是永久~"
                  min="0"
                  max="365"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="Relax模式次数（0~9999）" name="relaxTimes">
                <a-input
                  v-model:value="createAuthForm.otherInfo.relaxTimes"
                  placeholder="请输入Relax次数，为空则是永久~"
                  min="0"
                  max="9999"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-else>
            <a-col :span="24">
              <a-form-item label="积分" name="score">
                <a-input
                  v-model:value="createAuthForm.otherInfo.score"
                  placeholder="请输入积分"
                  min="0"
                  max="999999"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <span style="color: red; font-size: 10px"
                >每个任务都会按照不同的类型操作消耗相对应的积分，具体看说明~</span
              >
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>

    <!-- 发布商品 -->
    <a-modal
      v-model:open="deployGoodsForm.isActiveVisible"
      :style="{ top: '50px' }"
      ok-text="提交"
      @ok="onDeployGoods"
      :confirmLoading="deployGoodsForm.loading"
    >
      <template #title>
        <span
          ><Icon
            icon="fluent:drawer-add-24-filled"
            class="vel-icon icon"
            aria-hidden="true"
          />发布商品</span
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
            <a-col :span="24">
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
            <a-col :span="24">
              <a-form-item
                label="商品售价"
                name="goodsPrice"
                :rules="[{ required: true, message: '请输入出售价格!' }]"
              >
                <a-input v-model:value="deployGoodsForm.goodsPrice" placeholder="请输入出售价格~" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
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
            <a-col :span="24">
              <a-form-item
                label="授权类型"
                :name="['otherInfo', 'authWay']"
                :rules="[{ required: true, message: '请选择授权类型' }]"
              >
                <a-select
                  v-model:value="deployGoodsForm.otherInfo.authWay"
                  @change="changeAuthWay"
                  placeholder="授权方式"
                >
                  <a-select-option value="DAY">按天计算</a-select-option>
                  <a-select-option value="TIME">指定到期时间</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="24" v-if="deployGoodsForm.otherInfo.authWay === 'DAY'">
              <a-form-item label="授权天数（0~365）" :name="['otherInfo', 'authDays']">
                <a-input-number
                  v-model:value="deployGoodsForm.otherInfo.authDays"
                  placeholder="请输入授权天数，为空则是永久~"
                  min="0"
                  max="365"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24" v-if="deployGoodsForm.otherInfo.authWay === 'TIME'">
              <a-form-item label="到期时间" :name="['otherInfo', 'authExpireTimes']">
                <a-date-picker
                  show-time
                  style="width: 100%"
                  width="100%"
                  v-model:value="deployGoodsForm.otherInfo.authExpireTimes"
                  placeholder="到期时间，为空则是永久~"
                  @change="onChangePicker"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="TURBO模式次数（0~9999）" :name="['otherInfo', 'turboTimes']">
                <a-input-number
                  v-model:value="deployGoodsForm.otherInfo.turboTimes"
                  placeholder="请输入TURBO次数，为空则是永久~"
                  min="0"
                  max="9999"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="FAST模式次数（0~9999）" :name="['otherInfo', 'fastTimes']">
                <a-input-number
                  v-model:value="deployGoodsForm.otherInfo.fastTimes"
                  placeholder="请输入Fast次数，为空则是永久~"
                  min="0"
                  max="365"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="Relax模式次数（0~9999）" :name="['otherInfo', 'relaxTimes']">
                <a-input
                  v-model:value="deployGoodsForm.otherInfo.relaxTimes"
                  placeholder="请输入Relax次数，为空则是永久~"
                  min="0"
                  max="9999"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="提交任务数" :name="['otherInfo', 'maxSubmit']">
                <a-input-number
                  v-model:value="deployGoodsForm.otherInfo.maxSubmit"
                  placeholder="请输提交任务数，为空则上限为主账号上限~"
                  min="1"
                  :max="deployGoodsForm.otherInfo.maxNumExecute"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>

    <!-- 激活授权账号 -->
    <a-modal
      v-model:open="activeData.isActiveVisible"
      title="Midjouney授权激活"
      ok-text="提交"
      @ok="onActiveAccount"
    >
      <a-card>
        <a-form layout="vertical">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item label="账号授权码">
                <a-input v-model:value="activeData.activeCode" placeholder="输入授权码" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>

    <!-- 授权列表 -->
    <a-modal v-model:open="authListForm.isAuthModalVisible" width="85%">
      <template #title>
        <Icon
          icon="streamline-emojis:beaming-face-with-smiling-eyes"
          class="vel-icon icon"
          aria-hidden="true"
        />
        授权列表
      </template>
      <template #footer>
        <a-button key="submit" type="primary" @click="closeAuthModal"
          >已知晓 {{ authListForm.tabKey }}</a-button
        >
      </template>
      <Loading :loading="authListForm.loading" :absolute="true" tip="数加载中..." />

      <div style="width: 100%; padding: 10px; overflow-x: auto">
        <a-tabs ref="formRef" v-model:activeKey="authListForm.tabKey" @change="changeBillingCount">
          <a-tab-pane key="TIMES">
            <template #tab>
              <span
                ><Icon
                  icon="fluent:calendar-arrow-counterclockwise-20-regular"
                  class="vel-icon icon"
                  aria-hidden="true"
                  style="margin-right: 2px"
                  size="16"
                />次数计费
              </span>
            </template>
            <a-table :dataSource="authListTableData" class="a-table" :scroll="{ x: 'max-content' }">
              <a-table-column
                key="authCode"
                title="授权码"
                data-index="authCode"
                align="center"
                :width="80"
              >
                <template #default="{ record }">
                  <span v-if="record.useWay === 'GOODS'"> ********* </span>
                  <span v-else> {{ record.authCode }} </span>
                </template>
              </a-table-column>
              <a-table-column
                v-for="column in timeAuthColumns"
                :v-if="!column.hidden"
                :key="column.key"
                :title="column.title"
                :dataIndex="column.dataIndex"
              />

              <a-table-column title="操作" align="center" key="actions" fixed="right" :width="80">
                <template #default="{ record }">
                  <a-button-group>
                    <a-button
                      type="primary"
                      danger
                      v-if="record.useFlag === 'N'"
                      @click="doDeleteAuth(record.id, record.accountId)"
                      >删除</a-button
                    >
                  </a-button-group>
                </template>
              </a-table-column>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="INTEGRAL">
            <template #tab>
              <span>
                <Icon
                  icon="material-symbols:money-outline-rounded"
                  class="vel-icon icon"
                  style="margin-right: 2px"
                  aria-hidden="true"
                  size="16"
                />积分计费</span
              >
            </template>
            <a-table :dataSource="authListTableData" class="a-table" :scroll="{ x: 'max-content' }">
              <a-table-column
                key="authCode"
                title="授权码"
                data-index="authCode"
                align="center"
                :width="80"
              >
                <template #default="{ record }">
                  <span v-if="record.useWay === 'GOODS'"> ********* </span>
                  <span v-else> {{ record.authCode }} </span>
                </template>
              </a-table-column>
              <a-table-column
                v-for="column in integralAuthColumns"
                :v-if="!column.hidden"
                :key="column.key"
                :title="column.title"
                :dataIndex="column.dataIndex"
              />

              <a-table-column title="操作" align="center" key="actions" fixed="right" :width="80">
                <template #default="{ record }">
                  <a-button-group>
                    <a-button
                      type="primary"
                      danger
                      v-if="record.useFlag === 'N'"
                      @click="doDeleteAuth(record.id, record.accountId)"
                      >删除</a-button
                    >
                  </a-button-group>
                </template>
              </a-table-column>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-modal>

    <!-- 二次出售 -->
    <a-modal
      v-model:open="redeployForm.isActiveVisible"
      title="再次出售"
      ok-text="提交"
      @ok="onRedeploy"
      :confirmLoading="redeployForm.loading"
    >
      <a-card>
        <a-form layout="vertical" :model="redeployForm" ref="redeployFormRef">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item
                label="商品标题"
                name="goodsTitle"
                :rules="[{ required: true, message: '请输入商品标题!' }]"
              >
                <a-input v-model:value="redeployForm.goodsTitle" placeholder="请输入商品标题" />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item
                label="商品说明"
                name="goodsRemark"
                :rules="[{ required: false, message: '请输入商品说明!' }]"
              >
                <a-textarea
                  v-model:value="redeployForm.goodsRemark"
                  placeholder="请输入商品说明"
                  :rows="3"
                />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item
                label="商品售价"
                name="goodsPrice"
                :rules="[{ required: true, message: '请输入出售价格!' }]"
              >
                <a-input v-model:value="redeployForm.goodsPrice" placeholder="请输入出售价格~" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>

    <!-- 详情模态窗口组件 -->
    <account-details-modal
      style="top: 80px"
      :id="selectedAccountId"
      :visible="isDetailsModalVisible"
      @update-visible="updateModalVisible"
    />

    <a-tour :open="accountStep.open" :steps="accountStep.steps" @close="accountStepOpen(false)" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, unref, nextTick } from 'vue';
  import { Loading } from '/@/components/Loading';
  import Icon from '/@/components/Icon/Icon.vue';
  import {
    ListQueryParams,
    AccountListItem,
    ChangeAuthParams,
    AccountAuthListResp,
    AccountStatisticsModel,
  } from '/@/api/df/model/accountModel';
  import {
    queryList,
    changeAuth,
    del,
    deleteAuth,
    activeAuthAccount,
    accountAuthList,
    createAccountAuth,
    disabledAccount,
    addOwnerAccount,
    getAccountStatisticalInfo,
    appendDiscordAccount,
    setDefault,
    getGroupAccounts,
  } from '/@/api/df/account';
  import AccountDetailsModal from './accountDetailsModal.vue';
  import { IdReq } from '/@/api/model/baseModel';
  import Goods from './goods.vue';
  import AccountGroup from './account_group.vue';
  import { deployNewGoods, deploySecondHandGoods, cancelSecondHandGoods } from '/@/api/df/goods';
  import Discord from './discord.vue';
  import { message } from 'ant-design-vue';
  import {
    discordAddToken,
    discordList,
    discordInfo,
    channelList,
    guildList,
  } from '/@/api/df/discord';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { discordApi } from './discord';
  import { useGo } from '/@/hooks/web/usePage';
  import { func } from 'vue-types';
  import { getCustomLocalCache, setCustomLocalCache } from '/@/utils/custom';
  import { MJ_ACCOUNT_TOUR } from '/@/enums/cacheEnum';
  import { userStep } from '/@/api/df/user';

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
  const {
    accountFormRef,
    accountForm,
    onAdd,
    onSelectDiscordUser,
    onSelectGuild,
    queryDiscordList,
  } = discordApi();

  //查询
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
      const params: ListQueryParams = search.value;
      params.current = pagination.value.current;
      params.pageSize = pagination.value.pageSize;
      console.log(params);
      const response = await queryList(params);
      tableData.value = response.records;
      pagination.value.total = response.total;
    } finally {
      globalLoading.value = false;
    }
  };

  onMounted(async () => {
    await onSearch();
    queryDiscordList({});
    await nextTick();
    accountStepOpen(true);
  });

  // 主table 数据
  const tableData = ref<AccountListItem[]>([
    // 更多数据...
  ]);

  //授权列表相关 开始
  const authListForm = ref({
    tabKey: 'TIMES',
    accountId: null,
    loading: false,
    isAuthModalVisible: false,
    authList: {},
  });
  const authListTableData = ref<AccountAuthListResp[]>([
    // 更多数据...
  ]);

  const timeAuthColumns = [
    // { title: 'ID', dataIndex: 'id', key: 'id', hidden: true },
    // { title: '授权码', dataIndex: 'authCode', key: 'authCode', width: 100 },
    { title: '激活用户', dataIndex: 'activeUserEmail', key: 'activeUserEmail', width: 100 },
    { title: '激活时间', dataIndex: 'gmtActive', key: 'gmtActive', width: 100 },
    { title: 'Turbo次数', dataIndex: 'turboTimes', key: 'turboTimes', width: 100 },
    { title: 'Fast次数', dataIndex: 'fastTimes', key: 'fastTimes', width: 100 },
    { title: 'Relax次数', dataIndex: 'relaxTimes', key: 'relaxTimes', width: 100 },
    { title: '提交任务数', dataIndex: 'maxSubmit', key: 'maxSubmit', width: 100 },
    { title: '并发线程数', dataIndex: 'conExecute', key: 'conExecute', width: 100 },
    { title: '生成时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 100 },
    { title: '授权方式', dataIndex: 'authWayLabel', key: 'authWayLabel', width: 100 },
    { title: '天数/效期', dataIndex: 'authDays', key: 'authDays', width: 100 },
  ];
  const integralAuthColumns = [
    // { title: 'ID', dataIndex: 'id', key: 'id', hidden: true },
    // { title: '授权码', dataIndex: 'authCode', key: 'authCode', width: 100 },
    { title: '激活用户', dataIndex: 'activeUserEmail', key: 'activeUserEmail', width: 100 },
    { title: '激活时间', dataIndex: 'gmtActive', key: 'gmtActive', width: 100 },
    { title: '积分', dataIndex: 'score', key: 'score', width: 100 },
    { title: '提交任务数', dataIndex: 'maxSubmit', key: 'maxSubmit', width: 100 },
    { title: '并发线程数', dataIndex: 'conExecute', key: 'conExecute', width: 100 },
    { title: '生成时间', dataIndex: 'gmtCreate', key: 'gmtCreate', width: 100 },
    { title: '授权方式', dataIndex: 'authWayLabel', key: 'authWayLabel', width: 100 },
    { title: '天数/效期', dataIndex: 'authDays', key: 'authDays', width: 100 },
  ];

  const changeBillingCount = async (activeKey) => {
    // 显示授权列表
    authListForm.value.loading = true;
    try {
      authListTableData.value = await accountAuthList({
        accountId: authListForm.value.accountId,
        source: 'MJ',
        billingMethod: activeKey,
      });
    } finally {
      authListForm.value.loading = false;
    }
  };
  const showAuthorizationList = async (id) => {
    // 显示授权列表
    authListForm.value.loading = true;
    authListForm.value.accountId = id;
    authListForm.value.tabKey = 'TIMES';
    try {
      authListForm.value.isAuthModalVisible = true;
      changeBillingCount(authListForm.value.tabKey);
    } finally {
      authListForm.value.loading = false;
    }
  };
  const closeAuthModal = () => {
    authListForm.value.isAuthModalVisible = false;
  };
  //授权列表相关 结束

  //**************************************新增或者编辑 ****************************************************//

  const onSubmitAdd = async () => {
    // if (accountForm.value.accountName === '' || accountForm.value.accountName === null) {
    //   createMessage.error('请输入账号名！');
    //   return;
    // }
    // if (accountForm.value.discordUserId === '' || accountForm.value.discordUserId === null) {
    //   createMessage.error('请选择执行账号！');
    //   return;
    // }
    // if (accountForm.value.guildId === '' || accountForm.value.guildId === null) {
    //   createMessage.error('请选择执行服务器！');
    //   return;
    // }
    // if (accountForm.value.channelId === '' || accountForm.value.channelId === null) {
    //   createMessage.error('请选择执行频道！');
    //   return;
    // }
    // 提交新增账户的数据
    accountForm.value.loading = true;
    try {
      await accountFormRef.value.validate();
      await addOwnerAccount(accountForm.value);
      accountForm.value.viewFlag = false;
      onSearch();
    } finally {
      accountForm.value.loading = false;
    }
  };

  const deleteAccount = async (id) => {
    // 删除账户
    globalLoading.value = true;
    const param: IdReq = { id: id };
    try {
      await del(param);
      onSearch();
    } finally {
      globalLoading.value = false;
    }
  };

  const doSetDefault = async (id) => {
    globalLoading.value = true;
    try {
      await setDefault({ id: id });
    } finally {
      globalLoading.value = false;
    }
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

  const getDiscordStateContent = (state) => {
    if (state === 'NORMAL') {
      return { text: '正常', color: '#52c41a', status: 'processing' };
    } else if (state === 'EXPIRED') {
      return { text: '过期', color: '#ff4d4f', status: 'error' };
    } else if (state === 'VERIFY_HUMAN') {
      return { text: '验证人类', color: '#d9d9d9', status: 'warning' };
    } else {
      return { text: '未知', color: '#d9d9d9', status: 'default' };
    }
  };

  const getMjStateContent = (state) => {
    console.log('getMjStateContent   ' + state);
    if (state === 'NORMAL') {
      return { text: '已订阅', color: '#52c41a', status: 'processing' };
    } else if (state === 'BAN') {
      return { text: 'BAN', color: '#ff4d4f', status: 'error' };
    } else if (state === 'STOP') {
      return { text: '未订阅', color: '#d9d9d9', status: 'default' };
    } else {
      return { text: '未知', color: '#d9d9d9', status: 'default' };
    }
  };

  /*****************************追加账户*************************************** */
  const accountModifiedForm = ref({
    viewFlag: false,
    loading: false,
    id: null,
    accountName: null,
    discordUserIds: null as string[] | null,
    discordFilterUserOptions: [] as { label: string; value: string }[],
  });

  const showAccountModified = async (record) => {
    accountModifiedForm.value.accountName = record.accountName;
    accountModifiedForm.value.id = record.id;
    accountModifiedForm.value.viewFlag = true;
    accountModifiedForm.value.loading = true;
    try {
      const resp = await getGroupAccounts({ id: record.id });
      accountModifiedForm.value.discordUserIds = resp;
      const response = await discordList({ guildId: record.guildId });
      // 使用 map 方法转换数组
      const transformedList = response.map((item) => ({
        label: item.globalName,
        value: item.id,
      }));
      // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
      const finalList = [...transformedList];
      accountModifiedForm.value.discordFilterUserOptions = finalList;
    } catch (e) {
      console.log(e);
      accountModifiedForm.value.loading = false;
    } finally {
      accountModifiedForm.value.loading = false;
    }
  };

  const onAppendDiscordAccount = async () => {
    accountModifiedForm.value.loading = true;
    try {
      await appendDiscordAccount(accountModifiedForm.value);
      accountModifiedForm.value.viewFlag = false;
      onSearch();
    } finally {
      accountModifiedForm.value.loading = false;
    }
  };

  //******************************账号统计相关***********************************/

  const statisticsForm = ref({
    viewFlag: false,
    loading: false,
    formData: {} as AccountStatisticsModel,
  });
  const isDetailsModalVisible = ref(false);
  const showDetails = async (id: string) => {
    console.log('11111');
    statisticsForm.value.viewFlag = true;
    statisticsForm.value.loading = true;
    try {
      const resp = await getAccountStatisticalInfo({ id: id });
      statisticsForm.value.formData = resp;
    } finally {
      statisticsForm.value.loading = false;
    }
  };
  const closeDetail = () => {
    statisticsForm.value.viewFlag = false;
  };

  // 更新模态窗口的可见性，由子组件触发
  const updateModalVisible = (value: boolean) => {
    isDetailsModalVisible.value = value;
  };

  /************************************发布商品********************************* */
  const deployGoodsFormRef = ref();
  const deployGoodsForm = ref({
    loading: false,
    isActiveVisible: false,
    goodsTitle: null,
    goodsRemark: null,
    goodsPrice: null,
    oriGoodsPrice: null,
    stock: null,
    accountId: null,
    otherInfo: {
      authType: 'DAY',
      authDays: null,
      maxNumExecute: 300,
      authExpireTimes: null,

      turboTimes: null,
      fastTimes: null,
      relaxTimes: null,
      maxSubmit: null,
    },
  });
  const showDeployGoods = async (card) => {
    deployGoodsForm.value.isActiveVisible = true;
    deployGoodsForm.value.accountId = card.id;
    deployGoodsForm.value.maxNumExecute = card.maxSubmit;

    deployGoodsForm.value.stock = null;
    deployGoodsForm.value.otherInfo.turboTimes = null;
    deployGoodsForm.value.otherInfo.fastTimes = null;
    deployGoodsForm.value.otherInfo.relaxTimes = null;
    deployGoodsForm.value.otherInfo.maxSubmit = null;
    deployGoodsForm.value.authDays = null;
    deployGoodsForm.value.authExpireTimes = null;
  };

  const hideDeployGoods = async () => {
    createAuthForm.value.isActiveVisible = false;
  };
  const onDeployGoods = async () => {
    deployGoodsForm.value.loading = true;
    try {
      await deployGoodsFormRef.value.validate();
      await deployNewGoods(deployGoodsForm.value);

      deployGoodsForm.value.isActiveVisible = false;
      // onSearch();
    } finally {
      deployGoodsForm.value.loading = false;
    }
  };

  /************************************发布二手商品********************************* */
  const redeployFormRef = ref();
  const redeployForm = ref({
    loading: false,
    isActiveVisible: false,
    goodsTitle: null,
    goodsRemark: null,
    goodsPrice: null,
    accountId: null,
  });

  const showRedeploy = async (card) => {
    redeployForm.value.isActiveVisible = true;
    redeployForm.value.accountId = card.id;
  };

  const hideRedeploy = async () => {
    redeployForm.value.isActiveVisible = false;
  };

  const onRedeploy = async () => {
    redeployForm.value.loading = true;
    try {
      await redeployFormRef.value.validate();
      await deploySecondHandGoods(redeployForm.value);

      redeployForm.value.isActiveVisible = false;
      // onSearch();
    } finally {
      redeployForm.value.loading = false;
    }
  };

  const doCancelSecondHandGoods = async (card) => {
    globalLoading.value = true;
    try {
      await cancelSecondHandGoods({ id: card.id });
    } finally {
      globalLoading.value = false;
    }
  };

  /************************************生成授权********************************* */
  //生成账户授权
  const createAuthFormRef = ref();
  const createAuthForm = ref({
    loading: false,
    isActiveVisible: false,
    num: null,
    accountId: null,
    authType: 'DAY',
    authDays: null,
    maxNumExecute: 300,
    authExpireTimes: null,
    billingMethod: 'TIMES',
    otherInfo: {
      score: 100,
      turboTimes: null,
      fastTimes: null,
      relaxTimes: null,
      maxSubmit: null,
      conExecute: null,
    },
  });
  const showCreateAuth = async (card) => {
    createAuthForm.value.isActiveVisible = true;
    createAuthForm.value.accountId = card.id;
    createAuthForm.value.maxNumExecute = card.maxSubmit;

    createAuthForm.value.num = null;
    createAuthForm.value.otherInfo.turboTimes = null;
    createAuthForm.value.otherInfo.fastTimes = null;
    createAuthForm.value.otherInfo.relaxTimes = null;
    createAuthForm.value.otherInfo.maxSubmit = null;
    createAuthForm.value.otherInfo.conExecute = null;

    createAuthForm.value.authDays = null;
    createAuthForm.value.authExpireTimes = null;
  };

  const onHideCreateAuth = async () => {
    createAuthForm.value.isActiveVisible = false;
  };
  const onCreateAuth = async () => {
    createAuthForm.value.loading = true;
    try {
      await createAuthFormRef.value.validate();
      await createAccountAuth(createAuthForm.value);
      createMessage.success('已成功创建授权码~');
      createAuthForm.value.isActiveVisible = false;
      // onSearch();
    } finally {
      createAuthForm.value.loading = false;
    }
  };

  /**
   * 删除授权
   */
  const doDeleteAuth = async (id, accountId) => {
    globalLoading.value = true;
    try {
      await deleteAuth({ id: id });
      authListForm.value.isAuthModalVisible = true;
      authListTableData.value = await accountAuthList({ accountId: accountId, source: 'MJ' });
    } finally {
      globalLoading.value = false;
    }
  };

  const onChangePicker = (value: [Dayjs, Dayjs], dateString: [string, string]) => {
    createAuthForm.value.authDays = dateString;
  };
  const changeAuthWay = () => {
    if (createAuthForm.value.authWay === 'DAY') {
      createAuthForm.value.authDays = '1';
    } else if (createAuthForm.value.authWay === 'TIME') {
      createAuthForm.value.authDays = '';
      createAuthForm.value.authExpireTimes = null;
    }
  };

  //激活账户相关
  const activeData = ref({
    loading: false,
    isActiveVisible: false,
    activeCode: '',
  });

  const onShowActive = async () => {
    activeData.value.isActiveVisible = true;
  };

  const onActiveAccount = async () => {
    activeData.value.loading = true;
    try {
      await activeAuthAccount(activeData.value);
      activeData.value.isActiveVisible = false;
      message.success('🎉恭喜！你已成功激活一个账户！');
      onSearch();
    } finally {
      activeData.value.loading = false;
    }
  };

  /******************* 店铺跳转 ***************** */

  //跳转商品页面
  const go = useGo();
  const goThirdShop = async (card) => {
    go('/goods/index');
  };
  const closeModal = () => {
    isDetailsModalVisible.value = false;
  };

  /************************漫游引导********************** */
  const activeStep = ref(null);
  const goodsStep = ref(null);
  const discordStep = ref(null);
  const accountGroupStep = ref(null);

  const accountStep = ref({
    open: false,
    current: 0,
    steps: [
      {
        title: '托管账号',
        description:
          '如果有自己的Discord账号，可以先获取Discord的token然后到Discord账号页签进行账号一键托管。',
        placement: 'center',
      },
      {
        title: '账号组',
        description:
          '托管Discord账号后即可点击这里进行创建Discord账号组，账号组是一个Discord的集合，用于突破Midjourney并发上限！',
        placement: 'right',
        target: () => accountGroupStep.value && accountGroupStep.value.$el,
      },

      {
        title: '激活账号',
        description:
          '如果你从集市或者朋友那分享获取到了授权码，可以点这里进行激活。激活后你就可以使用该账号进行作图了~',
        placement: 'right',
        target: () => activeStep.value && activeStep.value.$el,
      },
      {
        title: '商品集市',
        description: '如果你没有自己的账号，并且需要进行作图。可以考虑到这里购买~',
        placement: 'right',
        target: () => goodsStep.value && goodsStep.value.$el,
      },
    ],
  });

  const accountStepOpen = async (val) => {
    if (val === true) {
      const needShow = getCustomLocalCache(MJ_ACCOUNT_TOUR);
      if (needShow && needShow === true) {
        return;
      }
      setCustomLocalCache(MJ_ACCOUNT_TOUR, true);
    }

    // const resp = await userStep({ content: 'MJ_ACCOUNT_TOUR' });
    // if (resp) {
    //   accountStep.value.open = val;
    // }

    accountStep.value.open = val;
  };

  defineExpose({
    closeModal,
    accountStepOpen,
  });
</script>

<style scoped>
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

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    flex: 1;
    align-content: start;
    margin-top: 10px;
    padding: 10px;
    overflow: auto;
    gap: 14px;
  }

  .card {
    min-width: 300px;
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

  .account-card >>> .ant-card-head {
    padding: 0 10px;
  }
</style>
./discord
