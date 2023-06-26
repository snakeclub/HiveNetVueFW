export default {
  // app
  'Vue-Admin Manage System': 'Vue-Admin Manage System',
  'Portal': 'Portal',

  // system alert
  'Alert': 'Alert',
  'Tips': 'Tips',
  'OK': 'OK',
  'Cancel': 'Cancel',
  'Back end interface error, failed with status code: ': 'Back end interface error, failed with status code: ',
  'Back end interface connection error': 'Back end interface connection error',
  'Back end interface request overtime': 'Back end interface request overtime',
  'Authentication failed, unable to access system resources': 'Authentication failed, unable to access system resources',
  'without permission to perform the current operation': 'without permission to perform the current operation',

  // 左侧菜单
  'Home': 'Home',

  // right menus
  'Search Menus': 'Search Menus',
  'No match menus': 'No match menus',
  'Change Language Success': 'Change Language Success',
  'Change Language': 'Change Language',
  'Your browser does not support full screen': 'Your browser does not support full screen',
  'Switch Full Screen': 'Switch Full Screen',
  'Switch Size Success': 'Switch Size Success',
  'Switch Size': 'Switch Size',
  'Large': 'Large',
  'Default': 'Default',
  'Small': 'Small',
  'Layout Setting': 'Layout Setting',
  'Login': 'Login',
  'Logout': 'Logout',
  'Change Password': 'Change Password',
  'Register': 'Register',
  'Anonymous': 'Anonymous', // 匿名用户

  // 标签页操作
  'Refresh Current Tab': 'Refresh Current Tab',
  'Close Current Tab': 'Close Current Tab',
  'Close Tabs On Left': 'Close Tabs On Left',
  'Close Tabs On Right': 'Close Tabs On Right',
  'Close Other Tabs': 'Close Other Tabs',
  'Close All Tabs': 'Close All Tabs',

  // menus
  'System Management': 'System Management',

  // 401 error
  error_401: {
    back: 'Back',
    err: '401 Error!',
    message: 'You do not have access rights!',
    tips: 'Sorry, you have no access permission, please do not operate illegally!',
    backHome: 'Back to home page'
  },

  // 404 error
  error_404: {
    back: 'Back',
    err: '404 Error!',
    message: 'Page not found!',
    tips: 'Sorry, the page you are looking for does not exist. Try checking the URL for errors, then press the refresh button on your browser or try to find something else in our application.',
    backHome: 'Back to home page'
  },

  // 500 Error
  error_500: {
    back: 'Back',
    err: '500 Error!',
    message: 'Server internal error!',
    tips: 'Sorry, there is something wrong with the server!',
    backHome: 'Back to home page'
  },

  // Login
  'Are you sure to logout?': 'Are you sure to logout?',
  'To login page': 'To login page',
  'login status has expired': 'login status has expired',
  'Login status has expired, you can stay on this page or log in again': 'Login status has expired, you can stay on this page or log in again',

  // MarkdownPreview的支持
  'Contents': 'Contents',
  'Loading doc contents': 'Loading doc contents',

  // 通用的组件i18n配置
  common: {
    // 按钮栏组件
    ButtonBar: {
      'Summit': 'Summit',
      'Reset': 'Reset'
    }
  },

  // 表单验证的通用翻译
  validateRules: {
    required: '{name} is required',
    lengthBetween: '{name} must be between {min} and {max} characters',
    extendNameError: 'rule config of {name} error: need extendName para',
    extendNameNotExists: 'rule config of {name} error: name {extendName} not exists',
    // 关联字段校验
    relation: {
      ExpressionNotEqual: 'Relation validate error: {expression} != {equalExp}',
      ExpressionBetween: '{expression} must between {minExp} to {maxExp}',
      ExpressionGreater: '{expression} must greater than {minExp}',
      ExpressionLess: '{expression} must less than {maxExp}',
      ExpressionException: 'Compute expression error: {error}'
    }
  },

  // 表单联动错误的通用翻译
  linkageRules: {
    linkageTypeError: 'linkage rule config of {id} error: need linkageType para',
    linkageNotExists: 'linkage rule config of {id} error: linkageType {linkageType} not exists'
  },

  // 页面组件的i18n配置
  views: {
    AuthCenter: {
      sharedMessages: {
        // 认证中心的公共参数
        'Username': 'Username',
        'Password': 'Password',
        'Confirm Password': 'Confirm Password',
        'Inconsistent Input Passwords': 'Inconsistent Input Passwords',
        'CAPTCHA': 'CAPTCHA',
        'Please input you username': 'Please input you username',
        'Please input you password': 'Please input you password',
        'Please enter your password again': 'Please enter your password again',
        'Please input CAPTCHA': 'Please input CAPTCHA'
      },
      components: {
        LoginForm: {
          'Login': 'Login',
          'Remember me': 'Remember me',
          'Waiting login ...': 'Waiting login ...',
          'Register Now': 'Register Now',
          'Welcome back': 'Welcome back'
        },
        RegisterForm: {
          'Register': 'Register',
          'Waiting register ...': 'Waiting register ...',
          'Login with existing account': 'Login with existing account',
          'Register Success': 'Your account "{username}}" was successfully registered!'
        },
        ChangePwdForm: {
          'Change Password': 'Change Password',
          'Old Password': 'Old Password',
          'New Password': 'New Password',
          'Change': 'Change',
          'Waiting change ...': 'Waiting change ...',
          'Please input you old password': 'Please input you old password',
          'Please input you new password': 'Please input you new password',
          'Please enter your new password again': 'Please enter your new password again',
          'Change password success': 'Change password success'
        }
      }
    }
  }
};
