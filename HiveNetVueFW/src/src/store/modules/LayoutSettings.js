/**
 * 主界面布局相关数据
 */
import defaultSettings from '@/settings'; // 从 settings.js 获取主界面的默认布局配置

const {
  sidebarWidth,
  sidebarResizeable,
  topNav,
  topNavVisibleNumber,
  breadcrumb,
  tagsView,
  sidebarLogo,
  rightMenuDivider,
  dynamicTitle,
  nightMode,
  systemThemeColor,
  navbarThemeColor,
  sidebarThemeColor,
  fontLightColor,
  fontLightColorActive,
  fontDarkColor,
  fontDarkColorActive
} = defaultSettings.layout;

// 设置主界面布局配置的全局共享状态
const state = {
  showLayoutSettings: false, // 指示是否显示布局配置界面
  isRefresh: false, // 指示是否刷新页面的标识
  isSizeRefresh: false, // 指示是否刷新控件大小
  forceRefreshThemes: false, // 指示是否强制刷新样式
  title: '',
  // 控制是否加载主题的变量
  currentSysId: undefined, // 当前加载的系统标识
  // 布局及主题设置
  sidebarWidth: sidebarWidth,
  sidebarResizeable: sidebarResizeable,
  topNav: topNav,
  topNavVisibleNumber: topNavVisibleNumber,
  breadcrumb: breadcrumb,
  tagsView: tagsView,
  sidebarLogo: sidebarLogo,
  rightMenuDivider: rightMenuDivider,
  dynamicTitle: dynamicTitle,
  nightMode: nightMode,
  systemThemeColor: systemThemeColor,
  navbarThemeColor: navbarThemeColor,
  sidebarThemeColor: sidebarThemeColor,
  fontLightColor: fontLightColor,
  fontLightColorActive: fontLightColorActive,
  fontDarkColor: fontDarkColor,
  fontDarkColorActive: fontDarkColorActive
};

// 同步修改状态值的函数配置，可在字典传入多个值进行设置
const mutations = {
  CHANGE_SETTING: (state, payload) => {
    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(state, key)) {
        state[key] = payload[key];
      }
    }
  },
  // 设置刷新页面的标识
  SET_REFRESH: (state, isRefresh) => {
    state.isRefresh = isRefresh;
  },
  // 设置控件大小刷新页面的标识
  SET_SIZE_REFRESH: (state, isSizeRefresh) => {
    state.isSizeRefresh = isSizeRefresh;
  }
};

// 异步修改状态值的函数配置
const actions = {
  // 修改布局设置，可在字典传入多个值进行设置
  changeSetting({ commit }, payload) {
    commit('CHANGE_SETTING', payload);
  },
  // 设置网页标题
  setTitle({ commit }, title) {
    state.title = title;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
