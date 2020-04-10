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

  //エラーハンドリング用のミドルウェア(全てのミドルウェアの最後で呼び出す)
  //next(new Error)で各ルーティング経由で呼ばれる
  app.use(function errorHandler(err, req, res, next) {
    console.log(err);
    res.send(err);
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

  // トークンによるユーザ認証（テスト用）
  app.post("/testTokenAuthenticate", async (req, res, next) => {
    console.log("testTokenAuthenticate called!")
    const models = require("./models/");
    //JWTトークンを作成するライブラリ
    const jwt = require("jsonwebtoken");
    //秘密鍵の取得
    require('dotenv').config();
    //秘密鍵の取得。改行コードのエスケープを解除し、バイナリデータ化する
    const privateKey = Buffer.from(process.env.PRIVATE_KEY.replace(/\\n/g, '\n'));

    // DBからIDを取得
    await models.user.findAll({ where: { name: req.body.name } }).then(
      resolve => {
        // 既にアカウント作成済みのユーザからリクエストが送られたらIDでトークンを発行する
        // APIサーバと認可サーバが同じのため、HS256（共通鍵）で暗号化している
        // テストコードのためIDを固定値にして発行している
        jwt.sign({ id: 1 }, privateKey, { algorithm: "HS256" },
          (err, token) => {
            console.log("generated Token: " + token);
          }
        );
      },
      failed => {
        // アカウント登録を行っていないユーザの場合
        console.log(req.body.name + "is No Account");
        res.sendStatus(404).send("そのようなユーザーは登録されていません");
      }
    );
  })

  // Authenticate
  app.post("/login", async (req, res, next) => {
    const models = require("./models/");

    // DBから該当するユーザーのデータを引っ張る
    const users = await models.user.findAll({ where: { name: req.body.name } });

    if (users.length == 0) {
      console.log("存在しないユーザーでのログイン試行");
      res.status(404).send("そのようなユーザーは登録されていません");
      return;
    }

    // 同名のユーザーが複数いる可能性を考慮し、forでループ
    for (let user of users) {
      const match = await bcrypt.compare(
        req.body.name + req.body.password,
        user.password
      );

      if (match) {
        console.log("ログイン成功");
        res.sendStatus(200);
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
          //Promise Resolve
          resolve => {
            console.debug("Hello! " + accountData.name + " Inserted!");
            return null;
          },
          //Promise Failed
          failed => {
            console.error("Record Inserting Promise Failed by:" + failed);
            return null;
          }
        )
        .finally(() => {
          res.send("Record Inserting Process Done!");
        });
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
          //Promise Resolve
          resolve => {
            let findTable = JSON.stringify(resolve);
            //JSONファイルとしてデータをFrontendに返している
            res.json(findTable);
            return null;
          },
          //Promise Failed
          failed => {
            console.error("Table Referencing Promise Failed by:" + failed);
            return null;
          }
        )
        .finally(() => {
          console.log("Table Referencing Process Done!");
        });
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
            //リクエストIDがDBに存在しなかったらエラーハンドリング用のミドルウェアにルーティングしてこのルートでの作業は中断する
            if (resolve === null) {
              return next(new Error("Request Id is Invalid"));
            } else {
              //入力IDに問題が無ければ引き続き同じルーティング処理（/UpdateRecord）へ
              console.log("Request Id is Valid");
              next();
            }
            return null;
          },
          //Promise Failed
          failed => {
            console.error("find By Primary Key Promise Failed by: " + failed);
          }
        );
    })();
  });

  //レコード更新(UPDATE)を行う
  app.post("/UpdateRecord", (req, res, next) => {
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
          //Promise Resolve
          resolve => {
            console.debug("Hello! " + accountData.name + " Updated!");
            res.send("アカウント情報の更新に成功しました");
          },
          //Promise Failed
          failed => {
            console.error("Record Updating Promise Failed by:" + failed);
            res.send("アカウント情報の更新に失敗しました");
          }
        )
        .finally(() => {
          console.log("Record Updating Process Done!");
        });
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