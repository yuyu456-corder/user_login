<template>
  <v-app>
    <v-card>
      <v-app-bar color="primary" dark app>
        <v-toolbar-title>user_login</v-toolbar-title>
        <template v-slot:extension>
          <v-tabs
            align-with-title
          >
            <v-tab>Register</v-tab>
            <v-tab>Login</v-tab>
            <v-tab>Update</v-tab>
            <v-tab>Administrator Page</v-tab>
          </v-tabs>
        </template>
      </v-app-bar>
      </v-sheet>
    </v-card>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    tabLinkPass: [
      "./views/Frontend.vue",
      "./views/Login.vue",
      "./views/Update.vue",
      "./views/AdministratorPage.vue",
    ],
  }),
};
</script>