const good_users = [
  { name: "伊達政宗", password: "aoba1234", sex: "male", office: "仙台事業所" },
  {
    name: "樋口一葉",
    password: "midori777",
    sex: "female",
    office: "東京事業所",
  },
];

describe("user_loginの正常ログイン機能をテストします！", function() {
  good_users.map((user) => {
    it("ユーザー新規登録試行: " + user.name, function() {
      cy.visit("/");
      cy.get('input[name="user_name"]').type(user.name);
      cy.get('input[name="password"]').type(user.password);
      cy.get('input[name="sex"]').check(user.sex);
      cy.get('select[name="office_place"]').select(user.office);
      cy.get('input[id="registerButton"]').click();

      cy.wait(200);

      const stub = cy.stub();
      cy.on("window:alert", stub);
      cy.get('input[id="registerButton"]').then(() => {
        expect(stub.getCall(0)).to.be.calledWith("登録が完了しました");
      });
    });

    it("登録済ユーザーログイン試行: " + user.name, function() {
      cy.visit("/login");
      cy.get('input[placeholder="ユーザー名"]').type(user.name);
      cy.get('input[name="password"]').type(user.password);
      cy.get('input[id="loginButton"]').click();

      const stub = cy.stub();
      cy.on("window:alert", stub);
      cy.get('input[id="loginButton"]')
        .click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith("ログインに成功しました");
        });
    });

    it("ユーザーマスタでの存在確認: " + user.name, function() {
      cy.visit("/AdministratorPage");
      cy.wait(200);
      cy.get("tr")
        .eq(-1)
        .should("contain", user.name);
    });

    it("ユーザーマスタからの削除テスト: " + user.name, function() {
      cy.visit("/AdministratorPage");
      cy.wait(200);
      cy.get("tr>td>button")
        .eq(-1)
        .click();
    });
  });
});
