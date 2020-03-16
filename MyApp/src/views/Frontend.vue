<template>
  <div class="frontend">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld />
    <h1>ログイン画面</h1>
    <h2>新規登録</h2>
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

    <!-- DB更新でアカウント登録 -->
    <input
      type="button"
      value="登録"
      id="getCommunication"
      @click="registrationProcess"
    />

    <p>あなたは{{ accessCount }}人目の訪問者です！</p>

    <!-- 
          <h3>登録情報確認（未実装）</h3>
          <div v-show="!isLoggedIn">
            登録済みのユーザー名前を入力してください。
          </div>
          <div v-show="isLoggedIn">
            あなたの登録情報は以下のとおりです。
            <ul>
              <li>Name:</li>
              <li>Sex:</li>
              <li>Office:</li>
              <li>Password:</li>
            </ul>
          </div>
          <input
            type="text"
            v-model="login.name"
            name="login_username"
            placeholder="ユーザー名"
          />
          <input
            type="text"
            v-model="login.password"
            name="login_password"
            placeholder="パスワード"
          />
          <button v-on:click="">ログイン</button> -->
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
// axiosでHTTP通信を行うためのJSモジュールをインポート
import axiosHttpCommunication from "../js/axios_http_communication.js";
// SQlite3でDB操作を行うJSモジュールをインポート
// import dbOpration from "../js/database_operation.js";

export default {
  name: "Frontend",
  components: {
    HelloWorld
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
        console.error("入力が不完全のため、登録を中止しました：");
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
  },
  //アクセスカウンタ機能のメソッド
  created: function() {
    console.log("Vue instance created!");

    //ローカルストレージにaccess_countが入ってるか確認する
    //初期化時にストレージ参照するとundefined取得するので飛ばす
    //ストレージからカウンタを取得して数値に変換
    let checkCount = localStorage.getItem("access_count");
    if (checkCount != undefined) {
      let getJsonCount = localStorage.getItem("access_count");
      this.accessCount = parseInt(getJsonCount);
    }

    //ページが読み込まれるたびにカウンタを増やす
    ++this.accessCount;

    //アクセスカウンタをローカルストレージに保存
    let accessCountJson = JSON.stringify(this.accessCount);
    localStorage.setItem("access_count", accessCountJson);
  }
};
</script>

<style scoped>
div.frontend {
  background-color: #ffeeee;
}
</style>