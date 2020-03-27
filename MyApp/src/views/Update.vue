<template>
  <div class="frontend">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>アカウント情報変更</h1>

    <!-- 情報変更フォーム -->
    <!-- 本来はログインしたユーザーが自分の情報を更新する際に用いる -->
    <h2>アカウント情報変更</h2>
    <p>既にアカウントを変更しているユーザーが対象です</p>

    <accountInputForm formType="update" />
  </div>
</template>

<script>
// @ is an alias to /src
//既に登録しているアカウント情報の変更用フォーム
import accountInputForm from "@/components/accountInputForm.vue";

export default {
  name: "Update",
  components: {
    //ここはこのvueファイルで構成されているコンポーネント名を羅列する？
    accountInputForm
  }
};
</script>

<style scoped>
div.frontend {
  background-color: #ffeeee;
}
</style>
