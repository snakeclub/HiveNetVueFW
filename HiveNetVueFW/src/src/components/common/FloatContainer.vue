<template>
  <div ref="FloatContainer" :class="{
    'float-container': true, 'float-container-fixed': floatType !== 'none'
    }">
      <slot></slot>
  </div>
</template>

<script>
  /**
   * 在父元素内按相对位置浮动的容器
   */
  import elementResizeDetectorMaker from 'element-resize-detector';


  export default {
    name: 'FloatContainer',
    data() {
      return {
        targetEl: undefined, // 关联目标元素，如果有值代表有进行浮动设置且已监听
        elementSizeChangeListener: undefined, // 元素大小变化的监听对象
        contentNativeMargin: undefined // 内容原本的margin值
      }
    },
    props: {
      // 浮动类型，none-非浮动模式, float-固定位置浮动，screen-在屏幕指定位置浮动
      floatType: {
        type: String,
        default: 'float'
      },
      /**
       * 浮动对象要关联到的元素的CSS选择器，如果不传则默认为父元素，如果选择器找不到对象，则默认为document
       * 注意：浮动位置、元素展现大小会跟该选择器有关系
       */
      targetElSelector: {
        type: String,
        default: ''
      },
      /**
       * 设置浮动方向，如果设置了将自动为下一个对象增加margin以保证不遮挡内容
       *   none - 不设置margin
       *   left - 浮动在左边
       *   right - 浮动在右边
       *   top - 浮动在上边
       *   bottom - 浮动在下边
       */
      containerDirection: {
        type: String,
        default: 'none'
      },
      // 距离四边位置设置
      posLeft: {
        type: String,
        required: false
      },
      posRight: {
        type: String,
        required: false
      },
      posTop: {
        type: String,
        required: false
      },
      posBottom: {
        type: String,
        required: false
      },
      // 设置z-index，遇到被遮挡时应进行设置，同时会设置所有兄弟节点的z-index为该值减1
      zIndex: {
        type: String,
        default: ''
      },
      // 指定100%宽度
      fullWidth: {
        type: Boolean,
        default: false
      },
      // 指定100%高度
      fullHeight: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      if (this.floatType !== 'none') {
        this.setTargetEl()
        this.setPositionAndSize();
        this.addResizeLinstener();
      }
    },
    beforeUnmount() {
      // 移除监听
      if (this.elementSizeChangeListener) {
        this.elementSizeChangeListener.uninstall(this.targetEl);
      }
    },
    methods: {
      // 设置元素大小的监听
      addResizeLinstener() {
        this.elementSizeChangeListener = elementResizeDetectorMaker({
          strategy: 'scroll', // <- For ultra performance.
          callOnAdd: true,
          debug: false
        });
        const _this = this;
        this.elementSizeChangeListener.listenTo(this.targetEl, function(el) {
          // 监听关联元素的大小变化
          _this.setPositionAndSize()
        });
      },

      // 获取关联元素
      setTargetEl() {
        const floatContainer = this.$refs.FloatContainer;
        if (this.targetElSelector === '') {
          this.targetEl = floatContainer.parentNode;
        } else {
          this.targetEl = window.document.querySelector(this.targetElSelector);
        }
        if (!this.targetEl) {
          // 找不到则以document作为默认关联元素
          this.targetEl = window.document.documentElement;
        }
      },

      // 设置元素的位置和大小
      setPositionAndSize() {
        const floatContainer = this.$refs.FloatContainer;

        // 获取元素的定位关联父元素
        let offsetEl = this.targetEl.offsetParent;
        offsetEl = offsetEl ? offsetEl : document.documentElement;

        // 设置100%宽度和高度，如果不修改，宽度为offsetParent的宽度
        if (this.fullWidth) {
          const delWidth = offsetEl.clientWidth - this.targetEl.clientWidth;
          floatContainer.style.width = 'calc(100% - ' + delWidth + 'px)';
        }
        if (this.fullHeight) {
          const delHeight = offsetEl.clientHeight - this.targetEl.clientHeight;
          floatContainer.style.height = 'calc(100% - ' + delHeight + 'px)';
        }

        // 计算元素的位置信息
        let posInfo;
        if (this.floatType === 'screen') {
          // 直接按屏幕位置处理即可
          posInfo = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
          }
        } else {
          posInfo = {
            left: this.targetEl.offsetLeft,
            top: this.targetEl.offsetTop,
            right: Math.max(0, document.documentElement.offsetWidth - this.targetEl.offsetLeft - this.targetEl.offsetWidth),
            bottom: Math.max(0, document.documentElement.offsetHeight - this.targetEl.offsetTop - this.targetEl.offsetHeight)
          }
        }

        // 注意，对于left和top，如果为0时可以不进行设置，则默认为父元素上的初始位置
        // 先取消所有位置的设置
        floatContainer.style.left = '';
        floatContainer.style.top = '';
        floatContainer.style.right = '';
        floatContainer.style.bottom = '';
        // 设置位置值
        let setValue;
        if (this.posLeft) {
          setValue = posInfo.left + parseInt(this.posLeft)
          floatContainer.style.left = setValue + 'px';
        }
        if (this.posTop) {
          setValue = posInfo.top + parseInt(this.posTop)
          floatContainer.style.top = setValue + 'px';
        }
        if (this.posRight) {
          setValue = posInfo.right + parseInt(this.posRight)
          floatContainer.style.right = setValue + 'px';
        }
        if (this.posBottom) {
          setValue = posInfo.bottom + parseInt(this.posBottom)
          floatContainer.style.bottom = setValue + 'px';
        }

        // 设置z-index
        if (this.zIndex !== '') {
          floatContainer.style['z-index'] = this.zIndex;
          const siblingZIndex = parseInt(this.zIndex) - 1;
          let siblingEl = floatContainer.nextSibling;
          while (siblingEl) {
            if (siblingEl.style) {
              siblingEl.style['z-index'] = siblingZIndex;
            }
            siblingEl = siblingEl.nextSibling;
          }
        }

        // 设置内容的margin
        this.$nextTick(() => {
          // 重建控件
          this.setContentMargin();
        });
      },

      // 设置内容margin
      setContentMargin() {
        if (this.containerDirection !== 'none') {
          const floatContainer = this.$refs.FloatContainer;
          // 找到第一个可设置的元素
          let content = floatContainer.nextSibling;
          while(content !== undefined && content.style === undefined) {
            content = content.nextSibling;
          }
          if (!content) {
            // 没有找到内容
            return;
          }
          // 获取原生的margin值
          if (this.contentNativeMargin === undefined) {
            const margin = window.getComputedStyle(content)['margin-' + this.containerDirection];
            this.contentNativeMargin = margin === undefined ? 0 : parseInt(margin);
          }
          let setMargin;
          if (['top', 'bottom'].includes(this.containerDirection)) {
            setMargin = floatContainer.offsetHeight + this.contentNativeMargin;
          } else {
            setMargin = floatContainer.offsetWidth + this.contentNativeMargin;
          }
          content.style['margin-' + this.containerDirection] = setMargin + 'px';
        }
      }
    },

  };
</script>

<style lang="scss" scoped>
  .float-container {
    display: block;
    width: fit-content;
    height: fit-content;
    background-color: transparent;

    &.float-container-fixed {
        position: fixed;
    }
  }
</style>