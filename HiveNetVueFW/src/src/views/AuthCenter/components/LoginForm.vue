<template>
  <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
    <h3 class="title">{{ $t(appSettings.name) }}</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off"
          :placeholder="$t(i18nPrefixShare + 'Username')" prefix-icon="i-user"
          tab-index="1" @keyup.enter.native="moveNextFocus($event, 'loginForm')"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off"
          :placeholder="$t(i18nPrefixShare + 'Password')" prefix-icon="i-lock"
          tab-index="2" @keyup.enter.native="moveNextFocus($event, 'loginForm')"
        />
      </el-form-item>
      <el-form-item prop="captcha" v-if="captchaOnOff">
        <el-input v-model="loginForm.captcha" auto-complete="off"
          :placeholder="$t(i18nPrefixShare + 'CAPTCHA')" prefix-icon="i-document-checked"
          tab-index="3" @keyup.enter.native="moveNextFocus($event, 'loginForm')"
        />
        <div class="login-captcha">
          <img :src="captchaUrl" @click="getCaptchaImage" class="login-captcha-img" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">{{ $t(i18nPrefix + 'Remember me') }}</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button :loading="loading" size="default" type="primary" style="width:100%;"
            tab-index="4" @keyup.enter.native="doLogin"  @click.native.prevent="doLogin"
          >
            <span v-if="!loading">{{ $t(i18nPrefix + 'Login') }}</span>
              <span v-else>{{ $t(i18nPrefix + 'Waiting login ...') }}</span>
          </el-button>
        </el-form-item>
        <el-form-item v-if="registerOnOff" class="login-form-register">
          <div style="float: right;">
            <router-link class="link-type" :to="'/register'">{{ $t(i18nPrefix + 'Register Now') }}</router-link>
          </div>
        </el-form-item>
  </el-form>
</template>

<script>
/**
 * 登录信息框
 */
import { inject } from 'vue';
import Cookies from "js-cookie";
import settings from "@/settings";
import apiCall from '@/api';
import authActions from '@/utils/actions/auth';
import ViewFunsMixin from '@/components/view/mixins/ViewFunsMixin';

// 全局i18n的前置
const i18nPrefix = 'views.AuthCenter.components.LoginForm.';
const i18nPrefixShare = 'views.AuthCenter.sharedMessages.';

export default {
  name: "LoginForm",
  mixins: [ViewFunsMixin],
  data() {
    return {
      // 验证码图片信息
      captchaUrl: '',

      // 输入表单栏位
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        captcha: '',
        captchaUuid: ''
      },

      // 表单校验规则
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: this.$t(i18nPrefixShare + 'Please input you username') }
        ],
        password: [
          { required: true, trigger: 'blur', message: this.$t(i18nPrefixShare + 'Please input you password') }
        ],
        captcha: [{ required: true, trigger: 'change', message: this.$t(i18nPrefixShare + 'Please input CAPTCHA') }]
      },

      // 控制登录按钮是否显示正在加载
      loading: false,
      // 验证码开关, 通过验证码接口获取确认是否开启
      captchaOnOff: true,
      // 开放注册开关
      registerOnOff: true,

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
    // 创建窗口时执行的操作
    this.getCaptchaImage(); // 获取验证码
    this.getCookie(); // 获取缓存信息填入界面
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
          this.loginForm.captchaUuid = resData.body.uuid; // 匹配验证图片的 uuid
        }
      });
    },

    // 获取cookie中的信息
    getCookie() {
      const username = Cookies.get("username");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },

    // 点击登录按钮
    doLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          // 设置cookie保留登记信息
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove('rememberMe');
          }

          // 登录处理
          authActions.login({
            loginType: 'pwd',
            username: this.loginForm.username,
            password: this.loginForm.password,
            captcha: this.loginForm.captcha,
            captchaUuid: this.loginForm.captchaUuid,
            redirectType: 'auto'
          }).then(() => {
            // 成功则关闭窗口
            if (this.isDailog) {
              this.dialogClose();
            }
            this.$modal.messageSuccess(this.$t(i18nPrefix + 'Welcome back') + ', ' + this.$store.getters.name);
          }).catch(() => {
            // 失败更新验证码
            if (this.captchaOnOff) {
              this.getCaptchaImage();
            }
          }).finally(() => {
            this.loading = false;
          });
        }
      });
    }
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
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

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

// 验证图片
.login-captcha {
  height: 38px;
  float: right;

  img {
    cursor: pointer;
  }
}

.login-captcha-img {
  height: 38px;
}

// 注册
.login-form {
    .login-form-register {
        .el-form-item__content {
            line-height: 0px;
        }
    }
}

/**
 * 放到对话框的样式
 */
.pop-dialog {
    .login-form {
        width: fit-content;
        background-color: var(--el-bg-color);
    }
}

</style>
