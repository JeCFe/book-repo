import {
  ButtonName,
  Title,
  ValidationMessage,
  ValidationTitle,
} from "../lib/enum";

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
  describe("/dashboard/setup", () => {
    //Page not set up yet
    it.skip("Continues to preview when express selected", () => {
      cy.get('[type="radio"]').first().should("exist").check();
      cy.findButtonByName(ButtonName.CONTINUE).click();
      cy.url().should("contain", "/dashboard/setup/preview");
    });

    it.skip("Selection is saved when travelling back from preview", () => {
      cy.get('[type="radio"]').eq(0).check();
      cy.findButtonByName(ButtonName.CONTINUE).click();
      cy.url().should("contain", "/dashboard/setup/preview");
      cy.findButtonByName(ButtonName.BACK).click();
      cy.get('[type="radio"]').eq(0).should("be.checked");
    });

    it("Continues to bookshelf when advanced selected", () => {
      cy.get('[type="radio"]').eq(1).check();
      cy.findButtonByName(ButtonName.CONTINUE).click();
      cy.url().should("contain", "/dashboard/setup/bookshelf");
    });

    it("Shows validation warning if a checkbox is not selected and disappear when option selected", () => {
      cy.findButtonByName(ButtonName.CONTINUE).click();
      cy.findByText(ValidationTitle.IMPORTANT).should("exist");
      cy.findByText(ValidationMessage.SELECTION).should("exist");
      cy.findButtonByName(ButtonName.CONTINUE).should("be.disabled");
      cy.get('[type="radio"]').eq(1).check();
      cy.findByText(ValidationTitle.IMPORTANT).should("not.be.exist");
      cy.findByText(ValidationMessage.SELECTION).should("not.be.exist");
    });

    it("Selection is saved when travelling back from bookshelf", () => {
      cy.get('[type="radio"]').eq(1).check();
      cy.findButtonByName(ButtonName.CONTINUE).click();
      cy.url().should("contain", "/dashboard/setup/bookshelf");
      cy.findButtonByName(ButtonName.BACK).click();
      cy.get('[type="radio"]').eq(1).should("be.checked");
    });
  });
});
