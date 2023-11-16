import { FormSchema } from '/@/components/Form/index';
import { ref } from 'vue';

export interface commandParam {
  command: string;
  description: string;
  descriptionCN: string;
  value: string;
}

// 基础参数
export const commonParamDesc = ref({
  aspect: {
    command: '--aspect',
    description: 'Change the aspect ratio of a generation.',
    descriptionCN: '更改生成的纵横比。',
  },
  chaos: {
    command: '--chaos <number 0–100>',
    description:
      'Change how varied the results will be. Higher values produce more unusual and unexpected generations.',
    descriptionCN: '更改结果的多样性。较高的值会产生更多不寻常和意外的生成。',
  },
  fast: {
    command: '--fast',
    description: 'Override your current setting and run a single job using Fast Mode.',
    descriptionCN: '覆盖当前设置并使用快速模式运行单个任务。',
  },
  imageWeight: {
    command: '--iw <0–2>',
    description: 'Sets image prompt weight relative to text weight. The default value is 1.',
    descriptionCN: '设置图像提示权重相对于文本权重。默认值为1。',
  },
  no: {
    command: '--no',
    description: 'Negative prompting, would try to remove plants from the image.',
    descriptionCN: '负面提示，会尝试从图像中去除植物。',
  },
  quality: {
    command: '--quality <.25, .5, or 1>',
    description:
      'How much rendering quality time you want to spend. The default value is 1. Higher values use more GPU minutes; lower values use less.',
    descriptionCN:
      '您希望花费多少渲染质量时间。默认值为1。较高的值使用更多的GPU分钟；较低的值使用较少。',
  },
  relax: {
    command: '--relax',
    description: 'Override your current setting and run a single job using Relax Mode.',
    descriptionCN: '覆盖当前设置并使用放松模式运行单个任务。',
  },
  repeat: {
    command: '--repeat <1–40>',
    description:
      'Create multiple Jobs from a single prompt. is useful for quickly rerunning a job multiple times.',
    descriptionCN: '从单个提示创建多个任务。对于快速重新运行多次任务很有用。',
  },
  seed: {
    command: '--seed <integer between 0–4294967295>',
    description:
      'The Midjourney bot uses a seed number to create a field of visual noise, like television static, as a starting point to generate the initial image grids. Seed numbers are generated randomly for each image but can be specified with the --seed or --sameseed parameter. Using the same seed number and prompt will produce similar ending images.',
    descriptionCN:
      'Midjourney机器人使用种子数字来创建一个视觉噪声字段，如电视静态，作为生成初始图像网格的起点。每个图像随机生成种子数字，但可以使用--seed或--sameseed参数指定。使用相同的种子数字和提示将产生相似的结束图像。',
  },
  stop: {
    command: '--stop <integer between 10–100>',
    description:
      'Use the parameter to finish a Job partway through the process. Stopping a Job at an earlier percentage can create blurrier, less detailed results.',
    descriptionCN:
      '使用该参数在过程中部分完成任务。在较早的百分比停止任务可能会产生模糊，细节较少的结果。',
  },
  stylize: {
    command: '--stylize <number>',
    description:
      "Parameter influences how strongly Midjourney's default aesthetic style is applied to Jobs.",
    descriptionCN: '参数影响Midjourney的默认审美风格如何强烈地应用于任务。',
  },
  tile: {
    command: '--tile',
    description:
      'Parameter generates images that can be used as repeating tiles to create seamless patterns.',
    descriptionCN: '参数生成可用作重复瓷砖以创建无缝图案的图像。',
  },
  turbo: {
    command: '--Turbo',
    description: 'Override your current setting and run a single job using Turbo Mode.',
    descriptionCN: '覆盖当前设置并使用Turbo模式运行单个任务。',
  },
  weird: {
    command: '--Weird <number 0–3000>',
    description: 'Explore unusual aesthetics with the experimental parameter.',
    descriptionCN: '使用实验参数探索不寻常的美学。',
  },
});

const models = {
  common: common,
  niji: {
    version: {
      command: '--version <1, 2, 3, 4, 5, 5.1, or 5.2>',
      description: 'Use a different version of the Midjourney algorithm.',
      descriptionCN: '使用Midjourney算法的不同版本。',
    },
    nijiModel: {
      command: '--niji',
      description: 'An alternative model focused on anime-style images.',
      descriptionCN: '一个专注于动漫风格图像的替代模型。',
    },
  },
  mj5_2: {
    style: {
      command: '--style <raw>',
      description: 'Switch between versions of the Midjourney Model Version 5.1 and 5.2.',
      descriptionCN: '在Midjourney模型版本5.1和5.2之间切换。',
    },
  },
  mj5_1: {
    style: {
      command: '--style <raw>',
      description: 'Switch between versions of the Midjourney Model Version 5.1.',
      descriptionCN: '在Midjourney模型版本5.1之间切换。',
    },
  },
  mj5: {
    style: {
      command: '--style <raw>',
      description: 'Switch between versions of the Midjourney Model Version 5.',
      descriptionCN: '在Midjourney模型版本5之间切换。',
    },
  },
  mj4: {
    style: {
      command: '--style <4a, 4b, or 4c>',
      description: 'Switch between versions of the Midjourney Model Version 4.',
      descriptionCN: '在Midjourney模型版本4之间切换。',
    },
  },
};
