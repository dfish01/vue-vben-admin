/**
 * ExtendConfigReq 接口定义
 */
export interface ExtendConfig {
  translateConfig: TranslateConfig; // 百度翻译配置
  pandoraConfig: PandoraConfig; // pandora 代理配置
  mailConfig: any; //邮箱配置
}

/**
 * TranslateConfigReq 接口定义
 */
interface TranslateConfig {
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
export interface MjConfig {
  /**
   * Discord 导入限额
   */
  discordImportLimit: string;

  /**
   * 默认 Discord ID
   */
  defaultDiscordId: string;

  /**
   * Mj 敏感词
   */
  midjourneyBan: string;

  /**
   * 代理配置
   */
  proxyConfig: {
    discordImageProxy: string;

    promptImageProxy: string;
  };
}

/**
 * ActivityInfoConfigReq 接口定义
 */
export interface ActivityInfoConfig {
  /**
   * 微信群和教程连接配置
   */
  communicateInfo: CommunicateInfo;

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

/**
 * CommunicateResp 接口定义
 */
interface CommunicateInfo {
  /**
   * 微信群图片
   */
  wchatImage: string;

  /**
   * QQ群分享列表
   */
  qqGroupList: string[];
}

export interface WebsiteConfig {
  /**
   * 站点底部内容
   */
  footer: string;
}

export interface PayConfig {
  aliFace2FaceConfig: AliFace2FaceConfig;
  rateConfig: RateConfig;
}

interface AliFace2FaceConfig {
  alipayPublicKey: string;
  privateKey: string;
  appId: string;
  notifyUrl: string;
}

interface RateConfig {
  userPayRate: string;
}
