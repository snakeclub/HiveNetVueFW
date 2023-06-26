<template>
  <div class="layout-iframe-container">
    <iframe v-if="refreshed" :src="iframe.url" class="layout-iframe"
      scrolling="auto"
    ></iframe>
  </div>
</template>

<script>
/**
 * 可缓存的iframe展示组件
 */

export default {
  name: 'CachedIframe',
  data() {
    return {
      // 标识是否已刷新完成
      refreshed: true
    }
  },
  props: {
    // 传入的iframe对象
    iframe: {
      type: Object,
      required: true
    }
  },
  mounted() {
    /* 跨域存在问题，废弃使用
    this.$nextTick(() => {
      // 监控iframe是否已加载完成，然后根据内容高度改变自身的高度
      const iframe = this.$el;
      const _this = this;
      if (iframe.attachEvent){
          iframe.attachEvent("onload", function(){
              _this.setIframeHeight();
          });
      } else {
          iframe.onload = function(){
              _this.setIframeHeight();
          };
      }
    });
    */
  },
  computed: {
    // 判断是否收到刷新指令
    refresh() {
      return this.$store.state.cachedIframe.refreshIds.includes(this.iframe.iframeId);
    }
  },
  watch: {
    // 监听刷新标识，执行刷新动作，重新显示
    refresh(newValue, oldValue) {
      if (newValue) {
        // 删除控件
        this.refreshed = false;
        this.$store.commit('cachedIframe/DEL_REFRESH_ID', this.iframe.iframeId);
        this.$nextTick(() => {
          // 重建控件
          this.refreshed = true;
        });
      }
    }
  },
  methods: {
    // 设置iframe的高度为自适应
    setIframeHeight() {
      const iframe = this.$el;
      if (iframe) {
        var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
        if (iframeWin.document.body) {
          const height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
          iframe.height = height + 'px';
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/themes.scss';

.layout-iframe {
  width: 100%;
  border: 0px;
  display: block;
}

// 正常情况下iframe的高度（没有页签栏和版权栏）
.layout-iframe-container {
  height: calc(100vh - $headerHeight);
}

// 有版权栏的高度
.showCopyright {
    .layout-iframe-container {
      height: calc(100vh - $headerHeight - $copyrightHeight);
    }
}

// 有页签栏的高度，以及版权栏和页签栏都包括的情况
.showTagsView {
  .layout-iframe-container {
    height: calc(100vh - $headerHeight - $tabsHeight);
  }
  &.showCopyright {
    .layout-iframe-container {
      height: calc(100vh - $headerHeight - $tabsHeight - $copyrightHeight);
    }
  }
}

// 自适应iframe高度的情况
.layout-iframe-container {
 &.fit-content {
    height: fit-content !important; // 强制改变样式
  }
}

</style>