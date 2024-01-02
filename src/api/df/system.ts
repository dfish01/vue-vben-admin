import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import {
  ActivityInfoConfig,
  ExtendConfig,
  MjConfig,
  WebsiteConfig,
  PayConfig,
} from '/@/api/df/model/systemModel';
import { IdReq } from '/@/api/model/baseModel';

enum Api {
  SaveExtendConfig = '/open/dict/saveExtendConfig',
  ExtendConfigInfo = '/open/dict/extendConfigInfo',
  SaveMjConfig = '/open/dict/saveMjConfig',
  MjConfigInfo = '/open/dict/mjConfigInfo',
  SaveActivityConfig = '/open/dict/saveActivityConfig',
  ActivityConfigInfo = '/open/dict/activityConfigInfo',

  SaveWebsiteConfig = '/open/dict/saveWebsiteConfig',
  WebsiteConfigInfo = '/open/dict/websiteConfigInfo',

  SavePayConfig = '/open/dict/savePayConfig',
  PayConfigInfo = '/open/dict/payConfigInfo',
}

/**
 * 保存扩展配置
 * @param params
 * @param mode
 * @returns
 */
export function saveExtendConfig(params: ExtendConfig, mode: ErrorMessageMode = 'message') {
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
export function extendConfigInfo(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ExtendConfig>(
    {
      url: Api.ExtendConfigInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 保存MJ配置
 * @param params
 * @param mode
 * @returns
 */
export function saveMjConfig(params: MjConfig, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
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
  return defHttp.post<MjConfig>(
    {
      url: Api.MjConfigInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 保存活动配置信息
 * @param params
 * @param mode
 * @returns
 */
export function saveActivityConfig(params: ActivityInfoConfig, mode: ErrorMessageMode = 'message') {
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
  return defHttp.post<ActivityInfoConfig>(
    {
      url: Api.ActivityConfigInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 保存站点配置信息
 * @param params
 * @param mode
 * @returns
 */
export function saveWebsiteConfig(params: WebsiteConfig, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.SaveWebsiteConfig,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 站点配置信息
 * @param params
 * @param mode
 * @returns
 */
export function websiteConfigInfo(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ActivityInfoConfig>(
    {
      url: Api.WebsiteConfigInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 保存支付配置
 * @param params
 * @param mode
 * @returns
 */
export function savePayConfig(params: PayConfig, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.SavePayConfig,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 支付配置信息
 * @param params
 * @param mode
 * @returns
 */
export function payConfigInfo(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<PayConfig>(
    {
      url: Api.PayConfigInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
