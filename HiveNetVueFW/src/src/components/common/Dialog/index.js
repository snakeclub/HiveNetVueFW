import Dialog from './Dialog.vue';
import { h, render } from 'vue';

const createMount = (opts) => {
  const mountNode = document.createElement('div');
  document.body.appendChild(mountNode);
  const vnode = h(Dialog, {
    ...opts,
    remove: () => {
      document.body.removeChild(mountNode);
    }
  });
  vnode.appContext = Modal._context;
  render(vnode, mountNode);
};
const Modal = {
  install(app, options) {
    app.config.globalProperties.$dialog = {
      show: (component, options = {}, params) => {
        options.id = options.id || 'v3popup_' + 1; // 唯一id 删除组件时用于定位
        const dialogProps = options.dialogProps || {}; // 对话框的属性入参
        dialogProps.subComponentProps = options.subComponentProps || {}; // 对话框嵌入组件的属性入参
        createMount({
          comps: component,
          ...dialogProps
        });
      }
    };
  },
  _context: null
};

export default Modal;
