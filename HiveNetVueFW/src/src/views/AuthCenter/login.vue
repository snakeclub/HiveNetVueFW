<template>
  <div class="login">
    <login-form :is-dailog="false"></login-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>{{ copyright }}</span>
    </div>
  </div>
</template>

<script>
/**
 * 登录界面
 */
import settings from "@/settings";
import LoginForm from "./components/LoginForm.vue";

export default {
  name: "Login",
  components: { LoginForm },
  data() {
    return {
      copyright: settings.app.copyrightText
    };
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../../assets/images/login-background.jpg");
  background-size: cover;
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
