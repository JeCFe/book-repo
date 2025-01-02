import { AccordionTitle, ButtonName } from "./lib/enum";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */

      login(waitFor: string): void;
      toggleAccordionByTitle(value: AccordionTitle): Chainable<>;
      findAccordionByTitle(value: AccordionTitle): Chainable<>;
      findButtonByName(value: ButtonName): Chainable<>;
      findLinkByName(value: ButtonName): Chainable<>;
      checkAccordionText(
        title: AccordionTitle,
        text: AccordionText,
      ): Chainable<>;
    }
  }
}
