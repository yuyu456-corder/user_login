<template>
  <div>
    <v-app>
      <!-- アカウント情報入力用のコンポーネント -->
      <!-- 各Vueファイルからフォーム種別の指定を受け取って表示内容を変更している -->

      <!-- ID入力欄
      表示するのはユーザー情報変更時のみ-->
      <span v-if="formType === 'update'">
        <v-text-field v-model="accountData.id" label="ユーザーID" id="user_id">
        </v-text-field>
      </span>

      <!-- ユーザー名入力欄
      フォーム種別によって微妙にplaceholderの中身が違うのでcomputed属性で対応
      -->
      <span>
        <v-text-field
          v-model="accountData.name"
          :label="userNamePlaceholder"
          id="user_name"
        >
        </v-text-field>
      </span>

      <!-- パスワード入力欄
      type=passwordにより、入力値がマスクされる-->
      <span>
        <v-text-field
          type="password"
          v-model="accountData.password"
          :label="passwordPlaceholder"
          id="password"
        >
        </v-text-field>
      </span>

      <p v-if="loginFailed" style="color: red;">ログインに失敗しました。</p>

      <!-- 情報更新時か新規作成時にのみ選択する項目 -->
      <div v-if="formType === 'register' || formType === 'update'">
        <v-radio-group v-model="accountData.sex">
          <v-radio type="radio" value="male" label="男性" class="sex">
          </v-radio>
          <v-radio type="radio" value="female" label="女性" class="sex">
          </v-radio>
        </v-radio-group>

        <v-select
          id="office_place"
          v-model="accountData.office"
          label="事業所選択"
          :items="office_places"
          dense
        >
        </v-select>
      </div>

      <!-- どのフォームかによって、送信ボタンのテキストを変える -->
      <span v-if="formType === 'register'">
        <v-btn id="registerButton" @click="accountRegister" color="primary"
          >登録</v-btn
        >
      </span>
      <span v-else-if="formType === 'update'">
        <v-btn id="updateButton" @click="accountUpdate" color="primary"
          >更新</v-btn
        >
      </span>
      <span v-else-if="formType === 'login'">
        <v-btn id="loginButton" @click="accountLogin" color="primary"
          >ログイン</v-btn
        >
      </span>
    </v-app>
  </div>
</template>

<script>
// axiosでHTTP通信を行うためのJSモジュールをインポート
import axiosHttpCommunication from "../js/axios_http_communication.js";
// ページ内で別ページに遷移させたい為、routerをインポート
import router from "../router/index.js";

export default {
  name: "accountInputForm",
  props: {
    msg: String,
    formType: String, // either of "update", "register", "login"
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
        password: "",
      },
      //アクセスカウンタ（初期値0）
      accessCount: 0,
      //DBサーバのドメイン
      DBFileServerPort: "http://localhost:8000",
      //サーバからのレスポンスデータを受け取る変数
      responseData: "",
      // Boolean to show if the login attempt is successful
      loginFailed: false,
      //選択できる事業所リスト
      //他の事業所も追加可能
      office_places: ["東京事業所", "大阪事業所", "仙台事業所", "札幌事業所"],
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
      if (this.formType === "register") return "新規パスワード";
      if (this.formType === "login") return "パスワード";
    },
  },
  methods: {
    // 登録ボタンが押された場合
    accountRegister: async function() {
      const axios = require("axios");
      // 入力フォームの値の検証処理を行う
      if (!this.validateForms()) return;
      //ルーティングによってDB処理内容を変えている
      //DBにアカウント情報を追加する(AxiosでDB操作を行うサーバへリクエストを行う)
      try {
        await axios.post(
          this.DBFileServerPort + "/RecordInsert",
          this.accountData
        );
        alert("登録が完了しました");
      } catch (err) {
        alert("登録が失敗しました: " + err);
      }
    },
    // ログインボタンが押された場合
    accountLogin: async function() {
      const axios = require("axios");

      if (!this.validateForms()) return;

      // ユーザ名・パスワードが不正なら403を返すようにBackendはなっている
      // レスポンスとして403が返ってくるとVueはエラーを投げるようなので、それを捕捉する
      //トークン発行＞アクセストークンとしてクライアントに送信するのは、ログイン処理が終わってから行う
      await axios
        .post(this.DBFileServerPort + "/login", this.accountData, {
          withCredentials: true,
        })
        .then(
          //ログイン成功
          (resolve) => {
            this.loginFailed = false;
            alert("ログインに成功しました");
            //ユーザごとのマイページへ遷移する
            router.push({ name: "myPage", params: { id: resolve.data } });
            return;
          },
          //ログイン失敗
          (err) => {
            this.loginFailed = true;
            return;
          }
        );
    },
    //更新ボタンが押された場合
    accountUpdate: async function() {
      const axios = require("axios");
      if (!this.validateForms()) return;

      //ダイアログでキャンセル押下時は更新作業を行わない
      let checkConfilm = confirm(
        "入力内容を確認してください。このアカウント情報に更新してもいいですか？"
      );
      if (checkConfilm == false) {
        alert("ユーザー情報の更新をキャンセルしました");
        return;
      }

      try {
        //DBのアカウント情報を更新する
        await axios.post(
          this.DBFileServerPort + "/UpdateRecord",
          this.accountData
        );
        alert("登録処理が成功しました");
      } catch (err) {
        alert("登録処理が失敗しました: " + err);
        return;
      }
    },
    /**
     * 入力フォームの例外処理のメソッド
     * @returns {boolean} - 全項目入力されていればtrue, されていなければfalse
     */
    validateForms: function() {
      try {
        //IDをチェック（情報更新の場合のみ選択する）
        if (this.formType == "update") {
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

        // パスワードをチェック
        if (!this.accountData.password) {
          alert("パスワードを入力してください");
          throw new Error("INVALID_PASSWORD_ERR");
        }

        // ログインの場合には性別や事業所は選択しないので、ここでフォーム検証は終わり
        if (this.formType == "login") return true;

        //ラジオボタンの入力状況で男女を区別、pushする文字列（M,F）を確定する
        if (!this.accountData.sex) {
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
    },
  },
};
</script>
