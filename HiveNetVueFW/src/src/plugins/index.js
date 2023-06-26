import cache from './cache';
import modal from './modal';
import download from './download';

export default {
  install(app) {
    // vue3.x 需要通过以下方式替代 Vue.prototype. 的写法
    // 缓存对象
    app.config.globalProperties.$cache = cache;
    // 模态框对象
    app.config.globalProperties.$modal = modal;
    // 下载文件
    app.config.globalProperties.$download = download;
  }
};
