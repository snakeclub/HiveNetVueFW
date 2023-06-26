<template>
  <div ref="webMainContainer" class="web-main-container">
    <!-- 操作按钮容器 -->
    <float-container targetElSelector="" posTop="0" zIndex="10" containerDirection="top" :fullWidth="true">
      <button-bar :buttonItems="buttonItems"/>
    </float-container>
    <div class="edit-form-container">
      <el-form ref="userDataForm" :model="userData" :rules="userDataRules" :inline="false"
          :class="{ 'error-ellipsis': errorEllipsis }"
          :label-position="labelPosition"
          :label-width="labelWidth"
          :size="editFormSize"
          :inline-message="!errorEllipsis"
      >
        <el-space :size="0" alignment="start" wrap>
          <el-form-item :label="$t('loginName')" prop="loginName">
            <el-input v-model="userData.loginName" :placeholder="$t('form_message.pleaseInput')" clearable
             maxlength="32" minlength="2" :show-word-limit="true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('userName')" prop="userName">
            <el-input v-model="userData.userName" :placeholder="$t('form_message.pleaseInput')" clearable
             maxlength="32" minlength="2"></el-input>
          </el-form-item>
          <el-form-item :label="$t('company')" prop="company">
            <el-select v-model="userData.company" filterable :placeholder="$t('form_message.pleaseSelect')">
              <el-option
                v-for="item in companyItems"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-space>
        <el-space :size="0" wrap>
          <el-form-item
            prop="email"
            label="Email"
            :rules="[
              {
                required: true,
                message: 'Please input email address',
                trigger: 'blur',
              },
              {
                type: 'email',
                message: 'Please input correct email address',
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input v-model="userData.email"></el-input>
          </el-form-item>
        </el-space>
      </el-form>
    </div>
  </div>
</template>

<script>
/**
 * 用户详情页面（含编辑和显示）
 */

import { reactive } from "vue";
import IframeChildMixins from '@/utils/iframe/IframeChildMixins';
import IframeSizeMixins from '@/utils/iframe/IframeSizeMixins';
import EditFormMixins from '@/views/mixins/EditFormMixins';
import ButtonBar from '@/views/components/ButtonBar';
import FloatContainer from '@/components/common/FloatContainer.vue';
import GridItem from '@/views/components/GridItem';
import pageSetting from './UserView.setting';


export default {
  name: 'UserView',
  mixins: [IframeChildMixins, IframeSizeMixins, EditFormMixins],
  components: {
    ButtonBar, FloatContainer, GridItem
  },
  setup() {
    const userDataRules = reactive(pageSetting.validateRules(this));
  },
  data() {
    return {
      iframeSizeType: 'fit',
      // 页面的个性设置
      labelWidth: '120px',
      // 表单的数据结构
      userData: {
        loginName: '',
        userName: '',
        email: ''
      },
      // 表单的数据校验规则
      userDataRules: {}
    }
  },
  computed: {
    // 按钮获取
    buttonItems() {
      const _this = this;
      return [
        {text: '提交', type: 'primary', onclick: () => { _this.submitForm('userDataForm');}},
        {text: '重置', type: '', onclick: () => {this.resetForm('userDataForm');}}
      ];
    },
    // 公司清单
    companyItems() {
      return [
        { value: '1', label: '公司1-test' },
        { value: '2', label: '公司2' },
        { value: '3', label: '公司3' },
        { value: '4', label: '公司4' },
      ];
    },
    // 当前页面语言设置
    lang() {
      return this.$store.state.app.lang;
    }
  },
  watch: {
    // 监控语言设置，变更时重新获取校验规则(废弃)
    lang(newVal, oldVal) {
      // this.userDataRules = pageSetting.validateRules(this);
    }
  },
  beforeMount() {
    // 校验规则发生变化就会触发异步校验，因此必须在加载前设置
    this.userDataRules = pageSetting.validateRules(this);
  },
  mounted() {
  },
  i18n: pageSetting.i18n,  // 页面自身的i18n配置
  methods: {
    // 点击提交表单按钮执行的函数
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            alert('error submit!!');
            return false;
          }
      });
    },
    // 重置表单栏位信息的函数
    resetForm(formName) {
      // 注意：resetFields生效必要的条件：不要在mounted前给表单数据赋值，要重置的el-form-item必须有prop属性
      this.$refs[formName].resetFields();
    }
  },
};
</script>