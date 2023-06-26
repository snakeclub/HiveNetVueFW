<template>
  <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form">
      <h3 class="title">{{ $t(appSettings.name) }}</h3>
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" type="text" auto-complete="off"
          :placeholder="$t(i18nPrefixShare + 'Username')" prefix-icon="i-user"
          tab-index="1" @keyup.enter.native="moveNextFocus($event, 'registerForm')"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          auto-complete="off"
          :placeholder="$t(i18nPrefixShare + 'Password')"
          prefix-icon="i-lock"
          tab-index="2" @keyup.enter.native="moveNextFocus($event, 'registerForm')"
        />
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          auto-complete="off"
          :placeholder="$t(i18nPrefixShare + 'Confirm Password')"
          prefix-icon="i-lock"
          tab-index="3" @keyup.enter.native="moveNextFocus($event, 'registerForm')"
        />
      </el-form-item>
      <el-form-item prop="captcha" v-if="captchaOnOff">
        <el-input
          v-model="registerForm.captcha"
          auto-complete="off"
          :placeholder="$t(i18nPrefixShare + 'CAPTCHA')"
          prefix-icon="i-document-checked"
          tab-index="4" @keyup.enter.native="moveNextFocus($event, 'registerForm')"
        />
        <div class="register-captcha">
          <img :src="captchaUrl" @click="getCaptchaImage" class="register-captcha-img" />
        </div>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="default"
          type="primary"
          style="width:100%;"
          tab-index="5"
          @keyup.enter.native="handleRegister"
          @click.native.prevent="handleRegister"
        >
          <span v-if="!loading">{{ $t(i18nPrefix + 'Register') }}</span>
          <span v-else>{{ $t(i18nPrefix + 'Waiting register ...')}}</span>
        </el-button>
      </el-form-item>
      <el-form-item v-if="captchaOnOff" class="register-form-login">
            <div style="float: right;" >
                <router-link class="link-type" :to="'/login'">{{ $t(i18nPrefix + 'Login with existing account')}}</router-link>
            </div>
        </el-form-item>
    </el-form>
</template>

<script>
/**
 * 注册信息框
 */
import { inject } from 'vue';
import settings from "@/settings";
import apiCall from '@/api';
import authActions from '@/utils/actions/auth';
import ViewFunsMixin from '@/components/view/mixins/ViewFunsMixin';

// 全局i18n的前置
const i18nPrefix = 'views.AuthCenter.components.RegisterForm.';
const i18nPrefixShare = 'views.AuthCenter.sharedMessages.';

export default {
  name: "RegisterForm",
  mixins: [ViewFunsMixin],
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.registerForm.password !== value) {
        callback(new Error(this.$t(i18nPrefixShare + 'Inconsistent Input Passwords')));
      } else {
        callback();
      }
    };

    return {
      // 验证码图片信息
      captchaUrl: '',

      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        captcha: '',
        captchaUuid: ''
      },

      // 表单校验规则
      registerRules: {
        username: [
          { required: true, trigger: 'blur', message: this.$t(i18nPrefixShare + 'Please input you username') },
          { min: 2, max: 20, message: '用户账号长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur', message: this.$t(i18nPrefixShare + 'Please input you password') },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', message: this.$t(i18nPrefixShare + 'Please enter your password again') },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ],
        captcha: [{ required: true, trigger: 'change', message: this.$t(i18nPrefixShare + 'Please input CAPTCHA') }]
      },

      // 控制登录按钮是否显示正在加载
      loading: false,
      // 验证码开关, 通过验证码接口获取确认是否开启
      captchaOnOff: true,

      // 全局i18n的前置
      i18nPrefix: i18nPrefix,
      i18nPrefixShare: i18nPrefixShare,
    };
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
  created() {
    this.getCaptchaImage(); // 获取验证码
  },
  computed: {
    appSettings() {
      return settings.app;
    }
  },
  methods: {
    // 获取验证码图片
    getCaptchaImage() {
      apiCall(
        'getCaptchaImage', {}
      ).then(resData => {
        // 获取成功
        this.captchaOnOff = resData.captchaOnOff === undefined ? true : resData.captchaOnOff === 'y';
        if (this.captchaOnOff) {
          this.captchaUrl = "data:image/gif;base64," + resData.body.img; // 设置验证码图片
          this.registerForm.captchaUuid = resData.body.uuid; // 匹配验证图片的 uuid
        }
      });
    },

    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;

          // 注册处理
          authActions.register({
            registerType: 'pwd',
            username: this.registerForm.username,
            password: this.registerForm.password,
            captcha: this.registerForm.captcha,
            captchaUuid: this.registerForm.captchaUuid,
            userInfo: {}
          }).then(() => {
            // 成功则关闭窗口
            if (this.isDailog) {
              this.dialogClose();
              // 提示信息
              this.$modal.messageSuccess(this.$t(i18nPrefix + 'Register Success', {username: this.registerForm.username}));
            } else {
                // 弹出提示并跳转到登录界面
                const doRedirect = () => {
                    location.href = settings.app.loginUrl;
                };
                this.$modal.alertSuccess(
                    this.$t(i18nPrefix + 'Register Success', {username: this.registerForm.username}), undefined,
                    {callback: doRedirect}
                );
            }
          }).catch((error) => {
            // 失败更新验证码
            if (this.captchaOnOff) {
              this.getCaptchaImage();
            }
            // 提示错误
            this.$modal.alertError(error);
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

.register-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }

  // 设置验证码图片和输入框不换行
  .el-form-item__content {
    flex-wrap: nowrap;
  }
}


.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

// 验证图片
.register-captcha {
  height: 38px;
  float: right;
  img {
    cursor: pointer;
  }
}

.register-captcha-img {
    height: 38px;
}

// 注册
.register-form {
    .register-form-login {
        .el-form-item__content {
            line-height: 0px;
        }
    }
}

/**
 * 放到对话框的样式
 */
.pop-dialog {
    .register-form {
        width: fit-content;
        background-color: var(--el-bg-color);
    }
}
</style>
