module.exports = {
  "pluginOptions": {
    "express": {
      "shouldServeApp": true,
      "serverDir": "Backend/"
    }
  },
  "devServer": {
    "proxy": {
      "^/api": {
        "target": "http://localhost:8080",
        "ws": true,
        "secure": false
      }
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}