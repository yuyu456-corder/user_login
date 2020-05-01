# user_login

ログイン機能（Vue.js ＋ Express.js ＋ SQLite）<br>
何かしらの Web サービスのログイン機能とアカウント管理を行うシステム

## 実行方法

### 起動

1. `cd MyApp/`
1. `npm install`
1. `npm start`
   - これにより、Vue.js のフロントエンドと Express.js のバックエンド双方が立ち上がります
   - `localhost:8080` がフロントエンド側、`localhost:8000` がバックエンド側と仮定して開発中
1. `localhost:8080`にアクセス

## Cypress Integration Test

ユーザー登録とログイン処理が正常に成功するかどうかテストする。これにより、高速かつ漏れなく作ったサービスの動作確認ができる。

1. サーバーが実行されていることを確認
2. `cd MyApp`
3. `./node_modules/.bin/cypress open`
4. 立ち上がったウインドウ上で`user_login.spec.js`をクリックして実行

今回の試験では２人のテストユーザーを使ったが、全体でも５秒程度しかかからなかった。

1. 登録ページに行き、新しいユーザーを登録して「登録成功」のメッセージがでることを確認する。
2. ログインページに行きその情報でログインを試行し、「ログイン成功」のメッセージがでることを確認する。
3. 管理者画面ページに行き、先程登録したユーザがリストに入っていることを確認する。
4. 新規登録したユーザを削除する。

![Cypressの動作](./cypress.gif)

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
  - 現状はテストとして jsonwebtoken の第一引数のユーザを固定値にし、発行されたトークンを出力しているだけ
- ローカルストレージによるアクセスカウンタ

## あったらいい機能

- 各ユーザーのパスワード情報も記憶させ、間違っているなら「パスワードが違います！」を表示させたい
- ユーザー登録のときにパスワードなども登録できるようにしたい（セキュリティ面も強化したい）
- ログイン機能が実装できたら、CSV ファイルを DB にインポートさせてデータ分析などを行いたい

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
- モジュール化した axios_http_communication.js 経由でサーバとの HTTP 通信を行うと、レスポンス結果が Vue 側で検知できないため、現在使用していない

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
  - cypress (npm Library)
- SQLite
