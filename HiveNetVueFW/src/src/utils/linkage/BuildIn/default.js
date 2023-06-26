/**
 * 默认的关联支持函数
 */
import StringTools from '@/utils/base/StringTools';

/**
 * 填入固定值
 */
async function fixed(currentInstance, rule, newVal, oldVal, dataPrefix) {
  return rule.fixedValue;
}

/**
 * 填入关联字段的相同值
 */
async function equal(currentInstance, rule, newVal, oldVal, dataPrefix) {
  if (StringTools.isString(rule.watchField)) {
    // 单个监控目标, 直接返回新值即可
    return newVal;
  } else {
    // 多个监控目标, 检查是哪个值发生了变化
    for (const field in newVal) {
      if (newVal[field] !== oldVal[field]) {
        // 找到差异
        return newVal[field];
      }
    }

    // 找不到差异, 不处理联动
    throw new Error('');
  }
}

export default {
  // 填入固定值
  'fixed': {
    func: fixed,
    isPromise: true
  },

  // 填入关联字段的相同值
  'equal': {
    func: equal,
    isPromise: true
  }
};
