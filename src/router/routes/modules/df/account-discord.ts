import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const accDiscord: AppRouteModule = {
  path: '/accDiscord',
  name: 'AccDiscord',
  component: LAYOUT,
  redirect: '/accDiscord/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'mdi:table-account',
    title: t('routes.app.account.pageTitle'),
    orderNo: 40,
  },
  children: [
    {
      path: 'index',
      name: 'AccDiscordPage',
      component: () => import('/@/views/df/discord/index.vue'),
      meta: {
        icon: 'mdi:table-account',
        title: t('routes.app.account.pageTitle'),
        hideMenu: true,
      },
    },
  ],
};

export default accDiscord;
