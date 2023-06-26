<template>
 <div class="lang-select">
  <el-dropdown :trigger="getDropDownTrigger()" @command="handleSetLang">
    <span>
      <svg-icon class-name="navbar-icon" icon-class="language" />
    </span>
    <template #dropdown>
    <el-dropdown-menu>
      <el-dropdown-item v-for="item of langSupport" :key="item.lang" :disabled="lang===item.lang" :command="item.lang">
        <svg-icon v-if="item.icon && item.icon !== ''" :icon-class="item.icon" />
        {{ item.showName }}
      </el-dropdown-item>
    </el-dropdown-menu>
    </template>
  </el-dropdown>
  </div>
</template>

<script>
  import { broadcastChangeLang } from '@/utils/iframe/IframeParent';
  import { mapGetters } from 'vuex';
  import settings from "@/settings";

  export default {
    /**
     * 多国语言切换模版
     */
    name: 'LangSelect',
    props: {
      // 送入菜单对象
      menuItem: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        langSupport: settings.app.langSupport
      };
    },
    computed: {
      ...mapGetters(['lang'])
    },
    methods: {
      // 获取菜单弹出方式
      getDropDownTrigger() {
        return !this.menuItem && !this.menuItem.dropDownTrigger ? 'hover' : this.menuItem.dropDownTrigger;
      },
      // 修改当前语言
      handleSetLang(lang) {
        this.$i18n.locale = lang;
        this.$store.commit('app/SET_LANG', lang);
        broadcastChangeLang(); // 通知所有子页面变更语言
        this.$modal.message({
          message: this.$t('Change Language Success'),
          type: 'success'
        });
      }
    }
  }
</script>

<style lang="scss" scoped>

.lang-select {
  .el-dropdown {
    vertical-align: middle;
  }
}

</style>
