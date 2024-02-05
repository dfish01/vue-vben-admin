import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import {
  SystemConfig,
  ExtendConfig,
  MjConfig,
  WebsiteConfig,
  PayConfig,
} from '/@/api/df/model/systemModel';
import { IdReq } from '/@/api/model/baseModel';
import { ContentTypeEnum } from '/@/enums/httpEnum';
import { UploadApiResult } from './model/uploadModel';
import { AxiosProgressEvent } from 'axios';
import { getAppEnvConfig } from '/@/utils/env';

const { VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL, VITE_GLOB_API_URL_PREFIX, VITE_GLOB_UPLOAD_URL } =
  getAppEnvConfig();

enum Api {
  SaveExtendConfig = '/open/dict/saveExtendConfig',
  ExtendConfigInfo = '/open/dict/extendConfigInfo',
  SaveMjConfig = '/open/dict/saveMjConfig',
  MjConfigInfo = '/open/dict/mjConfigInfo',
  SaveSystemConfig = '/open/dict/saveSystemConfig',
  SystemConfigInfo = '/open/dict/systemConfigInfo',

  SaveWebsiteConfig = '/open/dict/saveWebsiteConfig',
  WebsiteConfigInfo = '/open/dict/websiteConfigInfo',

  SavePayConfig = '/open/dict/savePayConfig',
  PayConfigInfo = '/open/dict/payConfigInfo',

  Upload = '/open/system/upload',
}

/**
 * 上传文件
 * @param params
 * @param mode
 * @returns
 */
export function upload2(
  params: any,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.post<string>(
    {
      url: Api.Upload,

      params,
      headers: {
        'Content-Type': ContentTypeEnum.FORM_DATA,
      },
      onUploadProgress: onUploadProgress,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}
export function upload(params: any, onUploadProgress: (progressEvent: AxiosProgressEvent) => void) {
  return defHttp.uploadFile<any>(
    {
      url: Api.Upload,
      onUploadProgress,
      baseURL: VITE_GLOB_UPLOAD_URL,
    },
    params,
  );
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
export function saveSystemConfig(params: SystemConfig, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.SaveSystemConfig,
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
export function systemConfigInfo(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<SystemConfig>(
    {
      url: Api.SystemConfigInfo,
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
  return defHttp.post<SystemConfig>(
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
