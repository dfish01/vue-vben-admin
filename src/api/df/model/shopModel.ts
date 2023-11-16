import { BasicPageParams, BasePageResult } from '/@/api/model/baseModel';

export interface ShopListReq extends BasicPageParams {
  shopName: string | null;
}

export interface ShopCreateReq {
  id?: number; // 注意：这里添加了问号表示该属性是可选的，因为在创建请求中可能不需要提供 ID

  /** 店铺图标 */
  shopIcon: string;

  /** 店铺名 */
  shopName: string;

  /** 店铺类型 */
  shopType: string;

  /** 跳转连接 */
  linkUrl: string;

  /** 店铺描述 */
  describeInfo: string;

  /** 标签列表 */
  tags: string;

  tagList: string[];
  /** 启用标识 Y是N否 */
  applyStatus: string;

  /** 启用 & 关闭 'ENABLE','CLOSED' */
  status: 'ENABLE' | 'CLOSED'; // 使用联合类型指定为 'ENABLE' 或 'CLOSED'

  /** 信用等级 */
  creditLevel: number;

  /** 申请原因 */
  applyReason: string;
}

export interface ShopListResp {
  id: string;
  /** 创建时间 */
  gmtCreate: string; // 注意：这里的类型可能需要根据实际情况调整，我假设是字符串

  /** 用户id */
  userId: number;

  /** 店铺图标 */
  shopIcon: string;

  /** 店铺名 */
  shopName: string;

  /** 店铺类型 */
  shopType: string;

  /** 跳转连接 */
  linkUrl: string;

  /** 店铺描述 */
  describeInfo: string;

  /** 店铺标签 */
  shopLabel: string;

  /** 标签列表 */
  tagList: string[];

  /** 启用标识 Y是N否 */
  applyStatus: string;

  /** 启用 & 关闭 */
  status: string;

  /** 信用等级 */
  creditLevel: number;

  /** 申请原因 */
  applyReason: string;

  /** 驳回原因 */
  rejectReason: string;
}

export type ListResultModel = BasePageResult<ShopListResp>;
