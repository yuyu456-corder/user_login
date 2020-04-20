import express from "express";
const app = express();

export default (app, http) => {
  //全てのAPIのCORSを許可する
  const cors = require("cors");
  app.use(cors());

  // パスワードのハッシュ化用
  const bcrypt = require("bcrypt");
  const saltRounds = 10;

  //JSONリクエストを解析してExpress.js側で扱えるデータにする
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //Cookieを取り扱うミドルウェア
  const cookieParser = require("cookie-parser");
  app.use(cookieParser("accessToken"));

  //エラーハンドリング用のミドルウェア(全てのミドルウェアの最後で呼び出す)
  //next(new Error)で各ルーティング経由で呼ばれる
  //現状は各ルーティング処理で行っているがここで一元管理したい
  app.use(function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(403).send(err);
    return;
  });

  // request.bodyの値からハッシュ値を計算
  const getHash = reqBody => {
    return bcrypt.hash(reqBody.name + reqBody.password, saltRounds);
  };

  /**
   * 以下routing
   * 可読性のため、あとで別ファイルとして独立させるべき
   */

  //ルートディレクトリへのルーティング
  app.get("/", (req, res) => {
    res.send("<h1>This Page is DBServer!</h1>");
  });

  // Authenticate
  app.post("/login", async (req, res, next) => {
    //JWTトークンを作成するライブラリ
    const jwt = require("jsonwebtoken");
    const models = require("./models/");

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
        jwt.sign({ id: user.id }, privateKey, { algorithm: "HS256" },
          (err, token) => {
            //トークンの発行に失敗した場合でもログイン処理を中断しないようにする
            if (err) {
              console.error("generating Token Failed: " + err);
              res.sendStatus(200);
              return;
            };
            //トークンの発行に成功した場合、クライアントのブラウザ(Cookie)に保存させる
            console.log("generated Token: " + token);
            res.cookie("accessToken", token);
            res.sendStatus(200);
            return;
          }
        );
        return;
      }
    }
    console.log("ログイン失敗");
    res.sendStatus(403);
  });

  //ルーティングによって行うCRUD処理を切り替えている
  //レコード挿入(INSERT)を行う
  app.post("/RecordInsert", (req, res) => {
    //モデルのインポート、同時にDBも読み込んでいる
    //modelsディレクトリのindex.jsも見てそこ経由でconfig.jsonでDB情報も取得している
    const models = require("./models/");

    //登録データ（obj）を取得する
    console.debug(req.body); //e.g. { office: 'Osaka', sex: 'male', name: 'Suzuki' }
    let accountData = req.body; //e.g. accountData.name > Suzuki

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

  //レコード参照(READ)を行う
  app.get("/ReferenceTable", (req, res) => {
    //モデルの読み込み
    const models = require("./models/");

    //DB参照（即時関数）
    (async function ReferenceTable() {
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

  //入力フォームのIDが有効かチェックする
  app.post("/UpdateRecord", (req, res, next) => {
    const models = require("./models/");

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
  app.post("/UpdateRecord", (req, res, next) => {
    console.log("UpdateRecord called")
    //モデルの読み込み
    const models = require("./models/");

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

  //レコード削除(DELETE)を行う
  app.post("/deleteRecord/:userId", async (req, res, next) => {
    const models = require("./models/");
    try {
      await models.user.destroy({ where: { "id": req.params.userId } });
    } catch (e) {
      console.log("エラー：", e);
    }
  });
};