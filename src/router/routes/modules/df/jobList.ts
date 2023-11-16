import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const jobList: AppRouteModule = {
  path: '/jobList',
  name: 'JobList',
  component: LAYOUT,
  redirect: '/jobList/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ant-design:comment-outlined',
    title: t('routes.app.jobList.pageTitle'),
    orderNo: 40,
    hideMenu: true,
    ignoreKeepAlive: true,
  },
  children: [
    {
      path: 'index/:spaceId/:spaceTitle',
      name: 'JobListPage',
      component: () => import('/@/views/df/mj/mobile/jobList.vue'),
      meta: {
        icon: 'ant-design:comment-outlined',
        title: t('routes.app.jobList.pageTitle'),
        hideMenu: true,
      },
    },
  ],
};

export default jobList;
