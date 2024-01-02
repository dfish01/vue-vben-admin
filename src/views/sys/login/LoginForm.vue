<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem class="enter-x">
      <span style="font-size: 15px; font-weight: bold">托管地址：</span>
      <a-dropdown trigger="click">
        <a class="ant-dropdown-link" @click.prevent>
          {{ customHostData.menuName }}
          <DownOutlined />
        </a>
        <template #overlay>
          <a-menu @click="onClick">
            <!-- 使用 v-for 遍历 customHostData 中的下拉项数据 -->
            <a-menu-item :key="item.key" v-for="item in customHostData.dropdownItems">
              {{ item.name }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </FormItem>
    <!-- <FormItem name="email" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.customHost"
        :placeholder="t('sys.login.customHost')"
        class="fix-auto-fill"
        @change="customHostChange"
      />
    </FormItem> -->
    <FormItem name="email" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.email"
        :placeholder="t('sys.login.email')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t('sys.login.rememberMe') }}
          </Checkbox>
        </FormItem>
      </ACol>
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
      <!-- <Button size="large" class="mt-4 enter-x" block @click="handleRegister">
        {{ t('sys.login.registerButton') }}
      </Button> -->
    </FormItem>
    <ARow class="enter-x">
      <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.EMAIL)">
          {{ t('sys.login.emailSignInFormTitle') }}
        </Button>
      </ACol>
      <ACol :md="8" :xs="24" class="!my-2 !md:my-0 xs:mx-0 md:mx-2">
        <Button block @click="setLoginState(LoginStateEnum.QR_CODE)" disabled>
          {{ t('sys.login.qrSignInFormTitle') }}
        </Button>
      </ACol>
      <ACol :md="6" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.REGISTER)">
          {{ t('sys.login.registerButton') }}
        </Button>
      </ACol>
    </ARow>

    <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider>

    <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
      <GithubFilled />
      <WechatFilled />
      <AlipayCircleFilled />
      <GoogleCircleFilled />
      <TwitterCircleFilled />
    </div>
  </Form>

  <!-- 托管地址配置 -->
  <a-modal
    v-model:open="customHostData.viewFlag"
    title="托管地址配置"
    ok-text="确定"
    @ok="saveCustomHost"
    @cancel="closeCustomHost"
  >
    <a-card>
      <a-form layout="vertical">
        <a-row gutter="24">
          <a-col :span="24">
            <a-form-item label="托管地址">
              <a-input v-model:value="customHostData.customHost" placeholder="输入托管地址">
                <template #addonBefore>
                  <a-select v-model:value="customHostData.ssl" style="width: 90px">
                    <a-select-option value="Http://">Http://</a-select-option>
                    <a-select-option value="Https://">Https://</a-select-option>
                  </a-select>
                </template>
              </a-input>
              <!-- <a-input v-model:value="customHostData.customHost" placeholder="输入托管地址" /> -->
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </a-modal>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';

  import { Checkbox, Form, Input, Row, Col, Button, Divider, message } from 'ant-design-vue';
  import {
    GithubFilled,
    WechatFilled,
    AlipayCircleFilled,
    GoogleCircleFilled,
    TwitterCircleFilled,
    DownOutlined,
  } from '@ant-design/icons-vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  //import { onKeyStroke } from '@vueuse/core';
  import { getCustomHost, setCustomCache } from '/@/utils/custom';
  import { CacheTypeEnum, CUSTOM_HOST_KEY, MJ_TASK_ACCOUNT_KEY } from '/@/enums/cacheEnum';
  import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
  import { websiteConfigInfo } from '/@/api/df/anon';
  import { useGlobSetting } from '/@/hooks/setting';

  const { title: websiteTitle } = useGlobSetting();

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const rememberMe = ref(false);

  const customHostData = reactive({
    ssl: 'https://',
    customHost: '',
    menuName: websiteTitle,
    dropdownItems: [
      { key: '1', name: websiteTitle },
      { key: '2', name: '自定义托管' },
    ],
    viewFlag: false,
  });
  const formData = reactive({
    email: '',
    password: '',
  });

  const { validForm } = useFormValid(formRef);

  //onKeyStroke('Enter', handleLogin);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin() {
    //设置托管地址
    // if (formData.customHost === '自绘记录' || formData.customHost === '') {
    //   setCustomCache(CUSTOM_HOST_KEY, null);
    // } else {
    //   if (!isValidDomainWithPrefix(formData.customHost)) {
    //     message.error('请输入正确的托管地址~');
    //   }
    //   setCustomCache(CUSTOM_HOST_KEY, formData.customHost);
    // }
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        password: data.password,
        email: data.email,
        mode: 'none', //不要默认的错误提示
      });

      //清除历史缓存
      // clearCustomCache();

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
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    console.log(`Click on item ${key}`);
    if (key === '1') {
      customHostData.menuName = websiteTitle;
      setCustomCache(CUSTOM_HOST_KEY, null);
    } else {
      customHostData.menuName = '自定义托管';
      customHostData.viewFlag = true;
    }
  };

  const saveCustomHost = () => {
    if (!isValidDomainWithPort(customHostData.customHost)) {
      message.error('请输入正确的托管地址~');
      return;
    }
    //设置托管地址
    setCustomCache(CUSTOM_HOST_KEY, customHostData.ssl + customHostData.customHost);
    customHostData.menuName = customHostData.customHost;
    customHostData.viewFlag = false;
  };

  const closeCustomHost = () => {
    if (!isValidDomainWithPort(customHostData.customHost)) {
      customHostData.menuName = websiteTitle;
      setCustomCache(CUSTOM_HOST_KEY, null);
    }
    customHostData.viewFlag = false;
  };

  function isValidDomainWithPort(host: string): boolean {
    // 如果 host 为空，返回 false
    if (!host) {
      return false;
    }
    // 正则表达式，匹配域名和可选的端口号
    const domainRegex = /^([a-zA-Z0-9.-]+)(:[0-9]+)?\/?$/;

    // 使用正则表达式测试域名和端口的格式
    return domainRegex.test(host);
  }
</script>
