/**
 * 用户认证的mock参数
 */

/**
 * 菜单相关接口信息
 */
import demoMenus from '@/menus/demo.js';

/**
 * 处理登入和登出两种情况的菜单
 */
const stdRightMenus = JSON.parse(JSON.stringify(demoMenus.rightMenus));
stdRightMenus[stdRightMenus.length - 1]['children'].push({
  name: 'ChangePwd',
  path: 'ChangePwd',
  showName: 'Change Password',
  showType: 'icon',
  toolTip: '',
  menuType: 'embed',
  icon: 'el-icon-key',
  embedAction: 'showChangePwdDialog',
  embedPara: {}
});
stdRightMenus[stdRightMenus.length - 1]['children'].push({
  name: 'Logout',
  path: 'Logout',
  showName: 'Logout',
  showType: 'icon',
  toolTip: '',
  menuType: 'embed',
  icon: 'link',
  embedAction: 'logout',
  embedPara: { confirm: true, redirectType: 'auto' }
});

const anonymousRightMenus = JSON.parse(JSON.stringify(demoMenus.rightMenus));
anonymousRightMenus[anonymousRightMenus.length - 1]['children'].push({
  name: 'Login',
  path: 'Login',
  showName: 'Login',
  showType: 'icon',
  toolTip: '',
  menuType: 'embed',
  icon: 'el-icon-user-filled',
  embedAction: 'showLoginDialog',
  embedPara: {}
});
anonymousRightMenus[anonymousRightMenus.length - 1]['children'].push({
  name: 'Register',
  path: 'Register',
  showName: 'Register',
  showType: 'icon',
  toolTip: '',
  menuType: 'embed',
  icon: 'log',
  embedAction: 'showRegisterDialog',
  embedPara: {}
});

/**
 * 接口返回值
 */
export default {
  // 用户登录
  'S02/user/login': {
    // 匹配路由，key为返回值设置，value为匹配表达式数组
    matchRouter: {},
    default: {
      // 是否为标准报文
      isStandard: true,
      // 响应信息
      response: {
        data: {
          body: {
            userId: 'admin',
            name: '管理员',
            token: 'token:xxxxxxxxx',
            tokenExpires: 10
          }
        }
      }
    }
  },

  // 用户登出
  'S02/user/logout': {
    default: {
      // 是否为标准报文
      isStandard: true,
      // 响应信息
      response: {
        data: {}
      }
    }
  },

  // 用户修改密码
  'S02/user/changePwd': {
    default: {
      // 是否为标准报文
      isStandard: true,
      // 响应信息
      response: {
        data: {}
      }
    }
  },

  // 获取用户信息
  'S02/userInfo/query': {
    default: {
      // 指定需要通过表达式更新值的对象, 非返回值，返回时将被删除
      scriptPath: [
        'data.body.baseInfo', 'data.body.rights', 'data.body.menus'
      ],
      // 指定表达式中可以使用的变量
      varDatas: {
        stdBaseInfo: {
          userId: 'admin',
          name: '管理员',
          avatar: '/static/avatar/profile-default.jpg'
        },
        anonymousBaseInfo: {
          userId: '',
          name: 'Anonymous',
          avatar: '/static/avatar/profile-anonymous.jpg'
        },
        stdRights: [],
        stdMenus: {
          sidebarMenus: demoMenus.sidebarMenus,
          rightMenus: stdRightMenus,
          fixedTags: demoMenus.fixedTags
        },
        anonymousMenus: {
          sidebarMenus: demoMenus.sidebarMenus,
          rightMenus: anonymousRightMenus,
          fixedTags: demoMenus.fixedTags
        }
      },
      // 是否为标准报文
      isStandard: true,
      // 响应信息
      response: {
        data: {
          body: {
            cacheId: 'abcd',
            sysInfo: {
              sysId: 'portal',
              sysName: 'Portal',
              logo: ''
            },
            baseInfo: 'config.data.body.withBaseInfo === undefined || config.data.body.withBaseInfo === "y" ? (config.data.head.userId === undefined || config.data.head.userId ===  "" ? varDatas.anonymousBaseInfo : varDatas.stdBaseInfo) : undefined',
            rights: 'config.data.body.withRights === undefined || config.data.body.withRights === "y" ? varDatas.stdRights : undefined',
            menus: 'config.data.body.withMenus === undefined || config.data.body.withMenus === "y" ? (config.data.head.userId === undefined || config.data.head.userId ===  "" ? varDatas.anonymousMenus : varDatas.stdMenus) : undefined'
          }
        }
      }
    }
  },

  // 注册用户
  'S02/user/register': {
    default: {
      // 是否为标准报文
      isStandard: true,
      // 响应信息
      response: {
        data: {}
      }
    }
  }

};
