import { defHttp } from '/@/utils/http/axios';
import {
  RegisterParams,
  LoginParams,
  LoginByEmailParams,
  LoginResultModel,
  GetUserInfoModel,
  ResetPasswordParams,
  LoginByPhoneParams,
} from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  RegisterByPhone = '/registerByPhone',
  RegisterByEmail = '/registerByEmail',
  LoginByPwd = '/loginByPwd',
  LoginByEmail = '/loginByEmail',
  LoginByPhone = '/loginByPhone',
  Logout = '/logout',
  GetUserInfo = '/open/user/getUserInfo',
  GetPermCode = '/open/user/getPermCode',
  TestRetry = '/testRetry',
  ResetPasswordByPhone = '/resetPasswordByPhone',
  ResetPasswordByEmail = '/resetPasswordByEmail',

  ChangeUserIcon = '/open/user/changeUserIcon',
}

/**
 * 变更头像
 * @param params
 * @param mode
 * @returns
 */
export function changeUserIcon(params: { iconUrl: string }, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.ChangeUserIcon,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 注册(通过邮箱)
 * @param params
 * @param mode
 * @returns
 */
export function registerByEmailApi(params: RegisterParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.RegisterByEmail,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 注册
 * @param params
 * @param mode
 * @returns
 */
export function registerApi(params: RegisterParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.RegisterByPhone,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * 重置密码
 * @param params
 * @param mode
 * @returns
 */
export function resetPassword(params: ResetPasswordParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.ResetPasswordByEmail,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.LoginByPwd,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: user login api
 */
export function loginByEmail(params: LoginByEmailParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.LoginByEmail,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function loginByPhone(params: LoginByPhoneParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.LoginByPhone,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
