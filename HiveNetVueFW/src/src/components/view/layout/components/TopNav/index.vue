<template>
  <el-menu :default-active="activeMenu" mode="horizontal" :ellipsis="false" @select="doSelect">
    <template v-for="(item, index) in topMenus">
      <el-menu-item
       :index="item.name" :key="index" v-if="index < visibleNumber - 1"
       :disabled="item.realDisabled"
      >
        <svg-icon v-if="item.icon" :icon-class="item.icon"></svg-icon>
        <template #title>{{ $t(item.showName) }}</template>
      </el-menu-item>
    </template>

    <!-- 顶部菜单超出数量折叠 -->
    <el-sub-menu
      index="more" v-if="topMenus.length >= visibleNumber - 1"
      popper-append-to-body
    >
      <template #title><span>{{ $t('更多菜单') }}</span></template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item :index="item.name" :key="index" v-if="index >= visibleNumber - 1"
          :disabled="item.realDisabled"
        >
          <svg-icon v-if="item.icon" :icon-class="item.icon"></svg-icon>
          <template #title>{{ $t(item.showName) }}</template>
        </el-menu-item>
      </template>
    </el-sub-menu>
  </el-menu>
</template>

<script>
  /**
   * 顶部导航栏位的主菜单（映射菜单栏的一级菜单图标）
  */
  import { mapGetters } from "vuex";
  import menuActions from '@/utils/actions/menu';

  export default {
    data() {
      return {
        // 顶部栏初始数
        visibleNumber: this.$store.state.layoutSettings.topNavVisibleNumber
      };
    },
    computed: {
      ...mapGetters(["sidebarMenus", "activeTopNavMenu", "sidebarMenusIndex"]),
      // 顶部显示菜单
      topMenus() {
        let topMenus = [];
        for (let i = 0; i < this.sidebarMenus.length; i++) {
          if (!this.sidebarMenus[i].realHidden) {
            topMenus.push(this.sidebarMenus[i]);
          }
        }
        return topMenus;
      },
      // 默认激活的菜单
      activeMenu() {
        console.debug('activeTopMenu', this.activeTopNavMenu);
        return this.activeTopNavMenu;
      },
    },
    beforeMount() {
      window.addEventListener('resize', this.setVisibleNumber)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.setVisibleNumber)
    },
    mounted() {
      this.setVisibleNumber();
    },
    methods: {
      // 根据宽度计算设置显示栏数
      setVisibleNumber() {
        const width = document.body.getBoundingClientRect().width / 3;
        this.visibleNumber = Math.max(1, parseInt(width / 85));
      },
      // 菜单选择事件
      doSelect(index, indexPath) {
        // 获取菜单
        const menuItem = this.sidebarMenusIndex.byName[index];
        if (menuItem) {
          if (menuItem.menuType === 'main') {
            // 更新激活topNav菜单项，联动更新左侧菜单
            this.$store.commit('app/SET_ACTIVE_MENU', { activeTopNavMenu: index });
          } else {
            // 执行菜单点击操作
            menuActions.clickMenu('sidebar', menuItem.namePath);
          }
        }
      }
    },
  };

</script>

