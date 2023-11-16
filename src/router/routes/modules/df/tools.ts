import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const IFrame = () => import('/@/views/sys/iframe/FrameBlank.vue');

const tools: AppRouteModule = {
  path: '/prompt',
  name: 'Prompt',
  component: LAYOUT,
  redirect: '/prompt/index',
  meta: {
    orderNo: 20,
    icon: 'ant-design:coffee-outlined',
    title: t('routes.mj.tools'),
    hideMenu: true,
  },

  children: [
    {
      path: 'index',
      name: 'PromptIndex',
      component: IFrame,
      meta: {
        frameSrc: 'https://ai.sppinfo.cn/',
        // frameSrc: 'https://prompt.noonshot.com/',
        icon: 'ant-design:coffee-outlined',
        title: t('routes.mj.tools'),
        hideMenu: true,
      },
    },
  ],
};

export default tools;
