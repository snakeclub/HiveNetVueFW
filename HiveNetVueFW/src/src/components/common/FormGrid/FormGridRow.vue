<template>
    <div ref="FormGridRow" class="form-grid-row">
        <slot></slot>
    </div>
</template>

<script>
  /**
   * 表单栅格布局行组件
   */
  import { inject } from 'vue';
  import PropsWatchMixins from './PropsWatchMixins.js';

  export default {
    name: 'FormGridRow',
    mixins: [PropsWatchMixins, ],
    data() {
      return {
        // 设置要监控的属性
        WatchProps: [
            'rowSplitNumber', 'rowSpanDefault', 'gridMinWidth', 'itemMinWidth',
            'colUnitHeight', 'hPadding',
            'overFlow', 'alignment', 'autoWrap'
        ],
        // 自定义处理样式的属性
        SelfDealProps: ['autoWrap'],
        // 设置样式的ref对象名
        StyleObjRefName: 'FormGridRow'
      };
    },
    props: {
      // 行自定义的横向切割的格子数量
      rowSplitNumber: {
        type: Number,
        required: false
      },
      // 行自定义的默认每个格子占用的格子数
      rowSpanDefault: {
        type: Number,
        required: false
      },
      // 行自定义的每个格子的最小宽度(与itemMinWidth共同控制, 取两个参数最大值)
      gridMinWidth: {
        type: String,
        required: false
      },
      // 行自定义的每个对象的最小宽度（与gridMinWidth共同控制, 取两个参数最大值）
      itemMinWidth: {
        type: String,
        required: false
      },
      // 行自定义的每个对象的最大宽度（设置为100%控制每个对象不会超过屏幕宽度, 如果不控制请设置一个最大值, 例如10000px）
      itemMaxWidth: {
        type: String,
        required: false
      },
      // 行自定义的默认的列单位高度, 用于设置格子高度
      colUnitHeight: {
        type: String,
        required: false
      },
      // 行自定义的横向间隔大小
      hPadding: {
        type: String,
        require: false
      },
      // 行自定义的内容超过大小的显示方式, overflow 的 css样式
      overFlow: {
        type: String,
        required: false
      },
      // 行自定义的同一行格子的对齐方式, center/flex-start/flex-end
      alignment: {
        type: String,
        required: false
      },
      // 行自定义的显示宽度小于行宽度时(因为gridMinSize的影响)，是否自动换行
      autoWrap: {
        type: Boolean,
        default: undefined,
        required: false
      }
    },
    setup(props) {
        // 获取祖父组件的属性值
        const formGridProps = inject('formGridProps');

        // 返回整个props对象, 供统一监听变化使用
        return { props, formGridProps };
    }
  };
</script>

<style lang="scss" scoped>
.form-grid-container {
  .form-grid-row {
    display: flex;
    flex-flow: var(--formGridAutoWrap);
    align-items: var(--formGridAlignment);
  }
}

// 移动模式
.mobile {
  .form-grid-container {
    &.auto-switch-mobile-mode {
      .form-grid-row {
        flex-flow: wrap;
      }
    }
  }
}
</style>