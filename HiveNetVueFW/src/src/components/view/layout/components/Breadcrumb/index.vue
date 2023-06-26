<template>
  <el-breadcrumb  separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="index">
        <span :key="item.name">{{ item.title }}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
/**
 * 顶部导航栏位的面包屑导航菜单（显示当前页面菜单的路径）
 */

import { mapGetters } from "vuex";
import { getTagByPath } from "@/utils/actions/TagsViewFuns"; // 不知道为什么不行

export default {
  data() {
    return {
      levelList: null
    }
  },
  computed: {
    ...mapGetters(["sidebarMenusIndex", "rightMenusIndex"]),
  },
  watch: {
    $route(route) {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      const tempList = [];  // 避免逐个添加刷新显示问题
      // 获取菜单路径
      let meta = this.$route.meta;
      if (meta === undefined || JSON.stringify(meta) === '{}') {
        // 尝试获取页签信息
        const tag = getTagByPath(this.$route.path, this.$route.query);
        if (tag) meta = tag.meta;
      }
      if (meta && meta.type && meta.type === 'sidebar') {
        // 左侧菜单的情况
        let menuItem = this.sidebarMenusIndex.byName[meta.name];
        if (menuItem) {
          const nameIndex = menuItem.namePath.split('/')
          for (const menuName of nameIndex) {
            if (menuName !== '') {
              menuItem = this.sidebarMenusIndex.byName[menuName];
              if (menuItem) {
                tempList.push({ name: menuName, title: menuItem.showName });
              }
            }
          }
        }
      } else if (meta && meta.type && meta.type === 'right') {
        // 右上角菜单的情况
        let menuItem = this.rightMenusIndex.byName[meta.name];
        if (menuItem) {
          const nameIndex = menuItem.namePath.split('/')
          for (const menuName of nameIndex) {
            if (menuName !== '') {
              menuItem = this.rightMenusIndex.byName[menuName];
              if (menuItem) {
                tempList.push({ name: menuName, title: menuItem.showName });
              }
            }
          }
        }
      } else {
        // 其他情况
        tempList.push({ name: meta.name ? '' : meta.name, title: meta.title });
      }
      this.levelList = tempList;
    }
  }
}
</script>

