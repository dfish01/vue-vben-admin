import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const collect: AppRouteModule = {
  path: '/public',
  name: 'Public',
  component: LAYOUT,
  redirect: '/public/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'gis:earth-north',
    title: t('routes.app.public.pageTitle'),
    orderNo: 21,
    ignoreKeepAlive: true,
  },
  children: [
    {
      path: 'index',
      name: 'publicPage',
      component: () => import('/@/views/df/public/index.vue'),
      meta: {
        title: t('routes.app.public.pageTitle'),
        icon: 'gis:earth-north',
        hideMenu: true,
        ignoreKeepAlive: true,
      },
    },
  ],
};

export default collect;
