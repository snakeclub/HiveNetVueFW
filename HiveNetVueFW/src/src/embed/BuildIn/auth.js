/**
 * 鉴权相关动作
 */
import { getThis, getI18n } from '@/utils/base/global';
import authActions from '@/utils/actions/auth';

/**
 * 退出登录
 * @param {string} embedAction - 不处理，默认传入'logout'
 * @param {JSON} embedPara - 登出参数，格式为：
 *   {
 *     confirm: true, // 是否弹出提示信息
 *     redirectType: 'auto', // 退出登录以后跳转方式
 *       // auto - 根据应用配置自动跳转(默认)
 *       // no - 不做任何动作
 *       // refresh - 刷新当前页面
 *       // goto - 跳转到redirect指定的url地址
 *       // resetUser - 重新获取用户信息(菜单/权限)
 *     redirect: '/' // 指定要跳转的地址, redirectType为auto和goto时有效
 *   }
 * @param {bool} autoShowError - 不处理，是否显示错误信息
 * @returns {JSON} - 返回执行结果: {success: true/false, data: data}
 */
async function logout(embedAction, embedPara, autoShowError) {
  const confirm = embedPara.confirm || true;
  if (confirm) {
    // 提示后再登出
    try {
      const i18n = getI18n();
      await getThis().$confirm(i18n.t('Are you sure to logout?'), i18n.t('Tips'), {
        confirmButtonText: i18n.t('OK'),
        cancelButtonText: i18n.t('Cancel'),
        type: 'warning'
      });
    } catch (error) {
      // 选择了取消
      return { success: true, data: {}};
    }
  }

  // 登出
  await authActions.logout(embedPara.redirectType, embedPara.redirect);
  return { success: true, data: {}};
}

/**
 * 显示登录对话框
 * 注: 打开对话框的页面必须引入LoginForm组件，或将LoginForm设置为全局组件
 * @param {string} embedAction - 不处理，默认传入'showLoginDialog'
 * @param {JSON} embedPara - 无参数
 * @param {bool} autoShowError - 不处理，是否显示错误信息
 * @returns {JSON} - 返回执行结果: {success: true/false, data: data}
 */
function showLoginDialog(embedAction, embedPara, autoShowError) {
  getThis().$dialog.show(
    'LoginForm', {
      dialogProps: {
        dialogStyle: {
          '--el-dialog-padding-primary': '0px'
        }
      },
      subComponentProps: {
        isDailog: true
      }
    }
  );
  return { success: true, data: {}};
}

/**
 * 显示修改密码对话框
 * 注: 打开对话框的页面必须引入ChangePwdForm组件，或将ChangePwdForm设置为全局组件
 * @param {string} embedAction - 不处理，默认传入'showChangePwdDialog'
 * @param {JSON} embedPara - 无参数
 * @param {bool} autoShowError - 不处理，是否显示错误信息
 * @returns {JSON} - 返回执行结果: {success: true/false, data: data}
 */
function showChangePwdDialog(embedAction, embedPara, autoShowError) {
  getThis().$dialog.show(
    'ChangePwdForm', {
      dialogProps: {
        dialogStyle: {
          '--el-dialog-padding-primary': '0px'
        }
      },
      subComponentProps: {
        isDailog: true
      }
    }
  );
  return { success: true, data: {}};
}

/**
 * 显示注册对话框
 * 注: 打开对话框的页面必须引入RegisterForm组件，或将RegisterForm设置为全局组件
 * @param {string} embedAction - 不处理，默认传入'showRegisterDialog'
 * @param {JSON} embedPara - 无参数
 * @param {bool} autoShowError - 不处理，是否显示错误信息
 * @returns {JSON} - 返回执行结果: {success: true/false, data: data}
 */
function showRegisterDialog(embedAction, embedPara, autoShowError) {
  getThis().$dialog.show(
    'RegisterForm', {
      dialogProps: {
        dialogStyle: {
          '--el-dialog-padding-primary': '0px'
        }
      },
      subComponentProps: {
        isDailog: true
      }
    }
  );
  return { success: true, data: {}};
}

export default {
  'logout': { func: logout, isPromise: true },
  'showLoginDialog': { func: showLoginDialog, isPromise: false },
  'showChangePwdDialog': { func: showChangePwdDialog, isPromise: false },
  'showRegisterDialog': { func: showRegisterDialog, isPromise: false }
};
