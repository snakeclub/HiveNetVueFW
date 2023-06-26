/**
 * 通用集成动作
 */
import { getThis } from '@/utils/base/global';

/**
 * 执行js代码
 * @param {string} embedAction - 不处理，默认传入'runJsCode'
 * @param {JSON} embedPara - 传入要执行的代码，格式为：{ code: '...' }
 * @param {bool} autoShowError - 不处理，是否显示错误信息
 * @returns {JSON} - 返回执行结果: {success: true/false, data: data}
 */
function runJsCode(embedAction, embedPara, autoShowError) {
  // 支持外部使用的变量
  const globalObj = {
    this: getThis()
  };
  const func = new Function('globalObj', embedPara.code);
  const resData = func(globalObj);
  return { success: true, data: resData };
}

export default {
  'runJsCode': { func: runJsCode, isPromise: false }
};
