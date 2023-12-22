import { defHttp } from '/@/utils/http/axios';

import { IdReq } from '/@/api/model/baseModel';
import {
  DrawCollectCategoryAddReq,
  DrawCollectCategoryListResp,
} from '/@/api/df/model/drawCollectCategoryModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  Save = '/open/drawCollectCategory/save',
  AllCategory = '/open/drawCollectCategory/allCategory',
  Delete = '/open/drawCollectCategory/delete',
  SetTop = '/open/drawCollectCategory/setTop',

  SelectOptions = '/open/drawCollectCategory/selectOptions',
}

/**
 * 添加收藏分类
 * @param params - 添加收藏的请求参数
 * @param mode - 错误信息模式
 * @returns
 */
export function saveCategory(
  params: DrawCollectCategoryAddReq,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post(
    {
      url: Api.Save,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 收藏分类列表
 * @param params - 添加收藏的请求参数
 * @param mode - 错误信息模式
 * @returns
 */
export function allCollectCategory(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<DrawCollectCategoryListResp[]>(
    {
      url: Api.AllCategory,
      params,
    },
    {
      errorMessageMode: mode,
      // successMessageMode: mode,
    },
  );
}
/**
 * 删除收藏分类
 * @param params - 添加收藏的请求参数
 * @param mode - 错误信息模式
 * @returns
 */
export function deleteCategory(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.Delete,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 置顶
 * @param params - 添加收藏的请求参数
 * @param mode - 错误信息模式
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
      successMessageMode: mode,
    },
  );
}
/**
 * 下拉列表
 * @param params - 添加收藏的请求参数
 * @param mode - 错误信息模式
 * @returns
 */
export function selectOptions(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<any[]>(
    {
      url: Api.SelectOptions,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}
