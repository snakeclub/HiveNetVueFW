<template>
  <div ref="GridItem">
      <slot></slot>
  </div>
</template>

<script>
/**
 * 栅格布局中的格子对象容器，根据参数配置设置内容占用的格子数量
 */
import WebTools from '@/utils/base/WebTools';

export default {
  name: 'GridItem',
  props: {
    // 占用的行数
    rowspan: {
      type: String,
      default: ''
    },
    // 占用的列数
    colspan: {
      type: String,
      default: ''
    },
    // 行占用所设置的样式名
    rowspanStyle: {
      type: String,
      default: '--gridRowspan'
    },
    // 列占用所设置的样式名
    colspanStyle: {
      type: String,
      default: '--gridColspan'
    },
    // 要设置样式到的对象CSS选择器, 默认设置在父元素上
    setTargetSelector: {
      type: String,
      default: ''
    },
    // 是否从文档节点开始查找，默认从当前组件开始查找
    selectorFromDocument: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.setGridStyle();
  },
  methods: {
    // 设置样式
    setGridStyle() {
      // 查找目标元素
      let targetEl;
      if (this.setTargetSelector === '') {
        targetEl = this.$refs.GridItem.parentNode;
      } else if (this.selectorFromDocument) {
        targetEl = window.document.querySelector(this.setTargetSelector);
      } else {
        targetEl = this.$refs.GridItem.querySelector(this.setTargetSelector);
      }
      if (!targetEl) targetEl = this.$refs.GridItem; // 设置在自身

      // 执行设置
      if (this.rowspan !== '') WebTools.addStyle(targetEl, this.rowspanStyle, this.rowspan);
      if (this.colspan !== '') WebTools.addStyle(targetEl, this.colspanStyle, this.colspan);
    }
  },
};
</script>