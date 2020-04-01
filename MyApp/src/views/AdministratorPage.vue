<template>
  <div class="backend">
    <h1>管理者画面</h1>
    <!-- 検索機能はDB実装が終わってからaddする -->
    <!-- <input type="text" placeholder="名前で検索" v-model="searchName" /> -->
    <!-- <input type="button" value="検索" @click="searchWord()" /> -->

    <!-- <input type="checkbox" id="sexFilter" v-model="femaleHidden" /> -->
    <!-- <label for="sexFilter">男性のみ表示</label> -->
    <!-- sexFilterはmember情報にshownを追加してv-shownで行っていた -->

    <h2>アカウント登録者一覧</h2>
    <table id="memberList">
      <tr>
        <th>ID</th>
        <th>名前</th>
        <th>性別</th>
        <th>事業所</th>
        <th>削除</th>
      </tr>
      <tr v-for="member in members" v-bind:key="member.id">
        <td>{{ member.id }}</td>
        <td>{{ member.name }}</td>
        <td>{{ member.sex }}</td>
        <td>{{ member.office }}</td>
        <td>
          <button @click="removeMember(member.id)">削除</button>
        </td>
      </tr>
    </table>

    <button @click="doClear">LocalStorage初期化</button>
  </div>
</template>

<script>
// axiosでHTTP通信を行うためのJSモジュールをインポート
import axiosHttpCommunication from "../js/axios_http_communication.js";

export default {
  name: "AdministratorPage",
  data: function() {
    return {
      members: [],
      // ユーザーからの入力値(v-modelで参照)
      // isLoggedIn: false, // ログイン状態の判定
      // login: {
      //   name: "", // ログインのため送信されたユーザーネーム
      //   password: "" // ログインのため送信されたパスワード（本来は生のパスワードを使ってはいけない）
      // },
      femaleHidden: false, // 初期状態では男女とも表示
      //DBサーバのドメイン
      DBFileServerPort: "http://localhost:8000",
      //DBから取得したアカウントデータ
      getUserData: ""
    };
  },
  methods: {
    //ローカルストレージの初期化
    doClear: function() {
      if (confirm("ローカルストレージを本当に空にしてもよろしいですか？")) {
        localStorage.clear();
      }
    },
    removeMember: function(id) {
      const axios = require("axios");
      axios.post(this.DBFileServerPort + "/deleteRecord/" + id);
    }
    //LocalStorage(またはDB)にアカウント情報全体を保存するメソッド（モジュール化）
    //アカウント削除を行うメソッド（モジュール化）
    //アカウント検索＋着色メソッド（モジュール化）
  },
  //ページリロード時にアカウントデータをDBから取得するメソッド
  created: async function() {
    console.log("Vue instance created!");
    //await以降の関数はpromiseを返さないと同期処理は機能しない
    this.getUserData = await axiosHttpCommunication(
      this.DBFileServerPort + "/ReferenceTable",
      "GET"
    );
    console.debug("getUserDataの内容:", this.getUserData);
    //連想配列にして、vue側のdataオプションで捕捉する
    this.members = JSON.parse(this.getUserData);
  }
};
</script>

<style scoped>
div.backend {
  background-color: #afeeee;
}

#memberList {
  border-collapse: collapse;
}

table,
th,
td {
  border: solid 1px black;
}
</style>
