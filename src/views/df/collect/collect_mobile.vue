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
          <a-tooltip>
            <a-button
              @click="showQueryView"
              @click.prevent
              :style="{}"
              style="padding: 0 5px; border-radius: 5px"
            >
              <Icon icon="uil:search-alt" size="22" />
            </a-button>
          </a-tooltip>

          <a-tooltip>
            <a-dropdown :trigger="['click']">
              <a-button style="padding: 0 5px; border-radius: 5px"
                ><Icon icon="tabler:picture-in-picture" size="22"
              /></a-button>
              <template #overlay>
                <a-menu>
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
                  <a-menu-item key="4">
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
              <a-button style="padding: 0 5px; border-radius: 5px"
                ><Icon icon="icon-park-outline:setting-web" size="20"
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
                </a-menu>
              </template>
            </a-dropdown>
          </a-tooltip>
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
            <img
              @click="showImage(card)"
              v-lazy.container="
                userSetting.useUpImage ? card.taskImage.imageUrl : card.taskImage.mediaImageUrl
              "
              class="card-image img-box"
              :preview="{
                src: card.taskImage.imageUrl,
              }"
              fallback=""
              alt=""
            />
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
                      👩‍🎨绘图
                      <DownOutlined />
                    </a-button>
                  </a-dropdown>
                  <a-checkbox
                    class="check"
                    style="margin-left: 5px"
                    v-model:checked="describeInfo.autoReferImage"
                    >自动垫图</a-checkbox
                  >
                </div>
              </a-button-group>
            </div>
          </div>
          <!-- 更多卡片内容 -->
        </a-card>

        <template #overlay>
          <a-menu>
            <a-menu-item key="1" @click="splitAndDownloadImage(card)" disabled
              >✂️切4份下载</a-menu-item
            >
            <a-menu-item key="2" @click="() => showDrawTaskTagModel(card)">📛添加标签</a-menu-item>
            <a-menu-item key="3" @click="() => copyText(card.messageHash)"
              >🆔复制任务ID</a-menu-item
            >
            <a-menu-item key="4" @click="() => copyText(card.prompt)">🐣复制Prompt</a-menu-item>
            <!-- <a-menu-item key="3" disabled>移除标签</a-menu-item> -->
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
        :loading="remix.loading"
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
        :loading="drawTagForm.loading"
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
      :bodyStyle="{ padding: '7px 12px 7px 12px', width: '100%', 'align-items': 'center' }"
    >
      <template #footer>
        <a-button key="submit" type="primary" @click="doModelSearch()">立即查询</a-button>
      </template>
      <a-card
        :bordered="false"
        :bodyStyle="{ padding: '1px 1px 1px 1px', width: '100%', 'align-items': 'center' }"
      >
        <a-row :gutter="[0, 2]" type="flex">
          <a-col flex="80px">
            <a-tag class="quality-tag" color="default">🍺状态 </a-tag>
          </a-col>
          <a-col flex="auto">
            <a-select v-model:value="searchForm.state" style="width: 100%" class="mobile-select">
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
            <a-tag class="quality-tag" color="default">🍥标签 </a-tag>
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
  </a-layout>
</template>

<script lang="ts" setup>
  import { Loading } from '/@/components/Loading';
  import 'vue-easy-lightbox/external-css/vue-easy-lightbox.css';
  import VueEasyLightbox from 'vue-easy-lightbox';
  import VueLazyload from 'vue-lazyload';
  import Icon from '/@/components/Icon/Icon.vue';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
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
    cards,
    searchForm,
    pagination,
    pageChange,
    pageSizeChange,
    onSearchNoLoading,
    onSearch,
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
  } = jobOptionApi();

  const {
    // 响应式引用
    drawTagForm,

    showDrawTaskTagModel,
    addDrawTaskTag,
    loadTagList,
    onChangeLabel,
    onChangeSearchLabel,
  } = jobTagApi();

  const { userSetting, setUseUpImage, setUsePersonNet, setTaskRefresh } = userSettingApi();

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
</style>
