<template>
  <div class="web-main-container">
    <!-- 编辑页面容器, 指定 web-main-container 样式适配Layout页面 -->
    <!-- 操作按钮容器 -->
    <float-container posTop="0" zIndex="10" containerDirection="top" :fullWidth="true">
      <button-bar :buttonItems="buttonItems" size="default" />
    </float-container>
    <!-- 编辑表单容器, 指定 form-container 样式适配Layout页面 -->
    <div class="form-container">
      <el-form ref="EditForm" :model="EditFormData" :rules="rules"
        :inline="false" :status-icon="true" :label-position="labelPosition"
        :label-width="labelWidth" :size="editFormSize" class="custom-form"
      >
        <form-grid alignment="center">
          <!-- input 输入框 -->
          <form-grid-row>
            <form-grid-item :rowSpan="18">
              <el-form-item :label="$t('Input') + '1'" prop="input1" ref="input1">
                <el-input v-model="EditFormData.input1" :placeholder="$t('Please input') + ' 长度5时校验不告警'"
                prefix-icon="i-search" maxlength="10" show-word-limit clearable
                tab-index="1" @keyup.enter.native="moveNextFocus($event, 'EditForm')"
                ></el-input>
              </el-form-item>
            </form-grid-item>
            <form-grid-item :rowSpan="6">
              <el-form-item label="输入2" prop="input2" ref="input2">
                <el-input v-model="EditFormData.input2" :placeholder="$t('Please input')" clearable
                tab-index="2" @keyup.enter.native="moveNextFocus($event, 'EditForm')"
                ></el-input>
              </el-form-item>
            </form-grid-item>
          </form-grid-row>
          <form-grid-row>
            <form-grid-item :rowSpan="8">
              <el-form-item label="输入3" prop="input3">
                <el-input v-model="EditFormData.input3" :placeholder="$t('Please input')"
                  :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                  clearable
                  tab-index="5" @keyup.enter.native="moveNextFocus($event, 'EditForm')"
                  ></el-input>
              </el-form-item>
            </form-grid-item>
            <form-grid-item :rowSpan="8">
              <el-form-item label="输入4" prop="input4">
                <el-input v-model.number="EditFormData.input4" :placeholder="$t('Please input')" clearable
                tab-index="4" @keyup.enter.native="moveNextFocus($event, 'EditForm')"
                >
                  <template #prepend>Http://</template>
                </el-input>
              </el-form-item>
            </form-grid-item>
            <form-grid-item :rowSpan="8">
              <el-form-item label="输入5" prop="input5"  ref="input5">
                <el-input v-model="EditFormData.input5" :placeholder="$t('Please input')" clearable
                tab-index="1" tab-scope="area" @keyup.enter.native="moveNextFocus($event, 'EditForm', 3, 'area')"
                ></el-input>
              </el-form-item>
            </form-grid-item>
          </form-grid-row>
          <form-grid-row>
            <form-grid-item :rowSpan="24">
              <el-form-item label="输入6" prop="input6" ref="input6">
                <el-input type="textarea" v-model="EditFormData.input6" :placeholder="$t('Please input')"
                  :autosize="{minRows: 3}"
                  tab-index="4" tab-scope="area" @keyup.enter.native="moveNextFocus($event, 'EditForm', undefined, 'area')"
                ></el-input>
              </el-form-item>
            </form-grid-item>
          </form-grid-row>
          <!-- 下拉框 -->
          <form-grid-row>
            <form-grid-item :rowSpan="8">
              <el-form-item label="下拉框1" prop="select1">
                <el-select v-model="EditFormData.select1" placeholder="Select">
                  <el-option
                    v-for="item in select1Options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </form-grid-item>
            <form-grid-item :rowSpan="8">
              <el-form-item label="下拉框2" prop="select2">
                <el-select v-model="EditFormData.select2" placeholder="Select" multiple
                  collapse-tags
                  collapse-tags-tooltip
                >
                  <el-option
                    v-for="item in select1Options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </form-grid-item>
            <form-grid-item :rowSpan="8">
              <el-form-item label="下拉框3" prop="select3">
                <el-select v-model="EditFormData.select3" filterable placeholder="Select">
                  <el-option
                    v-for="item in select1Options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </form-grid-item>
          </form-grid-row>
          <!-- 其他输入对象 -->
          <form-grid-row>
            <form-grid-item :rowSpan="12">
              <el-form-item label="数字输入" prop="inputNum1">
                <el-input-number v-model="EditFormData.inputNum1" :precision="2" :step="0.1" :max="10" controls-position="right" />
              </el-form-item>
            </form-grid-item>
            <form-grid-item :rowSpan="12">
              <el-form-item label="评分" prop="rate1">
                <el-rate
                  v-model="EditFormData.rate1"
                  show-score
                  text-color="#ff9900"
                  score-template="{value} points"
                />
              </el-form-item>
            </form-grid-item>
          </form-grid-row>
          <form-grid-row>
            <form-grid-item :rowSpan="12">
              <el-form-item label="单选框1" prop="radio1">
                <el-radio-group v-model="EditFormData.radio1" class="flex items-center">
                  <el-radio label="1">Option 1</el-radio>
                  <el-radio label="2">Option 2</el-radio>
                </el-radio-group>
              </el-form-item>
            </form-grid-item>
            <form-grid-item :rowSpan="12">
              <el-form-item label="单选框2" prop="radio2">
                <el-radio-group v-model="EditFormData.radio2" class="flex items-center">
                  <el-radio-button label="1">New York</el-radio-button>
                  <el-radio-button label="2">Washington</el-radio-button>
                  <el-radio-button label="3">Los Angeles</el-radio-button>
                  <el-radio-button label="4">Chicago</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </form-grid-item>
          </form-grid-row>
          <form-grid-row>
            <form-grid-item :rowSpan="12">
              <el-form-item label="动态输入" prop="dynamicForm.dyinput">
                <el-input v-model="dynamicForm.dyinput" :placeholder="$t('Please input')" clearable></el-input>
              </el-form-item>
            </form-grid-item>
          </form-grid-row>
          <form-grid-row>
            <form-grid-item :rowSpan="8">
              <el-form-item label="关联1" prop="relation1" ref="relation1">
                <el-input v-model.number="EditFormData.relation1" :placeholder="$t('Please input')" clearable
                tab-index="3" tab-scope="area" @keyup.enter.native="moveNextFocus($event, 'EditForm', undefined, 'area')"
                ></el-input>
              </el-form-item>
            </form-grid-item>
            <form-grid-item :rowSpan="8">
              <el-form-item label="关联2" prop="relation2" ref="relation2">
                <el-input v-model.number="EditFormData.relation2" :placeholder="$t('Please input')" clearable
                tab-index="5" tab-scope="area" @keyup.enter.native="moveNextFocus($event, 'EditForm', undefined, 'area')"
                ></el-input>
              </el-form-item>
            </form-grid-item>
            <form-grid-item :rowSpan="8">
              <el-form-item label="关联3" prop="relation3" ref="relation3">
                <el-input v-model.number="EditFormData.relation3" :placeholder="$t('Please input')" clearable
                tab-index="6" tab-scope="area" @keyup.enter.native="moveNextFocus($event, 'EditForm', undefined, 'area')"
                ></el-input>
              </el-form-item>
            </form-grid-item>
          </form-grid-row>
        </form-grid>
      </el-form>
    </div>
  </div>
</template>

<script>
  /**
   * 原生的编辑表单样式示例
   */
  import CommonFormMixin from '@/components/view/mixins/CommonFormMixin';
  import ValidateMixin from '@/components/view/mixins/ValidateMixin';
  import ViewFunsMixin from '@/components/view/mixins/ViewFunsMixin';
  import IframeChildMixins from '@/utils/iframe/IframeChildMixins';
  import IframeSizeMixins from '@/utils/iframe/IframeSizeMixins';
  import ButtonBar from '@/components/view/PageComponents/ButtonBar/index.vue';
  import FloatContainer from '@/components/common/FloatContainer.vue';
  import { FormGrid, FormGridRow, FormGridItem } from '@/components/common/FormGrid/index.js';
  import { asyncValidateExtendFun } from '@/utils/validate/index';
  import { initLinkage } from '@/utils/linkage/index';

  const linkAage = [
    {
      targetField: 'input2', linkageType: 'equal', watchField: 'input1'
    },
    {
      targetField: ['input5', 'input6'], linkageType: 'equal',
      watchField: ['relation1', 'relation2', 'relation3']
    }
  ];


  export default {
    name: 'Edit',
    mixins: [CommonFormMixin, ValidateMixin, IframeChildMixins, IframeSizeMixins, ViewFunsMixin],
    components: { ButtonBar, FloatContainer, FormGrid, FormGridRow, FormGridItem },
    i18n: {
      // 页面本地i18n配置
      messages: {
        'en': {
          'Input': 'Input',
          'Please input': 'Please input'
        },
        'zh-cn': {
          'Input': '输入',
          'Please input': '请输入'
        }
      }
    },
    data() {
      return {
        testWidth: '100px',
        /**
         * 替换 IframeSizeMixins 的参数
         */
        // 指定iframe页面内容自适应主框架的展示区域大小
        iframeSizeType: 'fit',

        /**
         * 替换ValidateMixin的参数
         */
        // 校验失败时自动滚动到失败对象位置
        autoScrollToErrorItem: true,

        // 自动设置无校验的栏位为成功状态
        autoSetFieldSuccessState: true,

        /**
         * 表单数据对象
         */
        // 表单数据对象
        EditFormData: {
          input1: '12345',
          input2: '200',
          input3: '$ 300',
          input4: 400,
          input5: '',
          input6: '123',
          select1: 'Option1',
          select2: '',
          select3: '',
          inputNum1: 0,
          rate1: 3.7,
          radio1: '2',
          radio2: '3',
          relation1: 2,
          relation2: 3,
          relation3: 6
        },

        input5ErrorMsg: '主动添加错误信息',

        // 测试的动态表单值
        dynamicForm: {

        },

        // 校验规则
        rules: {},
        // 下拉框数据
        select1Options: [
          {
            value: 'Option1',
            label: 'Option1',
          },
          {
            value: 'Option2',
            label: 'Option2',
          },
          {
            value: 'Option3',
            label: 'Option3',
          },
          {
            value: 'Option4',
            label: 'Option4',
          },
          {
            value: 'Option5',
            label: 'Option5',
          }
        ],
        // 判断页面是否有跳转
        status: {
          routePath: '',
          routeQuery: {}
        }
      };
    },
    computed: {
      buttonItems() {
        const _this = this;
        return [
          { text: this.$t('common.ButtonBar.Summit'), type: 'primary', onclick: () => { _this.submitForm('EditForm'); } },
          { text: this.$t('common.ButtonBar.Reset'), type: '', onclick: () => { _this.resetFields('EditForm'); } },
          { text: '清除所有样式', type: '', onclick: () => { _this.clearFieldValidateState('EditForm'); } },
          { text: '单字段验证', type: '', onclick: () => { _this.validateField('EditForm'); } },
          { text: '设置校验通过', type: '', onclick: () => { _this.setFieldValidateState('EditForm', 'input1', 'success'); } },
          { text: '设置校验警告', type: '', onclick: () => { _this.setFieldValidateState('EditForm', 'input6', 'warn', 'test'); } },
        ];
      },
      formData() {
        return this.EditFormData;
      }
      // computed支持传参的方式
      /*
      test() {
        return function(a) {
          return a + '1';
        };
      },
      */
    },
    mounted() {
      // addEventListener添加事件 通过这个实现栏位联动，另一个方案是通过watch实现联动
      this.EditFormData.input1 = '1000';
      this.EditFormData.input2 = '2000';
      this.dynamicForm['dyinput'] = 'xx';

      this.rules = {
          input1: [
            // 正常的校验
            {
              required: true,
              asyncValidator: asyncValidateExtendFun,
              message: this.$t('validateRules.required', {name: this.$t('Input') + '1'}),
              trigger: 'blur',
            },
            {
              asyncValidator: asyncValidateExtendFun,
              min: 3,
              max: 8,
              message: this.$t('validateRules.lengthBetween', {
                name: this.$t('Input') + '1', min: 3, max: 8
              }),
              trigger: 'blur',
            },
            // 告警校验
            {
              len: 5,  // 不等于5的时候进行告警
              asyncValidator: asyncValidateExtendFun,
              message: 'length not equal 5',
              trigger: 'blur',
              currentInstance: this,
              warn: true,
              setFieldWarnState: true,
              relationFields: {
                input2: 'input 1 length not equal 5'
              }
            },
          ],
          input4: [
            {
              type: 'number',
              message: this.$t('validateRules.required', {name: this.$t('Input') + '4'}),
              trigger: 'blur',
              myrule: this
            }
          ],

          input6: [
            {
              required: true,
              message: this.$t('validateRules.required', {name: this.$t('Input') + '6'}),
              trigger: 'blur',
            },
            {
              min: 3,
              max: 5,
              asyncValidator: asyncValidateExtendFun,
              trigger: 'blur',
            },
          ],
          select1: [
            {
              required: true,
              message: this.$t('validateRules.required', {name: 'select1'}),
              trigger: 'blur',
            }
          ],
          relation1: [
            {
              type: 'number',
              // validator: asyncValidateExtendFun,
              asyncValidator: asyncValidateExtendFun,
              relationFields: {
                relation2: undefined, relation3: '自己定义错误消息'
              },
              extendName: 'relationExpression',
              currentInstance: this,
              formDataKey: 'EditFormData',
              expression: '{$.relation1} * {$.relation2}',
              equalExp: '{$.relation3}',
              trigger: 'blur',
            }
          ]
        };
      this.rules['inputNum1'] = [
        {
          required: true,
          message: this.$t('validateRules.required', ['inputNum1']),
          trigger: 'blur',
        },
      ];

      initLinkage(this, linkAage, 'EditFormData');

      /*
      // 监听栏位值变化
      this.$watch('EditFormData.input1', (newVal, oldVal) => {
        this.EditFormData.input2 = newVal;
      });
      this.$watch('EditFormData.input1', (newVal, oldVal) => {
        this.EditFormData.input3 = newVal;
      });
      this.$watch(
        () => { return {relation1: this.EditFormData.relation1, relation2: this.EditFormData.relation2, relation3: this.EditFormData.relation3};},
        (newVal, oldVal) => {
          this.EditFormData.input6 = this.EditFormData.relation1 + this.EditFormData.relation2 + this.EditFormData.relation3;
        }
      );
      */
    },
    // 组件路由或query发生变化
    beforeUpdate() {
      console.debug('edit beforeUpdate');
    },
    methods: {
      // 点击提交表单按钮执行的函数
      submitForm(formName) {
        this.validateForm(formName, (valid, invalidFields, warnFields) => {
          if (valid) {
            alert('submit! has warning: ' + warnFields.length);
          } else {
            alert('error submit!!');
            return false;
          }
        });
      },
      // 仅验证一个字段
      validateField(formName) {
        this.$refs[formName].validateField('input1', (valid) => {
          if (valid) {
            alert('验证input1通过!');
          } else {
            alert('验证input1失败!');
          }
        });
      },
    },
  };
</script>

<style lang="scss" scoped>

</style>

