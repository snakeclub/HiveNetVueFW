<template>
  <section id="app-main-iframe" ref="appMainIframe" class="app-main app-main-iframe"
    v-show="isIframe">
    <!-- 用于展现缓存Iframe的元素 -->
    <cached-iframe v-for="iframe of cachedIframes"
      :key="iframe.iframeId"
      :id="iframe.iframeId"
      v-show="isShowCachedIframe(iframe.iframeId)"
      :iframe="iframe"
    >
    </cached-iframe>
  </section>

  <section id="app-main-view" class="app-main" v-show="!isIframe">
    <router-view v-slot="{ Component }" v-bind="getProps">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedComponents">
          <component :key="key" v-if="isShow" :is="Component" v-bind="getProps"></component>
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script>
/**
 * 内容界面模版
 */
import elementResizeDetectorMaker from 'element-resize-detector';
import settings from "@/settings";
import IframeParent from '@/utils/iframe/IframeParent';

export default {
  name: 'AppMain',
  data() {
    return {
      elementSizeChangeListener: undefined // 元素大小变化的监听对象
    }
  },
  computed: {
    // 获取要传递的属性
    getProps() {
      const meta = this.$route.meta || {};
      return meta.props || {};
    },
    // 是否显示组件
    isShow() {
      return this.$store.state.tagsView.appMainShow;
    },
    // 控件的key
    key() {
      return this.$route.fullPath;
    },
    // 获取缓存的组件名
    cachedComponents() {
      return this.$store.state.tagsView.cachedComponents;
    },
    // 获取缓存的iframe对象清单
    cachedIframes() {
      return this.$store.state.cachedIframe.cachedIframes;
    },
    // 判断当前页面是否iframe
    isIframe() {
      return this.$route.path === settings.app.cachedIframePath;
    }
  },
  mounted() {
    // 监听iframe容器大小的变化
    this.elementSizeChangeListener = elementResizeDetectorMaker({
      strategy: 'scroll', // <- For ultra performance.
      callOnAdd: true,
      debug: false
    });
    this.elementSizeChangeListener.listenTo(this.$refs.appMainIframe, function(el) {
      // 监听iframe容器的大小变化
      IframeParent.sendIframeContainerResize(el.clientWidth, el.clientHeight);
    });
  },
  methods: {
    // 判断是否显示指定id的缓存iframe
    isShowCachedIframe(id) {
      return this.$route.path === settings.app.cachedIframePath && this.$route.query.iframeid === id;
    },

    // 重新加载
    reload() {
      this.$store.dispatch('tagsView/setAppMainShow', false).then(() => {
        this.$nextTick(() => { this.$store.dispatch('tagsView/setAppMainShow', true); });
      });
    },

    // iframe容器滚动事件
    iframeContainerScrollEvent(e) {
      IframeParent.sendIframeContainerScroll('app-main', e.srcElement.scrollLeft, e.srcElement.scrollTop);
    }
  },
  // 父组件通过provide提供变量，在子组件中通过inject接受
  provide() {
    return {
      reload: this.reload
    };
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/themes.scss';
.app-main {
  width: auto;
  height: fit-content;
  max-width: 100%;
  min-height: calc(100vh - $headerHeight);
  margin: 0px;
  padding: 0px;
}
.app-main-iframe {
  width: 100%;
}

.showTagsView {
  .app-main {
    min-height: calc(100vh - $headerHeight - $tabsHeight);
  }
}

.showCopyright {
  .app-main {
    min-height: calc(100vh - $headerHeight - $copyrightHeight);
  }

  &.showTagsView {
      // 有版权且有页签栏位
    .app-main {
      min-height: calc(100vh - $headerHeight - $tabsHeight - $copyrightHeight);
    }
  }
}

// 版权信息固定在底部的情况
.copyrightFixedBottom {
  &.showTagsView {
    .app-main {
      overflow: auto;
      height: calc(100vh - $headerHeight - $tabsHeight);
    }
  }

  &.showCopyright {
    // 有版权的高度
    .app-main {
      overflow: auto;
      height: calc(100vh - $headerHeight - $copyrightHeight);
    }
    &.showTagsView {
      // 有版权且有页签栏位
      .app-main {
        overflow: auto;
        height: calc(100vh - $headerHeight - $tabsHeight - $copyrightHeight);
      }
    }
  }
}
</style>
