import { defHttp } from '/@/utils/http/axios';

import { IdReq } from '/@/api/model/baseModel';
import {
  AddDrawCollectReq,
  DrawCollectListQueryReq,
  DrawCollectListResultModel,
} from '/@/api/df/model/drawCollectModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  CreateCollect = '/open/drawCollect/createCollect',
  ListCollects = '/open/drawCollect/list',
  RemoveCollect = '/open/drawCollect/remove',
}

/**
 * 添加收藏
 * @param params - 添加收藏的请求参数
 * @param mode - 错误信息模式
 * @returns
 */
export function createCollect(params: AddDrawCollectReq, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.CreateCollect,
      params,
    },
    {
      errorMessageMode: mode,
      // successMessageMode: mode,
    },
  );
}

/**
 * 查询收藏
 * @param params - 查询收藏的请求参数
 * @param mode - 错误信息模式
 * @returns
 */
export function listCollects(params: DrawCollectListQueryReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<DrawCollectListResultModel>(
    {
      url: Api.ListCollects,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 移除收藏
 * @param params - 移除收藏的请求参数
 * @param mode - 错误信息模式
 * @returns
 */
export function removeCollect(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.RemoveCollect,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
