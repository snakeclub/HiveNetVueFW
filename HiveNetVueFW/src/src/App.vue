<template>
  <el-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </el-config-provider>
</template>

<script>
import { ElConfigProvider } from 'element-plus';
import i18n from './i18n/index';

export default {
  name: 'App',
  components: {
    ElConfigProvider, // 通过ElConfigProvider设置element-plus的多国语言设置
  },
  created () {
    // 支持页面刷新按钮，在页面加载时读取sessionStorage
    if (sessionStorage.getItem('refreshStore')) {
      console.debug('restore refreshStore');
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('refreshStore'))));
      this.$store.commit('menus/SET_IS_REFRESH', true); // 通知路由需要刷新菜单及路由
      this.$store.commit('layoutSettings/CHANGE_SETTING', { 'forceRefreshThemes': true }); // 通知路由需要刷新样式
    }

    // 支持页面刷新按钮，在页面刷新时将store保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      console.debug('save refreshStore');
      // 清除缓存信息
      this.$store.commit('cachedIframe/DEL_ALL_CACHED_IFRAMES'); // 删除iframe的缓存信息
      // 保存store信息
      sessionStorage.setItem('refreshStore', JSON.stringify(this.$store.state));
    })
  },
  computed: {
    locale() {
      // 动态设置i18n语言
      return i18n.global.messages[i18n.global.locale];
    }
  },
  metaInfo() {
    return {
      title: this.$store.state.layoutSettings.dynamicTitle && this.$store.state.layoutSettings.title,
      titleTemplate: title => {
        return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
      }
    }
  }
}
</script>
