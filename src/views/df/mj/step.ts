import { message } from 'ant-design-vue';
import { unref, ref } from 'vue';

import { downloadByOnlineUrl } from '/@/utils/file/download';
import { useMessage } from '/@/hooks/web/useMessage';
import useClipboard from 'vue-clipboard3';
import type { TourProps } from 'ant-design-vue';

export const handleOpen = (val: boolean): void => {
  allStep.value.stepOpen = val;
};
export const handleIndexStepOpen = (val: boolean): void => {
  indexStep.value.stepOpen = val;
};

export const importDiscordStep = ref(null);
export const workspaceStep = ref(null);
export const mjTabStep = ref(null);
export const promptStep = ref(null);
export const blendStep = ref(null);
export const button = ref(null);
export const toolsStep = ref(null);
export const accountInfoStep = ref(null);
export const stepCurrent = ref(0);

export const allStep = ref({
  stepCurrent: 0,
  stepOpen: false,
  steps: [
    {
      title: '导入历史记录',
      placement: 'right',
      description: '这里你可以选择导入历史的Discord作图记录进行管理',

      target: () => importDiscordStep.value && importDiscordStep.value.$el,
    },
    {
      title: '管理工作空间',
      placement: 'right',
      description:
        '你可以管理相关的工作空间，每个空间之间的任务相互隔离。这样你就能自由的管理自己的图片了~',

      target: () => workspaceStep.value && workspaceStep.value.$el,
    },
    {
      title: '画图区域',
      placement: 'right',
      description:
        '这里对应的是Midjourney 的命令行作图功能，具体可以分别点开进行看看。每个操作旁边的小标签都写着说明~',

      target: () => workspaceStep.value && workspaceStep.value.$el,
    },
    {
      title: '填写Prompt',
      placement: 'right',
      description:
        '这里输入你的关键词，如果不知道写什么可以试试AI生成。这里也自己输入参数或者使手选指定的参数。如果手写的话，后面选定的不再生效！',

      target: () => promptStep.value && promptStep.value.$el,
    },
    {
      title: '垫图',
      placement: 'right',
      description: '你如果想生成的图有个参照分格，可以试着上传一个图片！',

      target: () => blendStep.value && blendStep.value.$el,
    },
    {
      title: '小工具',
      description: '这里有翻译、AI联想、3600+风格关键词.',
      placement: 'right',
      target: () => toolsStep.value && toolsStep.value.$el,
    },
    {
      title: '选定执行账号与频道',
      description: '选好执行任务的账号或者频道，并填写你要自动跑的次数。不填则使用默认账号',
      placement: 'right',
      target: () => accountInfoStep.value && accountInfoStep.value.$el,
    },
    {
      title: '启动',
      description: '立即执行的任务开始你的Midjourney旅程吧！',
      placement: 'right',
      target: () => button.value && button.value.$el,
    },
  ],
});
export const indexStep = ref({
  stepCurrent: 0,
  stepOpen: false,
  steps: [
    {
      title: '导入历史记录',
      placement: 'right',
      description: '这里你可以选择导入历史的Discord作图记录进行管理',

      target: () => importDiscordStep.value && importDiscordStep.value.$el,
    },
    {
      title: '管理工作空间',
      placement: 'right',
      description:
        '你可以管理相关的工作空间，每个空间之间的任务相互隔离。这样你就能自由的管理自己的图片了~',

      target: () => workspaceStep.value && workspaceStep.value.$el,
    },
    {
      title: '画图区域',
      placement: 'right',
      description:
        '这里对应的是Midjourney 的命令行作图功能，具体可以分别点开进行看看。每个操作旁边的小标签都写着说明~',

      target: () => workspaceStep.value && workspaceStep.value.$el,
    },
  ],
});
export const drawToTextStep = ref({
  stepCurrent: 0,
  stepOpen: false,
  steps: [
    {
      title: '填写Prompt',
      placement: 'right',
      description:
        '这里输入你的关键词，如果不知道写什么可以试试AI生成。这里也自己输入参数或者使手选指定的参数。如果手写的话，后面选定的不再生效！',

      target: () => promptStep.value && promptStep.value.$el,
    },
    {
      title: '垫图',
      placement: 'right',
      description: '你如果想生成的图有个参照分格，可以试着上传一个图片！',

      target: () => blendStep.value && blendStep.value.$el,
    },
    {
      title: '小工具',
      description: '这里有翻译、AI联想、3600+风格关键词.',
      placement: 'right',
      target: () => toolsStep.value && toolsStep.value.$el,
    },
    {
      title: '选定执行账号与频道',
      description: '选好执行任务的账号或者频道，并填写你要自动跑的次数。不填则使用默认账号',
      placement: 'right',
      target: () => accountInfoStep.value && accountInfoStep.value.$el,
    },
    {
      title: '启动',
      description: '立即执行的任务开始你的Midjourney旅程吧！',
      placement: 'right',
      target: () => button.value && button.value.$el,
    },
  ],
});
