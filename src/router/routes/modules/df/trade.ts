import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const trade: AppRouteModule = {
  path: '/trade',
  name: 'Trade',
  component: LAYOUT,
  redirect: '/trade/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'icon-park-outline:order',
    title: t('routes.app.trade.pageTitle'),
    orderNo: 42,
    hideMenu: true,
  },
  children: [
    {
      path: 'index',
      name: 'tradePage',
      component: () => import('/@/views/df/trade/index.vue'),
      meta: {
        title: t('routes.app.trade.pageTitle'),
        icon: 'icon-park-outline:order',
        hideMenu: true,
      },
    },
  ],
};

export default trade;
