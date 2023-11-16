import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import {
  WorkSpaceListResp,
  WorkSpaceSaveReq,
  ImportDiscordMessageReq,
  DiscordChannel,
} from '/@/api/df/model/workSpaceModel'; // 请替换为您的请求模型路径
import { IdReq } from '/@/api/model/baseModel';

enum Api {
  SaveUserSpace = '/open/userSpace/saveOrUpdate',
  AllUserSpace = '/open/userSpace/list',
  Delete = '/open/userSpace/delete',

  ChannelList = '/open/userSpace/channelList',
  ImportDiscordMessage = '/open/userSpace/importDiscordMessage',

  AddSpaceTask = '/open/userSpace/addSpaceTask',
  RemoveSpaceTask = '/open/userSpace/removeSpaceTask',
}

export function channelList(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<DiscordChannel[]>(
    {
      url: Api.ChannelList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function importMessage(params: ImportDiscordMessageReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.ImportDiscordMessage,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

export function addSpaceTask(
  params: { spaceId: string; taskIds: string[] },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<void>(
    {
      url: Api.AddSpaceTask,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

export function removeSpaceTask(
  params: { spaceId: string; taskIds: string[] },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<void>(
    {
      url: Api.RemoveSpaceTask,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

export function saveUserSpace(params: WorkSpaceSaveReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.SaveUserSpace,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

export function allUserSpace(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<WorkSpaceListResp[]>(
    {
      url: Api.AllUserSpace,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function deleteSpace(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.Delete,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
