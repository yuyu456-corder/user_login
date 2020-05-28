const express = require("express");
const router = express.Router();

//DBからパスワード以外の全てのアカウント情報を全員分参照する
router.get("/", (req, res) => {
  console.log("module routing referenceTable");
  //モデルの読み込み
  const models = require("../models/");

  //DB参照（即時関数）
  (async function referenceTable() {
    console.log("Table Referencing...");

    //usersテーブルから全て取得している
    await models.user
      .findAll({ attributes: { exclude: ["password"] } })
      .then(
        //Promise Resolve(参照成功)
        resolve => {
          let findTable = JSON.stringify(resolve);
          //JSONファイルとしてデータをFrontendに返している
          res.json(findTable);
          return;
        },
        //Promise Failed（参照失敗）
        failed => {
          console.error("Table Referencing Promise Failed by:" + failed);
          res.status(403).end();
          return;
        }
      )
  })();
});

module.exports = router;