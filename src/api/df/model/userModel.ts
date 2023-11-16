/**
 * 注册
 */
export interface RegisterParams {
  nickName: string;
  password: string;
  confirmPassword: string;
  phone: string;
  email: string;
  code: string;
  policy: boolean;
  inviteCode: string;
}

/**
 * 重置密码
 */
export interface ResetPasswordParams {
  password: string;
  email: string;
  code: string;
}

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  email: string;
  password: string;
}

/**
 * @description: Login interface parameters
 */
export interface LoginByEmailParams {
  email: string;
  code: string;
}

/**
 * @description: Login interface parameters
 */
export interface LoginByPhoneParams {
  phone: string;
  code: string;
}

/**
 * @description: Login interface parameters
 */
export interface LoginByEmailParams {
  email: string;
  code: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 邮箱
  email: string;
  // 昵称
  nickName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
  //账户状态
  state: string;
}
