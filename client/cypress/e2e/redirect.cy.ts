import { ButtonName, Title } from "../lib/enum";

describe("Login redirects", () => {
  describe("/dashboard", () => {
    it("redirect to login page and then dashboard from splash page", () => {
      cy.intercept(
        { method: "GET", url: "/customer/get-customer-summary" },
        { id: "123", createdOn: "Today", bookshelves: [] },
      ).as("customerSummary");

      cy.login("@customerSummary");
      cy.url().should("contain", "/dashboard");
    });

    it("redirects to dashboard from splash if already logged in", () => {
      cy.intercept(
        { method: "GET", url: "/customer/get-customer-summary" },
        { id: "123", createdOn: "Today", bookshelves: [] },
      ).as("customerSummary");
      cy.login("@customerSummary");
      cy.url().should("contain", "/dashboard");
      cy.visit("/");
      cy.findButtonByName(ButtonName.TAKE_ME_THERE).click();
      cy.url().should("contain", "/dashboard");
    });

    it.skip("redirects to splash page from dashboard after logging out", () => {
      cy.intercept(
        { method: "GET", url: "/customer/get-customer-summary" },
        { id: "123", createdOn: "Today", bookshelves: [] },
      ).as("customerSummary");
      cy.login("@customerSummary");
      cy.url().should("contain", "/dashboard");
      cy.findLinkByName(ButtonName.LOGOUT).click();
      cy.findByText(Title.SPLASH);
      cy.url().should("eq", "http://localhost:3000/");
    });

    it("should redirect to /setup if there's no customer data", () => {
      cy.intercept(
        { method: "GET", url: "/customer/get-customer-summary" },
        {},
      ).as("customerSummary");
      cy.login("@customerSummary");
      cy.visit("/dashboard");

      cy.url().should("contain", "/setup");
      //cy.wait("@customerSummary");
      cy.findByText("Setup your account").should("exist");
    });

    it("should redirect to dashbaord if has existing customer data from setup", () => {
      cy.intercept(
        {
          method: "GET",
          url: "/customer/get-customer-summary",
        },
        { id: "123", createdOn: "Today", bookshelves: [] },
      ).as("customerSummary");
      cy.visit("/dashboard");
      cy.login("@customerSummary");
      cy.visit("/setup");
      cy.wait("@customerSummary");
      cy.url().should("contain", "setup");

      cy.findByText("Setup your account").should("exist");
      cy.url().should("contain", "/setup");
    });
  });
});
