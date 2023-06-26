<template>
  <el-container v-if="true && refreshed" :class="layoutRootClass">
    <!-- 移动设备模式，当菜单打开时显示遮罩 -->
    <div v-if="device !== 'desktop' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!-- 左边菜单栏组件 -->
    <el-aside :width="sidebarWidth" :class="{'sidebar-container': true, 'sidebar-opened': sidebar.opened}">
      <sidebar v-if="sizeRefreshed"></sidebar>
      <panel-resize v-if="sidebarResizeable && sidebar.opened" @panelResizeBack="panelResizeBack"
        :directions="['r']" action="feedback"
      ></panel-resize>
    </el-aside>
    <!-- 右边布局 -->
    <el-container>
      <el-header class="navbar-container">
        <!-- 上方导航栏组件 -->
        <navbar v-if="sizeRefreshed" />
      </el-header>
      <!-- 页签展示栏位 -->
      <tags-view v-if="needTagsView" />
      <!-- 内容展示页面 -->
      <el-main @scroll="iframeContainerScrollEvent" class="layout-el-main">
        <!-- 应用主界面（内容界面）组件 -->
        <app-main />
        <copyright v-if="showCopyright"></copyright>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  /**
   * 应用主页面（包括整个应用的布局）
  */
  import PanelResize from '@/components/common/PanelResize/index.vue';
  import { AppMain, Sidebar, Navbar, TagsView, Copyright } from './components';
  import ResizeMixin from './mixin/ResizeHandler';
  import FoucusOutMixin from './mixin/FocusOutHandler';
  import { mapState } from 'vuex';
  import IframeParent from '@/utils/iframe/IframeParent';
  import LoginForm from '@/views/AuthCenter/components/LoginForm.vue';
  import RegisterForm from '@/views/AuthCenter/components/RegisterForm.vue';
  import WebTools from '@/utils/base/WebTools';

  export default {
    name: 'Layout',
    data() {
      return {
        // 标识是否已刷新完成
        refreshed: true,
        sizeRefreshed: true,  // 改变布局大小的刷新标识
        tempSidebarWidth: 0, // 临时的记录拖动操作前的宽度的变量
        isSidebarResize: false // 指定是否正在拖动
      }
    },
    components: {
      Sidebar,
      AppMain,
      Navbar,
      TagsView,
      PanelResize,
      Copyright,
      LoginForm,
      RegisterForm
    },
    mixins: [ResizeMixin, FoucusOutMixin],
    mounted() {
      // 监听iframe的请求消息
      IframeParent.initIframeParent();
      // 给body设置设备样式
      WebTools.removeClass(document.body, 'mobile');
      WebTools.removeClass(document.body, 'pad');
      WebTools.addClass(document.body, this.appDevice);
    },
    computed: {
      // store的state状态访问路径映射
      ...mapState({
        showCopyright: state => state.app.showCopyright,
        copyrightFixedBottom: state => state.app.copyrightFixedBottom,
        sidebar: state => state.app.sidebar,
        device: state => state.app.device,
        needTagsView: state => state.layoutSettings.tagsView,
        sidebarResizeable: state => state.layoutSettings.sidebarResizeable
      }),
      // layout框架的css根类名，用于控制子元素的不同样式
      layoutRootClass() {
        return {
          pad: this.device === 'pad',
          mobile: this.device === 'mobile',
          showTagsView: this.needTagsView,
          showCopyright: this.showCopyright,
          copyrightFixedBottom: this.copyrightFixedBottom
        }
      },
      // 获取设备类型，用于监控
      appDevice() {
        return this.$store.state.app.device;
      },
      // 判断是否收到刷新指令
      isRefresh() {
        return this.$store.state.layoutSettings.isRefresh;
      },
      // 判断是否收到控件大小刷新指令
      isSizeRefresh() {
        return this.$store.state.layoutSettings.isSizeRefresh;
      },
      // 新，左边菜单的宽度设置
      sidebarWidth() {
        const tempWidth = (this.sidebar.opened && this.device !== 'mobile') ? this.$store.state.layoutSettings.sidebarWidth : '64px';
        // 同步编辑根对象的宽度值
        document.querySelector(':root').style.setProperty('--sidebarWidth', tempWidth);
        return tempWidth;
      }
    },
    watch: {
      // 监听刷新标识，执行刷新动作，重新显示
      isRefresh(newValue, oldValue) {
        if (newValue) {
          // 将刷新标识更新为无需刷新
          this.$store.commit('layoutSettings/SET_REFRESH', false);
          this.refresh();
        }
      },
      // 监听控件大小刷新标识，执行刷新动作，重新显示
      isSizeRefresh(newValue, oldValue) {
        if (newValue) {
          // 将刷新标识更新为无需刷新
          this.$store.commit('layoutSettings/SET_SIZE_REFRESH', false);
          this.sizeRefreshed = false;
          this.$nextTick(() => {
            // 重建控件
            this.sizeRefreshed = true;
          });
        }
      },
      // 监听设备类型发生变化, 对body对象设置class
      appDevice(newValue, oldValue) {
        WebTools.removeClass(document.body, oldValue);
        WebTools.addClass(document.body, newValue);
      }
    },
    methods: {
      // iframe容器滚动事件
      iframeContainerScrollEvent(e) {
        IframeParent.sendIframeContainerScroll(e.srcElement.scrollLeft, e.srcElement.scrollTop);
      },

      // 手机设备情况时使用，点击了菜单以外的地方，则关闭左侧菜单
      handleClickOutside() {
        this.$store.dispatch('app/closeSideBar', { withoutAnimation: false });
      },

      // 刷新layout页面
      refresh() {
        this.refreshed = false;
        // 清除页签信息和缓存信息
        this.$store.commit('tagsView/DEL_ALL_VIEWS', true);
        this.$nextTick(() => {
          // 重建控件
          this.refreshed = true;
        });
      },
      // 获取 PanelResize 返回的参数
      panelResizeBack(val) {
        if (!this.isSidebarResize) {
          // 拖动第一次传值
          this.isSidebarResize = true;
          this.tempSidebarWidth = parseInt(this.$store.state.layoutSettings.sidebarWidth);
        }
        this.$store.commit('layoutSettings/CHANGE_SETTING', {
          sidebarWidth: Math.max(0, val.currentX - val.startX + this.tempSidebarWidth) + 'px'
        });
        // 判断是否结束
        if (val.mouseType != 'move') {
          this.isSidebarResize = false;
        }
      }
    }
  }

</script>

<style lang="scss" scoped>
  // 移动设备打开菜单时显示遮罩的样式
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

</style>
