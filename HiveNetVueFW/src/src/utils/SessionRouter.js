/**
 * 会话级别的路由处理
 */
import cache from '@/plugins/cache';
import { getRouter, getGlobalComponent } from '@/utils/base/global';

const SessionRoutersKey = 'SessionRouters';

/**
 * 根据路由信息创建路由对象
 * @param {JSON} routeInfo - 路由信息
 *   {
 *     name: '', // 路由名称
 *     path: '', // 路由路径
 *     componentName: '', // 组件名（全局注册控件）
 *     props: {}, // 组件传参
 *     query: {}, // 路由参数
 *     params: {}, // 对象属性
 *     meta: {},
 *     children: [...] // 可以支持嵌套路由，格式一样
 *   }
 * @returns {JSON} - 标准路由对象
 */
function generateRouterItem(routeInfo) {
  const routerItem = {
    path: routeInfo.path,
    component: getGlobalComponent(routeInfo.componentName)
  };
  if (routeInfo.name !== undefined) routerItem.name = routeInfo.name;
  if (routeInfo.props !== undefined) routerItem.props = routeInfo.props;
  if (routeInfo.query !== undefined) routerItem.query = routeInfo.query;
  if (routeInfo.params !== undefined) routerItem.params = routeInfo.params;
  if (routeInfo.meta !== undefined) routerItem.meta = routeInfo.meta;
  if (routeInfo.children !== undefined) {
    routerItem.children = [];
    for (const chidlrenRouteInfo of routeInfo.children) {
      routerItem.children.push(generateRouterItem(chidlrenRouteInfo));
    }
  }
  return routerItem;
}

/**
 * 获取路由的真实访问path
 * @param {*} routeInfo
 * @returns {string} - 返回访问路径
 */
function getRealPath(routeInfo) {
  if (!routeInfo.path.startsWith('/')) {
    routeInfo.path = '/' + routeInfo.path;
  }
  let realPath = routeInfo.path;
  if (routeInfo.children !== undefined) {
    // 递归获取子节点路径
    realPath += '/' + getRealPath(routeInfo.children[0]);
  }
  return realPath;
}

/**
 * 将路由信息添加到会话路由
 * @param {JSON} routeInfo - 路由信息
 *   {
 *     name: '', // 路由名称
 *     path: '', // 路由路径
 *     componentName: '', // 组件名（全局注册控件）
 *     props: {}, // 组件传参
 *     query: {}, // 路由参数
 *     params: {}, // 对象属性
 *     meta: {},
 *     children: [...] // 可以支持嵌套路由，格式一样, 注意只支持一个children
 *   }
 * @param {string} sysId - Session对应的系统标识，如果需要区分多个系统，可以传入该值
 */
export const addSessionRoute = (routeInfo, sysId) => {
  const addSysId = sysId === undefined ? '' : sysId;
  const sessionRouters = cache.session.getJSON(addSysId + SessionRoutersKey) || {};
  const selfRouteInfo = Object.assign({}, routeInfo);
  sessionRouters[getRealPath(selfRouteInfo)] = selfRouteInfo;
  cache.session.setJSON(addSysId + SessionRoutersKey, sessionRouters);
};

/**
 * 删除会话路由
 * @param {string} path - 路由路径
 * @param {string} sysId - Session对应的系统标识，如果需要区分多个系统，可以传入该值
 */
export const removeSessionRoute = (path, sysId) => {
  const addSysId = sysId === undefined ? '' : sysId;
  const sessionRouters = cache.session.getJSON(addSysId + SessionRoutersKey) || {};
  if (sessionRouters[path] !== undefined) {
    delete sessionRouters[path];
    cache.session.setJSON(addSysId + SessionRoutersKey, sessionRouters);
  }
};

/**
 * 清除所有会话路由
 * @param {string} sysId - Session对应的系统标识，如果需要区分多个系统，可以传入该值
 */
export const clearSessionRoutes = (sysId) => {
  const addSysId = sysId === undefined ? '' : sysId;
  cache.session.remove(addSysId + SessionRoutersKey);
};

/**
 * 检查当前路由是否会话路由
 * @param {string} path - 当前路由路径
 * @param {string} sysId - Session对应的系统标识，如果需要区分多个系统，可以传入该值
 */
export const isSessionRoute = (path, sysId) => {
  const addSysId = sysId === undefined ? '' : sysId;
  const sessionRouters = cache.session.getJSON(addSysId + SessionRoutersKey) || {};
  const routeInfo = sessionRouters[path];
  if (routeInfo !== undefined) {
    return true;
  } else {
    return false;
  }
};

/**
 * 将会话路由添加到当前路由
 * @param {string} path - 要添加的路由路径
 * @param {string} sysId - Session对应的系统标识，如果需要区分多个系统，可以传入该值
 */
export const addSessionRouteToRouter = (path, sysId) => {
  const addSysId = sysId === undefined ? '' : sysId;
  const router = getRouter();
  const sessionRouters = cache.session.getJSON(addSysId + SessionRoutersKey) || {};
  const routeInfo = sessionRouters[path];
  if (routeInfo !== undefined) {
    // 检查路由是否已存在
    if (routeInfo.name) {
      if (router.hasRoute(routeInfo.name)) {
        // 路由已存在
        return;
      }
    }
    // 生成路由对象并添加
    const routerItem = generateRouterItem(routeInfo);
    router.addRoute(routerItem);
  }
};
