/**
 * 打开页面的相关方法
 */
import store from '@/store';
import { getRouter } from '@/utils/base/global';
import WebTools from '@/utils/base/WebTools';
import settings from '@/settings';
import { nanoid } from 'nanoid';
import { tagsViewFuns } from './TagsViewFuns';

/**
 * 打开新的页签（指定路由的视图）
 * @param {JSON} viewInfo - 视图信息
 *   {
 *     path: '', // 路由路径
 *     query: {}, // 路由参数
 *     params: {}, // 路由参数
 *     title: '',  // 页签标题名，可以支持i18n字符
 *     icon: '', // 页签图标
 *     isFixed: false, // 是否固定页签
 *     // 路由的meta参数, 可以扩展一些处理参数
 *     meta: {
 *       type: 'unknow', // 自定义页签类型(fixedTag/sidebar/right/unknow/...), 默认为unknow
 *       name: '', // 与自定义页签类型相对应，是该页签类型的的唯一标识
 *       cacheType: 'none', // 页签的缓存类型，none-不缓存,single-单也缓存,mutiple-多页缓存（注意，如果为非mutiple，要求路由必须存在）
 *       cachedName: '', // mutiple情况使用，动态生成组件的唯一标识名称，如果不传将自动使用nanoid生成
 *       componentName: '', // mutiple情况使用, 真正要展示的组件名
 *       props: {} // 向真正展示组件所传的创建参数
 *     }
 *   }
 * @param {bool} respTagName=false - 是否返回页签名
 * @returns {string} - 如果指定则返回页签名
 */
export const openViewInner = (viewInfo, respTagName = false) => {
  // 生成页签对象
  const tagInfo = {
    path: viewInfo.path,
    query: viewInfo.query,
    meta: viewInfo.meta || {}
  };
  if (viewInfo.title && viewInfo.title !== '') tagInfo.meta.title = viewInfo.title;
  if (viewInfo.icon && viewInfo.icon !== '') tagInfo.meta.icon = viewInfo.icon;
  if (viewInfo.isFixed !== undefined) tagInfo.meta.isFixed = viewInfo.isFixed;

  // 路由参数的标准化处理
  if (tagInfo.meta.cacheType && tagInfo.meta.cacheType === 'mutiple') {
    if (!tagInfo.meta.cachedName) {
      tagInfo.meta.cachedName = nanoid();
    }
  }

  // 生成对应的标签项，再进行跳转
  store.commit('tagsView/ADD_VISITED_VIEW', tagInfo);
  store.commit('tagsView/ADD_CACHED_COMPONENTS', tagInfo);
  const router = getRouter();
  const route = {
    path: tagInfo.path
  };
  if (tagInfo.query) route.query = tagInfo.query;
  if (tagInfo.params) route.params = tagInfo.params;
  if (tagInfo.meta) route.meta = tagInfo.meta;
  router.push(route);

  // 需要返回值的情况
  if (respTagName) {
    const addTag = tagsViewFuns.getTagByPath(tagInfo.path, tagInfo.query);
    if (addTag) {
      return addTag.name;
    }
  }
};

/**
 * 内部框架打开url
 * @param {string} url - 要打开的url
 * @param {JSON} tagInfo - 页签信息，关键内容包括：
 *   {
 *     title: '',  // 页签标题名，可以支持i18n字符
 *     icon: '', // 页签图标
 *     isFixed: false, // 是否固定页签
 *     // 路由的meta参数, 可以扩展一些处理参数
 *     meta: {
 *       type: 'unknow', // 自定义页签类型(fixedTag/sidebar/right/unknow/...), 默认为unknow
 *       name: '', // 与自定义页签类型相对应，是该页签类型的的唯一标识
 *       cacheType: 'none', // 页签的缓存类型，none-不缓存,single-单也缓存,mutiple-多页缓存（注意，如果为非mutiple，要求路由必须存在）
 *       cachedName: '', // mutiple情况使用，动态生成组件的唯一标识名称，如果不传将自动使用nanoid生成
 *       componentName: '', // mutiple情况使用, 真正要展示的组件名
 *       props: {} // 向真正展示组件所传的创建参数
 *     }
 *   }
 * @param {bool} respTagName=false - 是否返回页签名
 * @returns {string} - 如果指定则返回页签名
 */
export const openLinkInner = (url, tagInfo, respTagName = false) => {
  // 标准化tagInfo
  const selfTagInfo = {
    meta: tagInfo.meta || {}
  };

  // 组织meta的参数
  if (tagInfo.title && tagInfo.title !== '') selfTagInfo.meta.title = tagInfo.title;
  if (tagInfo.icon && tagInfo.icon !== '') selfTagInfo.meta.icon = tagInfo.icon;
  if (tagInfo.isFixed !== undefined) selfTagInfo.meta.isFixed = tagInfo.isFixed;

  // iframe的相应参数
  if (selfTagInfo.meta.cachedName === undefined) {
    selfTagInfo.meta.cachedName = nanoid();
  }
  selfTagInfo.meta.isCachedIframe = true;
  selfTagInfo.path = settings.app.cachedIframePath;
  selfTagInfo.query = { url: url, iframeid: selfTagInfo.meta.cachedName };
  if (settings.app.mutipleAppSupport) {
    // 通过query支持系统标识
    selfTagInfo.query.sysId = store.getters.sysId;
  }

  // 节点其他的必须参数
  if (selfTagInfo.meta.title === undefined) selfTagInfo.meta.title = 'Link';

  // 添加页签节点
  store.commit('tagsView/ADD_VISITED_VIEW', selfTagInfo);
  store.commit('tagsView/ADD_CACHED_COMPONENTS', selfTagInfo);
  const router = getRouter();
  const route = {
    path: selfTagInfo.path,
    query: selfTagInfo.query,
    meta: selfTagInfo.meta
  };
  router.push(route);

  // 需要返回值的情况
  if (respTagName) {
    const addTag = tagsViewFuns.getTagByPath(selfTagInfo.path, selfTagInfo.query);
    if (addTag) {
      return addTag.name;
    }
  }
};

/**
 * 在新窗口打开页面
 * @param {JSON} urlInfo - 要打开页面信息
 *   {
 *     url: '', // 要打开的url
 *     query: {} // 路由参数
 *   }
 * @param {string} openSpecs - window.open的打开参数，可不传
 * @param {int} extendScreen - 预留参数，窗口所需放置在的扩展屏，0代表在主屏幕，1代表在第一个扩展屏
 */
export const openBlank = (urlInfo, openSpecs, extendScreen) => {
  // 处理新窗口参数
  let url = urlInfo.url;
  if (urlInfo.query !== undefined) {
    url = url + '?' + WebTools.query2UrlParam(urlInfo.query);
  }

  // 打开新窗口，送入传参
  if (openSpecs === undefined || openSpecs === '') {
    window.open(url, '_blank');
  } else {
    window.open(url, '_blank', openSpecs);
  }
};

/**
 * 在当前窗口打开刷新新页面
 * @param {JSON} urlInfo - 要打开页面信息
 *   {
 *     url: '', // 要打开的url
 *     query: {} // 路由参数
 *   }
 */
export const openRefresh = (urlInfo) => {
  // 处理窗口参数
  let url = urlInfo.url;
  if (urlInfo.query !== undefined) {
    url = url + '?' + WebTools.query2UrlParam(urlInfo.query);
  }
  window.open(url, '_self');
};

export default {
  /**
   * 打开新的页签（指定路由的视图）
   * @param {JSON} viewInfo - 视图信息
   *   {
   *     path: '', // 路由路径
   *     query: {}, // 路由参数
   *     params: {}, // 路由参数
   *     title: '',  // 页签标题名，可以支持i18n字符
   *     icon: '', // 页签图标
   *     isFixed: false, // 是否固定页签
   *     // 路由的meta参数, 可以扩展一些处理参数
   *     meta: {
   *       type: 'unknow', // 自定义页签类型(fixedTag/sidebar/right/unknow/...), 默认为unknow
   *       name: '', // 与自定义页签类型相对应，是该页签类型的的唯一标识
   *       cacheType: 'none', // 页签的缓存类型，none-不缓存,single-单也缓存,mutiple-多页缓存（注意，如果为非mutiple，要求路由必须存在）
   *       cachedName: '', // mutiple情况使用，动态生成组件的唯一标识名称，如果不传将自动使用nanoid生成
   *       componentName: '', // mutiple情况使用, 真正要展示的组件名
   *       props: {} // 向真正展示组件所传的创建参数
   *     }
   *   }
   */
  openViewInner,

  /**
   * 内部框架打开url
   * @param {string} url - 要打开的url
   * @param {JSON} tagInfo - 页签信息，关键内容包括：
   *   {
   *     title: '',  // 页签标题名，可以支持i18n字符
   *     icon: '', // 页签图标
   *     isFixed: false, // 是否固定页签
   *     // 路由的meta参数, 可以扩展一些处理参数
   *     meta: {
   *       type: 'unknow', // 自定义页签类型(fixedTag/sidebar/right/unknow/...), 默认为unknow
   *       name: '', // 与自定义页签类型相对应，是该页签类型的的唯一标识
   *       cacheType: 'none', // 页签的缓存类型，none-不缓存,single-单也缓存,mutiple-多页缓存（注意，如果为非mutiple，要求路由必须存在）
   *       cachedName: '', // mutiple情况使用，动态生成组件的唯一标识名称，如果不传将自动使用nanoid生成
   *       componentName: '', // mutiple情况使用, 真正要展示的组件名
   *       props: {} // 向真正展示组件所传的创建参数
   *     }
   *   }
   * @param {bool} respTagName=false - 是否返回页签名
   * @returns {string} - 如果指定则返回页签名
   */
  openLinkInner,

  /**
   * 在当前窗口打开刷新新页面
   * @param {JSON} urlInfo - 要打开页面信息
   *   {
   *     url: '', // 要打开的url
   *     query: {} // 路由参数
   *   }
   */
  openRefresh
};
