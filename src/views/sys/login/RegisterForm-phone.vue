<template>
  <div v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="nickName" class="enter-x">
        <Input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.nickName"
          :placeholder="t('sys.login.nickName')"
        />
      </FormItem>
      <FormItem name="email" class="enter-x">
        <Input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.email"
          :placeholder="t('sys.login.email')"
        />
      </FormItem>
      <FormItem name="mobile" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.mobile"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem name="code" class="enter-x">
        <CountdownInput
          size="large"
          class="fix-auto-fill"
          :sendCodeApi="sendPhoneCode"
          v-model:value="formData.code"
          :placeholder="t('sys.login.smsCode')"
        />
      </FormItem>
      <FormItem name="password" class="enter-x">
        <StrengthMeter
          size="large"
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.confirmPassword"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>

      <FormItem class="enter-x" name="policy">
        <!-- No logic, you need to deal with it yourself -->
        <Checkbox v-model:checked="formData.policy" size="small" />
        {{ t('sys.login.readAndAgree') }}<a>{{ t('sys.login.userServiceAgreement') }}</a
        ><a>{{ t('sys.login.privacyPolicy') }}</a>
      </FormItem>

      <Button
        type="primary"
        class="enter-x"
        size="large"
        block
        @click="handleRegister"
        :loading="loading"
      >
        {{ t('sys.login.registerButton') }}
      </Button>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </Form>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button, Checkbox } from 'ant-design-vue';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { CountdownInput } from '/@/components/CountDown';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';
  import { VerifyCodeParams } from '/@/api/df/model/UtilModel';
  import { sendCode } from '/@/api/df/utils';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { RegisterParams } from '/@/api/df/model/userModel';

  import { registerApi } from '/@/api/df/user';

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();
  const { notification, createErrorModal } = useMessage();
  const formRef = ref();
  const loading = ref(false);
  const userStore = useUserStore();

  const formData = reactive({
    nickName: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    email: '',
    code: '',
    policy: false,
  });

  const { getFormRules } = useFormRules(formData);
  const { validForm } = useFormValid(formRef);
  const { createMessage } = useMessage();
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);

  async function sendEmailCode(): Promise<boolean> {
    const email = formData.email;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 列出中国主流的邮箱后缀
    const chineseEmailProviders = [
      'sina.com',
      'sina.cn',
      '163.com',
      '126.com',
      'yeah.net',
      '188.com',
      'qq.com',
      'foxmail.com',
      'sohu.com',
      'aliyun.com',
      'dfish.xyz',
    ];

    if (!email?.trim) {
      createMessage.warning('邮箱地址不能为空');
      return false;
    } else if (!emailRegex.test(email)) {
      createMessage.warning('邮箱格式不正确');
      return false;
    } else {
      // 提取邮箱后缀并进行检查
      const emailSplit = email.split('@');
      const emailSuffix = emailSplit.length > 1 ? emailSplit[1] : '';
      if (!chineseEmailProviders.includes(emailSuffix)) {
        createMessage.warning(
          '请使用中国主流的邮箱提供商！比如：sina.com, sina.cn,163.com,126.com, yeah.net, 188.com,qq.com,foxmail.com,sohu.com,aliyun.com',
        );
        return false;
      }
    }
    const codeParams: VerifyCodeParams = {
      verifyType: 'E',
      scene: 'register',
      toSend: formData.email,
    };

    const response = await sendCode(codeParams);
    console.log('sendEmailCode ' + response);
    return true;
  }

  async function sendPhoneCode(): Promise<boolean> {
    // 中国手机号码正则表达式
    const chinaMobileRegex = /^1[3-9]\d{9}$/;
    const mobile = formData.mobile;
    // 验证手机号码
    if (!mobile?.trim) {
      createMessage.warning('手机号码不能为空');
      return false;
    } else if (!chinaMobileRegex.test(mobile)) {
      createMessage.warning('请输入有效的手机号码');
      return false;
    }
    const codeParams: VerifyCodeParams = {
      verifyType: 'P',
      scene: 'register',
      toSend: formData.mobile,
    };
    const response = await sendCode(codeParams);
    console.log('sendEmailCode ' + response);
    return true;
  }

  async function handleRegister() {
    const data = await validForm();
    if (!data) return;
    console.log(data);
    try {
      loading.value = true;
      const param: RegisterParams = {
        nickName: data.nickName,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phone: data.mobile,
        email: data.email,
        code: data.code,
        policy: data.policy,
      };

      const userInfo = await registerApi(param);
      if (userInfo) {
        notification.success({
          message: t('sys.login.registerSuccessTitle'),
          description: `${t('sys.login.registerSuccessDesc')}`,
          duration: 3,
        });
        handleBackLogin();
      }
    } catch (error) {
      // createErrorModal({
      //   title: t('sys.api.errorTip'),
      //   content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
      //   getContainer: () => document.body,
      // });
    } finally {
      loading.value = false;
    }
  }
</script>
