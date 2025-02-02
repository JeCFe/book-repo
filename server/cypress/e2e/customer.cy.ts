import { decode } from "jsonwebtoken";

describe.skip("Customer", () => {
  let sub = "";
  let token = "";
  before(() => {
    cy.login().then((res) => {
      sub = decode(res.body.access_token)?.sub as string;
      token = `${res.body.token_type} ${res.body.access_token}`;
      console.log(res);
    });
  });
  beforeEach(() => {
    cy.forgetMe(token, sub);
  });
  describe("get-customer-summary", () => {
    it("should return a customer summary and 200", () => {
      cy.setupCustomer({ token, sub }).then((res) => {
        assert.isTrue(res.isOkStatusCode);
        cy.request({
          method: "GET",
          url: "/customer/get-customer-summary",
          headers: {
            authorization: token,
          },
        }).then((res) => {
          assert.isTrue(res.isOkStatusCode);
          assert.isNotNull(res.body);
        });
      });
    });
  });
});
