<template>
  <div class="frontend">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>ログイン画面</h1>

    <!-- ログインフォーム -->
    <accountInputForm formType="login" />
  </div>
</template>

<script>
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
