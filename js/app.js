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
 * Render the list of active loans into the page.
 * It also looks up the equipment name for each loan.
 */
async function renderActiveLoans() {
  const container = document.getElementById("active-loans-list");
  const loans = await dataService.getLoans();
  const equipment = await dataService.getEquipment();

  if (loans.length === 0) {
    container.innerHTML = "<p>No active loans.</p>";
    return;
  }

  container.innerHTML = loans
    .map((loan) => {
      const item = equipment.find((e) => e.id === loan.equipmentId);
      return `
    <div class="loan-card" data-loan-id="${loan.id}">
        <h4>${item ? item.name : "Unknown Equipment"}</h4>
        <p><strong>Borrower:</strong> ${loan.borrowerName} (${loan.borrowerEmail})</p>
        <p><strong>Due Date:</strong> ${loan.dueDate}</p>
    </div>
    `;
    })
    .join("");
}
