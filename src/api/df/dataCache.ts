import { defHttp } from '/@/utils/http/axios';

import { ErrorMessageMode } from '/#/axios';
import { IdReq } from '/@/api/model/baseModel';
import {
  ToolsPromptListResultModel,
  DrawTaskToolsPromptListReq,
} from '/@/api/df/model/drawTaskModel';

enum Api {
  CachePromptList = '/open/dataCache/promptList',
  CacheTagList = '/open/dataCache/tagList',
  AddEnjoyPromptBook = '/open/dataCache/addEnjoyPromptBook',
  RemoveEnjoyPromptBook = '/open/dataCache/removeEnjoyPromptBook',
  EnjoyPromptBookList = '/open/dataCache/enjoyPromptBookList',
}

/**
 * 最近的prompt
 * @param params
 * @param mode - 错误信息模式
 * @returns
 */
export function genPromptList(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<string[]>(
    {
      url: Api.CachePromptList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 最近的tag
 * @param params
 * @param mode - 错误信息模式
 * @returns
 */
export function genTagList(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<string[]>(
    {
      url: Api.CacheTagList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 添加收藏的promptBook
 * @param params
 * @param mode - 错误信息模式
 * @returns
 */
export function addEnjoyPromptBook(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<string[]>(
    {
      url: Api.AddEnjoyPromptBook,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 移除收藏的promptBook
 * @param params
 * @param mode - 错误信息模式
 * @returns
 */
export function removeEnjoyPromptBook(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<string[]>(
    {
      url: Api.RemoveEnjoyPromptBook,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 收藏的词典列表
 * @param params
 * @param mode
 * @returns
 */
export function enjoyPromptBookList(
  params: DrawTaskToolsPromptListReq,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<ToolsPromptListResultModel>(
    {
      url: Api.EnjoyPromptBookList,
      params,
      timeout: 30 * 1000,
    },
    {
      errorMessageMode: mode,
    },
  );
}
