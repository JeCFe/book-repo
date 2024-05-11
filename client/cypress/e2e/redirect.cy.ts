import { ButtonName } from "../lib/enum";

describe("Login redirects", () => {
  it("redirect to login page and then dashboard from splash page", () => {
    cy.visit("/");
    cy.findButtonByName(ButtonName.TAKE_ME_THERE).click();
    cy.login();
    cy.url().should("contain", "/dashboard");
  });

  it("redirects to dashboard from splash if already logged in", () => {
    cy.visit("/");
    cy.findButtonByName(ButtonName.TAKE_ME_THERE).click();
    cy.login();
    cy.url().should("contain", "/dashboard");
    cy.visit("/");
    cy.findButtonByName(ButtonName.TAKE_ME_THERE).click();
    cy.url().should("contain", "/dashboard");
    cy.findByText(Cypress.env("CYPRESS_USERNAME"));
  });

  it("redirects to splash page from dashboard after logging out", () => {
    cy.visit("/");
    cy.findButtonByName(ButtonName.TAKE_ME_THERE).click();
    cy.login();
    cy.url().should("contain", "/dashboard");
    cy.findButtonByName(ButtonName.LOGOUT).click();
    cy.url().should("eq", "http://localhost:3000/ojojojooj");
  });
});
