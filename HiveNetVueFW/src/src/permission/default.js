/**
 * 默认路由权限控制
 */
import router from '@/router/index.js';
import store from '@/store/index.js';
import apiCall from '@/api'; // 加载api模块
import NProgress from 'nprogress'; // 页面跳转顶部进度条
import 'nprogress/nprogress.css';
import settings from '@/settings';
import { isSessionRoute, addSessionRouteToRouter } from '@/utils/SessionRouter';
import { tagsViewFuns, getLayoutRefreshCache, getRefreshTagsViewRoute } from '@/utils/actions/TagsViewFuns';
import { changeThemesBySysID } from '@/utils/actions/LayoutSettings';
import authActions from '@/utils/actions/auth';

NProgress.configure({ showSpinner: false });

// 指定无需登录验证的白名单
const whiteList = ['/login', '/auth-redirect', '/bind', '/register', '/test'];

// 每个路由跳转前要进行的处理
router.beforeEach((to, from, next) => {
  NProgress.start(); // 启动加载进度条

  // 判断是否页面刷新, 重新刷新菜单, 生成对应的路由
  if (store.getters.menusIsRefresh && store.getters.menusIsLoaded) {
    store.commit('menus/SET_IS_REFRESH', false);
    store.dispatch('menus/setMenus', {
      sidebarMenus: store.getters.sidebarMenus,
      rightMenus: store.getters.rightMenus,
      fixedTags: store.getters.fixedTags
    }).then(() => {
      // 判断是否需要刷新页签
      if (store.getters.visitedViews.length > 0) {
        // 是刷新情况, 清空页签然后重新初始化
        const tempVisitedViews = store.getters.visitedViews;
        store.commit('tagsView/CLEAR_VIEW_INFO');

        // 重新初始化
        tagsViewFuns.initFixedTags();
        // 重新装载非固定页签
        tempVisitedViews.forEach(view => {
          if (view.meta.type !== 'fixedTag') {
            store.commit('tagsView/ADD_VISITED_VIEW', view);
            store.commit('tagsView/ADD_CACHED_COMPONENTS', view);
          }
        });
      }
      next({ ...to, replace: true });
      console.debug('完成路由重新生成, 重新跳转', to);
      return;
    }).catch(errorInfo => {
      console.error('reset router error:', errorInfo);
      next({ path: '/500' }); // 跳转到服务器内部错误
      NProgress.done();
      console.debug('路由重新生成失败', to);
    });
    console.debug('执行重新刷新菜单，生成路由', to);
    return;
  }

  // 如果目标路由有title，则设置页面title
  to.meta.title && store.dispatch('layoutSettings/setTitle', to.meta.title);

  // 需支持多应用，从路由中解析系统标识
  let sysId = ''; // 路由中的系统标识
  if (settings.app.mutipleAppSupport) {
    if (to.query && to.query.sysId) {
      sysId = to.query.sysId;
    } else {
      // 从path中获取系统标识
      const pathIndex = to.path.split('/');
      let tempPath = pathIndex[0];
      if (tempPath === '' && pathIndex.length > 1) tempPath = pathIndex[1];
      if (tempPath.startsWith('sys-')) {
        sysId = tempPath.substr(4);
      } else {
        // 在路由中获取不到系统标识，尝试从store中获取
        sysId = store.getters.sysId;
      }
    }
  }

  // 加载静态菜单
  if (!store.getters.menusIsLoaded) {
    if (settings.app.getMenusType === 'static') {
      // 直接加载静态菜单
      store.dispatch('menus/setMenus', settings.app.staticMenusConfig).then(() => {
        nextSupportRefresh(to, from, next);
        console.debug('设置静态菜单完成', to);
      }).catch(errorInfo => {
        console.error('set static menus error:', errorInfo);
        next({ path: '/500' }); // 跳转到服务器内部错误
        NProgress.done();
        console.debug('设置静态菜单失败', to);
      });
      console.debug('执行设置静态菜单完成', to);
      return;
    } else if (settings.app.getMenusType === 'api') {
      // 通过api接口获取菜单信息
      apiCall(
        'getMenusConfig', {}
      ).then(resData => {
        // 成功获取菜单信息的处理
        store.dispatch('menus/setMenus', resData.body).then(() => {
          nextSupportRefresh(to, from, next);
          console.debug('设置API菜单完成', to);
        });
      }).catch(errorInfo => {
        console.error('get menus from api error:', errorInfo);
        next({ path: '/500' }); // 跳转到服务器内部错误
        NProgress.done();
        console.debug('设置API菜单失败', to);
      });
      console.debug('执行设置API菜单完成', to);
      return;
    }
  }

  // 判断处理登录状态
  const token = store.getters.token; // 通过token判断是否已登录
  if (settings.app.loginManageType != 'no') {
    // 没有登录信息的情况, 已登录或匿名时获取用户信息, 同步更新菜单
    if (store.getters.name === '' || (sysId !== '' && sysId !== store.getters.sysId)) {
      if (token || settings.app.loginManageType === 'anonymous') {
        authActions.getUserInfo({ sysId: sysId }).then(() => {
          nextSupportRefresh(to, from, next);
          console.debug('设置登录用户菜单完成', to);
        }).catch(errorInfo => {
          console.error('logout, beforeEach getUserInfo error:', errorInfo);
          authActions.logout().then(() => {
            next({ path: '/' });
            console.debug('设置登录用户菜单失败登出后跳转', to);
          });
          console.debug('设置登录用户菜单失败', to);
        });
        console.debug('执行设置登录用户菜单完成', to);
        return;
      }
    }
  }

  // 其他的路由处理
  if (token && to.path === '/login') {
    // 登录页面跳转到首页
    next({ path: '/' });
    NProgress.done();
    console.debug('登录页面跳转到首页');
  } else if (whiteList.indexOf(to.path) !== -1 || getRouteMetaValue(to.meta, 'isWhiteList', false)) {
    // 在免登录白名单，直接进入
    next();
    console.debug('在免登录白名单，直接进入');
  } else if (!token && settings.app.loginManageType === 'log') {
    // 未登录, 并且登录管理模式是要求登录后才能访问
    if (!getRouteMetaValue(to.meta, 'isLayoutTag', true)) {
      // 会话路由页面，没有登录则直接跳转到401无权限的页面
      next('/401');
      NProgress.done();
      console.debug('会话路由页面，没有登录则直接跳转到401无权限的页面', to);
    } else {
      next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页, 带着跳转路径
      NProgress.done();
      console.debug('非会话路由页面，没有登录跳转到登录页面', to);
    }
  } else if (!getRouteMetaValue(to.meta, 'isLayoutTag', true) || isSessionRoute(to.path, sysId)) {
    // 是会话路由
    if (router.resolve(to).matched.length > 0) {
      // 可以匹配上路由，直接进入
      next();
      console.debug('是会话路由，匹配上路由直接进入', to);
    } else {
      // 需要动态添加路由
      addSessionRouteToRouter(to.path, sysId);
      next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
      console.debug('是会话路由，动态添加后跳转', to);
    }
  } else {
    // 本地已有权限清单，直接执行跳转
    next();
    console.debug('本地有权限直接跳转', to);
    return;
  }
});

// 每次路由跳转完成执行函数
router.afterEach((to, from) => {
  // 判断和设置系统样式
  changeThemesBySysID();
  NProgress.done();
  console.debug('afterEach');
});

/**
 * 获取路由meta的指定值
 * @param {*} key - 要取值的key
 * @param {*} defaultValue - 默认值
 *
 * @returns {any} - 值
 */
function getRouteMetaValue(meta, key, defaultValue) {
  if (meta && meta[key] !== undefined) {
    return meta[key];
  } else {
    return defaultValue;
  }
}

/**
 * 支持浏览器刷新的next函数
 * @param {*} to
 * @param {*} from
 * @param {*} next
 */
function nextSupportRefresh(to, from, next) {
  // 需要支持浏览器刷新
  const sysId = store.getters.sysId;
  let lastVisitedTagsView;
  if (settings.app.browserRefreshSupport) {
    if (from.path === '/') {
      // 通过from判断是否刷新动作
      lastVisitedTagsView = getLayoutRefreshCache(sysId);
    }
  }
  let refreshRoute;
  if (lastVisitedTagsView) {
    refreshRoute = getRefreshTagsViewRoute(to.path, to.query, lastVisitedTagsView);
  }

  if (refreshRoute) {
    // 找到要刷新的路由信息
    next({ ...refreshRoute, replace: true });
  } else {
    next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
  }
}

