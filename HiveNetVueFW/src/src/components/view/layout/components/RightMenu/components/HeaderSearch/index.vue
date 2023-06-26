<template>
  <div :class="{'show':show}" class="header-search">
    <svg-icon class-name="navbar-icon" icon-class="search" @click.stop="click" />
    <el-select
      ref="headerSearchSelect" v-model="search"
      :remote-method="querySearch" :no-data-text="$t('No match menus')"
      filterable default-first-option
      remote :placeholder="$t('Search Menus')" class="header-search-select"
      @change="change"
      size="default"
    >
      <el-option v-for="option in options" :key="option.item.path" :value="option.item" :label="option.item.title" />
  </el-select>
  </div>
</template>

<script>
  /**
   * 顶部导航栏右边菜单的搜索按钮及搜索栏位
   * 可搜索当前可用的菜单
  */
  // fuse is a lightweight fuzzy-search module
  // make search results more in line with expectations
  import Fuse from 'fuse.js/dist/fuse.min.js';
  import menuActions from '@/utils/actions/menu';

  export default {
    name: 'HeaderSearch',
    props: {
      // 送入菜单对象
      menuItem: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        search: '', // 搜索输入的字符串
        options: [], // 根据搜索输入字符串找到的菜单项
        searchPool: [], // 可搜索的菜单清单
        show: false,
        fuse: undefined
      }
    },
    computed: {
      sidebarMenus() {
        return this.$store.getters.sidebarMenus;
      }
    },
    watch: {
      sidebarMenus() {
        this.searchPool = this.generateSearchList(this.sidebarMenus)
      },
      searchPool(list) {
        this.initFuse(list)
      },
      show(value) {
        if (value) {
          document.body.addEventListener('click', this.close)
        }
        else {
          document.body.removeEventListener('click', this.close)
        }
      }
    },
    mounted() {
      this.searchPool = this.generateSearchList(this.sidebarMenus)
    },
    methods: {
      // 点击搜索控件
      click() {
        this.show = !this.show
        if (this.show) {
          this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
        }
      },
      // 关闭搜索控件
      close() {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
        this.options = []
        this.show = false
      },
      // 点击搜索结果项
      change(val) {
        // 点击菜单
        menuActions.clickMenu('sidebar', val.path).catch(error => {
          this.$modal.messageError(error.toString());
        });

        // 恢复搜索框状态
        this.search = ''
        this.options = []
        this.$nextTick(() => {
          this.show = false
        })
      },
      // 将检索清单加载到Fuse对象
      initFuse(list) {
        this.fuse = new Fuse(list, {
          shouldSort: true,
          threshold: 0.4,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: [{
            name: 'title',
            weight: 0.7
        }, {
            name: 'path',
            weight: 0.3
        }]
        })
      },
      // 生成查询清单数组 [ { title: showName组成的搜索路径, path: name组成的搜索路径 }, ...]
      generateSearchList(sidebarMenus, baseName = '', baseShowName = '') {
        let res = [];
        for (const menuItem of sidebarMenus) {
          if (menuItem.realHidden || menuItem.realDisabled) {
            // 隐藏或屏蔽情况，不处理
            continue;
          }
          const title = baseShowName === '' ? this.$t(menuItem.showName) : baseShowName + ' > ' + this.$t(menuItem.showName);
          const namePath = baseName === '' ? menuItem.name : baseName + '/' + menuItem.name;
          if (menuItem.menuType === 'main') {
            // 处理子菜单
            if (menuItem.children && menuItem.children.length > 0) {
              const tempRes = this.generateSearchList(
                menuItem.children, namePath, title
              );
              res = res.concat(tempRes);
            }
          } else {
            // 处理当前菜单项
            const data = {
              title: title,
              path: namePath
            };
            res.push(data);
          }
        }
        // 返回结果
        return res;
      },

      // 根据查询条件检索，并设置可选项
      querySearch(query) {
        if (query !== undefined && query !== null && query !== '') {
          this.options = this.fuse.search(query);
        }
        else {
          this.options = [];
        }
      }
    }
  }

</script>

<style lang="scss" scoped>
  .header-search {

    .header-search-select {
      font-size: 18px;
      transition: width 0.2s;
      width: 0;
      overflow: hidden;
      background: transparent;
      border-radius: 0;
      display: inline-block;
      vertical-align: middle;

      ::v-deep .el-input__wrapper {
        //box-shadow: none !important;
        box-shadow: 0 0 0 1px var(--border-light-color) inset!important;
      }

      ::v-deep .el-input__inner {
        border-radius: 0;
        border: 0;
        padding-left: 0;
        padding-right: 0;
        box-shadow: none !important;
        // border-bottom: 1px solid #d9d9d9;
        vertical-align: middle;
      }
    }

    &.show {
      .header-search-select {
        width: 210px;
        margin-left: 10px;
      }
    }
  }

</style>
