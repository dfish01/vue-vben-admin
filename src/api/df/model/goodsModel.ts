import { BasicPageParams, BasePageResult } from '/@/api/model/baseModel';

export interface GoodsListReq extends BasicPageParams {
  goodsTitle: string | null;
  goodsType: string | null;
  ownerFlag: string | null;
}

export interface GoodsAddParams {}

export interface GoodsListResp {
  id: number;

  /**
   * 商品标题
   */
  goodsTitle: string;

  /**
   * 商品库存
   */
  stock: number;

  /**
   * 商品描述
   */
  detailUrl: string;

  /**
   * 商品url连接
   */
  imageUrl: string;

  /**
   * 代理图片连接
   */
  proxyImageUrl: string;

  /**
   * 商品类型 GROUP,GOODS
   */
  goodsType: string;

  /**
   * 特殊标签
   */
  specialLabel: string;

  /**
   * 商品价格
   */
  goodsPrice: string;

  /**
   * 最低成团人数
   */
  minGroupMembers: number;

  /**
   * 最多成团人数
   */
  maxGroupMembers: number;

  /**
   * 商品类目
   */
  categoryCode: string;

  /**
   * 商品状态 UP、DOWN
   */
  goodsState: string;

  /**
   * 商品跳转类型 THIRD,PLATFORM
   */
  skipType: string;

  /**
   * 跳转连接
   */
  skipLink: string;

  /**
   * 个性化内容
   */
  infoBody: {};
}

export type ListResultModel = BasePageResult<GoodsListResp>;
