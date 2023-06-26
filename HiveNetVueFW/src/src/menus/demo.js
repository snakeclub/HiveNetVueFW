/**
 * Demo的静态菜单设置
 */

export default {
  sidebarMenus: [
    {
      name: 'Home',
      path: '/home',
      showName: 'Home',
      menuType: 'fixedTag',
      icon: 'el-icon-home-filled',
      fixedTagName: 'Home'
    },
    {
      name: 'Development',
      path: '/Development',
      showName: '开发相关',
      menuType: 'main',
      icon: 'code',
      children: [
        {
          name: 'Themes',
          path: 'Themes',
          showName: '主题颜色',
          menuType: 'view',
          icon: 'theme',
          cacheType: 'none',
          viewComponentName: 'MarkdownUrl',
          viewProps: { 'url': '/docs/development/themes.md' },
          openType: 'inner'
        },
        {
          name: 'I18n',
          path: 'I18n',
          showName: '国际化',
          menuType: 'view',
          icon: 'language',
          cacheType: 'none',
          viewComponentName: 'MarkdownUrl',
          viewProps: { 'url': '/docs/development/i18n.md' },
          openType: 'inner'
        },
        {
          name: 'Mixins',
          path: 'Mixins',
          showName: '页面混入代码',
          menuType: 'view',
          icon: 'nested',
          cacheType: 'none',
          viewComponentName: 'MarkdownUrl',
          viewProps: { 'url': '/docs/development/mixins.md' },
          openType: 'inner'
        },
        {
          name: 'Icon',
          path: 'Icon',
          showName: 'icon图标使用',
          menuType: 'view',
          icon: 'el-icon-picture-rounded',
          cacheType: 'none',
          viewComponentName: 'MarkdownUrl',
          viewProps: { 'url': '/docs/development/icon.md' },
          openType: 'inner'
        },
        {
          name: 'Api',
          path: 'Api',
          showName: '接口调用支持',
          icon: 'el-icon-connection',
          menuType: 'view',
          cacheType: 'none',
          viewComponentName: 'MarkdownUrl',
          viewProps: { 'url': '/docs/development/api.md' },
          openType: 'inner'
        },
        {
          name: 'Menus',
          path: 'Menus',
          showName: '菜单设置',
          menuType: 'view',
          icon: 'el-icon-menu',
          cacheType: 'none',
          viewComponentName: 'MarkdownUrl',
          viewProps: { 'url': '/docs/development/menus.md' },
          openType: 'inner'
        },
        {
          name: 'Embed',
          path: 'Embed',
          showName: '内部集成动作',
          menuType: 'view',
          icon: 'el-icon-pointer',
          cacheType: 'none',
          viewComponentName: 'MarkdownUrl',
          viewProps: { 'url': '/docs/development/embed.md' },
          openType: 'inner'
        },
        {
          name: 'Iframe',
          path: 'Iframe',
          showName: 'Iframe通讯框架',
          menuType: 'view',
          icon: 'el-icon-copy-document',
          cacheType: 'none',
          viewComponentName: 'MarkdownUrl',
          viewProps: { 'url': '/docs/development/iframe.md' },
          openType: 'inner'
        },
        {
          name: 'Validate',
          path: 'Validate',
          showName: '表单校验',
          menuType: 'view',
          icon: 'el-icon-copy-document',
          cacheType: 'none',
          viewComponentName: 'MarkdownUrl',
          viewProps: { 'url': '/docs/development/validate.md' },
          openType: 'inner'
        },
        {
          name: 'Linkage',
          path: 'Linkage',
          showName: '输入栏位联动',
          menuType: 'view',
          icon: 'el-icon-copy-document',
          cacheType: 'none',
          viewComponentName: 'MarkdownUrl',
          viewProps: { 'url': '/docs/development/linkage.md' },
          openType: 'inner'
        }
      ]
    },
    {
      name: 'Components',
      path: '/components',
      showName: '组件',
      menuType: 'main',
      icon: 'component',
      children: [
        {
          name: 'view',
          path: 'view',
          showName: '页面组件',
          menuType: 'main',
          icon: 'textarea',
          children: [
            {
              name: 'MarkdownPreview',
              path: 'MarkdownPreview',
              showName: 'Markdown文档预览组件',
              menuType: 'view',
              icon: 'log',
              cacheType: 'none',
              viewComponentName: 'MarkdownUrl',
              viewProps: { 'url': '/docs/components/view/MarkdownPreview.md' },
              openType: 'inner'
            }
          ]
        }
      ]
    },
    {
      name: 'Js-Libs',
      path: '/Js-Libs',
      showName: 'Js公共库',
      menuType: 'main',
      icon: 'el-icon-files',
      children: [
        {
          name: 'Plugins',
          path: 'Plugins',
          showName: '公共插件',
          menuType: 'view',
          icon: 'el-icon-element-plus',
          cacheType: 'single',
          viewComponentName: 'MarkdownUrl',
          viewProps: { 'url': '/docs/js-libs/plugins.md' },
          openType: 'inner'
        }
      ]
    },
    {
      name: 'Example',
      path: '/Example',
      showName: '示例',
      menuType: 'main',
      icon: 'el-icon-platform',
      children: [
        {
          name: 'IconsDemo',
          path: 'IconsDemo',
          showName: 'Icons示例',
          menuType: 'view',
          icon: 'el-icon-picture-rounded',
          cacheType: 'none',
          viewComponentName: 'Icons',
          openType: 'inner'
        }
      ]
    }
  ],
  rightMenus: [
    {
      name: 'TopMenusSearch',
      path: '/TopMenusSearch',
      showType: 'component',
      hidden: false,
      toolTip: 'Search Menus',
      component: 'header-search',
      menuType: 'null'
    },
    {
      name: 'TopScreenfull',
      path: '/TopScreenfull',
      showType: 'component',
      toolTip: 'Switch Full Screen',
      component: 'screenfull',
      menuType: 'null'
    },
    {
      name: 'TopSizeSelect',
      path: '/TopSizeSelect',
      showType: 'component',
      toolTip: 'Switch Size',
      component: 'size-select',
      menuType: 'null',
      dropDownTrigger: 'click'
    },
    {
      name: 'TopLangSelect',
      path: '/TopLangSelect',
      showType: 'component',
      toolTip: 'Change Language',
      component: 'lang-select',
      menuType: 'null',
      dropDownTrigger: 'click'
    },
    {
      name: 'TopAvatar',
      path: '/TopAvatar',
      showType: 'component',
      component: 'avatar',
      componentProps: { dropDownIcon: true },
      menuType: 'main',
      dropDownTrigger: 'hover',
      // 特殊处理，区分
      children: [
        {
          name: 'LayoutSetting',
          path: 'LayoutSetting',
          showName: 'Layout Setting',
          showType: 'icon',
          toolTip: 'Top Test Icon with tooltip',
          menuType: 'embed',
          icon: 'el-icon-grid',
          embedAction: 'showHideLayoutSettings',
          embedPara: { show: true }
        }
      ]
    }
  ],
  fixedTags: [
    {
      name: 'Home',
      showName: 'Home',
      icon: 'el-icon-home-filled',
      tagType: 'view',
      routerPath: '/home',
      viewComponentName: 'Home'
    }
  ]
};
