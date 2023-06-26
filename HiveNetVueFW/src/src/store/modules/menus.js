/**
 * 功能主界面的菜单相关视图数据
 */
import { nanoid } from 'nanoid';
import settings from '@/settings';
import router from '@/router/index.js';
import Layout from '@/components/view/layout/index'; // 首页主框架组件
import { getStore, getGlobalComponent } from '@/utils/base/global';
import { addSessionRoute } from '@/utils/SessionRouter';

const state = {
  staticMenusConfig: [], // 静态菜单配置
  isLoaded: false, // 判断菜单是否已加载
  isRefresh: false, // 判断是否页面刷新
  sidebarMenus: [], // 用户左侧主菜单，格式见./src/api/config/user.js 的 getUserInfo 定义
  sidebarMenusIndex: {}, // 用户左侧菜单的一维索引，格式见 generateMenusIndex 的返回值
  sidebarTopNavModeMenus: {}, // TopNav菜单模式的菜单配置，key为一级菜单名，value为对应的子菜单列表
  sidebarDelRoutesIndex: [], // 左侧菜单的动态路由删除索引
  rightMenus: [], // 右边顶端菜单，格式见./src/api/config/user.js 的 getUserInfo 定义
  rightMenusIndex: {}, // 右边顶端菜单的一维索引，格式见 generateMenusIndex 的返回值
  rightMenusDelRoutesIndex: [], // 右上角菜单的动态路由删除索引
  fixedTags: [], // 固定页签清单，格式见./src/api/config/user.js 的 getUserInfo 定义
  fixedTagsIndex: {}, // 固定页签索引，格式见 generateFixedTagsIndex 的返回值
  fixedTagsDelRoutesIndex: [] // 固定页签的动态路由删除索引
};

const mutations = {
  // 更新静态菜单配置
  SET_STATIC_MENUS_CONFIG: (state, config) => {
    state.staticMenusConfig = config;
  },

  // 设置菜单已加载的标志
  SET_IS_LOADED: (state, isLoaded) => {
    state.isLoaded = isLoaded;
  },

  // 设置是否页面刷新标记
  SET_IS_REFRESH: (state, isRefresh) => {
    state.isRefresh = isRefresh;
  },

  // 设置左侧菜单清单, sidebarMenus格式见./src/api/config/user.js 的 getUserInfo 定义
  SET_SIDEBAR_MENUS: (state, sidebarMenus) => {
    // 删除原来生成的路由
    state.sidebarDelRoutesIndex.forEach(routeName => {
      router.removeRoute(routeName);
    });

    // 处理菜单信息及生成菜单路由
    const tempSidebarMenus = sidebarMenus === undefined ? [] : sidebarMenus.sort(sortByOrderFiled);
    const sidebarRoutes = generateRoutersByMenus(
      tempSidebarMenus, '', '', true, false, false, 'sidebar'
    );

    // 设置菜单, 以及生成菜单对应的查询索引对象
    state.sidebarMenus = tempSidebarMenus;
    state.sidebarTopNavModeMenus = generateSidebarTopNavModeMenus(state.sidebarMenus);
    state.sidebarMenusIndex = generateMenusIndex(state.sidebarMenus);

    // 添加菜单项到路由
    state.sidebarDelRoutesIndex = [];
    for (let i = 0; i < sidebarRoutes.length; i++) {
      router.addRoute(sidebarRoutes[i]); // 动态添加可访问路由表
      state.sidebarDelRoutesIndex.push(sidebarRoutes[i].name); // 添加删除动态路由的索引(路由名)
      console.debug('add sidebarRoutes route', sidebarRoutes[i]);
    }
  },
  // 设置右上角菜单清单, rightMenus格式见./src/api/config/user.js 的 getUserInfo 定义
  SET_RIGHT_MENUS: (state, rightMenus) => {
    // 删除原来生成的路由
    state.rightMenusDelRoutesIndex.forEach(routeName => {
      router.removeRoute(routeName);
    });

    // 处理菜单信息及生成菜单路由
    const tempRightMenus = rightMenus === undefined ? [] : rightMenus.sort(sortByOrderFiled);
    const rightRoutes = generateRoutersByMenus(
      tempRightMenus, '', '', true, false, false, 'right'
    );

    // 设置菜单, 以及生成菜单对应的查询索引对象
    state.rightMenus = tempRightMenus;
    state.rightMenusIndex = generateMenusIndex(state.rightMenus);

    // 添加菜单项到路由
    state.rightMenusDelRoutesIndex = [];
    for (let i = 0; i < rightRoutes.length; i++) {
      router.addRoute(rightRoutes[i]); // 动态添加可访问路由表
      state.rightMenusDelRoutesIndex.push(rightRoutes[i].name); // 添加删除动态路由的索引(路由名)
      console.debug('add rightRoutes route', rightRoutes[i]);
    }
  },
  // 设置固定页签清单, fixedTags格式见./src/api/config/user.js 的 getUserInfo 定义
  SET_FIXED_TAGS: (state, fixedTags) => {
    // 删除原来生成的路由
    state.fixedTagsDelRoutesIndex.forEach(routeName => {
      router.removeRoute(routeName);
    });

    // 处理固定页签信息及生成路由
    const tempFixedTags = fixedTags === undefined ? [] : fixedTags.sort(sortByOrderFiled);
    const fixedTagsRoutes = generateRoutersByFixedTags(fixedTags);

    // 设置固定页签, 以及生成页签对应的查询索引对象
    state.fixedTags = tempFixedTags;
    state.fixedTagsIndex = generateFixedTagsIndex(state.fixedTags);

    // 添加页签项到路由
    state.fixedTagsDelRoutesIndex = [];
    for (let i = 0; i < fixedTagsRoutes.length; i++) {
      router.addRoute(fixedTagsRoutes[i]); // 动态添加可访问路由表
      state.fixedTagsDelRoutesIndex.push(fixedTagsRoutes[i].name); // 添加删除动态路由的索引(路由名)
      console.debug('add fixedTags route', fixedTagsRoutes[i]);
    }
  },
  // 清除所有菜单信息
  CLEAR_ALL_INFO: state => {
    // 删除动态路由
    state.sidebarDelRoutesIndex.forEach(routeName => {
      router.removeRoute(routeName);
    });
    state.rightMenusDelRoutesIndex.forEach(routeName => {
      router.removeRoute(routeName);
    });
    state.fixedTagsDelRoutesIndex.forEach(routeName => {
      router.removeRoute(routeName);
    });

    // 清空数据
    state.sidebarMenus = [];
    state.sidebarMenusIndex = {};
    state.sidebarTopNavModeMenus = {};
    state.sidebarDelRoutesIndex = [];
    state.rightMenus = [];
    state.rightMenusIndex = {};
    state.rightMenusDelRoutesIndex = [];
    state.fixedTags = [];
    state.fixedTagsIndex = {};
    state.fixedTagsDelRoutesIndex = [];
    state.isLoaded = false;
  },
  // 添加找不到返回404页面的路由
  SET_404_ROUTE: (state) => {
    const routeInfo = { name: 'noMatchedRoute', path: '/:catchAll(.*)', redirect: '/404', hidden: true };
    router.addRoute(routeInfo);
  }
};

const actions = {
  // 设置所有菜单信息, payload为JSON对象，包含sidebarMenus、rightMenus、fixedTags三个key
  setMenus({ commit }, payload) {
    return new Promise(resolve => {
      if (payload.sidebarMenus !== undefined) {
        commit('SET_SIDEBAR_MENUS', payload.sidebarMenus);
      }
      if (payload.rightMenus !== undefined) {
        commit('SET_RIGHT_MENUS', payload.rightMenus);
      }
      if (payload.fixedTags !== undefined) {
        commit('SET_FIXED_TAGS', payload.fixedTags);
      }
      // 添加404的路由
      commit('SET_404_ROUTE');
      // 更新加载标记
      commit('SET_IS_LOADED', true);
      resolve();
    });
  },

  // 清除所有菜单
  clear({ commit }) {
    return new Promise(resolve => {
      commit('CLEAR_ALL_INFO');
      resolve();
    });
  }
};

/**
 * 通过列表项的order值排序函数
 * @param {int} x
 * @param {int} y
 */
function sortByOrderFiled(x, y) {
  const xOrder = x.order || 100000000000000000;
  const yOrder = y.order || 100000000000000000;
  return xOrder - yOrder;
}

/**
 * 生成topNav模式的菜单字典
 * @param {array} menus - sidebarMenus
 */
function generateSidebarTopNavModeMenus(menus) {
  const menusIndex = {};
  for (let i = 0; i < menus.length; i++) {
    if (menus[i].menuType === 'main' && menus[i].children && menus[i].children.length > 0) {
      menusIndex[menus[i].name] = menus[i].children;
    } else {
      menusIndex[menus[i].name] = [];
    }
  }
  return menusIndex;
}

/**
 * 生成菜单索引字典（将菜单打平为一维字典）
 * 注：包含
 * @param {array} menus - 要处理的菜单列表
 * @returns {JSON} index - 索引对象，格式如下：
 *   {
 *     byName: { [菜单名]: 菜单对象, ... },
 *     byNamePath: { [菜单名路径（/分隔）]: 菜单对象, ... },
 *     byFixedTagName: { [要打开的固定页签名]: 菜单对象, ...}
 *   }
 * 只有一层，key为'/'分隔的namePath, value为菜单项
 */
function generateMenusIndex(menus) {
  const index = { byName: {}, byNamePath: {}, byFixedTagName: {}};
  for (let i = 0; i < menus.length; i++) {
    // 为自己建立索引
    index.byName[menus[i].name] = menus[i];
    index.byNamePath[menus[i].namePath] = menus[i];
    if (menus[i].menuType === 'main') {
      // 为子对象建立索引
      if (menus[i].children && menus[i].children.length > 0) {
        const tempIndex = generateMenusIndex(menus[i].children);
        // 合并从子对象获取到的索引
        index.byName = Object.assign(index.byName, tempIndex.byName);
        index.byNamePath = Object.assign(index.byNamePath, tempIndex.byNamePath);
        index.byFixedTagName = Object.assign(index.byFixedTagName, tempIndex.byFixedTagName);
      }
    } else if (menus[i].menuType === 'fixedTag') {
      // 固定页签反向查询索引
      index.byFixedTagName[menus[i].fixedTagName] = menus[i];
    }
  }
  return index;
}

/**
 * 通过菜单对象生成页签路由（不判断实际菜单情况）
 * @param {*} menuItem
 */
export const generateLayoutRouter = (menuItem) => {
  const pathIndex = menuItem.routerPath.split('/');
  let parentPath = '';
  let path = '';
  if (pathIndex.length === 1) {
    path = pathIndex[0];
  } else {
    path = pathIndex[pathIndex.length - 1];
    pathIndex.pop(pathIndex.length - 1);
    parentPath = pathIndex.join('/');
  }

  // 生成两级路由
  const routerItem = {
    name: menuItem.meta.type + menuItem.name,
    path: parentPath, // 访问路径
    component: Layout,
    children: [
      {
        path: path,
        component: getGlobalComponent(menuItem.viewComponentName),
        props: menuItem.meta.props,
        meta: menuItem.meta
      }
    ]
  };

  return routerItem;
};

/**
 * 通过菜单对象生成路由对象
 * @param {JSON} menuItem - 菜单对象
 * @returns {JSON} - 生成的路由对象，如果不需生成路由，则返回undefined
 */
function generateRouterByMeunItem(menuItem) {
  let routerItem;
  if (menuItem.menuType === 'view') {
    if (menuItem.openType === 'inner') {
      if (menuItem.meta.cacheType !== 'mutiple') {
        // inner非缓存情况才需要产生路由，缓存情况由页签处理逻辑动态生成路由
        routerItem = generateLayoutRouter(menuItem);
      }
    } else if (menuItem.openType === 'refresh' && !menuItem.meta.isLayoutTag) {
      // 在主页面刷新打开, 并且非页签的情况
      menuItem.meta.refresh = true;
      routerItem = {
        name: menuItem.meta.type + menuItem.name,
        path: menuItem.routerPath,
        component: getGlobalComponent(menuItem.viewComponentName),
        props: menuItem.meta.props,
        meta: menuItem.meta
      };
    }
  }
  return routerItem;
}

/**
 * 根据菜单清单生成对应的路由
 * 注：同步清洗菜单对象，形成标准的菜单数据，包括 routerPath, namePath
 * @param {array} menus - 菜单清单
 * @param {string} basePath='' - 基础路径
 * @param {string} baseNamePath='' - 命名标识路径
 * @param {bool} firstLevel=true - 是否第1层菜单
 * @param {bool} parentHidden=false - 指示父级菜单状态是否隐藏
 * @param {bool} firstLevel=true - 指示父级菜单状态是否禁用
 * @param {string} menuType='sidebar' - 菜单类型
 */
function generateRoutersByMenus(menus, basePath = '',
  baseNamePath = '', firstLevel = true, parentHidden = false, parentDisable = false, menuType = 'sidebar') {
  let tempRoutes = [];
  for (let i = 0; i < menus.length; i++) {
    const menuItem = menus[i];

    // 处理menuItem的路由
    if (firstLevel) {
      // 第一级的路径必须以 / 开头
      if (!menuItem.path.startsWith('/')) { menuItem.path = '/' + menuItem.path; }
      if (settings.app.mutipleAppSupport) {
        // 支持多应用，路径带上系统标识
        const store = getStore();
        menuItem.routerPath = '/sys-' + store.getters.sysId + menuItem.path;
      } else {
        menuItem.routerPath = menuItem.path;
      }
      menuItem.namePath = menuItem.name;
    } else {
      menuItem.routerPath = basePath + '/' + menuItem.path;
      menuItem.namePath = baseNamePath + '/' + menuItem.name;
    }

    // 标准状态处理
    menuItem.hidden = menuItem.hidden === undefined ? false : menuItem.hidden;
    menuItem.realHidden = menuItem.hidden || parentHidden; // 真实的隐藏状态
    menuItem.disabled = menuItem.disabled === undefined ? false : menuItem.disabled;
    menuItem.realDisabled = menuItem.disabled || parentDisable; // 真实的禁用状态
    if (menuItem.openType === undefined) menuItem.openType = 'inner';

    // meta处理
    menuItem.meta = {
      title: menuItem.showName,
      icon: menuItem.icon === undefined ? '' : menuItem.icon,
      isFixed: false,
      type: menuType,
      menuNamePath: menuItem.namePath,
      name: menuItem.name,
      cacheType: menuItem.cacheType === undefined ? 'none' : menuItem.cacheType,
      componentName: '',
      cachedName: '',
      props: undefined,
      isLayoutTag: true
    };
    if (menuItem.menuType === 'view') {
      let viewProps = menuItem.viewProps === undefined ? {} : menuItem.viewProps;
      menuItem.meta.componentName = menuItem.viewComponentName;
      if (menuItem.meta.cacheType === 'mutiple') {
        // 多页缓存（包括各种打开情况）
        menuItem.meta.cachedName = nanoid();
        if (viewProps.passProps === undefined) {
          // 改为标准的passProps模式传递
          viewProps = { passProps: viewProps };
        }
        menuItem.meta.props = viewProps;
      } else {
        menuItem.meta.props = viewProps;
      }

      // isLayoutTag的处理
      if (menuItem.openType !== 'inner') {
        menuItem.meta.isLayoutTag = menuItem.isLayoutTag === undefined ? false : menuItem.isLayoutTag;
      }

      // 如果是新开窗口（并且不是框架内嵌形式），处理会话路由的添加
      if (menuItem.openType === 'blank' && !menuItem.meta.isLayoutTag) {
        const routeInfo = {
          name: menuItem.meta.type + menuItem.name,
          path: menuItem.routerPath,
          componentName: menuItem.viewComponentName,
          props: menuItem.viewProps,
          query: menuItem.viewQuery,
          meta: menuItem.meta
        };
        const store = getStore();
        addSessionRoute(routeInfo, store.getters.sysId);
      }
    } else if (menuItem.menuType === 'link' && menuItem.openType === 'inner') {
      // 内部链接，采用iframe模式, 固定为不缓存组件
      menuItem.meta.isCachedIframe = true;
      menuItem.meta.cacheType = 'none';
      menuItem.meta.cachedName = nanoid();
    }

    if (menuItem.menuType === 'main') {
      // 上级菜单, 只有上级菜单才有子菜单
      let childrenRoutes;
      if (menuItem.children && menuItem.children.length > 0) {
        // 子菜单排序
        menuItem.children = menuItem.children.sort(sortByOrderFiled);

        // 处理子菜单的路由
        childrenRoutes = generateRoutersByMenus(
          menuItem.children,
          menuItem.routerPath,
          menuItem.namePath,
          false,
          menuItem.realHidden,
          menuItem.realDisabled,
          menuType
        );

        // 添加到路由数组
        tempRoutes = tempRoutes.concat(childrenRoutes);
      }
      // 继续下一个
      continue;
    } else if (menuItem.menuType === 'view') {
      // vue视图
      const routerItem = generateRouterByMeunItem(menuItem);
      if (routerItem !== undefined && !menuItem.realHidden && !menuItem.realDisabled) {
        // 可以产生路由，以及状态正常才添加路由
        tempRoutes.push(routerItem);
      }
    } else {
      // 其他类型无需处理路由
      continue;
    }
  }
  return tempRoutes;
}

/**
 * 生成固定页签路由
 * 注：同时清理页签对象
 * @param {JSON} fixedTags - 固定页签
 * @returns {array} - 路由信息
 */
function generateRoutersByFixedTags(fixedTags) {
  const tempRoutes = [];
  for (let i = 0; i < fixedTags.length; i++) {
    const tagItem = fixedTags[i];
    const meta = {
      title: tagItem.showName,
      isFixed: true,
      icon: tagItem.icon === undefined ? '' : tagItem.icon,
      type: 'fixedTag',
      name: tagItem.name,
      cacheType: tagItem.cacheType === undefined ? 'none' : tagItem.cacheType,
      componentName: '',
      cachedName: '',
      props: undefined
    };

    if (settings.app.mutipleAppSupport) {
      // 支持多应用，路径带上系统标识
      if (tagItem.routerPath && !tagItem.routerPath.startsWith('/')) { tagItem.routerPath = '/' + tagItem.routerPath; }
      const store = getStore();
      if (tagItem.routerPath && !tagItem.routerPath.startsWith('/sys-')) {
        // 避免重复添加系统标识
        tagItem.routerPath = '/sys-' + store.getters.sysId + tagItem.routerPath;
      }
    }

    if (tagItem.tagType === 'view') {
      // view 路由路径处理
      const pathIndex = tagItem.routerPath.split('/');
      let parentPath = '';
      let path = '';
      if (pathIndex.length === 1) {
        path = pathIndex[0];
      } else {
        path = pathIndex[pathIndex.length - 1];
        pathIndex.pop(pathIndex.length - 1);
        parentPath = pathIndex.join('/');
      }
      // 生成路由对象
      const view = getGlobalComponent(tagItem.viewComponentName);
      meta.componentName = tagItem.viewComponentName;
      let viewProps = tagItem.viewProps === undefined ? {} : tagItem.viewProps;
      if (tagItem.cacheType !== undefined && tagItem.cacheType === 'mutiple') {
        // 多页缓存支持，无需添加路由，在打开时自动创建路由
        meta.cachedName = nanoid();
        if (viewProps.passProps === undefined) {
          // 改为标准的passProps模式传递
          viewProps = { passProps: viewProps };
        }
        meta.props = viewProps;
      } else {
        // 无需缓存处理
        const routerItem = {
          name: 'fixedTag' + tagItem.name,
          path: parentPath, // 访问路径
          component: Layout,
          children: [
            {
              path: path,
              component: view,
              props: viewProps,
              meta: meta
            }
          ]
        };
        meta.props = tagItem.viewProps;
        // 添加到路由
        tempRoutes.push(routerItem);
      }
    } else if (tagItem.tagType === 'link') {
      // 链接，采用iframe模式, 固定为不缓存组件
      meta.isCachedIframe = true;
      meta.cacheType = 'none';
      meta.cachedName = nanoid();
    }

    // 为对象添加meta
    fixedTags[i].meta = meta;
  }
  return tempRoutes;
}

/**
 * 为固定页签生成索引
 * @param {JSON} fixedTags - 固定页签
 * @returns {JSON} - 固定页签对象索引，key为name, value为固定页签对象
 */
function generateFixedTagsIndex(fixedTags) {
  const index = {};
  for (let i = 0; i < fixedTags.length; i++) {
    index[fixedTags[i].name] = fixedTags[i];
  }
  return index;
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
