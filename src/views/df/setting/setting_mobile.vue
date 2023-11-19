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
            <a-image
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
        <a-col :span="8">
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
        <a-col :span="24">
          <a-card :bodyStyle="{ padding: '10px 22px 10px 22px' }" hoverable>
            <a-row>
              <a-col>
                <span>🎨 个性化配置（下阶段开发）</span>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :span="24" @click="openSuggestView">
          <a-card :bodyStyle="{ padding: '10px 22px 10px 22px' }" hoverable>
            <a-row>
              <a-col>
                <span>💌 改进与建议</span>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :span="24" @click="openCommunicateView">
          <a-card :bodyStyle="{ padding: '10px 22px 10px 22px' }" hoverable>
            <a-row>
              <a-col>
                <span>🐵 交流共享</span>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :span="24" @click="openInviteView">
          <a-card :bodyStyle="{ padding: '10px 22px 10px 22px' }" hoverable>
            <a-row>
              <a-col>
                <span>🎉 限时活动 🎉</span>
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
        v-model:visible="suggestForm.viewFlag"
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

      <!-- 交流群 -->
      <a-modal
        v-model:visible="communicateForm.viewFlag"
        title="🐵扫码进群吧~"
        width="100%"
        :bodyStyle="{ padding: '0' }"
      >
        <template #footer>
          <a-button key="back" @click="closeCommunicateView">我已知晓</a-button>
        </template>
        <a-row>
          <a-col :span="24" style="display: flex; justify-content: center">
            <img
              :src="communicateForm.wchatImage"
              @onload="handleImageLoad()"
              width="300"
              alt="微信二维码"
            />
          </a-col>
        </a-row>
      </a-modal>

      <!-- 邀新 -->
      <a-modal
        v-model:visible="inviteForm.viewFlag"
        title="🛎活动合集~"
        width="100%"
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
          <a-col :span="24">
            📢 体验活动：
            <span style="font-size: 12px">注册后注意下邮箱，有体验礼包哦~</span>
          </a-col>
          <a-col :span="24">
            📢 邀新活动1：
            <span style="font-size: 12px">每邀请1个好友注册并绑定手机号可叠加6次作图~</span>
          </a-col>
          <a-col :span="24">
            📢 邀新活动2：
            <span style="font-size: 12px">邀请6个好友注册并绑定手机号即可免费使用一天呦~</span>
          </a-col>
          <a-col :span="24">
            📢 入驻活动：
            <span style="font-size: 12px">账号提供商可找管理私聊哈~</span>
          </a-col>
          <a-col :span="24">
            📢 更多活动：
            <span style="font-size: 12px">入群找管理私聊哈，可能聊聊就有了~ </span>
          </a-col>
        </a-row>
      </a-modal>

      <!-- 邮箱模态窗 -->
      <a-modal
        title="更改绑定邮箱"
        v-model:visible="viewAgg.emailShow"
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
        title="更改绑定手机号"
        v-model:visible="viewAgg.phoneShow"
        @ok="handlePhoneSubmit"
        :confirm-loading="loading"
        ok-text="确认更改手机号"
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

      <!-- 密码模态窗 -->
      <a-modal
        title="更改密码"
        v-model:visible="viewAgg.passwordShow"
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

  /****************************** 交流群 ******************************** */

  const communicateForm = ref({
    viewFlag: false,
    wchatImage: '',
    qqGroupList: [] as string[],
  });

  const openCommunicateView = async () => {
    loading.value = true;
    try {
      const resp = await communicateInfo({});
      communicateForm.value.qqGroupList = resp.qqGroupList;
      communicateForm.value.wchatImage = resp.wchatImage;
      communicateForm.value.viewFlag = true;
    } finally {
      setTimeout(() => {
        loading.value = false;
      }, 3000);
    }
  };

  const handleImageLoad = async () => {
    loading.value = false;
  };
  const closeCommunicateView = async () => {
    //提交建议

    communicateForm.value.viewFlag = false;
  };

  /****************************** 个性化配置 ******************************** */

  /****************************** 教程 ******************************** */

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

    console.log(viewAgg.value.phoneShow);
    console.log(viewAgg.value.emailShow);
    console.log(viewAgg.value.passwordShow);
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
        createMessage.success('手机号切换成功！');
        //待处理触发右侧列表刷新
        console.log(11111);
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
    inviteForm.value.ownerLink =
      'https://gfish.top/#/login?inviteCode=' + userInfo.value.accountCode;
  };
  const closeInviteView = async () => {
    inviteForm.value.viewFlag = false;
  };

  const copyText = (text) => {
    const value = unref(text);
    if (!value) {
      message.warning('请输入要拷贝的内容！');
      return;
    }
    doCopyText(value);
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
