<template>
    <div ref="FormGrid" class='form-grid-container'>
        <slot></slot>
    </div>
</template>

<script>
  /**
   * 表单栅格布局组件
   */
  import { provide } from 'vue';
  import PropsWatchMixins from './PropsWatchMixins.js';

  export default {
    name: 'FormGrid',
    mixins: [PropsWatchMixins, ],
    data() {
      return {
        // 设置要监控的属性
        WatchProps: [
          'rowSplitNumber', 'rowSpanDefault', 'gridMinWidth', 'itemMinWidth', 'itemMaxWidth',
          'colUnitHeight', 'hPadding', 'hPaddingDirection',
          'overFlow', 'alignment', 'autoWrap', 'autoSwitchMobileMode'
        ],
        // 自定义处理样式的属性
        SelfDealProps: ['autoWrap', 'hPaddingDirection', 'autoSwitchMobileMode'],
        // 设置样式的ref对象名
        StyleObjRefName: 'FormGrid'
      };
    },
    props: {
      // 横向切割的格子数量
      rowSplitNumber: {
        type: Number,
        default: 24
      },
      // 默认每个格子占用的格子数
      rowSpanDefault: {
        type: Number,
        default: 8
      },
      // 每个格子的最小宽度(与itemMinWidth共同控制, 取两个参数最大值, 注意两个参数单位要统一)
      gridMinWidth: {
        type: String,
        default: '20px'
      },
      // 每个对象的最小宽度（与gridMinWidth共同控制, 取两个参数最大值, 注意两个参数单位要统一）
      itemMinWidth: {
        type: String,
        default: '200px'
      },
      // 每个对象的最大宽度（设置为100%控制每个对象不会超过屏幕宽度, 如果不控制请设置一个最大值, 例如10000px）
      itemMaxWidth: {
        type: String,
        default: '100%'
      },
      // 默认的列单位高度, 用于设置格子高度
      colUnitHeight: {
        type: String,
        default: '20px'
      },
      // 横向间隔大小(设置格子的padding-left, padding-right大小)
      hPadding: {
        type: String,
        default: '8px'
      },
      // 横向间隔方向, left/right/both
      hPaddingDirection: {
        type: String,
        default: 'right'
      },
      // 内容超过大小的显示方式, 对象的overflow 的 css样式
      overFlow: {
        type: String,
        default: 'unset'
      },
      // 同一行格子的对齐方式, center/flex-start/flex-end
      alignment: {
        type: String,
        default: 'flex-start'
      },
      // 显示宽度小于行宽度时(因为gridMinSize的影响)，是否自动换行
      autoWrap: {
        type: Boolean,
        default: true
      },
      // 当显示大小变成移动设备大小时，是否自动切换到移动模式(从上到下纵向排列)
      autoSwitchMobileMode: {
        type: Boolean,
        default: true
      }
    },
    setup(props) {
      // 将属性传递到子孙组件
      provide('formGridProps', props);
      // 必须返回整个props对象, 供统一监听变化使用
      return { props };
    }
  };
</script>

<style lang="scss" scoped>
.form-grid-container {
    width: 100%;
    text-align: start;
}
</style>