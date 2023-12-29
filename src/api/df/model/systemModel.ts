/**
 * ExtendConfigReq 接口定义
 */
export interface ExtendConfigReq {
  translateConfigReq: TranslateConfigReq; // 百度翻译配置
  pandoraConfigReq: PandoraConfig; // pandora 代理配置
  discordImageProxyList: string[]; // discord 代理列表
  promptProxyList: string[]; // 提示词代理列表
}

export interface ExtendConfigResp {
  translateConfigReq: TranslateConfigReq; // 百度翻译配置
  pandoraConfigReq: PandoraConfig; // pandora 代理配置
  discordImageProxyList: string[]; // discord 代理列表
  promptProxyList: string[]; // 提示词代理列表
}

/**
 * TranslateConfigReq 接口定义
 */
interface TranslateConfigReq {
  appid: string; // 百度翻译 appid
  appSecret: string; // 百度翻译 secret
}

/**
 * PandoraConfig 接口定义
 */
interface PandoraConfig {
  host: string; // pandora HOST
  poolToken: string; // pandora pool-token
  accountName: string; // openai 账号名
  password: string; // openai 密码
  apiPrefix: string; // pandora 接口前缀
  autoRefresh: boolean; // 是否自动刷新
  expireTime: string; // 过期时间
}

/**
 * MjConfigReq 接口定义
 */
export interface MjConfigReq {
  /**
   * Discord 导入限额
   */
  discordImportLimit: string;

  /**
   * 默认 Discord ID
   */
  defaultDiscordId: string;

  /**
   * Niji 敏感词
   */
  nijiBan: string;

  /**
   * Mj 敏感词
   */
  midjourneyBan: string;
}
/**
 * MjConfigReq 接口定义
 */
export interface MjConfigResp {
  /**
   * Discord 导入限额
   */
  discordImportLimit: string;

  /**
   * 默认 Discord ID
   */
  defaultDiscordId: string;

  /**
   * Niji 敏感词
   */
  nijiBan: string;

  /**
   * Mj 敏感词
   */
  midjourneyBan: string;
}

/**
 * ActivityInfoConfigReq 接口定义
 */
export interface ActivityInfoConfigReq {
  /**
   * 微信群和教程连接配置
   */
  communicateInfo: CommunicateResp;

  /**
   * 教程连接
   */
  tutorialInfo: string;

  /**
   * 系统通知
   */
  systemNotice: string;
}

/**
 * ActivityInfoConfigReq 接口定义
 */
export interface ActivityInfoConfigResp {
  /**
   * 微信群和教程连接配置
   */
  communicateInfo: CommunicateResp;

  /**
   * 教程连接
   */
  tutorialInfo: string;

  /**
   * 系统通知
   */
  systemNotice: string;
}

/**
 * CommunicateResp 接口定义
 */
interface CommunicateResp {
  /**
   * 微信群图片
   */
  wchatImage: string;

  /**
   * QQ群分享列表
   */
  qqGroupList: string[];
}
