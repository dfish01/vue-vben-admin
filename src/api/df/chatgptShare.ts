import { defHttp } from '/@/utils/http/axios';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  AllChatgptShare = '/open/chatgptShare/all',
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
