import { BasicPageParams, BasePageResult } from '/@/api/model/baseModel';

export interface TradeListQueryReq extends BasicPageParams {
  goodsTitle: string | null;
  state: string | null;
}

export interface CreateTradeReq {
  goodsId: string;
}

export interface CreateTradeResp {
  qrCode: string;
  outTradeNo: string;
}

export interface TradeListResp {
  gmtCreate: string;
  gmtModified: string;
  orderType: string;
  outTradeNo: number;
  tradeNo: string;
  buyerId: number;
  state: string;
  payState: string;
  gmtPay: string;
  remark: string;
  goodsId: number;
  goodsTitle: string;
  goodsPrice: number;
  deliverObj: any; // 这里根据实际情况定义deliverObj的类型
  qrCode: string;
}

export type ListResultModel = BasePageResult<TradeListResp>;
