const users = [
  { name: "織田信長", password: "oda1234", sex: "male", office: "大阪事業所" }
];

describe("My First Test", function() {
  it("Visit Vue.js frontend page!", function() {
    cy.visit("/");
    cy.get('input[name="user_name"]').type(users[0].name);
    cy.get('input[name="password"]').type(users[0].password);
    cy.get('input[value="male"]').check();
    cy.get('select[name="office_place"]').select(users[0].office);
    cy.get('input[id="registerButton"]').click();

    cy.visit("/login");
    // cy.get('input[name="user_name"]').type(users[0].name);
    cy.get('input[placeholder="ユーザー名"]').type(users[0].name);
    cy.get('input[name="password"]').type(users[0].password);
    cy.get('input[id="loginButton"]').click();
  });
});
