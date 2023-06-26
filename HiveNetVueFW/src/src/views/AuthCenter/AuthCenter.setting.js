/**
 * AuthCenter模块的通用配置
 */

export default {
  // 字段校验规则（需传入页面的this对象）
  validateRules: (_this) => {
    return {};
  },
  // 自有i18n字典
  i18n: {
    messages: {
      en: {
        company: 'Company'
      },
      'zh-cn': {
        company: '公司'
      }
    }
  }
};
