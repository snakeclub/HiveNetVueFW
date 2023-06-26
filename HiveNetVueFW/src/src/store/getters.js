// 需要通过toRaw处理Proxy对象
import { toRaw } from '@vue/reactivity';

const getters = {
  // 用户信息相关
  userId: state => state.user.userId,
  token: state => state.user.token,
  tokenExpires: state => state.user.tokenExpires,
  name: state => state.user.name,
  avatar: state => state.user.avatar,
  rights: state => state.user.rights,

  // 菜单相关
  staticMenusConfig: state => toRaw(state.menus.staticMenusConfig),
  menusIsRefresh: state => state.menus.isRefresh,
  menusIsLoaded: state => state.menus.isLoaded,
  sidebarMenus: state => toRaw(state.menus.sidebarMenus),
  sidebarMenusIndex: state => toRaw(state.menus.sidebarMenusIndex),
  sidebarTopNavModeMenus: state => toRaw(state.menus.sidebarTopNavModeMenus),
  rightMenus: state => toRaw(state.menus.rightMenus),
  rightMenusIndex: state => toRaw(state.menus.rightMenusIndex),
  fixedTags: state => toRaw(state.menus.fixedTags),
  fixedTagsIndex: state => toRaw(state.menus.fixedTagsIndex),

  // 主框架相关
  layoutIsRefresh: state => state.layoutSettings.isRefresh,
  layoutForceRefreshThemes: state => state.layoutSettings.forceRefreshThemes,

  // 路由相关

  // app 相关
  sysId: state => state.app.sysId,
  sysName: state => state.app.sysName,
  logo: state => state.app.logo,
  showCopyright: state => state.app.showCopyright,
  sidebar: state => state.app.sidebar,
  activeTopNavMenu: state => state.app.activeTopNavMenu,
  size: state => state.app.size,
  device: state => state.app.device,
  lang: state => state.app.lang,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  activeView: state => state.tagsView.activeView,

  introduction: state => state.user.introduction, // 待处理
  permission_routes: state => state.permission.routes,
  topbarRouters: state => state.permission.topbarRouters,
  defaultRoutes: state => state.permission.defaultRoutes,
  sidebarRouters: state => state.permission.sidebarRouters
};

export default getters;
