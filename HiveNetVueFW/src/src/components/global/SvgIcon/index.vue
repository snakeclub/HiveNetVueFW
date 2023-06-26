<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    v-on="$attrs"
  />

  <el-icon v-else-if="isElIcon" :class="elIconClass">
    <component :is="elIconName"></component>
  </el-icon>
  <el-icon v-else :class="elIconClass">
    <svg aria-hidden="true" v-on="$attrs">
      <use :xlink:href="iconName" />
    </svg>
  </el-icon>
</template>

<script>
import { defineComponent } from 'vue';
import { isExternal } from '@/utils/base/NetTools';

export default defineComponent({
  /**
   * SvgIcon组件，用于显示 assets/icons/svg 下的图标
   * 用法参考：
   * <svg-icon icon-class="phone" />
   * <svg-icon icon-class="message" class-name="card-panel-icon" />
   * 注：v-on="$listeners" 要替换为 v-on="$attrs"，这是因为vue3废弃了$listeners
   */
  name: 'SvgIcon',
  props: {
    // 图标标识（图标文件名）
    iconClass: {
      type: String,
      required: true
    },
    // 指定的css样式类名
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 是否外部链接图标
    isExternal() {
      return isExternal(this.iconClass);
    },
    // 是否element-plus的图标
    isElIcon() {
      return this.iconClass.startsWith('el-icon-');
    },
    // element-plus的图标名，例如i-xxx
    elIconName() {
      return this.iconClass.replace('el-icon-', 'i-');
    },
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    // 组合样式
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className;
      } else {
        return 'svg-icon';
      }
    },
    elIconClass() {
      if (this.className) {
        return 'svg-icon-el-icon svg-icon ' + this.className;
      } else {
        return 'svg-icon-el-icon svg-icon';
      }
    },
    // 外部链接图标的样式
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      };
    }
  }
});
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}

.svg-icon-el-icon {
  // 修复element图标宽度高度没有占位的问题
  width: fit-content;
  height: fit-content;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
