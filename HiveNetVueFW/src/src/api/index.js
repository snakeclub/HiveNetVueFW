/**
 * 通用的api接口请求处理
 */
import { ElMessageBox } from 'element-plus';
import settings from '@/settings';
import request from './request';
import modal from '@/plugins/modal';
import stringTools from '@/utils/base/StringTools';
import errorCode from './ErrorCode';
import getSeqNo from '@/utils/sequence';
import authActions from '@/utils/actions/auth';

/**
 * api接口配置字典
 * key为serviceName(服务名)，可由前端自行定义，调用接口时通过服务名找到配置
 * value为服务配置:
 *   url: 访问ajax的url地址，该url地址将自动与请求参数的 baseURL 进行拼接形成真正的访问url
 *   isToken: 请求是否放入token信息(bool)，默认为true，如果为true将自动从缓存获取token并放入http报文头或标准报文的报文头中
 *   targetSysId: 请求目标系统标识(3位字符串)，与标准报文处理功能有关，用于生成接口流水号
 *   isStandardMessage: 是否标准报文(bool)，默认为true，如果为标准报文将自动按照标准报文规范处理报文头及流水号
 *     注：如果要调用非标准报文的ajax接口，请将该值设置为false
 *   autoDealResponse: 是否自动处理响应信息(bool)，默认为true，启动该项将会自动判断接口返回成功失败状态，并处理失败状态，减少调用代码的处理
 *   requestParam: 接口默认的请求参数{JSON对象}，可配置值参考axios的请求配置
 *     注：请求参数的覆盖优先级为: 调用函数请求参数 > 接口配置请求参数 > 全局默认请求参数(settings)
 */
let apiConfig = {};
const apiConfigJsFiles = require.context('./config/', false, /([A-Z]|[a-z])\w+\.js$/);
apiConfigJsFiles.keys().forEach(fileName => {
  apiConfig = Object.assign(apiConfig, apiConfigJsFiles(fileName).default);
});

/**
 * 进行Ajax报文标准化处理
 * 注: 报文格式根据不同项目的实际情况可自行修改
 * @param {JSON} config - 送入的request请求对象
 *   targetSysId - 接口调用目标系统标识(3位), 用于生成接口流水号
 */
async function messageStandard(config) {
  // 通过报文标准化默认配置，处理报文头内容
  const ajaxMessageHead = JSON.parse(JSON.stringify(settings.ajaxMessage.head || {}));
  config.data.head = Object.assign(
    ajaxMessageHead, config.data.head || {}
  );

  // 请求方系统标识，格式为“3位系统标识+3位模块标识
  if (config.data.head.sysId === undefined) {
    config.data.head.sysId = settings.ajaxMessage.sysId + settings.ajaxMessage.moduleId;
  }
  // 交易发起源头系统标识，格式为“3位系统标识+3位模块标识
  if (config.data.head.originSysId === undefined) {
    config.data.head.originSysId = config.data.head.sysId;
  }
  // 统一流水号
  if (config.data.head.globSeqNum === undefined) {
    config.data.head.globSeqNum = await getSeqNo('global');
  }
  // 系统流水号
  if (config.data.head.sysSeqNum === undefined) {
    config.data.head.sysSeqNum = await getSeqNo('system');
  }
  // 接口流水号
  config.data.head.infSeqNum = await getSeqNo('interface', config.targetSysId || '000');

  return config;
}

/**
 * 通过Ajax请求api接口
 * @param {string} serviceName - 配置的服务名
 * @param {JSON} data - 请求数据对象，如果不传可以设置为null或undefined
 * @param {JSON} requestParam - axios请求参数，可传入当前调用有特殊要求的参数，如果不传可以设置为null或undefined
 *
 * @returns {Promise} - Promise对象
 */
export default async function apiCall(serviceName, data, requestParam) {
  if (serviceName === 'getUserInfo') {
    console.log('before data', data);
  }
  let requestConfig = {};
  // 数据传值
  if (data !== undefined && data !== null) { requestConfig.data = data; }

  // 根据apiConfig配置请求信息
  let serviceConfig = {};
  if (serviceName !== undefined && serviceName !== null) {
    serviceConfig = apiConfig[serviceName] || {};
    if (serviceConfig.url !== undefined) { requestConfig.url = serviceConfig.url; }
    if (serviceConfig.targetSysId !== undefined) {
      requestConfig.targetSysId = serviceConfig.targetSysId;
    }
    if (serviceConfig.isToken !== undefined) {
      requestConfig.headers = requestConfig.headers || {};
      requestConfig.headers.isToken = serviceConfig.isToken;
    } else {
      requestConfig.headers.isToken = true;
    }
    if (serviceConfig.isStandardMessage !== undefined) {
      requestConfig.isStandardMessage = serviceConfig.isStandardMessage;
    } else {
      requestConfig.isStandardMessage = true;
    }
    if (serviceConfig.requestParam !== undefined) {
      const requestParamConfig = JSON.parse(JSON.stringify(serviceConfig.requestParam));
      requestConfig = Object.assign(requestConfig, requestParamConfig);
    }
  }
  // 函数传入的请求参数为最优先
  if (requestConfig.url === 'S02/userInfo/query') {
    console.log('before assign', requestConfig);
  }
  requestConfig = Object.assign(requestConfig, requestParam || {});

  // 处理标准报文
  if (requestConfig.isStandardMessage && requestConfig.isStandardMessage) {
    // 是标准报文
    if (requestConfig.url === 'S02/userInfo/query') {
      console.log('before messageStandard', requestConfig);
    }
    requestConfig = await messageStandard(requestConfig);
    if (requestConfig.url === 'S02/userInfo/query') {
      console.log('messageStandard', requestConfig);
    }
  }

  // 根据不同配置情况处理返回值
  if (serviceConfig.autoDealResponse === undefined || serviceConfig.autoDealResponse) {
    let resData; // 成功情况的返回数据 response.data
    let errorInfo; // 失败情况, 延续axios的error格式
    try {
      // 将 request 按同步模式处理
      if (requestConfig.url === 'S02/userInfo/query') {
        console.log('request', requestConfig);
      }
      const response = await request(requestConfig);
      if (serviceConfig.isStandardMessage === undefined || serviceConfig.isStandardMessage) {
        // 标准报文，需通过报文中的报文头判断状态
        if (response.data.head.errCode[0] === '0') {
          // 处理成功
          resData = response.data;
        } else {
          // 处理失败
          errorInfo = response;
          // 处理错误消息
          const detailCode = stringTools.right(response.data.head.errCode, 4);
          const errMsg = errorCode[detailCode] || response.data.head.errMsg;
          errorInfo.message = response.data.head.errModule + '[' + response.data.head.errCode + ']: ' + this.$t(errMsg);

          // 通用的失败展示处理
          if (detailCode === '3014') {
            // 认证失败，需重新登录
            ElMessageBox.confirm(
              this.$t('Login status has expired, you can stay on this page or log in again'),
              this.$t('Alert'), {
                confirmButtonText: this.$t('To login page'),
                cancelButtonText: this.$t('Cancel'),
                type: 'warning'
              }
            ).then(() => {
              authActions.logout().then(() => {
                location.href = '/';
              });
            }).catch(() => {});
          } else {
            // 通用展示错误
            modal.messageError(errorInfo.message);
          }
        }
      } else {
        // 非标准报文，直接认为成功
        resData = response.data;
      }
    } catch (error) {
      // 对于reject情况，需要catch方式获取结果
      console.debug(JSON.stringify(error));
      errorInfo = error;
      // 通用处理提示
      console.debug('err: ' + error);
      let { message } = error;
      if (message !== undefined) {
        if (message === 'Network Error') {
          message = this.$t('Back end interface connection error');
        } else if (message.includes('timeout')) {
          message = this.$t('Back end interface request overtime');
        } else if (message.includes('Request failed with status code')) {
          message = this.$t('Back end interface error, failed with status code: ') + message.substr(message.length - 3);
        }
      } else {
        message = 'err: ' + JSON.stringify(error);
      }
      modal.messageError(message);
    }

    // Promise 模式
    return new Promise((resolve, reject) => {
      if (resData !== undefined) {
        resolve(resData); // 成功只返回data
      } else {
        reject(errorInfo); // 失败返回错误信息对象
      }
    });
  } else {
    // 由调用者自行处理返回值，返回Promise对象
    return request(requestConfig);
  }
}
