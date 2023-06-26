/**
 * 主页相关集成动作
 */
import store from '@/store';

/**
 * 显示/隐藏主页风格设置框
 * @param {string} embedAction - 不处理，默认传入'showHideLayoutSettings'
 * @param {JSON} embedPara - 传入是否显示信息，格式为:
 *   {
 *     show: true, // 是否显示，可送入false因此设置框
 *   }
 * @param {bool} autoShowError - 不处理，是否显示错误信息
 * @returns {JSON} - 返回执行结果: {success: true/false, data: data}
 */
function showHideLayoutSettings(embedAction, embedPara, autoShowError) {
  store.dispatch('layoutSettings/changeSetting', {
    'showLayoutSettings': embedPara.show === undefined ? true : embedPara.show
  });
  return { success: true, data: {}};
}

export default {
  'showHideLayoutSettings': { func: showHideLayoutSettings, isPromise: false }
};
