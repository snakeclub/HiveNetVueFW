/**
 * 日期时间处理的工具
 */

function timeBetween(firstday, lastday, unit) {
  // unit默认为d
  if (unit === undefined) {
    unit = 'd';
  }
  let zs = 0;
  let xs = 0;
  switch (unit) {
    case 'y':
      // 年，先算整数部分
      zs = lastday.getFullYear() - firstday.getFullYear();
      firstday.setYear(lastday.getFullYear());
      xs = (lastday - firstday) / 31536000000; // 按一年有365天算
      return zs + xs;
    case 'M':
      // 月，再算月，再算天
      var yue = (lastday.getFullYear() - firstday.getFullYear()) * 12;
      firstday.setYear(lastday.getFullYear());
      yue = yue + (lastday.getMonth() - firstday.getMonth());
      if (firstday.getDate() < lastday.getDate()) {
        // 把月份也换成一样，由于存在2月28日的情况，需变化为日期多的月份
        firstday.setMonth(lastday.getMonth());
      } else {
        lastday.setMonth(firstday.getMonth());
      }
      xs = (lastday - firstday) / 2592000000; // 按一个月有30天计算
      return yue + xs;
    case 's':
      return (lastday - firstday) / 1000;
    case 'm':
      return (lastday - firstday) / 60000;
    case 'h':
      return (lastday - firstday) / 3600000;
    case 'w':
      return (lastday - firstday) / 604800000;
    default:
      return (lastday - firstday) / 86400000;
  }
}

export default {
  /**
   * 获取当前日期时间
   * @returns {Date} - 当前日期时间对象
   */
  now: () => {
    return new Date();
  },

  /**
   * 判断日期是否闰年
   * @param {Date} date - 要判断的日期对象
   * @returns {bool} - 是否闰年
   */
  isLeapYear: (date) => {
    return (date.getYear() % 4 === 0 && ((date.getYear() % 100 !== 0) || (date.getYear() % 400 === 0)));
  },

  /**
   * 将日期格式化为字符串格式
   * @param {Date} date - 要处理的日期时间对象
   * @param {string} formatStr - 格式化字符串，例如'yyyy/MM/dd hh:mm:ss'
   * @returns {string} - 格式化后的字符串
   */
  formatToStr: (date, formatStr) => {
    var str = formatStr;
    var Weekn = ['7', '1', '2', '3', '4', '5', '6'];
    var Weekh = ['日', '一', '二', '三', '四', '五', '六'];
    str = str.replace(/AM/g, (date.getHours() > 12 ? 'PM' : 'AM'));
    str = str.replace(/yyyy/g, date.getFullYear());
    str = str.replace(/yy/g, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));
    str = str.replace(/MM/g, date.getMonth() > 8 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1));
    str = str.replace(/M/g, date.getMonth() + 1);
    str = str.replace(/w/g, Weekn[date.getDay()]);
    str = str.replace(/W/g, Weekh[date.getDay()]);
    str = str.replace(/dd/g, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
    str = str.replace(/d/g, date.getDate());
    str = str.replace(/hh/g, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
    var tempH = (date.getHours() > 12 ? (date.getHours() - 12) : date.getHours());
    str = str.replace(/HH/g, tempH > 9 ? tempH.toString() : '0' + tempH);
    str = str.replace(/h/g, date.getHours());
    str = str.replace(/H/g, tempH);
    str = str.replace(/mm/g, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
    str = str.replace(/m/g, date.getMinutes());
    str = str.replace(/ss/g, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
    str = str.replace(/s/g, date.getSeconds());
    return str;
  },

  /**
   * 字符串转换为日期时间对象
   * @param {string} dateStr - 要转换的日期对象字符串，例如: '2021.10.1 12:30'
   * @param {string} formatStr - 格式化字符串，例如: 'yyyy.M.d h:m'
   * @returns {Date} - 转换后的日期时间对象
   */
  strToDate: (dateStr, formatStr) => {
    var searchStr = 'yyyy|yy|MM|M|dd|d|hh|h|mm|m|ss|s';
    var dret = new Date(1900, 1, 1);
    var searchNext = true; // 是否继续搜索下一个
    // 一些临时变量
    var pos = -1;
    var pos1 = -1;
    var matchStr = '';
    var val = 0;
    var splitchar = '';
    var regObj;
    while (searchNext) {
      try {
        matchStr = formatStr.match(searchStr);
        if (matchStr.length > 0) {
          matchStr = matchStr[0];
          if (matchStr.length === 1) {
            // 匹配到单个字符情况，需要考虑较多情况
            pos = formatStr.indexOf(matchStr);
            splitchar = formatStr.substring(pos + 1, pos + 2);
            if (splitchar.match(/[^yMdhms]/) == null) {
              // 没有分隔符的情况
              if (splitchar === '') {
                // 匹配字符是结尾, 可以抓多一个字符
                val = parseInt(dateStr.substring(pos, pos + 2));
                dateStr = dateStr.substring(0, pos) + dateStr.substring(pos + 1); // 日期字符串上删除匹配上的内容
              } else {
                // 只支持抓取第1个字符
                val = parseInt(dateStr.substring(pos, pos + 1));
                dateStr = dateStr.substring(0, pos) + dateStr.substring(pos + 1); // 日期字符串上删除匹配上的内容
              }
            } else {
              // 有分隔符的情况
              pos1 = dateStr.indexOf(splitchar, pos);
              val = parseInt(dateStr.substring(pos, pos1));
              dateStr = dateStr.substring(0, pos) + dateStr.substring(pos1); // 日期字符串上删除匹配上的内容
            }
          } else {
            // 匹配到完整字符情况，可以直接以位置比对
            pos = formatStr.indexOf(matchStr);
            val = parseInt(dateStr.substring(pos, pos + matchStr.length));
            dateStr = dateStr.substring(0, pos) + dateStr.substring(pos + matchStr.length); // 日期字符串上删除匹配上的内容
          }
          regObj = new RegExp(matchStr);
          formatStr = formatStr.replace(regObj, ''); // 删除本次匹配结果
        }
        // console.debug('searchStr:', searchStr, 'matchStr:', matchStr, 'dateStr:', dateStr, 'val:', val);
        // 日期添加值，并去除搜索字符串中已处理的内容，防止对第二次出现的内容再进行处理
        switch (matchStr) {
          case 'yyyy':
          case 'yy':
            dret.setYear(val);
            searchStr = searchStr.replace('yyyy|yy', '').replace(/^(\s|\|*)|(\s|\|)+$/g, ''); // 移除后再去头尾的|
            break;
          case 'MM':
          case 'M':
            dret.setMonth(val - 1); // 月份是从0开始
            searchStr = searchStr.replace('MM|M', '').replace(/^(\s|\|*)|(\s|\|)+$/g, ''); // 移除后再去头尾的|
            break;
          case 'dd':
          case 'd':
            dret.setDate(val);
            searchStr = searchStr.replace('dd|d', '').replace(/^(\s|\|*)|(\s|\|)+$/g, ''); // 移除后再去头尾的|
            break;
          case 'hh':
          case 'h':
            dret.setHours(val);
            searchStr = searchStr.replace('hh|h', '').replace(/^(\s|\|*)|(\s|\|)+$/g, ''); // 移除后再去头尾的|
            break;
          case 'mm':
          case 'm':
            dret.setMinutes(val);
            searchStr = searchStr.replace('mm|m', '').replace(/^(\s|\|*)|(\s|\|)+$/g, ''); // 移除后再去头尾的|
            break;
          case 'ss':
          case 's':
            dret.setSeconds(val);
            searchStr = searchStr.replace('ss|s', '').replace(/^(\s|\|*)|(\s|\|)+$/g, ''); // 移除后再去头尾的|
            break;
          default:
            searchNext = false; // 没有匹配到任何一个，结束匹配
            break;
        }
      } catch (e) {
        searchNext = false; // 异常，结束匹配
      }
    }
    // 返回
    return dret;
  },

  /**
   * 计算两个日期之间的时间差
   * @param {Date} firstday - 开始日期
   * @param {Date} lastday - 结束日期
   * @param {string} unit - 计算单位(默认为日), y-年, M-月, d-日, h-小时, m-分钟, s-秒, w-周
   * @returns {float} - 时间差
   */
  timeBetween: timeBetween,

  /**
   * 日期计算，获取增加指定单位时间的新日期
   * @param {Date} date - 当前日期
   * @param {float} timevalue - 要增加的值
   * @param {string} unit - 值单位(默认为日), y-年, M-月, d-日, h-小时, m-分钟, s-秒, w-周
   * @returns {Date} - 增加单位时间后的新日期时间对象
   */
  addTime: (date, timevalue, unit) => {
    // unit默认为d
    if (unit === undefined) {
      unit = 'd';
    }
    let newd = 0;
    var dtTmp = date;
    switch (unit) {
      case 's':
        return new Date(Date.parse(dtTmp) + (1000 * timevalue));
      case 'm':
        return new Date(Date.parse(dtTmp) + (60000 * timevalue));
      case 'h':
        return new Date(Date.parse(dtTmp) + (3600000 * timevalue));
      case 'd':
        return new Date(Date.parse(dtTmp) + (86400000 * timevalue));
      case 'w':
        return new Date(Date.parse(dtTmp) + (604800000 * timevalue));
      case 'M':
      // 月份的情况，需考虑有小数的问题
        newd = new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + parseInt(timevalue), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        return new Date(Date.parse(newd) + (timevalue - parseInt(timevalue)) * 2592000000);
      case 'y':
      // 年的情况，需考虑有小数的问题
        newd = new Date((dtTmp.getFullYear() + parseInt(timevalue)), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        // 小数部分
        return new Date(Date.parse(newd) + (timevalue - parseInt(timevalue)) * 31536000000);
      default:
        return new Date(Date.parse(dtTmp) + (86400000 * timevalue));
    }
  },

  /**
   * 获得当前月的最大天数（最后一天的day值）
   * @param {Date} date - 要获取的日期
   * @returns {int} - 最大天数
   */
  maxOfMonth: (date) => {
    var day = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    var day2 = day.add(-1, 'd');
    return day2.getDate();
  },

  /**
   * 获得当前日期是当年的第几周
   * @param {Date} date - 要获取的日期
   * @returns {int} - 第几周
   */
  weekOfYear: (date) => {
    var firstday = new Date(date.getFullYear(), 0, 1); // 一年中的第1天
    var lastday = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // 当天
    var begin;
    if (firstday.getDay() === 0) {
      // 1月1号是星期天
      begin = 1;
    } else {
      // 找到第一个星期天
      firstday = firstday.add(7 - firstday.getDay(), 'd');
      begin = 2;
    }
    var weeks = parseInt(timeBetween(firstday, lastday, 'w') + begin); // 用parseInt取整数
    return weeks;
  },

  /**
   * 获得当前日期是当月的第几周
   * @param {Date} date - 要获取的日期
   * @returns {int} - 第几周
   */
  weekOfMonth: (date) => {
    var firstday = new Date(date.getFullYear(), date.getMonth(), 1); // 一年中的第1天
    var lastday = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // 当天
    var begin;
    if (firstday.getDay() === 0) {
      // 1月1号是星期天
      begin = 1;
    } else {
      // 找到第一个星期天
      firstday = firstday.add(7 - firstday.getDay(), 'd');
      begin = 2;
    }
    var weeks = parseInt(timeBetween(firstday, lastday, 'w') + begin); // 用parseInt取整数
    return weeks;
  }
};
