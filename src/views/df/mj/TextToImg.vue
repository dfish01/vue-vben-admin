<template>
  <a-form
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    layout="vertical"
    :disabled="componentDisabled"
    ref="formRef"
    :model="textToImgForm"
    :rules="rules"
  >
    <div :style="{ height: `calc(${contentHeight}px - 1px`, overflow: 'auto' }">
      <a-card
        size="small"
        :bordered="true"
        :bodyStyle="{ padding: '5px' }"
        class="ar-card2"
        style="margin-top: 0"
      >
        <template #title>
          <div class="ar-card2-title">
            <span style="justify-content: flex-start; font-weight: bold" class="quality-tag"
              >关键词
              <a-tooltip
                title="这里输入相关的描述。你可以输入主体Prompt然后选择相关的配置、也可以自己输入完整的prompt、另外你也可以以 “/imagine:”开头输入相关的prompt。 “/imagine:”支持多条输入，记得换行哈~ "
              >
                <ExclamationCircleOutlined class="icon-hint" /> </a-tooltip
            ></span>
          </div>
        </template>
        <!-- <a-form-item name="command" style="margin-bottom: 1px; resize: none"> -->
        <a-textarea
          style="width: 99%"
          :rows="10"
          v-model:value="textToImgForm.command"
          placeholder="请输入你的提示词~"
          show-count
          allow-clear
          :maxlength="2000"
          :auto-size="{ minRows: 10, maxRows: 10 }"
        />
        <!-- </a-form-item> -->
      </a-card>
      <!-- 垫图 B-->
      <a-card size="small" :bordered="true" :bodyStyle="{ padding: '5px' }" class="ar-card2">
        <template #title>
          <div class="ar-card2-title">
            <span style="justify-content: flex-start; font-weight: bold" class="quality-tag"
              >垫图
              <a-tooltip
                title="这里上传图片，和Prompt里面带上的图片只能二选一。并且是这里的为准！如果有图片连接的话建议直接图片连接~"
              >
                <ExclamationCircleOutlined class="icon-hint" /> </a-tooltip
            ></span>
          </div>
        </template>
        <a-row>
          <a-col span="24">
            <a-upload
              v-model:file-list="fileList"
              :before-upload="beforeUpload"
              list-type="picture-card"
              @preview="handlePreview"
              @change="handleChange"
              style="display: flex; align-items: flex-start; justify-content: flex-start"
            >
              <div v-if="fileList.length < 5">
                <plus-outlined />
                <div style="margin-top: 8px">上传图片</div>
              </div>
            </a-upload>
          </a-col>
        </a-row>
        <a-row class="row-wapper" v-if="paramDataValue.version != 'v 4'">
          <a-col span="6" style="display: flex; align-items: center; justify-content: start">
            <span class="quality-tag"
              >权重
              <a-tooltip title="--iw 值越高，上传的图像对最终效果的影响就越大">
                <ExclamationCircleOutlined class="icon-hint" />
              </a-tooltip>
            </span>
          </a-col>
          <a-col :span="18">
            <a-slider
              @change="onChangeIw"
              style="margin-left: 3px"
              v-model:value="paramDataValue.iw"
              :min="0.25"
              :step="0.05"
              :max="2"
            />
          </a-col>
        </a-row>
      </a-card>
      <!-- 垫图 E-->
      <!-- 辅助工具 B-->
      <a-card size="small" :bordered="true" :bodyStyle="{ padding: '5px' }" class="ar-card2">
        <template #title>
          <div class="ar-card2-title">
            <span style="font-weight: bold">辅助工具</span>
          </div>
        </template>
        <a-row>
          <a-col span="8">
            <a-button style="width: 100%; background: #6ca0e3" size="small" @click="openTranslate"
              ><SvgIcon name="translate" />中英翻译</a-button
            >
          </a-col>
          <a-col span="8">
            <a-button style="width: 100%; background: #d4237a" size="small" @click="openAiPrompt"
              ><SvgIcon name="gpt" />GPT生成</a-button
            >
          </a-col>
          <a-col span="8">
            <a-button
              style="width: 100%; background-color: #ffa500"
              size="small"
              @click="openDrawerInC"
            >
              <SvgIcon name="book" /> 葵花宝典</a-button
            >
          </a-col>
        </a-row>
      </a-card>
      <!-- 辅助工具 E-->
      <!-- 任务标签 B-->
      <a-card size="small" :bordered="true" :bodyStyle="{ padding: '5px' }" class="ar-card2">
        <template #title>
          <div class="ar-card2-title">
            <span style="justify-content: flex-start; font-weight: bold" class="quality-tag"
              ><Icon icon="streamline-emojis:blossom" /> 添加标签
              <a-tooltip
                title="用于对批次任务的标记，方便管理图片。多个标签'空格'隔开,最多5个标签。每个标签长度不超过16个字。~"
              >
                <ExclamationCircleOutlined class="icon-hint" /> </a-tooltip
            ></span>
          </div>
        </template>
        <a-row>
          <a-col span="24">
            <a-mentions
              style="text-align: left"
              v-model:value="textToImgForm.tagName"
              rows="3"
              placeholder="用@可以触发最近使用的标签哦！多个标签'空格符'隔开,最多5个标签。每个标签长度不超过16个字。~"
              :options="textToImgForm.tagNameOptions"
              @select="onChangeLabel"
            />
          </a-col>
        </a-row>
        <a-row style="margin-top: 10px">
          <a-col span="6">
            <a-tooltip title="这个是解放你双手和时间的参数">
              <a-tag class="quality-tag tag-no-right-border" color="default">重复次数</a-tag>
            </a-tooltip>
          </a-col>
          <a-col span="18">
            <a-input
              v-model:value="textToImgForm.invokeTimes"
              type="text"
              @input="checkInteger"
              pattern="\d*"
            />
          </a-col>
        </a-row>
        <a-row style="margin-top: 10px">
          <a-col span="6">
            <a-tooltip
              title="不指定账号的话，随机根据账号现有负载情况选择资源最空的一个账号，优先默认账号。这里会进行会话缓存，会应用任务列表、收藏里面。退出后失效！！！"
            >
              <a-tag class="quality-tag tag-no-right-border" color="default">执行账号</a-tag>
            </a-tooltip>
          </a-col>
          <a-col span="18">
            <a-select
              placeholder="随机选取账号，优先默认"
              @change="handleAccountSetting"
              style="width: 100%; height: 32px"
              v-model:value="accountForm.useAccountId"
              v-model="accountForm.useAccountId"
              :size="accountForm.accountSelector.size"
              :options="accountForm.accountSelector.options"
            />
          </a-col>
        </a-row>
        <a-row style="margin-top: 10px" v-if="accountForm.useAccountId">
          <a-col span="6">
            <a-tooltip
              title="不指定频道的话，默认账户组中的频道。这里会进行会话缓存，会应用任务列表、收藏里面。退出后失效！！！"
            >
              <a-tag class="quality-tag tag-no-right-border" color="default">执行频道</a-tag>
            </a-tooltip>
          </a-col>

          <a-col span="18">
            <a-select
              style="width: 100%"
              @change="handleSetting('useChannelId', accountForm.useChannelId)"
              placeholder="请选择ChannelId"
              v-model:value="accountForm.useChannelId"
              :size="accountForm.accountSelector.size"
              :options="accountForm.channelSelector.options"
            />
          </a-col>
        </a-row>
        <!-- <a-row :gutter="2" class="row-wapper">
          <a-col span="6" style="display: flex; align-items: center; justify-content: center">
            <a-tooltip title="'公开任务的话，大家在广场都能看到'">
              <a-tag class="quality-tag tag-keep-right-border" color="default">是否公开</a-tag>
            </a-tooltip>
          </a-col>
          <a-col :span="18" style="display: flex; align-items: center; justify-content: right">
            <a-switch v-model:checked="textToImgForm.isPublic" />
          </a-col>
        </a-row> -->
        <a-row style="margin-top: 10px">
          <a-col span="6">
            <a-tooltip
              title="休闲模式->快速模式->涡轮模式 速度依次递增。这里的模式是会话缓存，会应用任务列表、收藏里面。退出后失效！！！"
            >
              <a-tag class="quality-tag tag-no-right-border" color="default"
                >执行模式
              </a-tag></a-tooltip
            >
          </a-col>
          <a-col span="18">
            <a-select
              placeholder="默认休闲模式"
              @change="handleSetting('mode', accountForm.mode)"
              v-model:value="accountForm.mode"
              style="width: 100%; height: 32px"
            >
              <!-- <a-select-option>不设置</a-select-option> -->
              <a-select-option value="relax">休闲模式</a-select-option>
              <a-select-option value="fast">快速模式</a-select-option>
              <a-select-option value="turbo">涡轮模式</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row class="row-wapper">
          <a-col span="9" style="display: flex; align-items: center; justify-content: center">
            <span class="quality-tag"
              >翻译Prompt
              <a-tooltip
                title="启用后，执行时将使用翻译后的英文prompt。niji 5支持中文解析，其他建议英文，否则出图有点偏离！"
              >
                <ExclamationCircleOutlined class="icon-hint" /> </a-tooltip
            ></span>
          </a-col>
          <a-col :span="15" style="display: flex; align-items: center; justify-content: right">
            <a-switch v-model:checked="textToImgForm.enableTranslate" />
          </a-col>
        </a-row>
      </a-card>
      <!-- 任务标签 E-->

      <!-- 提示词 B-->
      <a-card size="small" :bordered="true" :bodyStyle="{ padding: '5px' }" class="ar-card2">
        <template #title>
          <div class="ar-card2-title">
            <span style="font-weight: bold">提示词属性</span>
          </div>
        </template>
        <div class="tags-container">
          <a-tag
            v-for="tag in paramTags"
            :key="tag.text"
            :color="tag.color"
            size="small"
            style="margin: 1px 2px; padding: 1px 3px"
          >
            {{ tag.text }}
          </a-tag>
        </div>
      </a-card>
      <!-- 提示词 E-->
      <!-- 项列表 -->
      <!-- 图片比例 B-->
      <a-card size="small" :bordered="true" :bodyStyle="{ padding: '5px' }" class="ar-card2">
        <template #title>
          <div class="ar-card2-title">
            <span style="font-weight: bold">画图比例</span>
            <a-tooltip title="关系到最终生成的图片比例" trigger="click">
              <ExclamationCircleOutlined style="margin-left: 5px; cursor: pointer" />
            </a-tooltip>
          </div>
        </template>

        <a-row :gutter="2">
          <a-col v-for="option in options" :key="option.id" :span="option.span" class="ar-item">
            <div
              v-if="isEditing && option.id === 90"
              class="border-wapper"
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 6px;
              "
            >
              <a-input-group size="small">
                <a-row style="justify-content: center">
                  <a-col :span="9">
                    <a-input
                      v-model:value="option.X"
                      @input="
                        option.X =
                          option.X.replace(/\D/g, '') === '' || +option.X <= 1
                            ? '1'
                            : parseInt(option.X.replace(/\D/g, ''), 10) || 1
                      "
                    />
                  </a-col>
                  <a-col :span="2">
                    <span>:</span>
                  </a-col>
                  <a-col :span="9">
                    <a-input
                      v-model:value="option.Y"
                      @input="
                        option.Y =
                          option.Y.replace(/\D/g, '') === '' || +option.Y <= 1
                            ? '1'
                            : parseInt(option.Y.replace(/\D/g, ''), 10) || 1
                      "
                    />
                  </a-col>
                </a-row>
              </a-input-group>

              <a-row :gutter="8" style="justify-content: center; width: 100%; margin-top: 2px">
                <a-col :span="21">
                  <a-button style="width: 100%" @click="onCustomerOption(option)" size="small"
                    >确认比例</a-button
                  >
                </a-col>
              </a-row>
            </div>

            <a-tag
              v-else
              @click="selectOption(option)"
              :color="selectedOption === option.id ? 'blue' : 'default'"
              class="ar-item-tag"
            >
              {{ option.X }}:{{ option.Y }}<br />{{ option.label }}
            </a-tag>
          </a-col>
        </a-row>
      </a-card>
      <!-- 图片比例 E-->

      <!-- 模型选择 B-->
      <a-card
        size="small"
        :bordered="true"
        :bodyStyle="{ padding: '5px', width: '100%' }"
        class="ar-card2"
      >
        <template #title>
          <div class="ar-card2-title">
            <span style="font-weight: bold">模型选择</span>
            <a-tooltip
              title="不一样的模型会有不一样的出图效果。Niji5 二次元专用呦~"
              trigger="click"
            >
              <ExclamationCircleOutlined style="margin-left: 5px; cursor: pointer" />
            </a-tooltip>
          </div>
        </template>
        <a-row :gutter="2">
          <div class="card-container" style="width: 100%">
            <a-tabs v-model:activeKey="activeKey" type="card" @change="chooseVersion">
              <a-tab-pane key="niji5" tab="Niji 5">
                <a-row style="justify-content: left">
                  <a-col span="24" class="style-radio">
                    <a-radio-group size="small" v-model:value="versionParam.niji5.style">
                      <a-tooltip title="默认的风格，效果很不错">
                        <a-radio-button value="">Default</a-radio-button>
                      </a-tooltip>

                      <a-tooltip title=" 表现力风格，更精致的插图艺术风格">
                        <a-radio-button value="expressive">Expressive</a-radio-button>
                      </a-tooltip>
                      <a-tooltip title="可爱风格，能创造出迷人可爱的角色、道具和场景">
                        <a-radio-button value="cute">Cute</a-radio-button>
                      </a-tooltip>

                      <a-tooltip title="景色风格，在奇幻环境下作出美丽的背景和电影般的角色时刻">
                        <a-radio-button value="scenic">Scenic</a-radio-button>
                      </a-tooltip>
                      <a-tooltip title="原始风格，在2023.5.26日之前的默认Niji5的风格">
                        <a-radio-button value="original">Original</a-radio-button>
                      </a-tooltip>
                    </a-radio-group>
                  </a-col>
                </a-row>
                <a-row style="margin-top: 10px">
                  <a-col span="6">
                    <a-tooltip
                      title=" '--quality'或'--q'参数，更改生成图像所花费的时间。更高质量的设置需要更长的来处理和生成更多细节。较高的值还意味着每个作业使用的 GPU 分钟数更多。质量设置不会影响分辨率"
                    >
                      <a-tag class="quality-tag" color="default"
                        >质量 <ExclamationCircleOutlined class="icon-hint" /> </a-tag
                    ></a-tooltip>
                  </a-col>
                  <a-col span="18">
                    <a-select
                      v-model:value="versionParam.niji5.quality"
                      style="width: 100%; height: 32px"
                    >
                      <a-select-option value="0.25">0.25x</a-select-option>
                      <a-select-option value="0.5">0.5x</a-select-option>
                      <a-select-option value="1">1x</a-select-option>
                    </a-select>
                  </a-col>
                </a-row>
                <a-row class="row-wapper">
                  <a-col
                    span="6"
                    style="display: flex; align-items: center; justify-content: start"
                  >
                    <span class="quality-tag"
                      >风格化

                      <a-tooltip
                        title="'--stylize 或者 --s, 这个值越低会更符合 prompt 的描述，数值越高艺术性就会越强，但跟 prompt 关联性就会比较弱"
                      >
                        <ExclamationCircleOutlined class="icon-hint" />
                      </a-tooltip>
                    </span>
                  </a-col>
                  <a-col :span="18">
                    <a-slider
                      style="margin-left: 3px"
                      v-model:value="versionParam.niji5.s"
                      :min="1"
                      :step="1"
                      :max="1000"
                    />
                  </a-col>
                </a-row>
                <a-row class="row-wapper">
                  <a-col
                    span="6"
                    style="display: flex; align-items: center; justify-content: start"
                  >
                    <span class="quality-tag"
                      >多样性

                      <a-tooltip
                        title="'--chaos' 或者'--c' 参数, 会影响初始图像网格的变化程度。较高的值将产生更多不寻常和意外的结果和组合。值越低，结果越可靠、可重复"
                      >
                        <ExclamationCircleOutlined class="icon-hint" />
                      </a-tooltip>
                    </span>
                  </a-col>
                  <a-col :span="18">
                    <a-slider
                      style="margin-left: 3px"
                      v-model:value="versionParam.niji5.chaos"
                      :min="1"
                      :step="1"
                      :max="100"
                    />
                  </a-col>
                </a-row>

                <a-row class="row-wapper">
                  <a-col
                    span="8"
                    style="display: flex; align-items: center; justify-content: center"
                  >
                    <span class="quality-tag"
                      >无缝图案
                      <a-tooltip
                        title="'--tile'参数,该参数生成的图像可用作重复磁贴，为织物、壁纸和纹理创建无缝图案"
                      >
                        <ExclamationCircleOutlined class="icon-hint" /> </a-tooltip
                    ></span>
                  </a-col>
                  <a-col
                    :span="16"
                    style="display: flex; align-items: center; justify-content: right"
                  >
                    <a-switch v-model:checked="versionParam.niji5.tile" />
                  </a-col>
                </a-row>
              </a-tab-pane>
              <a-tab-pane key="v4" tab="V 4">
                <a-row style="margin-top: 10px">
                  <a-col span="6">
                    <a-tooltip
                      title=" '--quality'或'--q'参数，更改生成图像所花费的时间。更高质量的设置需要更长的来处理和生成更多细节。较高的值还意味着每个作业使用的 GPU 分钟数更多。质量设置不会影响分辨率"
                    >
                      <a-tag class="quality-tag" color="default"
                        >质量 <ExclamationCircleOutlined class="icon-hint" /> </a-tag
                    ></a-tooltip>
                  </a-col>
                  <a-col span="18">
                    <a-select
                      v-model:value="versionParam.v4.quality"
                      style="width: 100%; height: 32px"
                    >
                      <a-select-option value="0.25">0.25x</a-select-option>
                      <a-select-option value="0.5">0.5x</a-select-option>
                      <a-select-option value="1">1x</a-select-option>
                    </a-select>
                  </a-col>
                </a-row>
                <a-row class="row-wapper">
                  <a-col
                    span="6"
                    style="display: flex; align-items: center; justify-content: start"
                  >
                    <span class="quality-tag"
                      >风格化

                      <a-tooltip
                        title="'--stylize 或者 --s, 这个值越低会更符合 prompt 的描述，数值越高艺术性就会越强，但跟 prompt 关联性就会比较弱"
                      >
                        <ExclamationCircleOutlined class="icon-hint" />
                      </a-tooltip>
                    </span>
                  </a-col>
                  <a-col :span="18">
                    <a-slider
                      style="margin-left: 3px"
                      v-model:value="versionParam.v4.s"
                      :min="1"
                      :step="1"
                      :max="1000"
                    />
                  </a-col>
                </a-row>
                <a-row class="row-wapper">
                  <a-col
                    span="6"
                    style="display: flex; align-items: center; justify-content: start"
                  >
                    <span class="quality-tag"
                      >多样性

                      <a-tooltip
                        title="'--chaos' 或者'--c' 参数, 会影响初始图像网格的变化程度。较高的值将产生更多不寻常和意外的结果和组合。值越低，结果越可靠、可重复"
                      >
                        <ExclamationCircleOutlined class="icon-hint" />
                      </a-tooltip>
                    </span>
                  </a-col>
                  <a-col :span="18">
                    <a-slider
                      style="margin-left: 3px"
                      v-model:value="versionParam.v4.chaos"
                      :min="1"
                      :step="1"
                      :max="100"
                    />
                  </a-col>
                </a-row>
              </a-tab-pane>
              <a-tab-pane key="v5" tab="V 5">
                <a-row style="justify-content: left">
                  <a-col span="24" class="style-radio">
                    <a-radio-group size="small" v-model:value="versionParam.v5.style">
                      <a-tooltip title="默认风格">
                        <a-radio-button value="">Default</a-radio-button>
                      </a-tooltip>
                      <a-tooltip title="原始风格，多实用于摄影，更写实的风格">
                        <a-radio-button value="raw">RAW</a-radio-button>
                      </a-tooltip>
                    </a-radio-group>
                  </a-col>
                </a-row>
                <a-row style="margin-top: 10px">
                  <a-col span="6">
                    <a-tooltip
                      title=" '--quality'或'--q'参数，更改生成图像所花费的时间。更高质量的设置需要更长的来处理和生成更多细节。较高的值还意味着每个作业使用的 GPU 分钟数更多。质量设置不会影响分辨率"
                    >
                      <a-tag class="quality-tag" color="default"
                        >质量 <ExclamationCircleOutlined class="icon-hint" /> </a-tag
                    ></a-tooltip>
                  </a-col>
                  <a-col span="18">
                    <a-select
                      v-model:value="versionParam.v5.quality"
                      style="width: 100%; height: 32px"
                    >
                      <a-select-option value="0.25">0.25x</a-select-option>
                      <a-select-option value="0.5">0.5x</a-select-option>
                      <a-select-option value="1">1x</a-select-option>
                    </a-select>
                  </a-col>
                </a-row>
                <a-row class="row-wapper">
                  <a-col
                    span="6"
                    style="display: flex; align-items: center; justify-content: start"
                  >
                    <span class="quality-tag"
                      >风格化

                      <a-tooltip
                        title="'--stylize 或者 --s, 这个值越低会更符合 prompt 的描述，数值越高艺术性就会越强，但跟 prompt 关联性就会比较弱"
                      >
                        <ExclamationCircleOutlined class="icon-hint" />
                      </a-tooltip>
                    </span>
                  </a-col>
                  <a-col :span="18">
                    <a-slider
                      style="margin-left: 3px"
                      v-model:value="versionParam.v5.s"
                      :min="1"
                      :step="1"
                      :max="1000"
                    />
                  </a-col>
                </a-row>
                <a-row class="row-wapper">
                  <a-col
                    span="6"
                    style="display: flex; align-items: center; justify-content: start"
                  >
                    <span class="quality-tag"
                      >多样性

                      <a-tooltip
                        title="'--chaos' 或者'--c' 参数, 会影响初始图像网格的变化程度。较高的值将产生更多不寻常和意外的结果和组合。值越低，结果越可靠、可重复"
                      >
                        <ExclamationCircleOutlined class="icon-hint" />
                      </a-tooltip>
                    </span>
                  </a-col>
                  <a-col :span="18">
                    <a-slider
                      style="margin-left: 3px"
                      v-model:value="versionParam.v5.chaos"
                      :min="1"
                      :step="1"
                      :max="100"
                    />
                  </a-col>
                </a-row>

                <a-row class="row-wapper">
                  <a-col
                    span="8"
                    style="display: flex; align-items: center; justify-content: center"
                  >
                    <span class="quality-tag"
                      >无缝图案
                      <a-tooltip
                        title="'--tile'参数,该参数生成的图像可用作重复磁贴，为织物、壁纸和纹理创建无缝图案"
                      >
                        <ExclamationCircleOutlined class="icon-hint" /> </a-tooltip
                    ></span>
                  </a-col>
                  <a-col
                    :span="16"
                    style="display: flex; align-items: center; justify-content: right"
                  >
                    <a-switch v-model:checked="versionParam.v5.tile" />
                  </a-col>
                </a-row>
              </a-tab-pane>
              <a-tab-pane key="v51" tab="V 5.1">
                <a-row style="justify-content: left">
                  <a-col span="24" class="style-radio">
                    <a-radio-group size="small" v-model:value="versionParam.v51.style">
                      <a-tooltip title="默认风格">
                        <a-radio-button value="">Default</a-radio-button>
                      </a-tooltip>
                      <a-tooltip title="原始风格，多实用于摄影，更写实的风格">
                        <a-radio-button value="raw">RAW</a-radio-button>
                      </a-tooltip>
                    </a-radio-group>
                  </a-col>
                </a-row>
                <a-row style="margin-top: 10px">
                  <a-col span="6">
                    <a-tooltip
                      title=" '--quality'或'--q'参数，更改生成图像所花费的时间。更高质量的设置需要更长的来处理和生成更多细节。较高的值还意味着每个作业使用的 GPU 分钟数更多。质量设置不会影响分辨率"
                    >
                      <a-tag class="quality-tag" color="default"
                        >质量 <ExclamationCircleOutlined class="icon-hint" /> </a-tag
                    ></a-tooltip>
                  </a-col>
                  <a-col span="18">
                    <a-select
                      v-model:value="versionParam.v51.quality"
                      style="width: 100%; height: 32px"
                    >
                      <a-select-option value="0.25">0.25x</a-select-option>
                      <a-select-option value="0.5">0.5x</a-select-option>
                      <a-select-option value="1">1x</a-select-option>
                    </a-select>
                  </a-col>
                </a-row>
                <a-row class="row-wapper">
                  <a-col
                    span="6"
                    style="display: flex; align-items: center; justify-content: start"
                  >
                    <span class="quality-tag"
                      >风格化

                      <a-tooltip
                        title="'--stylize 或者 --s, 这个值越低会更符合 prompt 的描述，数值越高艺术性就会越强，但跟 prompt 关联性就会比较弱"
                      >
                        <ExclamationCircleOutlined class="icon-hint" />
                      </a-tooltip>
                    </span>
                  </a-col>
                  <a-col :span="18">
                    <a-slider
                      style="margin-left: 3px"
                      v-model:value="versionParam.v51.s"
                      :min="1"
                      :step="1"
                      :max="1000"
                    />
                  </a-col>
                </a-row>
                <a-row class="row-wapper">
                  <a-col
                    span="6"
                    style="display: flex; align-items: center; justify-content: start"
                  >
                    <span class="quality-tag"
                      >多样性

                      <a-tooltip
                        title="'--chaos' 或者'--c' 参数, 会影响初始图像网格的变化程度。较高的值将产生更多不寻常和意外的结果和组合。值越低，结果越可靠、可重复"
                      >
                        <ExclamationCircleOutlined class="icon-hint" />
                      </a-tooltip>
                    </span>
                  </a-col>
                  <a-col :span="18">
                    <a-slider
                      style="margin-left: 3px"
                      v-model:value="versionParam.v51.chaos"
                      :min="1"
                      :step="1"
                      :max="100"
                    />
                  </a-col>
                </a-row>
                <a-row class="row-wapper">
                  <a-col
                    span="8"
                    style="display: flex; align-items: center; justify-content: center"
                  >
                    <span class="quality-tag"
                      >无缝图案
                      <a-tooltip
                        title="'--tile'参数,该参数生成的图像可用作重复磁贴，为织物、壁纸和纹理创建无缝图案"
                      >
                        <ExclamationCircleOutlined class="icon-hint" /> </a-tooltip
                    ></span>
                  </a-col>
                  <a-col
                    :span="16"
                    style="display: flex; align-items: center; justify-content: right"
                  >
                    <a-switch v-model:checked="versionParam.v51.tile" />
                  </a-col>
                </a-row>
              </a-tab-pane>
              <a-tab-pane key="v52" tab="V 5.2">
                <a-row style="justify-content: left">
                  <a-col span="24" class="style-radio">
                    <a-radio-group size="small" v-model:value="versionParam.v52.style">
                      <a-tooltip title="默认风格">
                        <a-radio-button value="">Default</a-radio-button>
                      </a-tooltip>
                      <a-tooltip title="原始风格，多实用于摄影，更写实的风格">
                        <a-radio-button value="raw">RAW</a-radio-button>
                      </a-tooltip>
                    </a-radio-group>
                  </a-col>
                </a-row>
                <a-row style="margin-top: 10px">
                  <a-col span="6">
                    <a-tooltip
                      title=" '--quality'或'--q'参数，更改生成图像所花费的时间。更高质量的设置需要更长的来处理和生成更多细节。较高的值还意味着每个作业使用的 GPU 分钟数更多。质量设置不会影响分辨率"
                    >
                      <a-tag class="quality-tag" color="default"
                        >质量 <ExclamationCircleOutlined class="icon-hint" /> </a-tag
                    ></a-tooltip>
                  </a-col>
                  <a-col span="18">
                    <a-select
                      v-model:value="versionParam.v52.quality"
                      style="width: 100%; height: 32px"
                    >
                      <a-select-option value="0.25">0.25x</a-select-option>
                      <a-select-option value="0.5">0.5x</a-select-option>
                      <a-select-option value="1">1x</a-select-option>
                    </a-select>
                  </a-col>
                </a-row>
                <a-row class="row-wapper">
                  <a-col
                    span="6"
                    style="display: flex; align-items: center; justify-content: start"
                  >
                    <span class="quality-tag"
                      >风格化

                      <a-tooltip
                        title="'--stylize 或者 --s, 这个值越低会更符合 prompt 的描述，数值越高艺术性就会越强，但跟 prompt 关联性就会比较弱"
                      >
                        <ExclamationCircleOutlined class="icon-hint" />
                      </a-tooltip>
                    </span>
                  </a-col>
                  <a-col :span="18">
                    <a-slider
                      style="margin-left: 3px"
                      v-model:value="versionParam.v52.s"
                      :min="1"
                      :step="1"
                      :max="1000"
                    />
                  </a-col>
                </a-row>
                <a-row class="row-wapper">
                  <a-col
                    span="6"
                    style="display: flex; align-items: center; justify-content: start"
                  >
                    <span class="quality-tag"
                      >多样性

                      <a-tooltip
                        title="'--chaos' 或者'--c' 参数, 会影响初始图像网格的变化程度。较高的值将产生更多不寻常和意外的结果和组合。值越低，结果越可靠、可重复"
                      >
                        <ExclamationCircleOutlined class="icon-hint" />
                      </a-tooltip>
                    </span>
                  </a-col>
                  <a-col :span="18">
                    <a-slider
                      style="margin-left: 3px"
                      v-model:value="versionParam.v52.chaos"
                      :min="1"
                      :step="1"
                      :max="100"
                    />
                  </a-col>
                </a-row>

                <a-row class="row-wapper">
                  <a-col
                    span="8"
                    style="display: flex; align-items: center; justify-content: center"
                  >
                    <span class="quality-tag"
                      >无缝图案
                      <a-tooltip
                        title="'--tile'参数,该参数生成的图像可用作重复磁贴，为织物、壁纸和纹理创建无缝图案"
                      >
                        <ExclamationCircleOutlined class="icon-hint" /> </a-tooltip
                    ></span>
                  </a-col>
                  <a-col
                    :span="16"
                    style="display: flex; align-items: center; justify-content: right"
                  >
                    <a-switch v-model:checked="versionParam.v52.tile" />
                  </a-col>
                </a-row>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-row>
      </a-card>
      <!-- 模型选择 E-->

      <!-- 不想出现的参数 B-->
      <a-card size="small" :bordered="true" :bodyStyle="{ padding: '5px' }" class="ar-card2">
        <template #title>
          <div class="ar-card2-title">
            <span style="font-weight: bold">反向关键词</span>
            <a-tooltip title="不想出现的关键词" trigger="click">
              <ExclamationCircleOutlined style="margin-left: 5px; cursor: pointer" />
            </a-tooltip>
          </div>
        </template>

        <a-row :gutter="2">
          <a-col span="24" class="ar-item">
            <a-textarea
              v-model:value="paramDataValue.no"
              placeholder="输入不行出现在图片中的内容，比如狗、树木、房子等等"
              auto-size
            />
          </a-col>
        </a-row>
      </a-card>
      <!-- 不想出现的参数 E-->

      <!-- 高级参数 B-->
      <a-collapse style="margin-top: 10px" class="ar-card2">
        <a-collapse-panel key="1">
          <template #header>
            <div class="ar-card2-title">
              <span style="font-weight: bold">高级参数</span>
              <a-tooltip title="其他一些参数" trigger="click">
                <ExclamationCircleOutlined style="margin-left: 5px; cursor: pointer" />
              </a-tooltip>
            </div>
          </template>
          <div>
            <a-row style="margin-top: 10px">
              <a-col span="6">
                <a-tooltip
                  title="Midjourney机器人使用种子数字来创建一个视觉噪声字段，如电视静态，作为生成初始图像网格的起点。每个图像随机生成种子数字，但可以使用--seed或--sameseed参数指定。使用相同的种子数字和提示将产生相似的结束图像。"
                >
                  <a-tag class="quality-tag tag-no-right-border" color="default">seed种子</a-tag>
                </a-tooltip>
              </a-col>
              <a-col span="18">
                <a-input-number
                  v-model:value="paramDataValue.seed"
                  style="width: 100%"
                  :min="0"
                  :max="4294967295"
                />
              </a-col>
            </a-row>

            <a-row :gutter="2" class="row-wapper">
              <a-col span="6" style="display: flex; align-items: center; justify-content: start">
                <span class="quality-tag"
                  >奇妙

                  <a-tooltip
                    title="'--weird'参数，使生成的图像引入奇特和离奇的特质，从而产生独特而意想不到的结果。v 4和niji 5不支持"
                  >
                    <ExclamationCircleOutlined class="icon-hint" />
                  </a-tooltip>
                </span>
              </a-col>
              <a-col :span="18">
                <a-slider
                  style="margin-left: 3px"
                  v-model:value="paramDataValue.weird"
                  :min="1"
                  :step="1"
                  :max="3000"
                  :disabled="activeKey === 'niji5' || activeKey === 'v4'"
                />
              </a-col>
            </a-row>
            <a-row :gutter="2" class="row-wapper">
              <a-col span="6" style="display: flex; align-items: center; justify-content: center">
                <span class="quality-tag"
                  >停止
                  <a-tooltip
                    title="'--stop'参数,使用可以在作业进行到对应的任务百分比时终止任务，比如50，在任务的50%进度时终止任务"
                  >
                    <ExclamationCircleOutlined class="icon-hint" />
                  </a-tooltip>
                </span>
              </a-col>
              <a-col :span="18">
                <a-slider
                  style="margin-left: 3px"
                  v-model:value="paramDataValue.stop"
                  :min="10"
                  :step="1"
                  :max="100"
                />
              </a-col>
            </a-row>

            <a-row :gutter="2" class="row-wapper">
              <a-col span="8" style="display: flex; align-items: center; justify-content: center">
                <span class="quality-tag"
                  >测试模型
                  <a-tooltip title="'--test参数'，多参数不支持，防止出错，先禁用了">
                    <ExclamationCircleOutlined class="icon-hint" /> </a-tooltip
                ></span>
              </a-col>
              <a-col :span="16" style="display: flex; align-items: center; justify-content: right">
                <a-switch disabled v-model:checked="paramDataValue.test" />
              </a-col>
            </a-row>
            <a-row :gutter="2" class="row-wapper">
              <a-col span="9" style="display: flex; align-items: center; justify-content: center">
                <span class="quality-tag"
                  >测试放大器
                  <a-tooltip
                    title="'--upbeta 参数'，测试版放大器。与--uplight参数 只能同时存在一个"
                  >
                    <ExclamationCircleOutlined class="icon-hint" /> </a-tooltip
                ></span>
              </a-col>
              <a-col :span="15" style="display: flex; align-items: center; justify-content: right">
                <a-switch
                  v-model:checked="paramDataValue.upbeta"
                  @change="
                    () => {
                      if (paramDataValue.upbeta) {
                        paramDataValue.uplight = false;
                      }
                    }
                  "
                />
              </a-col>
            </a-row>
            <a-row :gutter="2" class="row-wapper">
              <a-col span="9" style="display: flex; align-items: center; justify-content: center">
                <span class="quality-tag"
                  >轻量放大器
                  <a-tooltip title="--uplight 参数,轻量放大器。与 --upbeta 参数 只能同时存在一个">
                    <ExclamationCircleOutlined class="icon-hint" /> </a-tooltip
                ></span>
              </a-col>
              <a-col :span="15" style="display: flex; align-items: center; justify-content: right">
                <!-- <a-switch v-model:checked="paramDataValue.uplight" /> -->
                <a-switch
                  v-model:checked="paramDataValue.uplight"
                  @change="
                    () => {
                      if (paramDataValue.uplight) {
                        paramDataValue.upbeta = false;
                      }
                    }
                  "
                />
              </a-col>
            </a-row>
          </div>
        </a-collapse-panel>
      </a-collapse>
      <!-- 高级参数 E-->
    </div>

    <div>
      <a-button
        class="bottom-button"
        :loading="textFormLoading"
        ref="button"
        type="primary"
        @click="onSubmit"
        >提交绘画任务</a-button
      >
    </div>
    <Prompt
      :is-drawer-visible="isDrawerVisibleInC"
      @updateData="handleDataFromC"
      @closeDrawer="closeDrawerInC"
    />
    <!--翻译弹窗-->
    <div>
      <a-modal
        v-model:open="modelData.isOpenTranslate"
        title="内容翻译"
        width="90%"
        @cancel="cancelModal('translate')"
      >
        <template #footer>
          <a-button
            v-if="modelData.translateText"
            type="default"
            @click="usePrompt(modelData.translateText)"
            >应用Prompt</a-button
          >
          <a-button
            type="primary"
            @click="doTranslate(modelData.aiInputText, 'en')"
            :loading="modelData.promptSpinning"
            >汉->英翻译</a-button
          >
          <a-button
            @click="doTranslate(modelData.aiInputText, 'zh')"
            type="success"
            :loading="modelData.promptSpinning"
            >英->汉翻译</a-button
          >
        </template>
        <a-spin :spinning="modelData.promptSpinning">
          <a-row style="padding: 15px" justify="space-between">
            <a-col span="11">
              <a-card
                size="small"
                title="输入内容"
                :bordered="true"
                :bodyStyle="{ padding: '0px' }"
                class="ar-card2"
              >
                <a-textarea
                  v-model:value="modelData.aiInputText"
                  placeholder="请输入你要翻译的内容~"
                  allow-clear
                  :maxlength="2000"
                  :auto-size="{ minRows: 12, maxRows: 12 }"
                />
              </a-card>
            </a-col>
            <a-col span="2" style="display: flex; align-items: center; justify-content: center">
              <DoubleRightOutlined />
            </a-col>

            <a-col span="11">
              <a-card
                size="small"
                title="翻译结果（应用Prompt使用的文本）"
                :bordered="true"
                :bodyStyle="{ padding: '0px' }"
                class="ar-card2"
              >
                <a-textarea
                  v-model:value="modelData.translateText"
                  placeholder="这里是翻译成功后的结果哟~"
                  allow-clear
                  :maxlength="2000"
                  :auto-size="{ minRows: 12, maxRows: 12 }"
                />
              </a-card>
            </a-col>
          </a-row>
        </a-spin>
      </a-modal>
    </div>

    <!-- prompt弹窗-->
    <div>
      <a-modal
        v-model:open="modelData.isOpenAiPrompt"
        title="Chatgpt生成Prompt"
        :style="{ top: modelData.aiOutputText ? '50px' : '200px' }"
        :width="modelData.aiOutputText ? '70%' : ''"
        @cancel="cancelModal('aiPrompt')"
      >
        <template #footer>
          <a-button
            v-if="modelData.aiOutputText"
            type="default"
            @click="usePrompt(modelData.aiOutputText)"
            >应用Prompt</a-button
          >
          <a-button
            v-if="modelData.aiOutputText"
            type="default"
            @click="doTranslate(modelData.aiOutputText, 'zh')"
            :loading="modelData.promptSpinning"
            >翻译Prompt</a-button
          >
          <a-button type="primary" @click="genPrompt()" :loading="modelData.promptSpinning"
            >生成Prompt</a-button
          >
        </template>

        <a-spin :spinning="modelData.promptSpinning" :tip="modelData.tip">
          <a-row style="padding: 15px">
            <a-col span="24">
              <a-radio-group v-model:value="modelData.promptCategory" button-style="solid">
                <a-radio-button value="NIJI">二次元</a-radio-button>
                <a-radio-button value="MIDJOURNEY">摄影师</a-radio-button>
              </a-radio-group>
            </a-col>

            <a-col span="24" style="margin-top: 10px">
              <a-textarea
                style="width: 99%"
                v-model:value="modelData.aiInputText"
                placeholder="请输入你要生成的关键词~"
                allow-clear
                :maxlength="2000"
                :auto-size="{ minRows: 3, maxRows: 3 }"
              />
            </a-col>

            <a-col span="24">
              <a-card
                v-if="modelData.aiOutputText"
                size="small"
                title="生成的关键词"
                :bordered="true"
                :bodyStyle="{ padding: '0px' }"
                class="ar-card2"
              >
                <a-textarea
                  v-model:value="modelData.aiOutputText"
                  placeholder="请输入你要生成的关键词~"
                  allow-clear
                  :maxlength="2000"
                  :auto-size="{ minRows: 5, maxRows: 5 }"
                />
              </a-card>
            </a-col>
            <a-col span="24">
              <a-card
                v-if="modelData.aiOutputText"
                size="small"
                title="翻译"
                :bordered="true"
                :bodyStyle="{ padding: '0px' }"
                class="ar-card2"
              >
                <a-textarea
                  v-model:value="modelData.translateText"
                  placeholder="这里是你的翻译结果~"
                  allow-clear
                  :maxlength="2000"
                  :auto-size="{ minRows: 5, maxRows: 5 }"
                />
              </a-card>
            </a-col>
          </a-row>
        </a-spin>
      </a-modal>
    </div>

    <!-- 上传图片预览 -->
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </a-form>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted, computed, unref, watch, defineProps, toRefs } from 'vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { addDrawTask, aiPrompt, translate } from '/@/api/df/drawTask';
  import { genPromptList, genTagList } from '/@/api/df/dataCache';
  import {
    AddDrawTaskParams,
    DrawTaskToolsPromptListResp,
    ToolsPromptListResultModel,
  } from '/@/api/df/model/drawTaskModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import {
    ExclamationCircleOutlined,
    DoubleRightOutlined,
    PlusOutlined,
  } from '@ant-design/icons-vue';
  import Prompt from './Prompt.vue';
  import { ListQueryParams, ListResultModel, AccountListItem } from '/@/api/df/model/accountModel';
  import { availableList, getChannelsByGroup } from '/@/api/df/account';
  import { SvgIcon } from '/@/components/Icon';
  import type { UploadFile } from 'ant-design-vue/es/upload/interface';
  import { message, UploadProps, Upload } from 'ant-design-vue';
  import { useRoute } from 'vue-router';

  import { accountInfoApi } from './accountInfo';

  const {
    accountForm,
    initAccountList,
    initAccountInfo,
    doGetChannelsByGroup,
    handleAccountSetting,
    handleSetting,
  } = accountInfoApi();

  const route = useRoute();
  //初始化数据
  onMounted(async () => {
    //查询可用账户
    await initAccountList();
    //初始化偏好
    initAccountInfo();

    //查询最近使用的tag
    const resp = await genTagList({});
    const options = resp.map((item) => ({
      value: item,
      label: item,
    }));
    textToImgForm.tagNameOptions = options;
  });

  //初始化加载
  const props = defineProps({
    spaceId: {
      type: String,
      default: '',
    },
  });
  const { spaceId } = toRefs(props);

  /** prompt 页面数据传递 */
  const isDrawerVisibleInC = ref(false); // 控制 C 页面的 Drawer 是否打开
  const isOpenTranslate = ref(false);

  const modelData = reactive({
    isOpenTranslate: false,
    translateText: null,

    isOpenAiPrompt: false,
    promptSpinning: false,
    aiInputText: null,
    aiOutputText: null,
    promptCategory: 'NIJI',
    tip: '加载中...',
  });

  const openTranslate = () => {
    modelData.isOpenTranslate = true;
    modelData.aiInputText = textToImgForm.command;
  };
  const openAiPrompt = () => {
    modelData.isOpenAiPrompt = true;
  };
  const cancelModal = (name) => {
    if (name === 'aiPrompt') {
      modelData.aiInputText = null;
      modelData.aiOutputText = null;
      modelData.translateText = null;
      modelData.promptCategory = 'NIJI';
      modelData.promptSpinning = false;
    } else if (name === 'translate') {
      (modelData.translateText = null), (modelData.promptSpinning = false);
    }
  };

  const doTranslate = async (text, translateTo) => {
    modelData.promptSpinning = true;
    modelData.tip = '正在翻译中...';
    try {
      const response = await translate({ prompt: text, translateTo: translateTo });
      modelData.translateText = response;
      modelData.promptSpinning = false;
    } finally {
      modelData.promptSpinning = false;
    }
  };
  const genPrompt = async () => {
    modelData.promptSpinning = true;
    modelData.tip = '正在生成Prompt...';
    try {
      const response = await aiPrompt({
        prompt: modelData.aiInputText,
        promptCategory: modelData.promptCategory,
        translateTo: null,
      });
      console.log('--------------------');
      modelData.aiOutputText = response;
      modelData.translateText = null;
    } finally {
      modelData.promptSpinning = false;
    }
  };
  const usePrompt = (text) => {
    textToImgForm.command = text;
    if (modelData.promptCategory === 'NIJI') {
      activeKey.value = 'niji5';
      chooseVersion('niji5');
    } else {
      activeKey.value = 'v52';
      chooseVersion('v52');
    }
    modelData.aiOutputText = null;
    modelData.isOpenTranslate = false;
    modelData.translateText = null;
    modelData.isOpenAiPrompt = false;
  };

  const openDrawerInC = () => {
    isDrawerVisibleInC.value = true; // 打开 C 页面的 Drawer
  };

  const closeDrawerInC = () => {
    isDrawerVisibleInC.value = false; // 关闭 C 页面的 Drawer
  };
  const promptMap = ref<Record<string, DrawTaskToolsPromptListResp>>({});
  const handleDataFromC = (data) => {
    // 在这里处理从 C 页面传递过来的数据
    promptMap.value = data;
    console.log(data);
  };
  /** prompt 页面数据传递结束 */

  /** 页面高度计算开始 */
  const card = ref();
  const formRef = ref();
  //页面高度处理
  const button = ref(null);
  const substractSpaceRefs = ref([card]);
  const upwardSpace = computed(() => 0);
  const offsetHeightRef = ref(0);
  const subtractHeightRefs = ref([button]);

  // 使用hook
  const { contentHeight } = useContentHeight(
    computed(() => true),
    formRef,
    unref(subtractHeightRefs), // 使用 unref 获取数组值
    unref(substractSpaceRefs),
    upwardSpace,
    offsetHeightRef,
  );
  /** 页面高度计算结束 */
  const emit = defineEmits(['startLoading', 'endLoading']);

  const { createMessage } = useMessage();
  const textFormLoading = ref(false);
  const textToImgForm = reactive({
    command: null,
    commandEN: null,
    aiPrompt: null,
    robotSelect: '1022952195194359889',
    invokeTimes: 1,
    // useAccountId: null,
    // useChannelId: null,
    isPublic: false,
    // mode: 'relax',
    enableTranslate: false,
    tagName: '',
    tagNameOptions: [] as { value: string; label: string }[],
  });

  const onChangeLabel = (selectedOption) => {
    console.log(selectedOption);
    // 获取选中项的值，不包含 @ 符号
    textToImgForm.tagName = textToImgForm.tagName.replace(/@/g, '');
  };

  //统一控件处理
  const compRender = reactive({
    robotSelect: {
      size: 'middle',
      options: [
        { label: 'Midjourney', value: '936929561302675456' },
        { label: 'niji・journey', value: '1022952195194359889' },
        // { label: 'insightface', value: '936929561302675456' },
      ],
    },
  });

  const checkInteger = () => {
    console.log(textToImgForm.invokeTimes);
    textToImgForm.invokeTimes = textToImgForm.invokeTimes.replace(/[^0-9]/g, '');
  };

  const rules: Record<string, Rule[]> = {
    command: [{ required: true, message: '请输入绘图指令', trigger: 'blur' }],
  };

  //提交任务
  const onSubmit = () => {
    console.log(textToImgForm);
    if (
      textToImgForm.command === null ||
      textToImgForm.command === '' ||
      textToImgForm.command === undefined
    ) {
      message.error('请输入关键词~');
      return false;
    }

    formRef.value
      .validate()
      .then(async () => {
        const addTaskParam: AddDrawTaskParams = {
          spaceId: spaceId.value,
          refAccountId: accountForm.useAccountId,
          refChannelId: accountForm.channelId,
          channel: 'MJ',
          priority: 0,
          // refTaskId: null,
          privacyMode: textToImgForm.isPublic ? 'N' : 'Y',
          commandType: 'IMAGINE',
          invokeTimes: textToImgForm.invokeTimes,
          tagNames: textToImgForm.tagName,
          prompt: {
            base64Array: base64Images.value,
            paramsDataMap: paramDataValue.value,
            prompt: textToImgForm.command,
            commandType: 'IMAGINE',
            bootId: textToImgForm.robotSelect,
            paramsStr: concatenatedTags.value,
            mode: accountForm.mode,
            enableTranslate: textToImgForm.enableTranslate,
          },
        };

        textFormLoading.value = true;
        const key = 'submitTask';
        message.loading({ content: '正在提交任务...', key, duration: 0 });
        try {
          await addDrawTask(addTaskParam);
          message.success({ content: '任务提交成功!', key, duration: 2 });
          emit('startLoading');
        } catch (error) {
          console.log(error);
          message.error({ content: '任务提交失败!', key, duration: 2 });
        } finally {
          textFormLoading.value = false;
          // emit('endLoading');
        }
        // createMessage.success('任务已添加~~~');

        //待处理触发右侧列表刷新
        console.log(textToImgForm);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const componentDisabled = ref(false);
  const labelCol = { style: { width: '150px' } };
  const wrapperCol = { span: 24 };

  //==============================属性相关======================================//
  const paramDataValue = ref({
    ar: '1:1',
    style: null,
    quality: '1',
    chaos: null,
    s: 100,
    no: '',
    seed: null,
    iw: 1,
    weird: null,
    stop: 100,
    tile: false,
    test: false,
    upbeta: false,
    uplight: false,
    version: 'niji 5',
  });

  // AR 选项
  const selectedOption = ref<number | null>(null);
  const isEditing = ref(false);
  const options = ref([
    { id: 10, value: '1:1', X: 1, Y: 1, label: '应用头像', span: 6, color: 'default' },
    { id: 20, value: '1:2', X: 1, Y: 2, label: '手机壁纸', span: 6, color: 'default' },
    { id: 30, value: '16:9', X: 16, Y: 9, label: '电脑壁纸', span: 6, color: 'default' },
    { id: 40, value: '9:16', X: 9, Y: 16, label: '宣传海报', span: 6, color: 'default' },
    { id: 50, value: '4:3', X: 4, Y: 3, label: '文章配图', span: 6, color: 'default' },
    { id: 60, value: '3:4', X: 3, Y: 4, label: '媒体配图', span: 6, color: 'default' },
    { id: 70, value: '3:2', X: 3, Y: 2, label: '横版名片', span: 6, color: 'default' },
    { id: 80, value: '2:3', X: 2, Y: 3, label: '小红书图', span: 6, color: 'default' },
    { id: 90, value: '1:1', X: 1, Y: 1, label: '自定义值', span: 12, color: 'default' },
  ]);

  const onCustomerOption = (option) => {
    isEditing.value = false;
    selectedOption.value = option.id;
    console.log(selectedOption.value);
    option.value = option.X + ':' + option.Y;
    paramDataValue.value.ar = option.value;
    console.log(concatenatedTags.value);
  };

  const selectOption = (option) => {
    selectedOption.value = option.id;
    if (option.id === 90) {
      isEditing.value = true;
    } else {
      paramDataValue.value.ar = option.value;
    }
  };

  const paramTags = computed(() => {
    const paramTagsArray: { text: string; color: string }[] = [];
    const getColor = (tagText: string): string => {
      if (tagText.includes('::')) return 'pink';
      if (tagText.startsWith('--')) return 'default';
      return 'gray';
    };

    for (const [key, value] of Object.entries(promptMap.value)) {
      if (value !== null) {
        const text = `${value.prompt}::${value.value}`;
        paramTagsArray.push({ text, color: getColor(text) });
      }
    }

    for (const [key, value] of Object.entries(paramDataValue.value)) {
      if (value !== null && value !== false && value !== '') {
        let text;
        if (key === 'version') {
          text = `--${value}`;
        } else if (typeof value === 'boolean') {
          text = `--${key}`;
        } else {
          text = `--${key} ${value}`;
        }
        paramTagsArray.push({ text, color: getColor(text) });
      }
    }

    return paramTagsArray;
  });
  const concatenatedTags = computed(() => {
    return paramTags.value
      .map((tagObj) => {
        if (!tagObj.text.includes('--')) {
          return tagObj.text + ',';
        }
        return tagObj.text;
      })
      .join(' ');
  });
  //========================模型选择=========================
  const activeKey = ref('niji5');

  const versionParam = ref({
    niji5: {
      style: '',
      quality: '0.25',
      chaos: 0,
      s: 100,
      iw: 1,
      version: 'niji 5',
      tile: false,
    },
    v4: {
      style: null,
      quality: '0.25',
      chaos: 0,
      s: 100,
      version: 'v 4',
      iw: null,
      tile: null,
    },
    v5: {
      style: 'raw',
      quality: '0.25',
      chaos: 0,
      s: 100,
      version: 'v 5',
      iw: 1,
      tile: false,
    },
    v51: {
      style: 'raw',
      quality: '0.25',
      chaos: 0,
      s: 100,
      version: 'v 5.1',
      iw: 1,
      tile: false,
    },
    v52: {
      style: 'raw',
      quality: '0.25',
      chaos: 0,
      s: 100,
      iw: 1,
      version: 'v 5.2',
      tile: false,
    },
  });

  // Watch for changes in activeKey or versionParam
  watch(
    [activeKey, versionParam],
    () => {
      const versionData = versionParam.value[activeKey.value];
      if (versionData) {
        Object.assign(paramDataValue.value, versionData);
      }
    },
    { deep: true },
  );

  const chooseVersion = (activeKey) => {
    console.log('Current active tab key:', activeKey);
    console.log(paramDataValue.value);

    if (activeKey === 'niji5' || activeKey === 'v4') {
      paramDataValue.value.weird = null;
    }

    if (activeKey === 'niji5') {
      textToImgForm.robotSelect = '1022952195194359889';
    } else {
      textToImgForm.robotSelect = '936929561302675456';
    }
  };

  const onChangeIw = () => {
    if (paramDataValue.value.iw) {
      versionParam.value.niji5.iw = paramDataValue.value.iw;
      versionParam.value.v5.iw = paramDataValue.value.iw;
      versionParam.value.v51.iw = paramDataValue.value.iw;
      versionParam.value.v52.iw = paramDataValue.value.iw;
    }
  };

  //初始化数据
  onMounted(async () => {
    console.log(route.query.prompt);
    textToImgForm.command = route.query.prompt;
  });

  /** ************************************上传图片******************************* */

  const previewVisible = ref(false);
  const previewImage = ref('');
  const previewTitle = ref('');
  const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
  };
  const handlePreview = async (file: UploadProps['fileList'][number]) => {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj)) as string;
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
  };

  const fileList = ref([]);
  const base64Images = ref<{ base64Content: string; height: number; width: number; uid: string }[]>(
    [],
  );

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

  const beforeUpload = async (file: File) => {
    try {
      // 判断是否为图片
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        throw new Error('只能上传图片文件！');
      }
      // 获取图片文件的大小
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        throw new Error('图片大小不能超过5MB！');
      }

      const base64 = await getBase64(file);
      // 获取并存储图片的尺寸
      const dimensions = await getImageDimensions(base64);
      base64Images.value.push({
        base64Content: base64,
        height: dimensions.height,
        width: dimensions.width,
        uid: file.uid, // 存储文件的 uid
      });
    } catch (error) {
      console.error('Error converting to Base64:', error);
      // 弹出异常消息
      message.error(error.message);
      //移除这个文件
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleChange = async (info: { file: UploadFile; fileList: UploadFile[] }) => {
    console.log('handleChange'); // 日志输出
    if (info.file.status === 'removed') {
      // 文件被删除
      const remainingFiles = info.fileList.map((f) => f.uid);
      base64Images.value = base64Images.value.filter((img) => remainingFiles.includes(img.uid));
    }
  };
</script>
<style scoped>
  /* 媒体查询 */
  @media (min-width: 600px) {
    .fixed-bottom-button {
      right: 20px;
      width: auto;
    }
  }

  /* 滚动条轨道 */
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    background-color: transparent;
  }

  /* 滚动条滑块悬停状态 */
  ::-webkit-scrollbar-thumb:hover {
    background-color: transparent;
  }

  .description {
    /* 这里可以添加样式来改变操作说明的外观 */
  }

  .fixed-bottom-button {
    position: fixed;
    right: 5px;
    bottom: 0;
    width: 100%;
  }

  .ar-card2-title {
    display: flex;
    align-items: center;
    justify-content: flex-start; /* 使内容左对齐 */
  }

  .ar-card2 {
    margin-top: 5px;
  }

  .ar-card2 >>> .ant-card-head {
    display: flex;
  }

  .bottom-button {
    right: 8px;
    bottom: 0;
    width: 100%;

    /* background: #f0f0f0; */
    height: 53px;
  }

  .ar-item {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 62px;
    padding: 0.5px;
    text-align: center;
  }

  .ar-item-tag {
    width: 100%;
    max-width: 100%; /* 确保标签的最大宽度不超过其父元素 */
    margin-right: 0;
    padding: 7px;
    text-align: center;
    cursor: pointer;
  }

  .ar-item-inputs {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .ar-item-inputs-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .ar-item-inputs > input {
    width: 20px;
    padding: 1px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    text-align: center;
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

  .tag-no-right-border {
    border-right: none;
  }

  .tag-keep-right-border {
    border-top: none;
    border-bottom: none;
    border-left: none;
  }

  .style-radio {
    flex: none;
  }

  .input-group {
    display: flex;
    align-items: center;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
  }

  .input-label {
    padding: 0 11px;
    line-height: 32px;
  }

  .input-select {
    flex: 1;
    border: none;
  }

  .row-wapper {
    margin-top: 10px;
    border-radius: 4px;
  }

  .border-wapper {
    border-radius: 4px;
  }

  .icon-hint {
    margin-left: 5px;
    cursor: pointer;
  }

  ::v-deep .ant-collapse-content-box {
    padding: 5px;
  }

  .ant-collapse-content-box {
    padding: 5px !important;
  }

  .ant-collapse .ant-collapse-content >>> .ant-collapse-content-box {
    padding: 0;
  }

  .a-collapse-panel {
    padding: 0 !important;
  }

  ::v-deep .collapse-body >>> ant-collapse-content-box {
    padding: 5px;
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap; /* 允许标签在容器宽度超出时换行 */
    width: 100%; /* 可以根据需要调整 */
    padding: 2px;
  }

  .ant-upload-select-picture-card i {
    color: #999;
    font-size: 32px;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
