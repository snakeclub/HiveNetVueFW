/**
 * 设置页面主题的处理类
 */
import { getStore } from '@/utils/base/global';
import { colorToRgb, isLightColor, getThemeColorLight } from '@/utils/base/color';
import defaultSettings from '@/settings'; // 从 settings.js 获取主界面的默认布局配置
import { broadcastChangeThemes } from '../iframe/IframeParent';

/**
 * 通过判断系统标识设置主题样式
 * 注：只有系统标识发生变化才会加载
 */
export const changeThemesBySysID = () => {
  const store = getStore();
  const settings = store.state.layoutSettings;
  if (!store.getters.layoutForceRefreshThemes && settings.currentSysId !== undefined && settings.currentSysId === store.state.app.sysId) {
    // sysId没有发生改变, 以及没有要求强制刷新
    return;
  }

  // 加载系统对应的layout配置到store
  loadThemesFromStorage(store.state.app.sysId);
  // 设置当前界面样式
  refreshViewThemes();

  // 更新当前的主题样式系统标识
  store.commit('layoutSettings/CHANGE_SETTING', {
    'currentSysId': store.state.app.sysId, 'forceRefreshThemes': false
  });
};

/**
 * 设置系统主题配置到localStorage（以及store）
 * @param {JSON} data - 要设置的主题数据，定义参考store的LayoutSettings.js
 * @param {string} sysId - 指定要设置的系统标识
 */
export const saveThemesToStorage = (data, sysId) => {
  const store = getStore();
  store.commit('layoutSettings/CHANGE_SETTING', data);
  const storageSetting = JSON.parse(localStorage.getItem('layout-settings') || '{}');
  const _sysId = (sysId === undefined || sysId === '') ? 'DEFAULT_SYS_ID' : sysId;
  storageSetting[_sysId] = getStoreThemesData();
  localStorage.setItem('layout-settings', JSON.stringify(storageSetting));
};

/**
 * 从localStorage获取系统主题配置，写入store中
 * @param {string} sysId - 指定要获取主题的系统标识
 * @returns {JSON} - 主题配置
 */
export const loadThemesFromStorage = (sysId) => {
  const storageSetting = JSON.parse(localStorage.getItem('layout-settings') || '{}');
  const _sysId = (sysId === undefined || sysId === '') ? 'DEFAULT_SYS_ID' : sysId;
  let data = storageSetting[_sysId];
  if (data === undefined) {
    data = storageSetting['DEFAULT_SYS_ID'] || {};
  }
  const store = getStore();
  store.commit('layoutSettings/CHANGE_SETTING', data);
};

/**
 * 清除设置的系统主题配置
 */
export const clearThemesFromStorage = () => {
  // 从缓存清除
  localStorage.removeItem('layout-settings');
  // store恢复为默认值
  const store = getStore();
  store.commit('layoutSettings/CHANGE_SETTING', {
    sidebarResizeable: defaultSettings.layout.sidebarResizeable,
    topNav: defaultSettings.layout.topNav,
    breadcrumb: defaultSettings.layout.breadcrumb,
    tagsView: defaultSettings.layout.tagsView,
    sidebarLogo: defaultSettings.layout.sidebarLogo,
    rightMenuDivider: defaultSettings.layout.rightMenuDivider,
    dynamicTitle: defaultSettings.layout.dynamicTitle,
    nightMode: defaultSettings.layout.nightMode,
    systemThemeColor: defaultSettings.layout.systemThemeColor,
    navbarThemeColor: defaultSettings.layout.navbarThemeColor,
    sidebarThemeColor: defaultSettings.layout.sidebarThemeColor,
    fontLightColor: defaultSettings.layout.fontLightColor,
    fontLightColorActive: defaultSettings.layout.fontLightColorActive,
    fontDarkColor: defaultSettings.layout.fontDarkColor,
    fontDarkColorActive: defaultSettings.layout.fontDarkColorActive
  });
};

/**
 * 从store中获取最新的桌面主题数据
 * @returns {JSON} - 获取到的桌面主题
 */
export const getStoreThemesData = () => {
  const store = getStore();
  const themes = store.state.layoutSettings;
  return {
    sidebarResizeable: themes.sidebarResizeable,
    topNav: themes.topNav,
    breadcrumb: themes.breadcrumb,
    tagsView: themes.tagsView,
    sidebarLogo: themes.sidebarLogo,
    rightMenuDivider: themes.rightMenuDivider,
    dynamicTitle: themes.dynamicTitle,
    nightMode: themes.nightMode,
    systemThemeColor: themes.systemThemeColor,
    navbarThemeColor: themes.navbarThemeColor,
    sidebarThemeColor: themes.sidebarThemeColor,
    fontLightColor: themes.fontLightColor,
    fontLightColorActive: themes.fontLightColorActive,
    fontDarkColor: themes.fontDarkColor,
    fontDarkColorActive: themes.fontDarkColorActive
  };
};

/**
 * 从store中获取最新的桌面主题数据（仅颜色样式）
 * @returns {JSON} - 获取到的桌面主题
 */
export const getStoreThemesColorData = () => {
  const store = getStore();
  const themes = store.state.layoutSettings;
  return {
    nightMode: themes.nightMode,
    systemThemeColor: themes.systemThemeColor,
    navbarThemeColor: themes.navbarThemeColor,
    sidebarThemeColor: themes.sidebarThemeColor,
    fontLightColor: themes.fontLightColor,
    fontLightColorActive: themes.fontLightColorActive,
    fontDarkColor: themes.fontDarkColor,
    fontDarkColorActive: themes.fontDarkColorActive
  };
};

/**
 * 刷新页面的主题配置
 */
export const refreshViewThemes = () => {
  // 先通知所有iframe页面更新主题颜色
  broadcastChangeThemes();

  // 处理自身的主题颜色更新
  const store = getStore();
  const themes = store.state.layoutSettings;

  // 组成属性
  let attribute = '';
  if (themes.systemThemeColor) {
    // 系统主题颜色，通过颜色计算更明亮的浅色激活颜色
    attribute += `--systemThemeColor: ${themes.systemThemeColor};`;
    // const result = lighten(themes.systemThemeColor, 58);
    // attribute += `--systemThemeColorActive: ${result};`;
    // 计算与背景配合的字体颜色
    const isLightThemes = isLightColor(colorToRgb(themes.systemThemeColor).join(','));
    const fontColor = isLightThemes ? themes.fontDarkColor : themes.fontLightColor;
    const fontColorActive = isLightThemes ? themes.fontDarkColorActive : themes.fontLightColorActive;
    attribute += `--fontColor: ${fontColor};`;
    attribute += `--fontColorActive: ${fontColorActive};`;
    // 添加九级的light颜色
    const lightColors = getThemeColorLight(themes.systemThemeColor);
    for (let i = 1; i <= 9; i++) {
      attribute += `--systemThemeColorLight${i.toString()}: ${lightColors[i - 1]};`;
    }
    // 激活颜色
    attribute += `--systemThemeColorActive: ${lightColors[9]};`;
  }
  if (themes.navbarThemeColor) {
    // 顶端导航栏主题颜色，通过颜色计算相近的浅色激活颜色
    attribute += `--navbarThemeColor: ${themes.navbarThemeColor};`;
    const result = lighten(themes.navbarThemeColor, 6);
    attribute += `--navbarThemeColorActive: ${result};`;
  }
  if (themes.sidebarThemeColor) {
    // 左侧菜单的样式主题
    attribute += `--sidebarThemeColor: ${themes.sidebarThemeColor};`;
    toggleClass({
      flag: isLightColor(colorToRgb(themes.sidebarThemeColor).join(',')),
      cls: 'sidebar--white'
    });
  }

  // 设置样式
  toggleClass({
    flag: themes.nightMode,
    cls: 'night-mode'
  });
  toggleClass({
    flag: themes.nightMode,
    cls: 'dark'
  });
  toggleClass({
    flag: themes?.navbarThemeColor ? isLightColor(colorToRgb(themes.navbarThemeColor).join(',')) : true,
    cls: 'navbar--white'
  });
  toggleClass({
    flag: true,
    cls: `layout-light-color`
  });
  document.querySelector(':root').setAttribute('style', attribute);

  // 解决element-plus button对象把样式颜色写到style中的问题，看后续是否会修复该问题
  for (const el of document.querySelectorAll('.el-button--primary')) {
    el.setAttribute('style', '');
  }
};

/**
 * 添加移除dom元素的class
 * @param {JSON} params - 传入的参数
 *   {
 *     flag: false, // 切换标志，true-添加class，false-删除class
 *     cls: '',  // 要切换的类名
 *     dom: ''  // 要处理的dom对象选择字符串
 *   }
 */
const toggleClass = (params) => {
  const { flag, cls } = params;
  let { dom } = params;
  dom = dom || 'body';
  const classList = document.querySelector(dom)?.classList;
  flag ? classList?.add(cls) : classList?.remove(cls);
};

// 颜色计算方法
const lighten = (color, amount) => {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color;
  amount = Math.trunc((255 * amount) / 100);
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount
  )}${addLight(color.substring(4, 6), amount)}`;
};

// 颜色计算方法
const addLight = (color, amount) => {
  const cc = parseInt(color, 16) + amount;
  const c = cc > 255 ? 255 : cc;
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
};
