import { ElMessage, ElMessageBox, ElNotification, ElLoading } from 'element-plus';
import settings from '@/settings';
import i18n from '@/i18n';
import store from '@/store';
import { sendMessage } from '@/utils/iframe/IframeChild'; // 通过IframeChild直接支持子页面调用主页面的消息

// 当前打开的遮罩对象
let loadingInstance;

/**
 * 通用的消息显示函数（在上方弹出提示）
 *
 * @param {string|JSON} args - 送入要显示的消息文本，或element-plus的ElMessage的参数对象
 */
function showMessage(args) {
  let tempArgs;
  if (typeof args === 'string') {
    tempArgs = { message: args };
  } else {
    tempArgs = args;
  }
  const type = tempArgs.type === undefined ? 'info' : tempArgs.type;
  const defaultParam = JSON.parse(JSON.stringify(settings.messageTips[type] || {}));
  const showParam = Object.assign({}, defaultParam, tempArgs);
  if (!store.state.iframePageInfo.useSelfModal && store.state.iframePageInfo.isIframe) {
    // 通过主框架处理消息
    sendMessage('pShowModal', { modalType: 'showMessage', modalPara: showParam });
  } else {
    // 当前页面自己的消息框
    return ElMessage(showParam);
  }
}

/**
 * 显示告警框消息
 * @param {string} content - 告警消息内容
 * @param {string} title - 告警消息标题，如果不传自动设置为 $t('Alert')
 * @param {JSON} args - 告警消息框参数，为element-plus的ElMessageBox的参数
 */
function showAlert(content, title, args) {
  if (title === undefined) {
    title = i18n.global.t('Alert');
  }
  args = args || {};
  if (!store.state.iframePageInfo.useSelfModal && store.state.iframePageInfo.isIframe) {
    // 通过主框架处理消息
    sendMessage('pShowModal', { modalType: 'showAlert', modalPara: [content, title, args] });
  } else {
    ElMessageBox.alert(content, title, args);
  }
}

/**
 * 通用的右边通知消息显示函数
 * @param {string|JSON} args - 通知内容，或送入element-plus的ElNotification的参数对象
 */
function showNotification(args) {
  let tempArgs;
  if (typeof args === 'string') {
    tempArgs = { message: args };
  } else {
    tempArgs = args;
  }
  const type = tempArgs.type === undefined ? 'info' : tempArgs.type;
  const defaultParam = JSON.parse(JSON.stringify(settings.notificationTips[type] || {}));
  const showParam = Object.assign({}, defaultParam, tempArgs);
  if (!store.state.iframePageInfo.useSelfModal && store.state.iframePageInfo.isIframe) {
    // 通过主框架处理消息
    sendMessage('pShowModal', { modalType: 'showNotification', modalPara: showParam });
  } else {
    return ElNotification(showParam);
  }
}

/**
 * 显示消息窗口
 * @param {JSON} options - 消息窗口参数，具体参数间element-plus的ElMessageBox参数
 *   注1: 标准用法是传入callback函数，以支持iframe模式的调用
 *   注2: callback函数只能返回action参数，实例参数不返回，因此复杂的使用方法请勿通过该模式处理
 * @returns {any} - 如果是本地调用，并且没有传入callback参数，返回为Promis对象
 */
function showMessageBox(options) {
  if (!store.state.iframePageInfo.useSelfModal && store.state.iframePageInfo.isIframe) {
    // 通过主框架处理消息
    const callback = options.callback;
    if (callback) {
      delete options.callback; // 传给主界面的参数不带callback参数
    }
    const feedbackEvent = callback ? function(res) {
      if (res.code !== '00000') {
        showMessage({
          message: 'Get layout message box response error: ' + JSON.stringify(res),
          type: 'error'
        });
      } else {
        // 执行回调函数
        callback(res.action, undefined);
      }
    } : undefined;

    // 向主窗口发送显示的请求，超时时间设置为永不超时
    sendMessage(
      'pShowModal', { modalType: 'showMessageBox', modalPara: options }, undefined,
      feedbackEvent, 0
    );
  } else {
    return ElMessageBox(options);
  }
}

export default {
  // 提示类消息展示

  /**
   * 通用的消息显示函数
   *
   * @param {string|JSON} args - 送入要显示的消息文本，或element-plus的ElMessage的参数对象
   * @example
   *   modal.message('info message'); // 不带其他参数的形式
   *   modal.message({message: 'message', type: 'info', ... }); // 带其他参数的形式
   */
  message: showMessage,

  /**
   * 错误消息
   * @param {string} content - 提示内容
   */
  messageError(content) {
    showMessage({ message: content, type: 'error' });
  },

  /**
   * 成功消息
   * @param {string} content - 提示内容
   */
  messageSuccess(content) {
    showMessage({ message: content, type: 'success' });
  },

  /**
   * 警告消息
   * @param {string} content - 提示内容
   */
  messageWarning(content) {
    showMessage({ message: content, type: 'warning' });
  },

  // 告警框消息
  /**
   * 显示告警框消息
   * @param {string} content - 告警消息内容
   * @param {string} title - 告警消息标题，如果不传自动设置为 $t('Alert')
   * @param {JSON} args - 告警消息框参数，为element-plus的ElMessageBox的参数
   */
  alert: showAlert,

  /**
   * 错误提示
   * @param {string} content - 提示内容
   */
  alertError(content, title, args) {
    const tempArgs = Object.assign(args || {}, { type: 'error' });
    showAlert(content, title, tempArgs);
  },

  /**
   * 成功提示
   * @param {string} content - 提示内容
   */
  alertSuccess(content, title, args) {
    const tempArgs = Object.assign(args || {}, { type: 'success' });
    showAlert(content, title, tempArgs);
  },

  /**
   * 警告提示
   * @param {string} content - 提示内容
   */
  alertWarning(content, title, args) {
    const tempArgs = Object.assign(args || {}, { type: 'warning' });
    showAlert(content, title, tempArgs);
  },

  // 通知类消息（右边冒泡）
  /**
   * 通知提示
   * @param {string|JSON} args - 通知内容，或送入element-plus的ElNotification的参数对象
   *
   * @example
   *   modal.notify('notify message');
   *   modal.notify({ message: 'message', title: 'title', type: 'info', ...});
   */
  notify: showNotification,

  /**
   * 错误通知
   * @param {string} content - 提示内容
   */
  notifyError(content) {
    showNotification({ message: content, type: 'error' });
  },

  /**
   * 成功通知
   * @param {string} content - 提示内容
   */
  notifySuccess(content) {
    showNotification({ message: content, type: 'success' });
  },

  /**
   * 警告通知
   * @param {string} content - 提示内容
   */
  notifyWarning(content) {
    showNotification({ message: content, type: 'warning' });
  },

  /**
   * 显示消息窗口
   * @param {JSON} options - 消息窗口参数，具体参数间element-plus的ElMessageBox参数
   *   注1: 标准用法是传入callback函数，以支持iframe模式的调用
   *   注2: callback函数只能返回action参数，实例参数不返回，因此复杂的使用方法请勿通过该模式处理
   * @returns {any} - 如果是本地调用，并且没有传入callback参数，返回为Promis对象
   */
  messageBox: showMessageBox,

  // 确认提示窗体
  /**
   * 显示确认窗口
   * @param {string} content - 确认内容
   * @param {string} title - 确认消息标题，如果不传自动设置为 $t('Alert')
   * @param {funciton} callback - 结果回调函数, function(action, instance)，action 的值为'confirm', 'cancel'或'close', instance 参数不应使用
   * @param {JSON} args - 告警消息框参数，为element-plus的ElMessageBox的参数
   */
  confirm(content, title, callback, args) {
    if (title === undefined) {
      title = i18n.global.t('Alert');
    }
    args = args || {};
    const tempArgs = Object.assign({
      title: title,
      message: content,
      confirmButtonText: i18n.global.t('OK'),
      cancelButtonText: i18n.global.t('Cancel'),
      showCancelButton: true,
      type: 'warning',
      callback: callback
    }, args);
    return showMessageBox(tempArgs);
  },

  /**
   * 打开遮罩层
   * @param {string} content - 遮罩上的提示文件
   */
  loading(content) {
    if (!store.state.iframePageInfo.useSelfModal && store.state.iframePageInfo.isIframe) {
      sendMessage('pShowModal', { modalType: 'loading', modalPara: content });
    } else {
      const param = Object.assign({ lock: true, text: content },
        JSON.parse(JSON.stringify(settings.loading.fullScreenLoading || {}))
      );
      loadingInstance = ElLoading.service(param);
    }
  },

  /**
   * 打开完全透明的遮罩
   */
  transparentLoading() {
    if (!store.state.iframePageInfo.useSelfModal && store.state.iframePageInfo.isIframe) {
      sendMessage('pShowModal', { modalType: 'loading' });
    } else {
      loadingInstance = ElLoading.service({
        spinner: 'not-exists',
        background: 'transparent',
        lock: true
      });
    }
  },

  /**
   * 关闭遮罩层
   */
  closeLoading() {
    if (!store.state.iframePageInfo.useSelfModal && store.state.iframePageInfo.isIframe) {
      sendMessage('pShowModal', { modalType: 'closeLoading' });
    } else {
      loadingInstance.close();
    }
  }
};
