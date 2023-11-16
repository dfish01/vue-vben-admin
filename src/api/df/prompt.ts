import { defHttp } from '/@/utils/http/axios';

import { IdReq } from '/@/api/model/baseModel';
import { PromptListReq, PromptDictListResultModel } from '/@/api/df/model/promptModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  PromptDictQuery = '/open/robotPrompt/promptDictQuery',
  AddEnjoyPromptDict = '/open/robotPrompt/addEnjoyPromptDict',
  RemoveEnjoyPromptDict = '/open/robotPrompt/removeEnjoyPromptDict',
}

/**
 * 词典列表
 * @param params
 * @param mode
 * @returns
 */
export function promptDictQuery(params: PromptListReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<PromptDictListResultModel>(
    {
      url: Api.PromptDictQuery,
      params,
      timeout: 30 * 1000,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 添加到喜欢
 * @param params
 * @param mode
 * @returns
 */
export function addEnjoyPromptDict(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<string | null>(
    {
      url: Api.AddEnjoyPromptDict,
      params,
      timeout: 30 * 1000,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 添加到喜欢
 * @param params
 * @param mode
 * @returns
 */
export function removeEnjoyPromptDict(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<string | null>(
    {
      url: Api.RemoveEnjoyPromptDict,
      params,
      timeout: 30 * 1000,
    },
    {
      errorMessageMode: mode,
    },
  );
}
