<template>
    <!-- logo -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- menu -->
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        mode="vertical"
        :class="{ 'no-transition': isCollapse }"
      >
        <!-- 遍历形成菜单项 -->
        <sidebar-item
          v-for="(menuItem, index) in getSidebarMenus"
          :key="menuItem.name"
          :item="menuItem"
          :base-path="menuItem.path"
        />
      </el-menu>
    </el-scrollbar>
</template>

<script>
  /**
   * 侧边栏（菜单栏）模版
  */
  import { mapGetters, mapState } from "vuex";
  import Logo from "./Logo";
  import SidebarItem from "./SidebarItem";
  import { tagsViewFuns } from "@/utils/actions/TagsViewFuns";

  export default {
    components: { Logo, SidebarItem },
    computed: {
      ...mapState(["layoutSettings"]),
      ...mapGetters(["sidebarMenus", "sidebar", "sidebarTopNavModeMenus", "sidebarMenusIndex", "activeTopNavMenu", "device"]),

      // 获取当前菜单
      getSidebarMenus() {
        if (!this.$store.state.layoutSettings.topNav) {
          // 只有左侧菜单
          return this.sidebarMenus;
        } else {
          // 结合顶部菜单和左侧菜单
          if (this.activeTopNavMenu === '' && this.sidebarMenus.length > 0) {
            this.$store.commit('app/SET_ACTIVE_MENU', { activeTopNavMenu: this.sidebarMenus[0].name });
          }
          return this.sidebarTopNavModeMenus[this.activeTopNavMenu];
        }
      },

      // 计算当前激活的菜单（正在显示的菜单）
      activeMenu() {
        const menuItem = this.getMenuItemByRoute();
        if (menuItem) {
          return menuItem.name;
        }
      },
      // 是否显示logo
      showLogo() {
        return this.$store.state.layoutSettings.sidebarLogo;
      },
      // 是否展开
      isCollapse() {
        // 控制手机设备固定是收缩状态
        // return !this.sidebar.opened;
        return !this.sidebar.opened || this.device === 'mobile';
      }
    },
    methods: {
      // 通过路由获得菜单对象
      getMenuItemByRoute() {
        let meta = this.$route.meta;
        if (meta === undefined || JSON.stringify(meta) === '{}') {
          // 尝试获取页签信息
          const tag = tagsViewFuns.getTagByPath(this.$route.path, this.$route.query);
          if (tag) meta = tag.meta;
        }
        if (meta && meta.type && meta.type === 'sidebar') {
          // 直接是左侧菜单的情况
          const indexByName = this.sidebarMenusIndex || {};
          const menuItem = indexByName[meta.name];
          if (menuItem) {
            return menuItem;
          }
        } else if (meta && meta.type && meta.type === 'fixedTag') {
          // 是固定页签，判断是否有匹配上的左侧菜单
          const indexByFixedTagName = this.sidebarMenusIndex.byFixedTagName || {};
          const menuItem = indexByFixedTagName[meta.name];
          if (menuItem) {
            return menuItem;
          }
        }
      }
    }
  };

</script>

