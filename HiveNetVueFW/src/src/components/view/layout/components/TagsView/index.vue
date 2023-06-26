<template>
  <div class="tabs-content">
    <div class="tabs-scroll">
      <el-tabs v-model="activeViewName" type="card" @tab-click="handleTag" @tab-remove="handleClose">
        <el-tab-pane
          :closable="!isFixedTag(tag)"
          :name="tag.name"
          v-for="tag in visitedViews"
          :key="tag.path"
        >
          <template #label>
            <span>
              <svg-icon v-if="tag.meta.icon" :icon-class="tag.meta.icon" class-name="tabs-icon"></svg-icon>
              <span>{{ $t(tag.meta.title) }}</span>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dropdown trigger="click">
      <svg-icon icon-class="el-icon-arrow-down" class-name="tabs-svg border-left" />
      <template #dropdown>
        <el-dropdown-menu class="tabs-menu">
          <el-dropdown-item
            :disabled="!hasActivedView"
            @click="handleMenuClick('refreshCurrent')"
            icon="i-refresh"
          >
            {{ $t('Refresh Current Tab') }}
          </el-dropdown-item>
          <el-dropdown-item
            :disabled="!isActivedViewCloseAble"
            @click="handleMenuClick('closeCurrent')"
            icon="i-close"
          >
            {{ $t('Close Current Tab') }}
          </el-dropdown-item>
          <el-divider></el-divider>
          <el-dropdown-item
            :disabled="isFirstTag"
            @click="handleMenuClick('closeLeft')"
            icon="i-d-arrow-left"
          >
            {{ $t('Close Tabs On Left') }}
          </el-dropdown-item>
          <el-dropdown-item
            :disabled="isLastTag"
            @click="handleMenuClick('closeRight')"
            icon="i-d-arrow-right"
          >
            {{ $t('Close Tabs On Right') }}
          </el-dropdown-item>
          <el-divider></el-divider>
          <el-dropdown-item
            :disabled="!hasActivedView"
            @click="handleMenuClick('closeOther')"
            icon="i-document-remove"
          >
            {{ $t('Close Other Tabs') }}
          </el-dropdown-item>
          <el-dropdown-item
            @click="handleMenuClick('closeAll')"
            icon="i-document-delete"
          >
            {{ $t('Close All Tabs') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
  import { tagsViewFuns } from "@/utils/actions/TagsViewFuns";

  export default {
    /**
     * 内容页面框架（标签页框架）
     * // icon="el-icon-download left"
     * icon="el-icon-download right"
     */
    data() {
        return {
            activeViewName: "" // 当前激活的页签名
        };
    },
    computed: {
        // 已打开的标签页
        visitedViews() {
            return this.$store.state.tagsView.visitedViews;
        },
        // 当前激活的页签
        activeView() {
            return this.$store.state.tagsView.activeView;
        },
        // 判断是否有激活的页签
        hasActivedView() {
            return this.$store.state.tagsView.activeView !== undefined;
        },
        // 当前激活页签是否可关闭
        isActivedViewCloseAble() {
            const tag = this.$store.state.tagsView.activeView;
            if (tag && !tagsViewFuns.isFixedTag(tag)) {
                return true;
            }
            else {
                return false;
            }
        },
        // 判断是否第一个页签, 用于控制菜单中关闭左侧项的现实
        isFirstTag() {
            const tag = this.$store.state.tagsView.activeView;
            return tagsViewFuns.isFirstTag(tag);
        },
        // 判断是否最后一个页签
        isLastTag() {
            const tag = this.$store.state.tagsView.activeView;
            return tagsViewFuns.isLastTag(tag);
        }
    },
    watch: {
        // 监控当前路由的变化，将新的路由放到页签清单中
        $route() {
            tagsViewFuns.addTagByRoute(this.$route);
            // 跳转到激活的页签上
            const tag = tagsViewFuns.getTagByPath(this.$route.path, this.$route.query);
            this.$store.commit("tagsView/SET_ACTIVE_VIEW", tag);
            // 如果是iframe，设置当前iframe的id
            if (tag && tag.meta && tag.meta.isCachedIframe !== undefined && tag.meta.isCachedIframe) {
                this.$store.commit("cachedIframe/SET_CURRENT_IFRAME_ID", tag.meta.cachedName);
            }
            else {
                this.$store.commit("cachedIframe/SET_CURRENT_IFRAME_ID", "");
            }
        },
        // 监控激活菜单的变化
        activeView() {
            const tag = this.activeView;
            this.activeViewName = tag ? tag.name : "";
        }
    },
    mounted() {
        // 启动时, 需要判断是否刷新页面
        if (this.$store.getters.visitedViews.length === 0) {
            // 第一次加载，初始化固定页签
            tagsViewFuns.initFixedTags();
        }
        // 将当前路由放入页签清单
        tagsViewFuns.addTagByRoute(this.$route);
        // 跳转到激活的页签上
        const tag = tagsViewFuns.getTagByPath(this.$route.path, this.$route.query);
        this.$store.commit("tagsView/SET_ACTIVE_VIEW", tag);
        // 如果是iframe，设置当前iframe的id
        if (tag && tag.meta && tag.meta.isCachedIframe !== undefined && tag.meta.isCachedIframe) {
            this.$store.commit("cachedIframe/SET_CURRENT_IFRAME_ID", tag.meta.cachedName);
        }
        else {
            this.$store.commit("cachedIframe/SET_CURRENT_IFRAME_ID", "");
        }
    },
    methods: {
        // 点击页签执行的动作
        handleTag(tab) {
            const tag = tagsViewFuns.getTagByName(tab.props.name);
            // 如果存在顶部菜单，在跳转前先切换菜单, 保证菜单组件可以正确设置激活路由
            if (this.$store.state.layoutSettings.topNav) {
                // 匹配菜单对象
                let menuItem;
                if (tag.meta && tag.meta.type && tag.meta.type === "sidebar") {
                    menuItem = this.$store.getters.sidebarMenusIndex.byName[tag.meta.name];
                }
                else if (tag.meta && tag.meta.type && tag.meta.type === "fixedTag") {
                    menuItem = this.$store.getters.sidebarMenusIndex.byFixedTagName[tag.meta.name];
                }
                // 判断是否切换左侧菜单
                if (menuItem) {
                    const nameIndex = menuItem.namePath.split("/");
                    if (nameIndex[0] !== this.$store.getters.activeTopNavMenu) {
                        // 切换左侧菜单
                        this.$store.commit("app/SET_ACTIVE_MENU", { activeTopNavMenu: nameIndex[0] });
                    }
                }
            }
            // 跳转到页签对应的路由, 只有路由发生变化才跳转
            if (!tagsViewFuns.isSameTag(tag, { path: this.$route.path, query: this.$route.query })) {
                this.$router.push({ path: tag.path, query: tag.query, meta: tag.meta });
            }
        },
        // 点击页签关闭按钮
        handleClose(tabName) {
            const tag = tagsViewFuns.getTagByName(tabName);
            tagsViewFuns.closeTag(tag);
        },
        // 点击菜单
        handleMenuClick(clickType) {
            console.debug(clickType);
            const activeTag = this.$store.state.tagsView.activeView;
            if (clickType === "refreshCurrent") {
                // 刷新当前激活页签
                tagsViewFuns.refreshTag(activeTag);
            }
            else if (clickType === "closeCurrent") {
                // 关闭当前激活页签
                tagsViewFuns.closeTag(activeTag);
            }
            else if (clickType === "closeLeft") {
                // 关闭当前激活页签左边的页签
                tagsViewFuns.closeLeftTags(activeTag);
            }
            else if (clickType === "closeRight") {
                // 关闭当前激活页签右边的页签
                tagsViewFuns.closeRightTags(activeTag);
            }
            else if (clickType === "closeOther") {
                // 关闭当前激活页签之外的页签
                tagsViewFuns.closeOthersTags(activeTag);
            }
            else if (clickType === "closeAll") {
                // 关闭所有页签
                tagsViewFuns.closeAllTags();
            }
        },
        // 判断是否固定页签
        isFixedTag(tag) {
            return tagsViewFuns.isFixedTag(tag);
        }
    }
}

</script>

