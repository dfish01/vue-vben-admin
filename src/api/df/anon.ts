import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { IdReq } from '/@/api/model/baseModel';

enum Api {
  FooterConfig = '/anon/system/footer',
}

/**
 * 获取footer配置
 * @param params
 * @param mode
 * @returns
 */
export function footerInfo(params: {}, mode: ErrorMessageMode = 'message') {
  return defHttp.post<string>(
    {
      url: Api.FooterConfig,
      params,
    },
    {},
  );
}
