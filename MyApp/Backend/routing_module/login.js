const express = require("express");
const router = express.Router();

// アカウント情報入力によるログイン
router.post("/", async (req, res) => {
  console.log("module routing login");
  //JWTトークンを作成するライブラリ
  const jwt = require("jsonwebtoken");
  const models = require("../models/");
  // パスワードの復号用
  const bcrypt = require("bcrypt");

  // DBから該当するユーザーのデータを引っ張る
  const users = await models.user.findAll({ where: { name: req.body.name } });

  if (users.length == 0) {
    console.log("存在しないユーザーでのログイン試行");
    res.status(403).send("そのようなユーザーは登録されていません");
    return;
  }

  // 同名のユーザーが複数いる可能性を考慮し、forでループ
  for (let user of users) {
    const match = await bcrypt.compare(
      req.body.name + req.body.password,
      user.password
    );

    //リクエストから送られたユーザ名とパスワードが一致すればログイン成功とする
    if (match) {
      console.log("ログイン成功");
      //アクセストークンをログインが成功したユーザへ発行する
      //秘密鍵の取得
      require("dotenv").config();
      //秘密鍵の取得。改行コードのエスケープを解除し、バイナリデータ化する
      //秘密鍵が存在しない場合はreplaceメソッドで動かなくなるのでそれを回避する
      let privateKey;
      if (process.env.PRIVATE_KEY) {
        privateKey = Buffer.from(process.env.PRIVATE_KEY.replace(/\\n/g, '\n'));
      }
      // 既にアカウント作成済みのユーザからリクエストが送られたらユーザ情報でトークンを発行する
      // APIサーバと認可サーバが同じのため、HS256（共通鍵）で暗号化している
      jwt.sign({ sub: user.id }, privateKey, { algorithm: "HS256" },
        (err, token) => {
          //トークンの発行に失敗した場合でもログイン処理を中断しないようにする
          if (err) {
            console.error("generating Token Failed: " + err);
            res.status(200).cookie("testKey", "testValue", { path: "/", httpOnly: false, SameSite: "Lax" });
            let resUserId = JSON.stringify([{ "id": user.id }]);
            //フロントエンド側にIDを返す
            res.json(resUserId);
            return;
          } else {
            //トークンの発行に成功した場合、クライアントのブラウザ(Cookie)に保存させる
            console.log("generated Token: " + token);
            res.status(200).cookie("accessToken", token, { path: "/", httpOnly: false, SameSite: "Lax" });
            let resUserId = JSON.stringify([{ "id": user.id }]);
            //フロントエンド側にIDを返す
            res.json(resUserId);
            return;
          }
        }
      );
      return;
    }
  }
  //マッチするユーザが見つからなければログイン失敗とする
  console.log("ログイン失敗");
  res.sendStatus(403);
});

module.exports = router;