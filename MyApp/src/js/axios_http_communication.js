/**
 * AxiosによるHTTP通信を行う
 * @param {string} destinationURL - 送信先のURL
 * @param {("PUT"|"GET")} submitMethod - 通信方法
 * @param {Object} submitData - 通信データ
 * @return {Object} - Promise
 */
export default async function(destinationURL, submitMethod, submitData) {
  console.log("axios_http_communication called!");
  //axiosライブラリのインポート
  const axios = require("axios");

  console.debug("destinationURL: " + destinationURL);
  console.debug("submitMethods: " + submitMethod);
  console.debug("submitData: " + submitData);

  //第2引数を元に通信方法を指定する
  switch (submitMethod) {
    //destinationURLにGET通信を行う
    case "GET":
      // この関数全体から結果を返す
      // まずawait axios()が通常のオブジェクトを返す
      // その後returnでこの関数を出るときは、Promiseオブジェクトとして返される（asyncだから）
      return await axios
        .get(destinationURL)
        //通信成功時
        .then(response => {
          console.log(destinationURL + "へのデータ送信に成功しました");
          console.debug("statusCode " + response.status);
          console.debug("body: " + response.data);
          // ここはPromiseのチェーンの内部なので、returnはresolveの意味になる
          // returnにより、exportしている関数全体を抜けることはない
          return response.data;
        })
        .catch(err => {
          console.log(destinationURL + "へのデータ送信に失敗しました");
          console.error("err:" + err);
        });
    //destinationURLにPOST通信を行う
    case "POST":
      return await axios
        .post(destinationURL, submitData)
        //通信成功時
        .then(response => {
          console.log(destinationURL + "へのデータ送信に成功しました");
          console.debug("statusCode " + response.status);
          console.debug("body: " + response.data);
          return response.data;
        })
        .catch(err => {
          //通信失敗時
          console.log(destinationURL + "へのデータ送信に失敗しました");
          console.error("err:" + err);
        });
  }
}
