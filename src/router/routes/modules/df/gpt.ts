import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const chatgpt: AppRouteModule = {
  path: '/chatgpt',
  name: 'Chatgpt',
  component: LAYOUT,
  redirect: '/chatgpt/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'arcticons:openai-chatgpt',
    title: t('routes.app.gpt.pageTitle'),
    orderNo: 25,
  },
  children: [
    {
      path: 'index',
      name: 'ChatgptPage',
      component: () => import('/@/views/df/chatgpt/index.vue'),
      meta: {
        icon: 'arcticons:openai-chatgpt',
        title: t('routes.app.gpt.pageTitle'),
        hideMenu: true,
      },
    },
  ],
};

export default chatgpt;
