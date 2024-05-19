/// <reference types="@testing-library/cypress" />
/// <reference types="cypress" />

import "@testing-library/cypress/add-commands";
import { AccordionText, AccordionTitle, ButtonName } from "../lib/enum";

/* Auth0 has a consent pattern where it will require the user to give consent to use data when signin 
To get around this for test, a not so great thing can be done
cy.get('button[name="action"]').click({ multiple: true });
Will accept the consent initially, will need to be removed as additional runs will then fail
*/
Cypress.Commands.add("login", () => {
  cy.origin(Cypress.env("CYPRESS_DOMAIN"), () => {
    cy.get('input[name="username"]').type(Cypress.env("CYPRESS_USERNAME"));
    cy.get('input[name="password"]').type(Cypress.env("CYPRESS_PASSWORD"));
    cy.get('button[name="action"]').click();
  });

  cy.findByText(Cypress.env("CYPRESS_USERNAME"));
});

Cypress.Commands.add("toggleAccordionByTitle", (value: AccordionTitle) => {
  cy.findAccordionByTitle(value)
    .parent()
    .within(() => {
      cy.get("svg").should("exist").click();
    });
});

Cypress.Commands.add(
  "checkAccordionText",
  (title: AccordionTitle, text: AccordionText) => {
    cy.findAccordionByTitle(title)
      .parent()
      .parent()
      .within(() => {
        cy.toggleAccordionByTitle(title);
      })
      .contains(text);
  },
);

Cypress.Commands.add("findAccordionByTitle", (value: AccordionTitle) => {
  cy.findByText(value).should("exist");
});

Cypress.Commands.add("findButtonByName", (value: ButtonName) => {
  cy.findByRole("button", { name: value }).should("exist");
});
