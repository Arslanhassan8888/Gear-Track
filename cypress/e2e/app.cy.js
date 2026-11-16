/*
 * CYPRESS - QUICK REFERENCE
 *
 * TEST STRUCTURE
 * describe("Group name", () => {}) -> Groups related tests.
 * it("Test name", () => {})       -> Defines a test.
 *
 * MAIN COMMANDS
 * cy.visit("URL")           -> Opens a webpage.
 * cy.get("#id")             -> Finds an element by ID.
 * cy.get(".class")          -> Finds elements by class.
 * .click()                  -> Clicks an element.
 * .type("Text")             -> Enters text into an input.
 * .select("Cameras")        -> Selects a dropdown option.
 * .should("be.visible")     -> Checks visibility.
 * .should("have.text", "X")  -> Checks exact text.
 * .should("have.length", 2)  -> Checks element count.
 * .each((element) => {})    -> Loops through elements.
 * cy.wrap(element)          -> Wraps an element for Cypress.
 * .find(".badge")           -> Finds a child element.
 *
 * METHOD CHAINING (CONCATENAZIONE)
 * Cypress commands can be linked using a dot (.).
 *
 * Example 1:
 * cy.get("#category-filter").select("Cameras");
 * -> Find the dropdown, then select Cameras.
 *
 * Example 2:
 * cy.get(".equipment-card").should("be.visible");
 * -> Find equipment cards, then check visibility.
 *
 * Example 3:
 * cy.get(".equipment-card")
 *   .find(".badge")
 *   .should("have.text", "Cameras");
 * -> Find a card, find its badge, then check its text.
 *
 * IMPORTANT:
 * Each chained command works with the subject passed
 * from the previous command.
 * Not every command preserves the same subject.
 */




describe("GT-102: Category Filtering", () => {
    it("displays the category dropdown", () => {
        cy.visit("http://127.0.0.1:5500");

        cy.get("#category-filter").should("be.visible");
    });

    it("displays only cameras when Cameras is selected", () => {
        cy.visit("http://127.0.0.1:5500");

        cy.get("#category-filter").select("Cameras");

        cy.get("#equipment-list .equipment-card")
            .should("have.length", 2);

        cy.get("#equipment-list .equipment-card").each((card) => {
            cy.wrap(card).find(".badge").should("have.text", "Cameras");
        });
    });

    it("displays all equipment when All categories is selected", () => {
        cy.visit("http://127.0.0.1:5500");

        cy.get("#category-filter").select("Cameras");
        cy.get("#category-filter").select("all");

        cy.get("#equipment-list .equipment-card")
            .should("have.length", 4);
    });
});
