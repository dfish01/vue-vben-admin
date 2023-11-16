export interface DiscordChannel {
  channelId: string;
  title: string;
}

export interface ImportDiscordMessageReq {
  /**
   * 账户id
   */
  accountId: string;

  /**
   * 空间Id
   */
  spaceId: string;

  /**
   * 通道ID
   */
  channelId: string;
}

export interface WorkSpaceSaveReq {
  id: string | undefined;

  /**
   * 空间标题
   */
  title: string;

  /**
   * 备注
   */
  remark: string;
}

export interface WorkSpaceListResp {
  id: string | null;

  /** 创建时间 */
  gmtCreate: string;

  /**
   * 空间标题
   */
  title: string;

  /**
   * 备注
   */
  remark: string;
}
