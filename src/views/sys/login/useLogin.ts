import type { FormInstance } from 'ant-design-vue/lib/form/Form';
import type {
  RuleObject,
  NamePath,
  Rule as ValidationRule,
} from 'ant-design-vue/lib/form/interface';
import { ref, computed, unref, Ref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';

export enum LoginStateEnum {
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
  MOBILE,
  EMAIL,
  QR_CODE,
}

const currentState = ref(LoginStateEnum.LOGIN);

// 这里也可以优化
// import { createGlobalState } from '@vueuse/core'

export function useLoginState() {
  function setLoginState(state: LoginStateEnum) {
    currentState.value = state;
  }

  const getLoginState = computed(() => currentState.value);

  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN);
  }

  return { setLoginState, getLoginState, handleBackLogin };
}

export function useFormValid<T extends Object = any>(formRef: Ref<FormInstance>) {
  const validate = computed(() => {
    const form = unref(formRef);
    return form?.validate ?? ((_nameList?: NamePath) => Promise.resolve());
  });

  async function validForm() {
    const form = unref(formRef);
    if (!form) return;
    const data = await form.validate();
    return data as T;
  }

  return { validate, validForm };
}

export function useFormRules(formData?: Recordable) {
  const { t } = useI18n();

  const getNickNameFormRule = computed(() => createRule(t('sys.login.nickNamePlaceholder')));
  const getPasswordFormRule = computed(() => createRule(t('sys.login.passwordPlaceholder')));
  const getSmsFormRule = computed(() => createRule(t('sys.login.smsPlaceholder')));
  // const getMobileFormRule = computed(() => createRule(t('sys.login.mobilePlaceholder')));
  // const getEmailFormRule = computed(() => createRule(t('sys.login.emailPlaceholder')));
  const getMobileFormRule = computed(() => [
    {
      required: true,
      message: t('sys.login.mobilePlaceholder'),
      trigger: 'change',
    },
    { validator: validateMobile, trigger: 'change' },
  ]);

  const getEmailFormRule = computed(() => [{ validator: validateEmail, trigger: 'change' }]);

  const validatePolicy = async (_: RuleObject, value: boolean) => {
    return !value ? Promise.reject(t('sys.login.policyPlaceholder')) : Promise.resolve();
  };

  function validateMobile(_: RuleObject, value: string) {
    const pattern = /^1[3-9]\d{9}$/;
    if (pattern.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(t('sys.login.phoneValidPlaceholder'));
  }

  function validateEmail(_: RuleObject, value: string) {
    const pattern = /\S+@\S+\.\S+/;
    if (pattern.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(t('sys.login.emailValidPlaceholder'));
  }

  const validateConfirmPassword = (password: string) => {
    return async (_: RuleObject, value: string) => {
      if (!value) {
        return Promise.reject(t('sys.login.passwordPlaceholder'));
      }
      if (value !== password) {
        return Promise.reject(t('sys.login.diffPwd'));
      }
      return Promise.resolve();
    };
  };

  const getFormRules = computed((): { [k: string]: ValidationRule | ValidationRule[] } => {
    const nickNameFormRule = unref(getNickNameFormRule);
    const passwordFormRule = unref(getPasswordFormRule);
    const smsFormRule = unref(getSmsFormRule);
    const mobileFormRule = unref(getMobileFormRule);
    const emailFormRule = unref(getEmailFormRule);

    const mobileRule = {
      code: smsFormRule,
      mobile: mobileFormRule,
    };
    const emailRule = {
      code: smsFormRule,
      email: emailFormRule,
    };
    switch (unref(currentState)) {
      // register form rules
      case LoginStateEnum.REGISTER:
        return {
          nickName: nickNameFormRule,
          password: passwordFormRule,
          email: emailFormRule,
          confirmPassword: [
            { validator: validateConfirmPassword(formData?.password), trigger: 'change' },
          ],
          policy: [{ validator: validatePolicy, trigger: 'change' }],
          ...mobileRule,
        };

      // reset password form rules
      case LoginStateEnum.RESET_PASSWORD:
        return {
          password: passwordFormRule,
          email: emailFormRule,
          confirmPassword: [
            { validator: validateConfirmPassword(formData?.password), trigger: 'change' },
          ],
          code: smsFormRule,
        };

      // mobile form rules
      case LoginStateEnum.MOBILE:
        return mobileRule;
      case LoginStateEnum.EMAIL:
        return emailRule;
      // login form rules
      default:
        return {
          email: emailFormRule,
          password: passwordFormRule,
        };
    }
  });
  return { getFormRules };
}

function createRule(message: string) {
  return [
    {
      required: true,
      message,
      trigger: 'change',
    },
  ];
}
