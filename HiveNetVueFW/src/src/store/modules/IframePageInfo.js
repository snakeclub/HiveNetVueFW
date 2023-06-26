/**
 * 登记当前被打开的页面的iframe信息（被嵌入layout框架的页面自身登记的信息，非layout框架使用）
 */

const state = {
  isIframe: false, // 当前页面是否layout框架下的嵌入页面
  sysId: '', // layout框架的系统标识
  iframeId: '', // 当前页面的iframeId
  tagName: '', // 当前iframe的页签名
  size: '', // 显示大小
  lang: '', // 显示语言
  pageHeight: 0, // 页面高度，用于判断是否要通知父页面改变iframe高度
  themes: {}, // layout框架的主题, 页面可监控该变量，发现变化时更新主题
  useSelfModal: false, // 指定消息提示框等是否使用页面自身，如果不喜欢消息通过框架处理，可指定为true
  // 主框架iframe容器大小，iframeSizeType为fit，或设置了listenContainerResize会实时更新
  containerSize: { width: 0, height: 0 },
  // 主框架iframe容器的滚动条位置信息，当页面设置了listenContainerScroll参数将自动更新
  containerScroll: { scrollLeft: 0, scrollTop: 0 }
};

const mutations = {
  CHANGE_INFO: (state, payload) => {
    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(state, key)) {
        state[key] = payload[key];
      }
    }
  }
};

const actions = {
  // 修改布局设置，可在字典传入多个值进行设置
  changeInfo({ commit }, payload) {
    commit('CHANGE_INFO', payload);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
