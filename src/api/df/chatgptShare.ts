import { defHttp } from '/@/utils/http/axios';

import { ErrorMessageMode } from '/#/axios';
import { IdReq } from '../model/baseModel';

enum Api {
  AllChatgptShare = '/open/chatgptShare/all',
  GetUrl = '/open/chatgptShare/getUrl',
  // 匿名
}

/**
 * 获取chatgpt分享配置
 *
 * @param params
 * @param mode
 * @returns
 */
export function allChatgptShare(mode: ErrorMessageMode = 'message') {
  return defHttp.post<any>(
    {
      url: Api.AllChatgptShare,
      params: {},
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 获取链接
 *
 * @param params
 * @param mode
 * @returns
 */
export function getUrl(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<any>(
    {
      url: Api.GetUrl,
      params: params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
