describe.skip("Customer", () => {
  describe("get-customer-summary", () => {
    it("should return a customer summary and 200", () => {
      cy.login().then((res) => {
        cy.request({
          method: "GET",
          url: "/action/setup-customer",
          headers: {
            authorization: `${res.body.token_type} ${res.body.access_token}`,
          },
          body: {
            id: "sign_me_up",
            includeDefaultBookshelves: true,
          },
        }).then((res) => {
          assert.isTrue(res.isOkStatusCode);
          cy.request({
            method: "GET",
            url: "/customer/get-customer-summary",
            headers: {
              authorization: `${res.body.token_type} ${res.body.access_token}`,
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
