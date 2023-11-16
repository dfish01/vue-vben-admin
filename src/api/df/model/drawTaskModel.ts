import { BasicPageParams, BasePageResult } from '/@/api/model/baseModel';

export interface DrawTaskToolsReq {
  /**
   * 文字内容
   */
  prompt: string | null;

  /**
   * 翻译语言 zh | en
   */
  translateTo: string | null;
}

export interface DrawTaskRetryReq {
  /**
   * id
   */
  id: string | number;
  mode: string | null;
  /**
   * 关联账户id
   */
  refAccountId: string | null;
}
export interface AddDrawTaskParams {
  /**
   * 空间id
   */
  spaceId: string | number;

  /**
   * 账号ID
   */
  refAccountId: string | null;

  /**
   * 隐私模式Y是 N否
   */
  privacyMode: string;

  /**
   * 绘图通道 MJ：midjourney SD：stable dissfusion
   */
  channel: string;

  /**
   * 个性化内容
   */
  prompt: object;

  /**
   * 任务优先级
   */
  priority: number;

  /**
   * 关联任务id
   */
  // refTaskId: string | number | null

  /**
   * 命令类型
   */
  commandType: string;

  /**
   * 调用次数
   */
  invokeTimes: string | number;

  /**
   * 快速模式？
   */
  mode: string | '';

  /**
   * 标签列表
   */
  tagNames: string;
}

export interface DrawTaskChangePublicReq {
  /**
   * 隐私模式 Y是N否
   */
  privacyMode: string;
  id: string;
}

/**
 * 批量删除
 */
export interface DeleteBatchReq {
  state: string;
  spaceId: string;
}

export interface DrawTaskListQueryReq extends BasicPageParams {
  state: string | null;
  /**
   * 空间id
   */
  spaceId: string | number;

  tagName: string | null;

  commandType: string;
}

export interface DrawTaskPublicListResp {
  /**
   * 任务列表
   */
  recordList: DrawTaskListResp[];

  /**
   * 下个游标ID
   */
  nextCursorId: string | null;
}

export interface DrawTaskPublicListReq {
  nextCursorId: string | null;
  tagName: string | null;
  upscaleFlag: string | null;
}
export interface DrawTaskListResp {
  id: string | number;

  /**
   * 空间id
   */
  spaceId: string | number;

  /**
   * 创建时间
   */
  gmtCreate: string; // 可以用 string 来表示日期，或使用 Date 类型并在前端进行格式化

  /**
   * 更新时间
   */
  gmtModified: string;

  /**
   * 隐私模式Y是 N否
   */
  privacyMode: string;

  /**
   * 指令类型 MJ：blend,imagine,describe,reroll,upscale,variation
   */
  commandType: string;

  /**
   * 关键词内容JSON
   */
  prompt: string;

  /**
   * 任务开始时间
   */
  gmtStart: string; // 同 gmtCreate

  /**
   * 完成时间
   */
  gmtFinished: string; // 同 gmtCreate

  /**
   * 使用时间（秒）
   */
  useSeconds: number;

  /**
   * 状态 PENDING:排队中 EXECUTING:执行中 FINISHED:已完成 FAIL:失败 取消:CANCEL 中断：DOWN
   */
  state: string;

  /**
   * 状态标签值
   */
  stateLabel: string;

  /**
   * 二级状态,未启动：NOT_START 已提交：SUBMITTED,执行中：IN_PROGRESS,失败：FAILURE, 成功：SUCCESS
   */
  secState: string;

  /**
   * 失败消息
   */
  failMsg: string | null;

  /**
   * 任务优先级
   */
  priority: number | null;

  /**
   * 图片结果
   */
  resultImage: string | null;

  /**
   * 图片结果
   */
  mediaImageUrl: string | null;

  cdnImediaImageUrl: string | null;
  cdnResultImage: string | null;
  /**
   * 文本结果
   */
  resultText: string | null;

  /**
   * 进度
   */
  process: string | null;

  /**
   * 收藏标识 Y是N否
   */
  collectFlag: string | null;

  /**
   * 骨架屏
   */
  imageLoaded: boolean;

  /**
   * 展示明细图？
   */
  // showDetail: boolean;

  /**
   * 是否1：1
   */
  squareFlag: boolean;

  /**
   * 类型具体
   */
  index: string;

  buttonMap: Map<string, { id: string; label: string; emoji: string }>;
  imageHeight: number;
  imageWidth: number;
  messageHash: string;
  mjExecute: string;
}

/********************************* 详情 ******************************** */
// 主要响应对象的接口
export interface DrawTaskInfoResp {
  id: string; // 响应的唯一标识符
  taskInfo: TaskInfo; // 任务的详细信息
  processList: TaskProcess[]; // 与任务相关的过程列表
  tagList: string[]; // 与任务相关的标签列表
  taskSpaceList: TaskSpace[]; // 与任务相关的空间列表
}

// 主要响应中任务信息的接口
interface TaskInfo {
  imageUrls: string[]; // 与任务相关的图片 URL 列表
  bootName: string; // 执行机器人的名称
  oriPrompt: string; // 任务的原始提示
  contentStripped: string; // 任务的剥离内容
  commandTypeName: string; // 与任务相关的命令类型
  modeName: string; // 任务的执行模式
  accountName: string; // 执行任务的账户名
  discordUserName: string; // 与任务相关的 Discord 用户名
  channelName: string; // 任务所属频道的名称
  guildName: string; // 任务所属服务器（公会）的名称
  privacyMode: string; // 隐私模式指示符（Y 为是，N 为否）
}

// 主要响应中任务过程信息的接口
interface TaskProcess {
  title: string; // 任务过程步骤的标题
  description: string; // 任务过程步骤发生的描述
}

// 主要响应中任务空间信息的接口
interface TaskSpace {
  spaceId: number; // 空间的唯一标识符
  spaceName: string; // 空间的名称
}

export type ListResultModel = BasePageResult<DrawTaskListResp>;
