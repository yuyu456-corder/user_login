<template>
  <div class="frontend">
    <v-card>
      <h1>新規登録</h1>
      <p>あなたは{{ accessCount }}人目の訪問者です！</p>
    </v-card>

    <!-- 新規登録フォーム -->
    <accountInputForm formType="register" />
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
    <v-container>
      <h1>Firebaseテスト</h1>
      <v-text-field id="sendText"> </v-text-field>
      <v-btn id="updateFirebase" @click="testFireBaseUpdate" color="primary"
        >Firebaseへ反映
      </v-btn>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
//既に登録しているアカウント情報の変更用フォーム
import accountInputForm from "@/components/accountInputForm.vue";

export default {
  name: "Frontend",
  components: {
    //ここはこのvueファイルで構成されているコンポーネント名を羅列する
    accountInputForm,
  },
  data: function() {
    return {
      //アクセスカウンタ（初期値0）
      accessCount: 0,
    };
  },
  methods: {
    //入力内容をFireBase側に反映するメソッド
    testFireBaseUpdate: function() {
      console.log("testFireBaseUpdate called!");
      let updateData = document.getElementById("sendText").value;
      firebase
        .database()
        .ref("testData")
        .set(updateData);
    },
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
  },
};
</script>
