import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const settings: AppRouteModule = {
  path: '/setting',
  name: 'Setting',
  component: LAYOUT,
  redirect: '/setting/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'icon-park-twotone:people-safe',
    title: t('routes.app.setting.pageTitle'),
    orderNo: 100,
    ignoreKeepAlive: true,
  },
  children: [
    {
      path: 'index',
      name: 'SettingPage',
      component: () => import('/@/views/df/setting/index.vue'),
      meta: {
        title: t('routes.app.setting.pageTitle'),
        icon: 'icon-park-twotone:people-safe',
        hideMenu: true,
        ignoreKeepAlive: true,
      },
    },
  ],
};

export default settings;
