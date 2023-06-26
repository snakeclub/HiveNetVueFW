/**
 * 封装通用页面的验证方法，引入mixins即可
 * 用法：
 * export default {
 *   mixins: [ValidateMixin],
 *   ...
 * }
 */
import WebTools from '@/utils/base/WebTools';
import { setFieldValidateState } from '@/utils/validate/index';

export default {
  data: {
    // 校验失败时自动滚动到失败对象位置
    autoScrollToErrorItem: false,

    // 自动设置无校验的栏位为成功状态
    autoSetFieldSuccessState: false,

    // 告警信息堆栈, key为id, value为
    warnStack: {}

  },

  methods: {
    /**
         * 设置输入栏位的验证样式
         * @param {string} formName - el-form的ref引用名
         * @param {string} field - el-form-item的ref引用名(应与prop设置为一样)
         * @param {string} validateState - 验证状态, ''/success/error/warn
         * @param {string} validateMessage - error和warn状态的提示信息
         */
    setFieldValidateState(formName, field, validateState, validateMessage) {
      return setFieldValidateState(this, field, validateState, validateMessage);
    },

    /**
         * 清除栏位的验证样式
         * @param {string} formName - el-form的ref引用名
         * @param {string} field - el-form-item的ref引用名(应与prop设置为一样)
         *   注: 如果不传代表清除所有栏位的样式
         */
    clearFieldValidateState(formName, field) {
      const formObj = this.$refs[formName];
      if (formObj) {
        formObj.clearValidate(field);
        if (field) {
          const formItem = this.$refs[field];
          WebTools.removeClass(formItem.$el, 'is-warn');
          WebTools.removeClass(formItem.$el, 'is-success');
          WebTools.removeClass(formItem.$el, 'relation-tag');
        } else {
          // 删除所有的 is-warn is-success relation-tag 样式，注意由于数组会因为删除了样式动态变化，需要倒序处理
          let items = formObj.$el.getElementsByClassName('is-warn');
          for (let i = items.length - 1; i >= 0; i--) {
            WebTools.removeClass(items[i], 'is-warn');
          }
          items = formObj.$el.getElementsByClassName('is-success');
          for (let i = items.length - 1; i >= 0; i--) {
            WebTools.removeClass(items[i], 'is-success');
          }
          items = formObj.$el.getElementsByClassName('relation-tag');
          for (let i = items.length - 1; i >= 0; i--) {
            WebTools.removeClass(items[i], 'relation-tag');
          }
        }
      } else {
        console.error('Clear field validate state error: form with ref [' + formName + '] not found');
      }
    },

    /**
         * 重置所有栏位初始值
         * @param {string} formName - el-form的ref引用名
         * @param {string} field - el-form-item的prop
         *   注: 如果不传代表重置所有栏位
         */
    resetFields(formName, field) {
      const formObj = this.$refs[formName];
      if (formObj) {
        formObj.resetFields(field);
        this.$nextTick(() => {
          this.clearFieldValidateState(formName, field);
        });
      } else {
        console.error('Reset fields error: form with ref [' + formName + '] not found');
      }
    },

    /**
         * 验证表单
         * @param {string} formName - el-form的ref引用名
         * @param {function} callback - 验证结果回调函数, 格式如下: (valid, invalidFields, warnFields) => { ... }
         *   valid {boolean} - 是否验证通过
         *   invalidFields {Object} - 验证失败的信息对象, 可以使用格式为Object.keys(invalidFields)获取field数组:
         *     invalidFields.field = [{field: '', fieldValue: '', message: ''}, ...]
         *   warnFields {array} - 告警信息数组, 格式为
         *     [
         *       {field: '', fieldValue: '', message: '', warnId: ''},
         *       ...
         *     ]
         * @returns {Promise} - 验证结果Promise对象
         */
    validateForm(formName, callback) {
      // 先清空告警信息堆栈
      this.warnStack = {};

      // 执行验证处理
      this.$refs[formName].validate((valid, invalidFields) => {
        // 初始化警告的数据
        const warnFields = new Array();
        for (const warnId in this.warnStack) {
          warnFields.push(this.warnStack[warnId]);
        }

        // 自动设置无校验的栏位为成功状态
        if (this.autoSetFieldSuccessState) {
          const items = this.$refs[formName].$el.getElementsByClassName('el-form-item');
          for (const item of items) {
            if (!WebTools.hasClass(item, 'is-error') && !WebTools.hasClass(item, 'is-success')) {
              WebTools.addClass(item, 'is-success');
            }
          }
        }

        // 自动跳转到第一个校验失败的栏位中
        if (!valid && this.autoScrollToErrorItem) {
          this.$refs[formName].scrollToField(Object.keys(invalidFields)[0]);
        }

        return callback(valid, invalidFields, warnFields);
      });
    }
  }
};
