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
  },
  data: function() {
    return {
      //DBサーバのドメイン
      DBFileServerPort: "http://localhost:8000"
    };
  },
  async mounted() {
    //ログインページにアクセス時にサーバへトークンを送る(ブラウザが所持している場合)
    // const axios = require("axios");
    // let getCookies = document.cookie.split(";");
    // let getAccessToken = getCookies.filter(cookie => "accessToken" + /=*/);
    // console.log("getAccessToken: " + getAccessToken);
    // if (getAccessToken != undefined) {
    //   await axios.post(this.DBFileServerPort + "/loginAccessToken");
    // }
  }
};
</script>

<style scoped>
div.frontend {
  background-color: #ffeeee;
}
</style>
