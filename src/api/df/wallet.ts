import { defHttp } from '/@/utils/http/axios';
import { VerifyCodeParams } from './model/UtilModel';
import { IdReq } from '../model/baseModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  GetBalance = '/open/userBalance/getBalance',
  FlowList = '/open/userBalance/flowList',
  FlowInfo = '/open/userBalance/flowInfo',

  Withdrawal = '/open/userBalance/withdrawal',
  UpdateBalanceWithdrawalResult = '/open/userBalance/updateBalanceWithdrawalResult',
}

/**
 * 发起提现
 * @param params
 * @param mode
 * @returns
 */
export function withdrawal(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.Withdrawal,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 更新提现结果
 * @param params
 * @param mode
 * @returns
 */
export function updateBalanceWithdrawalResult(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post(
    {
      url: Api.UpdateBalanceWithdrawalResult,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
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
