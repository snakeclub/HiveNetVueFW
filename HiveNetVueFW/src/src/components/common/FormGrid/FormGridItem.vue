<template>
    <div ref="FormGridItem" :class="{'form-grid-item': true, 'form-grid-item-use-colspan': useColSpan}">
        <div v-if="nullItem" class="form-grid-null-item"></div>
        <slot v-else></slot>
    </div>
</template>

<script>
  /**
   * 表单栅格布局格子组件
   */
  import PropsWatchMixins from './PropsWatchMixins';
  import StringTools from '@/utils/base/StringTools';

  export default {
    name: 'FormGridItem',
    mixins: [PropsWatchMixins],
    data() {
      return {
        // 设置要监控的属性
        WatchProps: ['rowSpan', 'colSpan'],
        // 自定义处理样式的属性
        SelfDealProps: ['colSpan'],
        // 设置样式的ref对象名
        StyleObjRefName: 'FormGridItem'
      };
    },
    props: {
      // 对象占用的横向格子数
      rowSpan: {
        type: Number,
        default: 8
      },
      // 对象占用的纵向格子数
      colSpan: {
        type: Number,
        default: undefined
      },
      // 指定是否空对象(用于占位使用)
      nullItem: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      // 必须返回整个props对象, 供统一监听变化使用
      return { props };
    },
    computed: {
      // 是否使用colspan控制高度
      useColSpan() {
        return this.colSpan !== undefined;
      }
    },
    methods: {
      //重载组件自定义的样式处理, 返回要处理的样式数组[{cssName: xxx, cssValue: xxx}]
      // cssValue 如果设置为 undefined 代表删除样式
      // 返回 [] 代表不处理
      selfSetGridStyle(el, propName) {
        let cssList = [];
        if (propName === 'colSpan') {
          cssList.push({
            cssName: '--formGrid' + StringTools.firstCase(propName, true),
            cssValue: this[propName] === undefined ? 1 : String(this[propName])
          });
        }
        return cssList;
      }
    }
  };
</script>

<style lang="scss" scoped>
.form-grid-container {

  // 横向间隔模式设置
  &.h-padding-direction-both {
    .form-grid-item {
      padding-left: var(--formGridHPadding);
      padding-right: var(--formGridHPadding);
    }
  }

  &.h-padding-direction-right {
    .form-grid-item {
      padding-right: var(--formGridHPadding);
    }
  }

  &.h-padding-direction-left {
    .form-grid-item {
      padding-left: var(--formGridHPadding);
    }
  }

  .form-grid-item {
    /*
    &:first-child {
      // 第一个元素
      background-color: bisque;
    }
    &:last-child {
      // 最后一个元素
      background-color: black;
    }
    &:not(:first-child) {
      &:not(:last-child) {
        background-color: aqua;
      }
    }
    */

    // 设置支持内容垂直位置, 注意只支持一个子元素的情况，如果有多个子元素，自行实现对应的align-items的style设置
    display: flex;
    :only-child {
      align-items: var(--formGridAlignment);
      width: 100%; // 宽度占满
      align-self: center;
    }

    // 根据占格确定宽度
    width: calc((100% / var(--formGridRowSplitNumber)) * var(--formGridRowSpan));
    min-width: min(
      max(calc(var(--formGridGridMinWidth) * var(--formGridRowSpan)), var(--formGridItemMinWidth)),
      var(--formGridItemMaxWidth)
    );
    max-width: var(--formGridItemMaxWidth);

    // 根据占格确定高度
    &.form-grid-item-use-colspan {
      min-height: calc(var(--formGridColUnitHeight) * var(--formGridColSpan));
    }

    // 内容超出格子大小时的设置
    overflow: var(--formGridOverFlow);

    // 空对象的div样式
    .form-grid-null-item {
      width: 100%;
      height: 100%;
      background-color: transparent;
    }
  }
}

// 移动模式下的样式控制
.mobile {
  .form-grid-container {
    &.auto-switch-mobile-mode {
      .form-grid-item {
        // 不设置间隔, 宽度全部占满
        padding-left: 0px;
        padding-right: 0px;
        width: 100%;
        min-width: 100%;
      }
    }

  }
}
</style>