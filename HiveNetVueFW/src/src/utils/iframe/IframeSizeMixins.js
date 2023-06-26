/**
 * 简化使用iframe的设置大小位置控制框架，引入mixins即可
 * 注意：该mixins必须与 IframeChildMixins 一并使用且顺序在 IframeChildMixins 之后
 * 用法：
 * export default {
 *   mixins: [IframeChildMixins, IframeSizeMixins],
 *   ...
 * }
 */
import IframeChild from './IframeChild';

export default {
  data() {
    return {
      // iframe页面的大小设置方式，none-不特别设置大小，fit-适配父框架显示界面大小
      iframeSizeType: 'none',
      // 监听主框架的滚动位置变化，如果需要这个信息，可以设置为true
      listenContainerScroll: false,
      // 监听主框架的显示界面大小变化，如果需要这个信息，可以设置为true
      listenContainerResize: false
    };
  },
  computed: {
    // 主框架iframe容器大小，为了监听变化并进行处理
    containerSize() {
      return this.$store.state.iframePageInfo.containerSize;
    }
  },
  watch: {
    // 监听主框架iframe容器大小
    containerSize(newValue, oldValue) {
      if (this.isIframe && this.iframeSizeType === 'fit') {
        const el = window.document.querySelector('.web-main-container');
        if (el) {
          el.style.width = newValue.width + 'px';
          el.style.height = newValue.height + 'px';
        }
      }
    }
  },
  mounted() {
    this.initIframeSize();
  },
  beforeDestroy() {
    this.destroyIframeSize();
  },
  methods: {
    // 初始化页面大小类型的设置
    initIframeSize() {
      if (this.isIframe) {
        if (this.iframeSizeType === 'fit') {
          // 向父框架设置页面类型
          IframeChild.setIframeSizeType({
            sizeType: this.iframeSizeType,
            listenScroll: this.listenContainerScroll,
            listenResize: true // fit类型必须要获取改变大小的信息
          });
          // 获取空间大小并改变自身大小
          IframeChild.getIframeContainerSize((e) => {
            this.$store.commit('iframePageInfo/CHANGE_INFO', { containerSize: e.size });
          });
        } else {
          // 出现大小变化时主动通知父框架
          IframeChild.addResizeEvent('setIframeSize', this.setIframeSizeEvent);
          // 向父框架设置页面类型
          IframeChild.setIframeSizeType({
            sizeType: this.iframeSizeType,
            listenScroll: this.listenContainerScroll,
            listenResize: this.listenContainerResize
          });

          if (this.listenContainerScroll) {
            // 获取主框架滚动条信息
            IframeChild.getiframeContainerScroll((e) => {
              this.$store.commit('iframePageInfo/CHANGE_INFO', {
                containerScroll: e.scrollInfo
              });
            });
          }
        }
      }
    },

    // 卸载页面大小类型设置
    destroyIframeSize() {
      if (this.isIframe) {
        IframeChild.removeResizeEvent('setIframeSize');
      }
    },

    // 页面改变大小时通知主框架改变高度的事件
    setIframeSizeEvent(el) {
      if (this.$store.state.iframePageInfo.pageHeight !== el.scrollHeight) {
        this.$store.commit('iframePageInfo/CHANGE_INFO', { pageHeight: el.scrollHeight });
        IframeChild.setIframeSize({ height: el.scrollHeight });
      }
    }
  }
};
