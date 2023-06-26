<template>
  <div>
    <template v-for="(item, index) in getRightMenus">
      <template v-if="!item.realHidden">
        <div v-if="index > 0 && rightMenuDivider" class="right-menu-divider">
          <el-divider direction="vertical" style="margin: 0px;" ></el-divider>
        </div>
        <el-tooltip v-if="item.menuType !== 'main' && item.toolTip && item.toolTip !== '' && getDropDownTrigger(item) !== 'hover'" :content="$t(item.toolTip)" effect="dark" placement="bottom">
          <div v-if="item.showType !== 'component'" class="right-menu-item hover-effect" @click="clickMenu(item)">
            <right-menu-show-item :item="item" />
          </div>
          <right-menu-show-item v-else :item="item" @click="clickMenu(item)" />
        </el-tooltip>
        <!-- 没有toolTip的情况 -->
        <template v-else-if="item.menuType !== 'main'">
          <div v-if="item.showType !== 'component'" class="right-menu-item hover-effect" @click="clickMenu(item)">
            <right-menu-show-item :item="item" />
          </div>
          <right-menu-show-item v-else :item="item" @click="clickMenu(item)" />
        </template>
        <!-- 下拉列表 -->
        <div v-else class="right-menu-item hover-effect">
          <el-dropdown :trigger="getDropDownTrigger(item)" placement="bottom" @command="clickDropdown">
            <span>
              <right-menu-show-item :item="item" :dropDownItem="true" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                  <el-dropdown-item v-for="(childItem, index) in getChildrenMenus(item)"
                    :command="childItem.namePath"
                  >
                    <svg-icon v-if="childItem.icon" :icon-class="childItem.icon" class-name="right-menu-dropdown-item"></svg-icon>
                    {{ $t(childItem.showName) }}
                  </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
  /**
   * 右上角菜单模版
   */
  import { mapGetters } from 'vuex';
  import RightMenuShowItem from './RightMenuShowItem';
  import defaultSettings from '@/settings';
  import menuActions from '@/utils/actions/menu';

  export default {
    components: {
      RightMenuShowItem
    },
    computed: {
      ...mapGetters(["sidebar", "avatar", "devices", "rightMenus"]),

      // 获取右上角菜单列表
      getRightMenus() {
        return this.rightMenus;
      },
      // 是否显示右上角菜单项的分隔标记
      rightMenuDivider() {
        return defaultSettings.layout.rightMenuDivider;
      }
    },
    methods: {
      // 获取菜单的子菜单
      getChildrenMenus(menuItem) {
        if (menuItem.menuType === 'main' && menuItem.children && menuItem.children.length > 0) {
          return menuItem.children;
        } else {
          return [];
        }
      },
      // 获取菜单弹出方式
      getDropDownTrigger(menuItem) {
        return !menuItem.dropDownTrigger ? '' : menuItem.dropDownTrigger;
      },
      // 点击菜单对象
      clickMenu(menuItem) {
        if (menuItem.menuType !== 'main' && menuItem.menuType !== 'null') {
          menuActions.clickMenu('right', menuItem.namePath);
        }
      },
      // 点击下拉菜单
      clickDropdown(namePath) {
        menuActions.clickMenu('right', namePath);
      }
    }
  };

</script>

<style lang="scss" scoped>
.right-menu-dropdown-item {
  margin-right: 8px;
}

.right-menu-item {
  .el-dropdown {
    vertical-align: middle;
  }
}

</style>

