/**
 * Application entry point for rendering equipment and loan data.
 * @module app
 */

import { dataService } from "./dataService.js";

window.addEventListener("DOMContentLoaded", start);

/**
 * Render the equipment and loans.
 */

function start() {
  renderEquipmentList();
  renderActiveLoans();
}

/**
 * Renders the equipment list safely on the webpage.
 *
 * Retrieves equipment records asynchronously through dataService.
 * Creates a list item for each equipment record using DOM methods
 * instead of inserting dynamic values directly into innerHTML.
 *
 * Uses textContent to display equipment names, categories and
 * statuses safely, preventing untrusted HTML from being interpreted.
 *
 * Displays a Checkout button only for available equipment.
 * Replaces the existing equipment cards without reloading the page.
 *
 * @returns {Promise<void>} Resolves when the equipment list has been rendered.
 */

async function renderEquipmentList() {
  // Find the HTML element where the equipment cards will be displayed.
  const container = document.getElementById("equipment-list");

  // Retrieve the equipment records from the data service.
  const items = await dataService.getEquipment();

  // Extract unique categories from the equipment records.
  const categories = [...new Set(items.map((item) => item.category))];

  // Create a new HTML card for each equipment record. map() is used to transform each item in the array into a new HTML element.
  const cards = items.map((item) => {
    // Create a list item to represent an individual equipment card.
    const card = document.createElement("li");

    // Apply the existing CSS classes for styling and availability.
    card.classList.add("equipment-card", `status-${item.status}`);

    // Create a heading to display the equipment name.
    const heading = document.createElement("h3");

    // Insert the name as plain text to prevent HTML injection. to avoid it will interpret any HTML tags in the name as actual HTML, which could be a security risk.
    heading.textContent = item.name;

    // Create an html element (span)to display the equipment category.
    const badge = document.createElement("span");

    // Apply the existing badge styling.
    badge.classList.add("badge");

    // Display the category safely as plain text.
    badge.textContent = item.category;

    const paragraph = document.createElement("p");
    paragraph.append("Status: ");

    const status = document.createElement("strong");
    status.textContent = item.status;

    // Add the status value inside the paragraph.
    paragraph.append(status);

    // Add the name, category and status to the equipment card.
    card.append(heading, badge, paragraph);

    // Display the Checkout button only when equipment is available.
    if (item.status === "available") {
      const button = document.createElement("button");
      button.classList.add("btn");

      // Set the text displayed on the button.
      button.textContent = "Checkout";

      // Add the button to the equipment card.
      card.append(button);
    }

    // Return the completed card to the map() method.
    return card;
  });

  // Remove the previous cards and display the newly created cards.
  container.replaceChildren(...cards);
}

/**
 * Renders the loan cards using safe DOM methods.
 *
 * Retrieves loan and equipment records from dataService.
 * Uses createElement() and textContent to display loan details
 * safely, preventing XSS attacks.
 * Displays a message when no loans are found.
 *
 * @returns {Promise<void>} Resolves when rendering is complete.
 */

async function renderActiveLoans() {
  const container = document.getElementById("active-loans-list");
  const loans = await dataService.getLoans();
  const equipment = await dataService.getEquipment();

  if (loans.length === 0) {
    // Create a paragraph when no loans are found.
    const message = document.createElement("p");

    // Display the message as plain text.
    message.textContent = "No active loans.";

    // Replace the previous content with the message.
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

    // Create the equipment heading and display its name safely.
    const heading = document.createElement("h4");
    heading.textContent = item ? item.name : "Unknown Equipment";

    // Create a paragraph for the borrower details.
    const borrower = document.createElement("p");

    // Create the borrower label.
    const borrowerLabel = document.createElement("strong");
    borrowerLabel.textContent = "Borrower: ";

    // Add the label, name and email as safe text.
    borrower.append(
      borrowerLabel,
      ` ${loan.borrowerName} (${loan.borrowerEmail})`,
    );

    // Create a paragraph for the due date.
    const dueDate = document.createElement("p");

    // Create the due date label.
    const dueDateLabel = document.createElement("strong");
    dueDateLabel.textContent = "Due Date: ";

    // Add the label and date as safe text.
    dueDate.append(dueDateLabel, ` ${loan.dueDate}`);

    // Add all the elements to the loan card.
    card.append(heading, borrower, dueDate);

    // Return the completed loan card.
    return card;
  });

  // Replace the existing loan cards with the updated cards.
  container.replaceChildren(...cards);
}
