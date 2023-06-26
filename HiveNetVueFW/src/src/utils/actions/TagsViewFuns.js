/**
 * 支持页签管理的函数
 */

import settings from '@/settings';
import cache from '@/plugins/cache';
import JsonTools from '@/utils/base/JsonTools';
import { getStore, getRouter, getRoute, getAppProxy } from '@/utils/base/global';

/**
 * 浏览器刷新支持功能函数
 */

/**
 * 获取缓存的刷新前页签对象数组（该函数应该在重新获取用户信息前执行，否则将会被覆盖）
 * @param {string} sysId - 系统标识
 * @returns {Array} - 页签对象数组
 */
export const getLayoutRefreshCache = (sysId) => {
  if (settings.app.browserRefreshSupport) {
    return cache.session.getJSON(sysId + settings.app.layoutRefreshCacheKey);
  }
};

/**
 * 获取刷新后正确的页签路由信息（该函数应该在重新获取用户信息后执行，确保路由信息已创建）
 * @param {string} path - 当前路由路径
 * @param {JSON} query - 当前路由参数
 * @param {Array} lastVisitedTagsView - getLayoutRefreshCache获取到的页签对象数组
 * @returns {JSON} - 需要跳转的路由信息，如果不返回则代表不跳转
 */
export const getRefreshTagsViewRoute = (path, query, lastVisitedTagsView) => {
  if (settings.app.browserRefreshSupport) {
    const store = getStore();
    const routeTagInfo = { path: path, query: query };
    for (const tag of lastVisitedTagsView) {
      if (isSameTag(routeTagInfo, tag)) {
        // 找到刷新前的页签信息，先装载固定页签，保证后面添加页签的顺序不会出问题
        initFixedTags();

        // 处理各类情况
        if (tag.meta.refreshRoute) {
          // 直接指定了刷新的路由
          return tag.meta.refreshRoute;
        } else if (tag.meta.isFixed) {
          // 固定页签的情况，直接返回正确的路由信息，进行跳转即可
          for (const fixedTag of store.getters.visitedViews) {
            if (fixedTag.meta.name === tag.meta.name) {
              // 找到匹配的固定页签
              return { path: fixedTag.path, query: fixedTag.query };
            }
          }
          return;
        } else if (tag.meta.isCachedIframe !== undefined && tag.meta.isCachedIframe) {
          // 非固定页签且为iframe页签
          if (tag.meta.type && ['sidebar', 'right'].includes(tag.meta.type)) {
            // 是菜单操作页签, 找回菜单
            const menuIndex = tag.meta.type === 'sidebar' ? store.getters.sidebarMenusIndex : store.getters.rightMenusIndex;
            const menuItem = menuIndex.byName[tag.meta.name];
            if (menuItem) {
              // 只需要变更路由的iframeid值和meta的cachedName
              tag.query.iframeid = menuItem.meta.cachedName;
              tag.meta.cachedName = menuItem.meta.cachedName;
            } else {
              return;
            }
          }
          // 重新将页签对象添加进去，再重新打开即可
          store.commit('tagsView/ADD_VISITED_VIEW', tag);
          store.commit('tagsView/ADD_CACHED_COMPONENTS', tag);
          return { path: tag.path, query: tag.query, meta: tag.meta };
        } else if (tag.meta.cacheType && tag.meta.cacheType === 'mutiple') {
          // 非固定页签，并且是缓存页面的情况
          if (tag.meta.type && ['sidebar', 'right'].includes(tag.meta.type)) {
            // 是菜单操作页签, 找回菜单
            const menuIndex = tag.meta.type === 'sidebar' ? store.getters.sidebarMenusIndex : store.getters.rightMenusIndex;
            const menuItem = menuIndex.byName[tag.meta.name];
            if (menuItem) {
              // 只需要变更meta的cachedName
              tag.meta.cachedName = menuItem.meta.cachedName;
            } else {
              return;
            }
          }
          // 重新将页签对象添加进去，再重新打开即可
          store.commit('tagsView/ADD_VISITED_VIEW', tag);
          store.commit('tagsView/ADD_CACHED_COMPONENTS', tag);
          return { path: tag.path, query: tag.query, meta: tag.meta };
        } else {
          // 直接将tag放回页签
          store.commit('tagsView/ADD_VISITED_VIEW', tag);
          store.commit('tagsView/ADD_CACHED_COMPONENTS', tag);
          return { path: tag.path, query: tag.query, meta: tag.meta };
        }
      }
    }
  }
};

/**
 * 对于页签的其他公共处理方法
 */

/**
 * 根据用户信息中的固定页签信息，生成固定页签对象清单
 * @returns {Array} - 固定页签对象清单
 */
export const getFixedTags = () => {
  const store = getStore();
  const storeFixedTags = store.getters.fixedTags;
  const tags = [];
  for (let i = 0; i < storeFixedTags.length; i++) {
    const fixedTag = storeFixedTags[i];
    const tag = {
      name: 'fixedTag' + fixedTag.name,
      meta: fixedTag.meta
    };
    if (fixedTag.tagType === 'view') {
      // view页面
      tag.path = fixedTag.routerPath;
      tag.query = fixedTag.viewQuery;
    } else if (fixedTag.tagType === 'link') {
      // 链接模式
      tag.meta.isCachedIframe = true;
      tag.path = settings.app.cachedIframePath;
      tag.query = { url: fixedTag.url, iframeid: tag.meta.cachedName };
      if (settings.app.mutipleAppSupport) {
        // 通过query支持系统标识
        tag.query.sysId = store.getters.sysId;
      }
    } else {
      // 无法识别的类型
      continue;
    }
    tags.push(tag);
  }
  return tags;
};

/**
 * 初始化固定页签
 */
export const initFixedTags = () => {
  const store = getStore();
  const fixedTags = getFixedTags();
  for (const tag of fixedTags) {
    // store.dispatch('tagsView/addView', tag);
    // 修改为同步模式
    store.commit('tagsView/ADD_VISITED_VIEW', tag);
    store.commit('tagsView/ADD_CACHED_COMPONENTS', tag);
  }
};

/**
 * 将当前路由添加到页签中
 * @param {JSON} route - 路由信息（this.$route）
 * @returns {bool} - 是否正常添加成功
 */
export const addTagByRoute = (route) => {
  const store = getStore();
  const router = getRouter();

  // 刷新页面
  if (route.meta && route.meta.refresh) {
    // 是主页面刷新跳转到其他页面
    return false;
  }

  // 首页，重定向到第一个固定标签中
  if (route.path === '/') {
    const view = store.state.tagsView.visitedViews[0];
    if (view !== undefined) {
      router.replace({
        path: view.path,
        query: view.query
      });
    }
    return false;
  }

  // 添加页签
  const tag = {
    name: route.name === undefined ? '' : route.name,
    path: route.path,
    query: route.query,
    params: route.params,
    meta: route.meta
  };
  store.commit('tagsView/ADD_VISITED_VIEW', tag);
  store.commit('tagsView/ADD_CACHED_COMPONENTS', tag);
  return true;
};

/**
 * 判断指定页签对象是否激活页签（与当前路由比较）
 * @param {JSON} tag - 页签对象
 * @returns {bool} - 是否激活页签
 */
export const isActiveTag = (tag) => {
  const route = getRoute();
  return (tag.path === route.path && JsonTools.deepCompare(tag.query || {}, route.query || {}));
};

/**
 * 判断指定页签对象是否固定页签
 * @param {JSON} tag - 页签对象
 * @returns {bool} - 是否固定页签
 */
export const isFixedTag = (tag) => {
  return (tag.meta && tag.meta.isFixed !== undefined && tag.meta.isFixed);
};

/**
 * 判断两个页签对象是否同一个
 * @param {JSON} tagA - 页签对象
 * @param {JSON} tagB - 页签对象
 * @returns {bool} - 是否相同页签
 */
export const isSameTag = (tagA, tagB) => {
  return tagA.path === tagB.path && JsonTools.deepCompare(tagA.query || {}, tagB.query || {});
};

/**
 * 判断指定页签是否第一个页签
 * @param {JSON} tag - 页签对象
 * @returns {bool} - 是否第一个页签
 */
export const isFirstTag = (tag) => {
  try {
    if (isFixedTag(tag)) {
      // 固定页签视为第一个页签
      return true;
    }
    // 非固定页签
    const store = getStore();
    const visitedViews = store.state.tagsView.visitedViews;
    // 遍历寻找第一个非固定页签
    let firstTag;
    for (let i = 0; i < visitedViews.length; i++) {
      if (!isFixedTag(visitedViews[i])) {
        firstTag = visitedViews[i];
        break;
      }
    }
    if (firstTag === undefined) {
      // 全部是固定页签，都视为第一个页签
      return true;
    }

    return isSameTag(tag, firstTag);
  } catch (err) {
    return false;
  }
};

/**
 * 判断指定页签是否最后一个页签
 * @param {JSON} tag - 页签对象
 * @returns {bool} - 是否最后一个页签
 */
export const isLastTag = (tag) => {
  try {
    const store = getStore();
    const visitedViews = store.state.tagsView.visitedViews;
    const lastTag = visitedViews[visitedViews.length - 1];
    return isSameTag(tag, lastTag);
  } catch (err) {
    return false;
  }
};

/**
 * 获取页签对象的索引值
 * @param {JSON} tag - 页签对象
 * @returns {int} - 索引值
 */
export const getTagIndex = (tag) => {
  const store = getStore();
  return store.state.tagsView.visitedViews.findIndex(v => isSameTag(v, tag));
};

/**
 * 根据路由信息获取页签对象
 * @param {string} path - 路由路径
 * @param {JSON} query - 请求信息
 * @returns {JSON} - 返回页签对象
 */
export const getTagByPath = (path, query) => {
  const store = getStore();
  for (const tag of store.state.tagsView.visitedViews) {
    if (isSameTag({ path: path, query: query }, tag)) {
      return tag;
    }
  }
};

/**
 * 根据iframeId获取页签对象
 * @param {string} iframeId - iframe唯一标识
 * @returns {JSON} - 返回页签对象
 */
export const getTagByIframeId = (iframeId) => {
  const store = getStore();
  for (const tag of store.state.tagsView.visitedViews) {
    if (tag.meta.isCachedIframe !== undefined && tag.meta.isCachedIframe && tag.meta.cachedName === iframeId) {
      return tag;
    }
  }
};

/**
 * 通过对象路由类型获取页签对象
 * @param {string} itemType - 路由对象类型（如菜单类型）
 * @param {string} itemName - 路由对象名（如菜单名）
 * @returns {JSON} - 页签对象
 */
export const getTagByItemInfo = (itemType, itemName) => {
  const store = getStore();
  for (const tag of store.state.tagsView.visitedViews) {
    if (tag.meta.type === itemType && tag.meta.name === itemName) {
      return tag;
    }
  }
};

/**
 * 通过页签的唯一名称获取页签对象
 * @param {string} name - 页签的唯一名称（meta.type + '-' + meta.name）
 * @returns {JSON} - 页签对象
 */
export const getTagByName = (name) => {
  const store = getStore();
  for (const tag of store.state.tagsView.visitedViews) {
    if (tag.name === name) {
      return tag;
    }
  }
};

/**
 * 刷新指定页签
 * @param {JSON} tag - 页签对象
 */
export const refreshTag = (tag) => {
  const store = getStore();
  const router = getRouter();
  // 删除缓存后重新跳入页面
  if (tag.meta.isCachedIframe !== undefined && tag.meta.isCachedIframe) {
    // 是缓存的iframe页面，需要特殊方法处理
    store.dispatch('cachedIframe/addRefreshId', tag.query.iframeid).then(() => {
      router.replace({
        path: tag.path,
        query: tag.query
      });
    });
  } else {
    // 通用的刷新方法，删除缓存后刷新页面即可
    store.dispatch('tagsView/delCachedView', tag).then(() => {
      // 刷新AppMain
      store.dispatch('tagsView/setAppMainShow', false).then(() => {
        const nextTick = getAppProxy().$nextTick;
        nextTick(() => { store.dispatch('tagsView/setAppMainShow', true); });
      });
    });
  }
};

/**
 * 跳转到指定的页签
 * @param {JSON} tag - 页签对象
 */
export const toTag = (tag) => {
  const router = getRouter();
  router.push({
    path: tag.path,
    query: tag.query,
    meta: tag.meta
  });
};

/**
 * 跳转到指定页签的下一个页签
 * @param {int} index - 指定页签索引
 */
export const toNextTag = (index) => {
  const store = getStore();
  const router = getRouter();
  const visitedViews = store.state.tagsView.visitedViews;
  const tagIndex = Math.min(index + 1, visitedViews.length - 1);
  const tag = visitedViews[tagIndex];
  if (tag) {
    router.push({
      path: tag.path,
      query: tag.query,
      meta: tag.meta
    });
  }
};

/**
 * 跳转到最后一个页签
 */
export const toLastTag = () => {
  const store = getStore();
  const router = getRouter();
  const visitedViews = store.state.tagsView.visitedViews;
  const lastTag = visitedViews[visitedViews.length - 1];
  if (lastTag) {
    router.push({
      path: lastTag.path,
      query: lastTag.query,
      meta: lastTag.meta
    });
  }
};

/**
 * 关闭指定页签
 * @param {JSON} tag - 页签对象
 */
export const closeTag = (tag) => {
  const store = getStore();
  const tagIndex = getTagIndex(tag); // 标签的位置
  store.dispatch('tagsView/closeView', tag).then(() => {
    if (isActiveTag(tag)) {
      // 如果删除的是当前页签，跳转到下一个页签
      toNextTag(tagIndex);
    }
  });
};

/**
 * 关闭指定页签右边的页签
 * @param {JSON} tag - 页签对象
 */
export const closeRightTags = (tag) => {
  const store = getStore();
  const route = getRoute();
  const visitedViews = store.state.tagsView.visitedViews;
  store.dispatch('tagsView/closeRightTags', tag).then(() => {
    if (!visitedViews.find(i => i.path === route.path && JsonTools.deepCompare(i.query || {}, route.query || {}))) {
      // 如果当前路由页签已经被删除
      toLastTag();
    }
  });
};

/**
 * 关闭指定页签左边的页签
 * @param {JSON} tag - 页签对象
 */
export const closeLeftTags = (tag) => {
  const store = getStore();
  const route = getRoute();
  const visitedViews = store.state.tagsView.visitedViews;
  store.dispatch('tagsView/closeLeftTags', tag).then(() => {
    if (!visitedViews.find(i => i.path === route.path && JsonTools.deepCompare(i.query || {}, route.query || {}))) {
      // 如果当前路由页签已经被删除
      toLastTag();
    }
  });
};

/**
 * 关闭指定页签之外的其他页签
 * @param {JSON} tag - 页签对象
 */
export const closeOthersTags = (tag) => {
  const store = getStore();
  const router = getRouter();
  router.push({ path: tag.path, query: tag.query, meta: tag.meta }).catch(() => {});
  store.dispatch('tagsView/closeOthersViews', tag);
};

/**
 * 关闭所有页签
 * @param {bool} withFixedTags - 是否包含固定页签，默认为false
 */
export const closeAllTags = (withFixedTags) => {
  const store = getStore();
  const route = getRoute();
  store.dispatch('tagsView/closeAllViews', withFixedTags).then(() => {
    if (store.state.tagsView.visitedViews.length > 0) {
      if (store.state.tagsView.visitedViews.some(tag => isSameTag(tag, route))) {
        // 固定页签匹配到了路由
        return;
      }
      toLastTag();
    }
  });
};

/**
 * 归拢页签所有处理方法的对象
 */
export const tagsViewFuns = {
  /**
   * 根据用户信息中的固定页签信息，生成固定页签对象清单
   * @returns {Array} - 固定页签对象清单
   */
  getFixedTags,

  /**
   * 初始化固定页签
   */
  initFixedTags,

  /**
   * 将当前路由添加到页签中
   * @param {JSON} route - 路由信息（this.$route）
   * @returns {bool} - 是否正常添加成功
   */
  addTagByRoute,

  /**
   * 判断指定页签对象是否激活页签（与当前路由比较）
   * @param {JSON} tag - 页签对象
   * @returns {bool} - 是否激活页签
   */
  isActiveTag,

  /**
   * 判断指定页签对象是否固定页签
   * @param {JSON} tag - 页签对象
   * @returns {bool} - 是否固定页签
   */
  isFixedTag,

  /**
   * 判断两个页签对象是否同一个
   * @param {JSON} tagA - 页签对象
   * @param {JSON} tagB - 页签对象
   * @returns {bool} - 是否相同页签
   */
  isSameTag,

  /**
   * 判断指定页签是否第一个页签
   * @param {JSON} tag - 页签对象
   * @returns {bool} - 是否第一个页签
   */
  isFirstTag,

  /**
   * 判断指定页签是否最后一个页签
   * @param {JSON} tag - 页签对象
   * @returns {bool} - 是否最后一个页签
   */
  isLastTag,

  /**
   * 获取页签对象的索引值
   * @param {JSON} tag - 页签对象
   * @returns {int} - 索引值
   */
  getTagIndex,

  /**
   * 根据路由信息获取页签对象
   * @param {string} path - 路由路径
   * @param {JSON} query - 请求信息
   * @returns {JSON} - 返回页签对象
   */
  getTagByPath,

  /**
   * 根据iframeId获取页签对象
   * @param {string} iframeId - iframe唯一标识
   * @returns {JSON} - 返回页签对象
   */
  getTagByIframeId,

  /**
   * 通过对象路由类型获取页签对象
   * @param {string} itemType - 路由对象类型（如菜单类型）
   * @param {string} itemName - 路由对象名（如菜单名）
   * @returns {JSON} - 页签对象
   */
  getTagByItemInfo,

  /**
   * 通过页签的唯一名称获取页签对象
   * @param {string} name - 页签的唯一名称（meta.type + '-' + meta.name）
   * @returns {JSON} - 页签对象
   */
  getTagByName,

  /**
   * 刷新指定页签
   * @param {JSON} tag - 页签对象
   */
  refreshTag,

  /**
   * 跳转到指定的页签
   * @param {JSON} tag - 页签对象
   */
  toTag,

  /**
   * 跳转到指定页签的下一个页签
   * @param {int} index - 指定页签索引
   */
  toNextTag,

  /**
   * 跳转到最后一个页签
   */
  toLastTag,

  /**
   * 关闭指定页签
   * @param {JSON} tag - 页签对象
   */
  closeTag,

  /**
   * 关闭指定页签右边的页签
   * @param {JSON} tag - 页签对象
   */
  closeRightTags,

  /**
   * 关闭指定页签左边的页签
   * @param {JSON} tag - 页签对象
   */
  closeLeftTags,

  /**
   * 关闭指定页签之外的其他页签
   * @param {JSON} tag - 页签对象
   * @param {Object} moveToCurrentTagFun - 页面对象传入的滚动条移动到当前节点的函数
   */
  closeOthersTags,

  /**
   * 关闭所有页签
   * @param {bool} withFixedTags - 是否包含固定页签，默认为false
   */
  closeAllTags
};
