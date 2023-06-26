/**
 * 通用表单样式控制的mixin代码
 * 用法：
 * export default {
 *   mixins: [CommonFormMixin],
 *   ...
 * }
 */
import store from '@/store';

export default {
  data() {
    return {
      webLabelPosition: 'right', // PC模式表单域标签的位置, left / right / top
      mobileLabelPosition: 'top', // 移动模式下表单域标签的位置
      labelWidth: '80px', // 表单域标签的宽度, 支持auto
      fixedSize: '' // 如果设置了则固定表单组件的大小（large / default / small），如果没有设置，则根据主框架的size自动变化
    };
  },
  computed: {
    // 表单域标签的位置
    labelPosition() {
      if (store.state.app.device === 'mobile') {
        return this.mobileLabelPosition;
      } else {
        return this.webLabelPosition;
      }
    },
    // 编辑表单的组件大小设置
    editFormSize() {
      if (this.fixedSize !== '') {
        return this.fixedSize;
      } else {
        return this.layoutSize;
      }
    }
  }

};
