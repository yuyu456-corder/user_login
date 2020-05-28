const express = require("express");
const router = express.Router();

// アクセストークンによる自動ログイン
router.get("/", (req, res) => {
  console.log("module routing loginAccessToken");

  const jwt = require("jsonwebtoken");
  const models = require("../models/");

  //クライアントのリクエストにアクセストークンがあればログイン処理は成功させる
  if (req.cookies["accessToken"] !== undefined) {
    console.log("AccessToken detected: " + req.cookies["accessToken"]);
    //受け取ったトークンを復号し、正当性を確認
    //秘密鍵の取得
    require("dotenv").config();
    //秘密鍵の取得。改行コードのエスケープを解除し、バイナリデータ化する
    //秘密鍵が存在しない場合はreplaceメソッドで動かなくなるのでそれを回避する
    let privateKey;
    if (process.env.PRIVATE_KEY) {
      privateKey = Buffer.from(process.env.PRIVATE_KEY.replace(/\\n/g, '\n'));
      jwt.verify(req.cookies["accessToken"], privateKey, async (err, decoded) => {
        //トークンの正当性(PayloadのIDが正しい且つSignatureが改ざんされていない)が確認されればログイン成功とする
        if (decoded) {
          console.log("アクセストークンによるログイン成功");
          //usersテーブルから対象ユーザのidを取得する
          await models.user
            .findAll({ attributes: ["id"], where: { id: decoded.sub } })
            .then(
              //Promise Resolve(参照成功)
              resolve => {
                let getUserId = JSON.stringify(resolve);
                //JSONファイルとしてデータをFrontendに返している
                res.json(getUserId);
                return;
              },
              //Promise Failed（参照失敗）
              failed => {
                console.error("Table Referencing Promise Failed by:" + failed);
                res.status(403).end();
                return;
              }
            )
          //トークンの正当性が確保できない場合何もしない
        } else if (err) {
          //有効なトークンが確認できなければ403を返す
          console.log("Valid Access Token is not Existed:" + err);
          res.sendStatus(403);
          return;
        }
      });
    }
  };
});

module.exports = router;