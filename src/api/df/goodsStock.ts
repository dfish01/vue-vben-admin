import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { IdReq } from '/@/api/model/baseModel';

enum Api {
  AppendStock = '/open/goodsStock/appendStock',
  StockList = '/open/goodsStock/list',
  DiscardStock = '/open/goods/discardStock',
  Delete = '/open/goods/delete',
}

/**
 * 追加库存
 * @param params
 * @param mode
 * @returns
 */
export function appendStock(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.AppendStock,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 库存列表
 * @param params
 * @param mode
 * @returns
 */
export function stockList(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<any[]>(
    {
      url: Api.StockList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 丢弃库存
 * @param params
 * @param mode
 * @returns
 */
export function discardStock(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.DiscardStock,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 删除库存
 * @param params
 * @param mode
 * @returns
 */
export function deleteStock(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.Delete,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}
