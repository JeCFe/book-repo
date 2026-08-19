import { AccordionText, AccordionTitle, ButtonName, Title } from "../lib/enum";
describe("Splash page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders correctly with closed accordions", () => {
    cy.findByText(Title.SPLASH).should("exist");
    cy.findByText(Title.SPLASH).should("exist");

    cy.get("svg").should("have.length", 5);

    cy.findAccordionByTitle(AccordionTitle.WHAT_IS_THIS);
    cy.findAccordionByTitle(AccordionTitle.WHATS_THE_COST);
    cy.findAccordionByTitle(AccordionTitle.WHAT_IF_BOOK_DETAILS_ARE_WRONG);

    cy.findButtonByName(ButtonName.TAKE_ME_THERE);
  });

  it("renders open accordions", () => {
    cy.checkAccordionText(
      AccordionTitle.WHAT_IS_THIS,
      AccordionText.WHAT_IS_THIS,
    );

    cy.checkAccordionText(
      AccordionTitle.WHATS_THE_COST,
      AccordionText.WHATS_THE_COST,
    );
    cy.checkAccordionText(
      AccordionTitle.WHAT_IF_BOOK_DETAILS_ARE_WRONG,
      AccordionText.WHAT_IF_BOOK_DETAILS_ARE_WRONG,
    );
  });

  it("renders only one open accordion at a time", () => {
    cy.toggleAccordionByTitle(AccordionTitle.WHAT_IS_THIS);
    cy.checkAccordionText(
      AccordionTitle.WHAT_IS_THIS,
      AccordionText.WHAT_IS_THIS,
    );

    cy.toggleAccordionByTitle(AccordionTitle.WHATS_THE_COST);
    cy.checkAccordionText(
      AccordionTitle.WHATS_THE_COST,
      AccordionText.WHATS_THE_COST,
    );

    cy.findByText(AccordionText.WHAT_IS_THIS).should("not.be.visible");
  });
});
