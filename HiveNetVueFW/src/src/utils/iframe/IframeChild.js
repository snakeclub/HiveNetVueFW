/**
 * 支持iframe页面与主框架页面通讯的库 - 子窗口
 */
import elementResizeDetectorMaker from 'element-resize-detector';
import store from '@/store';
import IframeMessage from './IframeMessage';
import { refreshViewThemes } from '@/utils/actions/LayoutSettings';

// 监听元素改变大小事件的初始化实例
let elementSizeChangeListener;

// 改变大小事件的自定义处理事件清单，key为事件名，value为事件处理函数
const elementSizeChangeEvents = {};

/**
 * 初始化iframe框架子窗口
 * @param {function} eventFun - 可以指定自定义的通用函数处理消息
 * @param {JSON} messageEvents={} - 要加载的自定义事件处理函数清单，格式为：
 *   {
 *     eventName: eventFun,
 *     ...
 *   }
 *   注: eventName约定为父窗口为p开头，iframe窗口为f开头
 */
export function initIframeChild(eventFun, messageEvents = {}) {
  // 添加消息处理事件
  for (const _key in messageEvents) {
    IframeMessage.addMessageEvent(_key, messageEvents[_key]);
  }

  // 启动消息监听
  IframeMessage.AddMessageListener(eventFun);
}

/**
 * 销毁iframe框架
 * @param {function} eventFun - 可以指定自定义的函数处理消息
 */
export function destroyIframeChild(eventFun) {
  // 删除消息处理事件

  // 清除消息监听
  IframeMessage.RemoveMessageListener(eventFun);
}

/**
 * 新增消息事件处理函数
 * @param {string} eventName - 事件名，通过e.data中的name获取对应的事件处理函数进行处理
 * @param {function} eventFun - 具体事件处理函数，传入参数为e
 */
export function addMessageEvent(eventName, eventFun) {
  IframeMessage.addMessageEvent(eventName, eventFun);
}

/**
 * 删除消息事件处理函数
 * @param {string} eventName - 事件名
 */
export function removeMessageEvent(eventName) {
  IframeMessage.removeMessageEvent(eventName);
}

/**
 * 向iframe窗口发送消息
 * @param {string} name - 处理消息的事件名
 * @param {object} para - 要发送的消息数据(请求数据)
 * @param {string} target - 要发送到的窗口对象，传undefined则默认为父窗口
 * @param {function} feedbackEvent - 处理返回值的函数，如果有传入则代表通过该函数处理返回值
 *   注：函数收到的入参为返回值JSON对象，{ id: '', code: '', msg: '', ... }
 * @param {int} overtime=3000 - 等待返回结果的超时时间, 0代表永不超时
 */
export function sendMessage(name, para, target, feedbackEvent, overtime = 3000) {
  const _target = target || window.parent;
  IframeMessage.sendMessage(
    name, para, _target, false, feedbackEvent, overtime
  );
}

/**
 * 获取框架的iframe路径配置，后续部分执行操作需要使用该配置
 * 注：如果是标准框架直接使用该函数获取即可，非标准框架可以自行实现函数取配置值
 * @returns {string} - 获取
 */
export function getIframePath() {
  if (store.state.app && store.state.app.cachedIframePath) {
    return store.state.app.cachedIframePath;
  } else {
    return '/layout/iframe';
  }
}

/**
 * 判断是否在Layout框架下打开
 * @param {string} iframePath - iframe路径配置, 不传默认使用getIframePath函数获取
 * @returns {bool} - 返回判断结果
 */
export function isUnderLayout(iframePath) {
  // 非顶层窗口，且父窗口对象的url路径名与iframe路径配置一致
  if (window.self === window.top) return false; // 如果是顶层窗口，则不在框架下
  const _tempIframePath = iframePath || getIframePath();
  return window.parent.location.pathname === _tempIframePath;
}

/**
 * 获取iframe的信息
 * @param {function} feedbackEvent - 处理返回信息函数，传入的返回信息格式为：
 * {
 *   code: '00000', // '00000'-成功，其他代表失败
 *   msg: '', // 错误信息
 *   iframeInfo: {
 *     sysId: '', // 所属系统标识
 *     iframeId: '', // 当前iframe的id
 *   }
 * }
 */
export function getIframeInfo(feedbackEvent) {
  sendMessage(
    'pGetLayoutInfo', { infoType: 'iframeInfo' }, undefined, feedbackEvent
  );
}

/**
 * 获取主题信息
 * @param {function} feedbackEvent - 处理返回信息函数，传入的返回信息格式为：
 * {
 *   code: '00000', // '00000'-成功，其他代表失败
 *   msg: '', // 错误信息
 *   themes: {
 *     ...
 *   }
 * }
 */
export function getLayoutThemes(feedbackEvent) {
  sendMessage(
    'pGetLayoutInfo', { infoType: 'themes' }, undefined, feedbackEvent
  );
}

/**
 * 获取主框架的iframe容器的显示大小
 * @param {function} feedbackEvent - 处理返回信息函数，传入的返回信息格式为：
 * {
 *   code: '00000', // '00000'-成功，其他代表失败
 *   msg: '', // 错误信息
 *   size: {
 *     width: xx, height: xx
 *   }
 * }
 */
export function getIframeContainerSize(feedbackEvent) {
  sendMessage(
    'pGetLayoutInfo', { infoType: 'iframeContainerSize' }, undefined, feedbackEvent
  );
}

/**
 * 获取主框架的iframe容器滚动条位置
 * @param {function} feedbackEvent - 处理返回信息函数，传入的返回信息格式为：
 * {
 *   code: '00000', // '00000'-成功，其他代表失败
 *   msg: '', // 错误信息
 *   'app-main': { // 容器的滚动信息
 *     scrollLeft: xx, scrollTop: xx
 *   },
 *   iframe: { // iframe元素的滚动信息
 *     scrollLeft: xx, scrollTop: xx
 *   }
 * }
 */
export function getiframeContainerScroll(feedbackEvent) {
  sendMessage(
    'pGetLayoutInfo', { infoType: 'iframeContainerScroll' }, undefined, feedbackEvent
  );
}

/**
 * 打开Layout框架下的视图（路由位于Layout框架，非iframe自身应用路由）
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
 * @param {function} feedbackEvent - 处理返回值的事件函数，如果不传代表无需返回值
 *   注：返回值字典的tagName为新创建（或已打开）的页签
 */
export function openLayoutView(viewInfo, feedbackEvent) {
  sendMessage(
    'pPageAction', { actionType: 'openView', actionPara: viewInfo, respTagName: feedbackEvent !== undefined },
    undefined, feedbackEvent
  );
}

/**
 * 打开Layout框架下的url（注意，如果url不带域名，则代表是layout框架下的路由；其他情况必须带域名）
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
 * @param {function} feedbackEvent - 处理返回值的事件函数，如果不传代表无需返回值
 *   注：返回值字典的tagName为新创建（或已打开）的页签
 */
export function openLayoutLink(url, tagInfo, feedbackEvent) {
  sendMessage(
    'pPageAction', { actionType: 'openLink', actionPara: [url, tagInfo], respTagName: feedbackEvent !== undefined },
    undefined, feedbackEvent
  );
}

/**
 * 在当前窗口打开刷新新页面
 * @param {JSON} urlInfo - 要打开页面信息
 *   {
 *     url: '', // 要打开的url
 *     query: {} // 路由参数
 *   }
 */
export function openLayoutRefresh(urlInfo) {
  sendMessage(
    'pPageAction', { actionType: 'openRefresh', actionPara: urlInfo }
  );
}

/**
 * 跳转到指定的页签
 * @param {string} tagName - 页签名
 * @param {function} feedbackEvent - 处理返回值的事件函数，如果不传代表无需返回值
 *   注：返回的code为21002代表找不到页签
 */
export function switchLayoutTag(tagName, feedbackEvent) {
  sendMessage(
    'pPageAction', { actionType: 'toTag', actionPara: tagName, getResult: feedbackEvent !== undefined },
    undefined, feedbackEvent
  );
}

/**
 * 刷新指定页签页面
 * @param {string} tagName - 页签名
 * @param {function} feedbackEvent - 处理返回值的事件函数，如果不传代表无需返回值
 *   注：返回的code为21002代表找不到页签
 */
export function refreshLayoutTag(tagName, feedbackEvent) {
  sendMessage(
    'pPageAction', { actionType: 'refreshTag', actionPara: tagName, getResult: feedbackEvent !== undefined },
    undefined, feedbackEvent
  );
}

/**
 * 关闭Layout框架的指定页签页面
 * @param {string} tagName - 打开时的页签名
 * @param {function} feedbackEvent - 处理返回值的事件函数，如果不传代表无需返回值
 *   注：返回的code为21002代表找不到页签
 */
export function closeLayoutTag(tagName, feedbackEvent) {
  sendMessage(
    'pPageAction', { actionType: 'closeTag', actionPara: tagName, getResult: feedbackEvent !== undefined },
    undefined, feedbackEvent
  );
}

/**
 * 改变iframe页面的显示大小
 * @param {JSON} info - iframe页面信息
 *   {
 *     iframeId: '', 如果不填代表获取当前的iframe页面
 *     width: -1, 要改变的显示宽度，如果不填或填-1，代表不修改
 *     height: -1, 要改变的显示高度，如果不填或填-1，代表不修改
 *   }
 * @param {function} feedbackEvent - 处理返回值的事件函数，如果不传代表无需返回值
 *   注：返回的code为21002代表找不到页签
 */
export function setIframeSize(info, feedbackEvent) {
  const iframeInfo = Object.assign({}, info);
  if (iframeInfo.iframeId === undefined || iframeInfo.iframeId === '') {
    iframeInfo.iframeId = store.state.iframePageInfo.iframeId;
  }
  if (iframeInfo.width === -1) iframeInfo.width = undefined;
  if (iframeInfo.height === -1) iframeInfo.height = undefined;
  sendMessage(
    'pPageAction', { actionType: 'setIframeSize', actionPara: iframeInfo, getResult: feedbackEvent !== undefined },
    undefined, feedbackEvent
  );
}

/**
 * 设置iframe页面的大小类型
 * @param {JSON} info - 设置信息
 *   {
 *     iframeId: '', 如果不填代表获取当前的iframe页面
 *     sizeType: '', fit/none
 *     listenScroll: false, 是否监听滚动信息
 *     listenResize: false, 是否监听iframe容器大小改变信息
 *   }
 * @param {function} feedbackEvent - 处理返回值的事件函数，如果不传代表无需返回值
 *   注：返回的code为21002代表找不到页签
 */
export function setIframeSizeType(info, feedbackEvent) {
  const setInfo = Object.assign({}, info);
  if (setInfo.iframeId === undefined || setInfo.iframeId === '') {
    setInfo.iframeId = store.state.iframePageInfo.iframeId;
  }
  if (setInfo.sizeType === undefined || setInfo.sizeType === '') setInfo.sizeType = 'none';
  if (setInfo.listenScroll === undefined) setInfo.listenScroll = false;
  if (setInfo.listenResize === undefined) setInfo.listenResize = false;
  sendMessage(
    'pPageAction', { actionType: 'setIframeSizeType', actionPara: setInfo, getResult: feedbackEvent !== undefined },
    undefined, feedbackEvent
  );
}

/** ********************************
 * 下面的函数为针对相同体系通用页面的支持
 *********************************/

/**
 * 页面装载完成后执行iframe框架的初始化
 * @param {*} _this - 页面的this对象
 * @param {function} eventFun - 可以指定自定义的通用函数处理消息
 * @param {JSON} messageEvents={} - 要加载的自定义事件处理函数清单，格式为：
 *   {
 *     eventName: eventFun,
 *     ...
 *   }
 *   注: eventName约定为父窗口为p开头，iframe窗口为f开头
 */
export function onMounted(_this, eventFun, messageEvents = {}) {
  // 判断是否
  const _isIframe = isUnderLayout();
  store.commit('iframePageInfo/CHANGE_INFO', { isIframe: _isIframe });
  if (_isIframe) {
    // 初始化框架
    messageEvents['fChangeThemes'] = fChangeThemes;
    messageEvents['fChangeSize'] = fChangeSize;
    messageEvents['fChangeLang'] = fChangeLang;
    messageEvents['fChangeSize'] = fChangeSize;
    messageEvents['fContainerResize'] = fContainerResize;
    messageEvents['fContainerScroll'] = fContainerScroll;
    initIframeChild(eventFun, messageEvents);
    // 获取当前iframe的基本信息
    getIframeInfo(function(e) {
      if (e.code !== '00000') {
        _this.$modal.messageError('getIframeInfo error: ' + JSON.stringify(e));
      } else {
        _this.$store.commit('iframePageInfo/CHANGE_INFO', e.iframeInfo);
      }
    });
    // 获取界面主题
    getLayoutThemes(function(e) {
      if (e.code !== '00000') {
        _this.$modal.messageError('getLayoutThemes error: ' + JSON.stringify(e));
      } else {
        _this.$store.commit('iframePageInfo/CHANGE_INFO', { themes: e.themes });
      }
    });
    // 监听界面大小的变化，遇到变化主动通知主框架改变高度
    elementSizeChangeListener = elementResizeDetectorMaker({
      strategy: 'scroll', // <- For ultra performance.
      callOnAdd: true,
      debug: false
    });
    elementSizeChangeListener.listenTo(window.document.body, function(el) {
      // 监听body的大小变化，执行自定义的改变大小事件
      for (const eventName in elementSizeChangeEvents) {
        elementSizeChangeEvents[eventName](el);
      }
    });
  }
}

/**
 * 页面销毁完成后执行iframe框架卸载
 * @param {*} _this - 页面的this对象
 * @param {function} eventFun - 可以指定自定义的通用函数处理消息
 */
export function onDestroyed(_this, eventFun) {
  if (store.state.iframePageInfo.isIframe) {
    // 卸载框架
    destroyIframeChild(eventFun);
    // 卸载改变大小的监听动作
    elementSizeChangeListener.uninstall(window.document.body);
  }
}

/**
 * 新增界面改变大小事件处理函数
 * @param {string} eventName - 事件名
 * @param {function} eventFun - 具体事件处理函数，传入参数为body元素
 */
export function addResizeEvent(eventName, eventFun) {
  elementSizeChangeEvents[eventName] = eventFun;
}

/**
 * 删除界面改变大小事件处理函数
 * @param {string} eventName - 事件名
 */
export function removeResizeEvent(eventName) {
  delete elementSizeChangeEvents[eventName];
}

/**
 * 监控框架主题发生变化需要执行的主题刷新函数
 * @param {object} _this - 页面的this对象
 * @param {JSON} newThemes - 新的主题颜色配置
 */
export function onWatchLayoutThemes(_this, newThemes) {
  // 将主题颜色更新到store
  _this.$store.commit('layoutSettings/CHANGE_SETTING', newThemes);
  // 刷新页面主题
  refreshViewThemes();
}

/**
 * 监控框架语言发生变化需要执行的语言刷新函数
 * @param {object} _this - 页面的this对象
 * @param {JSON} newLang - 新的语言配置
 */
export function onWatchLayoutLang(_this, newLang) {
  _this.$i18n.locale = newLang;
  _this.$store.commit('app/SET_LANG', newLang);
}

/**
 * 监控框架组件大小发生变化需要执行的组件大小刷新函数
 * 注意：这个动作只能影响新组件的大小，已渲染的组件无法动态更新，除非将el-form或显示组件的size属性直接绑定为store.state.app.size
 * @param {object} _this - 页面的this对象
 * @param {JSON} newLang - 新的语言配置
 */
export function onWatchLayoutSize(_this, newSize) {
  _this.$el.size; // 改变element-plus组件默认大小设置
  _this.$store.commit('app/SET_SIZE', newSize);
}

/**
 * 切换modal打开的框架位置
 * @param {string} to - 打开位置,layout-主框架，self-页面框架
 */
export function switchModal(to) {
  if (to === 'layout') {
    store.commit('iframePageInfo/CHANGE_INFO', { useSelfModal: false });
  } else {
    store.commit('iframePageInfo/CHANGE_INFO', { useSelfModal: true });
  }
}

/** ********************************
 * 下面的函数通用的框架消息处理函数
 *********************************/

/**
 * 处理变更主题颜色
 * @param {object} e - 消息对象
 */
function fChangeThemes(e) {
  // 更新页面基本信息，通过监控变量自行处理主题变更
  store.commit('iframePageInfo/CHANGE_INFO', { themes: e.data.para });
}

/**
 * 处理变更组件大小
 * @param {object} e - 消息对象
 */
function fChangeSize(e) {
  // 更新页面基本信息，通过监控变量自行处理主题变更
  store.commit('iframePageInfo/CHANGE_INFO', { size: e.data.para });
}

/**
 * 处理变更语言
 * @param {object} e - 消息对象
 */
function fChangeLang(e) {
  // 更新页面基本信息，通过监控变量自行处理主题变更
  store.commit('iframePageInfo/CHANGE_INFO', { lang: e.data.para });
}

/**
 * 处理主框iframe容器大小发生变化的情况
 * @param {object} e - 消息对象
 */
function fContainerResize(e) {
  store.commit('iframePageInfo/CHANGE_INFO', { containerSize: e.data.para });
}

/**
 * 处理主框iframe容器滚动条信息发生变化
 * @param {object} e - 消息对象
 */
function fContainerScroll(e) {
  store.commit('iframePageInfo/CHANGE_INFO', { containerScroll: e.data.para });
}

export default {
  /**
   * 初始化iframe框架子窗口
   * @param {function} eventFun - 可以指定自定义的函数处理消息
   */
  initIframeChild,

  /**
   * 销毁iframe框架
   * @param {function} eventFun - 可以指定自定义的函数处理消息
   */
  destroyIframeChild,

  /**
   * 新增消息事件处理函数
   * @param {string} eventName - 事件名，通过e.data中的name获取对应的事件处理函数进行处理
   * @param {function} eventFun - 具体事件处理函数，传入参数为e
   */
  addMessageEvent,

  /**
   * 删除消息事件处理函数
   * @param {string} eventName - 事件名
   */
  removeMessageEvent,

  /**
   * 向iframe窗口发送消息
   * @param {string} name - 处理消息的事件名
   * @param {object} para - 要发送的消息数据(请求数据)
   * @param {string} target - 要发送到的窗口对象，传undefined则默认为父窗口
   * @param {function} feedbackEvent - 处理返回值的函数，如果有传入则代表通过该函数处理返回值
   *   注：函数收到的入参为返回值JSON对象，{ id: '', code: '', msg: '', ... }
   * @param {int} overtime=3000 - 等待返回结果的超时时间
   */
  sendMessage,

  /**
   * 获取框架的iframe路径配置，后续部分执行操作需要使用该配置
   * 注：如果是标准框架直接使用该函数获取即可，非标准框架可以自行实现函数取配置值
   * @returns {string} - 获取
   */
  getIframePath,

  /**
   * 判断是否在Layout框架下打开
   * @param {string} iframePath - iframe路径配置, 不传默认使用getIframePath函数获取
   * @returns {bool} - 返回判断结果
   */
  isUnderLayout,

  /**
   * 获取iframe的信息
   * @param {function} feedbackEvent - 处理返回信息函数，传入的返回信息格式为：
   * {
   *   code: '00000', // '00000'-成功，其他代表失败
   *   msg: '', // 错误信息
   *   sysId: '', // 所属系统标识
   *   iframeId: '', // 当前iframe的id
   * }
   */
  getIframeInfo,

  /**
   * 获取主题信息
   * @param {function} feedbackEvent - 处理返回信息函数，传入的返回信息格式为：
   * {
   *   code: '00000', // '00000'-成功，其他代表失败
   *   msg: '', // 错误信息
   *   themes: {
   *     ...
   *   }
   * }
   */
  getLayoutThemes,

  /**
   * 获取主框架的iframe容器的显示大小
   * @param {function} feedbackEvent - 处理返回信息函数，传入的返回信息格式为：
   * {
   *   code: '00000', // '00000'-成功，其他代表失败
   *   msg: '', // 错误信息
   *   size: {
   *     width: xx, height: xx
   *   }
   * }
   */
  getIframeContainerSize,

  /**
   * 获取主框架的iframe容器滚动条位置
   * @param {function} feedbackEvent - 处理返回信息函数，传入的返回信息格式为：
   * {
   *   code: '00000', // '00000'-成功，其他代表失败
   *   msg: '', // 错误信息
   *   'app-main': { // 容器的滚动信息
   *     scrollLeft: xx, scrollTop: xx
   *   },
   *   iframe: { // iframe元素的滚动信息
   *     scrollLeft: xx, scrollTop: xx
   *   }
   * }
   */
  getiframeContainerScroll,

  /**
   * 打开Layout框架下的视图（路由位于Layout框架，非iframe自身应用路由）
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
   * @param {function} feedbackEvent - 处理返回值的事件函数，如果不传代表无需返回值
   *   注：返回值字典的tagName为新创建（或已打开）的页签
   */
  openLayoutView,

  /**
   * 打开Layout框架下的url（注意，如果url不带域名，则代表是layout框架下的路由；其他情况必须带域名）
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
   * @param {function} feedbackEvent - 处理返回值的事件函数，如果不传代表无需返回值
   *   注：返回值字典的tagName为新创建（或已打开）的页签
   */
  openLayoutLink,

  /**
   * 在当前窗口打开刷新新页面
   * @param {JSON} urlInfo - 要打开页面信息
   *   {
   *     url: '', // 要打开的url
   *     query: {} // 路由参数
   *   }
   */
  openLayoutRefresh,

  /**
   * 跳转到指定的页签
   * @param {string} tagName - 页签名
   * @param {function} feedbackEvent - 处理返回值的事件函数，如果不传代表无需返回值
   *   注：返回的code为21002代表找不到页签
   */
  switchLayoutTag,

  /**
   * 刷新指定页签页面
   * @param {string} tagName - 页签名
   * @param {function} feedbackEvent - 处理返回值的事件函数，如果不传代表无需返回值
   *   注：返回的code为21002代表找不到页签
   */
  refreshLayoutTag,

  /**
   * 关闭Layout框架的指定页签页面
   * @param {string} tagName - 打开时的页签名
   * @param {function} feedbackEvent - 处理返回值的事件函数，如果不传代表无需返回值
   *   注：返回的code为21002代表找不到页签
   */
  closeLayoutTag,

  /**
   * 改变iframe页面的显示大小
   * @param {JSON} info - iframe页面信息
   *   {
   *     iframeId: '', 如果不填代表获取当前的iframe页面
   *     width: -1, 要改变的显示宽度，如果不填或填-1，代表不修改
   *     height: -1, 要改变的显示高度，如果不填或填-1，代表不修改
   *   }
   * @param {function} feedbackEvent - 处理返回值的事件函数，如果不传代表无需返回值
   *   注：返回的code为21002代表找不到页签
   */
  setIframeSize,

  /**
   * 设置iframe页面的大小类型
   * @param {JSON} info - 设置信息
   *   {
   *     iframeId: '', 如果不填代表获取当前的iframe页面
   *     sizeType: '', fit/none
   *     listenScroll: false, 是否监听滚动信息
   *     listenResize: false, 是否监听iframe容器大小改变信息
   *   }
   * @param {function} feedbackEvent - 处理返回值的事件函数，如果不传代表无需返回值
   *   注：返回的code为21002代表找不到页签
   */
  setIframeSizeType,

  /**
   * 页面装载完成后执行iframe框架的初始化
   * @param {*} _this - 页面的this对象
   * @param {function} eventFun - 可以指定自定义的通用函数处理消息
   * @param {JSON} messageEvents={} - 要加载的自定义事件处理函数清单，格式为：
   *   {
   *     eventName: eventFun,
   *     ...
   *   }
   *   注: eventName约定为父窗口为p开头，iframe窗口为f开头
   */
  onMounted,

  /**
   * 页面销毁完成后执行iframe框架卸载
   * @param {*} _this - 页面的this对象
   * @param {function} eventFun - 可以指定自定义的通用函数处理消息
   */
  onDestroyed,

  /**
   * 新增界面改变大小事件处理函数
   * @param {string} eventName - 事件名
   * @param {function} eventFun - 具体事件处理函数，传入参数为body元素
   */
  addResizeEvent,

  /**
   * 删除界面改变大小事件处理函数
   * @param {string} eventName - 事件名
   */
  removeResizeEvent,

  /**
   * 监控框架主题发生变化需要执行的主题刷新函数
   * @param {object} _this - 页面的this对象
   * @param {JSON} newThemes - 新的主题颜色配置
   */
  onWatchLayoutThemes,

  /**
   * 监控框架语言发生变化需要执行的语言刷新函数
   * @param {object} _this - 页面的this对象
   * @param {JSON} newLang - 新的语言配置
   */
  onWatchLayoutLang,

  /**
   * 监控框架组件大小发生变化需要执行的组件大小刷新函数
   * 注意：这个动作只能影响新组件的大小，已渲染的组件无法动态更新，除非将组件的size属性绑定为store.state.app.size
   * @param {object} _this - 页面的this对象
   * @param {JSON} newLang - 新的语言配置
   */
  onWatchLayoutSize,

  /**
   * 切换modal打开的框架位置
   * @param {string} to - 打开位置,layout-主框架，self-页面框架
   */
  switchModal
};
