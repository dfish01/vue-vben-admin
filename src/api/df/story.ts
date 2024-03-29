import { defHttp } from '/@/utils/http/axios';
import { IdReq, IdReq, StringReq } from '../model/baseModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  GenSimpleStory = '/open/dfStory/genSimpleStory',
  GenStory = '/open/dfStory/genStory',
  StoryList = '/open/dfStory/storyList',
  StoryRemove = '/open/dfStory/storyRemove',
  StoryInfo = '/open/dfStory/storyInfo',
  SaveStoryRole = '/open/dfStory/saveStoryRole',
  GenSplitPicture = '/open/dfStory/genSplitPicture',
  ExtractSplitContent = '/open/dfStory/extractSplitContent',
  CommitSplitContent = '/open/dfStory/commitSplitContent',
}

/**
 * 生成结果
 * @param params
 * @param mode
 * @returns
 */
export function genSimpleStory(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<any>(
    {
      url: Api.GenSimpleStory,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 生成文本
 * @param params
 * @param mode
 * @returns
 */
export function genStory(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<string>(
    {
      url: Api.GenStory,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 故事列表
 * @param params
 * @param mode
 * @returns
 */
export function storyList(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<any[]>(
    {
      url: Api.StoryList,
      params,
    },
    {
      errorMessageMode: mode,
      // successMessageMode: mode,
    },
  );
}

/**
 * 故事删除
 * @param params
 * @param mode
 * @returns
 */
export function storyRemove(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<any[]>(
    {
      url: Api.StoryRemove,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 故事详情
 * @param params
 * @param mode
 * @returns
 */
export function storyInfo(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<any>(
    {
      url: Api.StoryInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 保存故事角色
 * @param params
 * @param mode
 * @returns
 */
export function saveStoryRole(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.SaveStoryRole,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 生成分镜内容
 * @param params
 * @param mode
 * @returns
 */
export function genSplitPicture(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<string>(
    {
      url: Api.GenSplitPicture,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 提取分镜内容
 * @param params
 * @param mode
 * @returns
 */
export function extractSplitContent(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<any>(
    {
      url: Api.ExtractSplitContent,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 提交分镜内容
 * @param params
 * @param mode
 * @returns
 */
export function commitSplitContent(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.CommitSplitContent,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}
