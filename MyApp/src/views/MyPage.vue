<template>
  <div class="myPage">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>This Page is Your MyPage</h1>
  </div>
</template>

<script>
export default {
  name: "MyPage",
  components: {},
  data: function() {
    return {
      //DBサーバのドメイン
      DBFileServerPort: "http://localhost:8000",
    };
  },
};
</script>
