/**
 * 通用JSON对象处理工具
 */

/**
 * 简单JSON对象的深拷贝（支持函数对象，性能较差）
 * @param {JSON} source - JSON对象
 * @returns {JSON} - 拷贝后的JSON对象
 */
export function deepCloneJsonFunc(source) {
  let target;
  const constructorType = source.constructor.toString();
  if (constructorType.indexOf('Object') > -1) {
    // 是字典
    target = {};
    for (const key in source) {
      target[key] = deepCloneJsonFunc(source[key]);
    }
  } else if (constructorType.indexOf('Array') > -1) {
    // 是数组
    target = [];
    for (const item of source) {
      target.push(deepCloneJsonFunc(item));
    }
  } else {
    if (Object.prototype.toString.apply(source) === '[object Function]') {
      // 是函数, 原样返回
      target = source;
    } else {
      // 一般对象，用json方式处理接口
      target = JSON.parse(JSON.stringify(source));
    }
  }
  return target;
}

/**
 * 深度合并Json对象
 * @param {Json} target - 要合并到的目标json对象
 * @param  {...any} sources - 要合并进去的对象
 * @return {Json} - 合并以后的对象
 */
export function deepJsonAssign(target, ...sources) {
  let _target = target;
  for (const source of sources) {
    const _source = deepCloneJsonFunc(source);
    if (_source.constructor.toString().indexOf('Object') > -1) {
      // 是字典, 逐个对象合并
      for (const key in _source) {
        if (_target[key] === undefined || _target[key].constructor.toString().indexOf('Object') === -1) {
          // key值不存在或为非字典的情况，直接替换
          _target[key] = _source[key];
        } else {
          // 递归处理下一级的字典
          _target[key] = deepJsonAssign(_target[key], _source[key]);
        }
      }
    } else {
      // 非字典，用原生方法处理
      _target = Object.assign(_target, _source);
    }
  }
  return _target;
}

/**
 * 比较两个对象值是否相同
 * @param {JSON} x - 比较对象
 * @param {JSON} y - 比较对象
 * @returns {bool} - 比较结果
 */
export function deepCompare(x, y) {
  var i, l, leftChain, rightChain;

  function compare2Objects(x, y) {
    var p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
      return true;
    }

    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
      return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
      (x instanceof Date && y instanceof Date) ||
      (x instanceof RegExp && y instanceof RegExp) ||
      (x instanceof String && y instanceof String) ||
      (x instanceof Number && y instanceof Number)) {
      return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
      return false;
    }

    if (Object.prototype.isPrototypeOf.call(x, y) || Object.prototype.isPrototypeOf.call(y, x)) {
      return false;
    }

    if (x.constructor !== y.constructor) {
      return false;
    }

    if (x.prototype !== y.prototype) {
      return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
      return false;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
      if (Object.prototype.hasOwnProperty.call(y, p) !== Object.prototype.hasOwnProperty.call(x, p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }
    }

    for (p in x) {
      if (Object.prototype.hasOwnProperty.call(y, p) !== Object.prototype.hasOwnProperty.call(x, p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }

      switch (typeof x[p]) {
        case 'object':
        case 'function':
          leftChain.push(x);
          rightChain.push(y);

          if (!compare2Objects(x[p], y[p])) {
            return false;
          }

          leftChain.pop();
          rightChain.pop();
          break;

        default:
          if (x[p] !== y[p]) {
            return false;
          }
          break;
      }
    }

    return true;
  }

  if (arguments.length < 1) {
    return true; // Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {
    leftChain = []; // Todo: this can be cached
    rightChain = [];

    if (!compare2Objects(arguments[0], arguments[i])) {
      return false;
    }
  }

  return true;
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  return Array.isArray(arg);
}

export default {
  /**
   * 比较两个对象值是否相同
   * @param {JSON} x - 比较对象
   * @param {JSON} y - 比较对象
   * @returns {bool} - 比较结果
   */
  deepCompare,

  /**
   * 简单JSON对象的深拷贝（仅数据操作）
   * @param {JSON} source - JSON对象
   * @returns {JSON} - 拷贝后的JSON对象
   */
  deepCloneJson: (source) => {
    return JSON.parse(JSON.stringify(source));
  },

  /**
   * 简单JSON对象的深拷贝（支持函数对象，性能较差）
   * @param {JSON} source - JSON对象
   * @returns {JSON} - 拷贝后的JSON对象
   */
  deepCloneJsonFunc,

  /**
   * 深度合并Json对象
   * @param {Json} target - 要合并到的目标json对象
   * @param  {...any} sources - 要合并进去的对象
   * @return {Json} - 合并以后的对象
   */
  deepJsonAssign,

  /**
   * @param {Array} arg
   * @returns {Boolean}
   */
  isArray
};
