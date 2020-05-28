const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  // パスワードのハッシュ化用
  const bcrypt = require("bcrypt");
  const saltRounds = 10;

  console.log("module routing insertRecord");
  //モデルのインポート、同時にDBも読み込んでいる
  //modelsディレクトリのindex.jsも見てそこ経由でconfig.jsonでDB情報も取得している
  const models = require("../models/");

  //登録データ（obj）を取得する
  console.debug(req.body); //e.g. { office: 'Osaka', sex: 'male', name: 'Suzuki' }
  let accountData = req.body; //e.g. accountData.name > Suzuki

  // request.bodyの値からハッシュ値を計算
  const getHash = reqBody => {
    return bcrypt.hash(reqBody.name + reqBody.password, saltRounds);
  };

  //レコード挿入(即時関数)
  (async function insertRecord() {
    console.log("Record Inserting...");
    //Model.createはModel.buildとinstance.saveを行っている
    await models.user
      .create({
        // idはDB側でautoIncrementに設定している
        name: accountData.name,
        sex: accountData.sex,
        office: accountData.office,
        password: await getHash(accountData),
        createdAt: new Date().toLocaleString({ timeZone: "Asia/Tokyo" }),
        updatedAt: new Date().toLocaleString({ timeZone: "Asia/Tokyo" })
      })
      .then(
        //Promise Resolve(登録成功)
        resolve => {
          console.debug("Hello! " + accountData.name + " Inserted!");
          res.status(200).end();
          return;
        },
        //Promise Failed（DB接続失敗等による登録失敗）
        failed => {
          console.error("Record Inserting Promise Failed by:" + failed);
          res.status(500).end();
          return;
        }
      );
  })();
});

module.exports = router;