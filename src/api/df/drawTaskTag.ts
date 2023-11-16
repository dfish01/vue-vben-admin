import { defHttp } from '/@/utils/http/axios';

import { AddDrawTaskTagReq } from '/@/api/df/model/drawTaskTagModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  AddTag = '/open/drawTaskTag/addTag',
  RemoveTaskTag = '/open/drawTaskTag/removeTag',
}

/**
 * 添加任务标签
 * @param params
 * @param mode
 * @returns
 */
export function addTag(params: AddDrawTaskTagReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.AddTag,
      params,
      timeout: 30 * 1000,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 移除任务标签
 * @param params
 * @param mode
 * @returns
 */
export function removeTaskTag(params: AddDrawTaskTagReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.RemoveTaskTag,
      params,
      timeout: 30 * 1000,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}
