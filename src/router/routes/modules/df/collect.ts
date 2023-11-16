import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const collect: AppRouteModule = {
  path: '/collect',
  name: 'Collect',
  component: LAYOUT,
  redirect: '/collect/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'icon-park-twotone:collect-picture',
    title: t('routes.app.collect.pageTitle'),
    orderNo: 21,
    ignoreKeepAlive: true,
  },
  children: [
    {
      path: 'index',
      name: 'collectPage',
      component: () => import('/@/views/df/collect/index.vue'),
      meta: {
        title: t('routes.app.collect.pageTitle'),
        icon: 'icon-park-twotone:collect-picture',
        hideMenu: true,
        ignoreKeepAlive: true,
      },
    },
  ],
};

export default collect;
