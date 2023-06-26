/**
 * 关联字段的扩展校验规则
 */
const jp = require('jsonpath');
import { getI18n } from '@/utils/base/global';
import { isNumber } from '@/utils/base/NumberTools';

/**
 * 计算表达式值
 * @param {JSON} formData - 获取替换值的Json对象
 * @param {String} expression - 含有jsonpath参数的表达式对象, 例如 '{$.aaa} + 10'
 * @returns {Number} - 返回计算值
 */
const computeExpression = (formData, expression) => {
  if (isNumber(expression)) {
    // 直接就是数值
    return expression;
  }

  // 进行表达式的值替换
  const valExp = expression.replace(/\{.*?\}/g, function(matchStr) {
    // 替换找到的值
    const val = jp.value(formData, matchStr.substring(1, matchStr.length - 1));
    return val;
  });

  // 执行表达式
  return eval(valExp);
};

/**
 * 多栏位数值表达式校验
 * @param {JSON} rule - 校验规则
 *   extendName {string} 固定为relationExpression
 *   currentInstance {Object} 送入组件的this对象
 *     注意: 校验规则需要在mounted进行设置, 不能直接在data中设置
 *   formDataKey {string} 传入校验数据的JSON对象在currentInstance中可获取的key标识, 例如'EditFormData'
 *   expression {string} - 要校验的计算表达式, 例如 '{$.input1} + {$.obj.subInput} + {$.obj[1]}'
 *     表达式中通过 {jsonpath} 来获取 formData 中 jsonpath 所指定的对象的值
 *   minExp {string|number} - 最小值表达式, 如果是数值代表无需计算
 *   maxExp {string|number} - 最大值表达式, 如果是数值代表无需计算
 *   equalExp {string|number} - 相等表达式, 如果是数值代表无需计算
 * @param {*} value
 * @param {*} callback
 * @param {*} source
 * @param {*} options
 */
const relationExpression = async(rule, value, callback, source, options) => {
  const _i18n = getI18n();
  try {
    const formData = rule.currentInstance[rule.formDataKey];
    const valExp = computeExpression(formData, rule.expression);
    if (rule.equalExp) {
      // 进行等式计算
      if (valExp !== computeExpression(formData, rule.equalExp)) {
        throw new Error(_i18n.t(
          'validateRules.relation.ExpressionNotEqual', { expression: rule.expression, equalExp: rule.equalExp }
        ));
      }
    }

    let isError = false;
    if (rule.minExp) {
      const valMin = computeExpression(formData, rule.minExp);
      if (valExp < valMin) {
        isError = true;
      } else if (rule.maxExp) {
        const valMax = computeExpression(formData, rule.maxExp);
        if (valExp > valMax) {
          isError = true;
        }
      }
    }

    if (isError) {
      if (rule.minExp && rule.maxExp) {
        throw new Error(_i18n.t(
          'validateRules.relation.ExpressionBetween', { expression: rule.expression, minExp: rule.minExp, maxExp: rule.maxExp }
        ));
      } else if (rule.minExp) {
        throw new Error(_i18n.t(
          'validateRules.relation.ExpressionGreater', { expression: rule.expression, minExp: rule.minExp }
        ));
      } else {
        throw new Error(_i18n.t(
          'validateRules.relation.ExpressionLess', { expression: rule.expression, maxExp: rule.maxExp }
        ));
      }
    }
  } catch (error) {
    // 计算出现异常
    throw new Error(_i18n.t(
      'validateRules.relation.ExpressionException', { error: error.message }
    ));
  }
};

export default {
  /**
   * 多栏位数值表达式校验
   * @param {JSON} rule - 校验规则
   *   extendName {string} 固定为relationExpression
   *   currentInstance {Object} 送入组件的this对象
   *     注意: 校验规则需要在mounted进行设置, 不能直接在data中设置
   *   formDataKey {string} 传入校验数据的JSON对象在currentInstance中可获取的key标识, 例如'EditFormData'
   *   expression {string} - 要校验的计算表达式, 例如 '{$.input1} + {$.obj.subInput} + {$.obj[1]}'
   *     表达式中通过 {jsonpath} 来获取 formData 中 jsonpath 所指定的对象的值
   *   minExp {string|number} - 最小值表达式, 如果是数值代表无需计算
   *   maxExp {string|number} - 最大值表达式, 如果是数值代表无需计算
   *   equalExp {string|number} - 相等表达式, 如果是数值代表无需计算
   */
  relationExpression: {
    isPromise: true,
    func: relationExpression
  }
};
