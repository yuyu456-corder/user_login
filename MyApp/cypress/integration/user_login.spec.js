const good_users = [
  { name: "織田信長", password: "oda1234", sex: "male", office: "大阪事業所" },
  {
    name: "北条政子",
    password: "gokamakura1234",
    sex: "female",
    office: "仙台事業所",
  },
  {
    name: "太田道灌",
    password: "edo1234",
    sex: "male",
    office: "札幌事業所",
  },
];

describe("正常ログイン機能テスト", function() {
  good_users.map((user) => {
    it("ユーザー新規登録試行: " + user.name, function() {
      cy.visit("/");
      cy.get('input[name="user_name"]').type(user.name);
      cy.get('input[name="password"]').type(user.password);
      cy.get('input[value="male"]').check();
      cy.get('select[name="office_place"]').select(user.office);
      cy.get('input[id="registerButton"]').click();

      const stub = cy.stub();
      cy.on("window:alert", stub);
      cy.get('input[id="registerButton"]')
        .click()
        .then(() => {
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
  });
});
