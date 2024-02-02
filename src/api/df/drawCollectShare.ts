import { defHttp } from '/@/utils/http/axios';
import { VerifyCodeParams } from './model/UtilModel';
import { IdReq } from '../model/baseModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  SaveOrUpdate = '/open/drawCollectShare/saveOrUpdate',
  CollectShareInfo = '/open/drawCollectShare/collectShareInfo',
  ShowShareView = '/third/drawCollectShare/showShareView',
  ShowShareTaskList = '/third/drawCollectShare/showShareTaskList',
}

/**
 * 保存或更新
 * @param params
 * @param mode
 * @returns
 */
export function saveOrUpdate(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.SaveOrUpdate,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 获取分享详情
 * @param params
 * @param mode
 * @returns
 */
export function collectShareInfo(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.CollectShareInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 显示分享情况
 * @param params
 * @param mode
 * @returns
 */
export function showShareView(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.ShowShareView,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 显示分享情况
 * @param params
 * @param mode
 * @returns
 */
export function showShareView2(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.get(
    {
      url: Api.ShowShareView + '/',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 显示分享的任务列表
 *
 * @param params
 * @param mode
 * @returns
 */
export function showShareTaskList(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.ShowShareTaskList,
      params,
    },
    {
      errorMessageMode: mode,
      // successMessageMode: mode,
    },
  );
}
