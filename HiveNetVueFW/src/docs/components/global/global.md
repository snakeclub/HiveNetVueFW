# 全局加载组件

框架将自动注册 @/components/global 目录下的所有组件，这些组件可以直接在各个Vue页面中使用，无需单独引入。

## 可供开发使用组件

### SvgIcon

SvgIcon组件，用于显示 assets/icons/svg 下的图标，同时集成了 element-plus 的图标。

该组件的使用方法可以参考 [icon图标使用](/sys-portal/Development/Icon)

## 框架内部使用组件

### redirect

页面重定向组件。

## CachedIframe

可缓存的iframe展示组件，主要用于Layout框架中的页签展示iframe。该组件支持iframe页面状态进行缓存，在切换页签的情况下不重新加载iframe页面（实际上是通过隐藏iframe页面的原理来保留状态）。

该组件主要由框架自身使用，开发页面无需考虑使用该组件。

### CachedIframeRouter

缓存Iframe的路由控制组件，主要用于Layout框架中控制iframe也看的路由设置。

该组件主要由框架自身使用，有几个配置有关联关系，如果需要自行修改配置，要把相关配置保持一致：

1、静态路由配置 src/router/index.js 需要配置

```javascript
import CachedIframeRouter from '@/components/global/CachedIframeRouter';
...

export const constantRoutes = [
    ...
    // iframe页签路由, 用于通过url连接进行跳转处理
    {
        path: '/layout',
        component: Layout,
        children: [
        {
            path: 'iframe',
            component: CachedIframeRouter
        }
    },
    ...
];
```

2、主配置 src/settings.js 要设置与静态路由相对的访问路径

```javascript
...

module.exports = {
    app: {
        ...
        // 可缓存的iframe的路由路径
        cachedIframePath: '/layout/iframe',
        ...
    },
    ...
};
```

### CacheView

可缓存页签页面组件，通过 keep-alive 保障单个页面可被缓存，该组件主要由框架自身使用，开发页面无需考虑使用该组件。

### LayoutRefresh

刷新Layout页面的组件，针对新打开Layout页面或在当前页面刷新整个Layout的情况进行特殊处理。

该组件主要由框架自身使用，有几个配置有关联关系，如果需要自行修改配置，要把相关配置保持一致：

1、静态路由配置 src/router/index.js 需要配置

```javascript
import LayoutRefresh from '@/components/global/LayoutRefresh';
...

export const constantRoutes = [
    ...

    // 刷新layout主框架页面的组件路由
    {
        path: '/LayoutRefresh',
        component: LayoutRefresh
    },
    ...
];
```

2、主配置 src/settings.js 要设置与静态路由相对的访问路径

```javascript
...

module.exports = {
    app: {
        ...
        // 主页框架刷新的路由路径
        layoutRefreshPath: '/LayoutRefresh',
        ...
    },
    ...
};
```