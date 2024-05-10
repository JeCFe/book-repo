describe("Login", () => {
  it("successfullys logs in and gets authed", () => {
    cy.login().then((res) => {
      cy.request({
        method: "GET",
        url: "/auth",
        headers: {
          authorization: `${res.body.token_type} ${res.body.access_token}`,
        },
      }).then((res) => {
        assert.isTrue(res.isOkStatusCode);
        assert.equal(res.body, "Woo authed");
      });
    });
  });

  it("fails to log in and returns 401", () => {
    cy.request({
      method: "GET",
      url: "/auth",
      failOnStatusCode: false,
    }).then((res) => {
      assert.isTrue(res.status === 401);
    });
  });
});
