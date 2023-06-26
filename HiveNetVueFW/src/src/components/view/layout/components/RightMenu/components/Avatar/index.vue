<template>
   <div class="avatar">
    <el-avatar :shape="shape" :size="size" fit="cover" :src="avatar">
    </el-avatar>
    <span v-if="showName">{{ realname }}</span>
    <svg-icon v-if="dropDownIcon" icon-class="el-icon-caret-bottom" class="dropdown-icon"></svg-icon>
   </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    /**
     * 头像显示模版
     */
    name: 'Avatar',
    props: {
      /**
       * 传入JSON格式的公共参数，支持的参数包括
       * shape: 头像形状, 默认circle - circle / square
       * size: 头像大小，可以为数字或固定标识, 默认为24, - number / large / default / small
       * showName: 是否显示用户名，默认为true - true / false
       * dropDownIcon: 是否包括下拉列表图标, 默认为false - true / false
       */
      shape: {
        type: String,
        default: 'circle'
      },
      size: {
        type: [Number, String],
        default: 24
      },
      showName: {
        type: Boolean,
        default: true
      },
      dropDownIcon: {
        type: Boolean,
        default: false
      },
      // 送入菜单对象
      menuItem: {
        type: Object,
        required: false
      }
    },
    data() {
      return {};
    },
    computed: {
      ...mapGetters(['avatar']),
      realname() {
        const userId = this.$store.getters.userId;
        const username = this.$store.getters.name;
        if (userId === undefined || userId === '') {
          return this.$t(username);
        } else {
          return username;
        }
      },
    }
  };
</script>

<style lang="scss" scoped>
.avatar {
  // height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content;

  .el-avatar {
    vertical-align: middle;
    margin-right: 4px;
  }

  .dropdown-icon {
    font-size: 12px;
  }
}

</style>
