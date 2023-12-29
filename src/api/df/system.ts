import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import {
  ActivityInfoConfigReq,
  ActivityInfoConfigResp,
  ExtendConfigResp,
  ExtendConfigReq,
  MjConfigReq,
  MjConfigResp,
} from '/@/api/df/model/systemModel';
import { IdReq } from '/@/api/model/baseModel';

enum Api {
  SaveExtendConfig = '/open/dict/saveExtendConfig',
  ExtendConfigInfo = '/open/dict/extendConfigInfo',
  SaveMjConfig = '/open/dict/saveMjConfig',
  MjConfigInfo = '/open/dict/mjConfigInfo',
  SaveActivityConfig = '/open/dict/saveActivityConfig',
  ActivityConfigInfo = '/open/dict/activityConfigInfo',
}

/**
 * 保存扩展配置
 * @param params
 * @param mode
 * @returns
 */
export function saveExtendConfig(params: ExtendConfigReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.SaveExtendConfig,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 扩展配置信息
 * @param params
 * @param mode
 * @returns
 */
export function extendConfig(params: MjConfigReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ExtendConfigResp>(
    {
      url: Api.ExtendConfigInfo,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 保存MJ配置
 * @param params
 * @param mode
 * @returns
 */
export function saveMjConfig(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<MjConfigResp>(
    {
      url: Api.SaveMjConfig,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * MJ配置信息
 * @param params
 * @param mode
 * @returns
 */
export function mjConfigInfo(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<any>(
    {
      url: Api.MjConfigInfo,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 保存活动配置信息
 * @param params
 * @param mode
 * @returns
 */
export function saveActivityConfig(
  params: ActivityInfoConfigReq,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post(
    {
      url: Api.SaveActivityConfig,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 活动配置信息
 * @param params
 * @param mode
 * @returns
 */
export function activityConfigInfo(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ActivityInfoConfigResp>(
    {
      url: Api.ActivityConfigInfo,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}
