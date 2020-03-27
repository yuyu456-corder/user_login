<template>
  <div class="frontend">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>ログイン画面</h1>

    <!-- 新規登録フォーム -->
    <accountInputForm formType="login" />
  </div>
</template>

<script>
// @ is an alias to /src
//既に登録しているアカウント情報の変更用フォーム
import accountInputForm from "@/components/accountInputForm.vue";

export default {
  name: "Login",
  components: {
    accountInputForm
  }
};
</script>

<style scoped>
div.frontend {
  background-color: #ffeeee;
}
</style>
