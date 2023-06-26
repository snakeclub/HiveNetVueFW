<template>
  <el-drawer title="主题设置" v-model="showLayoutSettings" :show-close="true">
    <div class="draw-content">
      <el-divider>日间/夜间模式切换</el-divider>
      <div class="flex-justify-center day-mode">
        <el-switch
          v-model="nightMode"
          active-text="夜间模式"
          inactive-text="日间模式"
          size="default"
        ></el-switch>
      </div>
      <el-divider>系统主题</el-divider>
      <div class="checkbox-row">
        <div
          class="checkbox-item"
          v-for="(item, index) in systemThemeList"
          :key="index"
          :class="{ active: item === systemThemeColor }"
          :style="{ backgroundColor: item }"
          @click="changeThemes('systemThemeColor', item)"
        ></div>
        <el-color-picker
          v-model="systemThemeColor"
          @active-change="changeThemes('systemThemeColor', $event)"
        ></el-color-picker>
      </div>
      <el-divider>顶端导航栏主题</el-divider>
      <div class="checkbox-row">
        <div
          class="checkbox-item"
          v-for="(item, index) in navbarThemeList"
          :key="index"
          :class="{ active: item === navbarThemeColor }"
          :style="{ backgroundColor: item }"
          @click="changeThemes('navbarThemeColor', item)"
        ></div>
        <el-color-picker
          v-model="navbarThemeColor"
          @active-change="changeThemes('navbarThemeColor', $event)"
        ></el-color-picker>
      </div>
      <el-divider>左侧菜单主题</el-divider>
      <div class="checkbox-row">
        <div
          class="checkbox-item"
          v-for="(item, index) in sidebarThemeList"
          :key="index"
          :class="{ active: item === sidebarThemeColor }"
          :style="{ backgroundColor: item }"
          @click="changeThemes('sidebarThemeColor', item)"
        ></div>
        <el-color-picker
          v-model="sidebarThemeColor"
          @active-change="changeThemes('sidebarThemeColor', $event)"
        ></el-color-picker>
      </div>
      <el-divider>界面显示</el-divider>
      <div class="other-row">
        <span>系统Logo</span>
        <el-switch
          v-model="sidebarLogo"
          class="custom-switch"
          size="default"
        ></el-switch>
      </div>
      <div class="other-row">
        <span>左侧菜单改变大小</span>
        <el-switch
          v-model="sidebarResizeable"
          class="custom-switch"
          size="default"
        ></el-switch>
      </div>
      <div class="other-row">
        <span>顶端导航菜单</span>
        <el-switch
          v-model="topNav"
          class="custom-switch"
          size="default"
        ></el-switch>
      </div>
      <div class="other-row">
        <span>面包屑导航栏</span>
        <el-switch
          v-model="breadcrumb"
          class="custom-switch"
          size="default"
        ></el-switch>
      </div>
      <div class="other-row">
        <span>页签导航栏</span>
        <el-switch
          v-model="tagsView"
          class="custom-switch"
          size="default"
        ></el-switch>
      </div>
      <div class="other-row">
        <span>动态标题</span>
        <el-switch
          v-model="dynamicTitle"
          class="custom-switch"
          size="default"
        ></el-switch>
      </div>
    </div>
    <div class="flex-justify-center">
      <el-button type="primary" @click="saveThemes('sys')" v-if="isSysLayout" size="default">保存设置</el-button>
      <el-button type="primary" @click="saveThemes('global')" v-else size="default">设为默认设置</el-button>
      <el-button type="primary" @click="clearThemes" size="default">清除设置</el-button>
    </div>
  </el-drawer>
</template>

<script>
import settings from '@/settings';
import { refreshViewThemes, saveThemesToStorage, clearThemesFromStorage } from '@/utils/actions/LayoutSettings';

export default {
  data() {
    return {
      systemThemeList: settings.layout.systemThemeList,
      navbarThemeList: settings.layout.navbarThemeList,
      sidebarThemeList: settings.layout.sidebarThemeList
    };
  },
  computed: {
    // 是否是系统界面
    isSysLayout() {
      return this.$store.state.app.sysId !== undefined && this.$store.state.app.sysId !== '';
    },
    // 是否显示设置界面
    showLayoutSettings: {
      get() {
        return this.$store.state.layoutSettings.showLayoutSettings;
      },
      set(val) {
        this.$store.dispatch('layoutSettings/changeSetting', {
          'showLayoutSettings': val
        });
      }
    },
    // 切换日间模式和夜间模式
    nightMode: {
      get() {
        return this.$store.state.layoutSettings.nightMode;
      },
      set(val) {
        this.$store.dispatch('layoutSettings/changeSetting', {
          'nightMode': val
        });
        refreshViewThemes();
      }
    },
    // 设置系统主题颜色
    systemThemeColor: {
      get() {
        return this.$store.state.layoutSettings.systemThemeColor;
      },
      set(val) {
        this.$store.dispatch('layoutSettings/changeSetting', {
          'systemThemeColor': val
        });
      }
    },
    // 设置顶栏主题颜色
    navbarThemeColor: {
      get() {
        return this.$store.state.layoutSettings.navbarThemeColor;
      },
      set(val) {
        this.$store.dispatch('layoutSettings/changeSetting', {
          'navbarThemeColor': val
        });
      }
    },
    // 设置侧边栏主题颜色
    sidebarThemeColor: {
      get() {
        return this.$store.state.layoutSettings.sidebarThemeColor;
      },
      set(val) {
        this.$store.dispatch('layoutSettings/changeSetting', {
          'sidebarThemeColor': val
        });
      }
    },
    // 设置是否显示系统logo
    sidebarLogo: {
      get() {
        return this.$store.state.layoutSettings.sidebarLogo;
      },
      set(val) {
        this.$store.dispatch('layoutSettings/changeSetting', {
          'sidebarLogo': val
        });
      }
    },
    // 设置是否允许左侧菜单改变大小
    sidebarResizeable: {
      get() {
        return this.$store.state.layoutSettings.sidebarResizeable;
      },
      set(val) {
        this.$store.dispatch('layoutSettings/changeSetting', {
          'sidebarResizeable': val
        });
      }
    },
    // 设置是否显示顶端菜单
    topNav: {
      get() {
        return this.$store.state.layoutSettings.topNav;
      },
      set(val) {
        this.$store.dispatch('layoutSettings/changeSetting', {
          'topNav': val
        });
      }
    },
    // 设置是否显示面包屑导航
    breadcrumb: {
      get() {
        return this.$store.state.layoutSettings.breadcrumb;
      },
      set(val) {
        this.$store.dispatch('layoutSettings/changeSetting', {
          'breadcrumb': val
        });
      }
    },
    // 设置是否显示页签栏位
    tagsView: {
      get() {
        return this.$store.state.layoutSettings.tagsView;
      },
      set(val) {
        this.$store.dispatch('layoutSettings/changeSetting', {
          'tagsView': val
        });
      }
    },
    // 设置是否动态标题
    dynamicTitle: {
      get() {
        return this.$store.state.layoutSettings.dynamicTitle;
      },
      set(val) {
        this.$store.dispatch('layoutSettings/changeSetting', {
          'dynamicTitle': val
        });
      }
    }
  },
  methods: {
    // 改变主题样式（颜色）
    changeThemes(themesType, val) {
      // 先修改store
      const themes = {};
      themes[themesType] = val;
      this.$store.dispatch('layoutSettings/changeSetting', themes);
      // 刷新页面样式
      refreshViewThemes();
    },
    // 保存主题配置
    saveThemes(saveType) {
      if (saveType === 'sys') {
        saveThemesToStorage({}, this.$store.state.app.sysId);
        this.$modal.messageSuccess('Save system themes success!');
      } else {
        saveThemesToStorage({});
        this.$modal.messageSuccess('Save global themes success!');
      }
    },
    // 清除所有设置
    clearThemes() {
      clearThemesFromStorage();
      // 刷新页面样式
      refreshViewThemes();
      this.$modal.messageSuccess('Clear themes settings success!');
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/themes.scss';
$nav-bg-dark: #273352;

.draw-content {
  height: calc(100% - 35px);
  overflow-y: auto;
}

.day-mode {
  padding-bottom: 10px 0;
}

.nav-row {
  display: flex;
}

.nav-item {
  width: 56px;
  height: 50px;
  margin-right: 16px;
  border-radius: 4px;
  background-color: #f0f2f5;
  position: relative;
  box-shadow: 0 0 2px rgba(20, 16, 16, 0.2);
  cursor: pointer;
  border: 2px solid #fff;

  &.active {
    border-color: $systemTheme;
  }

  //  box-shadow: 0 0 2.5px red;
  &.nav-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 17px;
    background-color: $nav-bg-dark;
    border-top-left-radius: inherit;
    border-bottom-left-radius: inherit;
  }

  &.nav-item::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 12px;
    background-color: #fff;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
  }

  &.nav-item-0::before {
    z-index: 1;
  }

  &.nav-item-1::before {
    background-color: #fff;
  }

  &.nav-item-1::after,
  &.nav-item-2::after {
    background-color: $nav-bg-dark;
    border-top-left-radius: inherit;
    border-bottom-right-radius: 0;
  }

  &.nav-item-2::before {
    display: none;
  }

  &.nav-item-3::before {
    z-index: 1;
    width: 14px;
    box-shadow: 8px 0 0 #fff;
  }

  &.nav-item-3::after {
    right: 0;
    border-bottom-right-radius: 0;
  }
}

.checkbox-row {
  display: flex;
  justify-content: space-between;

  .checkbox-item {
    width: 20px;
    height: 20px;
    border: 1px solid #ddd;
    border-radius: 2px;
    cursor: pointer;
    position: relative;

    &.active {
      border-color: $systemTheme;

      &::before {
        content: '\2713';
        font-size: 14px;
        color: #fff;
        position: absolute;
        top: -1px;
        left: 3px;
      }
    }
  }
}

::v-deep(.el-color-picker) {
  width: 20px !important;
  height: 20px !important;
}

::v-deep(.el-color-picker__trigger) {
  width: 20px !important;
  height: 20px !important;
}

::v-deep(.el-color-picker__color) {
  border: none !important;
}

::v-deep(.el-color-picker__trigger) {
  padding: 0 !important;
}
.other-row {
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  color: #273352;
  margin-bottom: 5px;
}
.night-mode {
  .other-row {
    color: #c9d1d9;
  }
}

</style>
