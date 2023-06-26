/**
 * 菜单相关方法
 */
import settings from '@/settings';
import store from '@/store';
import modal from '@/plugins/modal';
import { getI18n, getRouter } from '@/utils/base/global';
import callEmbed from '@/embed';
import { openViewInner, openLinkInner, openBlank, openRefresh } from './PageAction';
import { closeAllTags, getTagByItemInfo } from '@/utils/actions/TagsViewFuns';

const menuActions = {
  /**
   * 获取可点击的菜单对象
   *
   * @param {string} menuType - 菜单类型: sidebar-左侧主菜单, right-右上角菜单
   * @param {string} namePath - 菜单的名字路径索引，'parentName/myName' 样式的逐层索引
   * @returns {JSON} - 返回的菜单对象
   * @throws Error('menu item not exists') - 菜单项不存在的时候抛出该异常
   */
  getMenuItem: (menuType, namePath) => {
    const menus = menuType !== 'right' ? store.getters.sidebarMenusIndex : store.getters.rightMenusIndex;
    const menuItem = menus.byNamePath[namePath];
    if (menuItem === undefined) {
      throw new Error('menu item not exists');
    } else {
      return menuItem;
    }
  },

  /**
   * 运行可点击菜单
   *
   # @param {string} menuType - 菜单类型: sidebar-左侧主菜单, right-右上角菜单
   * @param {string} namePath - 菜单的名字路径索引，'parentName/myName' 样式的逐层索引
   * @returns {Promise} - 返回Promise异步对象
   *   then - 成功不会返回数据
   *   catch - 失败返回 error 对象
   *     Error('menu item not exists') - 菜单项不存在的时候抛出该异常
   *     Error('the menu is hidden status') - 菜单项隐藏状态的时候抛出该异常
   *     Error('the menu is disabled status') - 菜单项禁用状态的时候抛出该异常
   *     Error('the menu is main menu') - 菜单项为主菜单的时候抛出该异常
   */
  runMenuAction: (menuType, namePath) => {
    // 获取菜单项并执行
    try {
      const menuItem = menuActions.getMenuItem(menuType, namePath);
      return menuActions.runMenuActionByItem(menuItem);
    } catch (error) {
      return new Promise((resolve, reject) => { reject(error); });
    }
  },

  /**
   * 通过菜单对象运行可点击菜单
   * @param {JSON} menuItem - 要执行的菜单对象
   * @returns {Promise} - 返回Promise异步对象
   *   then - 成功不会返回数据
   *   catch - 失败返回 error 对象
   *     Error('the menu is hidden status') - 菜单项隐藏状态的时候抛出该异常
   *     Error('the menu is disabled status') - 菜单项禁用状态的时候抛出该异常
   *     Error('the menu is main menu') - 菜单项为主菜单的时候抛出该异常
   */
  runMenuActionByItem: async(menuItem) => {
    const i18n = getI18n();
    try {
      // 检查是否可执行
      if (menuItem.menuType === 'main') {
        throw new Error('the menu is main menu');
      } else if (menuItem.realHidden) {
        throw new Error('the menu is hidden status');
      } else if (menuItem.realDisabled) {
        throw new Error('the menu is disabled status');
      }

      // 根据菜单类型不同执行菜单(待补充)
      if (menuItem.menuType === 'view') {
        const router = getRouter();
        if (menuItem.openType === 'refresh') {
          // 在当前窗口刷新页面
          if (menuItem.meta.isLayoutTag) {
            // 打开包含框架的页面
            router.push({
              path: settings.app.layoutRefreshPath,
              query: { type: menuItem.meta.type, namePath: menuItem.namePath }
            });
          } else {
            // 直接打开组件
            router.push({
              path: menuItem.routerPath,
              query: menuItem.viewQuery
            });
          }
        } else if (menuItem.openType === 'blank') {
          // 新窗口打开
          let urlInfo;
          if (menuItem.meta.isLayoutTag) {
            // 打开框架页面
            urlInfo = {
              url: settings.app.layoutRefreshPath,
              query: { type: menuItem.meta.type, namePath: menuItem.namePath }
            };
          } else {
            // 直接打开新的视图
            urlInfo = {
              url: menuItem.routerPath,
              query: menuItem.viewQuery
            };
          }
          openBlank(urlInfo, menuItem.blankSpecs, menuItem.blankExtendScreen);
        } else {
          // inner窗口打开视图页面
          const viewInfo = {
            path: menuItem.routerPath,
            query: menuItem.viewQuery,
            meta: menuItem.meta
          };
          openViewInner(viewInfo);
        }
      } else if (menuItem.menuType === 'link') {
        // 打开链接
        if (menuItem.openType === 'blank') {
          // 在新窗口打开链接
          openBlank({ url: menuItem.url }, menuItem.blankSpecs, menuItem.blankExtendScreen);
        } else if (menuItem.openType === 'refresh') {
          // 刷新当前页面，先关闭所有页签，再跳转到指定页面
          closeAllTags(true);
          openRefresh({ url: menuItem.url });
        } else {
          // 在内部框架打开url
          openLinkInner(menuItem.url, { meta: menuItem.meta });
        }
      } else if (menuItem.menuType === 'fixedTag') {
        // 切换到固定页签
        const fixedTag = getTagByItemInfo('fixedTag', menuItem.fixedTagName);
        if (fixedTag) {
          const router = getRouter();
          router.push({ path: fixedTag.path, query: fixedTag.query });
        } else {
          throw new Error(i18n.t('fixed tag not exist') + ': ' + menuItem.fixedTagName);
        }
      } else if (menuItem.menuType === 'jsCode') {
        // 执行JS代码
        let res;
        try {
          res = await callEmbed('runJsCode', { code: menuItem.code }, false);
        } catch (callError) {
          // 执行出现异常
          res = callError;
        }
        if (!res.success) {
          // 处理失败
          if (res.error) {
            throw new Error(i18n.t('run js code') + ' ' + i18n.t('error') + ': ' + res.error.message);
          } else {
            throw new Error(i18n.t('run js code') + ' ' + i18n.t('failure') + ': ' + JSON.stringify(res.data));
          }
        }
      } else if (menuItem.menuType === 'embed') {
        // 执行集成动作
        try {
          // 错误提示由内部执行动作自行处理
          await callEmbed(menuItem.embedAction, menuItem.embedPara, true);
        } catch (callError) {
          // 执行出现异常也当成执行成功
        }
      } else {
        modal.message(menuItem.namePath);
      }
      // 执行成功
      return new Promise((resolve, reject) => { resolve(); });
    } catch (error) {
      return new Promise((resolve, reject) => { reject(error); });
    }
  },

  /**
   * 设置当前激活的左侧菜单
   * @param {JSON} menuItem - 要激活的菜单对象
   */
  setActiveMenu: (menuItem) => {
    if (!store.state.layoutSettings.topNav) {
      // 只有左侧菜单
      store.commit('app/SET_ACTIVE_MENU', { activeSidebarMenu: menuItem.name });
    } else {
      // 有顶部菜单和左侧菜单
      const nameIndex = menuItem.namePath.split('/');
      if (nameIndex.length === 1) {
        // 1级菜单，且为主菜单时，才激活顶端
        if (menuItem.menuType === 'main') {
          store.commit('app/SET_ACTIVE_MENU', { activeTopNavMenu: menuItem.name });
        }
      } else {
        store.commit('app/SET_ACTIVE_MENU', {
          activeTopNavMenu: nameIndex[0],
          activeSidebarMenu: menuItem.name
        });
      }
    }
  },

  /**
   * 点击置顶菜单(模拟点击)
   * @param {string} menuType - 菜单类型: sidebar-左侧主菜单, right-右上角菜单
   * @param {string} namePath - 菜单的名字路径索引，'parentName/myName' 样式的逐层索引
   * @returns {Promise} - 异步执行菜单点击动作
   */
  clickMenu: (menuType, namePath) => {
    const i18n = getI18n();
    try {
      // 获取菜单项
      const menuItem = menuActions.getMenuItem(menuType, namePath);

      // 执行菜单
      return menuActions.runMenuActionByItem(menuItem).then(() => {
        // 进行成功提示
        if (menuItem.successTip && menuItem.successTip !== '') {
          modal.messageSuccess(i18n.t(menuItem.successTip));
        }
      }).catch((errorInfo) => {
        // 失败提示
        modal.messageError(i18n.t(errorInfo.message));
      });
    } catch (error) {
      modal.messageError(i18n.t(error.message));
      return new Promise((resolve, reject) => { reject(error); });
    }
  }
};

export default menuActions;
