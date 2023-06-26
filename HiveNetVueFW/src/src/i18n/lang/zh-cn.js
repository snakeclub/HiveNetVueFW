export default {
  // 系统配置相关
  'Vue-Admin Manage System': 'Vue-Admin管理系统',
  'Portal': '门户系统',

  // 系统提示相关
  'Alert': '系统提示',
  'Tips': '提示',
  'OK': '确定',
  'Cancel': '取消',
  'Back end interface error, failed with status code: ': '后端接口异常, 失败状态码: ',
  'Back end interface connection error': '后端接口连接异常',
  'Back end interface request overtime': '后端接口请求超时',
  'Authentication failed, unable to access system resources': '认证失败，无法访问系统资源',
  'without permission to perform the current operation': '没有权限执行当前操作',

  // 左侧菜单
  'Home': '首页',

  // 右上角菜单
  'Search Menus': '搜索菜单',
  'No match menus': '未匹配到菜单',
  'Change Language Success': '修改语言成功',
  'Change Language': '修改语言',
  'Your browser does not support full screen': '你的浏览器不支持全屏',
  'Switch Full Screen': '全屏切换',
  'Switch Size Success': '切换样式大小成功',
  'Switch Size': '切换样式大小',
  'Large': '大',
  'Default': '默认',
  'Small': '小',
  'Layout Setting': '布局设置',
  'Login': '登录',
  'Logout': '登出',
  'Register': '注册',
  'Change Password': '修改密码',
  'Anonymous': '匿名用户', // 匿名用户

  // 标签页操作
  'Refresh Current Tab': '刷新当前标签页',
  'Close Current Tab': '关闭当前标签页',
  'Close Tabs On Left': '关闭左侧标签页',
  'Close Tabs On Right': '关闭右侧标签页',
  'Close Other Tabs': '关闭其他标签页',
  'Close All Tabs': '关闭所有标签页',

  // 菜单相关
  'System Management': '系统管理',

  // 401错误
  error_401: {
    back: '返回',
    err: '401错误!',
    message: '您没有访问权限！',
    tips: '对不起，您没有访问权限，请不要进行非法操作！',
    backHome: '返回首页'
  },

  // 404错误
  error_404: {
    back: '返回',
    err: '404错误!',
    message: '找不到网页！',
    tips: '对不起，您正在寻找的页面不存在。尝试检查URL的错误，然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容。',
    backHome: '返回首页'
  },

  // 500错误
  error_500: {
    back: '返回',
    err: '500错误!',
    message: '服务器内部错误！',
    tips: '对不起，服务器出了点问题！',
    backHome: '返回首页'
  },

  // 登录相关
  'Are you sure to logout?': '确定退出登录吗?',
  'To login page': '重新登录',
  'login status has expired': '登录状态已过期',
  'Login status has expired, you can stay on this page or log in again': '登录状态已过期，您可以继续留在该页面，或者重新登录',

  // MarkdownPreview的支持
  'Contents': '文档大纲',
  'Loading doc contents': '正在加载文档内容',

  // 通用的组件i18n配置
  common: {
    // 按钮栏组件
    ButtonBar: {
      'Summit': '提交',
      'Reset': '重置'
    }
  },

  // 表单验证的通用翻译
  validateRules: {
    required: '{name}必须输入',
    lengthBetween: '{name}必须在{min}和{max}个字符之间',
    extendNameError: '{name}的校验规则错误: 缺失extendName',
    extendNameNotExists: '{name}的校验规则错误:  扩展校验名 {extendName} 不存在',
    // 关联字段校验
    relation: {
      ExpressionNotEqual: '关联校验失败: {expression} != {equalExp}',
      ExpressionBetween: '{expression} 必须在 {minExp} 和 {maxExp} 之间',
      ExpressionGreater: '{expression} 必须大于 {minExp}',
      ExpressionLess: '{expression} 必须小于 {maxExp}',
      ExpressionException: '计算表达式异常: {error}'
    }
  },

  // 表单联动错误的通用翻译
  linkageRules: {
    linkageTypeError: '{id}的联动规则错误: 缺失linkageType',
    linkageNotExists: '{id}的联动规则错误: 联动类型 {linkageType} 不存在'
  },

  // 页面组件的i18n配置
  views: {
    AuthCenter: {
      sharedMessages: {
        // 认证中心的公共参数
        'Username': '账号',
        'Password': '密码',
        'Confirm Password': '确认密码',
        'Inconsistent Input Passwords': '输入密码不一致',
        'CAPTCHA': '验证码',
        'Please input you username': '请输入您的账号',
        'Please input you password': '请输入您的密码',
        'Please enter your password again': '请再次输入您的密码',
        'Please input CAPTCHA': '请输入验证码'
      },
      components: {
        LoginForm: {
          'Login': '登 录',
          'Remember me': '记住登录用户',
          'Register Now': '立即注册',
          'Waiting login ...': '登 录 中...',
          'Welcome back': '欢迎回来'
        },
        RegisterForm: {
          'Register': '注 册',
          'Waiting register ...': '注 册 中...',
          'Login with existing account': '使用已有账户登录',
          'Register Success': '您的账号"{username}"注册成功!'
        },
        ChangePwdForm: {
          'Change Password': '修改密码',
          'Old Password': '旧密码',
          'New Password': '新密码',
          'Change': '修 改',
          'Waiting change ...': '修 改 中 ...',
          'Please input you old password': '请输入您的旧密码',
          'Please input you new password': '请输入您的新密码',
          'Please enter your new password again': '请再次输入您的新密码',
          'Change password success': '修改密码成功'
        }
      }
    }
  }
};
