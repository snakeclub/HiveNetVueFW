/**
 * 可配置的参数
 */
import demoMenus from '@/menus/demo.js';

module.exports = {
  // 应用配置
  app: {
    // 系统名
    name: process.env.VUE_APP_TITLE,
    // logo图片
    logo: require('@/assets/logo/logo.png'),
    // 是否显示版权信息
    showCopyright: true,
    // 版权信息内容
    copyrightText: 'Copyright © 2022- 黎慧剑 All Rights Reserved.',
    // 版权信息是否固定在底部（不随着内容滚动）
    copyrightFixedBottom: false,
    // 是否支持多应用（路径均带有系统标识信息）
    mutipleAppSupport: true,
    // 是否支持浏览器刷新按钮动作（会增加缓存的内容，性能和内存占用会更高）
    browserRefreshSupport: true,
    // 主框架的缓存读取key值
    layoutRefreshCacheKey: 'layoutRefreshCache',
    // 可缓存的iframe的路由路径
    cachedIframePath: '/layout/iframe',
    // 主页框架刷新的路由路径
    layoutRefreshPath: '/LayoutRefresh',

    /**
     * 指定登录管理类型:
     * no - 不管理登录(框架不主动处理登录, 由使用者自行处理登录内容)
     * anonymous - 支持匿名访问模式(登录前可访问页面)
     * log - 必须登录才能访问
     */
    loginManageType: 'anonymous',

    // 应用首页的url地址
    homePageUrl: '/',

    // 应用登录页面的url地址
    loginUrl: '/login',

    /**
     * 获取菜单的方式
     * no - 不获取菜单
     * static - 获取静态菜单配置
     * api - 通过菜单查询Api接口获取
     * login - 在登录后通过查询用户信息方式获取
     */
    getMenusType: 'login',

    // 静态菜单配置
    staticMenusConfig: demoMenus,

    /**
     * 当前语言
     */
    lang: 'zh-cn',

    /**
     * 支持的语言清单
     * lang - 语言标识（文件名）; showName - 显示名; icon - 国旗icon标识
     */
    langSupport: [
      {
        lang: 'zh-cn',
        showName: '中文',
        icon: ''
      },
      {
        lang: 'en',
        showName: 'English',
        icon: ''
      }
    ]
  },

  // 主界面布局相关配置
  layout: {
    // 左侧菜单的宽度
    sidebarWidth: '200px',

    // 是否允许左侧菜单栏改变大小
    sidebarResizeable: true,

    // 是否显示顶部导航
    topNav: false,

    // 顶部导航菜单显示的菜单个数
    topNavVisibleNumber: 3,

    // 是否显示顶部面包屑导航栏
    breadcrumb: true,

    // 是否显示页签导航栏
    tagsView: true,

    // 是否显示菜单顶上的logo
    sidebarLogo: true,

    // 是否显示右上角菜单项的分隔标记（不支持设置）
    rightMenuDivider: false,

    // 是否显示动态标题
    dynamicTitle: false,

    // 是否显示主题为夜间模式
    nightMode: false,

    // 系统整体主题颜色
    systemThemeColor: '#0960BD',

    // 预定义的可选系统整体主题颜色
    systemThemeList: [
      '#0960BD',
      '#0084F4',
      '#009688',
      '#536DF3',
      '#FF5C93',
      '#EE4F12',
      '#0096C7',
      '#9C27B0',
      '#FF9800'
    ],

    // 顶部导航栏主题颜色
    navbarThemeColor: '#FFFFFF',

    // 预定义的可选顶部导航栏主题颜色
    navbarThemeList: [
      '#FFFFFF',
      '#151515',
      '#009688',
      '#5172DC',
      '#409EFF',
      '#E74C3C',
      '#24292E',
      '#394664',
      '#001529',
      '#383F45'
    ],

    // 左侧菜单栏主题颜色
    sidebarThemeColor: '#001529',

    // 预定义的可选左侧菜单栏主题颜色
    sidebarThemeList: [
      '#001529',
      '#212121',
      '#273352',
      '#FFFFFF',
      '#191B24',
      '#191A23',
      '#304156',
      '#28333E',
      '#344058',
      '#383F45'
    ],

    // 浅色字体颜色（配合深色背景使用）
    fontLightColor: '#ffffff',
    fontLightColorActive: '#e6e6e6',

    // 深色字体颜色（配合浅色背景使用）
    fontDarkColor: 'rgba(0, 0, 0, 0.85)',
    fontDarkColorActive: '#000000'
  },

  // axios 相关配置
  axios: {
    // 默认 http headers, key - header项, value - header值
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },

    // 默认请求参数，可配置参数参考 axios 官方文档
    requestParam: {
      // 公共部分URL
      baseURL: process.env.VUE_APP_BASE_API,
      // 超时时间, 单位为毫秒
      timeout: 10000,
      // 允许的响应内容的最大尺寸
      maxContentLength: 2000,
      // 服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
      responseType: 'json',
      // 响应数据编码
      responseEncoding: 'utf8'
    },

    // 是否采取Mock模式执行Ajax
    useMock: process.env.VUE_APP_BASE_API === 'mock'
  },

  // Ajax后台请求报文的标准化参数 (实际参数定义根据需要自行修改)
  ajaxMessage: {
    // 3位系统标识
    sysId: '000',
    // 3位模块标识
    moduleId: '000',
    // 2位服务器标识
    serverId: '01',

    // 标准报文头的默认参数
    head: {
      // 产品码, 可简单理解为每个交易(界面)对应一个产品吗, 对于系统集操作统一产品码为sys
      prdCode: 'sys',
      // 交易码，可简单理解为对应该交易的具体操作, 根据实际情况自定义
      tranCode: '',
      // 接口类型，指明是请求还是响应, 01-请求报文,02-响应报文
      infType: '01'
    },
    // 是否将会话token放入报文头
    tokenInHead: true
  },

  // Message 提示信息配置, 参考element-plus的ElMessage参数，可分别配置success/warning/info/error各种类型提示消息的默认参数
  messageTips: {
    // 提示信息
    info: {
      // 显示时间, 毫秒。 设为 0 则不会自动关闭
      duration: 2000,
      // 是否显示关闭按钮
      showClose: false
    },
    success: {
      // 显示时间, 毫秒。 设为 0 则不会自动关闭
      duration: 2000,
      // 是否显示关闭按钮
      showClose: false
    },
    warning: {
      // 显示时间, 毫秒。 设为 0 则不会自动关闭
      warning: 3000,
      // 是否显示关闭按钮
      showClose: false
    },
    // 错误类提示信息参数
    error: {
      // 显示时间, 毫秒。 设为 0 则不会自动关闭
      duration: 0,
      // 是否显示关闭按钮
      showClose: true
    }
  },

  // Notification 通知信息配置，参考element-plus的ElNotification参数，可分别配置success/warning/info/error各种类型通知消息的默认参数
  notificationTips: {
    info: {
      // 显示时间, 毫秒。 设为 0 则不会自动关闭
      duration: 4500,
      // 是否显示关闭按钮
      showClose: true,
      // 显示位置，top-right/top-left/bottom-right/bottom-left
      position: 'bottom-right'
    }
  },

  // loading类通用配置
  loading: {
    // 全屏类loading的配置，参考element-plus的ElLoading配置
    fullScreenLoading: {
      // 自定义加载图标类名
      spinner: 'el-icon-loading',
      // background
      background: 'rgba(0, 0, 0, 0.7)'
    }
  },

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: ['prod', 'dev']
};
