/**
 * 在JS文件获取全局对象
 */
import { toRaw } from '@vue/reactivity';
import router from '@/router';
import store from '@/store';
import appObj from '@/main';
import Layout from '@/components/view/layout/index'; // 首页主框架组件

/**
 * 获取i18n对象
 * 示例:
 *   const i18n = getI18n();
 *   i18n.t('xxx');
 *   const lang = i18n.locale;
 */
export const getI18n = () => toRaw(appObj._instance.proxy).$i18n;

/**
 * 获取this.$store对象
 */
export const getStore = () => store;

/**
 * 获取this.$router对象
 */
export const getRouter = () => router;
// export const getRouter = () => appObj._context.config.globalProperties.$router;

/**
 * 获取this.$route对象
 */
export const getRoute = () => appObj._context.config.globalProperties.$route;

/**
 * 获取this对象
 */
export const getThis = () => appObj._context.config.globalProperties;

/**
 * 获取app的proxy对象
 * 示例；
 *   const appProxy = getAppProxy();
 *   const i18n = appProxy.$i18n;
 *   appProxy.$t('xxx');
 */
export const getAppProxy = () => toRaw(appObj._instance.proxy);

/**
 * 将组件注册为全局组件
 * @param {string} name - 注册组件名
 * @param {Object} component - 组件对象
 * @returns
 */
export const regGlobalComponent = (name, component) => appObj.component(name, component);

/**
 * 判断组件是否已注册
 * @param {string} name - 组件名
 * @returns {bool} - 是否已注册
 */
export const hasGlobalComponent = (name) => appObj._context.components[name] !== undefined;

/**
 * 获取全局注册组件
 * @param {string} name - 组件名
 * @returns {Object} - 组件对象
 */
export const getGlobalComponent = (name) => appObj._context.components[name];

/**
 * 复制指定组件注册为新组件
 * 注意：该复制不会包含style内容
 * @param {string} name - 新组件名
 * @param {string} copyName - 要复制的组件名
 */
export const copyGlobalComponent = (name, copyName) => {
  if (!hasGlobalComponent(name)) {
    const component = getGlobalComponent(copyName);
    const newComponent = {
      extends: component
    };
    newComponent.name = name; // 需要修改控件名，否则获取到的控件名为undefined
    regGlobalComponent(name, newComponent);
  }
};

/**
 * 删除指定的注册组件
 * @param {string} name - 要删除的组件名
 */
export const delGlobalComponent = (name) => {
  if (hasGlobalComponent(name)) {
    delete appObj._context.components[name];
  }
};

/**
 * 添加layout主框架的动态路由（动态生成组件）
 * @param {JSON} info - 路由信息
 *   name {string} - 路由名，该路由名后续将用于删除路由
 *   path {string} - 路由访问路径
 *   query {JSON} - 路由的query参数
 *   params {JSON} - 路由的params参数
 *   props {string} -
 *   meta {JSON} - 路由的meta
 *   componentName {string} - 路由打开的动态组件名
 *   copyComponentName {string} - 要复制的组件名
 */
export const addLayoutDynamicRouter = (info) => {
  // 判断路由是否存在
  if (router.hasRoute(info.name)) return;

  // 处理路由路径
  const pathIndex = info.path.split('/');
  let parentPath = ''; // 一级菜单路径
  let path = ''; // 二级菜单路径
  if (pathIndex.length === 1) {
    path = pathIndex[0];
  } else {
    path = pathIndex[pathIndex.length - 1];
    pathIndex.pop(pathIndex.length - 1);
    parentPath = pathIndex.join('/');
  }

  // 生成路由对象
  const routerItem = {
    name: info.name,
    path: parentPath, // 访问路径
    component: Layout
  };
  let viewProps = info.props === undefined ? {} : info.props;
  if (viewProps.passProps === undefined) {
    // 改为标准的passProps模式传递
    viewProps = { passProps: viewProps };
  }
  copyGlobalComponent(info.componentName, info.copyComponentName); // 动态创建组件
  const childrenItem = {
    path: path,
    component: getGlobalComponent(info.componentName),
    props: viewProps,
    meta: info.meta
  };
  if (info.params !== undefined) {
    childrenItem.params = info.params;
  }
  if (info.query !== undefined) {
    childrenItem.query = info.query;
  }

  routerItem.children = [
    childrenItem
  ];

  // 动态添加到路由中
  router.addRoute(routerItem);
};

/**
 * 删除layout主框架的动态路由（同时删除动态组件）
 * @param {string} routerName - 路由名
 * @param {string} componentName - 要删除的组件名
 */
export const delLayoutDynamicRouter = (routerName, componentName) => {
  if (router.hasRoute(routerName)) {
    // 先删除路由
    router.removeRoute(routerName);

    // 删除动态组件
    if (componentName) {
      delGlobalComponent(componentName);
    }
  }
};
