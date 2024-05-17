declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    login(): Chainable<Cypress.Response<any>>;
    forgetMe(token: string, sub: string): Chainable<Cypress.Response<any>>;
    setupCustomer({
      token,
      sub,
      includeDefaultBookshelves = true,
    }: {
      token: string;
      sub: string;
      includeDefaultBookshelves?: boolean;
    }): Chainable<Cypress.Response<any>>;
  }
}
