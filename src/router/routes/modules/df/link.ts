import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const link: AppRouteModule = {
  path: '/tools-link',
  name: 'ToolsLink',
  component: LAYOUT,
  redirect: '/tools-link/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ant-design:idcard-outlined',
    title: t('routes.app.xhongs.pageTitle'),
    orderNo: 40,
    hideMenu: true,
  },
  children: [
    {
      path: 'index',
      name: 'ToolsLinkPage',
      component: () => import('/@/views/df/tools/link/index.vue'),
      meta: {
        icon: 'ant-design:idcard-outlined',
        title: t('routes.app.xhongs.pageTitle'),
        hideMenu: true,
      },
    },
  ],
};

export default link;
