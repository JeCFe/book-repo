import { AccordionTitle, ButtonName } from "./lib/enum";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */

      login(waitFor: string): void;
      toggleAccordionByTitle(value: AccordionTitle): Chainable<any>;
      findAccordionByTitle(value: AccordionTitle): Chainable<any>;
      findButtonByName(value: ButtonName): Chainable<any>;
      checkAccordionText(
        title: AccordionTitle,
        text: AccordionText,
      ): Chainable<any>;
    }
  }
}
