<template>
  <div class="register">
    <register-form :is-dailog="false"></register-form>
    <!--  底部  -->
    <div class="el-register-footer">
      <span>{{ copyright }}</span>
    </div>
  </div>
</template>

<script>
/**
 * 注册界面
 */
import settings from '@/settings';
import RegisterForm from './components/RegisterForm.vue';

export default {
  name: 'Register',
  components: { RegisterForm },
  data() {
    return {
      copyright: settings.app.copyrightText
    };
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../../assets/images/login-background.jpg');
  background-size: cover;
}

.el-register-footer {
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
