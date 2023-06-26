<template>
  <div class="el-logo">
    <transition name="sidebarLogoFade">
      <router-link to="/">
        <el-tooltip v-if="logo" :effect="'light'" :content="$t(title)">
          <img :src="logo" />
        </el-tooltip>
        <span class="title" :class="{ 'is-hide': collapse }">{{ $t(title) }}</span>
      </router-link>
    </transition>
  </div>
</template>

<script>
  import settings from "@/settings";

  export default {
    /**
     * 侧边栏logo模版
     */
    name: 'SidebarLogo',
    props: {
      // 是否展开
      collapse: {
        type: Boolean,
        required: true
      }
    },
    computed: {
    },
    data() {
      return {
        title: settings.app.mutipleAppSupport ? this.$store.state.app.sysName : settings.app.name,
        logo: settings.app.mutipleAppSupport ? this.$store.state.app.logo : settings.app.logo
      }
    }
  }

</script>

