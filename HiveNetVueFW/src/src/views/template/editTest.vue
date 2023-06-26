<template>
<!-- 编辑页面容器, 指定 web-main-container 样式适配Layout页面 -->
<div class="web-main-container">
    <!-- 操作按钮容器 -->
    <float-container targetElSelector="" posTop="0" zIndex="10" containerDirection="top" :fullWidth="true">
      <button-bar :buttonItems="buttonItems"/>
    </float-container>
    <!-- 编辑表单容器, 指定 edit-form-container 样式适配Layout页面 -->
    <div class="edit-form-container">
      <el-form ref="EditForm" :model="EditFormData" :rules="rules" :inline="false" :status-icon="true"
          :label-position="labelPosition"
          :label-width="labelWidth"
          :size="editFormSize"
      >
            <el-space :wrap="false" :size="0">
              <el-form-item label="输入1" prop="input1">
                <el-input v-model="EditFormData.input1" placeholder="请输入" clearable></el-input>
              </el-form-item>
              <el-form-item label="输入2" prop="input1">
                <el-input v-model="EditFormData.input1" placeholder="请输入" clearable></el-input>
              </el-form-item>
              <el-form-item label="输入2" prop="input1">
                <el-input v-model="EditFormData.input1" placeholder="请输入" clearable></el-input>
              </el-form-item>
              <el-form-item label="输入2" prop="input1">
                <el-input v-model="EditFormData.input1" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-space>
            <el-space wrap :size="0">
              <el-form-item label="输入3" prop="input1">
                <el-input v-model="EditFormData.input1" placeholder="请输入" clearable></el-input>
              </el-form-item>

                <el-form-item label="输入4" prop="input1">
                  <el-input v-model="EditFormData.input1" placeholder="请输入" clearable></el-input>
                </el-form-item>

              <el-form-item label="输入5" prop="input1">
                <el-input v-model="EditFormData.input1" placeholder="请输入" clearable></el-input>
              </el-form-item>
              <el-form-item label="输入6" prop="input1">
                <el-input v-model="EditFormData.input1" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-space>
      </el-form>
      <!--
      <form-grid :gridMinWidth="testWidth">
        <form-grid-row>
          <form-grid-item>
            <el-form-item label="输入7" prop="input1">
                <el-input v-model="EditFormData.input1" placeholder="请输入" clearable></el-input>
              </el-form-item>
          </form-grid-item>
        </form-grid-row>
      </form-grid>
      -->
    </div>
</div>
</template>

<script>
  /**
   * 原生的编辑表单样式示例
   */
  import CommonFormMixin from '@/components/view/mixins/CommonFormMixin';
  import IframeChildMixins from '@/utils/iframe/IframeChildMixins';
  import IframeSizeMixins from '@/utils/iframe/IframeSizeMixins';
  import ButtonBar from '@/components/view/PageComponents/ButtonBar/index.vue';
  import FloatContainer from '@/components/common/FloatContainer.vue';
  // import FormGrid from '@/components/common/FormGrid/FormGrid.vue';
  // import FormGridRow from '@/components/common/FormGrid/FormGridRow.vue';
  // import FormGridItem from '@/components/common/FormGrid/FormGridItem.vue';

  export default {
    name: 'EditTest',
    mixins: [CommonFormMixin, IframeChildMixins, IframeSizeMixins],
    components: {
    ButtonBar,
    FloatContainer,
    // FormGrid,
    //  FormGridRow,
    //  FormGridItem
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
         * 替换 CommonFormMixin 的参数
         */
        errorEllipsis: true,

        /**
         * 表单数据对象
         */
        // 表单数据对象
        EditFormData: {
          input1: '',
          input2: '10',
          input3: ''
        },

        // 校验规则
        rules: {
          input1: [
            {
                required: true,
                message: 'Please input 输入1',
                trigger: 'blur',
            },
            {
                min: 3,
                max: 5,
                message: 'Length should be 3 to 5',
                trigger: 'blur',
            },
          ]
        },
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
          {text: '提交', type: 'primary', onclick: () => { _this.submitForm('EditForm');}},
          {text: '重置', type: '', onclick: () => {_this.resetForm('EditForm');}}
        ];
      }
    },
    mounted() {
      // this.buttonItems = this.getButtonItems()
      this.EditFormData.input1 = 1000;
    },
    // 组件路由或query发生变化
    beforeUpdate() {
      console.debug('edit beforeUpdate');
    },
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
    }
};
</script>

<style lang="scss" scoped>

</style>

