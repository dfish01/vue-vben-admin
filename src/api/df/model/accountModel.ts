import { BasicPageParams, BasePageResult } from '/@/api/model/baseModel';

export interface ChangeAuthParams {
  authFlag: string;
  id: string;
}

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
  maxSubmit: number;
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
  ownerFlag: string;
  accountName: string;
  state: string;
  accMode: string;
}

export interface AccountListItem {
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

export interface AddAccountReq {
  accountName: string;
  maxSubmit: number | null;
  guildId: string;
  channelId: string;
  discordUserId: string;
}

export interface AppendDiscordAccountReq {
  id: string;
  discordUserIds: string[];
}

/************************************** 统计 ******************************* */
/**
 * 授权使用情况
 */
interface AuthUseInfo {
  fastTimes: number; // 快速次数
  turboTimes: number; // turbo次数
  relaxTimes: number; // relax次数
  expireTime: string; // 过期时间，根据需要定义日期时间格式
  totalFastTimes: number; // 快速次数
  totalTurboTimes: number; // turbo次数
  totalRelaxTimes: number; // relax次数
  numExecute: number; // 执行数
  numSuccess: number; // 成功数
}

/**
 * 账号负载
 */
interface LoadInfo {
  maxSubmit: number; // 可同时提交的任务数
  numDiscord: number; // discord账号数
  maxConcurrency: number; // 最大并发数
  useConcurrency: number; // 已用并发数
  numTaskQueue: number; // 排队任务数
}

/**
 * 账号持有人信息
 */
interface OwnerInfo {
  countAccounts: number; // 总账号个数
  countNormalAccounts: number; // 总可用账号数
  countErrorAccounts: number; // 总异常账号数
  countStopAccounts: number; // 到期账号数
}

/**
 * Discord账号简要信息
 */
interface DiscordSimpleInfo {
  globalName: string; // 账号名
  email: string; // 账号email
  discordState: string; // discord账号状态
  mjState: number; //mj状态
}

/**
 * 账户统计信息
 */
export interface AccountStatisticsModel {
  accountName: string; // Discord名称
  accMode: string; // 模式 GROUP | SINGLE
  ownerFlag: string; // 持有人 Y | N
  loadInfo: LoadInfo; // 负载信息
  authUseInfo: AuthUseInfo; // 授权使用情况
  ownerInfo: OwnerInfo; // 个人账号存储情况
  discordList: DiscordSimpleInfo[]; // Discord账号情况
}
/********************************** 统计end************************************* */
export type ListResultModel = BasePageResult<AccountListItem>;
