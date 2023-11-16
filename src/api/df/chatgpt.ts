import { defHttp } from '/@/utils/http/axios';
import { ListQueryParams, AddGptAccountReq, ListResultModel } from './model/chatgpt';
import { IdReq } from '/@/api/model/baseModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  AddAccount = '/open/accountChatgpt/addAccount',
  RemoveGptAccount = '/open/accountChatgpt/removeGptAccount',
  ChatgptList = '/open/accountChatgpt/chatgptList',
  SetTop = '/open/accountChatgpt/setTop',
  PageList = '/open/accountChatgpt/pageList',

  CreateAuth = '/open/accountChatgpt/createAuth',
  ActiveAccount = '/open/accountChatgpt/activeAccount',
  RefreshToken = '/open/accountChatgpt/refreshToken',
  GetChatgptUrl = '/open/accountChatgpt/getChatgptUrl',
}

/**
 * 获取chatGptUrl
 * @param params
 * @param mode
 * @returns
 */
export function getChatgptUrl(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.GetChatgptUrl,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 刷新token
 * @param params
 * @param mode
 * @returns
 */
export function refreshToken(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.RefreshToken,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: 'message',
    },
  );
}

/**
 * 激活账号
 * @param params
 * @param mode
 * @returns
 */
export function activeAccount(params: { activeCode: string }, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.ActiveAccount,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 创建账号授权
 * @param params
 * @param mode
 * @returns
 */
export function createAuth(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.CreateAuth,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: 'message',
    },
  );
}

/**
 * Chatgpt账户列表(暂时没用到)
 * @param params
 * @param mode
 * @returns
 */
export function queryChatgptList(params: ListQueryParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ListResultModel>(
    {
      url: Api.ChatgptList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * Chatgpt账户列表
 * @param params
 * @param mode
 * @returns
 */
export function pageList(params: ListQueryParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ListResultModel>(
    {
      url: Api.PageList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 添加chatgpt账号
 *
 * @param params
 * @param mode
 * @returns
 */
export function AddChatgptAccount(params: AddGptAccountReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.AddAccount,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: 'message',
    },
  );
}

/**
 * 移除chatgpt账号
 *
 * @param params
 * @param mode
 * @returns
 */
export function removeChatgptAccount(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.RemoveGptAccount,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: 'message',
    },
  );
}

/**
 * 置顶账号
 *
 * @param params
 * @param mode
 * @returns
 */
export function setTop(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.SetTop,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: 'message',
    },
  );
}
