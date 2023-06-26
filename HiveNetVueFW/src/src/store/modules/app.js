/**
 * 应用主配置
 */
import { localCache } from '@/plugins/cache';
import defaultSettings from '@/settings'; // 从 settings.js 获取主界面的默认布局配置

const state = {
  // 当前app的系统信息
  sysId: '', // 系统id
  sysName: '', // 系统显示名
  logo: '', // 系统图标
  showCopyright: defaultSettings.app.showCopyright, // 是否显示版权信息
  copyrightFixedBottom: defaultSettings.app.copyrightFixedBottom, // 版权信息是否固定在底部（不随着内容滚动）
  // 侧边栏（菜单栏）的打开关闭状态
  sidebar: {
    opened: localCache.get('sidebarStatus') ? !!+localCache.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  // 当前激活的topNav菜单项，值为菜单的 name
  activeTopNavMenu: '',
  device: 'desktop', // 设备类型指定为PC（mobile, pad, desktop）
  size: localCache.get('size') || 'default', // 显示大小
  lang: localCache.get('lang') || defaultSettings.app.lang || 'zh_cn', // 显示语言
  // 框架内嵌iframe页面的路径
  cachedIframePath: defaultSettings.app.cachedIframePath
};

const mutations = {
  // 修改系统信息
  SET_APP_SYS_CONFIG: (state, payLoad) => {
    if (payLoad.sysId !== undefined) state.sysId = payLoad.sysId;
    if (payLoad.sysName !== undefined) state.sysName = payLoad.sysName;
    if (payLoad.logo !== undefined) state.logo = payLoad.logo;
  },

  // 切换侧边栏的打开关闭状态
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      localCache.set('sidebarStatus', 1);
    } else {
      localCache.set('sidebarStatus', 0);
    }
  },

  // 关闭侧边栏
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    localCache.set('sidebarStatus', 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },

  // 设置激活菜单
  SET_ACTIVE_MENU: (state, payload) => {
    if (payload.activeTopNavMenu !== undefined) { state.activeTopNavMenu = payload.activeTopNavMenu; }
  },

  // 切换设备类型
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },

  // 修改显示大小
  SET_SIZE: (state, size) => {
    state.size = size;
    localCache.set('size', size);
  },

  // 修改语言
  SET_LANG: (state, lang) => {
    state.lang = lang;
    localCache.set('lang', lang);
  }
};

const actions = {
  // 切换侧边栏的打开关闭状态
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },
  // 关闭侧边栏
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation);
  },
  // 切换设备类型
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device);
  },
  // 修改显示大小
  setSize({ commit }, size) {
    commit('SET_SIZE', size);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
