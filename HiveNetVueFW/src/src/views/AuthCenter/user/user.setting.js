/**
 * user模块的通用配置
 */

import JsonTools from '@/utils/base/JsonTools';
import parentSetting from '../AuthCenter.setting';

export default {
  // 字段校验规则（需传入页面的this对象）, 应合并覆盖上级模块的通用校验规则
  validateRules: (_this) => {
    return JsonTools.deepJsonAssign({}, parentSetting.validateRules(_this), {
      loginName: [
        {
          required: true,
          message: () => _this.$t('validate_rules.required', [_this.$t('loginName')]),
          trigger: 'blur'
        },
        {
          min: 2,
          max: 32,
          message: () => _this.$t('validate_rules.lengthBetween', { name: _this.$t('loginName'), min: 2, max: 32 }),
          trigger: 'blur'
        }
      ],
      userName: [
        {
          required: true,
          message: () => _this.$t('validate_rules.required', [_this.$t('userName')]),
          trigger: 'blur'
        },
        {
          min: 2,
          max: 32,
          message: () => _this.$t('validate_rules.lengthBetween', { name: _this.$t('userName'), min: 2, max: 32 }),
          trigger: 'blur'
        }
      ]
    });
  },
  // 自有i18n字典，应合并覆盖上级模块的通用i18n字典
  i18n: {
    messages: JsonTools.deepJsonAssign({}, parentSetting.i18n.messages, {
      en: {
        loginName: 'Login Name',
        userName: 'User Name'
      },
      'zh-cn': {
        loginName: '登录名',
        userName: '用户姓名'
      }
    })
  }
};
