import express from "express";
const app = express();

export default (app, http) => {

  //モジュール化したルーティング処理を読み込む
  const referenceTable = require("./routing_module/referenceTable");
  const loginAccessToken = require("./routing_module/loginAccessToken");
  const login = require("./routing_module/login");
  const insertRecord = require("./routing_module/insertRecord");
  const updateRecord = require("./routing_module/updateRecord");
  const deleteRecord = require("./routing_module/deleteRecord");

  //全てのAPIのCORSを許可する
  //クロスサイト間のCookieのセッションも許可する
  const cors = require("cors");
  app.use(cors({ origin: true, credentials: true }));

  //JSONリクエストを解析してExpress.js側で扱えるデータにする
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //Cookieを取り扱うミドルウェア
  const cookieParser = require("cookie-parser");
  app.use(cookieParser());

  //エラーハンドリング用のミドルウェア(全てのミドルウェアの最後で呼び出す)
  //next(new Error)で各ルーティング経由で呼ばれる
  //現状は各ルーティング処理で行っているがここで一元管理したい
  app.use(function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(403).send(err);
    return;
  });

  //以下Routing

  //ルートディレクトリへのルーティング
  app.get("/", (req, res) => {
    res.send("<h1>This Page is DBServer!</h1>");
  });

  // アクセストークンによる自動ログイン
  app.use("/loginAccessToken", loginAccessToken);

  // アカウント情報入力によるログイン
  app.use("/login", login);

  //レコード挿入(INSERT)を行う
  app.use("/insertRecord", insertRecord);

  //レコード参照(READ)を行う
  app.use("/referenceTable", referenceTable);

  //レコード更新(UPDATE)を行う
  app.use("/updateRecord", updateRecord);

  //レコード削除(DELETE)を行う
  app.use("/deleteRecord", deleteRecord);
}