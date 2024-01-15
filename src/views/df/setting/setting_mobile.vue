<template>
  <a-layout ref="formRef">
    <div :style="{ height: contentHeight + 'px', width: '100%' }">
      <a-card
        :bodyStyle="{
          padding: '30px 1px 15px 24px',
          overflow: 'auto',
        }"
      >
        <a-row>
          <!-- 头像 -->
          <a-col>
            <SvgIcon
              v-if="userInfo.avatar && !userInfo.avatar.startsWith('http')"
              style="display: block; width: 90px; height: 90px; border-radius: 15%"
              :name="userInfo.avatar"
            />
            <a-image
              v-else
              :src="userInfo.avatar"
              style="display: block; width: 90px; height: 90px; border-radius: 15%"
            >
              }
            </a-image>
          </a-col>
          <!-- 名称信息 -->
          <a-col style="margin-left: 10px">
            <div>
              <span style="font-size: 18px; font-weight: bolder">{{ userInfo.nickName }} </span>
            </div>
            <div>
              <span>邮箱：{{ userInfo.email }} </span>
            </div>
            <div>
              <span>手机：{{ userInfo.phone }} </span>
            </div>
            <div>
              <span>CODE：{{ userInfo.accountCode }} </span>
              <a-button type="link" @click="copyText(userInfo.accountCode)">
                <template #icon><CopyOutlined /></template>
              </a-button>
            </div>
          </a-col>
        </a-row>
      </a-card>
      <!-- 配置选项卡 -->
      <a-row style="width: 100%; margin-top: 10px">
        <a-col :span="8" v-if="userInfo.phone === '未绑定手机号'">
          <a-card
            :bodyStyle="{ padding: '10px 22px' }"
            @click="handleShowModal('changePhone')"
            hoverable
          >
            <a-row>
              <a-col>
                <span>📱 绑定手机</span>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card
            :bodyStyle="{ padding: '10px 22px' }"
            hoverable
            @click="handleShowModal('changePassword')"
          >
            <a-row>
              <a-col>
                <span>🔐 变更密码</span>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card
            :bodyStyle="{ padding: '10px 22px' }"
            hoverable
            @click="handleShowModal('changeMail')"
          >
            <a-row>
              <a-col>
                <span>📧 变更邮箱</span>
              </a-col>
            </a-row>
          </a-card>
        </a-col>

        <a-col :span="8">
          <a-popconfirm
            title="前往查看商品市场？"
            ok-text="立即前往"
            cancel-text="取消"
            @confirm="goView('/goods/index')"
          >
            <a-card :bodyStyle="{ padding: '10px 22px 10px 22px' }" hoverable>
              <a-row>
                <a-col>
                  <span>🛒 商品市场</span>
                </a-col>
              </a-row>
            </a-card>
          </a-popconfirm>
        </a-col>
        <a-col :span="8">
          <a-popconfirm
            title="前往查看交易记录？"
            ok-text="立即前往"
            cancel-text="取消"
            @confirm="goView('/trade/index')"
          >
            <a-card :bodyStyle="{ padding: '10px 22px 10px 22px' }" hoverable>
              <a-row>
                <a-col>
                  <span>💵 交易记录</span>
                </a-col>
              </a-row>
            </a-card>
          </a-popconfirm>
        </a-col>
        <a-col :span="8">
          <a-popconfirm title="这块不是谁都能看的呦~" ok-text="暂无数据" cancel-text="取消">
            <a-card :bodyStyle="{ padding: '10px 22px 10px 22px' }" hoverable>
              <a-row>
                <a-col>
                  <span>💰 授权收益</span>
                </a-col>
              </a-row>
            </a-card>
          </a-popconfirm>
        </a-col>
      </a-row>
      <a-row style="width: 100%; margin-top: 10px">
        <!-- <a-col :span="24">
          <a-card :bodyStyle="{ padding: '10px 22px 10px 22px' }" hoverable>
            <a-row>
              <a-col>
                <span>🎨 个性化配置（下阶段开发）</span>
              </a-col>
            </a-row>
          </a-card>
        </a-col> -->
        <a-col :span="24" @click="openSuggestView">
          <a-card :bodyStyle="{ padding: '10px 22px 10px 22px' }" hoverable>
            <a-row>
              <a-col>
                <span><Icon icon="mdi:email-arrow-left-outline" /> 改进与建议</span>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :span="24" @click="openGroupView">
          <a-card :bodyStyle="{ padding: '10px 22px 10px 22px' }" hoverable>
            <a-row>
              <a-col>
                <span><Icon icon="icon-park-outline:wechat" /> 交流群</span>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :span="24" @click="openAfterSaleView" v-if="systemConfigForm.afterSaleInfo !== null">
          <a-card :bodyStyle="{ padding: '10px 22px 10px 22px' }" hoverable>
            <a-row>
              <a-col>
                <span><Icon icon="ri:customer-service-2-line" /> 售后服务</span>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :span="24" @click="openTutorialView" v-if="systemConfigForm.tutorialInfo !== null">
          <a-card :bodyStyle="{ padding: '10px 22px 10px 22px' }" hoverable>
            <a-row>
              <a-col>
                <span><Icon icon="gis:map-book" /> 知识库</span>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :span="24" @click="openInviteView">
          <a-card :bodyStyle="{ padding: '10px 22px 10px 22px' }" hoverable>
            <a-row>
              <a-col>
                <span><Icon icon="mingcute:celebrate-line" /> 限时活动 </span>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
      </a-row>
      <a-row style="width: 100%; margin-top: 10px">
        <a-col :span="24">
          <a-popconfirm
            title="是否退出系统？"
            ok-text="立即退出"
            cancel-text="取消"
            @confirm="doLogout()"
          >
            <a-card :bodyStyle="{ padding: '10px 22px 10px 22px' }" hoverable>
              <a-row>
                <a-col>
                  <span> 📴退出登录</span>
                </a-col>
              </a-row>
            </a-card>
          </a-popconfirm>
        </a-col>
      </a-row>
      <!-- 意见箱 -->
      <a-modal
        v-model:open="suggestForm.viewFlag"
        title="📝建议与改进"
        width="100%"
        wrap-class-name="full-modal"
        :bodyStyle="{ padding: '0 10px 30px 10px' }"
      >
        <template #footer>
          <a-button key="back" @click="doAddSuggest">提交建议</a-button>
        </template>
        <a-row style="margin-top: 30px">
          <a-col :span="24">
            <a-input
              :maxlength="64"
              show-count
              v-model:value="suggestForm.title"
              placeholder="这里填写你的标题~~~"
            />
          </a-col>
        </a-row>

        <a-row style="margin-top: 30px">
          <a-col :span="24">
            <a-textarea
              v-model:value="suggestForm.content"
              placeholder="这里填写你的具体内容~~~"
              :auto-size="{ minRows: 10, maxRows: 20 }"
              show-count
              :maxlength="1024"
            />
          </a-col>
        </a-row>
        <a-row style="margin-top: 30px">
          <a-col :span="24">
            📢
            <span style="font-size: 12px"
              >感谢您提交的反馈！同类型的反馈我们会按照时间进行排序，确认无误后，我们会给您一些“授权码”。届时请注意查收邮件~~~
            </span>
          </a-col>
        </a-row>
        <Loading :loading="loading" absolute="true" tip="正在加载中~" />
      </a-modal>

      <!-- 通用MD信息 -->
      <a-modal v-model:open="systemConfigViewForm.viewFlag">
        <template #title>
          <Icon icon="streamline-emojis:bell" />
          <span> {{ systemConfigViewForm.title }}</span>
        </template>

        <template #footer>
          <a-button
            key="submit"
            type="primary"
            @click="closeView"
            :loading="systemConfigViewForm.loading"
            >已知悉</a-button
          >
        </template>
        <a-spin :spinning="systemConfigViewForm.loading">
          <div style="padding: 10px 20px">
            <MarkdownViewer :value="systemConfigViewForm.content" />
          </div>
        </a-spin>
      </a-modal>

      <!-- 邀新 -->
      <a-modal
        v-model:open="inviteForm.viewFlag"
        title="🛎活动合集~"
        :bodyStyle="{ padding: '20px 10px 10px 10px' }"
      >
        <template #footer>
          <a-button key="back" @click="closeInviteView">马上就去</a-button>
        </template>
        <a-row>
          <a-col :span="24">
            ⚓
            <span style="font-size: 12px">这是你的专属链接 </span>
          </a-col>
          <a-col :span="24">
            <a-input-group compact :bordered="false" style="width: 100%">
              <a-input
                v-model:value="inviteForm.ownerLink"
                style="width: calc(100% - 40px)"
                disabled
              />
              <a-tooltip trigger="hover" title="复制我的专属链接~">
                <a-button @click="copyText(inviteForm.ownerLink)" style="width: 40px">
                  <template #icon><CopyOutlined /></template>
                </a-button>
              </a-tooltip>
            </a-input-group>
          </a-col>
        </a-row>
        <a-divider dashed :style="{ margin: '10px 0' }" />
        <a-row :gutter="[1, 6]">
          <MarkdownViewer :value="systemConfigForm.activityNotice" />
        </a-row>
      </a-modal>

      <!-- 邮箱模态窗 -->
      <a-modal
        title="更改绑定邮箱"
        v-model:open="viewAgg.emailShow"
        @ok="handleEmailSubmit"
        :confirm-loading="loading"
        ok-text="确认更改邮箱"
        :bodyStyle="{ padding: '0 ' }"
      >
        <a-card>
          <a-form layout="vertical" :model="formData" :rules="getEmailRules" ref="emailFormRef">
            <a-row gutter="24">
              <a-col :span="24">
                <a-form-item label="新邮箱" name="newEmail">
                  <a-input v-model:value="formData.newEmail" placeholder="请输入您的新邮箱" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row gutter="24">
              <a-col :span="24">
                <a-form-item label="当前邮箱验证码" name="code">
                  <CountdownInput
                    v-model:value="formData.code"
                    :sendCodeApi="sendPhoneCode"
                    placeholder="请输当前邮箱验证码"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </a-modal>

      <!-- 手机号模态窗 -->
      <a-modal
        title="绑定手机号"
        v-model:open="viewAgg.phoneShow"
        @ok="handlePhoneSubmit"
        :confirm-loading="loading"
        ok-text="立即保存"
        :bodyStyle="{ padding: '0 ' }"
      >
        <a-card>
          <a-form layout="vertical" :model="formData" :rules="getPhoneRules" ref="phoneFormRef">
            <a-row gutter="24">
              <a-col :span="24">
                <a-form-item label="新手机号" name="phone">
                  <a-input v-model:value="formData.phone" placeholder="请输入您的新手机号" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row gutter="24">
              <a-col :span="24">
                <a-form-item label="验证码" name="code">
                  <CountdownInput
                    v-model:value="formData.code"
                    :sendCodeApi="sendPhoneCode"
                    placeholder="请输入验证码"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </a-modal>

      <!-- 修改头像 -->
      <a-modal
        title="修改头像"
        v-model:open="headerForm.viewFlag"
        @ok="saveUserIcon"
        :confirm-loading="headerForm.loading"
        ok-text="立即修改"
      >
        <a-card>
          <a-form layout="vertical">
            <a-form-item label="自定义头像">
              <a-switch
                v-model:checked="headerForm.enableCustomer"
                checked-children="开启"
                un-checked-children="关闭"
                @change="changeEnable"
              />
              <span style="margin-left: 10px; color: red; font-size: 10px"
                >更新头像后，请主动刷新下页面。</span
              >
            </a-form-item>
            <div v-if="headerForm.enableCustomer">
              <a-form-item label="">
                <span style="display: flex; justify-content: center; font-size: 12px">
                  <a-space>
                    <a href="https://image.dooo.ng/upload" target="_blank">免费图床1</a>
                    <a href="https://tuchuang.wvv.free.hr/" target="_blank">免费图床2</a>
                    <a href="https://png.cm/" target="_blank">免费图床3</a>
                    <a href="https://img.ax/" target="_blank">免费图床4</a>
                    <a href="https://www.locimg.com/" target="_blank">免费图床5</a>
                  </a-space>
                </span>
              </a-form-item>
              <a-form-item label="头像链接" name="iconUrl">
                <a-input v-model:value="headerForm.iconUrl" placeholder="请输入您的头像链接" />
              </a-form-item>
            </div>
            <a-form-item label="默认可选头像" v-else>
              <div class="flex justify-around flex-wrap">
                <div
                  v-for="item in headerForm.example"
                  :key="item"
                  @click="selectIcon(item)"
                  :class="{ 'choose-svg': headerForm.iconUrl === item }"
                >
                  <SvgIcon :name="item" size="32" />
                </div>
              </div>
            </a-form-item>
          </a-form>
        </a-card>
      </a-modal>

      <!-- 密码模态窗 -->
      <a-modal
        title="更改密码"
        v-model:open="viewAgg.passwordShow"
        @ok="handlePasswordSubmit"
        :confirm-loading="loading"
        ok-text="确认更改密码"
        :bodyStyle="{ padding: '0 ' }"
      >
        <a-card>
          <a-form
            layout="vertical"
            :model="formData"
            :rules="getPasswordRules"
            ref="passwordFormRef"
          >
            <a-row gutter="24">
              <a-col :span="24">
                <a-form-item label="旧密码" name="password">
                  <a-input-password v-model:value="formData.password" placeholder="请输入旧密码" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row gutter="24">
              <a-col :span="24">
                <a-form-item label="新密码" name="newPassword">
                  <a-input-password
                    v-model:value="formData.newPassword"
                    placeholder="请输入新密码"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row gutter="24">
              <a-col :span="24">
                <a-form-item label="确认新密码" name="confirmPassword">
                  <a-input-password
                    v-model:value="formData.confirmPassword"
                    placeholder="请再次输入新密码"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </a-modal>
    </div>
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, reactive, computed, unref } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useGo } from '/@/hooks/web/usePage';
  import { Loading } from '/@/components/Loading';
  import { addSuggest, communicateInfo, sendCode } from '/@/api/df/utils';
  import { changePassword, resetPhone, resetEmail } from '/@/api/df/setting';

  import { CopyOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import Icon from '/@/components/Icon/Icon.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { VerifyCodeParams } from '/@/api/df/model/UtilModel';
  import { CountdownInput } from '/@/components/CountDown';
  import type { Rule } from 'ant-design-vue/es/form';
  import { copyText as doCopyText } from '/@/utils/copyTextToClipboard';
  import { SystemConfig } from '/@/api/df/model/systemModel';
  import { systemConfigInfo } from '/@/api/df/system';
  import { MarkdownViewer } from '/@/components/Markdown';
  import { changeUserIcon } from '/@/api/df/user';
  import { SvgIcon } from '/@/components/Icon/index';
  import useClipboard from 'vue-clipboard3';

  const { toClipboard } = useClipboard();

  /** 页面高度计算开始 */
  const formRef = ref();
  //页面高度处理
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 1);
  //移动设备底部导航栏
  const offsetHeightRef = ref(44);
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
  const go = useGo();
  const loading = ref(false);
  const userStore = useUserStore();
  const userInfo = ref(userStore.getUserInfo); // 直接赋值

  const goView = async (routePath) => {
    go(routePath);
  };
  const doLogout = async () => {
    userStore.logout();
    goView('/login');
  };

  /****************************** 建议相关 ******************************** */
  const suggestForm = ref({
    viewFlag: false,
    title: '',
    content: '',
  });

  const openSuggestView = async () => {
    suggestForm.value.viewFlag = true;
  };
  const doAddSuggest = async () => {
    loading.value = true;
    //提交建议
    try {
      await addSuggest(suggestForm.value);
      message.success('提交成功！');
    } finally {
      suggestForm.value.viewFlag = false;
      loading.value = false;
    }
  };

  /****************************** 交流群 && 教程 && 公告 && 活动 && 售后 ******************************** */

  const systemConfigForm: SystemConfig = ref({
    groupInfo: '',
    afterSaleInfo: '',
    tutorialInfo: '',
    systemNotice: '',
    activityNotice: '',
  });

  const systemConfigViewForm = ref({
    viewFlag: false,
    content: '',
    title: '',
    loading: false,
  });

  onMounted(async () => {
    const data = await systemConfigInfo({});
    systemConfigForm.value = data;
  });

  const openGroupView = async () => {
    systemConfigViewForm.value.title = '交流群信息';
    systemConfigViewForm.value.content = systemConfigForm.value.groupInfo;
    systemConfigViewForm.value.viewFlag = true;
  };
  const openAfterSaleView = async () => {
    systemConfigViewForm.value.title = '售后客服';
    systemConfigViewForm.value.content = systemConfigForm.value.afterSaleInfo;
    systemConfigViewForm.value.viewFlag = true;
  };
  const openTutorialView = async () => {
    systemConfigViewForm.value.title = 'AI知识库';
    systemConfigViewForm.value.content = systemConfigForm.value.tutorialInfo;
    systemConfigViewForm.value.viewFlag = true;
  };
  const openSystemNoticeView = async () => {
    console.log(1111);
    systemConfigViewForm.value.title = '系统公告信息';
    systemConfigViewForm.value.content = systemConfigForm.value.systemNotice;
    systemConfigViewForm.value.viewFlag = true;
  };
  const openActivityNoticeView = async () => {
    systemConfigViewForm.value.title = '活动公告';
    systemConfigViewForm.value.content = systemConfigForm.value.activityNotice;
    systemConfigViewForm.value.viewFlag = true;
  };
  const closeView = async () => {
    systemConfigViewForm.value.title = '';
    systemConfigViewForm.value.content = '';
    systemConfigViewForm.value.viewFlag = false;
  };

  const headerForm = ref({
    loading: false,
    viewFlag: false,
    iconUrl: null,
    enableCustomer: false,
    example: [
      'dynamic-avatar-1',
      'dynamic-avatar-2',
      'dynamic-avatar-3',
      'dynamic-avatar-4',
      'dynamic-avatar-5',
      'dynamic-avatar-6',
      'dynamic-avatar-7',
      'dynamic-avatar-8',
    ],
  });
  const openIconView = async () => {
    headerForm.value.viewFlag = true;
  };

  const selectIcon = (value) => {
    headerForm.value.iconUrl = value;
  };
  const changeEnable = () => {
    headerForm.value.iconUrl = null;
  };

  const saveUserIcon = async () => {
    console.log(111);
    headerForm.value.loading = true;
    try {
      await changeUserIcon({ iconUrl: headerForm.value.iconUrl });
      headerForm.value.viewFlag = false;
    } finally {
      headerForm.value.loading = false;
    }
  };

  /****************************** 账号密码邮箱手机号设置 ******************************** */
  const viewAgg = ref({
    loading: false,
    phoneShow: false,
    emailShow: false,
    passwordShow: false,
  });

  const handleShowModal = (type: string) => {
    viewAgg.value.phoneShow = type === 'changePhone';
    viewAgg.value.emailShow = type === 'changeMail';
    viewAgg.value.passwordShow = type === 'changePassword';
  };
  const formData = reactive({
    phone: '',
    code: '',
    newEmail: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
  const emailFormRef = ref(null);
  const phoneFormRef = ref(null);
  const passwordFormRef = ref(null);
  const { createMessage } = useMessage();
  const getEmailRules: Record<string, Rule[]> = {
    newEmail: [
      { required: true, message: '新邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
    ],
    code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
  };

  const getPhoneRules: Record<string, Rule[]> = {
    phone: [
      { required: true, message: '手机号不能为空', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
    ],
    code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
  };

  const getPasswordRules: Record<string, Rule[]> = {
    password: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
    newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
    confirmPassword: [
      { required: true, message: '确认密码不能为空', trigger: 'blur' },
      {
        validator: (_: any, value: string) => {
          if (value !== formData.newPassword) {
            return Promise.reject('两次输入的密码不一致');
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
  };
  // 定义三个表单的提交处理函数
  const handleEmailSubmit = async () => {
    (emailFormRef.value as any).validate((valid) => {
      if (valid) {
        // 调用邮箱更新的API
        resetEmail(formData);
        createMessage.success('邮箱已切换成功！,请去新邮箱激活账号');
      } else {
        console.error('Email form validation failed!');
      }
    });
  };

  const handlePhoneSubmit = () => {
    (phoneFormRef.value as any)
      .validate()
      .then(async () => {
        await resetPhone(formData);
        createMessage.success('手机号绑定成功！');
        viewAgg.value.phoneShow = false;
        //待处理触发右侧列表刷新
        userInfo.value.phone = formData.phone;
      })
      .catch((error) => {
        console.log('error', error);
      });

    // (phoneFormRef.value as any).validate((valid) => {
    //   if (valid) {
    //     // 调用手机号更新的API
    //   } else {
    //     console.error('Phone form validation failed!');
    //   }
    // });
  };

  const handlePasswordSubmit = () => {
    (passwordFormRef.value as any)
      .validate()
      .then(async () => {
        // 成功的处理逻辑
        console.log(1111);
        await changePassword(formData);

        createMessage.success('密码修改成功！');
      })
      .catch(() => {
        console.error('Password form validation failed!');
      });
  };

  async function sendPhoneCode(): Promise<boolean> {
    const codeParams: VerifyCodeParams = {
      verifyType: viewAgg.value.emailShow ? 'E' : 'P',
      scene: 'rebind',
      toSend: viewAgg.value.emailShow ? formData.newEmail : formData.phone,
    };
    const response = await sendCode(codeParams);
    console.log('sendCode ' + response);
    return true;
  }

  /****************************** 邀新有礼 ******************************** */
  const inviteForm = ref({
    viewFlag: false,
    ownerLink: '',
  });

  const openInviteView = async () => {
    inviteForm.value.viewFlag = true;
    const currentDomain = window.location.origin;

    inviteForm.value.ownerLink =
      currentDomain + '/#/login?inviteCode=' + userInfo.value.accountCode;
  };

  const closeInviteView = async () => {
    inviteForm.value.viewFlag = false;
  };

  const copyText = async (text) => {
    try {
      await toClipboard(text);
      message.success('复制成功');
    } catch (e) {
      message.error('复制失败!' + e.message);
    }

    // const value = unref(text);
    // if (!value) {
    //   message.warning('请输入要拷贝的内容！');
    //   return;
    // }
    // doCopyText(value);
  };
</script>
<style lang="less">
  .account-setting {
    margin: 12px;
    background-color: @component-background;

    .base-title {
      padding-left: 0;
    }

    .ant-tabs-tab-active {
      background-color: @item-active-bg;
    }
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
    }

    .ant-modal-body {
      flex: 1;
    }
  }
</style>
