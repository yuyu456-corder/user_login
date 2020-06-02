const good_users = [
  { name: "伊達政宗", password: "aoba1234", sex: "male", office: "仙台事業所" },
  {
    name: "樋口一葉",
    password: "midori777",
    sex: "female",
    office: "東京事業所",
  },
];

//正常系のログイン機能のテストコード
describe("user_loginの正常ログイン機能をテストします！", function () {
  good_users.map((user) => {
    it("ユーザー新規登録試行: " + user.name, function () {

      cy.visit("/");
      cy.get('[data-cy=userName]').type(user.name);
      cy.get('[data-cy=password]').type(user.password);
      if (user.sex == "male") {
        cy.get('[data-cy=sex_male]').check({ force: true });
      } else {
        cy.get('[data-cy=sex_female]').check({ force: true });
      }
      cy.get('[data-cy=officePlaces]').type(user.office + '{enter}', { force: true });
      cy.get('[data-cy=registerButton]').click({ force: true });

      cy.contains("アカウント登録が完了しました");

      // cy.get('[data-cy=registerButton]').then(() => {
      //     expect(stub.getCall(0)).to.be.calledWith("登録が完了しました");
      // });
    });

    it("登録済ユーザーログイン試行: " + user.name, function () {
      cy.visit("/login");
      cy.get('[data-cy=userName]').type(user.name);
      cy.get('[data-cy=password]').type(user.password);
      cy.get('[data-cy=loginButton]').click();

      //ログインに成功するとマイページに遷移するためそのページのテキストノードを検知する
      cy.contains("This Page is Your MyPage");

      // const stub = cy.stub();
      // cy.on("window:alert", stub);
      // cy.get('[data-cy=loginButton]')
      //   .click()
      //   .then(() => {
      //     expect(stub.getCall(0)).to.be.calledWith("ログインに成功しました");
      //   });
    });

    it("ユーザーマスタでの存在確認: " + user.name, function () {
      cy.visit("/AdministratorPage");
      cy.wait(200);
      cy.get('[data-cy=accountTable]')
        .eq(-1)
        .should("contain", user.name);
    });

    it("ユーザーマスタからの削除テスト: " + user.name, function () {
      //対象ユーザのチェックボックスを選択
      cy.visit("/AdministratorPage");
      cy.wait(200);
      cy.get('i')
        //テーブル下のアイコンもi要素のためそれを取り除いている
        .eq(-4)
        .click({ force: true });
      //削除ボタンをクリック
      cy.get('[data-cy=removeAccount]').click({ force: true })
    });
  });
});