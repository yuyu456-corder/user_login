<template>
  <div>
    <!-- アカウント情報入力用のコンポーネント -->
    <!-- Frontend.vueから値を受け取って適宜値を変更している -->

    <!-- ID入力欄。表示するのはユーザー情報変更時のみ -->
    <span v-if="formType === 'update'">
      <input type="text" v-model="accountData.id" name="user_id" placeholder="ユーザーID" />
    </span>
    <br />

    <!-- ユーザー名入力欄 -->
    <input
      type="text"
      v-model="accountData.name"
      name="user_name"
      :placeholder="userNamePlaceholder"
    />
    <br />

    <!-- パスワード入力欄。type=passwordにより、入力値がマスクされる -->
    <input
      type="password"
      v-model="accountData.password"
      name="password"
      :placeholder="passwordPlaceholder"
    />
    <br />

    <input type="radio" v-model="accountData.sex" name="sex" value="male" />男性
    <input type="radio" v-model="accountData.sex" name="sex" value="female" />女性
    <br />

    <select name="office_place" v-model="accountData.office">
      <option value disabled selected>事業所選択</option>
      <option value="Tokyo">東京事業所</option>
      <option value="Osaka">大阪事業所</option>
      <option value="Sendai">仙台事業所</option>
      <option value="Sapporo">札幌事業所</option>
      <!-- 他の事業所も追加可能 -->
    </select>

    <!-- どのフォームかによって、送信ボタンのテキストを変える -->
    <input
      v-if="formType==='register'"
      type="button"
      value="登録"
      id="resistButton"
      @click="accountResist"
    />
    <input
      v-else-if="formType==='update'"
      type="button"
      value="更新"
      id="updateButton"
      @click="accountUpdate"
    />
    <input
      v-else-if="formType==='login'"
      type="button"
      value="ログイン"
      id="loginButton"
      @click="accountUpdate"
    />
  </div>
</template>

<script>
// axiosでHTTP通信を行うためのJSモジュールをインポート
import axiosHttpCommunication from "../js/axios_http_communication.js";

export default {
  name: "accountInputForm",
  props: {
    msg: String,
    formType: String // either of "update", "register", "login"
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
        id: "",
        office: "",
        sex: "",
        name: "",
        password: ""
      },
      //アクセスカウンタ（初期値0）
      accessCount: 0,
      //DBサーバのドメイン
      DBFileServerPort: "http://localhost:8000",
      //サーバからのレスポンスデータを受け取る変数
      responseData: ""
    };
  },
  computed: {
    userNamePlaceholder: function() {
      if (this.formType === "update") return "新しいユーザー名";
      if (this.formType === "register") return "新規ユーザー名";
      if (this.formType === "login") return "ユーザー名";
    },
    passwordPlaceholder: function() {
      if (this.formType === "update") return "新しいパスワード";
      if (this.formType === "register") return "パスワード";
      if (this.formType === "login") return "パスワード";
    }
  },
  methods: {
    //登録ボタンが押された場合
    accountResist: function() {
      //入力フォームの値の例外処理を行う
      let buttonName = document.getElementById("resistButton").value;
      if (!this.validateForms(buttonName)) return;
      //ルーティングによってDB処理内容を変えている
      //DBにアカウント情報を追加する(AxiosでDB操作を行うサーバへリクエストを行う)
      this.axiosHttpCommunication(this.DBFileServerPort + "/RecordInsert");
    },
    //更新ボタンが押された場合
    accountUpdate: async function() {
      //入力フォームの値の例外処理を行う
      let buttonName = document.getElementById("updateButton").value;
      if (!this.validateForms(buttonName)) return;

      //ダイアログでキャンセル押下時は更新作業を行わない
      let checkConfilm = confirm(
        "入力内容を確認してください。このアカウント情報に更新してもいいですか？"
      );
      if (checkConfilm == false) {
        alert("ユーザー情報の更新をキャンセルしました");
        return;
      }

      //DBのアカウント情報を更新する
      //issue:exceptionHandlingでエラーを返してもaxios~は呼ばれるためDBにCRUD処理がされてしまう
      this.axiosHttpCommunication(this.DBFileServerPort + "/UpdateRecode");
    },
    //入力フォームの例外処理のメソッド
    //押されたボタン(buttonNamePushed)で例外処理の内容が変わるので場合分けをしている
    validateForms: function(buttonNamePushed) {
      try {
        //IDをチェック（新規登録の場合は行わない）
        if (buttonNamePushed == "更新") {
          if (!this.accountData.id) {
            alert("ユーザーIDは数字で入力してください");
            throw new Error("INVALID_USERID_ERR");
          }
        }

        //名前をチェック
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

        //事業所をチェック
        if (!this.accountData.office) {
          alert("事業所を選択してください");
          throw new Error("INVALID_OFFICE_ERR");
        }
      } catch (error) {
        // throwで投げたエラーメッセージをコンソールに表示する
        console.error("入力が不完全のため、登録を中止しました");
        console.log(error);
        // ユーザーからの入力が不完全なので、exceptionHandlingメソッドはここで中止する
        return false;
      }

      // 全てのフォームが問題なく入力されていたらOKを出す
      return true;
    },
    // DBにアカウント情報を追加する
    axiosHttpCommunication: function(DestinationURL) {
      console.debug("called axiosHttpCommunication!");
      //POST通信でDBへアカウント情報（レコード）を追加する
      axiosHttpCommunication(DestinationURL, "POST", this.accountData);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
