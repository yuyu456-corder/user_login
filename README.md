# user_login

ログイン機能（Vue.js ＋ Express.js ＋ SQLite）<br>
何かしらの Web サービスのログイン機能とアカウント管理を行うシステム

## ファイル構成

- MyApp :vue-cli で構築されたプロジェクトファイル
  - MyApp/src/ :フロントエンド側のファイルをまとめたディレクトリ
    - MyApp/src/js/axios_http_communication.js :HTTP
      通信を行う JS モジュール
    - MyApp/src/views/Frontend.vue :フロントエンドの view の中核になるファイル
- MyApp/Backend/ :バックエンド側のファイルをまとめたディレクトリ
  - MyApp/Backend/index.js :Backend 側の処理を行う JS ファイル
  - MyApp/Backend/account.sqlite :DB 本体

## 実装機能

- アカウント追加
  - ボタンクリックで入力したフォーム内容を DB に登録（ID は DB 内で autoIncrement で設定）
  - 各フォームでユーザー名、性別、事業所名を選択できるようにした
  - 各フォームの例外処理にも対応
- アカウント参照
  - Frontend で登録したアカウントデータを Administrator Page で DB 経由で参照する
- アカウント更新
  - アカウント情報変更フォームで入力した ID を元に既に登録しているアカウント情報を更新する
  - 登録されていない ID が入力された場合は更新作業を行わない
- アカウント削除
  - 対応するアカウントの削除ボタンで可能
- アクセストークンの発行
  - ログインを行ったユーザに対してトークンを発行する
  - 現状はテストとして対応したユーザの ID をもとにトークンをターミナルに出力するだけ
- ローカルストレージによるアクセスカウンタ

## あったらいい機能

- 各ユーザーのパスワード情報も記憶させ、間違っているなら「パスワードが違います！」を表示させたい
- ユーザー登録のときにパスワードなども登録できるようにしたい（セキュリティ面も強化したい）
- ログイン機能が実装できたら、CSV ファイルを DB にインポートさせてデータ分析などを行いたい

## 実行方法

1. `cd MyApp/`
1. `npm install`
1. `npm start`<br>
   　- localhost:8080 がフロントエンド側、localhost:8000 がバックエンド側と仮定して開発中
1. `localhost:8080`にアクセス

## 対応中の不具合

- アカウント削除ボタンのハンドラが上手く動作していないため、削除したいアカウントを指定できない
- 着色機能の不具合
  - 1 アカウントにつき 1 文字にしか反映されない
  - 2 文字以上は未対応
  - CRUD 処理実装中のため、この機能はマージしていない
- JWT トークン発行に使う秘密鍵は環境変数にして.env ファイルで管理している
  - .gitignore の対象なので clone や pull をしてもこのトークンが発行されずにエラーが出力される

## 問題点

- sequelize-cli で作成された config.json の storage は DB へのパスが設定されているが、API サーバが実行中は MyApp/（npm start）からの相対パスでないと接続できず、  
  CLI で sequelize-cli を用いて Migration 等を行うときはコマンドを実行するカレンとディレクトリからの相対パスでないと DB と接続できない

## 開発環境

- VSCode/Git
- JavaScript
  - Vue.js (framework)
  - Express.js (framework)
  - axios (npm Library)
  - Vue CLI (npm Library)
  - sequelize (npm Library)
  - sequelize-cli (npm Library)
  - dotenv (npm Library)
  - jsonwebtoken (npm Library)
- SQLite
