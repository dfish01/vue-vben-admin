import { BasicPageParams, BasePageResult } from '/@/api/model/baseModel';

export interface AddDrawTaskTagReq {
  /**
   * 标签名
   */
  tagName: string | null;

  /**
   * 任务id
   */
  drawTaskId: string | null;
}
