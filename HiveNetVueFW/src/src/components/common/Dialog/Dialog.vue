<template>
    <el-dialog
        class="pop-dialog"
        :style="[dialogStyle]"
        v-model="dialogPopVisible"
        :title="title"
        :width="width"
        :fullscreen="fullscreen"
        :top="top"
        :modal="modal"
        :append-to-body="appendToBody"
        :lock-scroll="lockScroll"
        :close-on-click-modal="closeOnClickModal"
        :close-on-press-escape="closeOnPressEscape"
        :show-close="showClose"
        :before-close="onBeforeClose"
        :draggable="draggable"
        :center="center"
        :align-center="alignCenter"
        :destroy-on-close="destroyOnClose"
        :sub-component-props="subComponentProps"
    >
    <div><component :is="comps" v-bind="subComponentProps || {}"></component></div>
  </el-dialog>
</template>

<script>
/**
 * 自定义的全局使用Dialog
 */
import { provide, ref } from 'vue';
import { ElDialog } from "element-plus";
export default {
  data() {
    return {
      dialogPopVisible: true,
    };
  },
  components: { ElDialog },
  setup() {
    // 给子组件传递关闭事件的引用变量(通过ref实现响应式处理)
    const refCloseEvent = ref(true);

    // 关闭对话框
    const close = () => {
      refCloseEvent.value = false;
    };

    // 注册关闭窗口的函数, 供内容组件调用
    provide('close', close);

    return { refCloseEvent, close };
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: 'fit-content',
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    top: {
      type: String,
      default: '15vh',
    },
    modal: {
      type: Boolean,
      default: true,
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
    lockScroll: {
      type: Boolean,
      default: true,
    },
    closeOnClickModal: {
      type: Boolean,
      default: true,
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    center: {
      type: Boolean,
      default: false,
    },
    alignCenter: {
      type: Boolean,
      default: false,
    },
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
    // 关闭对话框执行的删除组件方法, 外部调用无需传入
    remove: {
      type: Function,
    },
    // 对话框要展示的组件对象或组件名
    comps: {
      require: false,
    },
    // 要展示的组件的属性传参, 字典格式
    subComponentProps: {
      require: false
    },
    /**
     * 要控制的样式处理, 支持以下特殊样式
     * --el-dialog-padding-primary: 20px  // 对话框内容的padding
     */
    dialogStyle: {
      require: false
    }
  },
  methods: {
    // before-close方法
    onBeforeClose(done) {
      done();
    }
  },
  watch: {
    dialogPopVisible(value) {
      if (!value) {
        this.remove();
      }
    },
    // 监控子组件关闭窗口的事件引用变量
    refCloseEvent(value) {
      if (!value) {
        this.remove();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .pop-dialog {

  }
</style>