/**
 * 模拟ajax返回数据
 */
const url = require('url');

/**
 * mock配置字典
 * key为接口url(pathname), value为该接口的mock配置，配置对应的字典说明如下:
 *   matchRouter : 匹配路由, key为路由标识(对应的路由实际配置在字典根目录下, 与default同一个层级)
 *     value为匹配表达式数组，数组中每一项为一个返回true/false的表达式，当所有表达式为true则代表匹配上该路由
 *     注：表达式实际上就是一个js代码，支持直接访问config, reqUrl 对象
 *   default : 默认配置，当所有路由都匹配不上时，使用该配置
 *     scriptPath : 值为一个数组，支持指定返回对象应用表达式脚本的访问路径，路径从response开始（不用包含该路径），例如: data.sysId
 *       在对应的返回值设置中，对应路径的值应该为一个js表达式，计算可得到设置值
 *     varDatas : 值为一个JSON对象，支持添加变量用于js表达式使用
 *       注意: 该变量仅能用于response的表达式处理, 不能用于matchRouter的表达式, 表达式的访问变量名为varDatas
 *     success : 是否成功, 默认为true
 *     errorMessage: 失败时直接返回的错误，如果有设置该值，则不再考虑response值
 *     isStandard : 是否为标准报文, 默认为true
 *     response: 响应报文对象, 格式与axios响应的对象格式保持一致(如果不设置会自动添加默认值)
 *       axios的主要标准响应内容包括:
 *         data -  由服务器提供的响应内容数据, 默认为{}
 *         status - 来自服务器响应的 HTTP 状态码, 默认为200
 *         statusText - 来自服务器响应的 HTTP 状态信息, 默认为'OK'
 *         headers - 服务器响应的头, 默认为{}
 *         config - 是为请求提供的配置信息, 默认为报文的请求对象config,
 *         request -  请求对象, 默认为{}
 *       如果响应对象的key设置为scriptPath中指定的表达式配置, 代表该key的实际值为value字符串表达式的执行值, 表达式中可以直接使用config, reqUrl, varDatas对象
 *         config - 直接是请求对象, 为axios的标准请求配置
 *           baseURL - 公共部分URL(API的URL路径), 例如'mock'
 *           timeout - 超时时间, 单位为毫秒
 *           maxContentLength - 允许的响应内容的最大尺寸
 *           responseType - 服务器响应的数据类型
 *           responseEncoding - 响应数据编码
 *           data - 请求数据内容, 如果是标准报文, 会有header和body信息
 *           url - 访问的url(不包含baseURL部分)
 *           headers - http协议的报文头
 *         reqUrl - 解析请求url得到的Url对象
 *           protocol - url协议, 例如'https'
 *           hostname - 域名, 例如'example.com',
 *           pathname - url的访问路径, 例如'/some/path',
 *           query - url的query对象, 解析url中的参数, 例如 http://xxx.html?page=1&format=json 解析后得到
 *             {
 *               page: 1,
 *               format: 'json'
 *             }
 *         varDatas - 配置中的变量, 直接使用即可
 */
let mockConfig = {};
const mockConfigJsFiles = require.context('@mockIdPath/', false, /([A-Z]|[a-z])\w+\.js$/);
mockConfigJsFiles.keys().forEach(fileName => {
  mockConfig = Object.assign(mockConfig, mockConfigJsFiles(fileName).default);
});

/**
 * 通过请求对象获取mock配置的响应信息
 * @param {JSON} config - 请求对象
 * @returns {JSON} - 响应信息，格式如下
 *   {
 *     success: true, // 是否成功
 *     isStandard: true, // 是否为标准报文
 *     response: {...},  // 响应信息, 成功时使用, 与axios成功的内容格式一致
 *     error: {...}  // 响应信息，失败时使用, 与axios失败时的内容格式一致
 *   }
 */
function getMockResponse(config) {
  // 通过 mockConfig 匹配响应信息
  console.debug(config);
  const reqUrl = url.parse(config.url, true);
  const pathName = reqUrl.pathname;
  const serviceMockConfig = mockConfig[pathName];
  if (serviceMockConfig === undefined) {
    // 配置不存在
    return {
      success: false, error: {
        message: 'Mock config not exists: ' + pathName,
        config: config
      }
    };
  }

  // 根据路由参数匹配可用的配置
  const matchRouter = serviceMockConfig.matchRouter;
  let matched = 'default';
  if (matchRouter !== undefined) {
    // 逐个路由进行匹配
    for (const key in matchRouter) {
      let isMatch = true;
      for (let i = 0; i < matchRouter[key].length; i++) {
        if (!eval(matchRouter[key][i])) {
          // 匹配失败
          isMatch = false;
          break;
        }
      }
      if (isMatch) {
        // 匹配上
        matched = key;
        break;
      }
    }
  }

  // 处理反馈内容
  const responseConfig = serviceMockConfig[matched];
  if (responseConfig === undefined) {
    // 配置不存在
    return {
      success: false, error: {
        message: 'Mock match router not exists: ' + pathName + ' : ' + matched,
        config: config
      }
    };
  }

  const res = {
    success: responseConfig.success === undefined ? true : responseConfig.success,
    isStandard: responseConfig.isStandard === undefined ? true : responseConfig.isStandard
  };

  if (!res.success && responseConfig.errorMessage) {
    // 失败且直接指定失败描述
    res.error = {
      message: responseConfig.errorMessage,
      config: config
    };
    return res;
  }

  // 通过序列化进行深层拷贝，处理response对象
  const varDatas = responseConfig.varDatas || {}; // 用于表达式中使用的配置变量
  const response = JSON.parse(JSON.stringify(responseConfig.response));
  const scriptPath = responseConfig.scriptPath || [];
  for (let i = 0; i < scriptPath.length; i++) {
    const script = eval('response.' + scriptPath[i]);
    if (script !== undefined) {
      const evalScript = 'response.' + scriptPath[i] + ' = eval(script)';
      try {
        eval(evalScript);
      } catch (error) {
        console.error('run script error: ', evalScript, script);
        throw error;
      }
    }
  }
  // 删除配置
  delete response.scriptPath;

  // 根据成功失败区别处理
  if (res.success) {
    res.response = response;
  } else {
    // 请求已发出，但服务器响应的状态码不在 2xx 范围内
    res.error = {
      response: response,
      config: config
    };
  }
  return res;
}

/**
 * Ajax请求Mock响应信息
 * @param {JSON} config - 请求配置
 *   baseURL - 公共部分URL(API的URL路径), 例如'mock'
 *   timeout - 超时时间, 单位为毫秒
 *   maxContentLength - 允许的响应内容的最大尺寸
 *   responseType - 服务器响应的数据类型
 *   responseEncoding - 响应数据编码
 *   data - 请求数据内容, 如果是标准报文, 会有header和body信息
 *   url - 访问的url(不包含baseURL部分)
 *   headers - http协议的报文头
 * @returns {Promise} - Promise模式返回处理
 */
function request(config) {
  return new Promise(function(resolve, reject) {
    // 打印请求信息
    console.debug('mock request: ' + JSON.stringify(config, null, 2));

    // 获取请求结果, success, isStandard 和 response
    const res = getMockResponse(config);
    if (res.success) {
      // 成功的情况，处理返回的标准报文头
      if (res.isStandard) {
        // 防止没有head的情况
        res.response.data = res.response.data || {};
        res.response.data.head = res.response.data.head || {};
        res.response.data.head = Object.assign(
          {
            prdCode: config.data.head.prdCode,
            tranCode: config.data.head.tranCode,
            originSysId: config.data.head.originSysId,
            sysId: config.data.head.sysId,
            infType: '02',
            userId: config.data.head.userId,
            globSeqNum: config.data.head.globSeqNum,
            sysSeqNum: config.data.head.sysSeqNum,
            infSeqNum: config.data.head.infSeqNum,
            errCode: '00000',
            errMsg: '处理成功'
          },
          res.response.data.head
        );
      }
      // 标准化完整响应内容(匹配axios)
      res.response = Object.assign(
        {
          // `data` 由服务器提供的响应
          data: {},
          // `status` 来自服务器响应的 HTTP 状态码
          status: 200,
          // `statusText` 来自服务器响应的 HTTP 状态信息
          statusText: 'OK',
          // `headers` 服务器响应的头
          headers: {},
          // `config` 是为请求提供的配置信息
          config: config,
          // 'request'
          // `request` is the request that generated this response
          // It is the last ClientRequest instance in node.js (in redirects)
          // and an XMLHttpRequest instance the browser
          request: {}
        },
        res.response
      );

      // 正式返回成功
      console.debug('mock response success: ' + JSON.stringify(res.response, null, 2));
      resolve(res.response);
    } else {
      // 失败
      console.debug('mock response error: ' + JSON.stringify(res.error, null, 2));
      reject(res.error);
    }
  });
}

export default request;
