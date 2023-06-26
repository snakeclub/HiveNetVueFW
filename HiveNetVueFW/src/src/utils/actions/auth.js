/**
 * 用户验证及权限相关方法
 */
import Cookies from 'js-cookie';
import jsSHA from 'jssha';
import bcryptjs from 'bcryptjs';
import JSEncrypt from 'jsencrypt/bin/jsencrypt.min';
import settings from '@/settings';
import datetimeTools from '@/utils/base/DatetimeTools.js';
import cache from '@/plugins/cache';
import { getStore } from '@/utils/base/global';
import apiCall from '@/api/index';
import { clearSessionRoutes } from '@/utils/SessionRouter';
import modal from '@/plugins/modal';

/**
 * 常量设置
 */
const SessionUserInfoKey = 'SessionUserInfo'; // 保存在会话缓存中的用户信息Key值
const TokenKey = 'ValidateToken'; // 保存在cookie中的token的key值
const UserKey = 'UserId'; // 保存在cookie中的userId的key值

/**
 * 处理登录/登出的通用跳转页面处理函数
 * @param {string} loginType - 登录模式, login-登录, logout-登出
 * @param {string} redirectType {string} - 登录以后跳转方式
 *     auto - 根据应用配置自动跳转(默认)
 *     no - 不做任何动作
 *     refresh - 刷新当前页面
 *     goto - 跳转到redirect指定的url地址
 *     resetUser - 重新获取用户信息(菜单/权限)
 * @param {string} redirect - 指定要跳转的地址, redirectType为auto和goto时有效
 */
async function redirectCommonFunc(loginType, redirectType, redirect) {
  let vRedirect;
  let vRedirectType = redirectType || 'auto';
  if (vRedirectType === 'auto') {
    // 根据应用配置自动判断跳转地址
    if (redirect) {
      vRedirect = redirect; // 指定了跳转地址, 按指定方式跳转
    } else if (settings.app.loginManageType === 'anonymous') {
      vRedirectType = 'resetUser'; // 匿名方式, 不使用登录页, 采用更新菜单的模式
    } else {
      vRedirect = loginType === 'login' ? settings.app.homePageUrl : settings.app.loginUrl; // 跳转到首页
    }
  }

  if (vRedirectType === 'no') {
    vRedirect = undefined;
  } else if (vRedirectType === 'goto') {
    vRedirect = redirect; // 直接跳转
  } else if (vRedirectType === 'resetUser') {
    // 更新用户信息
    const store = getStore();
    await authActions.getUserInfo({
      sysId: store.getters.sysId
    });
  }

  if (vRedirectType === 'refresh') {
    // 刷新当前页面
    location.reload();
  } else if (vRedirect) {
    location.href = vRedirect;
    // getRouter().push({ path: loginInfo.redirect }).catch(() => {});
  }
}

const authActions = {
  /**
   * 从Cookie获取token
   * @returns {string} - Cookie中的token值
   */
  getTokenCookie: () => {
    return Cookies.get(TokenKey);
  },

  /**
   * Cookie设置token
   * @param {string} token - 要设置的token值
   * @param {Date|Number} expiresTime - Cookie过期时间, 不传代表浏览器关闭就失效, 如果传入的是Number代表是天
   */
  setTokenCookie: (token, expiresTime) => {
    if (expiresTime === undefined) {
      return Cookies.set(TokenKey, token);
    } else {
      return Cookies.set(TokenKey, token, { expires: expiresTime });
    }
  },

  /**
   * 从Cookie删除token
   * @returns
   */
  removeTokenCookie: () => {
    return Cookies.remove(TokenKey);
  },

  /**
   * 从Cookie中获取用户ID
   * @returns {string} - 用户id
   */
  getUserIdCookie: () => {
    return Cookies.get(UserKey);
  },

  /**
   * Cookie设置用户ID
   * @param {string} userId
   * @returns
   */
  setUserIdCookie: (userId) => {
    return Cookies.set(UserKey, userId);
  },

  /**
   * 从Cookie中删除用户ID
   * @returns
   */
  removeUserIdCookie: () => {
    return Cookies.remove(UserKey);
  },

  /**
   * 获取用户验证需要的服务器参数
   * @param {string} username - 用户名
   * @returns {Promise} 成功返回JSON对象
   *   publicKey - RSA加密的公钥
   *   randomStr - 登录随机数
   *   salt - 用户名对应的密码加密盐
   */
  getAuthServerPara: (username) => {
    return new Promise((resolve, reject) => {
      // 先检查浏览器会话缓存是否存在
      const publicKey = cache.session.get('cachedRsaPublicKey');
      const reqData = {
        body: {
          'username': username,
          'publicKey': publicKey === null ? 'y' : 'n',
          'randomStr': 'y',
          'salt': 'y'
        }
      };

      apiCall('getAuthServerPara', reqData).then(resData => {
        // 成功获取到信息后的处理
        if (publicKey === null) {
          cache.session.set('cachedRsaPublicKey', resData.body.publicKey); // 登记公钥到缓存中
        }
        // 返回获取结果
        resolve({
          publicKey: publicKey === null ? resData.body.publicKey : publicKey,
          randomStr: resData.body.randomStr,
          salt: resData.body.salt
        });
      }).catch(error => {
        reject(error);
      });
    });
  },

  /**
   * 获取RSA加密的公共密钥
   */
  getPublicKey: () => {
    return new Promise((resolve, reject) => {
      const publicKey = cache.session.get('cachedRsaPublicKey');
      if (publicKey !== null) {
        resolve(publicKey);
        return;
      }

      // 通过接口获取
      apiCall('getAuthServerPara', {
        'publicKey': 'y', 'randomStr': 'n', 'salt': 'n'
      }).then(resData => {
        // 成功获取到信息后的处理
        cache.session.set('cachedRsaPublicKey', resData.body.publicKey); // 登记公钥到缓存中
        // 返回获取结果
        resolve(resData.body.publicKey);
      }).catch(error => {
        reject(error);
      });
    });
  },

  /**
   * 获取Rsa加密后的密码hash值
   * @param {string} username - 用户名
   * @param {string} password - 密码(明文)
   * @param {string} publicKey - 加密的rsa公钥
   * @returns {string} - 加密后的字符串
   */
  genRsaPwdHash: (username, password, publicKey) => {
    // pwdHash = HASH(用户名 + 密码)
    const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
    shaObj.update(username + password);
    // const pwdHash = shaObj.getHash('HEX');
    const pwdHash = shaObj.getHash('BYTES'); // 使用BYTES格式, 原文数据比较小, 支持RSA 1024长度使用

    // rsa加密
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey); // 设置公钥
    const rsaStr = encryptor.encrypt(pwdHash);

    if (!rsaStr) {
      throw Error('Generate password hash rsa encryption string error');
    }

    return rsaStr;
  },

  /**
   * 获取登录验证的密码
   * @param {string} username - 用户名
   * @param {string} password - 密码(明文)
   * @param {string} randomStr - 传输随机字符串
   * @param {string} salt - 加密盐
   * @returns {string} - 处理后的登录验证密码
   */
  genLoginPwdHash: (username, password, randomStr, salt) => {
    try {
      const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });

      // tempHash = HASH(用户名 + 密码)
      shaObj.update(username + password);
      const tempHash = shaObj.getHash('HEX');

      // pwdHash = BCrypt(tempHash, salt)
      const pwdHash = bcryptjs.hashSync(tempHash, salt);

      // loginPwdHash = HASH(pwdHash + randomStr)
      shaObj.update(pwdHash + randomStr);
      const loginPwdHash = shaObj.getHash('HEX');

      return loginPwdHash;
    } catch (error) {
      modal.messageError('generate login password hash error: ' + error);
    }
  },

  /**
   * 用户登录
   * @param {JSON} loginInfo - 登录信息对象
   *   loginType {string} - 登录类型, pwd-密码方式登录(默认)
   *   username {string} - 登录用户名
   *   password {string} - 登录密码(明文)
   *   captcha {string} - 验证码
   *   captchaUuid {string} - 服务端校验验证码的uuid(获取验证码图片时返回)
   *   redirectType {string} - 登录以后跳转方式
   *     auto - 根据应用配置自动跳转(默认)
   *     no - 不做任何动作
   *     refresh - 刷新当前页面
   *     goto - 跳转到redirect指定的url地址
   *     resetUser - 重新获取用户信息(菜单/权限)
   *   redirect {string} - 指定要跳转的地址, redirectType为auto和goto时有效
   * @returns {Promise}
   */
  login: async(loginInfo) => {
    // 暂时默认仅有 pwd 的登录方式, 未来再扩展其他登录方式
    try {
      const store = getStore();

      // 登录前先清空原有登录信息
      // 处理退出后用户缓存数据
      store.commit('user/CLEAR_ALL_INFO');
      // 清除所有菜单信息
      store.commit('menus/CLEAR_ALL_INFO');

      // 删除所有会话缓存
      cache.session.remove(store.getters.sysId + SessionUserInfoKey);
      clearSessionRoutes(store.getters.sysId);

      // 获取服务的登录参数
      const authPara = await authActions.getAuthServerPara(loginInfo.username);

      // 对密码进行加密处理
      const loginPwdHash = authActions.genLoginPwdHash(
        loginInfo.username, loginInfo.password, authPara.randomStr, authPara.salt
      );

      // 登录验证
      const data = await apiCall('userLogin', {
        body: {
          loginSysId: settings.ajaxMessage.sysId, // 登录系统id
          username: loginInfo.username, // 登录用户名
          validateHash: loginPwdHash, // 登录验证hash值
          captcha: loginInfo.captcha, // 验证码
          captchaUuid: loginInfo.captchaUuid // 验证码的uuid
        }
      });

      // 登录成功, 设置用户名为''，用于判断未获取用户信息
      store.commit('user/SET_USER_INFO', { userId: data.body.userId });

      // 设置token
      let expires; // 不返回有效期代表浏览器关闭就失效
      if (data.body.tokenExpires !== undefined) {
        if (data.body.tokenExpires === 0) {
          // 永久有效, 设置有效期为3年
          expires = datetimeTools.addTime(datetimeTools.now(), 3, 'y');
        } else {
          // 指定失效周期，单位为分钟
          expires = datetimeTools.addTime(datetimeTools.now(), data.body.tokenExpires, 'm');
        }
      }
      store.commit('user/SET_TOKEN', { token: data.body.token, tokenExpires: expires });

      // 登录成功后处理页面跳转
      await redirectCommonFunc('login', loginInfo.redirectType, loginInfo.redirect);
    } catch (error) {
      console.error('login error: ', error);
      throw error;
    }
  },

  /**
   * 用户退出登录
   * @param {string} redirectType - 退出登录以后跳转方式
   *     auto - 根据应用配置自动跳转(默认)
   *     no - 不做任何动作
   *     refresh - 刷新当前页面
   *     goto - 跳转到redirect指定的url地址
   *     resetUser - 重新获取用户信息(菜单/权限)
   * @param {string} redirect - 指定要跳转的地址, redirectType为auto和goto时有效
   * @returns {Promise}
   */
  logout: async(redirectType, redirect) => {
    const store = getStore();
    if (store.getters.token && (store.getters.tokenExpires === undefined || store.getters.tokenExpires < new Date())) {
      // 存在token并且token处于有效期内，需调用接口退出登录
      try {
        await apiCall('userLogout', { head: { userId: store.getters.userId }});
      } catch (error) {
        console.error('login error: ', error);
      }
    }

    // 处理退出后用户缓存数据
    store.commit('user/CLEAR_ALL_INFO');
    // 清除所有菜单信息
    store.commit('menus/CLEAR_ALL_INFO');

    // 删除所有会话缓存
    cache.session.remove(store.getters.sysId + SessionUserInfoKey);
    clearSessionRoutes(store.getters.sysId);

    // 登出成功后处理页面跳转
    await redirectCommonFunc('logout', redirectType, redirect);
  },

  /**
   * 修改密码
   * @param {JSON} changeInfo - 修改密码信息
   *   oldPassword {string} - 旧登录密码(明文)
   *   newPassword {string} - 新登录密码(明文)
   * @returns {Promise}
   */
  changePwd: async(changeInfo) => {
    try {
      const store = getStore();

      // 校验旧密码的处理, 按登录流程进程密码的加密处理
      const userName = store.getters.name;
      const authPara = await authActions.getAuthServerPara(userName);
      const oldPwdHash = authActions.genLoginPwdHash(
        userName, changeInfo.oldPassword, authPara.randomStr, authPara.salt
      );

      // 新密码的加密, 获取RSA加密公钥, 加密密码
      const publicKey = await authActions.getPublicKey();
      const newPwdHash = authActions.genRsaPwdHash(
        userName, changeInfo.newPassword, publicKey
      );

      // 调接口进行密码修改处理
      await apiCall('userLogin', {
        head: {
          userId: store.getters.userId
        },
        body: {
          validateHash: oldPwdHash, // 必填 char 旧密码验证hash值
          newPwdHash: newPwdHash // 必填 char 通过rsa加密的新登录密码
        }
      });
    } catch (error) {
      console.error('change password error: ', error);
      throw error;
    }
  },

  /**
   * 获取用户信息
   * @param {JSON} getPara - 获取参数，支持的参数包括
   *   sysId {string} - 指定需要获取的系统标识
   *   withBaseInfo {bool} - 是否获取基础信息, 默认为true
   *   withRights {bool} - 是否获取权限信息, 默认为true
   *   withMenus {bool} - 是否获取菜单信息, 默认为true
   * @returns {Promise}
   */
  getUserInfo: async(getPara) => {
    try {
      const store = getStore();

      // 判断是否从会话session中获取到其他页面
      let userInfoData = cache.session.getJSON(store.getters.sysId + SessionUserInfoKey);
      if (userInfoData === undefined) {
        // 会话中找不到用户信息, 通过接口获取
        console.log('before', store.getters.userId);
        const data = await apiCall(
          'getUserInfo', {
            head: { userId: store.getters.userId },
            body: {
              sysid: getPara === undefined || getPara.sysId === undefined ? '' : getPara.sysId, // 指定获取的系统标识
              withBaseInfo: getPara === undefined || getPara.withBaseInfo === undefined || getPara.withBaseInfo === true ? 'y' : 'n',
              withRights: getPara === undefined || getPara.withRights === undefined || getPara.withRights === true ? 'y' : 'n',
              withMenus: getPara === undefined || getPara.withMenus === undefined || getPara.withMenus === true ? 'y' : 'n'
            }
          }
        );

        // 获取成功, 更新会话信息
        cache.session.setJSON(store.getters.sysId + SessionUserInfoKey, data.body);
        userInfoData = data.body;
      }

      // 设置缓存的用户信息
      const baseInfo = userInfoData.baseInfo;
      const avatar = baseInfo.avatar === '' ? require('@/assets/images/profile.jpg') : baseInfo.avatar;
      store.commit('user/SET_USER_INFO', {
        userId: baseInfo.userId,
        name: baseInfo.name,
        avatar: avatar,
        rights: userInfoData.rights
      });

      // 处理获取到的系统信息
      if (settings.app.mutipleAppSupport) {
        const sysInfo = userInfoData.sysInfo;
        store.commit('app/SET_APP_SYS_CONFIG', {
          sysId: sysInfo.sysId,
          sysName: sysInfo.sysName === '' ? settings.app.name : sysInfo.sysName,
          logo: sysInfo.logo === '' ? settings.app.logo : sysInfo.logo
        });
      }

      // 设置菜单
      const sidebarMenus = userInfoData.menus.sidebarMenus === undefined ? [] : userInfoData.menus.sidebarMenus;
      const rightMenus = userInfoData.menus.rightMenus === undefined ? [] : userInfoData.menus.rightMenus;
      const fixedTags = userInfoData.menus.fixedTags === undefined ? [] : userInfoData.menus.fixedTags;

      store.commit('menus/SET_SIDEBAR_MENUS', sidebarMenus);
      store.commit('menus/SET_RIGHT_MENUS', rightMenus);
      store.commit('menus/SET_FIXED_TAGS', fixedTags);
      store.commit('menus/SET_404_ROUTE');
      store.commit('menus/SET_IS_LOADED', true);
    } catch (error) {
      // 获取失败抛出异常
      throw error;
    }
  },

  /**
   * 注册用户
   * @param {JSON} registerInfo
   *   registerType {string} - 注册类型, pwd-用户名密码模式(默认)
   *   username {string} - 登录用户名
   *   password {string} - 登录密码(明文)
   *   userInfo {JSON} - 用户基本信息对象
   *   captcha {string} - 验证码
   *   captchaUuid {string} - 服务端校验验证码的uuid(获取验证码图片时返回)
   */
  register: async(registerInfo) => {
    try {
      // 获取RSA加密公钥, 加密密码
      const publicKey = await authActions.getPublicKey();
      const pwdHash = authActions.genRsaPwdHash(
        registerInfo.username, registerInfo.password, publicKey
      );

      // 进行注册
      return await apiCall('UserRegister', {
        body: {
          username: registerInfo.username, // 登录用户名
          pwdHash: pwdHash, // 密码hash值
          captcha: registerInfo.captcha, // 验证码
          captchaUuid: registerInfo.captchaUuid, // 验证码的uuid
          userInfo: registerInfo.userInfo // 用户基本信息
        }
      });
    } catch (error) {
      console.error('register error: ', error);
      throw error;
    }
  }

};

export default authActions;
