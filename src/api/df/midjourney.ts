import { defHttp } from '/@/utils/http/axios';
import { VerifyCodeParams } from './model/UtilModel';
import { IdReq, StringReq } from '../model/baseModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  ListCategory = '/open/mjJob/listCategory',
  ChooseFeedJob = '/open/mjJob/chooseFeedJob',
  SearchJob = '/open/mjJob/searchJob',
  CollectJob = '/open/mjJob/collectJob',
  RemoveCollectJob = '/open/mjJob/removeCollectJob',
  MyCollectJobs = '/open/mjJob/myCollectJobs',
}


/**
 * 类目列表查询
 * @param params
 * @param mode
 * @returns
 */
export function listCategory(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<{ code: string; name: string }>(
    {
      url: Api.ListCategory,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 查询
 * @param params
 * @param mode
 * @returns
 */
export function chooseFeedJob(
  params: any,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<any[]>(
    {
      url: Api.ChooseFeedJob,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 查询
 * @param params
 * @param mode
 * @returns
 */
export function searchJob(
  params: StringReq,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<any[]>(
    {
      url: Api.SearchJob,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}


/**
 * 添加收藏
 * @param params
 * @param mode
 * @returns
 */
export function collectJob(
  params: any,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post(
    {
      url: Api.CollectJob,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 移除收藏
 * @param params
 * @param mode
 * @returns
 */
export function removeCollectJob(
  params: IdReq,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post(
    {
      url: Api.RemoveCollectJob,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}


/**
 * 我的收藏任务
 * @param params
 * @param mode
 * @returns
 */
export function myCollectJobs(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.MyCollectJobs,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

