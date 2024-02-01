import { defHttp } from '/@/utils/http/axios';
import { VerifyCodeParams } from './model/UtilModel';
import { IdReq } from '../model/baseModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  ListCategory = '/open/drawingSample/listCategory',
  QueryDrawingSample = '/open/drawingSample/queryDrawingSample',
  AddDrawingSample = '/open/drawingSample/addDrawingSample',
  MoveDrawingSample = '/open/drawingSample/moveDrawingSample',

  Delete = '/open/drawingSample/delete',
}

/**
 * 移动案例教程
 * @param params
 * @param mode
 * @returns
 */
export function moveDrawingSample(
  params: {
    id: string;
    categoryCodes: string[];
  },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post(
    {
      url: Api.MoveDrawingSample,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 添加案例教程
 * @param params
 * @param mode
 * @returns
 */
export function addDrawingSample(
  params: {
    categoryCodes: string[];
    drawTaskId: string;
  },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post(
    {
      url: Api.AddDrawingSample,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 删除案例教程
 * @param params
 * @param mode
 * @returns
 */
export function delExample(params: IdReq, mode: ErrorMessageMode = 'message') {
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
export function queryDrawingSample(
  params: { categoryCode: string; key: string; nextCursorId: string },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<{ id: string; imageUrl: string; prompt: string }[]>(
    {
      url: Api.QueryDrawingSample,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
