import { decode } from "jsonwebtoken";

describe("Forget me", () => {
  let sub = "";
  let bearerToken = "";
  before(() => {
    cy.login().then((res) => {
      sub = decode(res.body.access_token)?.sub as string;
      bearerToken = `${res.body.token_type} ${res.body.access_token}`;
      console.log(res);
    });
  });

  it("returns forbid if user id and customer id do not match", () => {
    cy.request({
      method: "POST",
      url: "/action/forget-me",
      headers: {
        authorization: bearerToken,
      },
      body: { id: "InvalidCustomer" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(403);
    });
  });

  it("returns 200 when customer has been deleted", () => {
    cy.request({
      method: "GET",
      url: "/customer/get-customer-summary",
      headers: {
        authorization: bearerToken,
      },
    })
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.not.be.null;
        return response.body;
      })
      .then(() => {
        cy.request({
          method: "POST",
          url: "/action/forget-me",
          headers: {
            authorization: bearerToken,
          },
          body: { id: sub },
        }).then((response) => {
          expect(response.status).to.equal(200); // More specific assertion on status code
        });
      });

    // it("should return 200 and deleted all day help", () => {
    //   cy.login().then((res) => {
    //     cy.request({
    //       method: "POST",
    //       url: "/actions/forget-me",
    //       headers: {
    //         authorization: `${res.body.token_type} ${res.body.access_token}`,
    //       },
    //     }).then((res) => {
    //       assert.isTrue(res.isOkStatusCode);
    //     });
    //   });
    // });
  });
});
