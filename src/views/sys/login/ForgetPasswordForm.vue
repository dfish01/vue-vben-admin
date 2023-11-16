<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="email" class="enter-x">
        <Input size="large" v-model:value="formData.email" :placeholder="t('sys.login.email')" />
      </FormItem>
      <FormItem name="code" class="enter-x">
        <CountdownInput
          size="large"
          v-model:value="formData.code"
          :sendCodeApi="sendPhoneCode"
          :placeholder="t('sys.login.emailCode')"
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
        <StrengthMeter
          size="large"
          v-model:value="formData.confirmPassword"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>

      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="handleReset" :loading="loading">
          {{ t('common.resetText') }}
        </Button>
        <Button size="large" block class="mt-4" @click="handleBackLogin">
          {{ t('sys.login.backSignIn') }}
        </Button>
      </FormItem>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { CountdownInput } from '/@/components/CountDown';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, useFormRules, LoginStateEnum, useFormValid } from './useLogin';
  import { VerifyCodeParams } from '/@/api/df/model/UtilModel';
  import { sendCode } from '/@/api/df/utils';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { resetPassword } from '/@/api/df/user';
  import { StrengthMeter } from '/@/components/StrengthMeter';

  const FormItem = Form.Item;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const { createMessage } = useMessage();
  const formRef = ref();
  const { validForm } = useFormValid(formRef);
  const loading = ref(false);

  const formData = reactive({
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
  });
  const { getFormRules } = useFormRules(formData);
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD);

  async function sendPhoneCode(): Promise<boolean> {
    const email = formData.email;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email?.trim) {
      createMessage.warning('邮箱地址不能为空');
      return false;
    } else if (!emailRegex.test(email)) {
      // 如果邮箱格式不正确，返回错误信息
      createMessage.warning('邮箱格式不正确');
      return false;
    }
    const codeParams: VerifyCodeParams = {
      verifyType: 'E',
      scene: 'reset',
      toSend: formData.email,
    };
    const response = await sendCode(codeParams);
    console.log('sendEmailCode ' + response);
    return true;
  }

  async function handleReset() {
    // const form = unref(formRef);
    // if (!form) return;
    // await form.resetFields();
    const data = await validForm();
    if (!data) return;
    console.log(data);
    // const params: ResetPasswordParams = {
    //   email: data.email,
    //   code: data.sms,
    //   password: data.password,
    // };
    const userInfo = await resetPassword(data);
    console.log(userInfo);

    createMessage.success('密码已重置，请重新登录！');
    handleBackLogin();
  }
</script>
