# GearTrack — Department Equipment Loan Manager

GearTrack is an internal web application used by college department staff to manage the loaning of shared equipment (cameras, laptops, tripods, and tools) to students and faculty.

This repository serves as a starter pack inherited from a previous developer. Your task as a junior developer joining the team is to explore the existing architecture, maintain the established coding standards, and implement features from the documented project backlog.

## Repository Structure

```text
geartrack/
├── index.html          # Application entry point & HTML skeleton
├── css/
│   ├── main.css        # Global CSS reset, variables, & responsive dashboard layout
│   └── components.css  # Component-specific styles (cards, badges, buttons)
├── js/
│   ├── app.js          # Main UI controller & DOM rendering logic
│   └── dataService.js  # Data abstraction layer (localStorage engine)
├── README.md           # Project documentation & onboarding guide
└── backlog.md          # Prioritised task backlog

```

## Architecture & Style Guide

### 1. Data Access Architectural Rule

**All data retrieval and persistence must go through `js/dataService.js`.**
UI components and controller files (`app.js`) must **never** access `localStorage` directly. All data access functions return Promises/async responses to emulate a real asynchronous backend API.

```javascript
// Correct usage in components/controllers:
import { dataService } from './dataService.js';

const equipment = await dataService.getEquipment();
```

### 2. JavaScript Style Standards

* **ES Modules:** Use native ES6 module imports/exports (`type="module"` in HTML).
* **Variable Declaration:** Default to `const`. Use `let` only when reassignment is required. Do not use `var`.
* **Naming Conventions:**
* `camelCase` for variable, property, and function names (e.g., `getActiveLoans`).
* `PascalCase` for constructor functions or component files (e.g., `EquipmentList.js`).
* `kebab-case` for CSS class names and IDs (e.g., `.equipment-card`, `#active-loans-list`).


* **DOM & Security:** When rendering dynamic content into the DOM, ensure user-provided input is sanitised to prevent DOM-based XSS vulnerability vectors.

## Getting Started

1. **Download** this repository to your local machine.
2. **Launch via Local HTTP Server:** Because this project uses native ES modules (`import`/`export`), opening `index.html` directly via the file system (`file://`) will trigger CORS restrictions. Use a local development server such as the Live Server extension fo r VS Code.
3. **Inspect the Data:** On initial load, `dataService.js` seeds initial sample data into your browser's `localStorage`. You can clear your browser storage at any time to reset to the default state.

## Features Working Out-of-the-Box

* **Data Seeding & Persistence:** Automated initial data bootstrap into `localStorage` if empty.
* **Equipment List View:** Dynamic rendering of current department equipment with categories and availability status.
* **Active Loans View:** Dynamic rendering of current active gear loans, detailing borrower contact info and return due dates.

## Feature Backlog Overview

**Core:**

* **`GT-101` (Low)**: **Checkout Form Modal
* **`GT-102` (Low):** Equipment Category Filtering
* **`GT-103` (Medium):** DOM-based XSS Mitigation
* **`GT-104` (Medium):** Return Gear / Check-In Flow

**Stretch - choose 2:**

* **`GT-105` (Medium-High):** Overdue Loan Awareness
* **`GT-106` (Medium-High):** Live Inventory Search & Debouncing
* **`GT-107` (High):** Department Usage Stats Dashboard
* **`GT-108` (High):** Client-Side CSV Data Export

Refer to `backlog.md` for full acceptance criteria. Core tickets are mandatory; complete 2 of the 4 Stretch tickets.
