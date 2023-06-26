<template>
  <el-form ref="changePwdForm" :model="changePwdForm" :rules="changePwdRules" class="change-pwd-form">
    <h3 class="title">{{ $t(i18nPrefix + 'Change Password') }}</h3>
    <el-form-item prop="oldPassword">
        <el-input
          v-model="changePwdForm.oldPassword"
          type="password"
          auto-complete="off"
          :placeholder="$t(i18nPrefix + 'Old Password')"
          prefix-icon="i-lock"
          tab-index="1" @keyup.enter.native="moveNextFocus($event, 'changePwdForm')"
        />
      </el-form-item>
      <el-form-item prop="newPassword">
        <el-input
          v-model="changePwdForm.newPassword"
          type="password"
          auto-complete="off"
          :placeholder="$t(i18nPrefix + 'New Password')"
          prefix-icon="i-lock"
          tab-index="2" @keyup.enter.native="moveNextFocus($event, 'changePwdForm')"
        />
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="changePwdForm.confirmPassword"
          type="password"
          auto-complete="off"
          :placeholder="$t(i18nPrefixShare + 'Confirm Password')"
          prefix-icon="i-lock"
          tab-index="3" @keyup.enter.native="moveNextFocus($event, 'changePwdForm')"
        />
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="default" type="primary" style="width:100%;"
            tab-index="4" @keyup.enter.native="doChange"  @click.native.prevent="doChange"
        >
          <span v-if="!loading">{{ $t(i18nPrefix + 'Change') }}</span>
          <span v-else>{{ $t(i18nPrefix + 'Waiting change ...') }}</span>
        </el-button>
      </el-form-item>
  </el-form>
</template>

<script>
/**
 * 修改密码信息框
 */
import { inject } from 'vue';
import ViewFunsMixin from '@/components/view/mixins/ViewFunsMixin';
import authActions from '@/utils/actions/auth';

// 全局i18n的前置
const i18nPrefix = 'views.AuthCenter.components.ChangePwdForm.';
const i18nPrefixShare = 'views.AuthCenter.sharedMessages.';

export default {
  name: "ChangePwdForm",
  mixins: [ViewFunsMixin],
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.changePwdForm.newPassword !== value) {
        callback(new Error(this.$t(i18nPrefixShare + 'Inconsistent Input Passwords')));
      } else {
        callback();
      }
    };

    return {
      changePwdForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },

      // 校验规则
      changePwdRules: {
        oldPassword: [
          { required: true, trigger: 'blur', message: this.$t(i18nPrefix + 'Please input you old password') }
        ],
        newPassword: [
          { required: true, trigger: 'blur', message: this.$t(i18nPrefix + 'Please input you new password') }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', message: this.$t(i18nPrefix + 'Please enter your new password again') },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      },

      // 控制修改按钮是否显示正在加载
      loading: false,

      // 全局i18n的前置
      i18nPrefix: i18nPrefix,
      i18nPrefixShare: i18nPrefixShare,
    }
  },
  props: {
    // 指示是否对话框模式
    isDailog: {
        type: Boolean,
        default: false,
    }
  },
  setup() {
    // 对话框父对象的关闭操作
    const dialogClose = inject('close');
    return {
      dialogClose
    };
  },
  methods: {
    // 点击修改按钮
    doChange() {
      this.$refs.changePwdForm.validate(valid => {
        if (valid) {
          // 验证通过，修改密码
          this.loading = true;
          authActions.changePwd({
            oldPassword: this.changePwdForm.oldPassword,
            newPassword: this.changePwdForm.newPassword
          }).then(() => {
            // 成功则关闭窗口
            if (this.isDailog) {
              this.dialogClose();
            }
            this.$modal.messageSuccess(this.$t(i18nPrefix + 'Change password success'));
          }).catch(() => {
            // 失败不处理
            return;
          }).finally(() => {
            this.loading = false;
          });
        }
      });
    }
  }
};

</script>

<style rel="stylesheet/scss" lang="scss">
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.change-pwd-form {
  border-radius: 6px;
  background: #ffffff;
  width: 350px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }
}

/**
 * 放到对话框的样式
 */
.pop-dialog {
    .change-pwd-form {
        width: 350px;
        background-color: var(--el-bg-color);
    }
}

/**
 * 移动模式
 */
.mobile {
  .pop-dialog {
    .change-pwd-form {
       width: calc(100vw - 40px);
    }
  }
}

</style>