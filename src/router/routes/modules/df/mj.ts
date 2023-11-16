import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const mj: AppRouteModule = {
  path: '/mj',
  name: 'mj',
  component: LAYOUT,
  redirect: '/mj/index',
  meta: {
    hideChildrenInMenu: true,

    icon: 'pepicons-pencil:paint-pallet',
    title: t('routes.app.mj.pageTitle'),
    orderNo: 10,
  },
  children: [
    {
      path: 'index',
      name: 'mjPage',
      component: () => import('/@/views/df/mj/index.vue'),
      meta: {
        title: t('routes.app.mj.pageTitle'),
        icon: 'pepicons-pencil:paint-pallet',
        hideMenu: true,
      },
    },
  ],
};

export default mj;
