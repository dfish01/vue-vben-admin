/** 更改密码请求 */
export interface ChangePasswordReq {
  /** 密码 */
  password: string;
  /** 新密码 */
  newPassword: string;
}

/** 重置手机请求 */
export interface ResetPhoneReq {
  /** 手机号 */
  phone: string;
  /** 验证码 */
  code: string;
}

/** 重置邮箱请求 */
export interface ResetEmailReq {
  /** 新邮箱 */
  newEmail: string;
  /** 验证码 */
  code: string;
}

// 响应类型定义

/** 用户设置信息响应 */
export interface UserSettingInfoResp {
  /** 创建时间 */
  gmtCreate: string;
  /** 账户编码 */
  accountCode: string;
  /** 手机号 */
  phone: string;
  /** 邮箱 */
  email: string;
  /** 昵称 */
  nickName: string;
  /** 密码 */
  password: string;
  /** 头像 */
  userIcon: string;
  /** 最近一次登录时间 */
  gmtLogin: string;
  /** 用户等级 */
  userLevel: number;
  /** 用户状态 */
  state: string;
  /** 用户状态标签值 */
  stateLabel: string;
}

export interface UpdateSpaceReq {
  id: string;

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
  id: string;

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
