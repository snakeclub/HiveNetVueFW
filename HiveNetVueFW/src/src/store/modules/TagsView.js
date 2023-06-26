/**
 * 功能主界面的已访问视图数据
 */
import { nanoid } from 'nanoid';
import settings from '@/settings';
import cache from '@/plugins/cache';
import JsonTools from '@/utils/base/JsonTools';
import { getStore, addLayoutDynamicRouter, delLayoutDynamicRouter } from '@/utils/base/global';

const state = {
  /**
   * 当前已访问的页签信息，格式如下：
   * {
   *   name: 页签的唯一标识，自动通过 meta的type和name生成，无需送入
   *   path: ,query:, params:
   *   meta:{
   *     title:页签标题, icon:页签图标, isFixed:是否固定页签, isCachedIframe:是否缓存Iframe页面, refresh: 是否刷新页面,
   *     componentName:页签对应组件名, cacheType:缓存类型(none,single,mutiple)
   *     type:路由类型(fixedTag、sidebar、right), name:同路由类型的唯一标识, cachedName:缓存组件名(cacheType为mutiple及iframe时使用)
   *     props: 组件传参
   *   }
   * }
   *
   */
  visitedViews: [],
  cachedComponents: [], // 要缓存的组件的name数组（keep-alives使用）
  appMainShow: true, // 用于控制AppMain的router-view显示隐藏的变量，可以基于这个机制刷新页面
  activeView: undefined // 当前激活的页签对象
};

const mutations = {
  // 将页签放入已访问清单
  ADD_VISITED_VIEW: (state, view) => {
    const store = getStore();

    if (state.visitedViews.some(v => v.path === view.path && JsonTools.deepCompare(v.query || {}, view.query || {}))) {
      // 标签已存在，如果没有显示页签栏位，自动关闭其他页签
      if (view.meta.type !== 'fixedTag' && !store.state.layoutSettings.tagsView) {
        store.dispatch('tagsView/closeOthersViews', view);
      }
      return;
    }
    // 标准化tag
    const tag = Object.assign({}, view);
    if (!tag.meta) tag.meta = {};
    if (tag.meta.title === undefined || tag.meta.title === '') tag.meta.title = 'no-name';
    if (tag.meta.type === undefined || tag.meta.type === '') tag.meta.type = 'unknow';
    if (tag.meta.name === undefined || tag.meta.name === '') tag.meta.name = nanoid();

    // 检查是否需要动态创建缓存组件和路由
    if (view.meta && view.meta.cacheType && view.meta.cacheType === 'mutiple') {
      const info = {
        path: view.path,
        query: view.query,
        params: view.params,
        props: view.props,
        meta: view.meta,
        componentName: view.meta.cachedName,
        copyComponentName: 'CacheView'
      };
      addLayoutDynamicRouter(info);
    }

    // 自动生成唯一名称并放入对象
    tag.name = tag.meta.type + '-' + tag.meta.name;
    state.visitedViews.push(tag);

    // 支持浏览器刷新，把visitedViews的信息存入会话缓存中
    if (settings.app.browserRefreshSupport) {
      const store = getStore();
      cache.session.setJSON(store.getters.sysId + settings.app.layoutRefreshCacheKey, state.visitedViews);
    }

    // 如果没有显示页签栏位，自动关闭其他页签
    if (tag.meta.type !== 'fixedTag' && !store.state.layoutSettings.tagsView) {
      store.dispatch('tagsView/closeOthersViews', tag);
    }
  },

  // 将组件名放入缓存清单
  ADD_CACHED_COMPONENTS: (state, view) => {
    let componentName;
    if (view.meta.cacheType === undefined || view.meta.cacheType === 'none') {
      return;
    } else if (view.meta.cacheType !== undefined && view.meta.cacheType === 'mutiple') {
      // 单独缓存的临时页签
      componentName = view.meta.cachedName;
    } else {
      componentName = view.meta.componentName;
    }
    if (componentName === undefined || state.cachedComponents.includes(componentName)) return;

    // 注意这个是组件名而非路由名
    state.cachedComponents.push(componentName);
  },

  // 从已访问清单删除页签
  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path && JsonTools.deepCompare(v.query || {}, view.query || {})) {
        state.visitedViews.splice(i, 1);

        // 检查是否是iframe
        if (view.meta && view.meta.isCachedIframe) {
          // 删除iframe 缓存
          const store = getStore();
          store.commit('cachedIframe/DEL_CACHED_IFRAME', view.meta.cachedName);
        }

        // 检查是否需要动态删除缓存组件
        if (view.meta && view.meta.cacheType && view.meta.cacheType === 'mutiple') {
          delLayoutDynamicRouter(view.meta.cachedName, view.meta.cachedName);
        }
        break;
      }
    }
  },

  // 删除缓存的视图组件
  DEL_CACHED_COMPONENTS: (state, view) => {
    let componentName;
    if (view.meta.cacheType !== undefined && view.meta.cacheType === 'mutiple') {
      // 单独缓存的页签
      componentName = view.meta.cachedName;
    } else {
      componentName = view.meta.componentName;
    }
    if (componentName === undefined) return;
    const index = state.cachedComponents.indexOf(componentName);
    index > -1 && state.cachedComponents.splice(index, 1);
  },

  // 删除指定页签右边的所有页签
  DEL_RIGHT_VIEWS: (state, view) => {
    // 找到页签的当前位置
    const index = state.visitedViews.findIndex(v => v.path === view.path);
    if (index === -1) {
      return;
    }
    // 删除页签
    state.visitedViews = state.visitedViews.filter((item, idx) => {
      if (idx <= index || (item.meta.isFixed !== undefined && item.meta.isFixed)) {
        return true;
      }

      // 检查是否是iframe
      if (item.meta && item.meta.isCachedIframe) {
        // 删除iframe 缓存
        const store = getStore();
        store.commit('cachedIframe/DEL_CACHED_IFRAME', item.meta.cachedName);
      }

      // 检查是否需要动态删除缓存组件
      if (item.meta && item.meta.cacheType && item.meta.cacheType === 'mutiple') {
        delLayoutDynamicRouter(item.meta.cachedName, item.meta.cachedName);
      }

      // 删除组件缓存
      let componentName;
      if (item.meta.cacheType !== undefined && item.meta.cacheType === 'mutiple') {
        // 单独缓存的页签
        componentName = item.meta.cachedName;
      } else {
        componentName = item.meta.componentName;
      }
      if (componentName !== undefined) {
        const i = state.cachedComponents.indexOf(componentName);
        if (i > -1) {
          state.cachedComponents.splice(i, 1);
        }
      }
      return false;
    });
  },

  // 删除指定页签左边的所有页签
  DEL_LEFT_VIEWS: (state, view) => {
    // 找到页签的当前位置
    const index = state.visitedViews.findIndex(v => v.path === view.path);
    if (index === -1) {
      return;
    }
    // 删除页签
    state.visitedViews = state.visitedViews.filter((item, idx) => {
      if (idx >= index || (item.meta.isFixed !== undefined && item.meta.isFixed)) {
        return true;
      }

      // 检查是否是iframe
      if (item.meta && item.meta.isCachedIframe) {
        // 删除iframe 缓存
        const store = getStore();
        store.commit('cachedIframe/DEL_CACHED_IFRAME', item.meta.cachedName);
      }

      // 检查是否需要动态删除缓存组件
      if (item.meta && item.meta.cacheType && item.meta.cacheType === 'mutiple') {
        delLayoutDynamicRouter(item.meta.cachedName, item.meta.cachedName);
      }

      // 删除组件缓存
      let componentName;
      if (item.meta.cacheType !== undefined && item.meta.cacheType === 'mutiple') {
        // 单独缓存的页签
        componentName = item.meta.cachedName;
      } else {
        componentName = item.meta.componentName;
      }
      if (componentName !== undefined) {
        const i = state.cachedComponents.indexOf(componentName);
        if (i > -1) {
          state.cachedComponents.splice(i, 1);
        }
      }
      return false;
    });
  },

  // 删除指定页签之外的所有页签
  DEL_OTHERS_VIEWS: (state, view) => {
    // 删除页签
    state.visitedViews = state.visitedViews.filter((item, idx) => {
      if ((item.path === view.path && JsonTools.deepCompare(item.query || {}, view.query || {})) || (item.meta.isFixed !== undefined && item.meta.isFixed)) {
        return true;
      }

      // 检查是否是iframe
      if (item.meta && item.meta.isCachedIframe) {
        // 删除iframe 缓存
        const store = getStore();
        store.commit('cachedIframe/DEL_CACHED_IFRAME', item.meta.cachedName);
      }

      // 检查是否需要动态删除缓存组件
      if (item.meta && item.meta.cacheType && item.meta.cacheType === 'mutiple') {
        delLayoutDynamicRouter(item.meta.cachedName, item.meta.cachedName);
      }

      // 删除组件缓存
      let componentName;
      if (item.meta.cacheType !== undefined && item.meta.cacheType === 'mutiple') {
        // 单独缓存的页签
        componentName = item.meta.cachedName;
      } else {
        componentName = item.meta.componentName;
      }
      if (componentName !== undefined) {
        const i = state.cachedComponents.indexOf(componentName);
        if (i > -1) {
          state.cachedComponents.splice(i, 1);
        }
      }
      return false;
    });
  },

  // 关闭所有页签
  DEL_ALL_VIEWS: (state, withFixedTags) => {
    // 删除页签，只保留固定页签
    state.visitedViews = state.visitedViews.filter((item, idx) => {
      if (!withFixedTags && item.meta.isFixed !== undefined && item.meta.isFixed) {
        return true;
      }

      // 检查是否是iframe
      if (item.meta && item.meta.isCachedIframe) {
        // 删除iframe 缓存
        const store = getStore();
        store.commit('cachedIframe/DEL_CACHED_IFRAME', item.meta.cachedName);
      }

      // 检查是否需要动态删除缓存组件
      if (item.meta && item.meta.cacheType && item.meta.cacheType === 'mutiple') {
        delLayoutDynamicRouter(item.meta.cachedName, item.meta.cachedName);
      }

      // 删除组件缓存
      let componentName;
      if (item.meta.cacheType !== undefined && item.meta.cacheType === 'mutiple') {
        // 单独缓存的页签
        componentName = item.meta.cachedName;
      } else {
        componentName = item.meta.componentName;
      }
      if (componentName !== undefined) {
        const i = state.cachedComponents.indexOf(componentName);
        if (i > -1) {
          state.cachedComponents.splice(i, 1);
        }
      }
      return false;
    });
  },

  // 设置当前激活页面
  SET_ACTIVE_VIEW: (state, view) => {
    state.activeView = view;
  },

  // 设置AppMain页面显示隐藏
  SET_APP_MAIN_SHOW: (state, show) => {
    state.appMainShow = show;
  },

  // 清除所有信息, 注意只有刷新页面的时候使用
  CLEAR_VIEW_INFO: (state) => {
    state.visitedViews = [];
    state.cachedComponents = [];
    state.appMainShow = true;
    state.activeView = undefined;
  }
};

const actions = {
  // 添加页签视图
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view);
    dispatch('addCachedComponent', view);
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view);
  },
  addCachedComponent({ commit }, view) {
    commit('ADD_CACHED_COMPONENTS', view);
  },

  // 关闭指定页签
  closeView({ commit }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view); // 删除已访问的页签清单
      commit('DEL_CACHED_COMPONENTS', view); // 删除缓存的组件
      resolve();
    });
  },

  // 关闭指定页签右边的页签
  closeRightTags({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_RIGHT_VIEWS', view);
      resolve();
    });
  },

  // 关闭指定页签左边的页签
  closeLeftTags({ commit }, view) {
    return new Promise(resolve => {
      commit('DEL_LEFT_VIEWS', view);
      resolve();
    });
  },

  // 关闭选中页签之外的页签
  closeOthersViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VIEWS', view);
      resolve();
    });
  },

  // 关闭所有页签
  closeAllViews({ commit, state }, withFixedTags) {
    return new Promise(resolve => {
      commit('DEL_ALL_VIEWS', withFixedTags === undefined ? false : withFixedTags);
      resolve();
    });
  },

  // 删除缓存的页签
  delCachedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_CACHED_COMPONENTS', view); // 删除缓存的组件
      resolve();
    });
  },

  // 设置AppMain页面显示隐藏
  setAppMainShow({ commit }, show) {
    commit('SET_APP_MAIN_SHOW', show);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
