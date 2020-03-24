<template>
  <div>
    <!-- アカウント情報入力用のコンポーネント -->
    <!-- Frontend.vueから値を受け取って適宜値を変更している -->

    <!-- ID入力欄 -->
    <input
      type="text"
      v-model="accountData.id"
      name="user_id"
      placeholder="ユーザーID"
      v-bind:style="shownIdForm"
    />
    <br />

    <!-- ユーザー名入力欄 -->
    <input
      type="text"
      v-model="accountData.name"
      name="user_name"
      v-bind:placeholder=placeholderWordsUserName
    />
    <br />

    <input type="radio" v-model="accountData.sex" name="sex" value="male" />男性
    <input
      type="radio"
      v-model="accountData.sex"
      name="sex"
      value="female"
    />女性
    <br />

    <select name="office_place" v-model="accountData.office">
      <option value="" disabled selected>事業所選択</option>
      <option value="Tokyo">東京事業所</option>
      <option value="Osaka">大阪事業所</option>
      <option value="Sendai">仙台事業所</option>
      <option value="Sapporo">札幌事業所</option>
      <!-- 他の事業所も追加可能 -->
    </select>

    <!-- DB更新でアカウント情報更新 -->
    <input
      type="button"
      value="登録"
      id="resistButton"
      v-bind:style="shownResistButton"
      @click="accountResist"
    />
    <input
      type="button"
      value="更新"
      id="updateButton"
      v-bind:style="shownUpdateButton"
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
    placeholderWordsUserName: String,
    placeholderWordsId: String,
    // 親コンポーネントから受け取った値で各パーツの表示・非表示を決定
    shownIdForm: String,
    shownResistButton: String,
    shownUpdateButton: String
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
        name: ""
      },
      //アクセスカウンタ（初期値0）
      accessCount: 0,
      //DBサーバのドメイン
      DBFileServerPort: "http://localhost:8000",
      //サーバからのレスポンスデータを受け取る変数
      responseData: ""
    };
  },
  methods: {
    //登録ボタンが押された場合
    accountResist: function() {
      //入力フォームの値の例外処理を行う
      let buttonName = document.getElementById("resistButton").value;
      this.exceptionHandling(buttonName);
      //ルーティングによってDB処理内容を変えている
      //DBにアカウント情報を追加する(AxiosでDB操作を行うサーバへリクエストを行う)
      this.axiosHttpCommunication(this.DBFileServerPort + "/RecordInsert");
    },
    //更新ボタンが押された場合
    accountUpdate: async function() {
      //入力フォームの値の例外処理を行う
      let buttonName = document.getElementById("updateButton").value;
      this.exceptionHandling(buttonName);
      //DBのアカウント情報を更新する
      //issue:exceptionHandlingでエラーを返してもaxios~は呼ばれるためDBにCRUD処理がされてしまう
      this.axiosHttpCommunication(this.DBFileServerPort + "/UpdateRecode");
    },
    //入力フォームの例外処理のメソッド
    //押されたボタン(buttonNamePushed)で例外処理の内容が変わるので場合分けをしている
    exceptionHandling: function(buttonNamePushed) {
      try {
        //IDをチェック（新規登録の場合は行わない）
        if (buttonNamePushed == "更新") {
          if (!this.accountData.id) {
            alert("ユーザーIDは数字で入力してください");
            throw new Error("INVALID_USERID_ERR");
          }
          //ダイアログでキャンセル押下時は更新作業を行わない
          let checkConfilm = confirm("入力内容を確認してください。このアカウント情報に更新してもいいですか？");
          if(checkConfilm == false){
            alert("ユーザー情報の更新をキャンセルしました");
            return;
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
        return;
      }
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
