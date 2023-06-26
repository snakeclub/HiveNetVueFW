/**
 * 支持iframe页面与主框架页面通讯的库 - 父窗口
 */
import store from '@/store';
import IframeMessage from './IframeMessage';
import { getStoreThemesColorData } from '@/utils/actions/LayoutSettings';
import modal from '@/plugins/modal';
import PageAction from '@/utils/actions/PageAction';
import { tagsViewFuns } from '@/utils/actions/TagsViewFuns';

/**
 * 初始化iframe框架父窗口
 * @param {function} eventFun - 可以指定自定义的函数处理消息
 * @param {JSON} messageEvents={} - 要加载的自定义事件处理函数清单，格式为：
 *   {
 *     eventName: eventFun,
 *     ...
 *   }
 *   注: eventName约定为父窗口为p开头，iframe窗口为f开头
 */
export function initIframeParent(eventFun, messageEvents = {}) {
  // 添加消息处理事件
  IframeMessage.addMessageEvent('pGetLayoutInfo', pGetLayoutInfo);
  IframeMessage.addMessageEvent('pShowModal', pShowModal);
  IframeMessage.addMessageEvent('pPageAction', pPageAction);
  for (const eventName in messageEvents) {
    IframeMessage.addMessageEvent(eventName, messageEvents[eventName]);
  }
  // 启动消息监听
  IframeMessage.AddMessageListener(eventFun);
}

/**
 * 销毁iframe框架
 * @param {string} channelId - 渠道标识
 * @param {function} eventFun - 可以指定自定义的函数处理消息
 * @param {JSON} messageEvents={} - 要加载的自定义事件处理函数清单，格式为：
 *   {
 *     eventName: eventFun,
 *     ...
 *   }
 */
export function destroyIframeParent(eventFun, messageEvents = {}) {
  // 删除消息处理事件
  IframeMessage.removeMessageEvent('pGetLayoutInfo');
  IframeMessage.removeMessageEvent('pShowModal');
  IframeMessage.removeMessageEvent('pPageAction');
  for (const eventName in messageEvents) {
    IframeMessage.removeMessageEvent(eventName);
  }

  // 清除消息监听
  IframeMessage.RemoveMessageListener(eventFun);
}

/**
 * 向iframe窗口发送消息
 * @param {string} name - 处理消息的事件名
 * @param {object} para - 要发送的消息数据(请求数据)
 * @param {string} iframeId - 要发送的iframe标识
 * @param {function} feedbackEvent - 处理返回值的函数，如果有传入则代表通过该函数处理返回值
 *   注：函数收到的入参为返回值JSON对象，{ id: '', code: '', msg: '', ... }
 * @param {int} overtime=3000 - 等待返回结果的超时时间, 0代表永不超时
 */
export function sendMessage(name, para, iframeId, feedbackEvent, overtime = 3000) {
  const _target = document.getElementById(iframeId).childNodes[0].contentWindow;
  IframeMessage.sendMessage(
    name, para, _target, false, feedbackEvent, overtime
  );
}

/**
 * 向所有iframe客户端广播消息
 * 注：不处理返回信息
 * @param {string} name - 处理消息的事件名
 * @param {object} para - 要发送的消息数据(请求数据)
 */
export function broadcastMessage(name, para) {
  for (const iframeObj of store.state.cachedIframe.cachedIframes) {
    sendMessage(name, para, iframeObj.iframeId);
  }
}

/**
 * 以下为向子页面发送请求的通用函数
 */

/**
 * 通知所有子页面变更主题颜色
 */
export function broadcastChangeThemes() {
  const themes = getStoreThemesColorData();
  broadcastMessage('fChangeThemes', themes);
}

/**
 * 通知所有子页面变更组件大小
 */
export function broadcastChangeSize() {
  broadcastMessage('fChangeSize', store.state.app.size);
}

/**
 * 通知所有子页面变更语言
 */
export function broadcastChangeLang() {
  broadcastMessage('fChangeLang', store.state.app.lang);
}

/**
 * 通知注册监听的iframe页面容器大小发生变化
 * @param {int} width - 宽度
 * @param {int} height - 高度
 */
export function sendIframeContainerResize(width, height) {
  for (const iframeId of store.state.cachedIframe.listenContainerResize) {
    sendMessage(
      'fContainerResize', { width, height }, iframeId
    );
  }
}

/**
 * 通知当前iframe页面容器滚动位置发生变化（注册了监听的情况）
 * @param {int} scrollLeft - 滚动条横向位置
 * @param {int} scrollTop - 滚动条纵向位置
 */
export function sendIframeContainerScroll(scrollLeft, scrollTop) {
  const currentIframeId = store.state.cachedIframe.currentIframeId;
  if (store.state.cachedIframe.listenContainerScroll.includes(currentIframeId)) {
    sendMessage(
      'fContainerScroll', { scrollLeft, scrollTop }, currentIframeId
    );
  }
}

/**
 * 以下为处理iframe请求消息的函数
 */

/**
 * 获取框架信息
 * @param {object} e - 请求的消息对象
 * @returns {json} - 要返回的数据，如果是undefined代表不返回消息
 *   {
 *     code: '00000', // 错误码
 *     msg: '', // 错误说明
 *     ...
 *   }
 */
function pGetLayoutInfo(e) {
  const para = e.data.para;
  let result = { code: '00000', msg: 'success' };
  let tag, iframeId, el;
  switch (para.infoType) {
    case 'iframeInfo':
      // 获取iframe基本信息
      iframeId = e.source.frameElement.parentNode.id;
      tag = tagsViewFuns.getTagByIframeId(iframeId);
      result['iframeInfo'] = {
        sysId: store.state.app.sysId,
        iframeId: iframeId,
        tagName: tag ? tag.name : '',
        size: store.state.app.size,
        lang: store.state.app.lang
      };
      break;
    case 'themes':
      // 获取主题信息
      result['themes'] = getStoreThemesColorData();
      break;
    case 'iframeContainerSize':
      // 获取iframe容器的大小
      el = window.document.getElementById('app-main-iframe');
      result['size'] = {
        width: el.clientWidth,
        height: el.clientHeight
      };
      break;
    case 'iframeContainerScroll':
      // 获取iframe滚动条的位置信息
      el = window.document.getElementById('app-main-iframe');
      result['scrollInfo'] = {
        scrollLeft: el.scrollLeft,
        scrollTop: el.scrollTop
      };
      break;
    default:
      console.error('Ifarme parent query layout info type not found!', e.data);
      result = undefined; // undefined情况不返回
      break;
  }
  return result;
}

/**
 * 显示$modal的消息框
 * @param {object} e - 请求的消息对象
 * @returns {json} - 要返回的数据，如果是undefined代表不返回消息
 *   {
 *     code: '00000', // 错误码
 *     msg: '', // 错误说明
 *     ...
 *   }
 */
function pShowModal(e) {
  const para = e.data.para;
  let result, callback, id;
  switch (para.modalType) {
    case 'showMessage':
      modal.message(para.modalPara);
      break;
    case 'showAlert':
      modal.alert(...para.modalPara);
      break;
    case 'showNotification':
      modal.notify(para.modalPara);
      break;
    case 'showMessageBox':
      console.debug(e.data);
      id = e.data.id;
      callback = function(action, instance) {
        // 将messagebox的action返回
        IframeMessage.sendMessage(
          '', { code: '00000', msg: 'success', id: id, action: action },
          e.source, true
        );
      };
      para.modalPara.callback = callback;
      modal.messageBox(para.modalPara);
      break;
    case 'loading':
      modal.loading(para.modalPara);
      break;
    case 'transparentLoading':
      modal.transparentLoading();
      break;
    case 'closeLoading':
      modal.closeLoading();
      break;
    default:
      console.error('Ifarme parent show modal type not found!', e.data);
      break;
  }
  return result;
}

/**
 * 进行页面操作
 * @param {object} e - 请求的消息对象
 * @returns {json} - 要返回的数据，如果是undefined代表不返回消息
 *   {
 *     code: '00000', // 错误码
 *     msg: '', // 错误说明
 *     ...
 *   }
 */
function pPageAction(e) {
  const para = e.data.para;
  let result = { code: '00000', msg: 'success' };
  let tagName, tag, el, iframeId, iframeDiv;
  let computedStyle, minHeight;
  switch (para.actionType) {
    case 'openView':
      // 打开新的页签（指定路由的视图）
      tagName = PageAction.openViewInner(para.actionPara, true);
      if (para.respTagName !== undefined && para.respTagName) {
        result['tagName'] = tagName;
      } else {
        result = undefined;
      }
      break;
    case 'openLink':
      // 打开新的页签（指定url）
      tagName = PageAction.openLinkInner(...para.actionPara, true);
      if (para.respTagName !== undefined && para.respTagName) {
        result['tagName'] = tagName;
      } else {
        result = undefined;
      }
      break;
    case 'openRefresh':
      // 在主页面刷新打开url
      PageAction.openRefresh(para.actionPara);
      result = undefined;
      break;
    case 'toTag':
      // 切换到指定页签
      tag = tagsViewFuns.getTagByName(para.actionPara);
      if (tag) {
        tagsViewFuns.toTag(tag);
      } else {
        result = { code: '21002', msg: 'Tag name not found: ' + para.actionPara };
      }
      break;
    case 'refreshTag':
      // 刷新指定页签
      tag = tagsViewFuns.getTagByName(para.actionPara);
      if (tag) {
        tagsViewFuns.refreshTag(tag);
      } else {
        result = { code: '21002', msg: 'Tag name not found: ' + para.actionPara };
      }
      break;
    case 'closeTag':
      // 关闭指定页签
      tag = tagsViewFuns.getTagByName(para.actionPara);
      if (tag) {
        tagsViewFuns.closeTag(tag);
      } else {
        result = { code: '21002', msg: 'Tag name not found: ' + para.actionPara };
      }
      if (!e.data.getResult) {
        // 不需要返回值
        result = undefined;
      }
      break;
    case 'setIframeSize':
      // 设置iframe页面的高度
      iframeId = para.actionPara.iframeId;
      if (iframeId === undefined || iframeId === '') {
        iframeId = e.source.frameElement.parentNode.id;
      }
      iframeDiv = document.getElementById(iframeId);
      el = iframeDiv.childNodes;
      if (el && el.length > 0) {
        if (para.actionPara.width) {
          el[0].width = para.actionPara.width + 'px';
        }
        if (para.actionPara.height) {
          // 判断高度是否超过屏幕高度
          computedStyle = getComputedStyle(document.documentElement);
          minHeight = document.body.clientHeight;
          if (store.state.app.showCopyright) {
            minHeight -= parseInt(computedStyle.getPropertyValue('--copyrightHeight'));
          }
          if (store.state.layoutSettings.tagsView) {
            minHeight -= parseInt(computedStyle.getPropertyValue('--tabsHeight'));
          }
          if (para.actionPara.height <= minHeight) {
            // 页面高度不够，使用默认的css设置即可
            el[0].height = '';
            iframeDiv.classList.remove('fit-content');
          } else {
            el[0].height = para.actionPara.height + 'px';
            iframeDiv.classList.add('fit-content');
          }
        }
      } else {
        result = { code: '21002', msg: 'Iframe element not found: ' + iframeId };
      }
      if (!e.data.getResult) {
        // 不需要返回值
        result = undefined;
      }
      break;
    case 'setIframeSizeType':
      // 设置iframe的大小控制类型
      iframeId = para.actionPara.iframeId;
      if (iframeId === undefined || iframeId === '') {
        iframeId = e.source.frameElement.parentNode.id;
      }
      iframeDiv = document.getElementById(iframeId);
      if (iframeDiv) {
        if (para.actionPara.sizeType === 'fit') {
          // iframe为适配容器大小的情况，使用默认的css样式, 并且将滚动条去掉
          el = iframeDiv.childNodes;
          el[0].height = '';
          el[0].scrolling = 'no';
          iframeDiv.classList.remove('fit-content');
        }
        // 监听信息
        if (para.actionPara.listenResize !== undefined && para.actionPara.listenResize) {
          store.commit('cachedIframe/ADD_LISTEN_CONTAINER_RESIZE', iframeId);
        }
        if (para.actionPara.listenScroll !== undefined && para.actionPara.listenScroll) {
          store.commit('cachedIframe/ADD_LISTEN_CONTAINER_SCROLL', iframeId);
        }
      } else {
        result = { code: '21002', msg: 'Iframe element not found: ' + iframeId };
      }
      if (!e.data.getResult) {
        // 不需要返回值
        result = undefined;
      }
      break;
    default:
      console.error('Ifarme parent page action type not found!', e.data);
      result = undefined; // undefined情况不返回
      break;
  }
  return result;
}

export default {
  /**
   * 初始化iframe框架父窗口
   * @param {function} eventFun - 可以指定自定义的函数处理消息
   * @param {JSON} messageEvents={} - 要加载的自定义事件处理函数清单，格式为：
   *   {
   *     eventName: eventFun,
   *     ...
   *   }
   *   注: eventName约定为父窗口为p开头，iframe窗口为f开头
   */
  initIframeParent,

  /**
   * 销毁iframe框架
   * @param {string} channelId - 渠道标识
   * @param {function} eventFun - 可以指定自定义的函数处理消息
   * @param {JSON} messageEvents={} - 要加载的自定义事件处理函数清单，格式为：
   *   {
   *     eventName: eventFun,
   *     ...
   *   }
   */
  destroyIframeParent,

  /**
   * 向iframe窗口发送消息
   * @param {string} name - 处理消息的事件名
   * @param {object} para - 要发送的消息数据(请求数据)
   * @param {string} iframeId - 要发送的iframe标识
   * @param {function} feedbackEvent - 处理返回值的函数，如果有传入则代表通过该函数处理返回值
   *   注：函数收到的入参为返回值JSON对象，{ id: '', code: '', msg: '', ... }
   * @param {int} overtime=3000 - 等待返回结果的超时时间, 0代表永不超时
   */
  sendMessage,

  /**
   * 向所有iframe客户端广播消息
   * 注：不处理返回信息
   * @param {string} name - 处理消息的事件名
   * @param {object} para - 要发送的消息数据(请求数据)
   */
  broadcastMessage,

  /**
   * 通知所有子页面变更主题颜色
   */
  broadcastChangeThemes,

  /**
   * 通知所有子页面变更组件大小
   */
  broadcastChangeSize,

  /**
   * 通知所有子页面变更语言
   */
  broadcastChangeLang,

  /**
   * 通知注册监听的iframe页面容器大小发生变化
   * @param {int} width - 宽度
   * @param {int} height - 高度
   */
  sendIframeContainerResize,

  /**
   * 通知当前iframe页面容器滚动位置发生变化（注册了监听的情况）
   * @param {int} scrollLeft - 滚动条横向位置
   * @param {int} scrollTop - 滚动条纵向位置
   */
  sendIframeContainerScroll

};
