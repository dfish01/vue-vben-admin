import { BasicPageParams, BasePageResult } from '/@/api/model/baseModel';

/**
 * 添加收藏分类
 */
export interface DrawCollectCategoryAddReq {
  /** id */
  id: string | null;
  /** 收藏夹title */
  title: string | null;
  /** 父ID */
  parentId: string | null;
  /** 排序 */
  sort: number | null;
}

/**
 * 列表
 */
export interface DrawCollectCategoryListResp {
  /** id */
  id: string | null;
  /** 收藏夹title */
  title: string | null;
  /** 父ID */
  parentId: string | null;
  /** 排序 */
  sort: number | null;

  /** 子分类 */
  children: DrawCollectCategoryListResp[];
}
