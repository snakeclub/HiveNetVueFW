/**
 * 标准编辑窗口的Mixin
 * 需组合依赖 IframeChildMixins 和 IframeSizeMixins
 */
import store from '@/store';
import WebTools from '@/utils/base/WebTools';
import EditFormSettings from '../settings/EditFormSettings';

export default {
  data() {
    return {
      // 设置一些默认值，在实际页面上可以覆盖这些默认值
      labelWidth: EditFormSettings.form.labelWidth,
      fixedSize: EditFormSettings.form.fixedSize,
      gridRowNumber: EditFormSettings.form.gridRowNumber,
      gridRowspan: EditFormSettings.form.gridRowspan,
      gridRowMinSize: EditFormSettings.form.gridRowMinSize,
      gridRowOverflow: EditFormSettings.form.gridRowOverflow,
      spaceSize: EditFormSettings.form.spaceSize,
      errorEllipsis: EditFormSettings.form.errorEllipsis
    };
  },
  computed: {
    // 表单域标签的位置
    labelPosition() {
      if (store.state.app.device === 'mobile') {
        return EditFormSettings.form.mobileLabelPosition;
      } else {
        return EditFormSettings.form.labelPosition;
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
  },
  mounted() {
    // 初始化网格样式
    this.initGridStyle();
  },
  methods: {
    // 对组件中的 edit-form-container 容器设置表格样式
    initGridStyle() {
      const webContainerEl = this.$refs.webMainContainer;
      const editFormContainers = webContainerEl.querySelectorAll('.edit-form-container');
      for (const el of editFormContainers) {
        WebTools.addStyle(el, '--gridRowNumber', String(this.gridRowNumber));
        WebTools.addStyle(el, '--gridRowspan', String(this.gridRowspan));
        WebTools.addStyle(el, '--gridRowMinSize', this.gridRowMinSize);
        WebTools.addStyle(el, '--gridRowOverflow', this.gridRowOverflow);
        WebTools.addStyle(el, '--spaceSize', this.spaceSize);
      }
    }
  }
};
