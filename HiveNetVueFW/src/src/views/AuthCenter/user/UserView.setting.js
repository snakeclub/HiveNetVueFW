/**
 * UserView页面的配置信息
 */
import JsonTools from '@/utils/base/JsonTools';
import parentSetting from './user.setting';

export default {
  // 字段校验规则（需传入页面的this对象）, 应合并覆盖上级模块的通用校验规则
  validateRules: (_this) => {
    return JsonTools.deepJsonAssign({}, parentSetting.validateRules(_this), {
      // 页面自身的校验规则
      company: [
        {
          required: true,
          message: () => _this.$t('validate_rules.required', [_this.$t('company')]),
          trigger: 'blur'
        }
      ]
    });
  },
  // 自有i18n字典，应合并覆盖上级模块的通用i18n字典
  i18n: {
    messages: {
      // 页面自身的特殊i18n配置
    },
    // 继承父模块的i18n配置
    sharedMessages: parentSetting.i18n.messages
  }
};
