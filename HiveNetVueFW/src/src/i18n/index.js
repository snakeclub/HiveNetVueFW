import { createI18n } from 'vue-i18n';
import { localCache } from '@/plugins/cache';
import defaultSettings from '@/settings';

/**
 * 根据支持语言配置加载语言文件
 *
 * @returns {JSON} - 返回包含语言配置的json对象, 例如
 *   {
 *     'en': {...}, 'zh-cn': {...}, ...
 *   }
 */
function getMessages() {
  const messages = {};
  const langSupport = defaultSettings.app.langSupport;
  for (let i = 0; i < langSupport.length; i++) {
    // 遍历加载不同语言文件
    const langConfig = langSupport[i];
    const selfMessages = require('./lang/' + langConfig.lang + '.js').default; // 自定义语言
    const elementMessages = require('./ElementPlusLang/' + langConfig.lang + '.js'); // element-plus的语言
    delete elementMessages.name;
    // 合并到一个配置中
    messages[langConfig.lang] = Object.assign(selfMessages, elementMessages);
  }
  return messages;
}

/**
 * 获取支持的语言标识清单
 *
 * @returns {list} - 返回语言标识清单数组
 */
function getSupportLangs() {
  const langs = [];
  const langSupport = defaultSettings.app.langSupport;
  for (let i = 0; i < langSupport.length; i++) {
    langs.push(langSupport[i].lang);
  }
  return langs;
}

// 工具接口
const i18nTools = {
  // 支持语言标识清单
  supportLangs: getSupportLangs(),

  /**
   * 获取当前语言标识
   *
   * @returns {string} - 返回当前语言标识
   */
  getLocale: () => {
    let locale = localCache.get('lang') || defaultSettings.app.lang;
    if (!i18nTools.supportLangs.includes(locale)) {
      locale = defaultSettings.layout.lang;
    }
    return locale;
  }
};

// 创建i18n对象
const i18n = createI18n({
  locale: i18nTools.getLocale(),
  fallbackLocale: defaultSettings.app.lang,
  messages: getMessages(),
  // 屏蔽没有翻译的警告
  silentTranslationWarn: true,
  silentFallbackWarn: true
});

export default i18n;
