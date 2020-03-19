<template>
  <div>
    <!-- アカウント情報入力用のコンポーネント -->
    <!-- Frontend.vueから値を受け取って適宜値を変更している -->

    <input
      type="text"
      v-model="accountData.name"
      name="user_name"
      placeholder="新規ユーザー名"
    />
    <br />

    <input type="radio" v-model="accountData.sex" name="sex" value="male" />男性
    <input type="radio" v-model="accountData.sex" name="sex" value="female" />女性
    <br />

    <select name="office_place" v-model="accountData.office">
      <option value="" disabled selected>事業所選択</option>
      <option value="Tokyo">東京事業所</option>
      <option value="Osaka">大阪事業所</option>
      <!-- 他の事業所も追加可能 -->
    </select>

    <!-- DB更新でアカウント情報更新 -->
    <input
      type="button"
      v-bind:value="buttonName"
      id="getCommunication"
      @click="registrationProcess"
    />

  </div>
</template>

<script>
// axiosでHTTP通信を行うためのJSモジュールをインポート
import axiosHttpCommunication from "../js/axios_http_communication.js";

export default {
  name: 'accountInputForm',
  props: {
    msg: String,
    buttonName: String 
  },
data: function() {
    return {
      // ユーザーからの入力値(v-modelで参照)
      // isLoggedIn: false, // ログイン状態の判定
      // login: {
      //   name: "", // ログインのため送信されたユーザーネーム
      //   password: "" // ログインのため送信されたパスワード（本来は生のパスワードを使ってはいけない）
      // },
      //登録フォームのアカウント情報
      accountData: {
        office: "",
        sex: "",
        name: ""
      },
      //アクセスカウンタ（初期値0）
      accessCount: 0,
      //アカウント情報のDBのパス
      DBFilePath: "../db/account_data.db",
      //DBサーバのドメイン
      DBFileServerPort: "http://localhost:8000"
    };
  },
methods: {
    //アカウント登録処理のメソッド（Controller）
    registrationProcess: function() {
      //入力フォームの値の例外処理を行う
      this.exceptionHandling();
      //ルーティングによってDB処理内容を変えている
      //DBにアカウント情報を追加する(AxiosでDB操作を行うサーバへリクエストを行う)
      this.axiosHttpCommunication(this.DBFileServerPort+"/RecordInsert");
    },
    //入力フォームの例外処理のメソッド
    exceptionHandling: function() {
      try {
        //名前が入力されてないときの例外処理
        if (!this.accountData.name) {
          alert("名前を入力してください");
          throw new Error("INVALID_USERNAME_ERR");
        }

        //ラジオボタンの入力状況で男女を区別、pushする文字列（M,F）を確定する
        if (this.accountData.sex == "male") {
          var sexTmp = "M";
        } else if (this.accountData.sex == "female") {
          var sexTmp = "F";
        } else {
          alert("性別を選択してください");
          throw new Error("INVALID_SEX_ERR");
        }

        //事業所が選択されてない場合の例外処理
        if (!this.accountData.office) {
          alert("事業所を選択してください");
          throw new Error("INVALID_OFFICE_ERR");
        }
      } catch (error) {
        // throwで投げたエラーメッセージをコンソールに表示する
        console.error("入力が不完全のため、登録を中止しました");
        console.log(error);
        // ユーザーからの入力が不完全なので、exceptionHandlingメソッドはここで中止する
        return;
      }
    },
    // DBにアカウント情報を追加する
    axiosHttpCommunication: function(DestinationURL) {
      console.debug("called axiosHttpCommunication!");
      //POST通信でDBへアカウント情報（レコード）を追加する
      axiosHttpCommunication(DestinationURL,"POST",this.accountData);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
