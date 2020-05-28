const express = require("express");
const router = express.Router();

//データ更新の前にフロントエンドから送られたIDが有効かチェックする
router.post("/", (req, res, next) => {
  console.log("module routing validationCheckId");

  const models = require("../models/");

  //登録データ（obj）を取得する
  console.debug(req.body); //e.g. { id: 3 'Osaka', sex: 'male', name: 'Suzuki' }
  let accountData = req.body; //e.g. accountData.name > Suzuki

  //DBに存在しないIDでリクエストが来たら処理を中断する
  //findByPk : find By Primary Key
  (async function () {
    await models.user
      .findByPk(accountData.id)
      //Promise Resolve
      .then(
        resolve => {
          //IDが存在すれば引き続きアカウント更新作業へ
          if (resolve === null) {
            res.status(403).send("IDが存在しません");
          }
          next();
          return;
        },
        //Promise Failed（DBと接続できない等、サーバ側のエラー）
        failed => {
          res.status(500).send(failed);
          return;
        }
      );
  })();
});

//レコード更新(UPDATE)を行う
router.post("/", (req, res) => {
  console.log("module routing updateRecord");

  // パスワードのハッシュ化用
  const bcrypt = require("bcrypt");
  const saltRounds = 10;
  // request.bodyの値からハッシュ値を計算
  const getHash = reqBody => {
    return bcrypt.hash(reqBody.name + reqBody.password, saltRounds);
  };
  
  //モデルの読み込み
  const models = require("../models/");

  //登録データ（obj）を取得する
  console.debug(req.body); //e.g. { id: 3 'Osaka', sex: 'male', name: 'Suzuki' }
  let accountData = req.body; //e.g. accountData.name > Suzuki

  //DB更新（即時関数)
  (async function UpdateRecord() {
    //SQL文： UPDATE users SET arg1 WHERE accountData.id
    await models.user
      .update(
        {
          //データ更新なのでIDとCreatedAtは変える必要がない
          name: accountData.name,
          sex: accountData.sex,
          office: accountData.office,
          password: await getHash(accountData),
          updatedAt: new Date().toLocaleString({ timeZone: "Asia/Tokyo" })
        },
        {
          //更新すべきレコードをaccountData.idから決定する
          where: {
            id: accountData.id
          }
        }
      )
      .then(
        //Promise Resolve(更新成功)
        resolve => {
          console.debug("Hello! " + accountData.name + " Updated!");
          res.status(200).end();
        },
        //Promise Failed（更新失敗）
        failed => {
          console.error("Record Updating Promise Failed by:" + failed);
          res.status(403).end();
        }
      );
  })();
});

module.exports = router;