/**
 * 菜单相关集成动作
 */
import store from '@/store';
import menuActions from '@/utils/actions/menu';

/**
 * 点击指定菜单
 * @param {string} embedAction - 不处理，默认传入'clickMenu'
 * @param {JSON} embedPara - 传入要点击的菜单信息，格式为:
 *   {
 *     type: 'sidebar/right', // 左边菜单还是右上角菜单
 *     name: 'xxx', // 要执行的菜单名(与namePath传其中一个即可)
 *     namePath: 'xx/xx/xx', // 菜单的名字路径索引，'parentName/myName' 样式的逐层索引(与name传其中一个即可)
 *   }
 * @param {bool} autoShowError - 不处理，是否显示错误信息
 * @returns {JSON} - 返回执行结果: {success: true/false, data: null}
 */
function clickMenu(embedAction, embedPara, autoShowError) {
  // 获取菜单的名字路径索引
  let namePath = embedPara.namePath;
  if (namePath === undefined) {
    const menuIndex = embedPara.type === 'sidebar' ? store.getters.sidebarMenusIndex : store.getters.rightMenusIndex;
    namePath = menuIndex.byName[embedPara.name].namePath;
  }

  // 执行菜单
  return new Promise((resolve, reject) => {
    menuActions.clickMenu(embedPara.type, namePath).then(() => {
      // 执行成功
      resolve({ success: true, data: null });
    }).catch(errorInfo => {
      reject({ success: false, error: errorInfo });
    });
  });
}

export default {
  'clickMenu': { func: clickMenu, isPromise: true }
};
