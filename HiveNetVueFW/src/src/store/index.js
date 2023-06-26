import { createStore } from 'vuex';
import layoutSettings from './modules/LayoutSettings';
import app from './modules/app';
import menus from './modules/menus';
import user from './modules/user';
import tagsView from './modules/TagsView';
import cachedIframe from './modules/CachedIframe';
import iframePageInfo from './modules/IframePageInfo';
import getters from './getters';

// 以模块方式切割状态树
export default createStore({
  modules: {
    app,
    menus,
    layoutSettings,
    user,
    tagsView,
    cachedIframe,
    iframePageInfo
  },
  getters
});
