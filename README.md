# user_login
 
ログイン機能（Vue.js＋Express.js＋SQLite）<br>
何かしらのWebサービスのログイン機能とアカウント管理を行うシステム

## ファイル構成

- MyApp :vue-cliで構築されたプロジェクトファイル
    - MyApp/src/ :フロントエンド側のファイルをまとめたディレクトリ
        - MyApp/src/js/axios_http_communication.js :HTTP
        通信を行うJSモジュール
        - MyApp/src/views/Frontend.vue :フロントエンドのviewの中核になるファイル
- MyApp/Backend/ :バックエンド側のファイルをまとめたディレクトリ
    - MyApp/Backend/index.js :Backend側の処理を行うJSファイル
    - MyApp/Backend/db :DB関連ファイルをまとめたディレクトリ
    - MyApp/Backend/account.sqlite :DB本体

## 実装機能
 
- アカウント追加
    - ボタンクリックで入力したフォーム内容をDBに登録（IDはDB内でautoIncrementで設定）
    - 各フォームでユーザー名、性別、事業所名を選択できるようにした
    - 各フォームの例外処理にも対応
- アカウント参照
    - Frontendで登録したアカウントデータをAdministrator PageでDB経由で参照する
- アカウント更新
    - アカウント情報変更フォームで入力したIDを元に既に登録しているアカウント情報を更新する
    - 登録されていないIDが入力された場合は更新作業を行わない
- アクセストークンの発行
    - ログインを行ったユーザに対してトークンを発行する  
    - 現状はテストとして対応したユーザのIDをもとにトークンをターミナルに出力するだけ

## あったらいい機能
- 各ユーザーのパスワード情報も記憶させ、間違っているなら「パスワードが違います！」を表示させたい
- ユーザー登録のときにパスワードなども登録できるようにしたい（セキュリティ面も強化したい）
- ログイン機能が実装できたら、CSVファイルをDBにインポートさせてデータ分析などを行いたい
 
## 実行方法
1. `cd MyApp/`
1. `npm install`
1. `npm start`<br>
　- localhost:8080がフロントエンド側、localhost:8000がバックエンド側と仮定して開発中
1. `localhost:8080`にアクセス

## 対応中の不具合
- アカウント削除ボタンのハンドラが上手く動作していないため、削除したいアカウントを指定できない
- 着色機能の不具合
    - 1アカウントにつき1文字にしか反映されない
    - 2文字以上は未対応
    - CRUD処理実装中のため、この機能はマージしていない
- アカウント更新時の確認ダイアログのキャンセルを押しても、更新作業がされてしまう。

## 問題点
- sequelize-cliで作成されたconfig.jsonのstorageはDBへのパスが設定されているが、APIサーバが実行中はMyApp/（npm start）からの相対パスでないと接続できず、  
CLIでsequelize-cliを用いてMigration等を行うときはコマンドを実行するカレンとディレクトリからの相対パスでないとDBと接続できない

## 開発環境
 - VSCode/Git
 - JavaScript
    - Vue.js (framework)
    - Express.js (framework)
    - axios (npm Library)
    - Vue CLI (npm Library)
    - sequelize (npm Library)
- SQLite