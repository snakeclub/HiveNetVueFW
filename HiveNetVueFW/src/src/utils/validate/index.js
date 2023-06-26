/**
 * 内部集成的扩展校验支持
 */
import WebTools from '@/utils/base/WebTools';
import Schema from 'async-validator';
import { getI18n } from '@/utils/base/global';

/**
 * 内部集成扩展配置
 * key 为 extendName（扩展校验规则名）
 * value 为 {func: 校验函数对象, isPromise: true/false}
 *   isPromise - 是否 Promise 对象
 *   func - 校验函数 function (rule, value, callback, source, options) {...}
 *     传入参数为async-validator格式的校验函数入参
 *     校验通过函数正常结束即可, 校验不通过抛出提示异常:
 *        同步模式: throw new Error(rule.message)
 *        异步模式: reject(new Error(rule.message))
 *        注: 可以直接返回外部传入的rule.message，也可以返回自己定义的message，如果想直接使用外部message, 也可以返回 new Error('')
 */
let extendValidateConfig = {};
const extendValidateConfigJsFiles = require.context('./BuildIn/', false, /([A-Z]|[a-z])\w+\.js$/);
extendValidateConfigJsFiles.keys().forEach(fileName => {
  extendValidateConfig = Object.assign(extendValidateConfig, extendValidateConfigJsFiles(fileName).default);
});

/**
 * 设置输入栏位的验证样式
 * @param {Object} currentInstance - 当前Vue组件的this对象
 * @param {string} field - el-form-item的ref引用名(应与prop设置为一样)
 * @param {string} validateState - 验证状态, ''/success/error/warn
 * @param {string} validateMessage - error和warn状态的提示信息
 * @param {Boolean} stopIfError - 是否检查目标对象状态为error, 默认为false, 如果设置为true代表先检查, 非error状态才覆盖
 * @param {Boolean} relationTag - 是否打上关联关系标记, 默认为false, 当设置为error和warn状态时可以打上标签
 */
export function setFieldValidateState(currentInstance, field, validateState, validateMessage, stopIfError, relationTag) {
  const formItem = currentInstance.$refs[field];
  if (formItem) {
    // 警告状态检查目标对象状态, 如果有is-error状态，并且没有关联标签时，不覆盖
    if (['warn', 'success'].includes(validateState) && stopIfError) {
      if (WebTools.hasClass(formItem.$el, 'is-error') && !WebTools.hasClass(formItem.$el, 'relation-tag')) {
        return;
      }
    }

    // 先清除原样式
    formItem.clearValidate();

    // 设置样式
    if (validateState === 'success') {
      formItem.validateState = 'success';
    } else if (validateState !== '') {
      // warn同样依赖error的处理
      formItem.validateState = 'error';
      formItem.validateMessage = validateMessage;
      // 打上关联关系标签
      currentInstance.$nextTick(() => {
        if (relationTag) {
          WebTools.addClass(formItem.$el, 'relation-tag');
        } else {
          WebTools.removeClass(formItem.$el, 'relation-tag');
        }
      });
      // warn需要用$nextTick处理
      if (validateState !== 'error') {
        currentInstance.$nextTick(() => {
          WebTools.addClass(formItem.$el, 'is-' + validateState);
        });
      }
    }
  } else {
    console.error('Set field validate state error: el-form-item of field [' + field + '] must set ref property');
  }
}

/**
 * 失败或告警时, 设置关联栏位的状态
 * @param {*} rule
 * @param {*} message
 * @param {*} isSuccess - 是否设置为成功
 */
function setRelationValidateState(rule, message, isSuccess) {
  if (isSuccess) {
    // 设置关联为成功状态
    if (rule.relationFields) {
      setTimeout(() => {
        for (const rField in rule.relationFields) {
          setFieldValidateState(rule.currentInstance, rField, 'success', undefined, true, false);
        }
      }, 10);
    }
  } else if (rule.warn) {
    // 告警信息
    if (rule.setFieldWarnState) {
      rule.currentInstance.$nextTick(() => {
        // element-plus的callback会设置校验样式，所以要通过timeout延迟处理覆盖样式
        setTimeout(() => {
          // 校验字段样式
          setFieldValidateState(rule.currentInstance, rule.field, 'warn', message);
          // 设置关联字段样式
          if (rule.relationFields) {
            for (const rField in rule.relationFields) {
              if (rule.relationFields[rField]) {
                setFieldValidateState(rule.currentInstance, rField, 'warn', rule.relationFields[rField], true, true);
              } else {
                setFieldValidateState(rule.currentInstance, rField, 'warn', message, true, true);
              }
            }
          }
        }, 10);
      });
    }
  } else {
    // 校验失败情况, 仅设置关联字段样式
    if (rule.relationFields) {
      rule.currentInstance.$nextTick(() => {
        setTimeout(() => {
          for (const rField in rule.relationFields) {
            if (rule.relationFields[rField]) {
              setFieldValidateState(rule.currentInstance, rField, 'error', rule.relationFields[rField], true, true);
            } else {
              setFieldValidateState(rule.currentInstance, rField, 'error', message, true, true);
            }
          }
        }, 10);
      });
    }
  }
}

/**
 * 通用的内部集成扩展校验参数
 * @param {JSON} rule - 校验规则, 使用该框架需要送入的特殊参数包括
 *   warn {boolean} 默认为false, 指定规则是否警告(校验通过, 但有警告信息), 原则上警告规则应该配置在错误校验规则之后添加
 *   warnId {string} 告警规则id, 用于放入告警堆栈, 如果不设置将默认使用field名作为id（注意如果一个栏位有多个告警类规则, 如果不设置独立id，告警堆栈信息将会相互覆盖）
 *   setFieldWarnState {boolean} 默认为false, 是否设置输入栏位样式为告警样式
 *   relationFields {JSON} 错误或告警情况, 需要关联提示的栏位信息, 格式为
 *     {
 *        [fieldname]: undefined/message,  // undefined代表使用与校验字段相同的信息, 传入message代表使用自定义信息
 *        ...
 *     }
 *   currentInstance {Object} 当前Vue组件的this对象, 对于setFieldWarnState为true, 以及设置了relationFields的情况必传
 *   # 原生规则传入方式
 *     直接按标准方式传入, 除了以下两个参数:
 *     validator 参数名修改为 nativeValidator
 *     asyncValidator 参数名修改为 nativeAsyncValidator
 *   # 扩展类规则传入方式
 *     extendName {string} - 校验规则名, 必送, 框架会根据这个规则名匹配找到对应的处理函数, 优先级为先找本地扩展, 再找集成扩展
 *     localExtend {JSON} - 本地的扩展校验规则配置, 格式跟集成的格式一致
 *       key 为 extendName（扩展校验规则名）
 *       value 为 {func: 校验函数对象, isPromise: true/false}
 *     其他参数, 具体根据实际校验函数的要求传入
 * @param {*} value - 当前校验栏位的值
 * @param {*} callback
 * @param {*} source
 * @param {*} options
 */
export const asyncValidateExtendFun = async(rule, value, callback, source, options) => {
  if (rule.extendName === undefined) {
    // 原生校验方法, 增加对告警场景的支持
    // 处理规则参数
    const nativeRules = Object.assign({}, rule);
    delete nativeRules.validator;
    delete nativeRules.asyncValidator;
    if (nativeRules.nativeValidator) {
      nativeRules['validator'] = nativeRules.nativeValidator;
    }
    if (nativeRules.nativeAsyncValidator) {
      nativeRules['asyncValidator'] = nativeRules.nativeAsyncValidator;
    }
    const descriptor = {};
    descriptor[nativeRules.field] = nativeRules;

    // 执行校验处理, 注意原生校验如果执行callback函数反而会出现问题
    const validator = new Schema(descriptor);
    await validator.validate(source, (errors, fields) => {
      if (errors) {
        // 校验不通过
        if (rule.warn) {
          // 校验告警
          if (rule.setFieldWarnState) {
            setRelationValidateState(rule, errors[0].message);
          }
          // 放入告警堆栈
          if (rule.currentInstance && rule.currentInstance.warnStack) {
            rule.currentInstance.warnStack[rule.warnId ? rule.warnId : rule.field] = {
              field: rule.field,
              fieldValue: value,
              message: errors[0].message,
              warnId: rule.warnId
            };
          }
          // 告警返回校验通过
          callback();
        } else {
          // 校验失败
          setRelationValidateState(rule, errors[0].message);
        }
      } else {
        // 关联字段设置为成功
        setRelationValidateState(rule, undefined, true);
      }
    });
  } else {
    // 执行自定义方法的校验处理
    // i18n
    const _i18n = getI18n();

    // 先查找校验函数
    if (!rule.extendName) {
      callback(new Error(_i18n.t('validateRules.extendNameError', { name: field })));
      return;
    }

    const localExtend = rule.localExtend || {};
    let extendConfig = localExtend[rule.extendName];
    if (!extendConfig) {
      extendConfig = extendValidateConfig[rule.extendName];
    }
    if (!extendConfig) {
      callback(new Error(_i18n.t('validateRules.extendNameNotExists', { name: field, extendName: rule.extendName })));
      return;
    }

    // 根据类型执行并返回结果
    let backError;
    try {
      if (extendConfig.isPromise) {
        // 异步模式
        await extendConfig.func(rule, value, callback, source, options);
      } else {
        // 同步模式
        extendConfig.func(rule, value, callback, source, options);
      }
    } catch (error) {
      backError = error;
      if (backError.message === undefined || backError.message === '') {
        backError = new Error(rule.message);
      }
    }
    if (backError !== undefined) {
      // 校验不通过
      if (rule.warn) {
        // 校验告警
        if (rule.setFieldWarnState) {
          setRelationValidateState(rule, backError.message);
        }
        // 放入告警堆栈
        if (rule.currentInstance && rule.currentInstance.warnStack) {
          rule.currentInstance.warnStack[rule.warnId ? rule.warnId : rule.field] = {
            field: rule.field,
            fieldValue: value,
            message: backError.message,
            warnId: rule.warnId
          };
        }
        backError = undefined; // 按通过返回
      } else {
        setRelationValidateState(rule, backError.message);
      }
    } else {
      // 设置关联字段为通过
      setRelationValidateState(rule, undefined, true);
    }
    callback(backError);
  }
};
