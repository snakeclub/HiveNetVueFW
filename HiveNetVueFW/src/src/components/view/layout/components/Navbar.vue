<template>
  <div class="header-content">
    <div class="header-left">
      <!-- 切换菜单栏的展开关闭按钮 -->
      <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <!-- 顶部导航栏的面包屑菜单 -->
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="breadcrumb && !topNav" />
      <!-- 顶部导航栏位的主菜单 -->
      <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />
    </div>
    <div class="header-right">
      <!-- 顶部导航栏位的右侧菜单 -->
      <right-menu id="rightmenu-container" class="rightmenu-container"></right-menu>
    </div>
  </div>
  <system-setting></system-setting>
</template>

<script>
  /**
   * 顶部导航栏
   */
  import { mapGetters } from 'vuex';
  import Hamburger from './Hamburger';
  import Breadcrumb from './Breadcrumb';
  import TopNav from './TopNav';
  import RightMenu from './RightMenu';
  import SystemSetting from './Setting/index.vue';

  export default {
    components: {
      Hamburger, Breadcrumb, TopNav, RightMenu, SystemSetting
    },
    data() {
      return {
        setting: null
      }
    },
    computed: {
      // $.store.getter的映射
      ...mapGetters([
        'sidebar',
        'avatar',
        'device'
      ]),
      topNav: {
        get() {
          return this.$store.state.layoutSettings.topNav;
        }
      },
      breadcrumb: {
        get() {
          return this.$store.state.layoutSettings.breadcrumb;
        }
      }
    },
    methods: {
      // 切换菜单栏显示状态
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },

      // 退出登录操作
      async logout() {
        this.$confirm('确定注销并退出系统吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('user/LogOut').then(() => {
            location.href = '/index';
          })
        }).catch(() => {});
      }
    }
  }

</script>
