import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const example: AppRouteModule = {
  path: '/example',
  name: 'Example',
  component: LAYOUT,
  redirect: '/example/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'streamline:ecology-science-alien-extraterristerial-life-form-space-universe-head',
    title: t('routes.app.example.pageTitle'),
    orderNo: 21,
  },
  children: [
    {
      path: 'index',
      name: 'examplePage',
      component: () => import('/@/views/df/example/index.vue'),
      meta: {
        title: t('routes.app.example.pageTitle'),
        icon: 'streamline:ecology-science-alien-extraterristerial-life-form-space-universe-head',
        hideMenu: true,
      },
    },
  ],
};

export default example;
