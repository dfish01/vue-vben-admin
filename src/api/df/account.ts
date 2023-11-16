import { defHttp } from '/@/utils/http/axios';
import {
  ListQueryParams,
  ListResultModel,
  ChangeAuthParams,
  ActiveAccountReq,
  CreateAuthCodeReq,
  AccountAuthListResp,
  AccountListItem,
  AddAccountReq,
  AccountStatisticsModel,
  AppendDiscordAccountReq,
} from './model/accountModel';
import { IdReq } from '/@/api/model/baseModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  QueryList = '/open/accountDiscord/list',
  Delete = '/open/accountDiscord/delete',
  StatisticalInfo = '/open/accountDiscord/accountStatisticalInfo',
  ChangeAuth = '/open/accountDiscord/changeAuth',
  ActiveAuthAccount = '/open/accountDiscord/activeAuthAccount',
  AvailableList = '/open/accountDiscord/availableList',
  AppendDiscordAccount = '/open/accountDiscord/appendDiscordAccount',
  AddOwnerAccount = '/open/accountDiscord/addOwnerAccount',
  CreateAuth = '/open/accountDiscord/createAuth',
  AccountAuthList = '/open/accountDiscord/authList',
  DisabledAccount = '/open/accountDiscord/disabledAccount',
  SetDefault = '/open/accountDiscord/setDefault',
  GetGroupAccounts = '/open/accountDiscord/getGroupAccounts',

  QueryGroupList = '/open/discordGroup/listGroup',
  AddToGroup = '/open/discordGroup/addToGroup',
  SaveGroup = '/open/discordGroup/saveGroup',
  RemoveGroupAccount = '/open/discordGroup/removeGroupAccount',
}

/**
 * 账户列表
 * @param params
 * @param mode
 * @returns
 */
export function queryList(params: ListQueryParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ListResultModel>(
    {
      url: Api.QueryList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * 可用账户列表
 * @param params
 * @param mode
 * @returns
 */
export function availableList(
  params: { accMode: string; ownerFlag: string },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<AccountListItem[]>(
    {
      url: Api.AvailableList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 账户组列表
 *
 * @param params
 * @param mode
 * @returns
 */
export function queryGroupList(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<
    {
      id: string;
      groupName: string;
      remark: string;
      discordNames: string[];
      accountIds: string[] | number[];
      refAccountList: { discordUserName: string; accountId: string; discordUserId: string }[];
    }[]
  >(
    {
      url: Api.QueryGroupList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 添加账户组账号
 *
 * @param params
 * @param mode
 * @returns
 */
export function addToGroup(
  params: { id: string; accountId: string },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post(
    {
      url: Api.AddToGroup,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 添加账户组
 *
 * @param params
 * @param mode
 * @returns
 */
export function saveGroup(
  params: { id: string; groupName: string; remark: string },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post(
    {
      url: Api.SaveGroup,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 查询账户组账户ids
 *
 * @param params
 * @param mode
 * @returns
 */
export function getGroupAccounts(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<string[]>(
    {
      url: Api.GetGroupAccounts,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 移除账户组账号
 *
 * @param params
 * @param mode
 * @returns
 */
export function removeGroupAccount(
  params: { id: string; accountId: string },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post(
    {
      url: Api.RemoveGroupAccount,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 激活授权账户
 * @param params
 * @param mode
 * @returns
 */
export function activeAuthAccount(params: ActiveAccountReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.ActiveAuthAccount,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 禁用账户
 * @param params
 * @param mode
 * @returns
 */
export function setDefault(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.SetDefault,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 禁用账户
 * @param params
 * @param mode
 * @returns
 */
export function disabledAccount(
  params: { id: string; flag: string },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post(
    {
      url: Api.DisabledAccount,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 添加个人账户
 * @param params
 * @param mode
 * @returns
 */
export function addOwnerAccount(params: AddAccountReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.AddOwnerAccount,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 追加账户组discord账户
 * @param params
 * @param mode
 * @returns
 */
export function appendDiscordAccount(
  params: AppendDiscordAccountReq,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post(
    {
      url: Api.AppendDiscordAccount,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 创建授权账户
 * @param params
 * @param mode
 * @returns
 */
export function createAccountAuth(params: CreateAuthCodeReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.CreateAuth,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 授权账户列表
 * @param params
 * @param mode
 * @returns
 */
export function accountAuthList(
  params: { accountId: string; source: string },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<AccountAuthListResp[]>(
    {
      url: Api.AccountAuthList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 更新授权
 * @param params
 * @param mode
 * @returns
 */
export function changeAuth(params: ChangeAuthParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.ChangeAuth,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 删除账号
 * @param params
 * @param mode
 * @returns
 */
export function del(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.Delete,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

// 获取账号统计信息
export function getAccountStatisticalInfo(params: IdReq) {
  return defHttp.post<AccountStatisticsModel>(
    {
      url: Api.StatisticalInfo,
      params,
      timeout: 30 * 1000,
    },
    {
      errorMessageMode: 'message',
    },
  );
}
