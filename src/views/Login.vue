<template>
  <el-form
    class="form"
    :model="loginForm"
    ref="loginForm"
  >
    <el-form-item prop="account">
      <el-input
        placeholder="请输入您的账号"
        v-model.trim="loginForm.account"
      ></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        type="password"
        placeholder="请输入您的密码"
        show-password
        v-model.trim="loginForm.password"
      ></el-input>
    </el-form-item>
    <el-button @click="submitForm('loginForm')">
      登录
    </el-button>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        account: '',
        password: '',
      }
    };
  },

  methods: {
    submitForm(formName) {
      this.$_goPage('/');
    }
  }

};
</script>
<style lang="scss" scoped>
.form {
  width: 300px;
  margin: auto;
  margin-top: 10%;
}
</style>
