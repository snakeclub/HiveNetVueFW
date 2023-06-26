/**
 * 页面大小改变的mixin
 * 处理设备类型判断
 */
import store from '@/store';

const { body } = document;
const PC_MIN_WIDTH = 992; // refer to Bootstrap's responsive design
const PAD_MIN_WIDTH = 450;

export default {
  watch: {
    $route(route) {
      if (this.device !== 'desktop' && this.sidebar.opened) {
        store.dispatch('app/closeSideBar', { withoutAnimation: false });
      }
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler);
  },
  mounted() {
    const deviceType = this.$_getDevice();
    store.dispatch('app/toggleDevice', deviceType);
    if (deviceType !== 'desktop') {
      store.dispatch('app/closeSideBar', { withoutAnimation: true });
    }
  },
  methods: {
    // 判断设备是什么设备
    $_getDevice() {
      const rect = body.getBoundingClientRect();
      if (rect.width - 1 >= PC_MIN_WIDTH) {
        return 'desktop';
      } else if (rect.width - 1 >= PAD_MIN_WIDTH) {
        return 'pad';
      } else {
        return 'mobile';
      }
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const deviceType = this.$_getDevice();
        store.dispatch('app/toggleDevice', deviceType);

        if (deviceType !== 'desktop') {
          store.dispatch('app/closeSideBar', { withoutAnimation: true });
        }
      }
    }
  }
};

