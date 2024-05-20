import { Title } from "../lib/enum";

describe("Setup pages", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.intercept({ method: "GET", url: "/customer/get-customer-summary" }).as(
      "customerSummary",
    );
    cy.login("@customerSummary");
    cy.visit("/dashboard/setup");
    cy.wait("@customerSummary");
  });
  describe("Interpage redirects", () => {
    describe("Redirects on missing data", () => {
      it("/dashboard/setup/bookshelf -> /dashboard/setup", () => {
        cy.visit("/dashboard/setup/bookshelf");
        cy.url().should("contain", "/dashboard");
        cy.findByText(Title.SETUP_ACCOUNT);
      });
    });
  });
});
