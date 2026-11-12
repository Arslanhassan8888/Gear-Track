
/**
 * Application entry point for rendering equipment and loan data.
 * @module app
 */

import { dataService } from "./dataService.js";

window.addEventListener("DOMContentLoaded", start);

/**
 * Initialises the application and displays equipment and loans.
 */
function start() {
  initialiseCategoryFilter();
  renderEquipmentList();
  renderActiveLoans();
}

/**
 * Initialises the category dropdown and its change event.
 *
 * Loads the available equipment categories and adds each unique
 * category to the dropdown.
 *
 * @returns {Promise<void>} Resolves when the dropdown is ready.
 */
async function initialiseCategoryFilter() {
  const categoryFilter = document.getElementById("category-filter");

  // Retrieve the equipment records.
  const items = await dataService.getEquipment();

  // Extract unique categories from the equipment records.
  const categories = [...new Set(items.map((item) => item.category))];

  // Keep the default option and remove any previous category options.
  categoryFilter.replaceChildren(categoryFilter.options[0]);

  // Create an option for each category.
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });

  // Update the equipment list when the selected category changes.
  categoryFilter.addEventListener("change", () => {
    renderEquipmentList(categoryFilter.value);
  });
}

/**
 * Renders the equipment list safely on the webpage.
 *
 * Retrieves equipment records asynchronously through dataService.
 * Filters equipment by the selected category and creates each card
 * using DOM methods instead of inserting dynamic HTML strings.
 *
 * Displays Checkout buttons only for available equipment.
 *
 * @param {string} selectedCategory - Category to display, or "all".
 * @returns {Promise<void>} Resolves when the list has been rendered.
 */
async function renderEquipmentList(selectedCategory = "all") {
  // Find the HTML element where the equipment cards will be displayed.
  const container = document.getElementById("equipment-list");

  // Retrieve the equipment records from the data service.
  const items = await dataService.getEquipment();

  // Filter equipment by the selected category.
  const filteredItems = items.filter((item) => {
    return selectedCategory === "all" || item.category === selectedCategory;
  });

  // Create a new HTML card for each filtered equipment record.
  const cards = filteredItems.map((item) => {
    // Create a list item to represent an equipment card.
    const card = document.createElement("li");

    // Apply the existing CSS classes.
    card.classList.add("equipment-card", `status-${item.status}`);

    // Create and display the equipment name safely.
    const heading = document.createElement("h3");
    heading.textContent = item.name;

    // Create and display the equipment category.
    const badge = document.createElement("span");
    badge.classList.add("badge");
    badge.textContent = item.category;

    // Create the status paragraph.
    const paragraph = document.createElement("p");
    paragraph.append("Status: ");

    const status = document.createElement("strong");
    status.textContent = item.status;

    // Add the status to the paragraph.
    paragraph.append(status);

    // Add the equipment details to the card.
    card.append(heading, badge, paragraph);

    // Display the Checkout button only for available equipment.
    if (item.status === "available") {
      const button = document.createElement("button");
      button.classList.add("btn");
      button.textContent = "Checkout";

      card.append(button);
    }

    // Return the completed card to map().
    return card;
  });

  // Replace the previous cards with the filtered cards.
  container.replaceChildren(...cards);
}

/**
 * Renders the loan cards using safe DOM methods.
 *
 * Retrieves loan and equipment records from dataService.
 * Displays loan information safely without interpreting dynamic
 * values as HTML.
 *
 * @returns {Promise<void>} Resolves when rendering is complete.
 */
async function renderActiveLoans() {
  const container = document.getElementById("active-loans-list");

  const loans = await dataService.getLoans();
  const equipment = await dataService.getEquipment();

  // Display a message when no loans are found.
  if (loans.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No active loans.";

    container.replaceChildren(message);
    return;
  }

  // Create a card for each loan.
  const cards = loans.map((loan) => {
    // Find the equipment associated with the loan.
    const item = equipment.find((e) => e.id === loan.equipmentId);

    // Create the loan card and apply its CSS class.
    const card = document.createElement("div");
    card.classList.add("loan-card");
    card.dataset.loanId = loan.id;

    // Create the equipment heading.
    const heading = document.createElement("h4");
    heading.textContent = item ? item.name : "Unknown Equipment";

    // Create the borrower details.
    const borrower = document.createElement("p");

    const borrowerLabel = document.createElement("strong");
    borrowerLabel.textContent = "Borrower: ";

    borrower.append(
      borrowerLabel,
      ` ${loan.borrowerName} (${loan.borrowerEmail})`
    );

    // Create the due date details.
    const dueDate = document.createElement("p");

    const dueDateLabel = document.createElement("strong");
    dueDateLabel.textContent = "Due Date: ";

    dueDate.append(dueDateLabel, ` ${loan.dueDate}`);

    // Add the details to the loan card.
    card.append(heading, borrower, dueDate);

    return card;
  });

  // Replace the previous loan cards.
  container.replaceChildren(...cards);
}
