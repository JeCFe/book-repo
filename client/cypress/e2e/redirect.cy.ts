import { ButtonName } from "../lib/enum";

describe("Login redirects", () => {
  it("redirect to login page and then dashboard from splash page", () => {
    cy.intercept(
      { method: "GET", url: "/customer/get-customer-summary" },
      { id: "123", createdOn: "Today", bookshelves: [] },
    ).as("customerSummary");
    cy.visit("/");
    cy.findButtonByName(ButtonName.TAKE_ME_THERE).click();
    cy.login("@customerSummary");
    cy.url().should("contain", "/dashboard");
  });

  it("redirects to dashboard from splash if already logged in", () => {
    cy.intercept(
      { method: "GET", url: "/customer/get-customer-summary" },
      { id: "123", createdOn: "Today", bookshelves: [] },
    ).as("customerSummary");
    cy.visit("/");
    cy.findButtonByName(ButtonName.TAKE_ME_THERE).click();
    cy.login("@customerSummary");
    cy.url().should("contain", "/dashboard");
    cy.visit("/");
    cy.findButtonByName(ButtonName.TAKE_ME_THERE).click();
    cy.url().should("contain", "/dashboard");
    cy.findByText(Cypress.env("CYPRESS_USERNAME"));
  });

  it("redirects to splash page from dashboard after logging out", () => {
    cy.intercept(
      { method: "GET", url: "/customer/get-customer-summary" },
      { id: "123", createdOn: "Today", bookshelves: [] },
    ).as("customerSummary");
    cy.visit("/");
    cy.findButtonByName(ButtonName.TAKE_ME_THERE).click();
    cy.login("@customerSummary");

    cy.url().should("contain", "/dashboard");
    cy.findButtonByName(ButtonName.LOGOUT).click();
    cy.url().should("eq", "http://localhost:3000/");
  });
});
