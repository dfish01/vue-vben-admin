import { defHttp } from '/@/utils/http/axios';
import { VerifyCodeParams } from './model/UtilModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SendCode = '/sendCode',
  AnalysisLink = '/open/waterMask/analysis',
  addSuggest = '/open/userSuggest/add',
  CommunicateInfo = '/open/dataCache/communicate',

  GetRecentNotice = '/open/notice/getRecentNotice',
}

/**
 * 获取最近的通知
 *
 * @param params
 * @param mode
 * @returns
 */
export function getRecentNotice(mode: ErrorMessageMode = 'message') {
  return defHttp.post<{ id: string; content: string }>(
    {
      url: Api.GetRecentNotice,
      params: {},
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
export function sendCode(params: VerifyCodeParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post<string>(
    {
      url: Api.SendCode,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 解析链接
 * @param params
 * @param mode
 * @returns
 */
export function analysisLink(
  params: { type: string; url: string },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<{
    type: string;
    title: string;
    cover: string;
    images: string[];
    videoUrl: string;
  }>(
    {
      url: Api.AnalysisLink,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 意见反馈
 * @param params
 * @param mode
 * @returns
 */
export function addSuggest(
  params: { title: string; content: string },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post(
    {
      url: Api.AnalysisLink,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 交流群信息
 * @param params
 * @param mode
 * @returns
 */
export function communicateInfo(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<{
    wchatImage: string;
    qqGroupList: string[];
  }>(
    {
      url: Api.CommunicateInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
