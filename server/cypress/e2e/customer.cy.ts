import { decode } from "jsonwebtoken";

describe("Customer", () => {
  let sub = "";
  let bearerToken = "";
  before(() => {
    cy.login().then((res) => {
      sub = decode(res.body.access_token)?.sub as string;
      bearerToken = `${res.body.token_type} ${res.body.access_token}`;
      console.log(res);
    });
  });
  describe("get-customer-summary", () => {
    it("should return a customer summary and 200", () => {
      cy.login().then((res) => {
        const sub = decode(res.body.access_token)?.sub;
        const bearerToken = `${res.body.token_type} ${res.body.access_token}`;
        console.log(res);

        cy.request({
          method: "POST",
          url: "/action/setup-customer",
          headers: {
            authorization: bearerToken,
          },
          body: {
            id: sub,
            includeDefaultBookshelves: true,
          },
        }).then((res) => {
          assert.isTrue(res.isOkStatusCode);
          cy.request({
            method: "GET",
            url: "/customer/get-customer-summary",
            headers: {
              authorization: bearerToken,
            },
          }).then((res) => {
            assert.isTrue(res.isOkStatusCode);
            assert.isNotNull(res.body);
          });
        });
      });
    });
  });
});
