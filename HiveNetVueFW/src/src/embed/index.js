/**
 * 内部集成的公共动作
 */
import { getThis, getI18n } from '@/utils/base/global';

/**
 * 内部集成动作配置
 * key 为 embedAction（动作名）
 * value 为 {func: 动作函数对象, isPromise: true/false}
 *   isPromise - 是否返回 Promise 对象，如果是，则必须与 callEmbed 返回的结果格式一致，并自行处理 autoShowError 的动作
 *   func - 动作函数 function (embedAction, embedPara, autoShowError) {...}
 *     同步函数返回值为正常返回 {success: true/false, data: data} 或异常返回 {success: false, error: error}
 */
let embedConfig = {};
const embedConfigJsFiles = require.context('./BuildIn/', false, /([A-Z]|[a-z])\w+\.js$/);
embedConfigJsFiles.keys().forEach(fileName => {
  embedConfig = Object.assign(embedConfig, embedConfigJsFiles(fileName).default);
});

/**
 * 调用集成动作
 * @param {string} embedAction - 集成动作名
 * @param {JSON} embedPara - 动作参数对象
 * @param {bool} autoShowError=true - 是否自动显示执行异常(返回data的情况用warning方式提示)
 * @returns {Promise} - 返回异步Promise对象
 *   then 结果为 {success: true, data: data} 或 {success: false, data: data}
 *   catch 结果为 {success: false, error: error}
 */
export default function callEmbed(embedAction, embedPara, autoShowError = true) {
  console.debug('call embed ' + embedAction);
  const cThis = getThis();
  const i18n = getI18n();
  const tips = i18n.t('run embed ') + '"' + embedAction + '"[' + (embedPara === undefined ? '' : JSON.stringify(embedPara)) + ']';
  const config = embedConfig[embedAction];

  if (config === undefined) {
    // 动作函数不存在
    const errorInfo = i18n.t('action not exists');
    if (autoShowError) {
      cThis.$modal.messageError(tips + errorInfo);
    }
    return new Promise((resolve, reject) => { reject({ success: false, error: errorInfo }); });
  }

  if (config.isPromise) {
    // 动作函数按 Promise 方式返回
    return config.func(embedAction, embedPara, autoShowError);
  } else {
    // 动作函数是正常同步函数
    return new Promise((resolve, reject) => {
      try {
        const res = config.func(embedAction, embedPara, autoShowError);
        if (autoShowError && !res.success) {
          if (res.error) {
            // 异常情况
            cThis.$modal.messageError(tips + ' ' + i18n.t('error') + ': ' + res.error.message);
          } else {
            // 失败情况，警告方式
            cThis.$modal.messageWarning(tips + ' ' + i18n.t('failure') + ': ' + JSON.stringify(res.data));
          }
        }
        resolve(res);
      } catch (error) {
        if (autoShowError) {
          cThis.$modal.messageError(tips + ' ' + i18n.t('error') + ': ' + error.message);
        }
        reject({ success: false, error: error });
      }
    });
  }
}
