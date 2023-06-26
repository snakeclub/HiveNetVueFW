/**
 * 用户认证的mock参数
 */

/**
 * 菜单相关接口信息
 */

// 测试主菜单功能
export const sidebarMenusTest = [
  {
    name: 'ActionTest',
    path: '/ActionTest',
    showName: 'Action Test',
    menuType: 'main',
    icon: 'el-icon-location',
    children: [
      {
        name: 'OpenView',
        path: 'OpenView',
        showName: 'Open View',
        menuType: 'main',
        icon: 'el-icon-user',
        children: [
          // 在当前layout打开页签
          {
            name: 'OpenViewInner',
            path: 'Inner',
            showName: 'Open Inner',
            menuType: 'view',
            cacheType: 'mutiple',
            viewComponentName: 'Edit',
            openType: 'inner'
          },
          // 在新窗口打开页面
          {
            name: 'OpenViewBlank',
            path: 'Blank',
            showName: 'Open Blank',
            menuType: 'main',
            children: [
              // 不使用layout框架打开页面
              {
                name: 'OpenViewBlankNoLayout',
                path: 'NoLayout',
                showName: 'Open Blank No Layout',
                menuType: 'view',
                viewComponentName: 'Edit',
                viewQuery: { id: '1' },
                openType: 'blank'
              },
              // 使用layout框架打开页面
              {
                name: 'OpenViewBlankLayoutNoCache',
                path: 'LayoutNoCache',
                showName: 'Open Blank Layout No Cache',
                menuType: 'view',
                viewComponentName: 'Edit',
                viewQuery: { id: '1' },
                openType: 'blank',
                cacheType: 'none',
                isLayoutTag: true
              },
              {
                name: 'OpenViewBlankLayoutSingleCache',
                path: 'LayoutSingleCache',
                showName: 'Open Blank Layout Single Cache',
                menuType: 'view',
                viewComponentName: 'Edit',
                viewQuery: { id: '1' },
                openType: 'blank',
                cacheType: 'single',
                isLayoutTag: true
              },
              {
                name: 'OpenViewBlankLayoutMutipleCache',
                path: 'LayoutMutipleCache',
                showName: 'Open Blank Layout Mutiple Cache',
                menuType: 'view',
                viewComponentName: 'Edit',
                viewQuery: { id: '1' },
                openType: 'blank',
                cacheType: 'mutiple',
                isLayoutTag: true
              }
            ]
          },
          // 刷新layout框架
          {
            name: 'OpenViewRefresh',
            path: 'Refresh',
            showName: 'Open Refresh',
            menuType: 'main',
            children: [
              // 不使用layout框架打开页面
              {
                name: 'OpenViewRefreshNoLayout',
                path: 'NoLayout',
                showName: 'Open Refresh No Layout',
                menuType: 'view',
                viewComponentName: 'Edit',
                openType: 'refresh'
              },
              // 在框架打开页面
              {
                name: 'OpenViewRefreshLayoutNoCache',
                path: 'LayoutNoCache',
                showName: 'Open Refresh Layout No Cache',
                menuType: 'view',
                viewComponentName: 'Edit',
                openType: 'refresh',
                cacheType: 'none',
                isLayoutTag: true
              },
              {
                name: 'OpenViewRefreshLayoutSingleCache',
                path: 'LayoutSingleCache',
                showName: 'Open Refresh Layout Single Cache',
                menuType: 'view',
                viewComponentName: 'Edit',
                openType: 'refresh',
                cacheType: 'single',
                isLayoutTag: true
              },
              {
                name: 'OpenViewRefreshLayoutMutipleCache',
                path: 'LayoutMutipleCache',
                showName: 'Open Refresh Layout Mutiple Cache',
                menuType: 'view',
                viewComponentName: 'Edit',
                openType: 'refresh',
                cacheType: 'mutiple',
                isLayoutTag: true
              }
            ]
          }
        ]
      },
      {
        name: 'OpenInsideUrl',
        path: 'OpenInsideUrl',
        showName: 'Open Inside Url',
        menuType: 'main',
        icon: 'job',
        children: [
          {
            name: 'OpenInsideUrlInner',
            path: 'Inner',
            showName: 'Open Inner',
            menuType: 'link',
            url: '/TestInnerUrl?id=10',
            openType: 'inner'
          },
          {
            name: 'OpenInsideUrlBlank',
            path: 'Blank',
            showName: 'Open Blank',
            menuType: 'link',
            url: '/TestInnerUrl?id=11',
            openType: 'blank'
          },
          {
            name: 'OpenInsideUrlRefresh',
            path: 'Refresh',
            showName: 'Open Refresh',
            menuType: 'link',
            url: '/TestInnerUrl?id=12',
            openType: 'refresh'
          }
        ]
      },
      {
        name: 'OpenOutsideUrl',
        path: 'OpenOutsideUrl',
        showName: 'Open Outside Url',
        menuType: 'main',
        icon: 'job',
        children: [
          {
            name: 'OpenOutsideUrlInner',
            path: 'Inner',
            showName: 'Open Inner',
            menuType: 'link',
            url: 'https://www.163.com',
            openType: 'inner'
          },
          {
            name: 'OpenOutsideUrlBlank',
            path: 'Blank',
            showName: 'Open Blank',
            menuType: 'link',
            url: 'https://www.163.com',
            openType: 'blank'
          },
          {
            name: 'OpenOutsideUrlRefresh',
            path: 'Refresh',
            showName: 'Open Refresh',
            menuType: 'link',
            url: 'https://www.163.com',
            openType: 'refresh'
          }
        ]
      },
      {
        name: 'OpenFixedTag',
        path: 'OpenFixedTag',
        showName: 'Open Fixed Tag',
        menuType: 'main',
        icon: 'job',
        children: [
          {
            name: 'OpenFixedIndex',
            path: 'Index',
            showName: 'Open Fixed Index',
            menuType: 'fixedTag',
            fixedTagName: 'index'
          },
          {
            name: 'OpenFixedEdit1',
            path: 'Edit1',
            showName: 'Open Fixed Edit1',
            menuType: 'fixedTag',
            fixedTagName: 'edit1'
          }
        ]
      },
      {
        name: 'RunJSCode',
        path: 'RunJSCode',
        showName: 'Run JS Code',
        menuType: 'main',
        icon: 'el-icon-location',
        children: [
          {
            name: 'RunJSCodeMessageShow',
            path: 'MessageShow',
            showName: 'Message Show',
            menuType: 'jsCode',
            code: 'globalObj.this.$modal.messageSuccess("Test Message Show");'
          }
        ]
      },
      {
        name: 'RunEmbedAction',
        path: 'RunEmbedAction',
        showName: 'Run Embed Action',
        menuType: 'main',
        icon: 'el-icon-location',
        children: [
          {
            name: 'RunEmbedActionRunJSCode',
            path: 'RunJSCode',
            showName: 'Run JS Code',
            menuType: 'embed',
            embedAction: 'runJsCode',
            embedPara: { code: 'globalObj.this.$modal.messageSuccess("Test Embed Action - Run JS Code");' }
          },
          {
            name: 'RunEmbedActionRunClickMenu',
            path: 'RunClickMenu',
            showName: 'Run clickMenu',
            menuType: 'embed',
            embedAction: 'clickMenu',
            embedPara: { type: 'sidebar', name: 'RunJSCodeMessageShow' }
          },
          {
            name: 'RunEmbedActionRunClickMenu1',
            path: 'RunClickMenu1',
            showName: 'Run clickMenu 1',
            menuType: 'embed',
            embedAction: 'clickMenu',
            embedPara: { type: 'sidebar', namePath: 'ActionTest/RunJSCode/RunJSCodeMessageShow' }
          }
        ]
      }
    ]
  },
  {
    name: 'EditPageTest',
    path: '/EditPageTest',
    showName: 'Edit Page Test',
    menuType: 'main',
    icon: 'el-icon-location',
    children: [
      {
        name: 'OpenUserView',
        path: 'Auth/User/UserView',
        showName: 'Open User View',
        menuType: 'view',
        icon: 'el-icon-user',
        cacheType: 'mutiple',
        viewComponentName: 'UserView',
        openType: 'inner'
      }
    ]
  },
  {
    name: 'MenuShowTest',
    path: '/MenuShowTest',
    showName: 'Menu Show Test',
    menuType: 'main',
    icon: 'el-icon-user',
    children: [
      {
        name: 'TestActionMenu',
        path: 'TestActionMenu',
        showName: 'Test Action Menu',
        icon: 'user',
        menuType: 'jsCode',
        code: 'globalObj.this.$modal.messageSuccess("Test Action Menu");'
      },
      {
        name: 'TestActionMenuNoIcon',
        path: 'TestActionMenuNoIcon',
        showName: 'Test Action Menu No Icon',
        icon: '',
        menuType: 'jsCode',
        code: 'globalObj.this.$modal.messageSuccess("Test Action Menu No Icon");'
      },
      {
        name: 'TestActionMenuDisable',
        path: 'TestActionMenuDisable',
        showName: 'Test Action Menu Disable',
        icon: 'user',
        disabled: true,
        menuType: 'jsCode',
        code: 'globalObj.this.$modal.messageSuccess("Test Action Menu Disable");'
      },
      {
        name: 'TestActionMenuHidden',
        path: 'TestActionMenuHidden',
        showName: 'Test Action Menu Hidden',
        icon: 'user',
        hidden: true,
        menuType: 'jsCode',
        code: 'globalObj.this.$modal.messageSuccess("Test Action Menu Hidden");'
      },
      {
        name: 'TestSubMenu',
        path: 'TestSubMenu',
        showName: 'Test SubMenu',
        menuType: 'main',
        icon: 'el-icon-user',
        children: [
          {
            name: 'TestSubMenuSubMenu',
            path: 'TestSubMenuSubMenu',
            showName: 'Sub-SubMenu',
            menuType: 'main',
            icon: 'el-icon-user',
            children: [
              {
                name: 'TestSubMenuSubMenuAction',
                path: 'TestSubMenuSubMenuAction',
                showName: 'Run Action',
                icon: 'user',
                menuType: 'jsCode',
                code: 'globalObj.this.$modal.messageSuccess("Sub-SubMenu Run Action");'
              }
            ]
          }
        ]
      },
      {
        name: 'TestSubMenuDisable',
        path: 'TestSubMenuDisable',
        showName: 'Test SubMenu Disable',
        disabled: true,
        menuType: 'main',
        icon: 'el-icon-user',
        children: [
          {
            name: 'TestSubMenuDisableSubMenu',
            path: 'TestSubMenuDisableSubMenu',
            showName: 'Sub-SubMenu-Disable',
            menuType: 'main',
            icon: 'el-icon-user',
            children: [
              {
                name: 'TestSubMenuDisableSubMenuAction',
                path: 'TestSubMenuDisableSubMenuAction',
                showName: 'Run Action',
                icon: 'user',
                hidden: true,
                menuType: 'jsCode',
                code: 'globalObj.this.$modal.messageSuccess("Sub-Disable-SubMenu Run Action");'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'TestFirstLevelAction',
    path: '/TestFirstLevelAction',
    showName: 'Test First Action',
    menuType: 'jsCode',
    icon: '',
    code: 'globalObj.this.$modal.messageSuccess("Test Message Show");'
  },
  {
    name: 'TestFisrtNoIcon',
    path: '/TestFisrtNoIcon',
    showName: 'Test Fisrt No Icon',
    menuType: 'main',
    icon: ''
  },
  {
    name: 'TestFisrtOnlyIcon',
    path: '/TestFisrtOnlyIcon',
    showName: '',
    menuType: 'main',
    icon: 'system'
  },
  {
    name: 'User',
    path: '/user',
    showName: 'User Management',
    menuType: 'link',
    icon: 'system',
    url: 'https://www.baidu.com'
  }
];

// 测试右上角菜单功能
export const rightMenusTest = [
  {
    name: 'TopTestSearch',
    path: '/TopTestSearch',
    showType: 'component',
    hidden: false,
    toolTip: 'Search Menus',
    component: 'header-search',
    menuType: 'null'
  },
  {
    name: 'TopTestScreenfull',
    path: '/TopTestScreenfull',
    showType: 'component',
    toolTip: 'Switch Full Screen',
    component: 'screenfull',
    menuType: 'null'
  },
  {
    name: 'TopTestSizeSelect',
    path: '/TopTestSizeSelect',
    showType: 'component',
    toolTip: 'Switch Size',
    component: 'size-select',
    menuType: 'null',
    dropDownTrigger: 'hover'
  },
  {
    name: 'TopTestLangSelect',
    path: '/TopTestLangSelect',
    showType: 'component',
    toolTip: 'Change Language',
    component: 'lang-select',
    menuType: 'null',
    dropDownTrigger: 'click'
  },
  {
    name: 'TopTestIcon',
    path: '/TopTestIcon',
    showType: 'icon',
    menuType: 'jsCode',
    icon: 'el-icon-location',
    code: 'globalObj.this.$modal.messageSuccess("Test TopTestIcon");'
  },
  {
    name: 'TopTestIconToolTip',
    path: '/TopTestIconToolTip',
    showType: 'icon',
    toolTip: 'Top Test Icon with tooltip',
    menuType: 'jsCode',
    icon: 'search',
    code: 'globalObj.this.$modal.messageSuccess("Test TopTestIconToolTip");'
  },
  {
    name: 'TopTestLinkIcon',
    path: '/TopTestLinkIcon',
    showName: 'Link',
    showType: 'link',
    toolTip: 'Top Test link with tooltip',
    menuType: 'jsCode',
    icon: 'system',
    code: 'globalObj.this.$modal.messageSuccess("Test TopTestLinkIcon");'
  },
  {
    name: 'TopTestIconToolTip1',
    path: '/TopTestIconToolTip1',
    showType: 'icon',
    toolTip: 'Top Test Icon with tooltip',
    menuType: 'main',
    icon: 'search'
  },
  {
    name: 'TopTestAvatar',
    path: '/TopTestAvatar',
    showType: 'component',
    component: 'avatar',
    componentProps: { dropDownIcon: true },
    menuType: 'main',
    dropDownTrigger: 'hover',
    children: [
      {
        name: 'LayoutSetting',
        path: '/LayoutSetting',
        showName: '布局设置',
        showType: 'icon',
        toolTip: 'Top Test Icon with tooltip',
        menuType: 'embed',
        icon: 'search',
        embedAction: 'showHideLayoutSettings',
        embedPara: { show: true }
      },
      {
        name: 'Login',
        path: 'Login',
        showName: 'Login',
        showType: 'icon',
        toolTip: 'Top Test Icon with tooltip',
        menuType: 'embed',
        icon: 'el-icon-user-filled',
        embedAction: 'showLoginDialog',
        embedPara: {}
      },
      {
        name: 'Logout',
        path: 'Logout',
        showName: 'Logout',
        showType: 'icon',
        toolTip: 'Top Test Icon with tooltip',
        menuType: 'embed',
        icon: 'link',
        embedAction: 'logout',
        embedPara: { confirm: true, redirectType: 'auto' }
      },
      {
        name: 'Register',
        path: 'Register',
        showName: 'Register',
        showType: 'icon',
        toolTip: 'Top Test Icon with tooltip',
        menuType: 'embed',
        icon: 'log',
        embedAction: 'showRegisterDialog',
        embedPara: {}
      }
    ]
  }
];

// 测试固定页签功能
export const fixedTagsTest = [
  {
    name: 'index',
    showName: 'home',
    icon: 'dashboard',
    tagType: 'view',
    routerPath: '/index',
    viewComponentName: 'Index'
  },
  {
    name: 'edit1',
    showName: 'edit1',
    icon: 'dashboard',
    tagType: 'view',
    cacheType: 'single',
    routerPath: '/edit1',
    viewComponentName: 'Edit',
    viewQuery: { id: '1' }
  },
  {
    name: 'edit2',
    showName: 'edit2',
    icon: 'dashboard',
    tagType: 'view',
    cacheType: 'mutiple',
    routerPath: '/edit2',
    viewComponentName: 'Edit',
    viewQuery: { id: '2' }
  },
  {
    name: 'edit3',
    showName: 'edit3',
    icon: 'dashboard',
    tagType: 'view',
    cacheType: 'mutiple',
    routerPath: '/edit3',
    viewComponentName: 'Edit',
    viewQuery: { id: '3' }
  },
  {
    name: 'iframe-163',
    showName: '163',
    icon: '',
    tagType: 'link',
    url: 'https://www.163.com'
  },
  {
    name: 'iframe-163-cached',
    showName: '163Cached',
    icon: '',
    tagType: 'link',
    url: 'https://mobile.163.com/'
  }
];

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
            tokenExpires: 3
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

  // 获取用户信息
  'S02/userInfo/query': {
    default: {
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
            baseInfo: {
              userId: 'admin',
              name: '管理员',
              avatar: ''
            },
            rights: [],
            menus: {
              sidebarMenus: sidebarMenusTest,
              rightMenus: rightMenusTest,
              fixedTags: fixedTagsTest
            }
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
