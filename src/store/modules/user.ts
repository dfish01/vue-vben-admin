import type { UserInfo, PersonalSetting } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import {
  ROLES_KEY,
  TOKEN_KEY,
  USER_INFO_KEY,
  PERSONAL_SETTING_KEY,
  MJ_TASK_ACCOUNT_KEY,
} from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';

import { accountInfoApi } from '/@/views/df/mj/accountInfo';

import {
  GetUserInfoModel,
  LoginParams,
  RegisterParams,
  LoginByPhoneParams,
  LoginByEmailParams,
} from '/@/api/df/model/userModel';
import {
  doLogout,
  getUserInfo,
  loginApi,
  registerApi,
  loginByPhone,
  loginByEmail,
} from '/@/api/df/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { isArray } from '/@/utils/is';
import { h } from 'vue';
import {
  getCustomCache,
  setCustomCache,
  clearCustomLocalCache,
  clearCustomCache,
} from '/@/utils/custom';

const {
  accountForm,
  accountViewForm,
  initAccountList,
  initAccountInfo,
  doGetChannelsByGroup,
  handleAccountSetting,
  handleSetting,
} = accountInfoApi();

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  personalSetting: Nullable<PersonalSetting>;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,

    personalSetting: null,
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getPersonalSetting(state): PersonalSetting {
      return state.personalSetting || getAuthCache<PersonalSetting>(PERSONAL_SETTING_KEY) || {};
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setPersonalSetting(info: PersonalSetting | null) {
      this.personalSetting = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(PERSONAL_SETTING_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },

    /**
     * @description: 注册
     */
    async register(
      params: RegisterParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, ...registerParams } = params;
        console.log(registerParams);
        const noneMode: ErrorMessageMode = 'none';
        const data = await registerApi(registerParams, noneMode);
        const { token } = data;
        // save token
        this.setToken(token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: 个性化设置
     */
    async syncSetting(params: PersonalSetting): Promise<void> {
      try {
        const oldSetting = await this.getSetting();
        for (const key in oldSetting) {
          if (key in params && params[key] !== undefined && params[key] !== null) {
            oldSetting[key] = params[key];
          }
        }
        this.setPersonalSetting(oldSetting);
        console.log('syncSetting ' + this.getPersonalSetting);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    //这里定义的属性才生效
    async getSetting(): Promise<PersonalSetting> {
      let oldSetting = this.getPersonalSetting;
      if (oldSetting === null || Object.keys(oldSetting).length === 0) {
        oldSetting = {
          mode: 'relax',
          userAccountId: null,
          useChannelId: null,
          userAccountName: '',
          spaceId: '',
          spaceName: '',
          useUpImage: 'N',
          usePersonNet: 'N',
          taskRefresh: 'N',
          exampleQuery: {
            categoryCode: 'huihua',
            key: '',
            nextCursorId: '',
            preNextCursorId: '',
          },
          publicQuery: {
            tagName: null,
            upscaleFlag: 'Y',
            state: '',
            nextCursorId: '',
            preNextCursorId: '',
          },
        };
      }
      console.log('getSetting:', oldSetting);
      return oldSetting;
    },

    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        const { token } = data;

        //清除账号信息
        // setCustomCache(MJ_TASK_ACCOUNT_KEY, undefined);
        // clearCustomLocalCache(true);
        // clearCustomCache(true);

        // save token
        this.setToken(token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * @description: login
     */
    async loginByPhone(
      params: LoginByPhoneParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginByPhoneParams } = params;
        const data = await loginByPhone(loginByPhoneParams, mode);
        const { token } = data;

        // save token
        this.setToken(token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * @description: login
     */
    async loginByEmail(
      params: LoginByEmailParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginByEmailParams } = params;
        const data = await loginByEmail(loginByEmailParams, mode);
        const { token } = data;

        // save token
        this.setToken(token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();

      // const getPersonalSetting = getCustomCache(MJ_TASK_ACCOUNT_KEY);
      // if (!getPersonalSetting || getPersonalSetting?.userId !== userInfo?.userId) {
      //   setCustomCache(MJ_TASK_ACCOUNT_KEY, {
      //     userId: userInfo?.userId,
      //     useAccountId: null,
      //     useAccountName: null,
      //     useChannelId: null,
      //     useChannelName: null,
      //     mode: 'relax',
      //     currentSpaceId: null,
      //     currentSpaceTitle: null,
      //     resetFlag: true,
      //   });
      //   console.log('写入初始化账号设置');
      // }
      //初始化信息
      console.log('写入初始化账号设置');
      if (accountForm.value === undefined || accountForm.value?.userId !== userInfo?.userId) {
        accountForm.userId = userInfo?.userId;
        accountForm.useAccountId = null;
        accountForm.useChannelId = null;
        accountForm.currentSpaceId = null;
        accountForm.useAccountName = null;
        accountForm.currentSpaceTitle = null;
        accountForm.useChannelName = null;
        //下拉数据
        accountViewForm.accountSelector.options = [{ label: '默认账户', value: '' }];
        accountViewForm.channelSelector.options = [{ label: '默认', value: '' }];
        accountViewForm.spaceOptions = [{ label: '默认', value: '' }];
      }

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo();
      const { roles = [] } = userInfo;
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.value) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      //清除账号信息
      // clearCustomLocalCache(true);
      // clearCustomCache(true);

      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
