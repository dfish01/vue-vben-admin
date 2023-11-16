import { BasicPageParams, BasePageResult } from '/@/api/model/baseModel';

export interface PromptListReq extends BasicPageParams {
  categoryCode: string | null;
  question: string | null;
}

export interface PromptDictListResp {
  id: string | number;

  /**
   * 翻译名称
   */
  question: string;

  /**
   * prompt
   */
  prompt: string;

  /**
   * 图片连接
   */
  imageUrl: string;

  /**
   * 前端使用
   */
  type: number | null;
  /**
   * 前端使用
   */
  value: number | null;

  /**
   * 前端使用
   */
  selected: boolean | null;

  /**
   * 切割后的图片连接
   */
  splitUrls: string[] | null;
}

export type PromptDictListResultModel = BasePageResult<PromptDictListResp>;
