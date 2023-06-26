<template>
   <div ref="CachedIframeRouter" style="display: none;"></div>
</template>

<script>

export default {
  /**
   * 缓存Iframe的路由控制页面, 不显示，但用于控制缓存的iframe页面
   */
  name: 'CachedIframeRouter',

  data() {
    return {
      currentPath: '', // 当前组件的path
      currentIframeId: '' // 当前iframe的id
    }
  },

  // 装载组件前执行
  beforeMount() {
    // 登录路径
    this.currentPath = this.$route.path;
    // 生成当前iframeId
    this.currentIframeId = this.iframeId;
    // 添加页面到缓存
    this.addCachedIframe();
  },

  computed: {
    iframeId() {
      return this.$route.query.iframeid;
    },
  },

  watch: {
    // 监控路由变化
    $route() {
      if (this.$route.path !== this.currentPath) {
        // 跳转到其他页面
        return;
      }

      if (this.currentIframeId === this.iframeId) {
        return;
      }

      // iframeId发生变化，添加页面到缓存
      this.addCachedIframe();

      // 设置当前id
      this.currentIframeId = this.iframeId;
    }
  },

  methods: {
    // 将当前路由页面添加缓存iframe对象
    addCachedIframe() {
      this.$store.commit('cachedIframe/ADD_CACHED_IFRAME', { iframeId: this.iframeId, url: this.$route.query.url });
    },

    // 设置iframe的高度为自适应
    setIframeHeight() {
      const iframe = document.getElementById(this.iframeId);
      if (iframe) {
        var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
        if (iframeWin.document.body) {
          const height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
          iframe.style.height = height + 'px';
        }
      }
    }
  }
}
</script>

<style lang="scss">
.layout-iframe {
  min-height: 100%;
  width: 100%;
  border: 0px;
  display: block;
}
</style>