<template>
  <div class="button-bar">
    <div ref="buttonBar"
        :class="['button-bar-container', 'align-' + buttonAlign, bgTransparent?'bg-transparent':'',
        fitContent?'fit-content':'', direction, hasScroll && !noScroll?'has-scroll':'']"
    >
        <div v-if="!noScroll && hasScroll" :class="['button-bar-scroll-button', 'pos-left', layoutSize]"
            @mousedown="scrollLeft" @mouseup="scrollStop" @mouseout="scrollStop">
            <svg-icon v-if="direction !== 'vertical'" icon-class="el-icon-arrow-left" />
            <svg-icon v-else icon-class="el-icon-arrow-up" />
        </div>
        <el-space :wrap="noScroll" :size="layoutSize" :direction="direction">
            <el-button v-for="btn in buttonItems"
                :type="btn.type ? btn.type : ''"
                @click="btn.onclick"
                :size="layoutSize"
            >{{$t(btn.text)}}</el-button>
        </el-space>
        <div v-if="!noScroll && hasScroll" :class="['button-bar-scroll-button', 'pos-right', layoutSize]"
            @mousedown="scrollRight" @mouseup="scrollStop" @mouseout="scrollStop">
            <svg-icon v-if="direction !== 'vertical'" icon-class="el-icon-arrow-right" />
            <svg-icon v-else icon-class="el-icon-arrow-down" />
        </div>
    </div>
  </div>
</template>
<script>
  /**
   * 操作按钮显示栏
   */

  export default {
    name: 'ButtonBar',
    props: {
      /**
       * 送入的按钮对象数组，每个对象为一个数组，包含按钮相关参数
       * {
       *   btnType: '', // 显示按钮类型（不传则默认为el-button），暂时仅支持 el-button
       *   text: '', // 要显示的按钮文本
       *   type: '', // 按钮显示类型（el-button支持，默认为''） '' / primary / success / warning / danger / info / text
       *   onclick: func, // 点击按钮要执行的js函数，暂不支持送入参的情况
       * }
       */
      buttonItems: {
        type: Array,
        required: true
      },
      // 按钮位置（left, center, right）
      buttonAlign: {
        type: String,
        default: 'left'
      },
      // 按钮排列方向(horizontal, vertical)
      direction: {
        type: String,
        default: 'horizontal'
      },
      // 是否设置透明背景
      bgTransparent: {
          type: Boolean,
          default: false
      },
      // 是否自适应内容大小
      fitContent: {
          type: Boolean,
          default: false
      },
      // 不需要滚动支持(超过范围自动换行)
      noScroll: {
          type: Boolean,
          default: false
      }
    },
    data() {
      return {
        hasScroll: false, // 控制是否有滚动条的按钮展示
        scrollInterval: undefined // 滚动定时任务的标识
      }
    },
    computed: {
      // 判断组件大小设置
      layoutSize() {
        if (this.$store.state.app.size === '') {
          return 'default';
        } else {
          return this.$store.state.app.size;
        }
      }
    },
    beforeMount() {
        // 监听改变大小事件
        window.addEventListener('resize', this.resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler);
    },
    mounted() {
        this.$nextTick(() => {
          this.resizeHandler()
        })
    },
    methods: {
        // 改变大小时判断
        resizeHandler() {
          const el = this.$refs.buttonBar;
          if (!el) {
            console.debug('buttonBar resize error!');
            return;
          }
          if (this.direction === 'vertical') {
            // 垂直方向
            this.hasScroll = el.scrollHeight > el.clientHeight;
          } else {
            this.hasScroll = el.scrollWidth > el.clientWidth;
          }
          this.$nextTick(() => {
            // 计算并改变滚动条按钮的大小
            const elScrolls = el.getElementsByClassName('button-bar-scroll-button');
            for (const elScroll of elScrolls) {
                if (this.direction === 'vertical') {
                  elScroll.style.width = el.clientWidth + 'px';
                } else {
                  elScroll.style.height = el.clientHeight + 'px';
                }
            }
          });
        },
        // 向左边自动滚动滚动条
        scrollLeft() {
            const el = this.$refs.buttonBar;
            this.scrollInterval = setInterval(() => {
                if (this.direction === 'vertical') {
                  // 垂直方向
                  el.scrollTop -= 3;
                } else {
                  el.scrollLeft -= 3;
                }
            }, 10);
        },
        // 向右边自动滚动滚动条
        scrollRight() {
            const el = this.$refs.buttonBar;
            this.scrollInterval = setInterval(() => {
                if (this.direction === 'vertical') {
                  // 垂直方向
                  el.scrollTop += 3;
                } else {
                  el.scrollLeft += 3;
                }
            }, 10);
        },
        // 鼠标释放时停止滚动
        scrollStop() {
            clearInterval(this.scrollInterval);
        }
    },
  };
</script>
<style lang="scss" scoped>
  @import '@/assets/css/themes.scss';
  $_ButtonBarPaddingV: 5px;  // 容器的上下内边框
  $_ButtonBarPaddingH: 5px;  // 容器的左右内边框
  $_ButtonBarScrollWidth: 20px; // 滚动按钮宽度

  .button-bar {
    // 增加容器是为了解决定位滚动按钮的定位问题，absolute要求找到最近的一个relative元素进行定位
    position: relative;
  }
  .button-bar-container {
    display: block;
    overflow-x: scroll;
    overflow-y: hidden;
    perspective: 100%; // 通过这个设置让子孙元素定位以父元素为坐标
    width: 100%;
    height: fit-content;
    background-color: var(--el-color-primary-light-9);
    padding: $_ButtonBarPaddingV $_ButtonBarPaddingH;

    // 需要显示滚动条
    &.has-scroll {
      padding: $_ButtonBarPaddingV calc($_ButtonBarScrollWidth + $_ButtonBarPaddingH);
    }

    // 隐藏滚动条
    &::-webkit-scrollbar {
      height: 0 !important;
      width: 0 !important;
    }
    // 按钮位置
    &.align-center {
      justify-content: center;
      align-items: center;
    }
    &.align-right {
      justify-content: right;
      align-items: right;
    }
    // 透明背景
    &.bg-transparent {
      background-color: transparent;
    }
    // 自适应内容大小
    &.fit-content {
        width: fit-content;
    }

    // 垂直的位置和大小处理
    &.vertical {
      flex-direction: column;
      overflow-x: hidden;
      overflow-y: scroll;
      width: fit-content;
      height: 100%;
      &.has-scroll {
        padding: calc($_ButtonBarScrollWidth + $_ButtonBarPaddingV) $_ButtonBarPaddingH;
      }
    }
  }

  // 遇到显示超过长度的情况，通过按钮左右拖动
  .button-bar-scroll-button {
    position: absolute;
    top: 0px;
    width: $_ButtonBarScrollWidth;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    align-self: center;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--el-color-primary-light-9);

    &:hover {
        color: rgba(0, 0, 0);
    }

    // 横向的位置和大小处理
    &.pos-left {
      left: 0px;
    }
    &.pos-right {
      right: 0px;
    }
  }

  // 垂直模式
  .vertical {
    .button-bar-scroll-button {
      left: 0px;
      width: auto;
      height: $_ButtonBarScrollWidth;

      &.pos-left {
        width: max-content;
        top: 0px;
      }
        &.pos-right {
          top:auto;
          bottom: 0px;
        }
    }
  }

  .bg-transparent {
    .button-bar-scroll-button {
        background-color: transparent;
    }
  }

  // 夜间模式
  .night-mode {
    .button-bar-container {
        border: 1px solid var(--border-color);
        background-color: var(--navbarThemeColor);
        &.bg-transparent {
            background-color: transparent;
        }
    }
    .button-bar-scroll-button{
        background-color: var(--navbarThemeColor);
        color: var(--navbarColor);
    }
    .bg-transparent {
        .button-bar-scroll-button {
        background-color: transparent;
    }
    }
  }

</style>

