<template>
  <v-app id="app">
    <v-card>
      <v-app-bar color="primary" dark app>
        <v-toolbar-title>user_login</v-toolbar-title>
        <template v-slot:extension>
          <v-tabs
            align-with-title
            fixed-tabs
          >
            <v-tab to="/">Register</v-tab>
            <v-tab to="/Login">Login</v-tab>
            <v-tab to="/Update">Update</v-tab>
            <v-tab to="/AdministratorPage">Administrator Page</v-tab>
          </v-tabs>
        </template>
      </v-app-bar>
      </v-sheet>
    </v-card>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: "App",

  components: {},

  data: () => {
    return {};
  },
};
</script>

<style scoped>
</style>