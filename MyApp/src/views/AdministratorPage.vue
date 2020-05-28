<template>
  <div class="backend">
    <v-app>
      <v-card>
        <h1>管理者画面</h1>
        <!-- 検索機能はDB実装が終わってからaddする -->
        <!-- <input type="text" placeholder="名前で検索" v-model="searchName" /> -->
        <!-- <input type="button" value="検索" @click="searchWord()" /> -->

        <!-- <input type="checkbox" id="sexFilter" v-model="femaleHidden" /> -->
        <!-- <label for="sexFilter">男性のみ表示</label> -->
        <!-- sexFilterはmember情報にshownを追加してv-shownで行っていた -->
        <h2>アカウント登録者一覧</h2>
      </v-card>

      <v-data-table
        id="memberList"
        show-select
        v-model="checkboxSelected"
        :headers="tableHeaders"
        :items="members"
        item-key="id"
      >
      </v-data-table>

      <v-btn id="remove_account" @click="inputRemoveButton" color="primary">
        選択アカウントを削除
      </v-btn>

      <v-btn id="clear_localStorage" @click="doClear">
        Local Storage初期化
      </v-btn>
    </v-app>
  </div>
</template>

<script>
// axiosでHTTP通信を行うためのJSモジュールをインポート
import axiosHttpCommunication from "../js/axios_http_communication.js";

export default {
  name: "AdministratorPage",
  data: function() {
    return {
      checkboxSelected: [],
      tableHeaders: [
        { text: "ID", align: "start", value: "id" },
        { text: "名前", value: "name" },
        { text: "性別", value: "sex" },
        { text: "事業所", value: "office" },
        { text: "登録時間", value: "createdAt" },
        { text: "更新時間", value: "updatedAt" },
      ],
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
      getUserData: "",
    };
  },
  methods: {
    //アカウント削除ボタンが押された時のイベントハンドラ
    inputRemoveButton: function() {
      if (!this.checkboxSelected.length) {
        alert("削除するアカウントにチェックボックスを入れてください");
      }
      //チェックボックスが選択されいてるアカウントは全て削除する
      this.checkboxSelected.forEach((selectedAccount) => {
        this.removeMember(selectedAccount.id);
      });
    },
    //DBから対象アカウントを削除する
    removeMember: function(id) {
      const axios = require("axios");
      axios.post(this.DBFileServerPort + "/deleteRecord/" + id);
      this.loadMemberList();
    },
    //ローカルストレージの初期化
    doClear: function() {
      if (confirm("ローカルストレージを本当に空にしてもよろしいですか？")) {
        localStorage.clear();
      }
    },
    //アカウント検索＋着色メソッド（モジュール化）
    //LocalStorage(またはDB)にアカウント情報全体を保存するメソッド（モジュール化）
    loadMemberList: async function() {
      this.getUserData = await axiosHttpCommunication(
        this.DBFileServerPort + "/referenceTable",
        "GET"
      );
      console.debug("getUserDataの内容:", this.getUserData);
      //連想配列にして、vue側のdataオプションで捕捉する
      this.members = await JSON.parse(this.getUserData);
    },
  },
  //ページリロード時にアカウントデータをDBから取得するメソッド
  created: function() {
    console.log("Vue instance created!");
    this.loadMemberList();
  },
};
</script>
