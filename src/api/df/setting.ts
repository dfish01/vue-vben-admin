import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import {
  ChangePasswordReq,
  ResetPhoneReq,
  ResetEmailReq,
  UserSettingInfoResp,
} from '/@/api/df/model/settingModel'; // 请替换为您的请求模型路径

enum Api {
  ChangePassword = '/open/setting/userUpdate',
  ResetPhone = '/open/setting/resetPhone',
  ResetEmail = '/open/setting/resetEmail',
  UserInfo = '/open/setting/userInfo',
}

/**
 * 更新密码
 * @param params
 * @param mode
 * @returns
 */
export function changePassword(params: ChangePasswordReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.ChangePassword,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 重置手机号
 * @param params
 * @param mode
 * @returns
 */
export function resetPhone(params: ResetPhoneReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.ResetPhone,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 重置邮箱
 * @param params
 * @param mode
 * @returns
 */
export function resetEmail(params: ResetEmailReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.ResetEmail,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 用户信息
 * @param mode
 * @returns
 */
export function userInfoApi(mode: ErrorMessageMode = 'message') {
  return defHttp.post<UserSettingInfoResp>(
    {
      url: Api.UserInfo,
    },
    {
      errorMessageMode: mode,
    },
  );
}
