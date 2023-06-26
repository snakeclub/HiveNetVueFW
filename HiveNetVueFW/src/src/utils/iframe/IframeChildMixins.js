/**
 * 简化使用iframe的框架，引入mixins即可
 * 用法：
 * export default {
 *   mixins: [IframeChildMixins],
 *   ...
 * }
 */
import IframeChild from './IframeChild';

export default {
  computed: {
    // 是否iframe的判断
    isIframe() {
      return this.$store.state.iframePageInfo.isIframe;
    },
    // iframe的基本信息
    iframeInfo() {
      return this.$store.state.iframePageInfo;
    },
    // layout的主题信息
    layoutThemes() {
      return this.$store.state.iframePageInfo.themes;
    },
    // 语言信息
    layoutLang() {
      return this.$store.state.iframePageInfo.lang;
    },
    // 组件大小
    layoutSize() {
      if (this.isIframe) {
        return this.$store.state.iframePageInfo.size;
      } else {
        return this.$store.state.app.size;
      }
    }
  },
  mounted() {
    // 装载iframe框架
    IframeChild.onMounted(this);
  },
  destroyed() {
    // 卸载iframe框架
    IframeChild.onDestroyed(this);
  },
  watch: {
    // 监听框架主题，当发生变化时进行刷新
    layoutThemes(newValue, oldValue) {
      IframeChild.onWatchLayoutThemes(this, newValue);
    },
    // 监听语言，当发生变化时进行刷新
    layoutLang(newValue, oldValue) {
      IframeChild.onWatchLayoutLang(this, newValue);
    },
    // 监听组件大小，当发生变化时进行刷新
    layoutSize(newValue, oldValue) {
      IframeChild.onWatchLayoutSize(this, newValue);
    }
  }
};
