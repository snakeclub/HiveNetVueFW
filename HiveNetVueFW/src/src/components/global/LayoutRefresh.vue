<template>
  <div></div>
</template>

<script>
  /**
  * 刷新Layout页面的组件（针对新打开Layout页面或在当前页面刷新整个Layout的情况）
  */
  import { generateLayoutRouter } from '@/store/modules/menus';
  import { closeAllTags, initFixedTags } from '@/utils/actions/TagsViewFuns';

  export default {
    name: 'LayoutRefresh',
    beforeMount() {
      // 刷新框架页面（删除所有页签缓存）
      closeAllTags(true);
      initFixedTags(); // 重新加载固定页签

      // 处理不同类型的打开操作
      const opType = this.$route.query.type; // 操作类型, fixedTag-固定页签、sidebar-左侧菜单、right-右上角菜单、iframe-通过iframe打开指定地址
      if (opType === 'fixedTag') {
        // 切换到指定的固定页签
        const fixedTags = this.$store.state.tagsView.visitedViews;
        const name = 'fixedTag' + this.$route.query.name;
        for (fixedTag of fixedTags) {
          if (!fixedTag.isFixed) {
            // 非固定页签，不处理
            continue;
          }
          if (fixedTag.name === name) {
            // 找到页签
            this.$router.replace({ path: fixedTag.path, query: fixedTag.query });
            return;
          }
        }
        // 找不到页签，直接打开首页
        this.$router.replace({ path: '/' });
        return;
      } else if (opType === 'sidebar' || opType === 'right') {
        // 切换到菜单指定的页面
        const menuIndex = opType === 'sidebar' ? this.$store.state.menus.sidebarMenusIndex : this.$store.state.menus.rightMenusIndex;
        const menuItem = menuIndex.byNamePath[this.$route.query.namePath];
        if (menuItem === undefined) {
          // 打印错误信息
          console.error('menu not found:', this.$route.query);
          this.$router.replace({ path: '/' });
          return;
        }
        if (menuItem.menuType === 'view') {
          if (menuItem.openType !== 'inner' && menuItem.meta.cacheType !== 'mutiple') {
            // 此前菜单并非是框架标签页的情况，需要生成对应的路由并添加(mutiple的路由直接由tagsView模块处理)
            menuItem.meta.refreshRoute = { path: this.$route.path, query: this.$route.query }; // 指定刷新使用的路由
            const routeItem = generateLayoutRouter(menuItem);
            this.$router.addRoute(routeItem);
          }

          // 添加页签并跳转到对应路由页面
          const tagInfo = {
            name: menuItem.meta.type + menuItem.name,
            path: menuItem.routerPath,
            query: menuItem.viewQuery,
            title: menuItem.showName,
            icon: menuItem.icon === undefined ? '' : menuItem.icon,
            isFixed: false,
            meta: menuItem.meta
          };
          this.$store.dispatch('tagsView/addView', tagInfo).then(() => {
            const route = {
              path: tagInfo.path
            };
            if (tagInfo.query) route.query = tagInfo.query;
            if (tagInfo.meta) route.meta = tagInfo.meta;
            this.$router.replace(route);
          });
          return;
        }
      }

      // 其他情况，直接刷新主页
      this.$router.replace({ path: '/' });
    },
  };
</script>