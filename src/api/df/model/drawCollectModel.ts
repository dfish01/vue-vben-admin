import { BasicPageParams, BasePageResult } from '/@/api/model/baseModel';
import { DrawTaskListResp } from '/@/api/df/model/drawTaskModel';

/**
 * 请求参数：添加收藏
 */
export interface AddDrawCollectReq {
  /** 任务id */
  taskId: string | null;
  /** 收藏夹ID */
  collectCategoryId: string | null;
}

/**
 * 请求参数：查询收藏
 */
export interface DrawCollectListQueryReq extends BasicPageParams {
  /** 任务类型 */
  commandType?: string | null;
  /** 收藏夹分类ID */
  collectCategoryId?: string | null;

  tagName: string | null;

  spaceId: string | null;
}

/**
 * 响应参数：查询收藏结果
 */
export interface DrawCollectListResp extends DrawTaskListResp {
  /** 收藏夹分类ID */
  collectCategoryId: string | null;
  /** 是否为个人任务, Y为是，N为否 */
  ownerFlag: string;
}

export type DrawCollectListResultModel = BasePageResult<DrawCollectListResp>;
