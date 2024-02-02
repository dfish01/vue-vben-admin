import { defHttp } from '/@/utils/http/axios';
import { VerifyCodeParams } from './model/UtilModel';
import { IdReq } from '../model/baseModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  GetBalance = '/open/userBalanceFlow/getBalance',
  FlowList = '/open/userBalanceFlow/flowList',
  FlowInfo = '/open/userBalanceFlow/flowInfo',
}

/**
 * 获取账单明细
 * @param params
 * @param mode
 * @returns
 */
export function flowInfo(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.FlowInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 获取账户余额
 * @param params
 * @param mode
 * @returns
 */
export function getBalance(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.GetBalance,
      params,
    },
    {
      errorMessageMode: mode,
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
