import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { IdReq, StringReq } from '/@/api/model/baseModel';
import {
  TradeListQueryReq,
  CreateTradeReq,
  CreateTradeResp,
  ListResultModel,
  TradeListResp,
} from '/@/api/df/mode/tradeModel';

enum Api {
  CreateTrade = '/open/trade/createTrade',
  CreateShareTrade = '/open/trade/createShareTrade',
  CreateRechargeTrade = '/open/trade/createRechargeTrade',
  UserTradeList = '/open/trade/userTradeList',
  SaleTradeList = '/open/trade/saleTradeList',
  CancelTrade = '/open/trade/cancelTrade',
  FetchPayResult = '/open/trade/fetchPayResult',
}

/**
 * 创建支付单
 *
 * @param params
 * @param mode
 * @returns
 */
export function createTradeApi(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<{ outTradeNo: string; qrCode: string }>(
    {
      url: Api.CreateTrade,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 创建支付单(收藏分享)
 *
 * @param params
 * @param mode
 * @returns
 */
export function createShareTrade(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<{ outTradeNo: string; qrCode: string }>(
    {
      url: Api.CreateShareTrade,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 创建支付单（充值）
 *
 * @param params
 * @param mode
 * @returns
 */
export function createRechargeTrade(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<{ outTradeNo: string; qrCode: string }>(
    {
      url: Api.CreateRechargeTrade,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 列表（卖家订单列表）
 * @param params
 * @param mode
 * @returns
 */
export function tradeListApi(params: TradeListQueryReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ListResultModel>(
    {
      url: Api.UserTradeList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 列表(卖家订单列表)
 * @param params
 * @param mode
 * @returns
 */
export function saleTradeListApi(params: TradeListQueryReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ListResultModel>(
    {
      url: Api.SaleTradeList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 查询支付结果
 *
 * @param params
 * @param mode
 * @returns
 */
export function fetchPayResultApi(params: StringReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<boolean>(
    {
      url: Api.FetchPayResult,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 取消订单
 * @param params
 * @param mode
 * @returns
 */
export function cancelTradeApi(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.CancelTrade,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
