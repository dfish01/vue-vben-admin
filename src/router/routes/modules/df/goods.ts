import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const goods: AppRouteModule = {
  path: '/goods',
  name: 'Goods',
  component: LAYOUT,
  redirect: '/goods/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ph:shopping-cart-bold',
    title: t('routes.app.goods.pageTitle'),
    orderNo: 40,
    hideMenu: true,
  },
  children: [
    {
      path: 'index',
      name: 'GoodsPage',
      component: () => import('/@/views/df/goods/index.vue'),
      meta: {
        icon: 'ph:shopping-cart-bold',
        title: t('routes.app.goods.pageTitle'),
        hideMenu: true,
      },
    },
  ],
};

export default goods;
