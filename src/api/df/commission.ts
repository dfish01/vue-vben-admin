import { defHttp } from '/@/utils/http/axios';
import { VerifyCodeParams } from './model/UtilModel';
import { IdReq } from '../model/baseModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  Withdrawal = '/open/userCommission/withdrawal',
  FlowList = '/open/userCommission/flowList',
  GetCommission = '/open/userCommission/getCommission',
}

/**
 * 获取佣金情况
 * @param params
 * @param mode
 * @returns
 */
export function getCommission(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.GetCommission,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 提现申请
 * @param params
 * @param mode
 * @returns
 */
export function withdrawal(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.Withdrawal,
      params,
      timeout: 30 * 1000,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 流水列表
 * @param params
 * @param mode
 * @returns
 */
export function flowList(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.FlowList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
