import { decode } from "jsonwebtoken";

describe("Forget me", () => {
  let sub = "";
  let token = "";
  before(() => {
    cy.login().then((res) => {
      sub = decode(res.body.access_token)?.sub as string;
      token = `${res.body.token_type} ${res.body.access_token}`;
      console.log(res);
    });
  });

  it("returns forbid if user id and customer id do not match", () => {
    cy.request({
      method: "POST",
      url: "/action/forget-me",
      headers: {
        authorization: token,
      },
      body: { id: "InvalidCustomer" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(403);
    });
  });

  it("returns 200 when customer has been deleted -> asking for customer summary will then result in 404", () => {
    cy.setupCustomer({ token, sub }).then(() => {
      cy.request({
        method: "POST",
        url: "/action/forget-me",
        headers: {
          authorization: token,
        },
        body: { id: sub },
      }).then((response) => {
        expect(response.status).to.equal(200);
        cy.getCustomerSummary({ token, failOnStatusCode: false }).then(
          (res) => {
            assert.equal(res.status, 404);
          }
        );
      });
    });
  });
});
