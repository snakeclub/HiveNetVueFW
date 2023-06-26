/**
 * 内部集成的扩展联动支持
 */
const jp = require('jsonpath');
import { getI18n } from '@/utils/base/global';
import StringTools from '@/utils/base/StringTools';

/**
 * 内部集成扩展配置
 * key 为 linkageType （联动类型名）
 * value 为 {func: 联动计算函数, isPromise: true/false}
 *   isPromise - 是否 Promise 对象
 *   func - 联动计算函数 function (currentInstance, rule, newVal, oldVal, dataPrefix) {...}
 *     currentInstance {Object} 当前Vue组件的this对象
 *     rule {JSON} 联动规则
 *     newVal {Object} 监控对象的新值
 *     oldVal {Object} 监控对象的老值
 *     dataPrefix {String} 栏位关联数据名的前缀, 将自动和配置中的字段进行拼接, 例如'EditFormData'
 *     返回值要求如下:
 *       同步模式：
 *         1、如果需要框架处理联动动作, 返回计算后的结果值;
 *         2、如果函数内部已处理联动动作赋值, 抛出message为空的异常throw new Error('');
 *         3、如果需要框架提示异常, 抛出message不为空的异常throw new Error('xxx');
 *       异步模式:
 *         规则与同步模式一样, 只是通过 resolve 和 reject进行处理
 */
let extendLinkageConfig = {};
const extendLinkageConfigJsFiles = require.context('./BuildIn/', false, /([A-Z]|[a-z])\w+\.js$/);
extendLinkageConfigJsFiles.keys().forEach(fileName => {
  extendLinkageConfig = Object.assign(extendLinkageConfig, extendLinkageConfigJsFiles(fileName).default);
});

/**
 * 根据栏位路径设置值
 * @param {Object} dataRoot - 要设置对象
 * @param {string} fieldPath - 栏位路径, 例如'a.b.c'
 * @param {Object} val - 要设置的值
 */
function setPathValue(dataRoot, fieldPath, val) {
  eval('dataRoot.' + fieldPath + ' = val;');
}

/**
 * 计算表达式值
 * @param {Object} currentInstance - 基础对象
 * @param {String} expression - 含有jsonpath参数的表达式对象, 例如 '{$.aaa} > 10', '{input1}'
 * @param {String} dataPrefix - 前缀
 * @returns {Object} - 返回计算值
 */
const computeExpression = (currentInstance, expression, dataPrefix) => {
  // 进行表达式的值替换
  const dataRoot = dataPrefix ? eval('currentInstance.' + dataPrefix) : currentInstance;
  const valExp = expression.replace(/\{.*?\}/g, function(matchStr) {
    // 替换找到的值
    let jpath = matchStr.substring(1, matchStr.length - 1);
    if (jpath.startsWith('$.')) {
      // 直接从this根路径开始找
      return jp.value(currentInstance, jpath);
    } else {
      jpath = '$.' + jpath;
      return jp.value(dataRoot, jpath);
    }
  });

  // 执行表达式
  return eval(valExp);
};

/**
 * 执行联动处理
 * @param {Object} currentInstance - 当前Vue组件的this对象
 * @param {JSON} rule - 联动规则
 * @param {Object} newVal - 监控对象的新值
 * @param {Object} oldVal - 监控对象的老值
 * @param {String} dataPrefix - 栏位关联数据名的前缀, 将自动和配置中的字段进行拼接, 例如'EditFormData'
 */
async function executeLinkage(currentInstance, rule, newVal, oldVal, dataPrefix) {
  try {
    console.log(newVal);
    // i18n
    const _i18n = getI18n();

    // 检查规则是否符合执行条件
    if (rule.enableFlag !== undefined && rule.enableFlag !== '') {
      if (StringTools.isString(rule.enableFlag)) {
        // 是表达式, 待处理
        if (!computeExpression(currentInstance, rule.enableFlag, dataPrefix)) {
          console.debug('linkage rule not execute: enableFlag expression is false', rule);
          return;
        }
      } else {
        if (!rule.enableFlag) {
          // 不执行处理
          console.debug('linkage rule not execute: enableFlag is false', rule);
          return;
        }
      }
    }

    // 基础的参数处理
    const id = rule.id ? rule.id : StringTools.isString(rule.targetField) ? rule.targetField : rule.targetField.join('-');
    let executeFunc;
    let isPromise = false;
    if (rule.executeFunc) {
      executeFunc = rule.executeFunc;
    } else if (rule.asyncExecuteFunc) {
      executeFunc = rule.asyncExecuteFunc;
      isPromise = true;
    }

    // 没有自定义联动函数的情况下, 先查找联动函数
    if (!executeFunc) {
      if (!rule.linkageType) {
        throw new Error(_i18n.t('linkageRules.linkageTypeError', { id: id }));
      }

      const linkageFunConfig = extendLinkageConfig[rule.linkageType];
      if (!linkageFunConfig) {
        console.log(linkageFunConfig);
        throw new Error(_i18n.t('linkageRules.linkageNotExists', { id: id, linkageType: rule.linkageType }));
      }

      executeFunc = linkageFunConfig.func;
      isPromise = linkageFunConfig.isPromise;
    }

    // 执行联动规则
    let linkageValue;
    if (isPromise) {
      // 异步模式
      linkageValue = await executeFunc(currentInstance, rule, newVal, oldVal);
    } else {
      // 同步
      linkageValue = executeFunc(currentInstance, rule, newVal, oldVal);
    }

    // 进行目标值的设置
    const dataRoot = dataPrefix ? eval('currentInstance.' + dataPrefix) : currentInstance;
    if (StringTools.isString(rule.targetField)) {
      // 单个目标设置值
      setPathValue(dataRoot, rule.targetField, linkageValue);
    } else {
      // 多个目标设置值
      rule.targetField.forEach(field => {
        setPathValue(dataRoot, field, linkageValue);
      });
    }
  } catch (error) {
    if (error.message !== '') {
      // 提示错误信息
      currentInstance.$modal.messageError(error.message);
    }
  }
}

/**
 * 动态添加单个联动规则
 * @param {Object} currentInstance - 当前Vue组件的this对象
 * @param {JSON} rule - 联动规则
 * @param {string} dataPrefix - 栏位关联数据名的前缀, 将自动和配置中的字段进行拼接, 例如'EditFormData'
 * @returns {Object} 返回联动监听的(watch)对象
 */
function addLinkageRule(currentInstance, rule, dataPrefix) {
  let watchObject;
  if (StringTools.isString(rule.watchField)) {
    // 单字段监听
    watchObject = dataPrefix ? dataPrefix + '.' + rule.watchField : rule.watchField;
  } else {
    // 多字段监听
    const tempArray = [];
    rule.watchField.forEach(field => {
      if (dataPrefix === undefined || dataPrefix === '') {
        tempArray.push('"' + field + '": _this.' + field);
      } else {
        tempArray.push('"' + field + '": _this.' + dataPrefix + '.' + field);
      }
    });
    const watchDict = '({ ' + tempArray.join(',') + '})';
    watchObject = () => {
      const _this = currentInstance;
      return eval(watchDict);
    };
  }

  // 设置监听
  return currentInstance.$watch(
    watchObject, (newVal, oldVal) => {
      executeLinkage(currentInstance, rule, newVal, oldVal, dataPrefix).then(() => {}).catch((error) => {
        // 出现异常, 进行提示
        if (error.message !== '') {
          currentInstance.$modal.messageError(error.message);
        }
      });
    },
    { deep: true }
  );
}

/**
 * 关闭规则的监控对象
 * @param {Object} watchObj - addLinkageRule产生的watch对象
 */
function closeLinkageWatch(watchObj) {
  watchObj();
}

/**
 * 初始化联动规则
 * 注: 该操作应该在mounted中进行初始化处理
 * @param {Object} currentInstance - 当前Vue组件的this对象
 * @param {Array} linkageRules - 联动规则配置数组, key为联动目标字段, 每个规则的配置参数说明如下:
 *   targetField {string|Array} - 必填, 联动目标字段, 规则执行计算值将填入该字段(或字段组)
 *   id {string} - 非必填, 联动规则id, 如果送入则返回的监听对象字典通过该id作为key(当一个联动目标需要配置多个规则的情况使用), 否则使用联动目标字段作为key
 *   linkageType {string} - 如果没有提供自定义联动函数时必填, 联动规则类型, 默认支持的几个规则如下, 也可以填入扩展规则类型:
 *     fixed - 填入固定值
 *     equal - 填入关联字段的相同值
 *   watchField {string|Array} - 必填, 联动监控字段, 当字段值发生变化触发联动, 可以送入单个字段名, 也可以送入多个字段名的数组
 *   executeFunc {function} - 选填, 当前规则使用的自定义联动函数(同步), function (currentInstance, rule, newVal, oldVal, dataPrefix) {...}
 *   asyncExecuteFunc {function} - 选填, 当前规则使用的自定义联动函数(异步), async function (currentInstance, rule, newVal, oldVal, dataPrefix) {...}
 *   enableFlag {string|boolean} - 选填, 默认为true, 控制联动是否生效的标记, 除设置boolean值以外, 也可支持送入特定表达式, 根据表达式计算结果进行判断
 *     注1: 表达式应返回boolean值, 例如 '{fieldName} + 10 > 100'
 *     注2: fileName部分可以使用jsonpath语法, 如果带$.开头代表忽略dataPrefix, 如果没有$开头, 则自动加上'$.dataPrefix.'
 *   其他参数由具体的联动规则定义
 *   fixed类型参数:
 *     fixedValue {Object} 必填, 要填入的固定值
 * @param {string} dataPrefix - 栏位关联数据名的前缀, 将自动和配置中的字段进行拼接, 例如'EditFormData'
 *
 * @returns {JSON} - 返回联动监听的(watch)对象, 可用于销毁组件时关闭对应的监听对象
 *   注: 框架自身不存储这个对象, 如果组件需要在销毁时关闭监听对象, 需要存储并主动调用
 */
export function initLinkage(currentInstance, linkageRules, dataPrefix) {
  // 用于登记监听对象的JSON对象
  const watchHandlers = {};
  watchHandlers[dataPrefix] = {};

  // 遍历联动规则处理监听
  linkageRules.forEach(rule => {
    const id = rule.id ? rule.id : StringTools.isString(rule.targetField) ? rule.targetField : rule.targetField.join('-');

    // 设置监听
    watchHandlers[dataPrefix][id] = addLinkageRule(currentInstance, rule, dataPrefix);
  });

  return watchHandlers;
}

/**
 * 关闭初始化的联动监控对象
 * @param {JSON} watchHandlers - initLinkage返回的监控对象集合
 * @param {string} dataPrefix - 栏位关联数据名的前缀, 将自动和配置中的字段进行拼接, 例如'EditFormData'
 */
function closeLinkageWatchHandlers(watchHandlers, dataPrefix) {
  if (watchHandlers[dataPrefix]) {
    // 关闭监控
    for (const id in watchHandlers[dataPrefix]) {
      watchHandlers[dataPrefix][id]();
    }
    // 删除对象
    delete watchHandlers[dataPrefix];
  }
}

export default {
  /**
   * 动态添加单个联动规则
   * @param {Object} currentInstance - 当前Vue组件的this对象
   * @param {JSON} rule - 联动规则
   * @param {string} dataPrefix - 栏位关联数据名的前缀, 将自动和配置中的字段进行拼接, 例如'EditFormData'
   * @returns {Object} 返回联动监听的(watch)对象
   */
  addLinkageRule,

  /**
   * 关闭规则的监控对象
   * @param {Object} watchObj - addLinkageRule产生的watch对象
   */
  closeLinkageWatch,

  /**
   * 初始化联动规则
   * 注: 该操作应该在mounted中进行初始化处理
   * @param {Object} currentInstance - 当前Vue组件的this对象
   * @param {Array} linkageRules - 联动规则配置数组, key为联动目标字段, 每个规则的配置参数说明如下:
   *   targetField {string|Array} - 必填, 联动目标字段, 规则执行计算值将填入该字段(或字段组)
   *   id {string} - 非必填, 联动规则id, 如果送入则返回的监听对象字典通过该id作为key(当一个联动目标需要配置多个规则的情况使用), 否则使用联动目标字段作为key
   *   linkageType {string} - 如果没有提供自定义联动函数时必填, 联动规则类型, 默认支持的几个规则如下, 也可以填入扩展规则类型:
   *     fixed - 填入固定值
   *     equal - 填入关联字段的相同值
   *   watchField {string|Array} - 必填, 联动监控字段, 当字段值发生变化触发联动, 可以送入单个字段名, 也可以送入多个字段名的数组
   *   executeFunc {function} - 选填, 当前规则使用的自定义联动函数(同步), function (currentInstance, rule, newVal, oldVal) {...}
   *   asyncExecuteFunc {function} - 选填, 当前规则使用的自定义联动函数(异步), async function (currentInstance, rule, newVal, oldVal) {...}
   *   enableFlag {string|boolean} - 选填, 默认为true, 控制联动是否生效的标记, 除设置boolean值以外, 也可支持送入特定表达式, 根据表达式计算结果进行判断
   *     注1: 表达式应返回boolean值, 例如 '{fieldName} + 10 > 100'
   *     注2: fileName部分可以使用jsonpath语法, 如果带$.开头代表忽略dataPrefix, 如果没有$开头, 则自动加上'$.dataPrefix.'
   *   其他参数由具体的联动规则定义
   *   fixed类型参数:
   *     fixedValue {Object} 必填, 要填入的固定值
   * @param {string} dataPrefix - 栏位关联数据名的前缀, 将自动和配置中的字段进行拼接, 例如'EditFormData'
   *
   * @returns {JSON} - 返回联动监听的(watch)对象, 可用于销毁组件时关闭对应的监听对象
   *   注: 框架自身不存储这个对象, 如果组件需要在销毁时关闭监听对象, 需要存储并主动调用
   */
  initLinkage,

  /**
   * 关闭初始化的联动监控对象
   * @param {JSON} watchHandlers - initLinkage返回的监控对象集合
   * @param {string} dataPrefix - 栏位关联数据名的前缀, 将自动和配置中的字段进行拼接, 例如'EditFormData'
   */
  closeLinkageWatchHandlers

};
