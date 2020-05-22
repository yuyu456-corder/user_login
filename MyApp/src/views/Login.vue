<template>
  <div class="frontend">
    <v-card>
      <h1>ログイン</h1>
    </v-card>

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
          (resolve) => {
            alert("ログインに成功しました");
            //ユーザごとのマイページへ遷移する
            //resolve.dataはJSONなのでstring扱いとなる（resolve自体はreqestデータなのでobject）
            console.log(resolve.data);
            router.push({ name: "myPage", params: { id: resolve.data } });
          },
          (failed) => {
            console.log("Valid Access Token is not Existed");
          }
        );
    }
  },
};
</script>
