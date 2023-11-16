import { defHttp } from '/@/utils/http/axios';

import { IdReq } from '/@/api/model/baseModel';
import {
  DrawTaskRetryReq,
  AddDrawTaskParams,
  DrawTaskListQueryReq,
  DrawTaskChangePublicReq,
  ListResultModel,
  DrawTaskToolsReq,
  ToolsPromptListResultModel,
  DrawTaskToolsPromptListReq,
  DrawTaskPublicListResp,
  DrawTaskPublicListReq,
  DeleteBatchReq,
  DrawTaskInfoResp,
} from '/@/api/df/model/drawTaskModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  RetryDrawTask = '/open/drawTask/retryDrawTask',
  AddDrawTask = '/open/drawTask/addDrawTask',
  Delete = '/open/drawTask/delete',
  ChangePublic = '/open/drawTask/changePublic',
  List = '/open/drawTask/list',
  TaskInfo = '/open/drawTask//taskInfo',

  Translate = '/open/drawTask/translate',
  AiPrompt = '/open/drawTask/aiPrompt',
  PromptDictQuery = '/open/drawTask/promptDictQuery',
  PublicList = '/open/drawTask/publicList',
  DeleteBatch = '/open/drawTask/deleteBatch',
  GetSeed = '/open/drawTask/getSeed',
}

/**
 * 词典列表
 * @param params
 * @param mode
 * @returns
 */
export function promptDictQuery(
  params: DrawTaskToolsPromptListReq,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<ToolsPromptListResultModel>(
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
 * 翻译
 * @param params
 * @param mode
 * @returns
 */
export function translate(params: DrawTaskToolsReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<string | null>(
    {
      url: Api.Translate,
      params,
      timeout: 30 * 1000,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 生成prompt
 * @param params
 * @param mode
 * @returns
 */
export function aiPrompt(params: DrawTaskToolsReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<string | null>(
    {
      url: Api.AiPrompt,
      params,
      timeout: 180 * 1000,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 重新添加任务
 * @param params
 * @param mode
 * @returns
 */
export function retryDrawTask(params: DrawTaskRetryReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.RetryDrawTask,
      params,
      timeout: 30 * 1000,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 添加任务
 * @param params
 * @param mode
 * @returns
 */
export function addDrawTask(params: AddDrawTaskParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.AddDrawTask,
      params,
      timeout: 30 * 1000,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * 是否公开
 * @param params
 * @param mode
 * @returns
 */
export function changePublic(params: DrawTaskChangePublicReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.ChangePublic,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 公开列表
 * @param params
 * @param mode
 * @returns
 */
export function publicList(params: DrawTaskPublicListReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<DrawTaskPublicListResp>(
    {
      url: Api.PublicList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 列表
 * @param params
 * @param mode
 * @returns
 */
export function drawTaskList(params: DrawTaskListQueryReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ListResultModel>(
    {
      url: Api.List,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 删除任务
 * @param params
 * @param mode
 * @returns
 */
export function delDrawTask(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.Delete,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 批量删除任务
 * @param params
 * @param mode
 * @returns
 */
export function deleteBatch(params: DeleteBatchReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.DeleteBatch,
      params,
    },
    {
      successMessageMode: 'message',
      errorMessageMode: mode,
    },
  );
}

/**
 * 获取seed
 * @param params
 * @param mode
 * @returns
 */
export function getTaskSeed(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.GetSeed,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 获取任务信息
 * @param params
 * @param mode
 * @returns
 */
export function getTaskInfo(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<DrawTaskInfoResp>(
    {
      url: Api.TaskInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
