import { defHttp } from '/@/utils/http/axios';
import { VerifyCodeParams } from './model/UtilModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  SendCode = '/sendCode',
  // 匿名
  AnalysisLink = '/anon/waterMask/analysis',
  addSuggest = '/open/userSuggest/add',
  CommunicateInfo = '/open/dataCache/communicate',
  AfterSaleInfo = '/open/dataCache/afterSaleInfo',
  TutorialInfo = '/open/dataCache/tutorialInfo',
  SystemInfo = '/open/dataCache/systemInfo',

  GetRecentNotice = '/open/notice/getRecentNotice',
}

/**
 * 聚合系统配置
 *
 * @param params
 * @param mode
 * @returns
 */
export function systemInfo(mode: ErrorMessageMode = 'message') {
  return defHttp.post<any>(
    {
      url: Api.SystemInfo,
      params: {},
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 获取最近的通知
 *
 * @param params
 * @param mode
 * @returns
 */
export function getRecentNotice(mode: ErrorMessageMode = 'message') {
  return defHttp.post<string>(
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
  return defHttp.post<string>(
    {
      url: Api.CommunicateInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 售后信息
 * @param params
 * @param mode
 * @returns
 */
export function afterSaleInfo(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<string>(
    {
      url: Api.AfterSaleInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 教程信息
 * @param params
 * @param mode
 * @returns
 */
export function tutorialInfo(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.TutorialInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
