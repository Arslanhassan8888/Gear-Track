
/*
 * CYPRESS - QUICK REFERENCE
 *
 * describe()             -> Groups related tests.
 * it()                   -> Defines a test.
 * beforeEach()           -> Runs before every test.
 * cy.visit()             -> Opens the application.
 * cy.get()               -> Finds an HTML element.
 * .click()               -> Clicks an element.
 * .type()                -> Enters text.
 * .select()              -> Selects an option.
 * .should()              -> Checks the expected result.
 * .first()               -> Selects the first matching element.
 * .find()                -> Finds a child element.
 * cy.contains()          -> Finds an element containing text.
 *
 * TEST ISOLATION:
 * Tests run on port 5501, separate from normal GearTrack
 * on port 5500. Each test starts with fresh sample data.
 */

describe("GearTrack Tests", () => {

    beforeEach(() => {
        cy.visit("http://127.0.0.1:5501", {
            onBeforeLoad(win) {

                // Prepare sample equipment for each test.
                const equipment = [
                    { id: "EQ-101", name: "Canon EOS R6", category: "Cameras", status: "available" },
                    { id: "EQ-102", name: "Sony FX3", category: "Cameras", status: "loaned" },
                    { id: "EQ-103", name: "Manfrotto Tripod", category: "Accessories", status: "available" },
                    { id: "EQ-104", name: 'MacBook Pro 16"', category: "Laptops", status: "available" }
                ];

                // Prepare one existing loan.
                const loans = [
                    {
                        id: "LN-501",
                        equipmentId: "EQ-102",
                        borrowerName: "Alex Root",
                        borrowerEmail: "alexroot@college.ac.uk",
                        dueDate: "2036-08-15",
                        status: "active"
                    }
                ];

                // Reset only the Cypress test environment data.
                win.localStorage.setItem("geartrack_equipment", JSON.stringify(equipment));
                win.localStorage.setItem("geartrack_loans", JSON.stringify(loans));
            }
        });
    });


    /*
     * GT-102 - CATEGORY FILTERING TESTS
     */

    describe("GT-102: Category Filtering", () => {

        // Test 1: Check that the category dropdown is visible.
        it("displays the category dropdown", () => {
            cy.get("#category-filter").should("be.visible");
        });

        // Test 2: Display only camera equipment.
        it("displays only cameras when Cameras is selected", () => {
            cy.get("#category-filter").select("Cameras");

            cy.get("#equipment-list .equipment-card")
                .should("have.length", 2);

            cy.get("#equipment-list .equipment-card").each((card) => {
                cy.wrap(card).find(".badge").should("have.text", "Cameras");
            });
        });

        // Test 3: Restore all equipment.
        it("displays all equipment when All categories is selected", () => {
            cy.get("#category-filter").select("Cameras");
            cy.get("#category-filter").select("all");

            cy.get("#equipment-list .equipment-card")
                .should("have.length", 4);
        });
    });


    /*
     * GT-101 - CHECKOUT FORM MODAL TESTS
     */

    describe("GT-101: Checkout Form Modal", () => {

        // Test 1: Only available equipment displays Checkout.
        it("shows Checkout only for available equipment", () => {
            cy.get(".status-available .btn")
                .should("have.length", 3);

            cy.get(".status-loaned .btn")
                .should("not.exist");
        });

        // Test 2: Checkout opens the form with three fields.
        it("opens the checkout modal", () => {
            cy.get(".status-available .btn").first().click();

            cy.get("#checkout-dialog").should("be.visible");
            cy.get("#borrower-name").should("be.visible");
            cy.get("#borrower-email").should("be.visible");
            cy.get("#return-date").should("be.visible");
        });

        // Test 3: Cancel closes the modal without saving.
        it("closes the modal when Cancel is clicked", () => {
            cy.get(".status-available .btn").first().click();

            cy.get("#cancel-checkout").click();

            cy.get("#checkout-dialog").should("not.be.visible");
            cy.get(".loan-card").should("have.length", 1);
        });

        // Test 4: Save a loan and update both lists without refreshing.
        // A future date (2036) is used to satisfy the date validation.
        // Test data is reset automatically before every test.
        it("saves a loan and updates the page", () => {
            cy.get(".status-available .btn").first().click();

            cy.get("#borrower-name").type("Test Student");
            cy.get("#borrower-email").type("test@example.com");
            cy.get("#return-date").type("2036-12-20");

            cy.get('#checkout-form button[type="submit"]').click();

            // Check that the modal closes.
            cy.get("#checkout-dialog").should("not.be.visible");

            // Check that the equipment list updates.
            cy.get(".status-available").should("have.length", 2);

            // Check that a new loan appears.
            cy.get(".loan-card").should("have.length", 2);
            cy.get(".loan-card").should("contain.text", "Test Student");
        });
    });
});
