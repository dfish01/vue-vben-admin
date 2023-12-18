<template>
  <a-layout class="app" ref="formRef" v-loading="loadingRef">
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
          <a-image src="./logo.png" :width="38" :height="38" :preview="false" />
          <span style="margin-left: 5px; font-size: 16px; font-weight: bold"> 个人收藏 </span>
        </div>
        <div style="display: flex; gap: 5px">
          <a-button-group>
            <a-tooltip>
              <a-button @click="showQueryView" @click.prevent :style="{}" style="padding: 5px">
                <SvgIcon name="list_search" size="20" />
              </a-button>
            </a-tooltip>

            <a-tooltip>
              <a-dropdown :trigger="['click']">
                <a-button style="padding: 5px">
                  <SvgIcon name="sys_setting02" size="20"
                /></a-button>
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
                <a-button style="padding: 5px">
                  <SvgIcon name="sys_setting03" size="20"
                /></a-button>
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
                    <a-menu-item key="4" class="delete" @click="showAccountConfig">
                      🔌运行配置
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
      :style="{ height: `${contentHeight}px `, overflow: 'auto' }"
    >
      <a-empty :image="simpleImage" />
    </div>
    <div v-else class="cards" :style="{ height: `calc(${contentHeight}px) `, overflow: 'auto' }">
      <a-dropdown v-for="card in cards" :key="card.id" :trigger="['contextmenu']">
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
              <span> 正在排队中... </span>
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
              <span> {{ card.mjExecute === 'N' ? '正在执行中...' : 'MJ正在绘画中...' }} </span>
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
              <span v-if="card.failMsg" style="margin-top: 10px"> {{ card.failMsg }} </span>
              <span v-else> 执行失败</span>
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
                  title="该操作将永久删除任务，是否确认删除?"
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
            <a-radio-group size="small" buttonStyle="solid">
              <a-tooltip v-if="card.prompt" :overlayStyle="{ maxWidth: '500px' }" trigger="click">
                <template #title>
                  <p v-for="(part, index) in card.prompt.split('\n\n')" :key="index">{{
                    part.trim()
                  }}</p>
                </template>
                <a-radio-button value="b">
                  <Icon icon="ic:outline-info" size="14" color="#FFCC70" />
                </a-radio-button>
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
                <a-radio-button value="t">
                  <Icon icon="ic:baseline-add-alarm" size="14" color="#EE9322" />
                </a-radio-button>
              </a-tooltip>
              <a-tooltip title="删除">
                <a-popconfirm
                  title="该操作将永久删除任务，是否确认删除?"
                  ok-text="确认删除"
                  cancel-text="取消"
                  @confirm="deleteCard(card)"
                >
                  <a-radio-button value="c">
                    <Icon icon="ic:baseline-delete-forever" size="14" color="#FF6969" />
                  </a-radio-button>
                </a-popconfirm>
              </a-tooltip>
            </a-radio-group>
          </div>

          <div
            v-else
            style="display: flex; flex-direction: column; padding-right: 4px; padding-bottom: 5px"
          >
            <div class="card-tags">
              <div class="custom-radio-group">
                <a-button-group size="small" buttonStyle="solid">
                  <a-tooltip
                    :title="
                      card.privacyMode === 'Y' ? '点击公开图片' : '当前公开图片，点击将关闭公开'
                    "
                    v-if="card.state === 'SUCCESS' && card.commandType != 'DESCRIBE'"
                  >
                    <a-button class="card-icon-button" @click="toggleVisibility(card)">
                      <span v-if="card.privacyMode === 'Y'">
                        <Icon icon="material-symbols:public-off" size="14" color="#B4B4B3" />
                      </span>
                      <span v-else>
                        <Icon icon="material-symbols:public" size="14" color="#8ECDDD" />
                      </span>
                    </a-button>
                  </a-tooltip>

                  <a-tooltip
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
                      title="该操作将永久删除任务，是否确认删除?"
                      ok-text="确认删除"
                      cancel-text="取消"
                      @confirm="deleteCard(card)"
                    >
                      <a-button class="card-icon-button">
                        <Icon icon="ic:baseline-delete-forever" size="14" color="#FF6969" />
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
                  <a-tooltip
                    title="加入收藏"
                    v-if="card.state === 'SUCCESS' && card.commandType != 'DESCRIBE'"
                  >
                    <a-button class="card-icon-button" @click="addDrawCollect(card)">
                      <Icon
                        v-if="card.collectFlag === 'N'"
                        icon="material-symbols:heart-plus-outline"
                        size="14"
                        color="#213555"
                      />
                      <Icon v-else icon="material-symbols:heart-plus" size="14" color="#c85762" />
                    </a-button>
                  </a-tooltip>
                </a-button-group>
              </div>
            </div>
            <div class="card-date-actions">
              <a-button-group style="border-radius: 2px">
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
                          >U1</a-menu-item
                        >
                        <a-menu-item
                          @click="handleU(card, 'U2', 'image')"
                          key="2"
                          v-if="card.buttonMap['U2']"
                          >U2</a-menu-item
                        >
                        <a-menu-item
                          @click="handleU(card, 'U3', 'image')"
                          key="3"
                          v-if="card.buttonMap['U3']"
                          >U3</a-menu-item
                        >
                        <a-menu-item
                          @click="handleU(card, 'U4', 'image')"
                          key="4"
                          v-if="card.buttonMap['U4']"
                          >U4</a-menu-item
                        >
                      </a-menu>
                    </template>
                    <a-button size="small" class="card-button">
                      🔍放大
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
                          >V1</a-menu-item
                        >
                        <a-menu-item
                          key="V2"
                          v-if="card.buttonMap['V2']"
                          @click="($event) => handleV(card, 'variation', 'V2')"
                          >V2</a-menu-item
                        >
                        <a-menu-item
                          key="V3"
                          v-if="card.buttonMap['V3']"
                          @click="($event) => handleV(card, 'variation', 'V3')"
                          >V3</a-menu-item
                        >
                        <a-menu-item
                          key="V4"
                          v-if="card.buttonMap['V4']"
                          @click="($event) => handleV(card, 'variation', 'V4')"
                          >V4</a-menu-item
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
                      🪄微调
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
                        <a-menu-item key="up" v-if="card.buttonMap['⬆️']">⬆️上</a-menu-item>
                        <a-menu-item key="down" v-if="card.buttonMap['⬇️']">⬇️下</a-menu-item>
                        <a-menu-item key="left" v-if="card.buttonMap['⬅️']">⬅️左</a-menu-item>
                        <a-menu-item key="right" v-if="card.buttonMap['➡️']">➡️右</a-menu-item>
                      </a-menu>
                    </template>
                    <a-button size="small" class="card-button">
                      🎨填充
                      <DownOutlined />
                    </a-button>
                  </a-dropdown>
                  <a-dropdown v-if="card.buttonMap['Zoom Out 1.5x']">
                    <template #overlay>
                      <a-menu @click="($event) => handleZoom(card, 'ZOOM', $event)">
                        <a-menu-item key="Zoom Out 1.5x" v-if="card.buttonMap['Zoom Out 1.5x']"
                          >🔍缩放1.5倍</a-menu-item
                        >
                        <a-menu-item key="Zoom Out 2x" v-if="card.buttonMap['Zoom Out 2x']"
                          >🔍缩放2倍</a-menu-item
                        >
                        <a-menu-item key="Custom Zoom" v-if="card.buttonMap['Custom Zoom']"
                          >📝自定义缩放</a-menu-item
                        >
                        <a-menu-item key="Make Square" v-if="card.buttonMap['Make Square']"
                          >⬜︎转成1:1</a-menu-item
                        >
                      </a-menu>
                    </template>
                    <a-button size="small" class="card-button">
                      🔍缩放
                      <DownOutlined />
                    </a-button>
                  </a-dropdown>

                  <a-dropdown
                    v-if="
                      card.buttonMap['Vary (Strong)'] ||
                      card.buttonMap['Vary (Subtle)'] ||
                      card.buttonMap['Upscale (2x)'] ||
                      card.buttonMap['Upscale (4x)']
                    "
                  >
                    <template #overlay>
                      <a-menu>
                        <a-menu-item
                          key="Vary (Strong)"
                          v-if="card.buttonMap['Vary (Strong)']"
                          @click="($event) => handleV(card, 'variation', 'Vary (Strong)')"
                          >🪄强变化</a-menu-item
                        >
                        <a-menu-item
                          key="Vary (Subtle)"
                          v-if="card.buttonMap['Vary (Subtle)']"
                          @click="($event) => handleV(card, 'variation', 'Vary (Subtle)')"
                          >🪄微变化</a-menu-item
                        >
                        <a-menu-item
                          key="Vary (Region)"
                          v-if="remix.enable_flag && card.buttonMap['Vary (Region)']"
                          @click="($event) => openVaryRegion(card, 'variation', 'Vary (Region)')"
                          >🖌️局部重绘</a-menu-item
                        >
                        <a-menu-item
                          key="Upscale (2x)"
                          v-if="card.buttonMap['Upscale (2x)']"
                          @click="($event) => handleU(card, 'Upscale (2x)', 'upscale2')"
                          >🔼2倍放大</a-menu-item
                        >
                        <a-menu-item
                          key="Upscale (4x)"
                          v-if="card.buttonMap['Upscale (4x)']"
                          @click="($event) => handleU(card, 'Upscale (4x)', 'upscale4')"
                          >⏫4倍放大</a-menu-item
                        >
                      </a-menu>
                    </template>
                    <a-button size="small" class="card-button">
                      🪄变化
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
                          >🔼2倍放大</a-menu-item
                        >
                        <a-menu-item
                          key="Redo Upscale (4x)"
                          v-if="card.buttonMap['Redo Upscale (4x)']"
                          @click="($event) => handleU(card, 'Redo Upscale (4x)', 'upscale4')"
                          >⏫4倍放大</a-menu-item
                        >
                      </a-menu>
                    </template>
                    <a-button size="small" class="card-button">
                      🪄放大
                      <DownOutlined />
                    </a-button>
                  </a-dropdown>
                </div>
                <div v-if="card.state === 'SUCCESS' && card.commandType === 'DESCRIBE'">
                  <a-dropdown>
                    <template #overlay>
                      <a-menu @click="($event) => handleDraw(card, $event)">
                        <a-menu-item key="0">1️⃣ Prompt</a-menu-item>
                        <a-menu-item key="1">2️⃣ Prompt</a-menu-item>
                        <a-menu-item key="2">3️⃣ Prompt</a-menu-item>
                        <a-menu-item key="3">4️⃣ Prompt</a-menu-item>
                        <a-menu-item key="4">全部 Prompt</a-menu-item>
                      </a-menu>
                    </template>
                    <a-button size="small" class="card-button">
                      <Icon icon="streamline-emojis:woman-artist-2" style="margin: 0" /> 绘图
                      <DownOutlined />
                    </a-button>
                  </a-dropdown>
                  <a-checkbox
                    class="check"
                    style="margin-left: 5px"
                    v-model:checked="describeInfo.autoReferImage"
                    >垫图</a-checkbox
                  >
                </div>
              </a-button-group>
            </div>
          </div>
          <!-- 更多卡片内容 -->
        </a-card>

        <template #overlay>
          <a-menu>
            <a-menu-item key="1" v-if="card.state === 'SUCCESS'" @click="() => showTaskInfo(card)"
              ><Icon icon="streamline-emojis:television" />任务明细</a-menu-item
            >
            <a-menu-item key="2" @click="() => showDrawTaskTagModel(card)"
              ><Icon icon="streamline-emojis:blossom" /> 添加标签</a-menu-item
            >
            <a-menu-item key="3" @click="() => showSampleView(card)"
              ><Icon icon="streamline-emojis:globe-showing-europe-africa" />
              添加到官方案例</a-menu-item
            >
            <a-menu-item key="4" @click="() => copyText(card.messageHash)"
              ><Icon icon="fluent-emoji-flat:id-button" color="grey" /> 复制任务ID</a-menu-item
            >

            <a-menu-item key="5" @click="() => copyText(card.prompt)"
              ><Icon icon="streamline-emojis:baseball" color="grey" /> 复制Prompt</a-menu-item
            >
            <a-menu-item key="6" @click="showUserSpaceTask(card)"
              ><Icon icon="streamline-emojis:helicopter" /> 添加到其他空间</a-menu-item
            >
            <a-popconfirm
              title="该操作将永久删除任务，是否确认删除?"
              ok-text="确认删除"
              cancel-text="取消"
              @confirm="deleteCard(card)"
            >
              <a-menu-item key="7" @click="deleteSpaceCard(card, spaceId)">
                <Icon icon="streamline-emojis:recycling-symbol" color="red" />
                从该空间移除</a-menu-item
              >
            </a-popconfirm>
            <a-menu-item key="8" @click="() => getSeed(card.id, false)"
              ><Icon icon="streamline-emojis:rocket" /> 获取Seed</a-menu-item
            >
          </a-menu>
        </template>
      </a-dropdown>
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
          <div class="vel-toolbar">
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

    <div ref="buttonRef">
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
        @ok="addDrawTaskTag()"
        :confirmLoading="drawTagForm.loading"
      >
        <template #title> <Icon icon="streamline-emojis:blossom" />添加标签 </template>
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

    <a-modal v-model:open="isModalVisible" width="80%">
      <template #title> 图片查看 </template>
      <img :src="currentImage" style="width: 100%; height: auto" />
    </a-modal>

    <a-modal
      v-model:open="varyRegionForm.viewFlag"
      title="🎨Midjourney局部变化"
      style="top: 20px; width: 75%; height: auto"
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
      :bodyStyle="{ padding: '7px 0px 7px 0px', width: '100%', 'align-items': 'center' }"
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
              v-model:value="searchForm.state"
              style="width: 100%"
              placeholder="任务状态"
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
              v-model:value="searchForm.commandType"
              class="mobile-select"
              placeholder="任务类型"
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

    <!-- 查看明细  -->
    <a-modal
      title="任务概况"
      v-model:open="infoData.viewFlag"
      width="100%"
      wrap-class-name="full-modal "
      :bodyStyle="{ padding: '0px' }"
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

    <!-- 运行账号配置-->
    <div>
      <a-modal v-model:open="accountForm.viewFlag" title="执行账号配置">
        <template #footer>
          <a-button type="primary" @click="closeAccountConfig">关闭窗口</a-button>
        </template>
        <a-card :bodyStyle="{ margin: '0px 15px' }">
          <span style="margin-bottom: 30px; font-size: 11px"
            >📢这里和绘画工作台的账号和执行模型是联动的！！！</span
          >
          <a-form layout="vertical" style="margin-top: 10px">
            <a-form-item label="执行账号">
              <a-select
                placeholder="不选的话，随机选取账号，优先默认"
                @change="handleAccountSetting"
                style="width: 100%; height: 32px"
                v-model:value="accountForm.useAccountId"
                v-model="accountForm.useAccountId"
                :size="accountForm.accountSelector.size"
                :options="accountForm.accountSelector.options"
              />
            </a-form-item>
            <a-form-item label="执行模式">
              <a-select
                @change="handleSetting('mode', accountForm.mode)"
                v-model:value="accountForm.mode"
                style="width: 100%; height: 32px"
                placeholder="不选的话，默认休闲模式"
              >
                <!-- <a-select-option value="">不设置</a-select-option> -->
                <a-select-option value="relax">休闲模式</a-select-option>
                <a-select-option value="fast">快速模式</a-select-option>
                <a-select-option value="turbo">涡轮模式</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
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
  import { SvgIcon } from '/@/components/Icon';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { addSpaceTask, removeSpaceTask, allUserSpace } from '/@/api/df/workSpace';
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
    jobOptionApi,
    jobTagApi,
    userSettingApi,
    lightBoxApi,
    splitAndDownloadImage,
  } from './collect';
  import {
    downloadImage,
    copyText,
    tagColor,
    formattedPrompt,
    splitPrompt,
    handleDownloadByUrl,
    handleDownloadByUrls,
    generateTooltipText,
  } from './tools';
  import { Empty } from 'ant-design-vue';
  import { useRoute } from 'vue-router';
  import { accountInfoApi } from '../mj/accountInfo';

  const {
    accountForm,
    initAccountList,
    initAccountInfo,
    doGetChannelsByGroup,
    handleAccountSetting,
    handleSetting,
    showAccountConfig,
    closeAccountConfig,
  } = accountInfoApi();

  /** 页面高度计算开始 */
  const formRef = ref();
  //页面高度处理
  const buttonRef = ref(null);
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 1);
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

    // Remix 相关
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
    describeInfo,
  } = jobOptionApi();

  const {
    // 响应式引用
    drawTagForm,

    showDrawTaskTagModel,
    addDrawTaskTag,
    loadTagList,
    onChangeLabel,
    onChangeSearchLabel,
    removeDrawTaskTag,
  } = jobTagApi();

  const { userSetting, setUseUpImage, setCardShow, setUsePersonNet, setTaskRefresh } =
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

  const spaceTitle = ref(route.params.spaceTitle || route.query.spaceTitle);
  onMounted(() => {
    searchForm.value.spaceId = ref(route.params.spaceId || route.query.spaceId);
    onSearch(1);
    initAccountList();
    (window as any).varyRegionForm = varyRegionForm;
    loadTagList();
  });

  // 监听来自 iframe 的消息
  const handleMessage = (event: MessageEvent) => {
    // 验证消息来源和内容，然后关闭 iframe
    if (event.data === 'close_iframe') {
      varyRegionForm.value.viewFlag = false;
    }
  };

  onMounted(() => {
    window.addEventListener('message', handleMessage, false);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('message', handleMessage);
  });

  //下载
  const doDownload = async (card) => {
    const imageUrlsArray = card.taskImage.infoImageList.map((item) => item.url);
    await handleDownloadByUrls(imageUrlsArray);
  };

  const imageLoaded = async (card) => {
    card.loaded = true;
  };

  //随机颜色
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
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
    flex: 1;
    align-content: start;
    padding: 5px;
    overflow: auto;
    gap: 3px;
  }

  .card {
    min-width: 185px;
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
    margin-right: 5px;
    margin-left: 5px;
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

  .card-button {
    height: 24px;
    padding: 0 7px;
    border-radius: 5px;
    font-size: 10px;
  }

  .card-icon-button {
    display: flex;
    align-items: center;
    height: 22px;
    padding: 0 5px;
    border-radius: 1px;
    font-size: 9px;
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
      overflow-y: auto; /* 添加垂直滚动条 */
    }

    .ant-modal-body {
      flex: 1;
    }
  }
</style>
