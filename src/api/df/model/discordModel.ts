/**
 * discord记录
 */
export interface Discord {
  id: string;
  gmtCreate: string; // 创建时间，根据需要选择适当的日期时间格式
  gmtModified: string; // 更新时间，根据需要选择适当的日期时间格式
  userName: string; // discord用户名
  email: string; // 邮箱
  globalName: string; // 全局名称
  userToken: string; // 用户token
  sessionId: string; // session id
  userAgent: string; // 调用discord接口、连接wss时的user-agent
  useConcurrent: number; // 已使用并发任务数
  maxConcurrent: number; // 可并发任务数
  mjSubscribe: number; // mj订阅套餐 0, 10, 30, 60, 120
  fastFlag: string; // fast可用标识，通常是 'Y' 或 'N'
  state: string; // 账号状态，通常是 'Y' 或 'N'
  remark: string; // 备注
  infoStr: string; // info信息
  errorMsg: string; // 异常原因
  ownerUserId: number; // 账号持有人
}
