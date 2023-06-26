# 接口调用支持（apiCall）

本项目通过axios调用后端接口，并进行了一定的封装来简化方法的调用。

## 接口调用的开发步骤

**1、配置后端接口信息**

在 ./src/api/config 目录下新增接口配置文件（例如 sys.js）或在已有的配置文件上添加接口信息，文件格式及配置参考如下：

```javascript
/**
 * 系统级别接口配置
 * 配置的每个属性为一个接口配置，属性名为调用该接口的服务名（在应用中唯一），发起接口调用时通过服务名关联到配置
 * 配置项说明如下：
 *   url: 访问ajax的url地址，该url地址将自动与请求参数的 baseURL 进行拼接形成真正的访问url
 *   isToken: 请求是否放入token信息(bool)，默认为true，如果为true将自动从缓存获取token并放入http报文头或标准报文的报文头中
 *   targetSysId: 请求目标系统标识(3位字符串)，与标准报文处理功能有关，用于生成接口流水号
 *   isStandardMessage: 是否标准报文(bool)，默认为true，如果为标准报文将自动按照标准报文规范处理报文头及流水号
 *     注：如果要调用非标准报文的ajax接口，请将该值设置为false
 *   autoDealResponse: 是否自动处理响应信息(bool)，默认为true，启动该项将会自动判断接口返回成功失败状态，并处理失败状态，减少调用代码的处理
 *   requestParam: 接口默认的请求参数{JSON对象}，可配置值参考axios的请求配置
 *     注：请求参数的覆盖优先级为: 调用函数请求参数 > 接口配置请求参数 > 全局默认请求参数(settings)
 */

export default {
  // 获取序列缓存
  'getSeqCache': {
    url: 'S01/SeqCache',
    targetSysId: 'S01',
    isStandardMessage: false,
    isToken: false
  },

  // 获取验证码图片
  'getCaptchaImage': {
    url: 'S01/captchaImage',
    targetSysId: 'S01',
    isStandardMessage: true,
    isToken: false
  }
};
```

**2、配置文件自动纳入接口管理**

接口模块 ./src/api/index.js 将自动将./src/api/config 目录下的接口配置文件加入到接口管理模块中。

**3、配置错误码提示信息转换**

如果为标准报文模式，以及开启了 autoDealResponse 参数，如果需要对具体错误码的提示信息进行映射，可以修改 ./src/api/ErrorCode.js 的配置，修改不同错误码实际展示的提示信息内容。该功能也可以结合i18n使用，配置的是对应的i18n标识即可。

```
export default {
  '3014': 'login status has expired',
  '3015': 'without permission to perform the current operation'
};
```

**4、在代码中调用接口服务**

接口调用可以使用 api 模块的 apiCall 函数，该函数只有3个参数：serviceName - 接口信息配置的服务名，data - 请求数据（axios的data）, requestParam - 本次调用请求参数（axios）。其中 data 和 requestParam 都是可选参数。

接口采用Promise的异步处理机制，如果接口配置了 autoDealResponse ，则只需要处理成功状态即可，失败或异常的情况将自动通过 Message 的方式在界面提示。但注意，如果要避免出现unhandledRejection的异常，还是要主动添加空操作的catch代码，参考代码如下：

```javascript
...
import apiCall from '@/api'; // 加载api模块
...
  // 调用获取验码图片的接口服务
  apiCall(
    'getCaptchaImage', {}
  ).then(resData => {
    // 成功获取到验证码图片的处理
    this.codeUrl = "data:image/gif;base64," + resData.body.img;
    this.loginForm.uuid = resData.body.uuid;
  }).catch(() => {});
```

如果调用需要传入特殊的axios参数，可通过 requestParam 参数执行，例如：

```javascript
  // 非标准报文模式向服务端请求序列号区间段，参数在url上传递: S01/SeqCache?sysId=S01&type=global&size=20
  apiCall(
    'getSeqCache', null, { params: { sysId: '000', type: 'global', size: 15 }}
  ).then(data => {
    // data => { start: 100, end: 115, sysId: '000', type: 'global' }
    // ...
  }).catch(() => {});;
```

如果需要自行响应信息，可将接口配置的 autoDealResponse 设置为 false，需同时处理成功和失败的情况，按以下方式处理：

```javascript
  apiCall(
    'getCaptchaImage', {}
  ).then(response => {
    // 成功请求（http的status code为2xx）
    // response 的格式参考 axios
  }).catch(error => {
    // 请求失败（网络异常或http错误）
    // error 的格式参考 axios
  });
```

## 接口默认请求参数配置

可以在 ./src/settings.js 中设置全局的接口请求参数，在调用时参数值未指定的情况下将使用该参数进行覆盖，具体可设置的内容见参数文件。

## 标准报文处理

本项目默认实现了一套标准报文规范，包括报文头自动生成、流水号生成、错误码判断等，如不使用这套规范，可自行按需要修改或弃用。这里只简单说明一些要点，详细的规范不在文档中说明，可自行查看代码。

**1、报文格式**

报文格式统一为 `{ head: { ... }, body { ... } }`，其中 head 定义了一些标准字段，请求报文和响应报文的采用同一套报文头；body 可放置实际的交互数据，根据实际需要也可以无 body。

**2、流水号**

标准报文的 head 有3个流水号，globSeqNum - 统一流水号、sysSeqNum - 系统流水号、infSeqNum - 接口流水号，这3个流水号有具体的生成规则，生成代码见 `./src/utils/sequence.js` 。

**3、错误码**

标准报文的响应错误码放置在 head 的 errCode 字段。错误码统一为5位数字字符串，其中第1位为错误状态，0 代表成功，其他数字代表失败，后4位为错误明细编码。例如 '00000' 代表成功，'13015' 代表无操作权限的失败。

**4、自动处理标准报文**

如果接口配置的 isStandardMessage 设置为 true，将自动按标准化处理报文头的内容（具体见 `./src/api/index.js` ），因此在实际接口调用时可以只送入 { body: {...} } 信息，但如果存在处理时不使用默认报文头配置的情况，也可自行送入不进行处理的报文头属性。

例如如果是接口失败重发，要求统一流水号和系统流水号不改变，则可在调用时自行送入这两个流水号。

报文头的默认参数配置见 ./src/settings.js 的 ajaxMessage 部分。

# Mock（模拟报文）

项目在api中实现了一个Mock模块，支持在没有后端接口的情况下，通过Mock模块模拟后端返回报文，来测试前端页面功能。具体设置方法如下：

**1、设置开启mock模式**

默认配置在开发环境将直接开启mock模式，如果需要修改mock模式的开启/关闭，在 ./src/settings.js 上设置 axios.useMock 参数，设置为 true/false 即可：

```javascript
module.exports = {
  ...
  // axios 相关配置
  axios: {
    ...
    // 是否采取Mock模式执行Ajax
    useMock: process.env.VUE_APP_BASE_API === 'mock'
  },
  ...
}
```

**2、指定编译使用的mock配置**

可以在./src/api/mock下，按目录设置多套mock配置，例如 ./src/api/mock/demo 或 ./src/api/mock/test，并在项目根目录下的.env、.env.prod等环境配置下指定编译时使用哪套mock配置：

```
...
# 指定mock模式的加载配置标识, 例如'demo', 'test', 将自动在 src/api/mock/目录下获取 'demo-xxx.js' 开头的配置文件并进行加载
MOCK_ID = 'demo'

...
```

**3、配置接口模拟响应报文**

在 ./src/api/mock/xxx 目录下新增接口响应报文配置文件（例如 sys.js）或在已有的配置文件上添加配置信息，配置xxx这套的模拟报文。一个url可以配置多个不同的响应报文，可以通过 matchRouter 设置不同响应报文的匹配条件（例如根据不同报文内容匹配不同响应报文），可以在响应报文通过公式设置响应值。

文件格式及配置参考如下：

```javascript
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

export default {
  // 获取序列号缓存
  'S01/SeqCache': {
    // 匹配路由，key为返回值设置，value为匹配表达式数组
    matchRouter: {
      networkError: [
        'reqUrl.query.sysId === "SSS"'
      ],
      statusCodeError: [
        'reqUrl.query.sysId === "000"',
        'reqUrl.query.type === "test"'
      ]
    },
    default: {
      // 指定需要通过表达式更新值的对象, 非返回值，返回时将被删除
      scriptPath: [
        'data.sysId', 'data.type', 'data.end'
      ],
      // 是否为标准报文
      isStandard: false,
      // 响应信息
      response: {
        data: {
          sysId: 'reqUrl.query.sysId',
          type: 'reqUrl.query.type',
          start: 100,
          end: 'Number(reqUrl.query.size) + 100'
        }
      }
    },
    // 获取失败的路由
    networkError: {
      // 是否失败
      success: false,
      // 直接失败描述
      errorMessage: 'Network error'
    },
    // http返回状态码错误
    statusCodeError: {
      // 是否失败
      success: false,
      // 是否为标准报文
      isStandard: false,
      // 响应信息
      response: {
        status: 404,
        statusText: 'Resource not found',
        data: {}
      }
    }
  },

  // 获取验证码图片
  'S01/captchaImage': {
    ...
  }
};
```

**4、mock配置文件自动纳入mock配置管理**

在 ./src/api/mock/xxx 目录下的模拟报文配置将自动加载到mock框架中直接使用，无需自行在代码中添加。
