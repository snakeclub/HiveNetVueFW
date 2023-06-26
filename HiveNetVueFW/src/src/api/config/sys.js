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
  /**
   * 获取序列缓存
   * request url params {
   *   sysId: '', // 必填 char 3位序列所属系统标识
   *   type: '', // 必填 char 序列类型,根据实际需要前后端协商配置
   *   size: 15, // 必填 int 获取序列长度
   * }
   * response: {
   *   sysId: '', // 必填 char 3位序列所属系统标识,原报文返回
   *   type: '', // 必填 char 序列类型,原报文返回
   *   start: 100, // 必填 int 序列开始值
   *   end: 115, // 必填 int 序列结束值
   * }
   */
  'getSeqCache': {
    url: 'S01/SeqCache',
    targetSysId: 'S01',
    isStandardMessage: false,
    isToken: false
  },

  /**
   * 获取验证码图片
   * request: {}
   * response: {
   *   body: {
   *     captchaOnOff: 'y', // 必填 char(1) 验证码开启关闭开关(y/n)
   *     img: '', // 可选 char 验证码图片base64编码
   *     uuid: '' // 可选 char 验证码图片uuid
   *   }
   * }
   */
  'getCaptchaImage': {
    url: 'S01/captchaImage',
    targetSysId: 'S01',
    isStandardMessage: true,
    isToken: false
  },

  /**
   * 获取用户验证需要的服务器参数
   * request: {
   *   body: {
   *     username: '', // 要登录的用户名
   *     publicKey: 'y', // 是否返回公钥, y-是, n-否
   *     randomStr: 'y', // 是否返回登录随机数, y-是, n-否
   *     salt: 'y', // 是否返回用户名对应的密码加密盐, y-是, n-否
   *   }
   * }
   * response: {
   *   body: {
   *     publicKey: '', // RSA加密的公钥
   *     randomStr: '', // 登录随机数
   *     salt: '' // 用户名对应的密码加密盐
   *   }
   * }
   */
  'getAuthServerPara': {
    url: 'S01/authServerPara',
    targetSysId: 'S01',
    isStandardMessage: true,
    isToken: false
  },

  /**
   * 获取菜单配置
   * request: {}
   * response: {
   *   body: {
   *       sidebarMenus: [ // 左侧主菜单清单
   *         {
   *           name: '', // 必填 char 菜单英文标识，该标识在所有菜单中应唯一
   *           path: '', // 必填 char 菜单访问路径, 该标识在同级兄弟菜单中应唯一
   *           showName: '', // 必填 char 菜单显示名,支持i18n
   *           icon: '', // 选填 char 菜单图标标识名, 如填入则代表菜单文本前显示菜单图标
   *           component: '', // 选填 char Vue组件名, 如填入则代表菜单文本前显示组件内容
   *           componentProps: {}, // 选填 JSON 调用Vue组件的props参数
   *           hidden: false, // 选填 bool 是否隐藏菜单, 默认为fasle
   *           disabled: false, // 选填 bool 是否禁用菜单，默认为false
   *           menuType: '', // 必填 char 菜单类型: main-主菜单(不设置点击操作), view-内部页面(./src/views中的页面), link-链接url(含外部url), jsCode-要执行的js代码, embed-已嵌入的动作代码, fixedTag-切换至固定页签
   *           successTip: '', // 选填 char 菜单执行成功提示内容，支持i18n，如果不设置代表不进行提示
   *           order: 1, // 选填 int 同级菜单排序, 数字小的排前面
   *           cacheType: '' // 选填 char 缓存类型, none-不缓存（默认），仅 openType 为 inner时有效，single-单页缓存（使用keepalive，同一个页面不支持打开多个），mutiple-多页缓存
   *           children: [], // 选填 array 子菜单配置, 定义方式相同，支持多层子菜单嵌套
   *           // view 相关配置
   *           viewComponentName: '', // view必填 char 内部页面控件名（./src/views目录下的全局注册控件, 驼峰格式，不含.vue后缀, 由开发人员确认）
   *           viewProps: {}, // 选填 JSON 向view组件传的参数（由开发人员确认）
   *           viewQuery: {}, // 选填 JSON 调用vue路由时传入的参数，为?xx=xxxx形式的参数
   *           isLayoutTag: false, // 选填 bool 指定是否框架页签(需加载菜单信息)，当openType为inner时该参数无效（固定为true）
   *           // link 相关配置
   *           url: '', // link必填 char 要打开的url路径
   *           // view link 共同配置
   *           openType: '', // 选填 char 打开方式, inner-在标签页打开(默认), blank-新窗口打开, refresh-用新页面刷新当前页面
   *           blankSpecs: '', // 选填 char 当打开方式为blank时，window.open的打开参数（控制新窗口样式）
   *           blankExtendScreen: 0, // 选填 int 预留参数，当打开方式为blank时, 窗口所需放置在的扩展屏，0代表在主屏幕，1代表在第一个扩展屏
   *           // jsCode 相关配置
   *           code: '', // jsCode必填 char 要执行的js代码，采用 new Function 模式，函数无入参
   *           // embed 相关配置
   *           embedAction: '', // embed必填 char 调用集成的动作
   *           embedPara: {}, // 选填 JSON 调用集成动作的参数（由开发人员定义）
   *           // fixedTag 相关配置
   *           fixedTagName: '', // fixedTag必填 char 要打开的固定页签的页签名
   *         },
   *         ...
   *       ],
   *       rightMenus: [ // 右上角菜单清单，注：暂时下来菜单暂时只支持一级配置
   *         {
   *           name: '', // 必填 char 菜单英文标识，该标识在所有菜单中应唯一
   *           path: '', // 必填 char 菜单访问路径, 该标识在同级兄弟菜单中应唯一
   *           showType: '', // 必填 char 菜单显示类型, icon-图标, component-Vue组件, link-链接(可含图标)
   *           showName: '', // 选填 char 菜单显示名,支持i18n
   *           icon: '', // 选填 char 菜单图标标识名, showType为icon时必填
   *           component: '', // 选填 char Vue组件名，showType为component时必填，为./src/components/view/layout/components/RightMenu/RightMenuShowItem.vue中已加载的组件应用名(小写横杠模式)
   *           componentProps: {}, // 选填 JSON 调用Vue组件的props参数
   *           toolTip: '', // 选填 char 鼠标悬停提示内容
   *           css: '', // 选填 char 自定义css样式, 映射到style属性上
   *           hidden: false, // 选填 bool 是否隐藏菜单, 默认为fasle
   *           disabled: false, // 选填 bool 是否禁用菜单，默认为false
   *           menuType: '', // 必填 char 菜单类型: main-主菜单(下拉列表), view-内部页面(./src/views中的页面), link-链接url(含外部url), jsCode-要执行的js代码, embed-已潜入的动作代码, fixedTag-切换至固定页签, null-不设置点击（非主菜单的情况）
   *           successTip: '', // 选填 char 菜单执行成功提示内容，支持i18n，如果不设置代表不进行提示
   *           order: 1, // 选填 int 同级菜单排序, 数字小的排前面
   *           cacheType: '' // 选填 char 缓存类型, none-不缓存（默认），仅 openType 为 inner时有效，single-单页缓存（使用keepalive，同一个页面不支持打开多个），mutiple-多页缓存
   *           children: [], // 选填 array 子菜单配置, 定义方式相同，支持多层子菜单嵌套
   *           // 下拉菜单的弹出配置
   *           dropDownTrigger: 'hover', // 选填 char 下拉菜单的弹出方式，hover-鼠标移动到上面，click-点击鼠标，contextmenu-右键菜单，默认为hover
   *           // view 相关配置
   *           viewComponentName: '', // view必填 char 内部页面控件名（./src/views目录下的全局注册控件, 驼峰格式，不含.vue后缀, 由开发人员确认）
   *           viewProps: {}, // 选填 JSON 向view组件传的参数（由开发人员确认）
   *           viewQuery: {}, // 选填 JSON 调用vue路由时传入的参数，为?xx=xxxx形式的参数
   *           isLayoutTag: false, // 选填 bool 指定是否框架页签(需加载菜单信息)，当openType为inner时该参数无效（固定为true）
   *           // link 相关配置
   *           url: '', // link必填 char 要打开的url路径
   *           // view link 共同配置
   *           openType: '', // 选填 char 打开方式, inner-在标签页打开(默认), blank-新窗口打开, refresh-用新页面刷新当前页面
   *           blankSpecs: '', // 选填 char 当打开方式为blank时，window.open的打开参数（控制新窗口样式）
   *           blankExtendScreen: 0, // 选填 int 预留参数，当打开方式为blank时, 窗口所需放置在的扩展屏，0代表在主屏幕，1代表在第一个扩展屏
   *           // jsCode 相关配置
   *           code: '', // jsCode必填 char 要执行的js代码，采用 new Function 模式，函数无入参
   *           // embed 相关配置
   *           embedAction: '', // embed必填 char 调用集成的动作
   *           embedPara: {}, // 选填 JSON 调用集成动作的参数（由开发人员定义）
   *           // fixedTag 相关配置
   *           fixedTagName: '', // fixedTag必填 char 要打开的固定页签的页签名
   *         },
   *         ...
   *       ]
   *     },
   *     fixedTags: [ // 固定页签清单，要求至少要有一个固定页签
   *       {
   *         name: '', // 必填 char 标签英文标识，该标识在所有标签中应唯一
   *         showName: '', // 必填 char 标签显示名,支持i18n
   *         icon: '', // 选填 char 标签图标标识名
   *         order: 1, // 选填 int 页签排序, 数字小的排前面
   *         tagType: '' // 必填 char 标签类型，view-内部页面(./src/views中的页面), link-链接url(含外部url)
   *         cacheType: '' // 选填 char 缓存类型, none-不缓存（默认），single-单页缓存（使用keepalive，同一个页面不支持打开多个），mutiple-多页缓存
   *         // view 相关配置
   *         routerPath: '', // view必填 char vue路由的访问路径，以 '/' 开头
   *         viewComponentName: '', // view必填 char 内部页面控件名（./src/views目录下的全局注册控件, 驼峰格式，不含.vue后缀, 由开发人员确认）
   *         viewProps: {}, // 选填 JSON 向view组件传的参数（由开发人员确认）
   *         viewQuery: {}, // 选填 JSON 调用vue路由时传入的参数，为?xx=xxxx形式的参数
   *         // link 相关配置
   *         url: '', // link必填 char 要打开的url路径
   *       },
   *       ...
   *     ]
   *   }
   * }
   */
  'getMenusConfig': {
    url: 'S01/menusConfig',
    targetSysId: 'S01',
    isStandardMessage: true,
    isToken: false
  }
};
