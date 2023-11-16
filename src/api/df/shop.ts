import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import {
  ShopListReq,
  ShopCreateReq,
  ShopListResp,
  ListResultModel,
} from '/@/api/df/model/shopModel'; // 请替换为您的请求模型路径
import { IdReq } from '/@/api/model/baseModel';

enum Api {
  SaveShop = '/open/userShop/saveOrUpdate',
  ShopList = '/open/userShop/shopList',
  OpenShop = '/open/userShop/open',
  CloseShop = '/open/userShop/close',
  DeleteShop = '/open/userShop/delete',
}

/**
 * 保存店铺
 * @param params
 * @param mode
 * @returns
 */
export function saveShop(params: ShopCreateReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.SaveShop,
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
export function shopList(params: ShopListReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<ListResultModel>(
    {
      url: Api.ShopList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 开启店铺
 * @param params
 * @param mode
 * @returns
 */
export function openShop(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.OpenShop,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}

/**
 * 关闭店铺
 * @param params
 * @param mode
 * @returns
 */
export function closeShop(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.CloseShop,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}
/**
 * 删除店铺
 * @param params
 * @param mode
 * @returns
 */
export function deleteShop(params: IdReq, mode: ErrorMessageMode = 'message') {
  return defHttp.post<void>(
    {
      url: Api.DeleteShop,
      params,
    },
    {
      errorMessageMode: mode,
      successMessageMode: mode,
    },
  );
}
