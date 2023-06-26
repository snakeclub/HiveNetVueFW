/**
 * 用户认证接口配置
 */

export default {
  /**
   * 用户登录验证接口
   * request: {
   *   body: {
   *     loginSysId: '', // 必填 char(3) 登录系统id
   *     username: '', // 必填 char 登录用户名
   *     validateHash: '', // 必填 char 登录验证hash值
   *     captcha: '', // 可选 char 输入验证码
   *     captchaUuid: '', // 可选 char 验证码图片uuid
   *   }
   * }
   * response: {
   *   body: {
   *     userId: 'admin', // 必填 char 用户id
   *     name: '管理员', // 必填 char 用户姓名
   *     token: 'token:xxxxxxxxx', // 必填 char 登录令牌
   *     tokenExpires: 0, // 可选 int token有效期(分钟), 不返回代表浏览器关闭就失效, 0代表永久有效
   *   }
   * }
   */
  'userLogin': {
    url: 'S02/user/login',
    targetSysId: 'S02',
    isStandardMessage: true,
    isToken: false
  },

  /**
   * 用户登出
   * request: {
   *   head: {
   *     userId: '', // 必填 char 要登出的用户id
   *   }
   * }
   * response: {}
   */
  'userLogout': {
    url: 'S02/user/logout',
    targetSysId: 'S02',
    isStandardMessage: true,
    isToken: true
  },

  /**
   * 用户修改密码
   * request: {
   *   head: {
   *     userId: '', // 必填 char 要修改的用户id
   *   },
   *   body: {
   *     validateHash: '', // 必填 char 旧密码验证hash值
   *     newPwdHash: '', // 必填 char 通过rsa加密的新登录密码
   *   }
   * }
   * response: {}
   */
  'userChangePwd': {
    url: 'S02/user/changePwd',
    targetSysId: 'S02',
    isStandardMessage: true,
    isToken: true
  },

  /**
   * 获取用户信息
   * request: {
   *   head: {
   *     userId: '', // 必填 char 要获取的用户id, 如果送''代表获取anonymous匿名用户的信息
   *   },
   *   body: {
   *     sysid: '', // 选填 char 要获取的菜单、固定页签信息所属的系统标识，不传则代表获取默认的系统标识
   *     withBaseInfo: 'y', // 选填 char(1) 是否包含用户基础信息(y/n), 默认y
   *     withRights: 'y', //选填 char(1) 是否包含用户权限信息(y/n), 默认y
   *     withMenus: 'y', //选填 char(1) 是否包含用户菜单信息(y/n), 默认y
   *   }
   * }
   * response: {
   *   body: {
   *     cacheId: '', // 信息缓存ID，如果服务端信息发生了变更，将在下一次Ajax交互带上变更标志
   *     sysInfo: { // 返回的系统基础信息，根据请求需要返回
   *       sysId: 'portal', // 必填 char 返回的当前系统标识，仅在mutipleAppSupport使用
   *       sysName: 'Portal', // 必填 char 返回当前系统显示名称，支持i18n
   *       logo: '', // 可选 char 返回当前系统的图标url路径，如果不传则代表使用默认图标
   *     },
   *     baseInfo: { // 用户基础信息,按请求需要返回
   *       userId: 'admin', // 必填 char 用户id
   *       name: '管理员', // 必填 char 用户姓名
   *       avatar: '', // 可选 char 头像url
   *       ...
   *     },
   *     rights: [ // 用户权限清单,有值代表有权限,无值代表无权限,按请求需要返回
   *       {
   *         nameSpace: '', // 必填 char 权限命名空间,可以理解为交易界面标识
   *          action: '', // 必填 char 操作标识,可以理解为页面的动作
   *          departmentId: 1, // 选填 int 部门id,不填代表所有部门都有该权限
   *       },
   *       ...
   *     ],
   *     menus: { // 用户菜单清单,按请求需要返回
   *       sidebarMenus: [ // 左侧主菜单清单
   *         {
   *           name: '', // 必填 char 菜单英文标识，该标识在所有菜单中应唯一
   *           path: '', // 必填 char 菜单访问路径, 该标识在同级兄弟菜单中应唯一
   *           showName: '', // 必填 char 菜单显示名,支持i18n
   *           icon: '', // 选填 char 菜单图标标识名, 如填入则代表菜单文本前显示菜单图标
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
   *       ],
   *       fixedTags: [ // 固定页签清单，要求至少要有一个固定页签
   *         {
   *           name: '', // 必填 char 标签英文标识，该标识在所有标签中应唯一
   *           showName: '', // 必填 char 标签显示名,支持i18n
   *           icon: '', // 选填 char 标签图标标识名
   *           order: 1, // 选填 int 页签排序, 数字小的排前面
   *           tagType: '' // 必填 char 标签类型，view-内部页面(./src/views中的页面), link-链接url(含外部url)
   *           cacheType: '' // 选填 char 缓存类型, none-不缓存（默认），single-单页缓存（使用keepalive，同一个页面不支持打开多个），mutiple-多页缓存
   *           // view 相关配置
   *           routerPath: '', // view必填 char vue路由的访问路径，以 '/' 开头
   *           viewComponentName: '', // view必填 char 内部页面控件名（./src/views目录下的全局注册控件, 驼峰格式，不含.vue后缀, 由开发人员确认）
   *           viewProps: {}, // 选填 JSON 向view组件传的参数（由开发人员确认）
   *           viewQuery: {}, // 选填 JSON 调用vue路由时传入的参数，为?xx=xxxx形式的参数
   *           // link 相关配置
   *           url: '', // link必填 char 要打开的url路径
   *         },
   *       ...
   *       ]
   *     }
   *   }
   * }
   */
  'getUserInfo': {
    url: 'S02/userInfo/query',
    targetSysId: 'S02',
    isStandardMessage: true,
    isToken: true
  },

  /**
   * 注册用户
   * request: {
   *   body: {
   *     username: '', // 必填 char 登录用户名
   *     pwdHash: '', // 必填 char 通过rsa加密的登录密码
   *     captcha: '', // 可选 char 输入验证码
   *     captchaUuid: '', // 可选 char 验证码图片uuid
   *     userInfo: {}, // 可选 json 用户基本信息
   *   }
   * }
   * response: {}
   */
  'UserRegister': {
    url: 'S02/user/register',
    targetSysId: 'S02',
    isStandardMessage: true,
    isToken: false
  }
};
