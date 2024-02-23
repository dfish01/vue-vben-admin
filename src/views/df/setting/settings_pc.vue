<template>
  <a-layout ref="fromRef">
    <a-card
      :style="{ height: `calc(100vh - 49px)`, overflow: 'auto' }"
      :bodyStyle="{ padding: '20px', display: 'flex', 'justify-content': 'center' }"
    >
      <div style="width: 80%">
        <!-- 头像 -->
        <a-card
          :bodyStyle="{
            padding: '30px 1px 30px 24px',
            height: `calc(${contentHeight}px `,
            overflow: 'auto',
          }"
        >
          <a-row>
            <!-- 头像 -->
            <a-col>
              <SvgIcon
                v-if="userInfo.avatar && !userInfo.avatar.startsWith('http')"
                style="display: block; width: 100px; height: 100px; border-radius: 15%"
                :name="userInfo.avatar"
              />

              <a-image
                v-else
                :src="userInfo.avatar"
                style="display: block; width: 100px; height: 100px; border-radius: 15%"
              >
                }
              </a-image>
            </a-col>
            <!-- 名称信息 -->
            <a-col style="margin-left: 15px">
              <div>
                <span style="font-size: 22px; font-weight: bolder">{{ userInfo.nickName }} </span>
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
        <a-card :bodyStyle="{ padding: 0 }" style="margin-top: 25px">
          <!-- 设置-选项卡 -->
          <div class="setting">
            <div v-for="appData in appObj.setting" :key="appData.key" class="cards">
              <a-card
                v-if="appData.showFlag && appData.showFlag === true"
                @click="handleClick(appData)"
                class="rounded-card"
                :bodyStyle="{
                  padding: 0,
                  height: '155px',
                  width: '155px',
                  display: 'flex',
                  'align-items': 'center',
                  'justify-content': 'center',
                }"
                hoverable
              >
                <div
                  :span="24"
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <span>
                    <Icon :icon="appData.svgName" size="70" />
                  </span>
                  <div>
                    <span> {{ appData.name }} </span>
                  </div>
                </div>
              </a-card>
            </div>
          </div>
          <!-- 设置-交流 -->
          <div class="setting">
            <div v-for="appData in appObj.chat" :key="appData.key" class="cards">
              <a-card
                @click="handleClick(appData)"
                class="rounded-card"
                :bodyStyle="{
                  padding: 0,
                  height: '155px',
                  width: '155px',
                  display: 'flex',
                  'align-items': 'center',
                  'justify-content': 'center',
                }"
                hoverable
              >
                <div
                  :span="24"
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <span>
                    <Icon :icon="appData.svgName" size="70" />
                  </span>
                  <div>
                    <span> {{ appData.name }} </span>
                  </div>
                </div>
              </a-card>
            </div>
          </div>
          <!-- 设置-交易 -->
          <div class="setting">
            <div v-for="appData in appObj.trade" :key="appData.key" class="cards">
              <a-card
                class="rounded-card"
                @click="handleClick(appData)"
                :bodyStyle="{
                  padding: 0,
                  height: '155px',
                  width: '155px',
                  display: 'flex',
                  'align-items': 'center',
                  'justify-content': 'center',
                }"
                :hoverable="appData.hover"
              >
                <div
                  :span="24"
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <span>
                    <Icon :icon="appData.svgName" size="70" :color="appData.color" />
                  </span>
                  <div>
                    <span> {{ appData.name }} </span>
                  </div>
                </div>
              </a-card>
            </div>
          </div>
        </a-card>
      </div>
    </a-card>
    <!-- 意见箱 -->
    <a-modal
      v-model:open="suggestForm.viewFlag"
      title="📝建议与改进"
      :bodyStyle="{ padding: '0 10px 30px 10px' }"
      style="top: 25px"
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
      <!-- <a-row style="margin-top: 30px">
        <a-col :span="24">
          📢
          <span style="font-size: 12px"
            >感谢您提交的反馈！同类型的反馈我们会按照时间进行排序，确认无误后，我们会给您一些“授权码”。届时请注意查收邮件~~~
          </span>
        </a-col>
      </a-row> -->
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
    >
      <a-card>
        <a-form layout="vertical" :model="formData" :rules="getPhoneRules" ref="phoneFormRef">
          <a-row gutter="24">
            <a-col :span="24">
              <a-form-item label="手机号" name="phone">
                <a-input v-model:value="formData.phone" placeholder="请输入您的手机号" />
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
    >
      <a-card>
        <a-form layout="vertical" :model="formData" :rules="getPasswordRules" ref="passwordFormRef">
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
                <a-input-password v-model:value="formData.newPassword" placeholder="请输入新密码" />
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
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, reactive, computed, unref } from 'vue';
  import { changePassword, resetPhone, resetEmail } from '/@/api/df/setting';
  import { useUserStore } from '/@/store/modules/user';
  import { useGo } from '/@/hooks/web/usePage';
  import { Loading } from '/@/components/Loading';
  import { addSuggest, communicateInfo, sendCode } from '/@/api/df/utils';
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

  /** 页面高度计算开始 */
  const formRef = ref();
  //页面高度处理
  const substractSpaceRefs = ref([]);
  const upwardSpace = computed(() => 1);
  //移动设备底部导航栏
  const offsetHeightRef = ref(46);
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

  /****************************** 建议相关 ******************************** */
  const suggestForm = ref({
    viewFlag: false,
    title: '',
    content: '',
    defaultIcons: [{}],
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
        try {
          resetEmail(formData);
          createMessage.success('邮箱已切换成功！,请去新邮箱激活账号');
        } finally {
          loading.value = false;
        }
      } else {
        console.error('Email form validation failed!');
      }
    });
  };

  const handlePhoneSubmit = () => {
    (phoneFormRef.value as any)
      .validate()
      .then(async () => {
        loading.value = true;
        try {
          await resetPhone(formData);
          createMessage.success('手机号绑定成功！');
          viewAgg.value.phoneShow = false;
          //待处理触发右侧列表刷新
          userInfo.value.phone = formData.phone;
        } finally {
          loading.value = false;
        }
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
        try {
          await changePassword(formData);

          createMessage.success('密码修改成功！');
        } finally {
          loading.value = false;
        }
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
    const value = unref(text);
    if (!value) {
      message.warning('请输入要拷贝的内容！');
      return;
    }
    doCopyText(value);
  };

  /****************************** 列表渲染 ******************************** */

  interface AppInfo {
    name: string;
    key: string;
    svgName: string;
    routeUrl: string;
    type: string;
  }

  const handleClick = (appInfo) => {
    console.log(1111);
    if (appInfo.type === 'route') {
      goView(appInfo.routeUrl);
      return;
    } else if (appInfo.type === 'model') {
      handleShowModal(appInfo.key);
      return;
    } else if (appInfo.type === 'func') {
      const funcReference = appInfo.func;

      // 调用函数
      funcReference(); // 直接调用函数
      return;
    }
  };

  const openNewWindow = () => {
    window.open('https://www.midjourneyers.com', '_blank');
  };

  const appObj = ref<any>({
    setting: [
      {
        name: '绑定手机号',
        key: 'changePhone',
        svgName: 'gridicons:phone',
        routeUrl: '',
        type: 'model',
        showFlag: userInfo.value.phone === '未绑定手机号',
      },
      {
        name: '修改密码',
        key: 'changePassword',
        svgName: 'mdi:password',
        routeUrl: '',
        type: 'model',
        showFlag: true,
      },
      {
        name: '修改邮箱',
        key: 'changeMail',
        svgName: 'icon-park-solid:email-lock',
        routeUrl: '',
        type: 'model',
        showFlag: true,
      },
      {
        name: '替换头像',
        key: 'userIcon',
        svgName: 'solar:user-circle-outline',
        routeUrl: '',
        type: 'func',
        showFlag: true,
        func: openIconView,
      },
    ],
    chat: [
      {
        name: '限时活动',
        key: 'activityNotice',
        svgName: 'material-symbols:notifications-active-outline-sharp',
        routeUrl: '',
        type: 'func',
        showFlag: systemConfigForm.value.activityNotice !== null,
        func: openInviteView,
      },
      {
        name: '交流群',
        key: 'groupInfo',
        svgName: 'icon-park-outline:wechat',
        routeUrl: '',
        type: 'func',
        showFlag: systemConfigForm.value.groupInfo !== null,
        func: openGroupView,
      },
      {
        name: '知识库',
        key: 'chat',
        svgName: 'gis:map-book',
        routeUrl: '',
        type: 'func',
        showFlag: systemConfigForm.value.tutorialInfo !== null,
        func: openNewWindow,
      },
      {
        name: '售后服务',
        key: 'afterSaleInfo',
        svgName: 'ri:customer-service-2-line',
        routeUrl: '',
        type: 'func',
        showFlag: systemConfigForm.value.afterSaleInfo !== null,
        func: openAfterSaleView,
      },
      {
        name: '改进建议',
        key: 'suggest',
        svgName: 'icon-park-outline:bug',
        routeUrl: '',
        type: 'func',
        func: openSuggestView,
        showFlag: true,
      },
      {
        name: '系统公告',
        key: 'systemNotice',
        svgName: 'pepicons-pop:bulletin-notice',
        routeUrl: '',
        type: 'func',
        func: openSystemNoticeView,
        showFlag: systemConfigForm.value.systemNotice !== null,
      },
    ],
    trade: [
      {
        name: '账户余额',
        key: 'activity',
        svgName: 'icon-park-outline:trademark',
        routeUrl: '/wallet/index',
        type: 'route',
        hover: true,
        color: '',
        showFlag: false,
      },
      {
        name: '订单中心',
        key: 'activity',
        svgName: 'icon-park-outline:order',
        routeUrl: '/trade/index',
        type: 'route',
        hover: true,
        color: '',
        showFlag: false,
      },
      {
        name: '邀请中心',
        key: 'invite',
        svgName: 'mdi:invite',
        routeUrl: '/invite/index',
        type: 'route',
        hover: true,
        color: 'red',
        showFlag: false,
      },
    ],
  });
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

  .rounded-card {
    margin: 5px;
    border-radius: 10px;
  }

  .setting {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    padding: 5px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .choose-svg {
    /* 添加其他样式，如 padding、margin 或者其他样式 */

    /* 改变边框为蓝色 */
    border: 1px solid blue;
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
