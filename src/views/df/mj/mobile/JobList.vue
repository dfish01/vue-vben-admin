<template>
  <a-layout class="app" v-loading="loadingRef">
    <a-card :bodyStyle="{ padding: 0, height: '50px' }">
      <a-row
        ref="formRef"
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
          <span style="margin-left: 5px; font-size: 16px; font-weight: bold"
            >{{ accountForm.currentSpaceTitle }}
          </span>
          工作区
        </div>
        <div style="display: flex; gap: 5px">
          <a-button-group>
            <a-tooltip>
              <a-button @click="showQueryView" @click.prevent style="padding: 5px">
                <SvgIcon name="list_search" size="20" />
              </a-button>
            </a-tooltip>

            <a-tooltip>
              <a-dropdown :trigger="['click']">
                <a-button style="padding: 5px">
                  <SvgIcon name="sys_setting02" size="20" />
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="11">
                      <a-popconfirm
                        :title="
                          userSetting.cardShow === 'SINGLE'
                            ? '开启后，列表显示4图，点击可放大。明细页在右键列表~'
                            : '开启后，列表显示单图，点击出现明细页~'
                        "
                        :ok-text="userSetting.cardShow === 'SINGLE' ? '立即开启' : '立即开启'"
                        cancel-text="取消"
                        @confirm="setCardShow()"
                      >
                        ✨{{ userSetting.cardShow === 'SINGLE' ? '列表4图模式' : '列表单图模式' }}
                      </a-popconfirm>
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="5">
                      <a-popconfirm
                        title="⚠️以卡片的方式进行预览，建议配合原图模式。"
                        ok-text="立即预览"
                        cancel-text="取消"
                        @confirm="showAllImage(false)"
                      >
                        📺全量清晰预览
                      </a-popconfirm>
                    </a-menu-item>
                    <a-menu-item key="5">
                      <a-popconfirm
                        title="⚠️以卡片的方式进行预览，建议配合原图模式。"
                        ok-text="立即预览"
                        cancel-text="取消"
                        @confirm="showAllImage(true)"
                      >
                        📺全量预览
                      </a-popconfirm>
                    </a-menu-item>

                    <a-menu-divider />
                    <a-menu-item key="4" disabled>
                      <a-popconfirm
                        title="该选项默认暂时未作存储，默认关闭状态，刷新就失效了！分割图场景适用~"
                        :ok-text="userSetting.useUpImage ? '确认关闭' : '确认开启'"
                        cancel-text="取消"
                        @confirm="setUseUpImage()"
                      >
                        🍝{{ userSetting.useUpImage ? '开启缩略图' : '开启原图' }}
                      </a-popconfirm>
                    </a-menu-item>

                    <a-menu-item key="5" disabled>
                      <a-popconfirm
                        title="我的网速无懈可击！！！"
                        :ok-text="userSetting.usePersonNet ? '还是加速吧' : '就是要原连接'"
                        cancel-text="取消"
                        @confirm="setUsePersonNet()"
                      >
                        🏄{{ userSetting.usePersonNet ? '加速连接' : '使用原连接' }}
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-tooltip>
            <a-tooltip>
              <a-dropdown :trigger="['click']">
                <a-button style="padding: 5px"><SvgIcon name="sys_setting03" size="20" /></a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="3" class="delete">
                      <a-popconfirm
                        title="请确认相关账号的remix状态，这里只是控制弹窗而已（暂时未接入实时控制Remix）。如果remix状态不匹配，会导致任务失败!"
                        :ok-text="remix.enable_flag ? '关闭Remix' : '开启Remix'"
                        cancel-text="取消"
                        @confirm="changeRemix()"
                      >
                        📝{{ remix.enable_flag ? '关闭Remix' : '开启Remix' }}
                      </a-popconfirm>
                    </a-menu-item>
                    <a-menu-item key="5">
                      <a-popconfirm
                        title="提交任务自动刷新！！！"
                        :ok-text="userSetting.taskRefresh ? '关闭刷新' : '开启刷新'"
                        cancel-text="取消"
                        @confirm="setTaskRefresh()"
                      >
                        💫{{ userSetting.taskRefresh ? '关闭刷新' : '开启刷新' }}
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-tooltip>
            <a-tooltip>
              <a-dropdown :trigger="['click']">
                <a-button style="padding: 5px"><SvgIcon name="delete" size="20" /></a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="1">
                      <a-popconfirm
                        title="将永久删除该空间下的全部排队记录，是否确认删除?"
                        ok-text="确认删除"
                        cancel-text="取消"
                        @confirm="deleteBatchHandle('QUEUED')"
                      >
                        <a>❌排队</a>
                      </a-popconfirm>
                    </a-menu-item>

                    <a-menu-item key="2">
                      <a-popconfirm
                        title="将永久删除该空间下的全部失败记录，是否确认删除?"
                        ok-text="确认删除"
                        cancel-text="取消"
                        @confirm="deleteBatchHandle('FAILED')"
                      >
                        <a>❌失败</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-tooltip>
          </a-button-group>
        </div>
      </a-row>
    </a-card>

    <div
      v-if="cards.length === 0"
      style="display: flex; align-items: center; justify-content: center"
      :style="{ height: `calc(${contentHeight}px `, overflow: 'auto' }"
    >
      <a-empty :image="simpleImage" />
    </div>
    <div v-else class="cards" :style="{ height: `calc(${contentHeight}px `, overflow: 'auto' }">
      <div v-for="card in cards" :key="card.id" :trigger="['contextmenu']">
        <a-card :bodyStyle="{ padding: '0px' }" class="card" hoverable>
          <div v-if="card.state === 'QUEUED'" class="mask-queued label-front">
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              "
            >
              <span>
                <Icon icon="line-md:coffee-loop" size="70" color="#91C8E4" />
              </span>
              <div>
                <span> 正在排队中... </span>
              </div>
              <div style="padding: 0 18px">
                <span>
                  {{ '共享账号使用非公平调度！尽最大可能保证每个用户轮流使用。请耐心等待...' }}
                </span>
              </div>
            </div>
          </div>
          <div v-if="card.state === 'RUNNING'" class="mask-queued label-front">
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              "
            >
              <span>
                <Icon icon="line-md:coffee-half-empty-twotone-loop" size="70" color="#749BC2" />
              </span>
              <div>
                <span>
                  {{ card.mjExecute === 'N' ? '正在执行中...' : 'MJ正在绘画中...' }}
                </span>
              </div>
              <div v-if="card.process">
                <span>
                  {{ '绘画进度：' + card.process }}
                </span>
              </div>
              <div v-else>
                <span v-if="card.mode === 'turbo'">
                  {{ 'turbo模式预计30秒内完成...' }}
                </span>
                <span v-if="card.mode === 'fast'">
                  {{ 'fast模式预计1分30秒内完成...' }}
                </span>
                <span v-if="card.mode === 'relax'">
                  {{ 'relax模式预计3~6分钟完成...' }}
                </span>
              </div>
            </div>
          </div>
          <div v-if="card.state === 'READY'" class="mask-queued label-front">
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              "
            >
              <span>
                <Icon icon="line-md:coffee-half-empty-twotone-loop" size="70" color="#749BC2" />
              </span>

              <div>
                <div>
                  <span> {{ '任务已准备就绪，即将执行...' }} </span>
                </div>
                <div>
                  <span v-if="card.mode === 'turbo'">
                    {{ 'turbo模式预计30秒内完成...' }}
                  </span>
                  <span v-if="card.mode === 'fast'">
                    {{ 'fast模式预计1分30秒内完成...' }}
                  </span>
                  <span v-if="card.mode === 'relax'">
                    {{ 'relax模式预计3~6分钟完成...' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="card.state === 'FAILED'" class="mask-queued label-front">
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              "
              class="error-text"
            >
              <span>
                <Icon icon="carbon:face-dizzy-filled" size="60" color="#FF6969" />
              </span>
              <div v-if="card.failMsg">
                <span v-if="card.failMsg" style="margin-top: 10px"> {{ card.failMsg }} </span>
              </div>
              <div v-else>
                <span> {{ '失败了，多次失败请联系客服！' }} </span>
              </div>
            </div>
          </div>
          <div v-if="card.state === 'SUCCESS'">
            <div v-if="userSetting.cardShow === 'MULTI'">
              <a-card
                :bodyStyle="{ padding: '0px' }"
                class="my-transparent-card"
                style="width: 100%; border: none; background: transparent"
                v-if="card.taskImage.infoImageList.length > 1"
                :bordered="false"
                :hoverable="false"
              >
                <a-card-grid
                  v-for="infoImage in card.taskImage.infoImageList"
                  :key="infoImage.url"
                  style="
                    position: relative;
                    width: 49%;
                    margin: 0;
                    padding: 0;
                    border-radius: 8px;
                    text-align: center;
                  "
                >
                  <!-- <div
                    v-show="!infoImage.loaded"
                    :style="{
                      width: '100%',
                      height: '100%',
                      paddingBottom: `${
                        (card.taskImage.imageHeight / card.taskImage.imageWidth) * 100
                      }%`,
                    }"
                  >
                    <SvgIcon
                      name="loading"
                      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
                    />
                  </div> -->
                  <img
                    @click="showInfoImage(getImageList(card), infoImage.url)"
                    v-lazy.container="infoImage.mediaUrl"
                    style="max-width: 100%; border-radius: 8px"
                    alt=""
                    @load="imageLoaded(infoImage)"
                  />
                </a-card-grid>
              </a-card>
              <a-card
                :bodyStyle="{ padding: '0px' }"
                style="width: 100%"
                :bordered="false"
                :hoverable="false"
                class="my-transparent-card"
                v-else
                ><a-card-grid
                  v-for="infoImage in card.taskImage.infoImageList"
                  :key="infoImage.url"
                  style="width: 100%; padding: 0; border-radius: 8px; text-align: center"
                >
                  <img
                    @click="showInfoImage(getImageList(card), infoImage.url)"
                    v-lazy.container="infoImage.mediaUrl"
                    style="max-width: 100%; border-radius: 8px"
                    alt=""
                    @load="imageLoaded(card)"
                  />
                </a-card-grid>
              </a-card>
            </div>
            <div v-else>
              <a-card
                :bodyStyle="{ padding: '0px' }"
                class="my-transparent-card"
                style="width: 100%; border: none; background: transparent"
                :bordered="false"
                :hoverable="false"
              >
                <img
                  @click="showInfoImage([card.taskImage.imageUrl], card.taskImage.imageUrl)"
                  v-lazy.container="card.taskImage.mediaImageUrl"
                  fallback=""
                  alt=""
                  @load="imageLoaded(card)"
                />
              </a-card>
            </div>
          </div>

          <div
            v-if="card.state != 'SUCCESS'"
            style="
              display: flex;
              position: absolute;
              bottom: 35px;
              flex-direction: row;
              justify-content: center;
              width: 100%;
            "
          >
            <a-button-group size="small" buttonStyle="solid">
              <a-tooltip title="" v-if="card.state === 'FAILED'">
                <a-popconfirm
                  title="是否重新提交该任务?"
                  ok-text="重新提交"
                  cancel-text="取消"
                  @confirm="doRetryDrawTask(card)"
                >
                  <a-button class="card-icon-button">
                    <Icon icon="pajamas:retry" size="14" color="#4F709C" />
                  </a-button>
                </a-popconfirm>
              </a-tooltip>
              <a-tooltip v-if="card.prompt" :overlayStyle="{ maxWidth: '500px' }" trigger="click">
                <template #title>
                  <p v-for="(part, index) in card.prompt.split('\n\n')" :key="index">{{
                    part.trim()
                  }}</p>
                </template>
                <a-button class="card-icon-button">
                  <Icon icon="ic:outline-info" size="14" color="#FFCC70" />
                </a-button>
              </a-tooltip>
              <a-tooltip>
                <template #title>
                  <p
                    style="margin: 5px; font-size: 12px; line-height: 1"
                    v-for="(part, index) in generateTooltipText(card)"
                    :key="index"
                  >
                    {{ part.trim() }}
                  </p>
                </template>
                <a-button class="card-icon-button">
                  <Icon icon="ic:baseline-add-alarm" size="14" color="#EE9322" />
                </a-button>
              </a-tooltip>
              <a-tooltip title="删除">
                <a-popconfirm
                  :title="
                    card.secState === 'SUBMITTED' || card.secState === 'IN_PROGRESS'
                      ? '是否确认移除任务？注意：该状态不会退还资源！请等待任务完成或者自动超时失败退还资源！'
                      : '是否确认移除任务？'
                  "
                  ok-text="确认删除"
                  cancel-text="取消"
                  @confirm="deleteCard(card)"
                >
                  <a-button class="card-icon-button">
                    <Icon icon="ic:baseline-delete-forever" size="14" color="#FF6969" />
                  </a-button>
                </a-popconfirm>
              </a-tooltip>
            </a-button-group>
          </div>

          <div
            v-else
            style="display: flex; flex-direction: column; padding-right: 4px; padding-bottom: 5px"
          >
            <div class="card-tags">
              <div class="custom-radio-group">
                <a-button-group size="small" buttonStyle="solid">
                  <!-- <a-tooltip
                    :title="
                      card.privacyMode === 'Y' ? '点击公开图片' : '当前公开图片，点击将关闭公开'
                    "
                    v-if="card.state === 'SUCCESS' && card.commandType != 'DESCRIBE'"
                  >
                    <a-button @click="toggleVisibility(card)" class="card-icon-button">
                      <span v-if="card.privacyMode === 'Y'">
                        <Icon icon="material-symbols:public-off" size="14" color="#B4B4B3" />
                      </span>
                      <span v-else>
                        <Icon icon="material-symbols:public" size="14" color="#8ECDDD" />
                      </span>
                    </a-button>
                  </a-tooltip> -->
                  <a-tooltip title="任务概况">
                    <a-button class="card-icon-button" @click="() => showTaskInfo(card)">
                      <Icon icon="streamline-emojis:television" size="14" />
                    </a-button>
                  </a-tooltip>

                  <!-- prompt 相关 -->
                  <a-tooltip title="Prompt操作">
                    <a-dropdown trigger="click">
                      <a-button class="card-icon-button">
                        <Icon icon="streamline-emojis:bell" size="14" color="#FFCC70" />
                      </a-button>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item key="5" @click="() => goDrawing(card.prompt)"
                            ><Icon icon="streamline-emojis:artist-palette" color="grey" />
                            画同款</a-menu-item
                          >
                          <a-menu-item key="5" @click="() => copyText(card.prompt)"
                            ><Icon icon="streamline-emojis:baseball" color="grey" />
                            复制Prompt</a-menu-item
                          >
                          <a-menu-item key="4" @click="() => copyText(card.messageHash)"
                            ><Icon icon="fluent-emoji-flat:id-button" color="grey" />
                            复制任务ID</a-menu-item
                          >
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </a-tooltip>

                  <!-- 添加到收藏 -->
                  <a-tooltip title="添加到收藏">
                    <a-button
                      class="card-icon-button"
                      @click="() => showAddCollectCategoryModel(card)"
                    >
                      <Icon icon="streamline-emojis:heart-with-arrow" size="14" color="#4F709C" />
                    </a-button>
                  </a-tooltip>

                  <!-- <a-tooltip
                    v-if="card.prompt"
                    :overlayStyle="{ maxWidth: '500px' }"
                    trigger="click"
                  >
                    <template #title>
                      <p v-for="(part, index) in card.prompt.split('\n\n')" :key="index">{{
                        part.trim()
                      }}</p>
                    </template>
                    <a-button class="card-icon-button">
                      <Icon icon="ic:outline-info" size="14" color="#FFCC70" />
                    </a-button>
                  </a-tooltip> -->
                  <a-tooltip>
                    <template #title>
                      <p
                        style="margin: 5px; font-size: 12px; line-height: 1"
                        v-for="(part, index) in generateTooltipText(card)"
                        :key="index"
                      >
                        {{ part.trim() }}
                      </p>
                    </template>
                    <a-button class="card-icon-button">
                      <Icon icon="ic:baseline-add-alarm" size="14" color="#EE9322" />
                    </a-button>
                  </a-tooltip>

                  <a-tooltip title="删除">
                    <!-- <a-popover trigger="click">
                      <a-button class="card-icon-button">
                        <Icon icon="ic:baseline-delete-forever" size="14" color="#FF6969" />
                      </a-button>
                      <template #title></template>
                      <template #content>
                        <div style="width: 300px">
                          <a-row>
                            <p style="width: 300px">⚠ 相关操作不可逆，请小心操作~</p>
                          </a-row>
                          <a-row style="justify-content: right">
                            <a-button size="small" @click="handleCustomButton1">取消</a-button>
                            <a-tooltip title="从全部空间移除该任务！">
                              <a-popconfirm
                                title="该操作不可逆，是否确认删除?"
                                ok-text="确认删除"
                                cancel-text="取消"
                                @confirm="deleteCard(card)"
                              >
                                <a-button size="small" type="danger">删除任务</a-button>
                              </a-popconfirm>
                            </a-tooltip>
                            <a-tooltip title="移除当前空间的任务！">
                              <a-button
                                size="small"
                                type="primary"
                                @click="deleteSpaceCard(card, spaceId)"
                                >移除任务</a-button
                              >
                            </a-tooltip>
                          </a-row>
                        </div>
                      </template>
                    </a-popover> -->

                    <a-popconfirm
                      :title="
                        card.secState === 'SUBMITTED' ||
                        card.secState === 'IN_PROGRESS' ||
                        card.secState === 'SUCCESS'
                          ? '是否确认移除任务？注意：该状态不会退还资源！请等待任务完成或者自动超时失败退还资源！'
                          : '是否确认移除任务？'
                      "
                      ok-text="确认删除"
                      cancel-text="取消"
                      @confirm="deleteCard(card)"
                    >
                      <a-button class="card-icon-button">
                        <SvgIcon name="delete" size="14" />
                      </a-button>
                    </a-popconfirm>
                  </a-tooltip>

                  <a-tooltip
                    title="下载"
                    v-if="card.state === 'SUCCESS' && card.commandType != 'DESCRIBE'"
                  >
                    <a-button class="card-icon-button" @click="doDownload(card)">
                      <Icon icon="bx:bxs-cloud-download" size="14" color="#4F709C" />
                    </a-button>
                  </a-tooltip>
                  <!-- 其他设置 -->
                  <a-dropdown trigger="click">
                    <a-button class="card-icon-button"><SvgIcon name="menu" size="14" /></a-button>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item key="2" @click="() => showDrawTaskTagModel(card)"
                          ><Icon icon="streamline-emojis:blossom" /> 添加标签</a-menu-item
                        >
                        <a-menu-item key="3" @click="() => showSampleView(card)"
                          ><Icon icon="streamline-emojis:globe-showing-europe-africa" />
                          添加到官方案例</a-menu-item
                        >
                        <a-menu-item key="8" @click="() => getSeed(card.id, false)"
                          ><Icon icon="streamline-emojis:rocket" /> 获取Seed</a-menu-item
                        >
                      </a-menu>
                    </template>
                  </a-dropdown>
                </a-button-group>
              </div>
            </div>
            <div class="card-date-actions">
              <a-button-group>
                <div>
                  <div
                    v-if="
                      card.state === 'SUCCESS' &&
                      (card.commandType === 'IMAGINE' ||
                        card.commandType === 'BLEND' ||
                        card.commandType === 'ZOOM' ||
                        card.commandType === 'PAN' ||
                        card.commandType === 'VARIATION')
                    "
                  >
                    <a-dropdown>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item
                            @click="handleU(card, 'U1', 'image')"
                            key="1"
                            v-if="card.buttonMap['U1']"
                            ><Icon
                              icon="fluent:scale-fill-24-regular"
                              size="14px"
                              style="margin: 0"
                            />U1</a-menu-item
                          >
                          <a-menu-item
                            @click="handleU(card, 'U2', 'image')"
                            key="2"
                            v-if="card.buttonMap['U2']"
                            ><Icon
                              icon="fluent:scale-fill-24-regular"
                              size="14px"
                              style="margin: 0"
                            />U2</a-menu-item
                          >
                          <a-menu-item
                            @click="handleU(card, 'U3', 'image')"
                            key="3"
                            v-if="card.buttonMap['U3']"
                            ><Icon
                              icon="fluent:scale-fill-24-regular"
                              size="14px"
                              style="margin: 0"
                            />U3</a-menu-item
                          >
                          <a-menu-item
                            @click="handleU(card, 'U4', 'image')"
                            key="4"
                            v-if="card.buttonMap['U4']"
                            ><Icon
                              icon="fluent:scale-fill-24-regular"
                              size="14px"
                              style="margin: 0"
                            />U4</a-menu-item
                          >
                        </a-menu>
                      </template>
                      <a-button size="small" class="card-button">
                        <Icon icon="fluent:scale-fill-24-regular" size="14px" style="margin: 0" />
                        <span style="margin: 0">提升</span>
                        <DownOutlined />
                      </a-button>
                    </a-dropdown>

                    <a-dropdown v-if="card.commandType != 'PAN'">
                      <template #overlay>
                        <a-menu>
                          <a-menu-item
                            key="V1"
                            v-if="card.buttonMap['V1']"
                            @click="($event) => handleV(card, 'variation', 'V1')"
                            ><Icon
                              icon="ph:magic-wand-fill"
                              size="14px"
                              style="margin: 0"
                            />V1</a-menu-item
                          >
                          <a-menu-item
                            key="V2"
                            v-if="card.buttonMap['V2']"
                            @click="($event) => handleV(card, 'variation', 'V2')"
                            ><Icon
                              icon="ph:magic-wand-fill"
                              size="14px"
                              style="margin: 0"
                            />V2</a-menu-item
                          >
                          <a-menu-item
                            key="V3"
                            v-if="card.buttonMap['V3']"
                            @click="($event) => handleV(card, 'variation', 'V3')"
                            ><Icon
                              icon="ph:magic-wand-fill"
                              size="14px"
                              style="margin: 0"
                            />V3</a-menu-item
                          >
                          <a-menu-item
                            key="V4"
                            v-if="card.buttonMap['V4']"
                            @click="($event) => handleV(card, 'variation', 'V4')"
                            ><Icon
                              icon="ph:magic-wand-fill"
                              size="14px"
                              style="margin: 0"
                            />V4</a-menu-item
                          >
                          <!-- <a-menu-item
                            key="🔄"
                            v-if="card.buttonMap['🔄']"
                            @click="($event) => handleV(card, 'reroll', '🔄')"
                            >🔄</a-menu-item
                          > -->
                        </a-menu>
                      </template>
                      <a-button size="small" class="card-button">
                        <Icon icon="ph:magic-wand-fill" size="14px" style="margin: 0" />
                        <span style="margin: 0">变化</span>
                        <DownOutlined />
                      </a-button>
                    </a-dropdown>
                  </div>
                  <div v-if="card.state === 'SUCCESS' && card.commandType === 'UPSCALE'">
                    <a-dropdown
                      v-if="
                        card.buttonMap['⬆️'] ||
                        card.buttonMap['⬅️'] ||
                        card.buttonMap['⬇️'] ||
                        card.buttonMap['➡️']
                      "
                    >
                      <template #overlay>
                        <a-menu @click="($event) => handlePan(card, 'PAN', $event)">
                          <a-menu-item key="up" v-if="card.buttonMap['⬆️']"
                            ><Icon icon="mdi:pan-up" size="14px" style="margin: 0" />上</a-menu-item
                          >
                          <a-menu-item key="down" v-if="card.buttonMap['⬇️']"
                            ><Icon
                              icon="mdi:pan-down"
                              size="14px"
                              style="margin: 0"
                            />下</a-menu-item
                          >
                          <a-menu-item key="left" v-if="card.buttonMap['⬅️']"
                            ><Icon
                              icon="mdi:pan-left"
                              size="14px"
                              style="margin: 0"
                            />左</a-menu-item
                          >
                          <a-menu-item key="right" v-if="card.buttonMap['➡️']"
                            ><Icon
                              icon="mdi:pan-right"
                              size="14px"
                              style="margin: 0"
                            />右</a-menu-item
                          >
                        </a-menu>
                      </template>
                      <a-button size="small" class="card-button">
                        <Icon icon="mdi:pan" size="14px" style="margin: 0" />
                        <span style="margin: 0">平移</span>
                        <DownOutlined />
                      </a-button>
                    </a-dropdown>
                    <a-dropdown v-if="card.buttonMap['Zoom Out 1.5x']">
                      <template #overlay>
                        <a-menu @click="($event) => handleZoom(card, 'ZOOM', $event)">
                          <a-menu-item key="Zoom Out 1.5x" v-if="card.buttonMap['Zoom Out 1.5x']"
                            ><Icon
                              icon="fluent:zoom-fit-16-regular"
                              size="14px"
                              style="margin: 0"
                            />1.5倍</a-menu-item
                          >
                          <a-menu-item key="Zoom Out 2x" v-if="card.buttonMap['Zoom Out 2x']"
                            ><Icon
                              icon="fluent:zoom-fit-16-regular"
                              size="14px"
                              style="margin: 0"
                            />2 倍</a-menu-item
                          >
                          <a-menu-item key="Custom Zoom" v-if="card.buttonMap['Custom Zoom']"
                            ><Icon
                              icon="material-symbols:pinch-zoom-out-outline-rounded"
                              size="14px"
                              style="margin: 0"
                            />自定义</a-menu-item
                          >
                          <a-menu-item key="Make Square" v-if="card.buttonMap['Make Square']"
                            ><Icon
                              icon="ph:square"
                              size="14px"
                              style="margin: 0"
                            />转成1:1</a-menu-item
                          >
                        </a-menu>
                      </template>
                      <a-button size="small" class="card-button">
                        <Icon icon="fluent:zoom-fit-16-regular" size="14px" style="margin: 0" />
                        <span style="margin: 0">缩放</span>
                        <DownOutlined />
                      </a-button>
                    </a-dropdown>

                    <a-dropdown
                      v-if="
                        card.buttonMap['Vary (Strong)'] ||
                        card.buttonMap['Vary (Subtle)'] ||
                        card.buttonMap['Upscale (2x)'] ||
                        card.buttonMap['Upscale (4x)'] ||
                        card.buttonMap['Redo Upscale (Subtle)'] ||
                        card.buttonMap['Redo Upscale (Creative)'] ||
                        card.buttonMap['Upscale (Subtle)'] ||
                        card.buttonMap['Upscale (Creative)']
                      "
                    >
                      <template #overlay>
                        <a-menu>
                          <a-menu-item
                            key="Vary (Strong)"
                            v-if="card.buttonMap['Vary (Strong)']"
                            @click="($event) => handleV(card, 'variation', 'Vary (Strong)')"
                            ><Icon
                              icon="ph:magic-wand-fill"
                              size="14px"
                              style="margin: 0"
                            />强(Strong)</a-menu-item
                          >
                          <a-menu-item
                            key="Vary (Subtle)"
                            v-if="card.buttonMap['Vary (Subtle)']"
                            @click="($event) => handleV(card, 'variation', 'Vary (Subtle)')"
                            ><Icon
                              icon="ph:magic-wand-fill"
                              size="14px"
                              style="margin: 0"
                            />微(Subtle)</a-menu-item
                          >
                          <a-menu-item
                            key="Vary (Region)"
                            v-if="remix.enable_flag && card.buttonMap['Vary (Region)']"
                            @click="($event) => openVaryRegion(card, 'variation', 'Vary (Region)')"
                            ><Icon
                              icon="pepicons-pencil:paint-pallet"
                              size="14px"
                              style="margin: 0"
                            />局部重绘</a-menu-item
                          >
                          <a-menu-item
                            key="Upscale (2x)"
                            v-if="card.buttonMap['Upscale (2x)']"
                            @click="($event) => handleU(card, 'Upscale (2x)', 'upscale2')"
                            ><Icon
                              icon="ph:caret-up-bold"
                              size="14px"
                              style="margin: 0"
                            />2倍放大</a-menu-item
                          >
                          <a-menu-item
                            key="Upscale (4x)"
                            v-if="card.buttonMap['Upscale (4x)']"
                            @click="($event) => handleU(card, 'Upscale (4x)', 'upscale4')"
                            ><Icon
                              icon="ph:caret-double-up-bold"
                              size="14px"
                              style="margin: 0"
                            />4倍放大</a-menu-item
                          >
                          <a-menu-item
                            key="Upscale (Creative)"
                            v-if="card.buttonMap['Upscale (Creative)']"
                            @click="($event) => handleU(card, 'Upscale (Creative)', 'creative')"
                            ><Icon
                              icon="fluent:scale-fill-24-regular"
                              size="14px"
                              style="margin: 0"
                            />创意 (Creative)
                          </a-menu-item>
                          <a-menu-item
                            key="Upscale (Subtle)"
                            v-if="card.buttonMap['Upscale (Subtle)']"
                            @click="($event) => handleU(card, 'Upscale (Subtle)', 'subtle')"
                            ><Icon
                              icon="fluent:scale-fill-24-regular"
                              size="14px"
                              style="margin: 0"
                            />细致 (Subtle)
                          </a-menu-item>

                          <a-menu-item
                            key="Redo Upscale (Creative)"
                            v-if="card.buttonMap['Redo Upscale (Creative)']"
                            @click="
                              ($event) => handleU(card, 'Redo Upscale (Creative)', 'creative')
                            "
                            ><Icon
                              icon="fluent:scale-fill-24-regular"
                              size="14px"
                              style="margin: 0"
                            />
                            重做-创意 (Creative)
                          </a-menu-item>
                          <a-menu-item
                            key="Redo Upscale (Subtle)"
                            v-if="card.buttonMap['Redo Upscale (Subtle)']"
                            @click="($event) => handleU(card, 'Redo Upscale (Subtle)', 'subtle')"
                            ><Icon
                              icon="fluent:scale-fill-24-regular"
                              size="14px"
                              style="margin: 0"
                            />重做-细致 (Subtle)
                          </a-menu-item>
                        </a-menu>
                      </template>
                      <a-button size="small" class="card-button">
                        <Icon icon="ph:magic-wand-fill" size="14px" style="margin: 0" />
                        <span style="margin: 0">变化</span>
                        <DownOutlined />
                      </a-button>
                    </a-dropdown>
                    <a-dropdown
                      v-if="
                        card.buttonMap['Redo Upscale (4x)'] || card.buttonMap['Redo Upscale (2x)']
                      "
                    >
                      <template #overlay>
                        <a-menu>
                          <a-menu-item
                            key="Redo Upscale (2x)"
                            v-if="card.buttonMap['Redo Upscale (2x)']"
                            @click="($event) => handleU(card, 'Redo Upscale (2x)', 'upscale2')"
                            ><Icon
                              icon="ph:caret-up-bold"
                              size="14px"
                              style="margin: 0"
                            />重做-2倍</a-menu-item
                          >
                          <a-menu-item
                            key="Redo Upscale (4x)"
                            v-if="card.buttonMap['Redo Upscale (4x)']"
                            @click="($event) => handleU(card, 'Redo Upscale (4x)', 'upscale4')"
                            ><Icon icon="ph:caret-double-up-bold" size="14px" style="margin: 0" />
                            重做-4倍</a-menu-item
                          >
                        </a-menu>
                      </template>
                      <a-button size="small" class="card-button">
                        <Icon icon="fluent:scale-fill-24-regular" size="14px" style="margin: 0" />
                        <span style="margin: 0">提升</span>
                        <DownOutlined />
                      </a-button>
                    </a-dropdown>
                  </div>
                  <div v-if="card.state === 'SUCCESS' && card.commandType === 'DESCRIBE'">
                    <a-row>
                      <a-dropdown>
                        <template #overlay>
                          <a-menu @click="($event) => handleDraw(card, $event)">
                            <a-menu-item key="0"
                              ><Icon
                                icon="tabler:square-number-1"
                                size="14px"
                                style="margin: 0"
                              />Prompt</a-menu-item
                            >
                            <a-menu-item key="1"
                              ><Icon icon="tabler:square-number-2" size="14px" style="margin: 0" />
                              Prompt</a-menu-item
                            >
                            <a-menu-item key="2"
                              ><Icon icon="tabler:square-number-3" size="14px" style="margin: 0" />
                              Prompt</a-menu-item
                            >
                            <a-menu-item key="3"
                              ><Icon icon="tabler:square-number-4" size="14px" style="margin: 0" />
                              Prompt</a-menu-item
                            >
                            <a-menu-item key="4">全部 Prompt</a-menu-item>
                          </a-menu>
                        </template>
                        <a-button size="small" class="card-button">
                          <Icon icon="fluent:slide-text-24-regular" size="14px" style="margin: 0" />
                          <span style="margin: 0">提示词</span>
                        </a-button>
                      </a-dropdown>
                      <a-radio
                        class="check"
                        v-if="needShow(card)"
                        style="margin-left: 5px"
                        v-model:value="describeInfo.autoReferImage"
                        >垫图</a-radio
                      >
                    </a-row>
                  </div>
                </div>
              </a-button-group>
            </div>
          </div>
          <!-- 更多卡片内容 -->
        </a-card>
      </div>
      <!-- 灯箱-->
      <vue-easy-lightbox
        :visible="lightBoxOptions.visibleRef"
        :imgs="lightBoxOptions.imgsRef"
        :index="lightBoxOptions.indexRef"
        @hide="onHide"
        @on-next-click="onNextClick"
        @on-prev-click="onPrevClick"
      >
        <template #prev-btn="{ prev }">
          <div
            v-if="lightBoxOptions.imgsRef.length > 1"
            @click="prev"
            role="button"
            aria-label="previous image button"
            class="btn__prev disable"
            ><svg class="vel-icon icon" aria-hidden="true"><use xlink:href="#icon-prev" /></svg
          ></div>
        </template>

        <template #next-btn="{ next }">
          <div
            v-if="lightBoxOptions.imgsRef.length > 1"
            @click="next"
            role="button"
            aria-label="next image button"
            class="btn__next"
            ><svg class="vel-icon icon" aria-hidden="true"><use xlink:href="#icon-next" /></svg
          ></div>
        </template>

        <template #close-btn="{ close }">
          <div
            @click="close"
            role="button"
            aria-label="close image preview button"
            class="btn__close"
            ><svg class="vel-icon icon" aria-hidden="true"><use xlink:href="#icon-close" /></svg
          ></div>
        </template>
        <!-- 相关操作按钮 -->
        <template #toolbar="{ toolbarMethods }">
          <div class="vel-toolbar" v-if="lightBoxOptions.currentItem.state === 'SUCCESS'">
            <div
              @click="addDrawCollect(lightBoxOptions.currentItem)"
              role="button"
              aria-label="zoom in button"
              class="toolbar-btn toolbar-btn__zoomin"
              :color="lightBoxOptions.currentItem.collectFlag === 'Y' ? 'red' : 'default'"
            >
              <Icon
                class="vel-icon icon"
                v-if="lightBoxOptions.currentItem.collectFlag === 'N'"
                icon="material-symbols:heart-plus-outline"
                size="20"
              />
              <Icon
                class="vel-icon icon"
                v-else
                icon="material-symbols:heart-plus"
                color="#c85762"
                size="20"
              />
            </div>
            <div
              @click="doDownload(lightBoxOptions.currentItem)"
              role="button"
              aria-label="zoom in button"
              class="toolbar-btn toolbar-btn__zoomin"
            >
              <a-tooltip
                title="下载"
                v-if="
                  lightBoxOptions.currentItem.state === 'SUCCESS' &&
                  lightBoxOptions.currentItem.commandType != 'DESCRIBE'
                "
              >
                <Icon
                  icon="bx:bxs-cloud-download"
                  class="vel-icon icon"
                  aria-hidden="true"
                  size="20"
                />
              </a-tooltip>
            </div>
            <div
              @click="splitAndDownloadImage(lightBoxOptions.currentItem)"
              role="button"
              aria-label="zoom in button"
              class="toolbar-btn toolbar-btn__zoomin"
            >
              <a-tooltip
                title="分割下载"
                v-if="
                  lightBoxOptions.currentItem.state === 'SUCCESS' &&
                  lightBoxOptions.currentItem.commandType != 'DESCRIBE'
                "
              >
                <Icon
                  icon="ri:scissors-cut-fill"
                  class="vel-icon icon"
                  aria-hidden="true"
                  size="20"
                />
              </a-tooltip>
            </div>

            <div
              @click="copyText(lightBoxOptions.currentItem.prompt)"
              role="button"
              aria-label="zoom in button"
              class="toolbar-btn toolbar-btn__zoomin"
            >
              <a-tooltip
                title="复制prompt"
                v-if="
                  lightBoxOptions.currentItem.state === 'SUCCESS' &&
                  lightBoxOptions.currentItem.commandType != 'DESCRIBE'
                "
              >
                <Icon
                  icon="material-symbols:file-copy-rounded"
                  class="vel-icon icon"
                  aria-hidden="true"
                  size="18"
                />
              </a-tooltip>
            </div>
            <div
              @click="handleU(lightBoxOptions.currentItem, 'U1', 'image')"
              role="button"
              aria-label="zoom out button"
              class="toolbar-btn toolbar-btn__zoomout"
              v-if="lightBoxOptions.currentItem.buttonMap['U1']"
            >
              <SearchOutlined class="vel-icon icon" aria-hidden="true" />U1
            </div>
            <div
              @click="handleU(lightBoxOptions.currentItem, 'U2', 'image')"
              role="button"
              aria-label="zoom out button"
              class="toolbar-btn toolbar-btn__zoomout"
              v-if="lightBoxOptions.currentItem.buttonMap['U2']"
            >
              <SearchOutlined class="vel-icon icon" aria-hidden="true" />U2
            </div>
            <div
              @click="handleU(lightBoxOptions.currentItem, 'U3', 'image')"
              role="button"
              aria-label="zoom out button"
              class="toolbar-btn toolbar-btn__zoomout"
              v-if="lightBoxOptions.currentItem.buttonMap['U3']"
            >
              <SearchOutlined class="vel-icon icon" aria-hidden="true" />U3
            </div>
            <div
              @click="handleU(lightBoxOptions.currentItem, 'U4', 'image')"
              role="button"
              aria-label="zoom out button"
              class="toolbar-btn toolbar-btn__zoomout"
              v-if="lightBoxOptions.currentItem.buttonMap['U4']"
            >
              <SearchOutlined class="vel-icon icon" aria-hidden="true" />U4
            </div>
            <!-- <div
              @click="
                handleV(
                  lightBoxOptions.currentItem,
                  'variation',
                  lightBoxOptions.currentItem.buttonMap['V1'].id,
                )
              "
              role="button"
              aria-label="resize image button"
              class="toolbar-btn toolbar-btn__resize"
            >
              <span class="vel-icon icon"> V1 </span> </div
            > -->
          </div>

          <!-- 顶部居中 -->
          <div class="opt-top-center">
            <div class="vel-toolbar">
              <div
                @click="toolbarMethods.zoomIn"
                role="button"
                aria-label="zoom in button"
                class="toolbar-btn toolbar-btn__zoomin"
                ><svg class="vel-icon icon" aria-hidden="true">
                  <use xlink:href="#icon-zoomin" /></svg></div
              ><div
                @click="toolbarMethods.zoomOut"
                role="button"
                aria-label="zoom out button"
                class="toolbar-btn toolbar-btn__zoomout"
                ><svg class="vel-icon icon" aria-hidden="true">
                  <use xlink:href="#icon-zoomout" /></svg></div
              ><div
                @click="toolbarMethods.resize"
                role="button"
                aria-label="resize image button"
                class="toolbar-btn toolbar-btn__resize"
                ><svg class="vel-icon icon" aria-hidden="true">
                  <use xlink:href="#icon-resize" /></svg></div
              ><div
                @click="toolbarMethods.rotateLeft"
                role="button"
                aria-label="image rotate left button"
                class="toolbar-btn toolbar-btn__rotate"
                ><svg class="vel-icon icon" aria-hidden="true">
                  <use xlink:href="#icon-rotate-left" /></svg></div
              ><div
                @click="toolbarMethods.rotateRight"
                role="button"
                aria-label="image rotate right button"
                class="toolbar-btn toolbar-btn__rotate"
                ><svg class="vel-icon icon" aria-hidden="true">
                  <use xlink:href="#icon-rotate-right" />
                </svg>
              </div>
            </div>
          </div>
          <!-- prompt -->
          <div class="vel-img-title">
            {{ lightBoxOptions.currentItem.prompt }}
          </div>
        </template>
      </vue-easy-lightbox>
    </div>

    <div ref="buttonRef" style="bottom: 0; width: 100%">
      <a-card
        :bodyStyle="{
          padding: '1px 1px 1px 8px',
          width: '100%',
          display: 'flex',
          'align-items': 'center',
          height: '45px',
        }"
        class="pagination"
      >
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
        />
      </a-card>
    </div>

    <!-- remix弹窗-->
    <div>
      <a-modal
        v-model:open="remix.view"
        :title="remix.title"
        @ok="doZoomCus()"
        :confirmLoading="remix.loading"
      >
        <a-spin :spinning="remix.loading">
          <a-row style="padding: 15px">
            <a-col span="24">
              <span>{{ remix.secTitle }}</span>
            </a-col>
            <a-col span="24">
              <a-textarea
                style="width: 100%"
                v-model:value="remix.prompt"
                placeholder="请输入相关的文本~"
                allow-clear
                :maxlength="2000"
                :auto-size="{ minRows: 5, maxRows: 8 }"
              />
            </a-col>
          </a-row>
        </a-spin>
      </a-modal>
    </div>
    <!-- 标签弹窗  -->
    <div>
      <a-modal
        v-model:open="drawTagForm.viewFlag"
        title="🔥添加标签"
        @ok="doAddDrawTaskTag()"
        :loading="drawTagForm.loading"
      >
        <a-spin :spinning="drawTagForm.loading">
          <a-row style="padding: 15px">
            <a-col span="24">
              <span style="font-size: 14"
                >📌给你的任务添加相关的标签吧！打造属于你自己的图片系列管理！</span
              >
            </a-col>
            <a-col span="24">
              <a-mentions
                style="width: 100%; text-align: left"
                v-model:value="drawTagForm.tagName"
                rows="3"
                placeholder="用@可以触发最近使用的标签哦！多个标签'空格符'隔开,最多5个标签。每个标签长度不超过16个字。~"
                :options="drawTagForm.tagNameOptions"
                @select="onChangeLabel"
              />
            </a-col>
          </a-row>
        </a-spin>
      </a-modal>
    </div>

    <!-- 添加到其他空间  -->
    <div>
      <a-modal
        v-model:open="userSpaceTaskForm.viewFlag"
        title="🎈添加到其他空间"
        ok-text="立即执行"
        @ok="addSpaceCard"
        :confirmLoading="userSpaceTaskForm.loading"
      >
        <a-card>
          <a-spin :spinning="userSpaceTaskForm.loading">
            <a-form :model="userSpaceTaskForm" layout="vertical" ref="userSpaceTaskFormRef">
              <a-row gutter="24">
                <a-col :span="24">
                  <a-form-item
                    label="工作空间"
                    :rules="[
                      {
                        required: true,
                        message: '工作空间不能为空',
                      },
                    ]"
                    name="spaceId"
                  >
                    <a-select
                      v-model:value="userSpaceTaskForm.spaceId"
                      style="width: 100%"
                      placeholder="请选择导入空间"
                      :options="userSpaceTaskForm.spaceOptions"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-spin>
        </a-card>
      </a-modal>
    </div>

    <!-- 局部变化 -->
    <a-modal
      v-model:open="varyRegionForm.viewFlag"
      title="🎨Midjourney局部变化"
      style="top: 20px; width: 100%; height: auto"
      :bodyStyle="{ padding: '0', width: '100%', 'align-items': 'center' }"
    >
      <template #footer> </template>
      <iframe
        :src="varyRegionForm.varyRegionUrl"
        title="🎨Midjourney局部变化"
        style="width: 100%; height: 80vh"
      ></iframe>
    </a-modal>

    <!-- 条件查询 -->
    <a-modal
      v-model:open="showQueryViewFlag"
      width="100%"
      title="🔍️条件查询"
      :bodyStyle="{ padding: '7px 0px', width: '100%', 'align-items': 'center' }"
    >
      <template #footer>
        <a-button key="submit" type="primary" @click="doModelSearch()">立即查询</a-button>
      </template>
      <a-card
        :bordered="false"
        :bodyStyle="{ padding: '1px 3px', width: '100%', 'align-items': 'center' }"
      >
        <a-row :gutter="[0, 2]" type="flex">
          <a-col flex="80px">
            <a-tag class="quality-tag" color="default">🍺状态 </a-tag>
          </a-col>
          <a-col flex="auto">
            <a-select
              placeholder="任务状态"
              v-model:value="searchForm.state"
              style="width: 100%"
              class="mobile-select"
            >
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="QUEUED">排队中</a-select-option>
              <a-select-option value="RUNNING">执行中</a-select-option>
              <a-select-option value="SUCCESS">已完成</a-select-option>
              <a-select-option value="FAILED">已失败</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row :gutter="[0, 2]" type="flex" style="margin-top: 7px">
          <a-col flex="80px">
            <a-tag class="quality-tag" color="default">🍥类型 </a-tag>
          </a-col>
          <a-col flex="auto">
            <a-select
              placeholder="任务类型"
              v-model:value="searchForm.commandType"
              class="mobile-select"
              style="width: 100%"
            >
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="IMAGINE">文生图</a-select-option>
              <a-select-option value="BLEND">混图</a-select-option>
              <a-select-option value="DESCRIBE">解析图</a-select-option>
              <a-select-option value="UPSCALE">放大</a-select-option>
              <a-select-option value="VARIATION">变化</a-select-option>
              <a-select-option value="PAN">填充</a-select-option>
              <a-select-option value="ZOOM">缩放</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row type="flex" :gutter="[0, 2]" style="margin-top: 7px">
          <a-col flex="80px">
            <a-tag class="quality-tag" color="default">🥝标签 </a-tag>
          </a-col>
          <a-col flex="auto">
            <a-mentions
              v-model:value="searchForm.tagName"
              autofocus
              placeholder="输入@可以引用最近的标签哟~"
              :options="drawTagForm.tagNameOptions"
              @select="onChangeSearchLabel"
            />
          </a-col>
        </a-row>
      </a-card>
    </a-modal>
    <!-- 案例添加 -->
    <a-modal
      v-model:open="showExampleViewFlag"
      width="100%"
      title="🧉添加到官方案例"
      :bodyStyle="{ padding: '7px 12px 7px 12px', width: '100%', 'align-items': 'center' }"
    >
      <template #footer>
        <a-button key="submit" type="primary" @click="addSample()" :loading="exampleForm.loading"
          >添加到官方案例</a-button
        >
      </template>
      <a-spin :spinning="exampleForm.loading">
        <a-card
          :bordered="false"
          :bodyStyle="{ padding: '1px 1px 1px 1px', width: '100%', 'align-items': 'center' }"
        >
          <a-row :gutter="[0, 2]" type="flex">
            <a-col flex="auto">
              <a-select
                v-model:value="exampleForm.categoryCodes"
                mode="multiple"
                style="width: 100%"
                placeholder="请选择分类"
                :options="exampleForm.drawingSampleCategory"
              />
            </a-col>
          </a-row>
        </a-card>
      </a-spin>
    </a-modal>

    <!-- 查看明细  -->
    <a-modal
      title="任务概况"
      v-model:open="infoData.viewFlag"
      width="100%"
      wrap-class-name="full-modal "
      :bodyStyle="{ padding: '0px' }"
      zIndex="999"
    >
      <template #footer>
        <a-button key="submit" type="primary" :loading="loadingRef" @click="closeTaskInfo"
          >已知晓</a-button
        >
      </template>
      <a-card :bodyStyle="{ padding: '0px ' }" :bordered="false" class="grid my-transparent-card">
        <a-card-grid
          style="display: flex; justify-content: center; width: 100%; text-align: center"
          :bodyStyle="{ padding: '0px 0px 0px 0px' }"
          bordered="true"
          :hoverable="false"
        >
          <div style="width: 100%">
            <a-card
              :bodyStyle="{ padding: '0px' }"
              style="width: 100%"
              class="my-transparent-card"
              v-if="infoData.taskInfo.taskImage.infoImageList.length > 1"
              :bordered="false"
              :hoverable="false"
            >
              <a-card-grid
                :bodyStyle="'padding: 0px'"
                v-for="infoImage in infoData.taskInfo.taskImage.infoImageList"
                :key="infoImage.url"
                style="width: 50%; margin: 0; padding: 0; border-radius: 15px; text-align: center"
              >
                <!-- <div
                v-show="!infoImage.loaded"
                :style="{
                  width: '100%',
                  height: '100%',
                  paddingBottom: `${
                    (infoData.taskInfo.taskImage.imageHeight /
                      infoData.taskInfo.taskImage.imageWidth) *
                    100
                  }%`,
                }"
              >
              </div> -->

                <img
                  @click="showInfoImage(getImageList(infoData.taskInfo), infoImage.url)"
                  v-lazy.container="infoImage.mediaUrl"
                  class="card-image img-box"
                  style="max-width: 100%; border-radius: 15px"
                  alt=""
                  @load="imageLoaded(infoImage)"
                />
              </a-card-grid>
            </a-card>
            <a-card
              :bodyStyle="{ padding: '0px' }"
              style="width: 100%"
              :bordered="false"
              :hoverable="false"
              v-else
            >
              <a-card-grid
                v-for="infoImage in infoData.taskInfo.taskImage.infoImageList"
                :key="infoImage.url"
                style="width: 100%; padding: 0; border-radius: 15px; text-align: center"
              >
                <img
                  @click="showInfoImage(getImageList(infoData.taskInfo), infoImage.url)"
                  v-lazy.container="infoImage.mediaUrl"
                  class="card-image img-box"
                  style="max-width: 100%; border-radius: 15px"
                  alt=""
                  @load="imageLoaded(infoImage)"
                />
              </a-card-grid>
            </a-card>
            <a-flex :style="{ width: '100%' }" justify="center" align="center">
              <span style="font-size: 12px">
                📢 导入的图片加载失败可以试着获取下Seed。 点击图片可查看大图！！！</span
              >
              <a-button @click="handleDownloadByUrls(getImageList(infoData.taskInfo))" size="small">
                <Icon icon="bx:bxs-cloud-download" class="vel-icon icon" aria-hidden="true" />
                下载图片
              </a-button>
            </a-flex>
          </div>
        </a-card-grid>

        <a-card-grid style="width: 100%; margin-top: 5px; text-align: left" :hoverable="false">
          <a-descriptions bordered size="small" :column="2" layout="vertical">
            <a-descriptions-item label="👨执行账户" :style="{ width: '48%' }" :span="1">{{
              infoData.taskInfo.accountName
            }}</a-descriptions-item>
            <a-descriptions-item label="🍪任务类型" :style="{ width: '48%' }" :span="1">
              <a-tag :color="stringToColor(infoData.taskInfo.commandTypeName)">{{
                infoData.taskInfo.commandTypeName
              }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="💎MJ账号" :style="{ width: '48%' }" :span="1">{{
              infoData.taskInfo.discordUserName
            }}</a-descriptions-item>

            <a-descriptions-item label="🤖执行机器人" :style="{ width: '48%' }" :span="1">
              <a-tag :color="infoData.taskInfo.bootName === 'niji' ? 'green' : ''"
                >{{ infoData.taskInfo.bootName }} 机器人</a-tag
              >
            </a-descriptions-item>
            <a-descriptions-item label="🍦服务器" :style="{ width: '48%' }" :span="1">{{
              infoData.taskInfo.guildName
            }}</a-descriptions-item>

            <a-descriptions-item label="🍩运行模式" :style="{ width: '48%' }" :span="1">
              <a-tag
                v-if="infoData.taskInfo.modeName"
                :color="stringToColor(infoData.taskInfo.modeName)"
                >{{ infoData.taskInfo.modeName }}</a-tag
              >
              <a-tag v-else>{{ '未定义' }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="🍯所在频道" :span="1">{{
              infoData.taskInfo.channelName
            }}</a-descriptions-item>

            <a-descriptions-item label="👁是否公开" :span="1">
              <a-tag :color="infoData.taskInfo.privacyMode === 'Y' ? 'blue' : ''"
                >{{ infoData.taskInfo.privacyMode === 'Y' ? '公开' : '隐藏' }}
              </a-tag>
            </a-descriptions-item>

            <a-descriptions-item label="🔢SEED" :span="2">
              <div v-if="infoData.taskInfo.seed">
                {{ infoData.taskInfo.seed }}
              </div>
              <div v-else>
                <a-button @click="getSeed(infoData.id, true)" size="small" :loading="loadingRef"
                  >🆔获取Seed
                </a-button>
              </div>
            </a-descriptions-item>
            <a-descriptions-item
              label="📔原始Prompt"
              :span="2"
              v-if="infoData.taskInfo.commandTypeName === 'IMAGINE'"
            >
              {{ infoData.taskInfo.oriPrompt }}
            </a-descriptions-item>
            <a-descriptions-item
              label="📓解析结果"
              :span="2"
              v-if="infoData.taskInfo.commandTypeName === 'DESCRIBE'"
            >
              <p
                v-for="(item, index) in splitInInfo(infoData.taskInfo.contentStripped)"
                :key="index"
              >
                {{ item }}<br />
              </p>
            </a-descriptions-item>
            <a-descriptions-item label="📓执行Prompt" :span="2" v-else>
              {{ infoData.taskInfo.contentStripped }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card-grid>
        <a-card-grid style="width: 100%; margin-top: 5px; text-align: left" :hoverable="false">
          <a-descriptions bordered layout="vertical">
            <a-descriptions-item>
              <template #label>
                <div style="display: flex; flex-direction: row; justify-content: space-between">
                  <div>
                    <a-span> <Icon icon="streamline-emojis:office-building" />任务空间 </a-span>
                  </div>
                  <a-button size="small" @click="showUserSpaceTask(infoData.card)">
                    <a-span> <Icon icon="streamline-emojis:palm-tree" />添加空间 </a-span>
                  </a-button>
                </div>
              </template>
              <a-tag
                v-for="taskSpace in infoData.taskSpaceList"
                :key="taskSpace.spaceId"
                :bordered="false"
                closable
                @close="deleteSpaceCard(infoData.card, taskSpace.spaceId)"
                :color="stringToColor(taskSpace.spaceName)"
                >{{ taskSpace.spaceName }}
              </a-tag>
            </a-descriptions-item>
          </a-descriptions>
        </a-card-grid>
        <!-- 收藏分类 -->
        <a-card-grid style="width: 100%; text-align: left" :hoverable="false">
          <a-descriptions bordered layout="vertical">
            <a-descriptions-item
              :span="2"
              v-if="infoData.collectCategoryList && infoData.collectCategoryList.length > 0"
            >
              <template #label>
                <div style="display: flex; flex-direction: row; justify-content: space-between">
                  <div>
                    <a-span> <Icon icon="streamline-emojis:heart-with-arrow" />收藏分类 </a-span>
                  </div>
                  <a-button size="small" @click="showAddCollectCategoryModel(infoData.card)">
                    <a-span> <Icon icon="streamline-emojis:writing-hand-1" />添加收藏 </a-span>
                  </a-button>
                </div>
              </template>
              <a-tag
                v-for="collectCategory in infoData.collectCategoryList"
                :key="collectCategory.categoryId"
                :bordered="false"
                closable
                @close="doRemoveFromCollectCategory(infoData.card, collectCategory.categoryId)"
                :color="stringToColor(collectCategory.categoryId)"
                >{{ collectCategory.categoryTitle }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item :span="2" v-else>
              <template #label>
                <div style="display: flex; flex-direction: row; justify-content: space-between">
                  <div>
                    <a-span> <Icon icon="streamline-emojis:heart-with-arrow" />收藏分类 </a-span>
                  </div>
                  <a-button size="small" @click="showAddCollectCategoryModel(infoData.card)">
                    <a-span> <Icon icon="streamline-emojis:writing-hand-1" />添加收藏 </a-span>
                  </a-button>
                </div>
              </template>
              <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" />
            </a-descriptions-item>
          </a-descriptions>
        </a-card-grid>
        <a-card-grid style="width: 100%; margin-top: 5px; text-align: left" :hoverable="false">
          <a-descriptions bordered layout="vertical">
            <a-descriptions-item v-if="infoData.tagList && infoData.tagList.length > 0">
              <template #label>
                <div style="display: flex; flex-direction: row; justify-content: space-between">
                  <div><Icon icon="streamline-emojis:blossom" />任务标签 </div>
                  <a-button size="small" @click="showDrawTaskTagModel(infoData.card)">
                    <a-span> <Icon icon="streamline-emojis:palm-tree" />添加标签 </a-span>
                  </a-button>
                </div>
              </template>
              <a-tag
                v-for="tag in infoData.tagList"
                @close="removeDrawTaskTag(infoData.id, tag)"
                :color="stringToColor(tag)"
                :key="tag"
                :bordered="false"
                closable
                >{{ tag }}</a-tag
              >
            </a-descriptions-item>
            <a-descriptions-item v-else>
              <template #label>
                <div style="display: flex; flex-direction: row; justify-content: space-between">
                  <div><Icon icon="streamline-emojis:blossom" />任务标签 </div>
                  <a-button size="small" @click="showDrawTaskTagModel(infoData.card)">
                    <a-span> <Icon icon="streamline-emojis:palm-tree" /> 添加标签 </a-span>
                  </a-button>
                </div>
              </template>
              <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" />
            </a-descriptions-item>
          </a-descriptions>
        </a-card-grid>
        <a-card-grid style="width: 100%; margin-top: 5px; text-align: center" :hoverable="false">
          <a-descriptions bordered layout="vertical">
            <a-descriptions-item label="🐊任务进度">
              <a-steps size="small" :current="infoData.processList.length">
                <a-step
                  v-for="process in infoData.processList"
                  :key="process.title"
                  :title="process.title"
                  :description="process.description"
                />
              </a-steps>
            </a-descriptions-item>
          </a-descriptions>
        </a-card-grid>
      </a-card>
      <Loading :loading="loadingRef" :absolute="false" :tip="infoData.tip" />
    </a-modal>
    <!-- 添加到到收藏分类  -->
    <div>
      <a-modal
        v-model:open="collectCategoryViewForm.viewFlag"
        title="🎈添加到收藏分类"
        ok-text="立即执行"
        @ok="doAddToCollectCategory"
        :confirmLoading="collectCategoryViewForm.loading"
      >
        <a-card>
          <a-spin :spinning="collectCategoryViewForm.loading">
            <a-form :model="collectTaskForm" layout="vertical" ref="collectTaskFormRef">
              <a-row gutter="24">
                <a-col :span="24">
                  <a-form-item
                    label="收藏分类"
                    :rules="[
                      {
                        required: true,
                        message: '收藏分类不能为空',
                      },
                    ]"
                    name="categoryId"
                  >
                    <a-tree-select
                      @change="handleCollectCategoryChange"
                      v-model:value="collectTaskForm.categoryId"
                      show-search
                      style="width: 100%"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                      placeholder="请选择收藏分类"
                      allow-clear
                      tree-default-expand-all
                      :tree-data="collectCategoryViewForm.collectCategoryOptions"
                      tree-node-filter-prop="label"
                    >
                      <template #title="{ value: val, label }">
                        <b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
                        <template v-else>{{ label }}</template>
                      </template>
                    </a-tree-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-spin>
        </a-card>
      </a-modal>
    </div>
  </a-layout>
</template>

<script lang="ts" setup>
  import { Loading } from '/@/components/Loading';
  import 'vue-easy-lightbox/external-css/vue-easy-lightbox.css';
  import VueEasyLightbox from 'vue-easy-lightbox';
  import VueLazyload from 'vue-lazyload';
  import { api as viewerApi } from 'v-viewer';
  import 'viewerjs/dist/viewer.css';
  import Icon from '/@/components/Icon/Icon.vue';
  import { Empty, message } from 'ant-design-vue';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { listCategory, queryDrawingSample, addDrawingSample } from '/@/api/df/drawingSample';
  import { addSpaceTask, removeSpaceTask, allUserSpace } from '/@/api/df/workSpace';
  import { accountInfoApi, tagInfoApi, drawCollectCategoryApi } from '../accountInfo';
  import { SvgIcon } from '/@/components/Icon';
  import {
    ref,
    computed,
    unref,
    toRefs,
    watch,
    onMounted,
    onBeforeUnmount,
    onUnmounted,
  } from 'vue';
  import {
    loadingRef,
    jobListQueryApi,
    exampleApi,
    jobOptionApi,
    userSettingApi,
    lightBoxApi,
    splitAndDownloadImage,
    textFormApi,
  } from '../jobList.pageQuery';
  import {
    downloadImage,
    copyText,
    tagColor,
    formattedPrompt,
    splitPrompt,
    handleDownloadByUrl,
    handleDownloadByUrls,
    generateTooltipText,
    stringToColor,
  } from '../tools';
  import { useRoute } from 'vue-router';
  import { useDrawCard } from '/@/views/df/example/card';

  const { goDrawing } = useDrawCard();
  const { setPrompt } = textFormApi();
  const {
    refreshCollectCategory,
    collectCategoryViewForm,
    collectTaskForm,
    initAllCollectCategory,
    showAddCollectCategoryModel,
    showMoveCollectCategoryModel,
    closeCollectCategoryModel,

    addToCollectCategory,
    removeFromCollectCategory,
  } = drawCollectCategoryApi();

  const {
    accountForm,
    accountViewForm,
    initAccountList,
    initAccountInfo,
    doGetChannelsByGroup,
    handleAccountSetting,
    handleSetting,
    closeAccountConfig,
    showAccountConfig,
  } = accountInfoApi();

  /** 页面高度计算开始 */
  const formRef = ref(null);
  //页面高度处理
  const buttonRef = ref(null);
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 45);
  //移动设备底部导航栏
  const offsetHeightRef = ref(95);
  const subtractHeightRefs = ref([buttonRef]);

  // 使用hook
  const { contentHeight, redoHeight } = useContentHeight(
    computed(() => true),
    formRef,
    unref(subtractHeightRefs), // 使用 unref 获取数组值
    unref(substractSpaceRefs),
    upwardSpace,
    offsetHeightRef,
  );

  const route = useRoute();
  const showQueryViewFlag = ref(false);
  const showQueryView = () => {
    showQueryViewFlag.value = true;
  };
  const doModelSearch = () => {
    // 验证消息来源和内容，然后关闭 iframe
    showQueryViewFlag.value = false;

    searchForm.value.spaceId = accountForm.currentSpaceId;
    onSearch(1);
  };

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  const {
    closeTaskInfo,
    showTaskInfo,
    infoData,
    cards,
    searchForm,
    pagination,
    pageChange,
    pageSizeChange,
    onSearchNoLoading,
    onSearch,
    onReset,
    removeTimer,
  } = jobListQueryApi();

  const { drawingSampleCategory, doAddDrawingSample } = exampleApi();

  const {
    // 方法
    deleteCard,
    deleteBatchHandle,
    toggleVisibility,
    addDrawCollect,
    handleU,
    handleZoom,
    refreshIfNecessary,
    handlePan,
    handleV,
    handleDraw,
    describeInfo,
    // Remix 相关
    doRetryDrawTask,
    userStore,
    varyRegionForm,
    openVaryRegion,
    remixCard,
    remix,
    changeRemix,
    showZoomCustomer,
    showRemixCustomer,
    showPanRemixCustomer,
    doZoomCus,
  } = jobOptionApi();

  const {
    // 响应式引用
    initTag,
    drawTagForm,

    showDrawTaskTagModel,
    addDrawTaskTag,
    loadTagList,
    onChangeLabel,
    onChangeSearchLabel,
    removeDrawTaskTag,
  } = tagInfoApi();

  const { userSetting, setCardShow, setUseUpImage, setUsePersonNet, setTaskRefresh } =
    userSettingApi();

  const {
    lightBoxOptions,
    showImage,
    showAllImage,
    onPrevClick,
    onNextClick,
    imageLoad,
    nextImage,
    preImage,
    executeFunc,
    onHide,
  } = lightBoxApi();

  // 使用 ref 包装，以确保 computed 可以正确监听变化

  onMounted(async () => {
    (window as any).varyRegionForm = varyRegionForm;
    initTag();
    await initAccountInfo();
  });
  onMounted(async () => {
    searchForm.value.spaceId = accountForm.currentSpaceId;
    onSearch();
  });

  // 监听来自 iframe 的消息
  const handleMessage = (event: MessageEvent) => {
    // 验证消息来源和内容，然后关闭 iframe
    if (event.data === 'close_iframe') {
      varyRegionForm.value.viewFlag = false;
    } else if (event.data === 'commit_success') {
      varyRegionForm.value.viewFlag = false;
      message.success('提交成功');
    }
  };

  onMounted(() => {
    window.addEventListener('message', handleMessage, false);
    initAllCollectCategory();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('message', handleMessage);
  });

  onUnmounted(() => {
    removeTimer();
  });
  /***********************添加到其他空间 ******************* */
  //下载
  const doDownload = async (card) => {
    const imageUrlsArray = card.taskImage.infoImageList.map((item) => item.url);
    await handleDownloadByUrls(imageUrlsArray);
  };

  const userSpaceTaskFormRef = ref();
  const userSpaceTaskForm = ref({
    viewFlag: false,
    loading: false,
    spaceId: null,
    taskId: null,
    spaceOptions: [] as { label: string; value: string }[],
  });

  //移除空间卡片
  const deleteSpaceCard = async (card, spaceId) => {
    loadingRef.value = true;
    console.log('-------------deleteSpaceCard--------------------');
    try {
      await removeSpaceTask({ spaceId: spaceId, taskIds: [card.id] });
      jobListQueryApi().onSearch(jobListQueryApi().pagination.value.current);
    } finally {
      loadingRef.value = false;
    }
  };

  const showUserSpaceTask = async (card) => {
    userSpaceTaskForm.value.loading = true;
    userSpaceTaskForm.value.viewFlag = true;
    userSpaceTaskForm.value.taskId = card.id;
    userSpaceTaskForm.value.spaceId = null;
    try {
      if (userSpaceTaskForm.value.spaceOptions.length === 0) {
        const response = await allUserSpace({});
        console.log(response);
        // 使用 map 方法转换数组
        const transformedList = response
          .filter((item) => item.id !== accountForm.currentSpaceId)
          .map((item) => ({
            label: item.title,
            value: item.id,
          }));
        // 如果您想在转换后的数组前面添加一个特定的对象，可以使用以下方法：
        const finalList = [...transformedList];
        userSpaceTaskForm.value.spaceOptions = finalList;
      }
    } finally {
      userSpaceTaskForm.value.loading = false;
    }
  };

  //添加空间卡片
  const addSpaceCard = async () => {
    userSpaceTaskForm.value.loading = true;
    try {
      await userSpaceTaskFormRef.value.validate();
      await addSpaceTask({
        spaceId: userSpaceTaskForm.value.spaceId,
        taskIds: [userSpaceTaskForm.value.taskId],
      });
      userSpaceTaskForm.value.viewFlag = false;
    } finally {
      userSpaceTaskForm.value.loading = false;
    }
  };

  /*********************** 案例相关 ********************* */
  const imageLoaded = async (card) => {
    card.loaded = true;
  };

  const exampleForm = ref({
    drawingSampleCategory: [],
    categoryCodes: [],
    drawTaskId: null,
    viewFlag: false,
    loading: false,
  });
  const showExampleViewFlag = ref(false);
  const addSample = async () => {
    exampleForm.value.loading = true;
    try {
      await doAddDrawingSample({
        drawTaskId: exampleForm.value.drawTaskId,
        categoryCodes: exampleForm.value.categoryCodes,
      });
      message.success('添加成功！优质案例可以找客服领取奖励哦！');
      showExampleViewFlag.value = false;
    } finally {
      exampleForm.value.loading = false;
    }
  };
  const showSampleView = (card) => {
    exampleForm.value.drawTaskId = card.id;
    showExampleViewFlag.value = true;
    console.log(exampleForm.value);
  };

  const getImageList = (card) => {
    return card.taskImage.infoImageList.map((item) => item.url);
  };
  const showInfoImage = (infoImageList, showUrl) => {
    // 检查数组中是否存在 showUrl
    const showUrlIndex = infoImageList.findIndex((url) => url === showUrl);
    let imageList = infoImageList;
    // 如果存在，则创建一个新数组，将 showUrl 放在第一个位置，其余元素按原顺序添加
    if (showUrlIndex !== -1) {
      imageList = [
        showUrl,
        ...infoImageList.slice(showUrlIndex + 1),
        ...infoImageList.slice(0, showUrlIndex),
      ];
    }

    // 如果不存在 showUrl，则返回原数组
    viewerApi({ images: imageList });
  };

  //添加标签
  const doAddDrawTaskTag = async () => {
    await addDrawTaskTag();
    if (infoData && infoData.id && infoData.id === drawTagForm.value.drawTaskId) {
      infoData.tagList.push(drawTagForm.value.tagName);
    }
  };

  /********************************** 收藏分类 ************************************** */
  const handleCollectCategoryChange = async (value, label, extra) => {
    collectTaskForm.value.categoryId = value;
    collectTaskForm.value.categoryTitle = label[0];
  };

  const doAddToCollectCategory = async () => {
    loadingRef.value = true;
    try {
      await addToCollectCategory(collectTaskForm.value);

      if (infoData.id && infoData.id === collectTaskForm.value.taskId) {
        infoData.collectCategoryList.push({
          categoryId: collectTaskForm.value.categoryId,
          categoryTitle: collectTaskForm.value.categoryTitle,
        });
      }
    } finally {
      loadingRef.value = false;
    }
  };

  const doRemoveFromCollectCategory = async (card, categoryId) => {
    console.log(1112);
    loadingRef.value = true;
    try {
      await removeFromCollectCategory(categoryId, card.id);
      if (infoData.id && infoData.id === card.id) {
        infoData.collectCategoryList = infoData.collectCategoryList.filter(
          (item) => item.categoryId !== categoryId,
        );
      }
    } finally {
      loadingRef.value = false;
    }
  };
  const needShow = (card) => {
    // 解析给定的时间字符串
    const gmtFinishedDate = new Date(card.gmtFinished);
    // 获取当前时间
    const currentDate = new Date();
    // 计算时间差异（以毫秒为单位）
    const timeDifference = currentDate - gmtFinishedDate;
    // 将时间差异转换为天数
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    // 判断时间差异是否不超过5天
    console.log('needShow ' + daysDifference);
    return daysDifference <= 5;
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
    padding: 5px; /* 您想要的padding值 */
  }

  .app {
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .search-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 45px;
    padding: 20px;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    flex: 1;
    align-content: start;
    padding: 1px;
    overflow: auto;
    gap: 3px;
  }

  .card {
    min-width: 190px;
    border-radius: 7%;
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

  .grid >>> .ant-card-grid {
    padding: 0; /* 可能还需要设置 padding 为 0 */
    border: none;
    background: transparent;
    box-shadow: none; /* 可能还需要禁用阴影 */
  }

  .my-transparent-card {
    padding: 0; /* 可能还需要设置 padding 为 0 */
    border: none;
    background: transparent;
    box-shadow: none; /* 可能还需要禁用阴影 */
  }

  .pagination {
    display: flex;
    align-content: center;
    align-items: center; /* 垂直居中 */
    height: 45px;
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
    justify-content: center;
    margin-top: 5px;
    margin-right: 3px;
    margin-left: 3px;
  }

  .custom-radio-group .ant-radio-button-wrapper {
    padding: 0 4px !important;
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
    justify-content: center;
    margin: 2px 5px 0;
  }

  .card-date {
    color: #8c8c8c;
    font-size: 0.8em;
  }

  .search-card {
    display: flex;
    align-items: center;
    height: 45px;
    padding-right: 10px;
    padding-left: 10px;
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

  .vel-img-title {
    display: -webkit-box;
    position: absolute;
    bottom: 60px;
    left: 50%;
    max-width: 80%;
    overflow: hidden;
    transform: translate(-50%);
    transition: opacity 0.15s;
    opacity: 0.8;
    color: #ccc;
    font-size: 12px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: normal; /* 使用normal来允许多行文本 */
    cursor: default;
    -webkit-line-clamp: 4; /* 限制最多显示3行文本 */
    -webkit-box-orient: vertical;
  }

  .opt-top-center >>> .vel-toolbar {
    top: 5px;
    bottom: initial;
    left: 50%;
  }

  .mask-queued {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 250px;
    border-radius: 7%;
  }

  .label-front {
    font-size: 12px;
  }

  .error-text {
    max-width: 80%;
    font-size: 12px;
    white-space: normal;
  }

  .jobList-app {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-width: 830px;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .card-button {
    padding: 0 7px;
    font-size: 10px;
  }

  .card-icon-button {
    padding: 0 5px;
  }

  .check >>> .ant-checkbox + span {
    padding-right: 0;
    padding-left: 0;
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
      height: calc(100vh);
      overflow-y: auto;
    }

    .ant-modal-body {
      flex: 1;
    }
  }
</style>
