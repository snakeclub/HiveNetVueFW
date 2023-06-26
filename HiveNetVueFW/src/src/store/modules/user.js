/**
 * 用户登录相关状态数据
 */
import authActions from '@/utils/actions/auth';

const user = {
  namespaced: true,

  state: {
    token: authActions.getTokenCookie(), // 登录状态验证 token, 初始值从 cookie 中获取
    tokenExpires: undefined, // token失效时间
    userId: authActions.getUserIdCookie() || '', // 登录用户id
    cacheId: '', // 用户相关信息的缓存ID，用于判断是否需要更新
    name: '', // 用户名
    avatar: '', // 用户头像 url
    rights: [] // 用户权限清单, 格式见 ./src/api/config/user.js 的 getUserInfo 定义
  },

  mutations: {
    // 设置token
    SET_TOKEN: (state, payload) => {
      state.token = payload.token;
      state.tokenExpires = payload.tokenExpires;
      // 同时在Cookie中也要进行设置
      authActions.setTokenCookie(
        payload.token, payload.tokenExpires
      );
    },

    // 统一设置用户信息
    SET_USER_INFO: (state, payload) => {
      state.cacheId = payload.cacheId;
      console.debug('avatar', payload.avatar);
      if (payload.userId !== undefined) {
        state.userId = payload.userId;
        authActions.setUserIdCookie(state.userId); // 同时在Cookie中也要进行设置
      }
      if (payload.name !== undefined) { state.name = payload.name; }
      if (payload.avatar !== undefined) { state.avatar = payload.avatar; }
      if (payload.rights !== undefined) { state.rights = payload.rights; }
    },

    // 清除所有登录信息（配合logout使用）
    CLEAR_ALL_INFO: state => {
      state.token = undefined;
      state.tokenExpires = undefined;
      state.userId = '';
      state.name = '';
      state.avatar = '';
      state.rights = [];

      // 同时清除cookie的登录信息
      authActions.removeTokenCookie();
      authActions.removeUserIdCookie();
    }
  },

  actions: {
  }
};

export default user;
