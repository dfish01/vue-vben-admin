<template>
  <div v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="email" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.email"
          :placeholder="t('sys.login.email')"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem name="code" class="enter-x">
        <CountdownInput
          size="large"
          class="fix-auto-fill"
          v-model:value="formData.code"
          :sendCodeApi="sendPhoneCode"
          :placeholder="t('sys.login.emailCode')"
        />
      </FormItem>

      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
          {{ t('sys.login.loginButton') }}
        </Button>
        <Button size="large" block class="mt-4" @click="handleBackLogin">
          {{ t('sys.login.backSignIn') }}
        </Button>
      </FormItem>
    </Form>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref } from 'vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { CountdownInput } from '/@/components/CountDown';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';
  import { VerifyCodeParams } from '/@/api/df/model/UtilModel';
  import { sendCode } from '/@/api/df/utils';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';

  const FormItem = Form.Item;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const userStore = useUserStore();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    email: '',
    code: '',
  });
  const { getFormRules } = useFormRules(formData);

  const { validForm } = useFormValid(formRef);
  const { notification, createErrorModal } = useMessage();
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.EMAIL);

  async function sendPhoneCode(): Promise<boolean> {
    const codeParams: VerifyCodeParams = {
      verifyType: 'E',
      scene: 'login',
      toSend: formData.email,
    };
    const response = await sendCode(codeParams);
    console.log('sendEmailCode ' + response);
    return true;
  }

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    console.log(data);
    try {
      loading.value = true;
      const userInfo = await userStore.loginByEmail({
        email: data.email,
        code: data.code,
        mode: 'none', //不要默认的错误提示
      });
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.nickName}`,
          duration: 3,
        });
      }
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body,
      });
    } finally {
      loading.value = false;
    }
  }
</script>
