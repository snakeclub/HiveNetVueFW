/**
 * CachedIframe组件的缓存iframe数据
 */

const state = {
  /**
   * 当前已缓存的iframe对象，对象格式为：
   * {
   *   iframeId: '', // 唯一ID，请用nanoid生成
   *   url: '' // iframe要访问的url地址，可以通过修改这个值触发页面变更
   * }
   */
  cachedIframes: [],
  refreshIds: [], // 将要刷新的页面id放到数组指示页面刷新
  currentIframeId: '', // 当前的iframeId
  listenContainerResize: [], // 监听iframe所在容器大小发生变化的iframeId清单
  listenContainerScroll: [] // 监听iframe所在容器发生滚动事件的iframeId清单
};

const mutations = {
  // 设置当前iframeid
  SET_CURRENT_IFRAME_ID: (state, iframeId) => {
    state.currentIframeId = iframeId;
  },

  // 添加要缓存的iframe页面(更新也可以用这个方法处理)
  ADD_CACHED_IFRAME: (state, iframe) => {
    // 先清理iframe的刷新指令信息
    delRefreshId(state.refreshIds, iframe.iframeId);
    // 添加进来
    const clearIframeId = updateCachedIframeId(state.cachedIframes, iframe);
    // 清除重新加载iframeID的情况
    if (clearIframeId) {
      delArrayByValue(state.listenContainerResize, clearIframeId);
      delArrayByValue(state.listenContainerScroll, clearIframeId);
    }
  },

  // 删除要缓存的Iframe页面
  DEL_CACHED_IFRAME: (state, iframeId) => {
    // 先清理iframe的刷新指令信息
    delRefreshId(state.refreshIds, iframeId);
    // 删除存在的对象
    delCachedIframeId(state.cachedIframes, iframeId);
    // 删除监听清单
    delArrayByValue(state.listenContainerResize, iframeId);
    delArrayByValue(state.listenContainerScroll, iframeId);
  },

  // 添加要刷新的页面指令
  ADD_REFRESH_ID: (state, iframeId) => {
    if (state.refreshIds.includes(iframeId)) return;
    state.refreshIds.push(iframeId);
  },

  // 删除要刷新的页面指令
  DEL_REFRESH_ID: (state, iframeId) => {
    delRefreshId(state.refreshIds, iframeId);
  },

  // 添加监听iframe所在容器大小清单
  ADD_LISTEN_CONTAINER_RESIZE: (state, iframeId) => {
    if (state.listenContainerResize.includes(iframeId)) return;
    state.listenContainerResize.push(iframeId);
  },

  // 删除监听iframe所在容器大小清单
  DEL_LISTEN_CONTAINER_RESIZE: (state, iframeId) => {
    delArrayByValue(state.listenContainerResize, iframeId);
  },

  // 添加监听iframe所在容器发生滚动事件清单
  ADD_LISTEN_CONTAINER_SCROLL: (state, iframeId) => {
    if (state.listenContainerScroll.includes(iframeId)) return;
    state.listenContainerScroll.push(iframeId);
  },

  // 删除监听iframe所在容器发生滚动事件清单
  DEL_LISTEN_CONTAINER_SCROLL: (state, iframeId) => {
    delArrayByValue(state.listenContainerScroll, iframeId);
  },

  // 删除所有iframe缓存数据
  DEL_ALL_CACHED_IFRAMES: (state) => {
    state.cachedIframes = [];
    state.refreshIds = [];
    state.currentIframeId = '';
    state.listenContainerResize = [];
    state.listenContainerScroll = [];
  }
};

const actions = {
  // 添加要缓存的iframe页面(更新也可以用这个方法处理)
  addCachedIframe({ commit }, iframe) {
    commit('ADD_CACHED_IFRAME', iframe);
  },

  // 删除要缓存的Iframe页面
  delCachedIframe({ commit }, iframeId) {
    commit('DEL_CACHED_IFRAME', iframeId);
  },

  // 添加要刷新的页面指令
  addRefreshId({ commit }, iframeId) {
    commit('ADD_REFRESH_ID', iframeId);
  },

  // 删除要刷新的页面指令
  delRefreshId({ commit }, iframeId) {
    commit('DEL_REFRESH_ID', iframeId);
  },

  // 添加监听iframe所在容器大小清单
  addListenContainerResize({ commit }, iframeId) {
    commit('ADD_LISTEN_CONTAINER_RESIZE', iframeId);
  },

  // 删除监听iframe所在容器大小清单
  delListenContainerResize({ commit }, iframeId) {
    commit('DEL_LISTEN_CONTAINER_RESIZE', iframeId);
  },

  // 添加监听iframe所在容器发生滚动事件清单
  addListenContainerScroll({ commit }, iframeId) {
    commit('ADD_LISTEN_CONTAINER_SCROLL', iframeId);
  },

  // 删除监听iframe所在容器发生滚动事件清单
  delListenContainerScroll({ commit }, iframeId) {
    commit('DEL_LISTEN_CONTAINER_SCROLL', iframeId);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

/**
 * 从state.refreshIds删除指定id
 * @param {*} refreshIds - state.refreshIds
 * @param {*} iframe - 缓存iframe对象id
 */
function delRefreshId(refreshIds, iframeId) {
  for (let i = 0; i < refreshIds.length; i++) {
    if (refreshIds[i] === iframeId) {
      refreshIds.splice(i, 1);
      break;
    }
  }
}

/**
 * 从state.cachedIframeIds删除指定id
 * @param {*} cachedIframeIds - state.cachedIframeIds
 * @param {*} iframeId - 缓存iframe对象ID
 */
function delCachedIframeId(cachedIframeIds, iframeId) {
  for (let i = 0; i < cachedIframeIds.length; i++) {
    if (cachedIframeIds[i].iframeId === iframeId) {
      cachedIframeIds.splice(i, 1);
      break;
    }
  }
}

/**
 * 添加或更新iframe对象
 * @param {*} cachedIframeIds
 * @param {*} iframe
 * @returns {string} - 遇到需要清除原来frameID的情况需要返回
 */
function updateCachedIframeId(cachedIframeIds, iframe) {
  let clearIframeId;
  for (let i = 0; i < cachedIframeIds.length; i++) {
    if (cachedIframeIds[i].iframeId === iframe.iframeId) {
      if (cachedIframeIds[i].url === iframe.url) {
        // 完全一样，无需处理
        return;
      } else {
        // 删除对象资源，后面再更新
        clearIframeId = cachedIframeIds[i].iframeId;
        cachedIframeIds.splice(i, 1);
        break;
      }
    }
  }
  // 没有找到或被删除，更新
  cachedIframeIds.push(iframe);
  return clearIframeId;
}

/**
 * 删除数组指定值
 * @param {Array} arrayObj - 要处理的数组
 * @param {any} val - 比较值
 */
function delArrayByValue(arrayObj, val) {
  for (let i = 0; i < arrayObj.length; i++) {
    if (arrayObj[i] === val) {
      arrayObj.splice(i, 1);
      break;
    }
  }
}
