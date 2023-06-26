<template>
 <div class="size-select">
  <el-dropdown :trigger="getDropDownTrigger()" @command="handleSetSize">
    <span>
      <svg-icon class-name="navbar-icon" icon-class="size" />
    </span>
    <template #dropdown>
    <el-dropdown-menu>
      <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size===item.value" :command="item.value">
        {{ $t(item.label) }}
      </el-dropdown-item>
    </el-dropdown-menu>
    </template>
  </el-dropdown>
  </div>
</template>

<script>
  import { broadcastChangeSize } from '@/utils/iframe/IframeParent';

  export default {
    /**
     * 选择布局大小的模块
     */
    name: 'SizeSelect',
    props: {
      // 送入菜单对象
      menuItem: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        sizeOptions: [
          { label: 'Large', value: 'large' },
          { label: 'Default', value: 'default' },
          { label: 'Small', value: 'small' }
        ]
      };
    },
    computed: {
      size() {
        return this.$store.getters.size;
      }
    },
    methods: {
      // 获取菜单弹出方式
      getDropDownTrigger() {
        return !this.menuItem && !this.menuItem.dropDownTrigger ? 'hover' : this.menuItem.dropDownTrigger;
      },
      // 设置size属性
      handleSetSize(size) {
        this.$el.size = size; // 设置所有对象的size属性
        this.$store.dispatch('app/setSize', size);
        this.$store.commit('layoutSettings/SET_SIZE_REFRESH', true);
        // 通知子页面更新size
        broadcastChangeSize();
        this.$nextTick(() => {
          this.$modal.message({
            message: 'Switch Size Success',
            type: 'success'
          });
        });
      }
    }
  }

</script>

<style lang="scss" scoped>

.size-select {
  .el-dropdown {
    vertical-align: middle;
  }
}

</style>
