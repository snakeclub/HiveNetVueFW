<template>
  <div>
    <keep-alive>
      <component :is="route.meta.componentName"
        :query="route.query"
        :params="route.params"
        v-bind="passProps || {}"
      ></component>
    </keep-alive>
  </div>
</template>

<script>
  /**
  * 可缓存页签页面的控件
  */
  export default {
    name: 'CacheView',
    props: {
      // 传递给页面的参数
      passProps: {
        type: Object,
        default: null
      }
    },
    computed: {
      route() {
        return this.$route;
      },
      // 是否显示组件
      isShow() {
        return this.$store.state.tagsView.cacheViewShow;
      }
    }
  };
</script>