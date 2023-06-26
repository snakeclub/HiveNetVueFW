<template>
  <div class="panel-resize panel-resize-right" v-if="showDirection('r')"
    @mousedown="startResize('r', $event)"
  ></div>
  <div class="panel-resize panel-resize-down" v-if="showDirection('d')"
    @mousedown="startResize('d', $event)"
  ></div>
  <div class="panel-resize panel-resize-left" v-if="showDirection('l')"
    @mousedown="startResize('l', $event)"
  ></div>
  <div class="panel-resize panel-resize-up" v-if="showDirection('u')"
    @mousedown="startResize('u', $event)"
  ></div>
  <div class="panel-resize panel-resize-right-up" v-if="showDirection('ru')"
    @mousedown="startResize('ru', $event)"
  ></div>
  <div class="panel-resize panel-resize-right-down" v-if="showDirection('rd')"
    @mousedown="startResize('rd', $event)"
  ></div>
  <div class="panel-resize panel-resize-left-down" v-if="showDirection('ld')"
    @mousedown="startResize('ld', $event)"
  ></div>
  <div class="panel-resize panel-resize-left-up" v-if="showDirection('lu')"
    @mousedown="startResize('lu', $event)"
  ></div>
</template>

<script>
/**
 * 通过拖放组件边缘改变控件大小
 */
export default {
  name: 'PanelResize',
  props: {
    /**
     * 动作类型
     * css - 直接通过css的style属性改变父元素（非父组件）的大小和位置
     * feedback - 仅向父组件反馈信息，由父组件自行处理改变大小的操作
     */
    action: {
      default: 'css',
      type: String
    },
    /**
     * 当类型为feedback时, 传回鼠标动作信息对象，格式为：
     * {
     *   mouseType: 'move', // 鼠标动作类型，move-鼠标移动, done-释放鼠标确定最终值
     *   direction: '', // 改变大小的方向，r-向右，d-向下，l-向左，u-向上，rd-向右下角, ...
     *   startX: 0, // 按下鼠标的X位置
     *   startY: 0, // 按下鼠标的Y位置
     *   currentX: 0, // 当前鼠标X位置
     *   currentY: 0, // 当前鼠标Y位置
     * }
     */
    feedbackFun: {
      required: false,
      type: Function
    },
    /**
     * 支持改变大小的方向，通过数组指定，完整数组为：
     * ['r', 'd', 'l', 'u', 'rd', 'ld', 'lu', 'ru']
     */
    directions: {
      default: ['r', 'd', 'l', 'u', 'rd', 'ld', 'lu', 'ru'],
      type: Array
    },
    /**
     * 是否不处理位置信息
     */
    noPosition: {
      default: false,
      type: Boolean
    },
    /**
     * 改变大小的限制，通过指定类型方式控制改变大小的行为（仅css模式有效）
     *  {
     *    maxWidth: 100, // 限制元素的最大宽度
     *    minWidth: 100, // 限制元素的最小宽度
     *    maxHeight: 100, // 限制元素的最大高度
     *    minHeight: 100  // 限制元素的最小高度
     *  }
     */
    limit: {
      default: {},
      type: Object
    }
  },
  data() {
    return {
      mouseDown: false,  // 指示当前是否正在拖动
      el: undefined, // 要改变的对象元素（原生dom元素）
      direction: '', // 拖动的方向
      startX: 0, // 开始的x坐标
      startY: 0, // 开始的y坐标
      elStartWidth: 0, // 开始时元素的宽度
      elStartHeight: 0, // 开始时元素的高度
      elTop: 0, // 开始时元素的Y位置
      elLeft: 0, // 开始时元素的X位置
      dealLimit: {}, // 处理中限制条件
      noLimit: true, // 判断是否无需限制
      currentCursor: '', // 当前body的鼠标指针样式
      cursorDict: {
        'r': 'ew-resize',
        'l': 'ew-resize',
        'u': 'ns-resize',
        'd': 'ns-resize',
        'ru': 'nesw-resize',
        'ld': 'nesw-resize',
        'lu': 'nwse-resize',
        'rd': 'nwse-resize'
      }
    }
  },
  emits: ['panelResizeBack'],
  methods: {
    // 判断是否展示拖动控件
    showDirection(direction) {
      return this.directions.includes(direction);
    },
    // 开始拖动
    startResize(direction, event) {
      if (this.mouseDown) {
        // 状态不对，说明前一次处理没有结束，先尝试关闭上一次的处理
        window.removeEventListener('mousemove', this.mouseMove);
        window.removeEventListener('mouseup', this.stopResize);
      }
      // 设置基础参数
      this.mouseDown = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.direction = direction;
      if (this.action !== 'feedback') {
        // css模式，还要获取元素的信息
        this.el = this.$parent.$el;
        const styles = window.getComputedStyle(this.$parent.$el);
        this.elStartWidth = parseInt(styles.width);
        this.elStartHeight = parseInt(styles.height);
        this.elTop = parseInt(styles.top);
        this.elLeft = parseInt(styles.left);
        // 限制信息预处理
        if (JSON.stringify(this.limit) === '{}') {
          this.noLimit = true;
          this.dealLimit = {};
        } else {
          this.noLimit = false;
          this.dealLimit = {
            maxWidth: this.limit.maxWidth ? this.limit.maxWidth : -1,
            minWidth: Math.max(0, this.limit.minWidth ? this.limit.minWidth : 0),
            maxHeight: this.limit.maxHeight ? this.limit.maxHeight : -1,
            minHeight: Math.max(0, this.limit.minHeight ? this.limit.minHeight : 0)
          }
        }
      }
      // 如果有modal对象，打开透明遮罩，避免其他对象的事件影响
      if (this.$modal) {
        this.$modal.transparentLoading();
      }
      // 改变鼠标指针
      const body = document.querySelector('body');
      this.currentCursor = body.style.cursor;
      body.style.cursor = this.cursorDict[direction];

      // 监听鼠标动作开始执行处理
      window.addEventListener('mouseup', this.stopResize);
      window.addEventListener('mousemove', this.mouseMove);
    },

    // 停止修改大小（鼠标释放）
    stopResize(event) {
      // 先停止监听
      window.removeEventListener('mousemove', this.mouseMove);
      window.removeEventListener('mouseup', this.stopResize);
      // 恢复鼠标指针
      const body = document.querySelector('body');
      body.style.cursor = this.currentCursor;
      // 关闭遮罩
      if (this.$modal) {
        this.$modal.closeLoading();
      }

      // 处理信息
      const info = {
        mouseType: 'done',
        direction: this.direction,
        startX: this.startX,
        startY: this.startY,
        currentX: event.clientX,
        currentY: event.clientY
      }
      if (this.action !== 'feedback') {
        // 处理元素的位置和大小计算和设置
        this.computeAndSetInfo(info);
      } else {
        // 返回结果模式
        this.$emit('panelResizeBack', info);
      }
    },

    // 移动鼠标
    mouseMove(event) {
      const info = {
        mouseType: 'move',
        direction: this.direction,
        startX: this.startX,
        startY: this.startY,
        currentX: event.clientX,
        currentY: event.clientY
      }
      if (this.action !== 'feedback') {
        // 处理元素的位置和大小计算和设置
        this.computeAndSetInfo(info);
      } else {
        // 返回结果模式
        this.$emit('panelResizeBack', info);
      }
    },

    // 处理元素的位置和大小计算和设置
    computeAndSetInfo(info) {
      let left, top, width, height;
      const xDis = info.currentX - info.startX;
      const yDis = info.currentY - info.startY;
      if (this.noPosition || ['r', 'rd', 'd'].includes(info.direction)) {
        // 不处理位置信息，只改变大小
        left = -1;
        top = -1;
      }
      if (['l', 'lu', 'ld'].includes(this.direction)) {
        // 向左拖动
        if (left === undefined) {
          left = this.elLeft + xDis;
          width = this.elStartWidth + (this.elLeft - left);
        } else {
          width = this.elStartWidth - xDis;
        }
      }

      if (['u', 'lu', 'ru'].includes(this.direction)) {
        // 向上拖动
        if (top === undefined) {
          top =this.elTop + yDis;
          height = this.elStartHeight + (this.elTop - top);
        } else {
          height = this.elStartHeight - yDis;
        }
      }

      if (['r', 'ru', 'rd'].includes(this.direction)) {
        // 向右拖动
        width = Math.max(0, this.elStartWidth + xDis);
      }

      if (['d', 'ld', 'rd'].includes(this.direction)) {
        // 向下拖动
        height = Math.max(0, this.elStartHeight + yDis);
      }

      if (!this.noLimit) {
        // 检查限制
        if (width !== undefined) {
          // 宽度处理
          if (this.dealLimit.maxWidth !== -1 && width > this.dealLimit.maxWidth) {
            width = this.dealLimit.maxWidth;
          } else if (width < this.dealLimit.minWidth) {
            width = this.dealLimit.minWidth;
          }
          if (left !== undefined && left != -1) {
            left = this.elLeft + (this.elStartWidth - width);
          }
        }
        if (height !== undefined) {
          // 高度处理
          if (this.dealLimit.maxHeight !== -1 && height > this.dealLimit.maxHeight) {
            height = this.dealLimit.maxHeight;
          } else if (height < this.dealLimit.minHeight) {
            height = this.dealLimit.minHeight;
          }
          if (top !== undefined && top != -1) {
            top = this.elTop + (this.elStartHeight - height);
          }
        }
      }

      // 设置位置和大小
      if (left !== undefined && left !== -1) {
        this.el.style.left = left + 'px';
      }
      if (top !== undefined && top !== -1) {
        this.el.style.top = top + 'px';
      }
      if (width !== undefined && width !== -1) {
        this.el.style.width = width + 'px';
      }
      if (height !== undefined && height !== -1) {
        this.el.style.height = height + 'px';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  // 通用的样式
  .panel-resize {
    position: absolute;
    margin: 0px;
    padding: 0px;
    background-color: transparent;
  }
  // 右边框拖动改变大小的div对象
  .panel-resize-right {
    top: 0px;
    right: 0px;
    cursor: ew-resize;
    width: 4px;
    height: 100%;
  }

  .panel-resize-left {
    top: 0px;
    left: 0px;
    cursor: ew-resize;
    width: 4px;
    height: 100%;
  }

  .panel-resize-up {
    top: 0px;
    left: 0px;
    cursor:ns-resize;
    width: 100%;
    height: 4px;
  }

  .panel-resize-down {
    bottom: 0px;
    left: 0px;
    cursor:ns-resize;
    width: 100%;
    height: 4px;
  }

  .panel-resize-right-up {
    top: 0px;
    right: 0px;
    cursor: nesw-resize;
    width: 8px;
    height: 8px;
  }
  .panel-resize-left-down {
    bottom: 0px;
    left: 0px;
    cursor: nesw-resize;
    width: 8px;
    height: 8px;
  }

  .panel-resize-left-up {
    top: 0px;
    left: 0px;
    cursor: nwse-resize;
    width: 8px;
    height: 8px;
  }

  .panel-resize-right-down {
    bottom: 0px;
    right: 0px;
    cursor: nwse-resize;
    width: 8px;
    height: 8px;
  }
</style>