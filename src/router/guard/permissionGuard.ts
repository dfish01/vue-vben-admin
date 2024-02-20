import type { Router, RouteRecordRaw } from 'vue-router';

import { usePermissionStoreWithOut } from '/@/store/modules/permission';

import { PageEnum } from '/@/enums/pageEnum';
import { useUserStoreWithOut } from '/@/store/modules/user';

import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';

import { RootRoute } from '/@/router/routes';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const ROOT_PATH = RootRoute.path;

// 定义白名单页面，无需登录即可访问的页面
const whitePathList: PageEnum[] = [
  PageEnum.VERIFY_PAGE,
  PageEnum.COLLECT_SHARE_PAGE,
  PageEnum.XHS_PAGE,
  LOGIN_PATH,
];

export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWithOut();
  const permissionStore = usePermissionStoreWithOut();
  // 路由前置守卫，用于权限控制
  router.beforeEach(async (to, from, next) => {
    // 如果是从根路径跳转到首页，并且用户有自定义的首页路径，则重定向到用户的首页路径
    if (
      from.path === ROOT_PATH &&
      to.path === PageEnum.BASE_HOME &&
      userStore.getUserInfo.homePath &&
      userStore.getUserInfo.homePath !== PageEnum.BASE_HOME
    ) {
      next(userStore.getUserInfo.homePath);
      return;
    }

    let token = userStore.getToken;
    const isAnonymous = !token;
    if (!token) {
      //设置一个test token
      token = 'TEST_nishi26z';
      userStore.setToken(token);
    }

    // 白名单页面可以直接访问，无需登录
    if (whitePathList.includes(to.path as PageEnum)) {
      console.log(11111);
      if (to.path === LOGIN_PATH && token) {
        // 如果用户已登录且访问的是登录页面，则尝试执行登录后操作，并重定向到指定页面
        const isSessionTimeout = userStore.getSessionTimeout;
        try {
          await userStore.afterLoginAction();
          if (!isSessionTimeout) {
            next((to.query?.redirect as string) || '/');
            return;
          }
        } catch {
          //
        }
      }
      next();
      return;
    }

    // 如果用户未登录，且访问的页面不在白名单中，则重定向到登录页面
    if (!token) {
      // You can access without permission. You need to set the routing meta.ignoreAuth to true
      if (to.meta.ignoreAuth) {
        next();
        return;
      }

      // redirect login page
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      };
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }
      next(redirectData);
      return;
    }

    // 处理从登录页面跳转到404页面的情况
    if (
      from.path === LOGIN_PATH &&
      to.name === PAGE_NOT_FOUND_ROUTE.name &&
      to.fullPath !== (userStore.getUserInfo.homePath || PageEnum.BASE_HOME)
    ) {
      next(userStore.getUserInfo.homePath || PageEnum.BASE_HOME);
      return;
    }

    console.log(111);

    // 如果用户信息尚未获取，则先获取用户信息
    if (userStore.getLastUpdateTime === 0 && !isAnonymous) {
      try {
        await userStore.getUserInfoAction();
      } catch (err) {
        next();
        return;
      }
    }

    // 如果已动态添加过路由，则直接放行
    if (permissionStore.getIsDynamicAddedRoute) {
      next();
      return;
    }

    // 构建权限路由
    const routes = await permissionStore.buildRoutesAction();
    // 将构建好的权限路由添加到路由表中
    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw);
    });

    // 添加404页面路由
    router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);

    // 标记为已动态添加过路由
    permissionStore.setDynamicAddedRoute(true);

    if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
      // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
      next({ path: to.fullPath, replace: true, query: to.query });
    } else {
      // 处理登录后重定向
      const redirectPath = (from.query.redirect || to.path) as string;
      const redirect = decodeURIComponent(redirectPath);
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
      next(nextData);
    }
  });
}
