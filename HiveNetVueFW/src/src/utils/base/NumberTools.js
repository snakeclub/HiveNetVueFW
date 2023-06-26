/**
 * 增强的数字类型处理工具（修正js浮点数计算精度问题）
 */

/**
 * 判断对象是否数值类型
 * @param {Object} value - 要判断的对象
 * @returns {Boolean} - 返回判断结果
 */
export const isNumber = (value) => {
  return typeof value === 'number' && !isNaN(value);
};

/**
 * 数值的四舍五入，修正js原四舍五入方法的bug
 * @param {Number} num - 要处理的数字
 * @param {int} d - 精度位数（小数位数），默认为0
 * @returns {string} - 返回四舍五入以后的数字字符串
 */
export const getFixed = (num, d) => {
  var s = num + '';
  if (!d) d = 0;
  if (s.indexOf('.') === -1) s += '.';
  s += new Array(d + 1).join('0');
  if (new RegExp('^(-|\\+)?(\\d+(\\.\\d{0,' + (d + 1) + '})?)\\d*$').test(s)) {
    s = '0' + RegExp.$2;
    var pm = RegExp.$1;
    var a = RegExp.$3.length;
    var b = true;
    if (a === d + 2) {
      a = s.match(/\d/g);
      if (parseInt(a[a.length - 1]) > 4) {
        for (var i = a.length - 2; i >= 0; i--) {
          a[i] = parseInt(a[i]) + 1;
          if (a[i] === 10) {
            a[i] = 0;
            b = i !== 1;
          } else break;
        }
      }
      s = a.join('').replace(new RegExp('(\\d+)(\\d{' + d + '})\\d$'), '$1.$2');
    }
    if (b) s = s.substr(1);
    return (pm + s).replace(/\.$/, '');
  }
  return num + '';
};

/**
 * 浮点数相加，修正原JS的浮点数相加出现的精度问题
 * @param  {...any} value - 支持传入任意多个浮点数，支持Number和String
 * @returns {float} - 返回计算后的浮点数
 */
export function floatAdd(...value) {
  // 获得精度
  var fix = 0;
  for (let i = 0; i < arguments.length; i++) {
    var r;
    var nstr = arguments[i].toString();
    try { r = nstr.split('.')[1].length; } catch (e) { r = 0; }
    fix = Math.max(r, fix);
  }
  // 转为整型计算
  var m = Math.pow(10, fix);
  var ret = 0;
  for (let i = 0; i < arguments.length; i++) {
    if (typeof (arguments[i]) !== 'number') { ret += parseFloat(arguments[i]) * m; } else { ret += arguments[i] * m; }
  }

  return ret / m;
}

/**
 * 浮点数相减，修正原JS的浮点数相加出现的精度问题
 * @param  {...any} value - 第1个参数值减去后面的所有参数值, 支持传入任意多个浮点数，支持Number和String
 * @returns {float} - 返回计算后的浮点数
 */
export function floatSub(...value) {
  // 获得精度
  var fix = 0;
  for (let i = 0; i < arguments.length; i++) {
    var r;
    var nstr = arguments[i].toString();
    try { r = nstr.split('.')[1].length; } catch (e) { r = 0; }
    fix = Math.max(r, fix);
  }
  // 转为整型计算
  var m = Math.pow(10, fix);
  var ret;
  if (typeof (arguments[0]) !== 'number') { ret = parseFloat(arguments[0]) * m; } else { ret = arguments[0] * m; }

  for (let i = 1; i < arguments.length; i++) {
    if (typeof (arguments[i]) !== 'number') { ret -= parseFloat(arguments[i]) * m; } else { ret -= arguments[i] * m; }
  }

  return ret / m;
}

/**
 * 浮点数相乘，修正原JS的浮点数出现的精度问题
 * @param  {...any} value - 支持传入任意多个浮点数，支持Number和String
 * @returns {float} - 返回计算后的浮点数
 */
export function floatMul(...value) {
  // 获得精度
  var fix = 0;
  for (let i = 0; i < arguments.length; i++) {
    var nstr = arguments[i].toString();
    try { fix += nstr.split('.')[1].length; } catch (e) {}
  }
  // 转为整型计算
  var ret = 1;
  for (let i = 0; i < arguments.length; i++) {
    var nnum = arguments[i];
    if (typeof (nnum) !== 'number') { nnum = parseFloat(nnum); }
    // 转为整型计算
    ret = ret * Number(nnum.toString().replace('.', ''));
  }

  return ret / Math.pow(10, fix);
}

/**
 * 浮点数相除，修正原JS的浮点数出现的精度问题
 * @param {number|string} arg1 - 被除数
 * @param {number|string} arg2 - 除数
 * @returns {float} - 返回计算后的浮点数
 */
export function floatDiv(arg1, arg2) {
  var t1 = 0;
  var t2 = 0;
  var r1;
  var r2;
  if (typeof (arg1) !== 'number') { arg1 = parseFloat(arg1); }
  if (typeof (arg2) !== 'number') { arg2 = parseFloat(arg2); }

  try { t1 = arg1.toString().split('.')[1].length; } catch (e) {}
  try { t2 = arg2.toString().split('.')[1].length; } catch (e) {}
  r1 = Number(arg1.toString().replace('.', ''));
  r2 = Number(arg2.toString().replace('.', ''));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

export default {
  /**
   * 判断对象是否数值类型
   * @param {Object} value - 要判断的对象
   * @returns {Boolean} - 返回判断结果
   */
  isNumber,

  /**
   * 数值的四舍五入，修正js原四舍五入方法的bug
   * @param {Number} num - 要处理的数字
   * @param {int} d - 精度位数（小数位数），默认为0
   * @returns {string} - 返回四舍五入以后的数字字符串
   */
  getFixed,

  /**
   * 浮点数相加，修正原JS的浮点数相加出现的精度问题
   * @param  {...any} value - 支持传入任意多个浮点数，支持Number和String
   * @returns {float} - 返回计算后的浮点数
   */
  floatAdd: floatAdd,

  /**
   * 浮点数相减，修正原JS的浮点数相加出现的精度问题
   * @param  {...any} value - 第1个参数值减去后面的所有参数值, 支持传入任意多个浮点数，支持Number和String
   * @returns {float} - 返回计算后的浮点数
   */
  floatSub: floatSub,

  /**
   * 浮点数相乘，修正原JS的浮点数出现的精度问题
   * @param  {...any} value - 支持传入任意多个浮点数，支持Number和String
   * @returns {float} - 返回计算后的浮点数
   */
  floatMul: floatMul,

  /**
   * 浮点数相除，修正原JS的浮点数出现的精度问题
   * @param {number|string} arg1 - 被除数
   * @param {number|string} arg2 - 除数
   * @returns {float} - 返回计算后的浮点数
   */
  floatDiv: floatDiv

};
