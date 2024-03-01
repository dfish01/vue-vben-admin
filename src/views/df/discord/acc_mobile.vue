<template>
  <a-layout class="app" loading-tip="加载中...">
    <Loading :loading="globalLoading" :absolute="false" tip="正在加载中..." />
    <!-- 查询选项卡 -->
    <a-card :bodyStyle="{ padding: 0, height: '50px' }" ref="formRef">
      <a-row
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 50px;
          padding: 0 10px;
        "
      >
        <div style="display: flex; align-items: center">
          <a-image src="/logo.png" :width="38" :height="38" :preview="false" />
          <span style="margin-left: 5px; font-size: 16px; font-weight: bold">账号管理</span>
        </div>
        <div style="display: flex; gap: 5px">
          <a-button-group>
            <a-tooltip title="偷个懒，请去PC端执行添加账号操作吧~">
              <a-dropdown :trigger="['click']" disabled>
                <a-button style="padding: 5px"
                  ><Icon icon="mdi:account-multiple-add" size="22"
                /></a-button>
                <template #overlay>
                  <a-menu disabled>
                    <a-menu-item key="5" disabled>
                      <a-popconfirm
                        title="⚠️新增账号"
                        ok-text="立即预览"
                        cancel-text="取消"
                        @confirm="onAdd"
                      >
                        📺新增账户
                      </a-popconfirm>
                    </a-menu-item>
                    <a-menu-item key="5" disabled>
                      <a-popconfirm
                        title="⚠️创建账号组"
                        ok-text="立即预览"
                        cancel-text="取消"
                        @confirm="onAdd"
                      >
                        📝创建账号组
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-tooltip>
            <a-tooltip title="">
              <a-button @click="showQueryView" @click.prevent style="padding: 5px">
                <SvgIcon name="list_search" size="20" />
              </a-button>
            </a-tooltip>
            
   
            <a-dropdown :trigger="['click']">
              <a-button style="padding: 5px" 
                > <SvgIcon size="20" name="shopping" /></a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="4" @click="goView('/goods/index')">商品市场
                  </a-menu-item>
                  <a-menu-item key="5" @click="goView('/sec_goods/index')">转售市场
                  </a-menu-item>

                  
                </a-menu>
              </template>
            </a-dropdown>


            <a-tooltip title="">
              <a-button @click="onShowActive" style="padding: 5px">
                <Icon icon="solar:key-square-2-linear" size="20" color="green" />
              </a-button>
            </a-tooltip>
          </a-button-group>
        </div>
      </a-row>
    </a-card>

    <div
      v-if="tableData.length === 0"
      style="display: flex; align-items: center; justify-content: center"
      :style="{ height: `calc(${contentHeight}px )`, overflow: 'auto' }"
    >
      <a-empty :image="simpleImage" />
    </div>

    <div
      class="cards"
      v-else
      :style="{
        height: `calc(${contentHeight}px)`,
        overflow: 'auto',
        padding: '4px 6px',
      }"
    >
      <div v-for="card in tableData" :key="card.id" :trigger="['contextmenu']">
        
          <a-card :size="small" :style="{'margin-left': 0}" style="margin-bottom: 1px" :bodyStyle="{ padding: '0px', margin: '0px' }" class="card account-card" hoverable>
            <template #extra>
              <div
              style="
                display: flex;
                width: 250px;
               
              "
            >
              <div style="justify-content: left">
                <Icon icon="ic:outline-bookmark-add" /><span style="margin-left: 5px">
                  {{ card.accountName }}</span
                >
              </div>
            </div>
              
              
            </template>
            <div style="display: flex; flex-direction: column; padding: 10px">
              <a-row class="card-tags">
                <span>
                  <Icon icon="ic:outline-emoji-flags" class="vel-icon icon" aria-hidden="true" size="14" />
                  类型： <span style="font-size: 13px"><a-tag :color="card.ownerFlag == 'Y' ? 'red' : 'blue'">{{ card.ownerFlag == 'Y' ? '主账号' : '授权' }}</a-tag> </span></span
                >
              </a-row>
             
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
                <span v-if="card.state === 'sale'">
                  <a-popconfirm
                    v-if="card.ownerFlag === 'N'"
                    title="是否撤回该商品的二次售出？"
                    ok-text="确定"
                    cancel-text="取消"
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
                <span v-if="card.state === 'normal' && card.canSale === 'Y'">
                  <a-button size="small" style="font-size: 12px" @click="showRedeploy(card)">
                    <span>
                      <Icon
                        icon="mingcute:sale-line"
                        class="vel-icon icon"
                        aria-hidden="true"
                        size="14"
                      />
                      出售商品
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
                    <span>
                    <Icon
                        icon="basil:info-rect-outline"
                        class="vel-icon icon"
                        aria-hidden="true"
                        size="14"
                      />
                      使用概况
                    </span>
                  </a-button>
                </span>
              </a-row>
              <a-row class="card-tags">
                <span>
                  🕐︎ <span style="font-size: 12px">{{ card.gmtCreate }}</span></span
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

              </a-button
                >
                <a-col :span="24">
                  <a-divider
                    style="width: 100%; margin-top: 8px; margin-bottom: 1px; margin-left: 0"
                  />
                </a-col>
              </a-row>

              <a-row class="card-tags" style="margin-top: 5px" v-if="card.ownerFlag === 'Y'">
                <a-col
                  :span="24"
                  style="display: flex; justify-content: center; align-item: center"
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
      width="100%"
      wrap-class-name="full-modal "
      :bodyStyle="{ padding: '0px' }"
      @ok="closeDetail"
      :confirmLoading="statisticsForm.loading"
    >
      <template #footer>
        <a-button key="submit" type="primary" :loading="statisticsForm.loading" @click="closeDetail"
          >已知晓</a-button
        >
      </template>
      <a-card :bodyStyle="{ padding: '0px' }">
        <Loading :loading="statisticsForm.loading" :absolute="true" tip="数据加载中..." />

        <a-descriptions :column="2" bordered layout="vertical">
          <a-descriptions-item label="账户名" :style="{ width: '48%' }" :span="1">{{
            statisticsForm.formData.accountName
          }}</a-descriptions-item>
          <a-descriptions-item label="账号模式" :style="{ width: '48%' }" :span="1">{{
            statisticsForm.formData.accMode === 'GROUP' ? '账号组' : '单账号'
          }}</a-descriptions-item>
          <a-descriptions-item label="账号权限">{{
            statisticsForm.formData.ownerFlag === 'N' ? '授权' : '主账号'
          }}</a-descriptions-item>
          <a-descriptions-item :span="3" label="负载信息">
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
            <span>
              turbo次数: {{ statisticsForm.formData.authUseInfo.turboTimes }} /
              {{
                statisticsForm.formData.authUseInfo.totalTurboTimes
                  ? statisticsForm.formData.authUseInfo.totalTurboTimes
                  : ' ∞'
              }}
              <br />
              快速次数: {{ statisticsForm.formData.authUseInfo.fastTimes }} /
              {{
                statisticsForm.formData.authUseInfo.totalFastTimes
                  ? statisticsForm.formData.authUseInfo.totalFastTimes
                  : ' ∞'
              }}
              <br />
              relax次数: {{ statisticsForm.formData.authUseInfo.relaxTimes }} /
              {{
                statisticsForm.formData.authUseInfo.totalRelaxTimes
                  ? statisticsForm.formData.authUseInfo.totalRelaxTimes
                  : ' ∞'
              }}
              <br />
              <!-- 成功次数:{{ statisticsForm.formData.authUseInfo.numSuccess }} -->
              <br />
              到期时间:{{ statisticsForm.formData.authUseInfo.expireTime }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item
            :span="3"
            label="授权账号概况"
            v-if="statisticsForm.formData.ownerFlag === 'Y'"
          >
            <span>
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
                v-if="false"
                dataIndex="globalName"
                key="globalName"
                :width="200"
              />
              <a-table-column title="邮箱" dataIndex="email" key="email" />
              <a-table-column
                title="Discord状态"
                dataIndex="discordState"
                key="discordState"
                :width="100"
              >
                <template #default="{ text }">
                  <a-badge
                    :status="getDiscordStateContent(text).status"
                    :text="getDiscordStateContent(text).text"
                  />
                </template>
              </a-table-column>
              <a-table-column title="MJ状态" dataIndex="mjState" key="mjState" :width="100">
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
      title="🍏新建账户"
      ok-text="立即创建"
      @ok="onSubmitAdd"
      :confirmLoading="accountForm.loading"
    >
      <a-card>
        <Loading :loading="accountForm.loading" :absolute="true" tip="正在提交..." />
        <a-form :model="accountForm" layout="vertical" ref="accountFormRef">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item
                label="🐵账号名（账号多的时候方便记）"
                :rules="[
                  {
                    required: true,
                    message: '账号名名称是必填项',
                  },
                ]"
                name="accountName"
              >
                <a-input v-model:value="accountForm.accountName" placeholder="输入账号名" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="🐧分配Discord账号"
                :rules="[
                  {
                    required: true,
                    message: 'discord账号是必填项',
                  },
                ]"
                name="discordUserId"
              >
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
                label="🍵执行服务器"
                :rules="[
                  {
                    required: true,
                    message: '执行服务器是必填项',
                  },
                ]"
                name="guildId"
              >
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
                label="🍙默认频道"
                :rules="[
                  {
                    required: true,
                    message: '默认频道是必填项',
                  },
                ]"
                name="channelId"
              >
                <a-select
                  v-model:value="accountForm.channelId"
                  style="width: 100%"
                  placeholder="请选择默认频道"
                  :options="accountForm.channelOptions"
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
      width="100%"
      wrap-class-name="full-modal "
      :bodyStyle="{ padding: '0px' }"
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
      width="100%"
      wrap-class-name="full-modal "
      :bodyStyle="{ padding: '0px' }"
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
            <a-col :span="24">
              <a-form-item label="提交任务数" name="maxSubmit">
                <a-input-number
                  v-model:value="createAuthForm.otherInfo.maxSubmit"
                  placeholder="请输提交任务数，为空则上限为主账号上限~"
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

     <!-- 二次出售 -->
     <a-modal
      v-model:open="redeployForm.isActiveVisible"
      title="转售"
      ok-text="提交"
      @ok="onRedeploy"
      :confirmLoading="redeployForm.loading"
      :bodyStyle="{padding: 0}"
      width="100%"
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
                <a-input show-count :maxlength="15" v-model:value="redeployForm.goodsTitle" placeholder="请输入商品标题" />
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

                  show-count :maxlength="60"
                />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item
                label="商品售价"
                name="goodsPrice"
                :rules="[{ required: true, message: '请输入出售价格!' }]"
              >
              <a-input-number
                  v-model:value="redeployForm.goodsPrice"
                  style="width: 100%"
                  :min="1"
                  :max="9999"
                  placeholder="请输入出售价格"
                  :step="1"
                  string-mode
                />
                <!-- <a-input v-model:value="redeployForm.goodsPrice" placeholder="请输入出售价格~" /> -->
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-modal>

    <!-- 授权列表 -->
    <a-modal
      v-model:open="authListForm.isAuthModalVisible"
      width="100%"
      wrap-class-name="full-modal "
      :bodyStyle="{ padding: '0px' }"
    >
      <template #title>
        <Icon
          icon="streamline-emojis:beaming-face-with-smiling-eyes"
          class="vel-icon icon"
          aria-hidden="true"
        />
        授权列表
      </template>
      <template #footer>
        <a-button key="submit" type="primary" @click="closeAuthModal">已知晓</a-button>
      </template>
      <Loading :loading="authListForm.loading" :absolute="true" tip="数加载中..." />
      <div style="width: 100%; padding: 10px; overflow-x: auto">
        <a-table :dataSource="authListTableData" class="a-table" :scroll="{ x: 'max-content' }">
          <a-table-column
            v-for="column in authColumns"
            :v-if="!column.hidden"
            :key="column.key"
            :title="column.title"
            :dataIndex="column.dataIndex"
          />
        </a-table>
      </div>
    </a-modal>

    <!-- 详情模态窗口组件 -->
    <account-details-modal
      style="top: 80px"
      :id="selectedAccountId"
      :visible="isDetailsModalVisible"
      @update-visible="updateModalVisible"
    />

    <!-- 条件查询 -->
    <a-modal
      v-model:open="showQueryViewFlag"
      width="100%"
      title="🔍️条件查询"
      :bodyStyle="{ padding: '7px 12px 7px 12px', width: '100%', 'align-items': 'center' }"
    >
      <template #footer>
        <a-button key="submit" type="primary" @click="doModelSearch()">立即查询</a-button>
      </template>
      <a-card
        :bordered="false"
        :bodyStyle="{ padding: '1px 1px 1px 1px', width: '100%', 'align-items': 'center' }"
      >
        <!-- <a-row :gutter="[0, 2]" type="flex">
          <a-col flex="80px">
            <a-tag class="quality-tag" color="default">🍺状态 </a-tag>
          </a-col>
          <a-col flex="auto">
            <a-select placeholder="类型" v-model:value="search.state" style="width: 100%" class="mobile-select">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="待验证">待验证</a-select-option>
              <a-select-option value="正常">正 常</a-select-option>
              <a-select-option value="异常">异 常</a-select-option>
              <a-select-option value="过期">结 束</a-select-option>
            </a-select>
          </a-col>
        </a-row> -->
        <a-row :gutter="[0, 2]" type="flex" style="margin-top: 7px">
          <a-col flex="80px">
            <a-tag class="quality-tag" color="default">🍥权限 </a-tag>
          </a-col>
          <a-col flex="auto">
            <a-select
              placeholder="选择账号权限"
              v-model:value="search.ownerFlag"
              class="mobile-select"
              style="width: 100%"
            >
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="N">授权</a-select-option>
              <a-select-option value="Y">自有</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row type="flex" :gutter="[0, 2]" style="margin-top: 7px">
          <a-col flex="80px">
            <a-tag class="quality-tag" color="default">🥝名称 </a-tag>
          </a-col>
          <a-col flex="auto">
            <a-input v-model:value="search.accountName" placeholder="输入账号名称" />
          </a-col>
        </a-row>
      </a-card>
    </a-modal>
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, unref } from 'vue';
  import { Loading } from '/@/components/Loading';
  import { SvgIcon } from '/@/components/Icon';
  import { Empty, message } from 'ant-design-vue';
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
  import Discord from './discord.vue';
  import Icon from '/@/components/Icon/Icon.vue';
  import {
    discordAddToken,
    discordList,
    discordInfo,
    channelList,
    guildList,
  } from '/@/api/df/discord';
  import { deployNewGoods, deploySecondHandGoods, cancelSecondHandGoods } from '/@/api/df/goods';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { discordApi } from './discord';

  import { useGo } from '/@/hooks/web/usePage';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

  const go = useGo();
  const goView = async (routePath) => {
    go(routePath);
  };
  /** 页面高度计算开始 */
  const formRef = ref();
  //页面高度处理
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 0);
  //移动设备底部导航栏
  const offsetHeightRef = ref(151);
  const subtractHeightRefs = ref([]);

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
    accountViewForm,
    onAdd,
    onSelectDiscordUser,
    onSelectGuild,
    queryDiscordList,
  } = discordApi();

  const showQueryViewFlag = ref(false);
  const showQueryView = () => {
    showQueryViewFlag.value = true;
  };
  const doModelSearch = () => {
    // 验证消息来源和内容，然后关闭 iframe
    showQueryViewFlag.value = false;
    onSearch();
  };

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

  onMounted(() => {
    onSearch();
    queryDiscordList({});
  });

  // 主table 数据
  const tableData = ref<AccountListItem[]>([
    // 更多数据...
  ]);

  //授权列表相关 开始
  const authListForm = ref({
    loading: false,
    isAuthModalVisible: false,
    authList: {},
  });
  const authListTableData = ref<AccountAuthListResp[]>([
    // 更多数据...
  ]);

  // const authList = ref([
  //   { id: '1', authCode: '123456', user: '张三', authTime: '2023-07-20 18:00:00' },
  //   { id: '2', authCode: '789012', user: '李四', authTime: '2023-07-21 18:00:00' },
  // ]);
  const authColumns = [
    // { title: 'ID', dataIndex: 'id', key: 'id', hidden: true },
    { title: '授权码', dataIndex: 'authCode', key: 'authCode', width: 100 },
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

  const showAuthorizationList = async (id) => {
    // 显示授权列表
    authListForm.value.loading = true;
    try {
      authListForm.value.isAuthModalVisible = true;
      authListTableData.value = await accountAuthList({ accountId: id, source: 'MJ' });
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
    otherInfo: {
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
      const foundItem = tableData.value.find(item => item.id === redeployForm.value.accountId);
      foundItem.state = 'sale';

      redeployForm.value.isActiveVisible = false;
      // onSearch();
    } finally {
      redeployForm.value.loading = false;
    }
  };

  const doCancelSecondHandGoods = async (card) => {
    globalLoading.value = true;
    try {
      const state = await cancelSecondHandGoods({ id: card.id });
      console.log("=============" + state)
      card.state = state;
    } finally {
      globalLoading.value = false;
    }
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

  .app {
    display: grid;
    grid-template-rows: auto 1fr auto;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    flex: 1;
    align-content: start;
    padding: 2px;
    overflow: auto;
    gap: 4px;
  }

  .card {
    min-width: 250px;
    border-radius: 10px;
  }

  .card >>> img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 7%;
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

  .search-card {
    display: flex;
    align-items: center;
    height: 45px;
    border-radius: 4px;
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

  .account-card >>> .ant-card-head-title {
    padding: 0 !important;
  }

  .account-card >>> .ant-card-extra {
    margin-left: 0 !important;
  }

</style>
<style lang="less">
  .full-modal {
    .ant-modal {
      top: 0;
      max-width: 100%;
      margin: 0;
      padding-bottom: 0;
    }

    .ant-modal-content {
      display: flex;
      flex-direction: column;
    }
  }
</style>
