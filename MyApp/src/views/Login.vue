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
// ページ内で別ページに遷移させたい為、routerをインポート
import router from "../router/index.js";

export default {
  name: "Login",
  components: {
    accountInputForm,
  },
  data: function() {
    return {
      //DBサーバのドメイン
      DBFileServerPort: "http://localhost:8000",
    };
  },
  async mounted() {
    //ログインページにアクセス時にサーバへトークンを送る(ブラウザが所持している場合)
    const axios = require("axios");
    let getCookies = document.cookie.split(";");
    let getAccessToken = getCookies.filter((cookie) => "accessToken" + /=*/);
    if (getAccessToken) {
      //アクセストークンをサーバへ返送する（セッションを行う）
      await axios
        .get(this.DBFileServerPort + "/loginAccessToken", {
          withCredentials: true,
        })
        .then(
          (resoleve) => {
            alert("ログインに成功しました");
            //ユーザごとのマイページへ遷移する
            router.push({ name: "myPage", params: { id: 1 } });
          },
          (failed) => {
            console.log("Valid Access Token is not Existed");
          }
        );
    }
  },
};
</script>

<style scoped>
div.frontend {
  background-color: #ffeeee;
}
</style>
