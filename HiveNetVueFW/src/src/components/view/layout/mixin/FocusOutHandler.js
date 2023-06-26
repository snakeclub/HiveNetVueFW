/**
 * 处理页面焦点离开的mixin
 * 解决点击iframe时主页面下拉框等空间不关闭的问题
 */

export default {
  mounted() {
    // 监听页面焦点离开并处理关闭事件
    document.addEventListener('focusout', this.focusoutEvent);
  },
  beforeDestroy() {
    document.removeEventListener('focusout', this.focusoutEvent);
  },
  methods: {
    // 定义监听函数
    focusoutEvent() {
      // 不阻塞页面处理
      setTimeout(() => {
        const activeElement = document.activeElement;
        if (activeElement.nodeName === 'IFRAME') {
          // 如果点击的是iframe，则找到所有下拉框组件，执行组件的hide方法
          const dropdowns = document.querySelectorAll('.el-dropdown');
          for (const el of dropdowns) {
            if (el.__vueParentComponent.hide) {
              el.__vueParentComponent.hide();
            }
          }
        }
      }, 100);
    }
  }
};
