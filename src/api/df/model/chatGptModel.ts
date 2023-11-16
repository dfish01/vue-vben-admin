import { BasicPageParams, BasePageResult } from '/@/api/model/baseModel';

/**
 * 账号激活
 */
export interface ActiveAccountReq {
  activeCode: string;
}

/** 创建账号授权请求 */
export interface CreateAuthCodeReq {
  /** 生成账号ID */
  accountId: string | null;
  /** 生成数量 */
  num: number;
  turboTimes: number;
  fastTimes: number;
  relaxTimes: number;
  authDays: number;
  numExecute: number;
}

/** 账号授权列表响应 */
export interface AccountAuthListResp {
  id: string;
  /** 生成账号ID */
  accountId: string;
  /** 创建时间 */
  gmtCreate: string;
  /** 授权账号名 */
  discordUserName: string;
  /** 授权服务器名 */
  guildTitle: string;
  /** 授权码 */
  authCode: string;
  /** 使用标识Y是N否 */
  useFlag: string;
  /** 激活时间 */
  gmtActive: string | null;
  /** 激活用户的邮箱 */
  activeUserEmail: string | null;
}

/**
 * 分页查询
 */
export interface ListQueryParams extends BasicPageParams {
  accountName: string;
  state: string;
  authType: string;
}

export interface AccountGptListItem {
  //记录id
  id: string;
  //discor用户名
  accountName: string;
  //discord用户id
  discordUserId: string;
  //服务器ID
  guildId: string;
  //服务器名称
  guildTitle: string;
  //账号类型：A授权O自有
  ownerFlag: string;
  //是否开启授权：Y是N否
  authFlag: string;
  //账号状态： 待验证：unvalid，正常：normal，异常：error，已结束：end
  state: string;
  numTotalDiscordAccount: number;
  numAvailableDiscordAccount: number;
  gmtCreate: string;
  defaultFlag: string;
  channelTitle: string;

  turboTimes: number;
  fastTimes: number;
  relaxTimes: number;
  authDays: number;
  expireTime: string;
  accMode: string;
  disabledFlag: string;
  connect: string;
}

export interface AddGptAccountReq {
  id: string | null;
  accountName: string;
  password: string | null;
  mfaCode: string | null;
}

export type ListResultModel = BasePageResult<AccountGptListItem>;
