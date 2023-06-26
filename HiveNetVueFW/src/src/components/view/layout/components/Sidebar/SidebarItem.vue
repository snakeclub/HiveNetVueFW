<template>
  <div v-if="!item.realHidden">
    <!-- 没有子菜单，只处理自己 -->
    <el-menu-item
      v-if="!hasShowingChild(item)"
      :index="item.name"
      :disabled="item.realDisabled"
      @click="menuClick"
    >
        <svg-icon v-if="item.icon" :icon-class="item.icon"></svg-icon>
        <span v-if="isCollapse">{{ item.menuName }}</span>
        <template #title>{{ $t(item.showName) }}</template>
    </el-menu-item>

    <!-- 有多个子菜单的情况, 当前菜单作为主菜单，继续遍历子菜单进行处理 -->
    <el-sub-menu v-else ref="subMenu" :index="item.name" :disabled="item.realDisabled" popper-append-to-body>
      <template #title>
        <svg-icon v-if="item.icon" :icon-class="item.icon"></svg-icon>
        <span>{{ $t(item.showName) }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.name"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </div>
</template>

<script>
  /**
   * 侧边菜单栏的菜单项处理
  */
  import { mapGetters } from "vuex";
  import path from 'path';
  import { isExternal } from '@/utils/base/NetTools';
  import FixiOSBug from './FixiOSBug';
  import menuActions from '@/utils/actions/menu';

  export default {
    /**
     * 侧边栏菜单项模版
     */
    name: 'SidebarItem',
    mixins: [FixiOSBug],
    props: {
      // 传入的菜单对象
      item: {
        type: Object,
        required: true
      },
      // 是否折叠
      isNest: {
        type: Boolean,
        default: false
      },
      // vue路径，逐级增加
      basePath: {
        type: String,
        default: ''
      }
    },
    data() {
      /**
       * 当前菜单对象的唯一子菜单对象，如果没有子菜单，则为菜单对象自身
      */
      return {};
    },
    computed: {
      ...mapGetters(["sidebar", "sidebarMenus", "sidebarMenusIndex"]),
      // 是否展开
      isCollapse() {
        // 控制手机设备固定是收缩状态
        // return !this.sidebar.opened;
        return !this.sidebar.opened || this.device === 'mobile';
      }
    },
    methods: {
      // 判断当前 item 是否有可显示的子对象
      hasShowingChild(currentItem) {
        if (currentItem.menuType !== 'main') {
          return false;
        }
        const children = currentItem.children || [];
        const showingChildren = children.filter(item => {
          if (item.realHidden) {
            return false;
          }
          else {
            return true;
          }
        });
        if (showingChildren.length > 0) {
          return true;
        } else {
          return false;
        }
      },
      // 处理vue路径
      resolvePath(routePath, routeQuery) {
        if (isExternal(routePath)) {
          return routePath;
        }
        if (isExternal(this.basePath)) {
          return this.basePath
        }
        if (routeQuery) {
          let query = JSON.parse(routeQuery);
          return { path: path.resolve(this.basePath, routePath), query: query }
        }
        return path.resolve(this.basePath, routePath)
      },
      // 点击菜单执行的操作
      menuClick(el) {
        this.$nextTick(() => {
          // 获取菜单项
          const menuItem = this.sidebarMenusIndex.byName[el.index];
          // 执行菜单点击
          menuActions.clickMenu('sidebar', menuItem.namePath);
        });
      }
    }
  }

</script>
