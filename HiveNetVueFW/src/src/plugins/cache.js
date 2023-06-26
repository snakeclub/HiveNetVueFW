// 缓存处理插件

/**
 * 浏览器会话级缓存的操作方法集合
 * (会话关闭删除缓存)
 */
export const sessionCache = {
  /**
   * 设置缓存
   * @param {string} key - 缓存key
   * @param {any} value - 缓存值
   * @returns
   */
  set(key, value) {
    if (!sessionStorage) {
      return;
    }
    if (key != null && value != null) {
      sessionStorage.setItem(key, value);
    }
  },

  /**
   * 获取缓存
   * @param {string} key - 缓存key
   * @returns {any} - 返回缓存值
   */
  get(key) {
    if (!sessionStorage) {
      return null;
    }
    if (key == null) {
      return null;
    }
    return sessionStorage.getItem(key);
  },

  /**
   * 设置JSON对象的缓存
   * @param {string} key - 缓存key
   * @param {JSON} jsonValue - 要设置到缓存的JSON对象
   */
  setJSON(key, jsonValue) {
    if (jsonValue != null) {
      this.set(key, JSON.stringify(jsonValue));
    }
  },

  /**
   * 获取JSON缓存对象
   * @param {string} key - 缓存key
   * @returns {JSON} - 缓存的JSON对象
   */
  getJSON(key) {
    const value = this.get(key);
    if (value != null) {
      return JSON.parse(value);
    }
  },

  /**
   * 删除缓存
   * @param {string} key
   */
  remove(key) {
    sessionStorage.removeItem(key);
  }
};

/**
 * 浏览器本地缓存
 * （一直保存不删除）
 */
export const localCache = {
  /**
   * 设置缓存
   * @param {string} key - 缓存key
   * @param {any} value - 缓存值
   * @returns
   */
  set(key, value) {
    if (!localStorage) {
      return;
    }
    if (key != null && value != null) {
      localStorage.setItem(key, value);
    }
  },

  /**
   * 获取缓存
   * @param {string} key - 缓存key
   * @returns {any} - 返回缓存值
   */
  get(key) {
    if (!localStorage) {
      return null;
    }
    if (key == null) {
      return null;
    }
    return localStorage.getItem(key);
  },

  /**
   * 设置JSON对象的缓存
   * @param {string} key - 缓存key
   * @param {JSON} jsonValue - 要设置到缓存的JSON对象
   */
  setJSON(key, jsonValue) {
    if (jsonValue != null) {
      this.set(key, JSON.stringify(jsonValue));
    }
  },

  /**
   * 获取JSON缓存对象
   * @param {string} key - 缓存key
   * @returns {JSON} - 缓存的JSON对象
   */
  getJSON(key) {
    const value = this.get(key);
    if (value != null) {
      return JSON.parse(value);
    }
  },

  /**
   * 删除缓存
   * @param {string} key
   */
  remove(key) {
    localStorage.removeItem(key);
  },

  /**
   * 删除所有本地缓存
   */
  clear() {
    localStorage.clear();
  }
};

export default {
  /**
   * 会话级缓存
   */
  session: sessionCache,

  /**
   * 本地缓存
   */
  local: localCache
};
