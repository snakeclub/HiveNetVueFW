/**
 * 通用的请求处理模块，同步完成报文的标准化处理和Mock处理
 */
import axios from 'axios';
import settings from '@/settings';
import modal from '@/plugins/modal';
import { getStore } from '@/utils/base/global';
import mockRequest from '@/api/mock';

/**
 * 进行Ajax报文的token标准化处理
 * @param {JSON} config - 送入的request请求对象
 *   headers.isToken - 判断当前报文是否需要处理token
 */
function tokenStandard(config) {
  const store = getStore();
  const isToken = (config.headers || {}).isToken === false;
  const token = store.getters.token;
  if (token && !isToken) {
    // 处理http报文头的token
    if (config.isStandardMessage && settings.ajaxMessage.tokenInHead) {
      // 标准报文头需要传递token, 同时要传递用户id
      if (config.data.head.token === undefined) {
        config.data.head.token = token;
      }
      if (config.data.head.userId === undefined || config.data.head.userId === '') {
        config.data.head.userId = store.getters.userId;
      }
    } else {
      // 非标准模式，或无需放入报文头
      config.headers['Authorization'] = 'Bearer ' + token;
    }
  }
  return config;
}

/**
 * 进行Ajax的url参数标准化处理
 * @param {JSON} config - 送入的request请求对象
 */
function paramsStandard(config) {
  if ((config.method === undefined || config.method === 'get') && config.params) {
    let url = config.url + '?';
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName];
      var part = encodeURIComponent(propName) + '=';
      if (value !== null && typeof (value) !== 'undefined') {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            if (value[key] !== null && typeof (value[key]) !== 'undefined') {
              const params = propName + '[' + key + ']';
              const subPart = encodeURIComponent(params) + '=';
              url += subPart + encodeURIComponent(value[key]) + '&';
            }
          }
        } else {
          url += part + encodeURIComponent(value) + '&';
        }
      }
    }
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  return config;
}

/**
 * Ajax请求参数标准化处理
 * @param {*} config
 */
function requestStandard(config) {
  // 使用mock模式, 默认设置要加回去
  if (settings.axios.useMock) {
    const requestParam = JSON.parse(JSON.stringify(settings.axios.requestParam || {}));
    config = Object.assign(
      requestParam, config
    );

    const axiosHeaders = JSON.parse(JSON.stringify(settings.axios.headers || {}));
    config.headers = Object.assign(
      axiosHeaders, config.headers
    );
  }

  // 处理url参数
  config = paramsStandard(config);

  // 处理token
  config = tokenStandard(config);

  // 删除非ajax的辅助参数
  delete config.isStandardMessage;
  delete config.targetSysId;

  return config;
}

/**
 * 使用mock方式处理请求
 * @param {JSON} config - 送入的request请求对象
 * @returns {Promise} - Promise对象
 */
function mockService(config) {
  config = requestStandard(config);
  return mockRequest(config);
}

/**
 * 创建axios处理请求
 */
// 设置默认 header 的值
for (const key in settings.axios.headers) {
  axios.defaults.headers[key] = settings.axios.headers[key];
}

// 创建axios实例
const service = axios.create(settings.axios.requestParam);

// request拦截器，处理请求参数
service.interceptors.request.use(
  config => {
    return requestStandard(config);
  }, error => {
    // 请求遇到错误，提示错误
    console.debug(error);
    modal.messageError(error);
    Promise.reject(error);
  });

// 响应拦截器, 处理 ajax 响应信息
service.interceptors.response.use(
  res => {
    // 直接返回响应信息，报文判断由api组件处理
    return res;
  },
  error => {
    // 直接返回失败对象，展示信息由api组件统一处理
    return Promise.reject(error);
  }
);

export default function request(config) {
  if (settings.axios.useMock) {
    return mockService(config);
  } else {
    return service(config);
  }
}
