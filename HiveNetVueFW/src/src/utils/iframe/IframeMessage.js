/**
 * iframe通讯框架基础库
 */
import { nanoid } from 'nanoid';

/**
 * 发送请求获取对应返回值的字典，格式为：
 * {
 *    id: { id: '', code: '', msg: '', ... },
 *    ...
 * }
 * 注：暂时未设置清理机制，待后续补充
 */
const messageFeedback = {};

/**
 * 自定义事件处理函数定义, 格式为:
 * {
 *   eventName: eventFun,
 *   ...
 * }
 * 注: eventName约定为父窗口为p开头，iframe窗口为f开头
 */
const messageEventRouter = {};

/**
 * 新增消息事件处理函数
 * @param {string} eventName - 事件名，通过e.data中的name获取对应的事件处理函数进行处理
 * @param {function} eventFun - 具体事件处理函数，传入参数为e
 */
export function addMessageEvent(eventName, eventFun) {
  messageEventRouter[eventName] = eventFun;
}

/**
 * 删除消息事件处理函数
 * @param {string} eventName - 事件名
 */
export function removeMessageEvent(eventName) {
  delete messageEventRouter[eventName];
}

/**
 * 添加通用的消息监听对象
 * @param {function} eventFun - 可以指定自定义的函数处理消息，不传入代表使用默认处理函数
 *   注：通过自定义函数，可以优先处理自己的业务消息，涮选后的通用消息再调用通用默认处理函数进行处理
 */
export function AddMessageListener(eventFun) {
  if (eventFun) {
    window.addEventListener('message', eventFun);
  } else {
    window.addEventListener('message', messageListenerEvent);
  }
}

/**
 * 移除通用的消息监听对象
 * @param {function} eventFun - 可以指定自定义的函数处理消息
 */
export function RemoveMessageListener(eventFun) {
  if (eventFun) {
    window.removeEventListener('message', eventFun);
  } else {
    window.removeEventListener('message', messageListenerEvent);
  }
}

/**
 * 通用的绑定消息处理事件
 * @param {object} e - postMessage传送所收到的事件对象
 */
export function messageListenerEvent(e) {
  if (!e.data.type) return;
  if (e.data.type === 'iframe-send') {
    // 收到请求的消息数据
    const eventFun = messageEventRouter[e.data.name];
    if (!eventFun) {
      // 没有找到正常的处理应用
      console.error('Ifarme message deal event not found!', e.data);
      return;
    }
    const result = eventFun(e);
    if (result) {
      // 有返回值, 发送回原窗口
      result['id'] = e.data.id;
      sendMessage(
        '', result, e.source, true
      );
    }
  } else if (e.data.type === 'iframe-back') {
    // 处理返回值
    if (messageFeedback[e.data.id] === '') {
      messageFeedback[e.data.id] = e.data;
    }
  }
}

/**
 * 向指定的框架窗口发送请求消息
 * @param {string} name - 处理消息的事件名
 * @param {object} para - 要发送的消息数据(请求数据)
 * @param {window} target - 要发送到的目标窗口对象
 * @param {bool} isFeedBack=false - 指定发送的消息是否返回值
 * @param {function} feedbackEvent - 处理返回值的函数，如果有传入则代表通过该函数处理返回值
 *   注：函数收到的入参为返回值JSON对象，{ id: '', code: '', msg: '', ... }
 * @param {int} overtime=3000 - 等待返回结果的超时时间, 0代表永不超时
 */
export function sendMessage(name, para, target, isFeedBack = false, feedbackEvent, overtime = 3000) {
  // 组成要发送的JSON字符串
  let message;
  if (isFeedBack) {
    // 返回信息
    message = Object.assign({ type: 'iframe-back' }, para);
  } else {
    // 是发送消息
    message = {
      type: 'iframe-send',
      id: nanoid(),
      name: name,
      para: para
    };
  }

  // 如果需要处理返回值的，通过异步监控返回值的处理
  if (feedbackEvent) {
    // 设置返回值为等待获取的状态
    messageFeedback[message.id] = '';
    const startTime = new Date().getTime();
    setTimeout(() => {
      monitorFeedBack(message.id, feedbackEvent, startTime, overtime);
    }, 10);
  }

  // 进行消息发送
  target.postMessage(message, '*');
}

/**
 * 循环监控返回值状态
 * @param {string} id - 请求的id
 * @param {function} feedbackEvent - 处理返回值的函数
 * @param {int} startTime - 开始时间
 * @param {int} overtime - 超时时间
 */
function monitorFeedBack(id, feedbackEvent, startTime, overtime) {
  // 检查是否已收到返回值
  if (messageFeedback[id] !== '') {
    // 执行返回值处理事件并删除返回值缓存
    try {
      feedbackEvent(messageFeedback[id]);
    } finally {
      delete messageFeedback[id];
    }
  } else {
    // 检查是否已超时
    const now = new Date().getTime();
    if (overtime > 0 && (now - startTime) > overtime) {
      // 返回超时错误
      delete messageFeedback[id];
      feedbackEvent({ id: id, code: '20403', msg: 'receive timed out' });
    } else {
      // 继续下一次监控
      setTimeout(() => {
        monitorFeedBack(id, feedbackEvent, startTime, overtime);
      }, 10);
    }
  }
}

// 默认装载的对象
export default {
  /**
   * 新增消息事件处理函数
   * @param {string} channelId - 渠道标识，通过该标识隔离不同的消息渠道
   * @param {string} eventName - 事件名，通过e.data中的name获取对应的事件处理函数进行处理
   * @param {function} eventFun - 具体事件处理函数，传入参数为e
   */
  addMessageEvent,

  /**
   * 删除消息事件处理函数
   * @param {string} channelId - 渠道标识
   * @param {string} eventName - 事件名
   */
  removeMessageEvent,

  /**
   * 添加通用的消息监听对象
   * @param {function} eventFun - 可以指定自定义的函数处理消息，不传入代表使用默认处理函数
   *   注：通过自定义函数，可以优先处理自己的业务消息，涮选后的通用消息再调用通用默认处理函数进行处理
   */
  AddMessageListener,

  /**
   * 移除通用的消息监听对象
   * @param {function} eventFun - 可以指定自定义的函数处理消息
   */
  RemoveMessageListener,

  /**
   * 通用的绑定消息处理事件
   * @param {object} e - postMessage传送所收到的事件对象
   */
  messageListenerEvent,

  /**
   * 向指定的框架窗口发送请求消息
   * @param {string} channelId - 渠道标识
   * @param {string} name - 处理消息的事件名
   * @param {object} para - 要发送的消息数据(请求数据)
   * @param {window} target - 要发送到的目标窗口对象
   * @param {bool} isFeedBack=false - 当前发送的是否返回值
   * @param {bool} hasFeedback=false - 是否要等待请求结果的返回
   * @param {int} overtime=3000 - 等待返回结果的超时时间
   * @returns {JSON} - 返回标准结果，格式为：
   *   {
   *     code: '00000', // 处理结果状态码，00000-成功，20403-等待返回结果超时, ...
   *     msg: '', // 处理结果的说明
   *     ...
   *   }
   */
  sendMessage
};
