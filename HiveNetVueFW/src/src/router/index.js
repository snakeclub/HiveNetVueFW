/** 静态路由配置 */

import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/components/view/layout';
import CachedIframeRouter from '@/components/global/CachedIframeRouter';
import LayoutRefresh from '@/components/global/LayoutRefresh';
import Edit from '@/views/template/edit';

/**
 * 路由配置特殊说明
 *
 * meta : {
 *  title: '',  // 路由页面标题（如果路由为Layout主页的页签，页签标题）
 *  icon: '', // 路由页面图标（如果路由为Layout主页的页签，则为页签图标），图标可以指定为“src/assets/icons/svg”目录下的图标文件名，可以为“el-icon-”开头的element+图标，也可以为"http://xxx.xxx.xxx/xx.svg"的网络图标
 *  isWhiteList: false, // 指定路由是否白名单（无需登录处理）
 *  isLayoutTag: true, // 指定是否主框架页签路由（如果是需要完整获取用户信息，否则只要加载自身的会话路由即可）
 *  refreshRoute: { path: '', query: '' }, // 指定路由遇到刷新时要使用的url
 *
 *  // 以下为仅Layout主页的页签使用的配置参数
 *  isFixed: false, // 指示该路由页签是否固定页签
 *  isCachedIframe: false, // 指示该路由页签是否可缓存内容的iframe页签
 *  refresh: false, // 指示当次路由页签渲染是否需刷新页面
 *  componentName: '', // 指定当前路由对应页签的组件名
 *  cacheType: 'none', // 指定当前路由页面的缓存方式，none-不缓存（默认），single-单页缓存（使用keepalive，同一个页面不支持打开多个），mutiple-多页缓存
 *  type: '', // 指定当前路由来源类型，fixedTag-固定页签、sidebar-左侧菜单、right-右上角菜单
 *  cachedName: '', // 指定路由使用的缓存组件名(cacheType为mutiple时使用，为动态生成的组件名，实际组件模版为CacheView)
 *  props: {}, // 指定路由所展示组件的传参
 * }
 */

// 公共路由
export const constantRoutes = [
  /**
   * 公共的静态页面路由
   */
  // 主界面
  {
    path: '/',
    component: Layout
  },
  // 错误页面路由
  {
    path: '/404',
    component: () => import('@/components/view/error/404')
  },
  {
    path: '/401',
    component: () => import('@/components/view/error/401')
  },
  {
    path: '/500',
    component: () => import('@/components/view/error/500')
  },

  /**
   * 框架支持必须配置的路由
   */
  // iframe页签路由
  {
    path: '/layout',
    component: Layout,
    children: [
      {
        path: 'iframe',
        component: CachedIframeRouter
      }
    ]
  },
  // 刷新layout主框架页面的组件路由
  {
    path: '/LayoutRefresh',
    component: LayoutRefresh
  },

  /**
   * 业务相关页面
   */
  // 登录页面
  {
    path: '/login',
    component: () => import('@/views/AuthCenter/login.vue')
  },
  //
  {
    path: '/register',
    component: () => import('@/views/AuthCenter/register.vue')
  },
  // 用于测试的路由
  {
    path: '/TestInnerUrl',
    component: Edit
  },
  {
    path: '/layout',
    component: Layout,
    children: [
      {
        path: '/TestLayoutInnerUrl',
        component: Edit
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior: (to, from, savedPosition) => {
    // 路由保存滚动条位置
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  routes: constantRoutes
});

export default router;
