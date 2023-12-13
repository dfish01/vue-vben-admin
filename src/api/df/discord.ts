import { defHttp } from '/@/utils/http/axios';
import { Discord } from './model/discordModel';

import { ErrorMessageMode } from '/#/axios';
import { IdReq } from '../model/baseModel';

enum Api {
  AddDiscordToken = '/open/discord/addDiscordToken',
  GetValidResult = '/open/discord/getValidResult',
  DiscordList = '/open/discord/discordList',
  Info = '/open/discord/info',
  GuildList = '/open/discord/guildList',
  ChannelList = '/open/discord/channelList',

  GetZoneList = '/open/discord/getZoneList',
  UpdateServerZone = '/open/discord/updateServerZone',

  ResetConUse = '/open/discord/resetConUse',
}

/**
 * 重置账号使用次数
 *
 * @param params
 * @param mode
 * @returns
 */
export function resetConUse(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<{ zoneName: string; zoneCode: string; availableNums: number }[]>(
    {
      url: Api.ResetConUse,
      params,
      timeout: 30000,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 获取discord请求结果
 *
 * @param params
 * @param mode
 * @returns
 */
export function getZoneList(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<{ zoneName: string; zoneCode: string; availableNums: number }[]>(
    {
      url: Api.GetZoneList,
      params,
      timeout: 30000,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 更新Discord可用服务
 *
 * @param params
 * @param mode
 * @returns
 */
export function updateServerZone(
  params: { discordId: string; bindingServerName: string },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post(
    {
      url: Api.UpdateServerZone,
      params,
      timeout: 30000,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 获取discord请求结果
 *
 * @param params
 * @param mode
 * @returns
 */
export function getValidResult(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<{ code: number; message: string }>(
    {
      url: Api.GetValidResult,
      params,
      timeout: 30000,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 添加discord账号
 *
 * @param params
 * @param mode
 * @returns
 */
export function discordAddToken(params: { content: string }, mode: ErrorMessageMode = 'message') {
  return defHttp.post<{ code: number; message: string }>(
    {
      url: Api.AddDiscordToken,
      params,
      timeout: 30000,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 获取列表
 *
 * @param params
 * @param mode
 * @returns
 */
export function discordList(
  params: { discordState: string | null; mjState: string | null; guildId: string | null },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<Discord[]>(
    {
      url: Api.DiscordList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 服务器列表
 *
 * @param params
 * @param mode
 * @returns
 */
export function guildList(params: { id: string }, mode: ErrorMessageMode = 'message') {
  return defHttp.post<any[]>(
    {
      url: Api.GuildList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 频道列表
 *
 * @param params
 * @param mode
 * @returns
 */
export function channelList(params: { id: string }, mode: ErrorMessageMode = 'message') {
  return defHttp.post<any[]>(
    {
      url: Api.ChannelList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 注册
 * @param params
 * @param mode
 * @returns
 */
export function discordInfo(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<Discord>(
    {
      url: Api.Info,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
