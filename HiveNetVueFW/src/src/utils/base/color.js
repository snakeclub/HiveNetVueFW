/**
 * 主题颜色处理的相关函数
 */

/**
 * 将hex表示方式转换为rgb
 * @param {String} hexColor 颜色十六进制
 * @return {Array} [r, g, b]格式
 */
export function colorToRgb(hexColor) {
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  let sColor = hexColor.toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    // 处理六位的颜色值
    const sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
    }
    return sColorChange;
  } else {
    return sColor;
  }
}

/**
 * 生成渐变颜色值数组
 * @param {String} startColor 开始颜色值（十六进制）
 * @param {String} endColor 结束颜色值（十六进制）
 * @param {Number} count 生成颜色个数
 * @param {Number} step 生成步数
 * @return {Array} 渐变颜色数组
 */
export function gradientColor(startColor, endColor, count, step) {
  const startRGB = colorToRgb(startColor); // 转换为rgb数组模式
  const startR = startRGB[0];
  const startG = startRGB[1];
  const startB = startRGB[2];

  const endRGB = colorToRgb(endColor);
  const endR = endRGB[0];
  const endG = endRGB[1];
  const endB = endRGB[2];

  const sR = (endR - startR) / step; // 总差值
  const sG = (endG - startG) / step;
  const sB = (endB - startB) / step;

  const generateRStr = (r, g, b) => {
    return 'rgb(' + parseInt(r) + ',' + parseInt(g) + ',' + parseInt(b) + ')';
  };

  const colorArr = [];
  for (let i = 0; i < step; i++) {
    // 计算每一步的rgb值
    if (count % 2 !== 0 && i === 0) {
      colorArr.push(generateRStr(startR, startG, startB));
    } else if (count % 2 !== 0 && i === step - 1) {
      colorArr.push(generateRStr(endR, endG, endB));
    } else {
      colorArr.push(generateRStr(sR * i + startR, sG * i + startG, sB * i + startB));
    }
  }
  return colorArr;
}

/**
 * 根据一组颜色生成渐变色
 * @param {Array} colorArr 颜色数组
 * @param {Number} count 生成颜色个数
 */
export function multipleGradientColor(colorArr = [], count = 5) {
  const arr = [];
  const cLen = colorArr.length;
  if (count === 1) return [colorArr[0]];
  if (count === 2) return [colorArr[0], colorArr[cLen - 1]];

  const devid = Math.ceil(count / (cLen - 1)); // 每两个渐变色产生的颜色个数
  for (let i = 0, len = cLen - 1; i < len; i++) {
    arr.push(...gradientColor(colorArr[i], colorArr[i + 1], count, devid));
  }
  const removeLen = arr.length - count;
  if (removeLen > 0) { // 移除多余 count 的颜色
    for (let j = removeLen; j > 0; j--) {
      arr.splice(j * devid, 1);
    }
  }

  return arr;
}

/**
 * 判断颜色是否为浅色系
 * @param {String} rgbColor rgb颜色值
 * @return {Boolean} 返回 true or false
 */
export function isLightColor(rgbColor) {
  const split = rgbColor.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',');
  const level = split[0] * 0.299 + split[1] * 0.587 + split[2] * 0.114;
  if (level >= 192) {
    return true;
  }
  return false;
}

/**
 * 生成主题颜色的9级浅色色调颜色
 * @param {string} themeColor - 十六进制的颜色，例如#0960bd
 * @returns {array} - 生成的主题颜色色调颜色数组
 *    0 - 9: 颜色从深到浅，16进制颜色
 *    10: 主题颜色加强颜色（激活状态）
 */
export function getThemeColorLight(themeColor) {
  // 浅色颜色的生成函数，color为主颜色，tint为级别，从1-9
  const tintColor = (color, tint) => {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);

    red += Math.round(tint * (255 - red));
    green += Math.round(tint * (255 - green));
    blue += Math.round(tint * (255 - blue));

    red = Math.max(0, red).toString(16);
    green = Math.max(0, green).toString(16);
    blue = Math.max(0, blue).toString(16);

    if (red.length < 2) red = '0' + red;
    if (green.length < 2) green = '0' + green;
    if (blue.length < 2) blue = '0' + blue;

    return `#${red}${green}${blue}`;
  };

  // 生成颜色数组
  const clusters = [];
  const _themeColor = themeColor.replace('#', '');
  // 生成从主题色到白色之间的9级颜色色调
  for (let i = 1; i <= 9; i++) {
    clusters.push(tintColor(_themeColor, Number((i / 10).toFixed(2))));
  }
  // 生成颜色加强的激活颜色
  clusters.push(tintColor(_themeColor, Number((-2.5 / 10).toFixed(2))));
  return clusters;
}

