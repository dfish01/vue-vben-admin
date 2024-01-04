import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import {
  GoodsAddParams,
  GoodsListReq,
  GoodsListResp,
  ListResultModel,
} from '/@/api/df/model/goodsModel'; // 请替换为您的请求模型路径
import { IdReq } from '/@/api/model/baseModel';

enum Api {
  GoodsList = '/open/goods/list',
  GoodsAdd = '/open/goods/add',
  DeployNewGoods = '/open/goods/deployNewGoods',
  DeploySecondHandGoods = '/open/goods/deploySecondHandGoods',
  GoodsDelete = '/open/goods/delete',
}

export function addGoods(params: GoodsAddParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.GoodsAdd,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 发布新商品
 * @param params
 * @param mode
 * @returns
 */
export function deployNewGoods(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.DeployNewGoods,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 发布二手商品
 * @param params
 * @param mode
 * @returns
 */
export function deploySecondHandGoods(params: any, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.DeploySecondHandGoods,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 列表
 * @param params
 * @param mode
 * @returns
 */
export function goodsList(params: GoodsListReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ListResultModel>(
    {
      url: Api.GoodsList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
export function deleteGoods(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.GoodsDelete,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
