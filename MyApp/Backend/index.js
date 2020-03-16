import express from "express";
const app = express();

export default (app, http) => {
  //全てのAPIのCORSを許可する
  const cors = require("cors");
  app.use(cors());

  //JSONリクエストを解析してExpress.js側で扱えるデータにする
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //CRUD処理に必要なライブラリのインポート
  const sqlite3 = require("sqlite3").verbose();
  const { Sequelize } = require("sequelize");

  //ルートディレクトリへのルーティング
  app.get("/", (req, res) => {
    res.send("<h1>This Page is DBServer!</h1>");
  });

  //ルーティングによって行うCRUD処理を切り替えている
  //レコード挿入を行うルーティング処理
  app.post("/RecordInsert", (req, res) => {
    //モデルのインポート、同時にDBも読み込んでいる
    //modelsディレクトリのindex.jsも見てそこ経由でconfig.jsonでDB情報も取得している
    const models = require("./db/models/");

    //登録データ（obj）を取得する
    console.debug(req.body); //e.g. { office: 'Sendai', sex: 'male', name: 'Suzuki' }
    let accountData = req.body; //e.g. accountData.name > Suzuki

    //レコード挿入(即時関数)
    (async function insertRecord() {
      try {
        console.log("Record Inserting...");
        //Model.create は Model.build と instance.saveを行っている
        await models.user
          .create({
            // idはDB側でautoIncrementに設定している
            name: accountData.name,
            sex: accountData.sex,
            office: accountData.office,
            createdAt: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
            updatedAt: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })
          })
          .then(
            //Promise Resolve
            resolve => {
              console.debug("Hello! " + resolve.name + " Inserted!");
              return null;
            },
            //Promise Failed
            failed => {
              console.debug("ERROR:" + failed);
              console.log("ERROR:Record Inserting Promise Failed...");
              return null;
            }
          )
          .finally(() => {
            res.send("Record Inserting Process Done!");
          });
      } catch (error) {
        res.send("ERROR: Record Inserting is Aborted...");
      }
    })();
  });

  //レコード参照を行うルーティング処理
  app.get("/ReferenceTable", (req, res) => {

    //モデルの読み込み
    const models = require("./db/models/");

    //DB参照（即時関数）
    (async function ReferenceTable() {
      console.log("Table Referencing...");

      //usersテーブルから全て取得している
      await models.user.findAll().then(
        //Promise Resolve
        resolve => {
          let findTable = JSON.stringify(resolve);
          //JSONファイルとしてデータをFrontendに返している
          res.json(findTable);
          return null;
        },
        //Promise Failed
        failed => {
          console.debug("ERROR:" + failed);
          console.log("ERROR:Table Referencing Promise Failed...");
          return null;
        }
      ).finally(() => {
        console.log("Table Referencing Process Done!");
      })
    })();

  });

  // app.use(express.json());
  //
  // app.post('/bar', (req, res) => {
  //   res.json(req.body);
  // });
  //
  // optional support for socket.io
  //
  // let io = socketIO(http);
  // io.on("connection", client => {
  //   client.on("message", function(data) {
  //     // do something
  //   });
  //   client.emit("message", "Welcome");
  // });
};
