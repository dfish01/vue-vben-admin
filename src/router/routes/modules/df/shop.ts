import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const shop: AppRouteModule = {
  path: '/shop',
  name: 'Shop',
  component: LAYOUT,
  redirect: '/shop/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ph:shopping-cart-bold',
    title: t('routes.app.shop.pageTitle'),
    orderNo: 42,
    // hideMenu: true,
  },
  children: [
    {
      path: 'index',
      name: 'ShopPage',
      component: () => import('/@/views/df/shop/shop_pc.vue'),
      meta: {
        icon: 'ph:shopping-cart-bold',
        title: t('routes.app.shop.pageTitle'),
        hideMenu: true,
      },
    },
  ],
};

export default shop;
