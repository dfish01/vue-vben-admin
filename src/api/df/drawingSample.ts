import { defHttp } from '/@/utils/http/axios';
import { VerifyCodeParams } from './model/UtilModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  ListCategory = '/open/drawingSample/listCategory',
  QueryDrawingSample = '/open/drawingSample/queryDrawingSample',
  AddDrawingSample = '/open/drawingSample/addDrawingSample',
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
