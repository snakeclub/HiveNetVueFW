/**
 * 增强的字符串处理工具
 */

/**
 * 判断对象是否字符串
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true;
  }
  return false;
}

export default {
  /**
   * 判断对象是否字符串
   * @param {string} str
   * @returns {Boolean}
   */
  isString,

  /**
   * 获得字符串开头指定长度的子字符串
   * @param {string} str - 要处理的字符串对象
   * @param {int} len - 长度
   * @returns {string} - 获取到的字符串
   */
  left: (str, len) => {
    return str.substring(0, len);
  },

  /**
   * 获得字符串结尾指定长度的子字符串
   * @param {string} str - 要处理的字符串对象
   * @param {int} len - 长度
   * @returns {string} - 获取到的字符串
   */
  right: (str, len) => {
    return str.substring(str.length - len);
  },

  /**
   * 获得字符串中间指定长度的子字符串
   * @param {string} str - 要处理的字符串对象
   * @param {int} start - 获取的开始位置(从0开始)
   * @param {int} len - 长度
   * @returns {string} - 获取到的字符串
   */
  mid: (str, start, len) => {
    return str.substring(start, start + len);
  },

  /**
   * 获得字符串开头指定长度的子字符串，以字节为单位
   * @param {string} str - 要处理的字符串对象
   * @param {int} len - 长度
   * @returns {string} - 获取到的字符串
   */
  leftB: (str, len) => {
    var w = 0;
    var ret = '';
    for (var i = 0; i < str.length; i++) {
      if (w >= len) {
        return ret;
      }
      var c = str.charCodeAt(i);
      var ch = str.charAt(i);
      // 单字节加1
      if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
        w++;
        ret += ch;
      } else {
        w += 2;
        if (w > len) {
          return ret;
        }
        ret += ch;
      }
    }
    return ret;
  },

  /**
   * 获得字符串中间指定长度的子字符串，以字节为单位
   * @param {string} str - 要处理的字符串对象
   * @param {int} len - 长度
   * @returns {string} - 获取到的字符串
   */
  rightB: (str, len) => {
    var w = 0;
    var ret = '';
    for (var i = str.length - 1; i >= 0; i--) {
      if (w >= len) {
        return ret;
      }
      var c = str.charCodeAt(i);
      var ch = str.charAt(i);
      // 单字节加1
      if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
        w++;
        ret = ch + ret;
      } else {
        w += 2;
        if (w > len) {
          return ret;
        }
        ret = ch + ret;
      }
    }
    return ret;
  },

  /**
   * 获得字符串中间指定长度的子字符串，以字节为单位
   * @param {string} str - 要处理的字符串对象
   * @param {int} start - 获取的开始位置(从0开始)
   * @param {int} len - 长度
   * @returns {string} - 获取到的字符串
   */
  midB: (str, start, len) => {
    var w = 0;
    var ret = '';
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      var ch = str.charAt(i);
      // 单字节加1
      if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
        if (w >= start && w < start + len) {
          ret += ch;
        }
        w++;
      } else {
        if (w >= start && w + 1 < start + len) {
          ret += ch;
        }
        w += 2;
      }
      if (w >= start + len) {
        return ret;
      }
    }
    return ret;
  },

  /**
   * 获得字符串的真实长度
   * @param {string} str - 要处理的字符串对象
   * @returns {int} - 字符串长度
   */
  getRealLength: (str) => {
    var w = 0;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      // 单字节加1
      if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
        w++;
      } else {
        w += 2;
      }
    }
    return w;
  },

  /**
   * 清除对象头尾相同的字符(串)
   * @param {string} str - 要处理的字符串对象
   * @param {string} trimStr - 要去除的字符/字符串
   * @returns {string} - 处理完成的字符串
   */
  Trim: (str, trimStr) => {
    if (trimStr === undefined) {
      trimStr = '\\s';
    }
    trimStr = trimStr.replace(/[\$\(\)\*\+\.\[\]\?\/\^\{\}\|\\]/g, '\\$&'); // 转义字符
    var regObj = new RegExp('^(\\s|' + trimStr + ')+|(\\s|' + trimStr + ')+$', 'g');
    return str.replace(regObj, '');
  },

  /**
   * 清除对象开头相同的字符(串)
   * @param {string} str - 要处理的字符串对象
   * @param {string} trimStr - 要去除的字符/字符串
   * @returns {string} - 处理完成的字符串
   */
  lTrim: (str, trimStr) => {
    if (trimStr === undefined) {
      trimStr = '\\s';
    }
    trimStr = trimStr.replace(/[\$\(\)\*\+\.\[\]\?\/\^\{\}\|\\]/g, '\\$&'); // 转义字符
    var regObj = new RegExp('^(\\s|' + trimStr + ')+', 'g');
    return str.replace(regObj, '');
  },

  /**
   * 清除对象结尾相同的字符(串)
   * @param {string} str - 要处理的字符串对象
   * @param {string} trimStr - 要去除的字符/字符串
   * @returns {string} - 处理完成的字符串
   */
  rTrim: (str, trimStr) => {
    if (trimStr === undefined) {
      trimStr = '\\s';
    }
    trimStr = trimStr.replace(/[\$\(\)\*\+\.\[\]\?\/\^\{\}\|\\]/g, '\\$&'); // 转义字符
    var regObj = new RegExp('(\\s|' + trimStr + ')+$', 'g');
    return str.replace(regObj, '');
  },

  /**
   * 是否以指定的字符串开头
   * @param {string} str - 要处理的字符串对象
   * @param {string} matchStr - 要匹配的字符串
   * @returns {bool} - 匹配结果
   */
  startWith: (str, matchStr) => {
    return str.indexOf(matchStr) === 0;
  },

  /**
   * 是否以指定的字符串结尾
   * @param {string} str - 要处理的字符串对象
   * @param {string} matchStr - 要匹配的字符串
   * @returns {bool} - 匹配结果
   */
  endWith: (str, matchStr) => {
    var d = str.length - matchStr.length;
    return d >= 0 && str.lastIndexOf(matchStr) === d;
  },

  /**
   * 是否包含字符串
   * @param {string} str - 要处理的字符串对象
   * @param {string} matchStr - 要匹配的字符串
   * @returns {bool} - 匹配结果
   */
  include: (str, matchStr) => {
    return str.indexOf(matchStr) > -1;
  },

  /**
   * 是否空或无值
   * @param {string} str - 要处理的字符串对象
   * @returns {bool} - 是否空或无值
   */
  isNullOrEmpty: (str) => {
    return str === undefined || str == null || str.trim() === '';
  },

  /**
   * 转换为html编码
   * @param {string} str - 要处理的字符串对象
   * @returns {string} - 转换后的字符串
   */
  toHtmlEncode: (str) => {
    var tempStr = str;
    tempStr = tempStr.replace(/&/g, '&amp;');
    tempStr = tempStr.replace(/</g, '&lt;');
    tempStr = tempStr.replace(/>/g, '&gt;');
    tempStr = tempStr.replace(/\'/g, '&apos;');
    tempStr = tempStr.replace(/\"/g, '&quot;');
    tempStr = tempStr.replace(/\n/g, '<br>');
    tempStr = tempStr.replace(/ /g, '&nbsp;');
    tempStr = tempStr.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    return tempStr;
  },

  /**
   * 是否存在汉字
   * @param {string} str - 要处理的字符串对象
   * @returns {bool} - 判断结果
   */
  existChinese: (str) => {
    // [/u4E00-/u9FA5]為漢字﹐[/uFE30-/uFFA0]為全角符號
    return !(/^[\x00-\xff]*$/.test(str));
  },

  /**
   * 获取固定长度字符串
   * @param {string} str - 原始字符串
   * @param {int} len - 要获取字符串长度
   * @param {string} fixChar - 要补充的字符
   * @param {bool} isLeftFix - 是否左补充，默认为true
   * @returns {string} - 返回字符串
   */
  fixedLenString: (str, len, fixChar, isLeftFix) => {
    const fixLen = len - str.length;
    if (fixLen <= 0) {
      // 已超过总长度
      return str;
    }
    const tempFixStr = Array(fixLen + 1).join(fixChar);
    if (isLeftFix === undefined || isLeftFix) {
      return tempFixStr + str;
    } else {
      return str + tempFixStr;
    }
  },

  /**
   * 首字母变更Case
   * @param {string} str - 要处理的字符串
   * @param {bool} isUpper - 是否转换为大写, 默认为false
   * @returns {string} - 转换后的字符串
   */
  firstCase: (str, isUpper) => {
    if (isUpper) {
      return str.replace(/( |^)[a-z]/g, L => L.toUpperCase());
    } else {
      return str.replace(/( |^)[a-z]/g, L => L.toLowerCase());
    }
  }
};
