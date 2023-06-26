/**
 * 提供网络相关操作函数封装
 */

/**
 * 异步获取远程url文件的文本内容
 * @param {string} url - 文件的url路径
 * @param {function} callback - 成功时回调函数, 格式为callback(text), 传入参数为文件内容
 * @param {function} error_call - 异常时回调函数, 格式为error_call(errorInfo), 传入参数为异常信息
 * @param {function} finally_call - 最终执行的回调函数, 格式为finally_call()
 */
export async function getUrlFileContent(url, callback, error_call, finally_call) {
  try {
    const fetchResponse = await fetch(url);
    fetchResponse.text().then(text => {
      callback(text);
    }).catch(errorInfo => {
      if (error_call !== undefined && error_call !== null) {
        error_call(errorInfo);
      }
    }).finally(() => {
      if (finally_call !== undefined && finally_call !== null) {
        finally_call();
      }
    });
  } catch (errorInfo) {
    if (error_call !== undefined && error_call !== null) {
      error_call(errorInfo);
    }
  } finally {
    if (finally_call !== undefined && finally_call !== null) {
      finally_call();
    }
  }
}

/**
 * 判断路径是内部路径还是外部路径
 * @param {string} path
 * @returns {Boolean} - 内部url返回false，外部url返回true
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

export default {
  /**
   * 异步获取远程url文件的文本内容
   * @param {string} url - 文件的url路径
   * @param {function} callback - 成功时回调函数, 格式为callback(text), 传入参数为文件内容
   * @param {function} error_call - 异常时回调函数, 格式为error_call(errorInfo), 传入参数为异常信息
   * @param {function} finally_call - 最终执行的回调函数, 格式为finally_call()
   */
  getUrlFileContent: getUrlFileContent,

  /**
   * 判断路径是内部路径还是外部路径
   * @param {string} path
   * @returns {Boolean} - 内部url返回false，外部url返回true
   */
  isExternal
};
