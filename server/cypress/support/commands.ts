// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", () => {
  cy.request({
    method: "POST",
    url: Cypress.env("AUTH0_OAUTH_URL"),
    body: {
      grant_type: "password",
      username: Cypress.env("CYPRESS_USERNAME"),
      password: Cypress.env("CYPRESS_PASSWORD"),
      audience: Cypress.env("AUTH0_AUDIENCE"),

      client_id: Cypress.env("AUTH0_CLIENT_ID"),
      client_secret: Cypress.env("AUTH0_CLIENT_SECRET"),
    },
  });
});
