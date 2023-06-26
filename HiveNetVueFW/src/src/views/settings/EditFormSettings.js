/**
 * 标准编辑窗口的配置
 */

module.exports = {
  // 表单配置
  form: {
    labelPosition: 'right', // 表单域标签的位置, left / right / top
    mobileLabelPosition: 'top', // 移动模式下表单域标签的位置
    labelWidth: '80px', // 表单域标签的宽度, 支持auto
    fixedSize: '', // 如果设置了则固定表单组件的大小（large / default / small），如果没有设置，则根据主框架的size自动变化
    gridRowNumber: 12, // 设置页面布局的格子数量
    gridRowspan: 4, // 默认表单每个对象占的格子数量
    gridRowMinSize: '90px', // 每个格子的最小大小设置
    gridRowOverflow: 'hidden', // 当内容超过格子的处理方式，hidden / visible / scroll / ...
    spaceSize: '8px', // 组件之间的间隔大小
    errorEllipsis: false // 错误提示超长时单行按省略号显示
  }
};
