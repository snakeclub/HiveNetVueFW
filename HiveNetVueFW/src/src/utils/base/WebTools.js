/**
 * 网页处理相关的公共函数
 */

function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

export default {
  /**
   * 生成编码后的query字符串
   * @param {Object} json
   * @returns {string} - 编码后的query字符串
   */
  query2UrlParam: (json) => {
    if (!json) return '';
    return cleanArray(
      Object.keys(json).map(key => {
        if (json[key] === undefined) return '';
        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
      })
    ).join('&');
  },

  /**
   * 获取url中的query参数对象
   * @param {string} url
   * @returns {Object}
   */
  getQueryObject: (url) => {
    url = url == null ? window.location.href : url;
    const search = url.substring(url.lastIndexOf('?') + 1);
    const obj = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, (rs, $1, $2) => {
      const name = decodeURIComponent($1);
      let val = decodeURIComponent($2);
      val = String(val);
      obj[name] = val;
      return rs;
    });
    return obj;
  },

  /**
   * HTML代码转换为显示文本
   * @param {string} val
   * @returns {string}
   */
  html2Text: (val) => {
    const div = document.createElement('div');
    div.innerHTML = val;
    return div.textContent || div.innerText;
  },

  /**
   * 切换元素的class对象(如果有就去除, 没有就添加)
   * @param {HTMLElement} element
   * @param {string} className
   */
  toggleClass: (element, className) => {
    if (!element || !className) {
      return;
    }
    let classString = element.className;
    const nameIndex = classString.indexOf(className);
    if (nameIndex === -1) {
      classString += '' + className;
    } else {
      classString =
        classString.substr(0, nameIndex) +
        classString.substr(nameIndex + className.length);
    }
    element.className = classString;
  },

  /**
   * Check if an element has a class
   * @param {HTMLElement} elm
   * @param {string} cls
   * @returns {boolean}
   */
  hasClass,

  /**
   * Add class to element
   * @param {HTMLElement} elm
   * @param {string} cls
   */
  addClass: (ele, cls) => {
    if (!hasClass(ele, cls)) ele.className += ' ' + cls;
  },

  /**
   * Remove class from element
   * @param {HTMLElement} elm
   * @param {string} cls
   */
  removeClass: (ele, cls) => {
    if (hasClass(ele, cls)) {
      const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      ele.className = ele.className.replace(reg, ' ');
    }
  },

  /**
   * 为元素添加style样式
   * @param {HTMLElement} ele - 要处理的元素
   * @param {string} styleName - 样式名，注意非标准样式应使用 "--" 开头
   * @param {string} styleVal - 要设置的样式值
   */
  addStyle: (ele, styleName, styleVal) => {
    if (styleName.startsWith('--')) {
      // 非标准样式, 通过正则表达式替换
      const reg = new RegExp('(?!\s|;\s)' + styleName + ':.*?;');
      const addStr = styleName + ': ' + styleVal + ';';
      let styleStr = ele.getAttribute('style') || '';
      const matchRes = styleStr.match(reg);
      if (matchRes && matchRes !== null) {
        styleStr = styleStr.replace(reg, addStr);
      } else {
        styleStr = styleStr + addStr;
      }
      ele.setAttribute('style', styleStr);
    } else {
      // 标准样式直接使用原生方法
      ele.style[styleName] = styleVal;
    }
  },

  /**
   * 为元素移除style样式
   */
  removeStyle: (ele, styleName) => {
    if (styleName.startsWith('--')) {
      // 非标准样式, 通过正则表达式替换
      const reg = new RegExp('(?!\s|;\s)' + styleName + ':.*?;');
      let styleStr = ele.getAttribute('style') || '';
      const matchRes = styleStr.match(reg);
      if (matchRes && matchRes !== null) {
        // 找到的配置替换为空字符串
        styleStr = styleStr.replace(reg, '');
        ele.setAttribute('style', styleStr);
      }
    } else {
      // 标准样式直接使用原生方法
      delete ele.style[styleName];
    }
  }

};
