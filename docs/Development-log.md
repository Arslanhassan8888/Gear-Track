# GearTrack — Development Log

**Project:** GearTrack — Department Equipment Loan Manager  
**Module:** Advanced Web Development — Level 6  

## 1. Project Overview

GearTrack is a client-side web application designed to help college department staff manage equipment loans to students and faculty.

The application uses HTML5, CSS3 and JavaScript ES6+, with browser localStorage for data persistence.

The application follows a modular structure with two main JavaScript files. app.js is responsible for displaying equipment and loans in the user interface, while dataService.js manages data retrieval and storage. This follows the principle of Separation of Concerns, where different parts of the application have specific responsibilities.
I also understood that the application uses JSON to convert JavaScript objects and arrays into strings for localStorage and then convert them back when retrieving data. The data service methods use async, returning Promises, while app.js uses await to obtain their results. Although localStorage operations are synchronous, this structure simulates an asynchronous backend and provides flexibility for future changes.

The README establishes professional coding conventions, including ES Modules, const and let, consistent naming conventions and JSDoc documentation. It also requires all data access to go through dataService.js rather than accessing localStorage directly from the interface.



During the initial analysis, I identified some limitations that require further investigation:

**Security**: The application uses innerHTML with dynamic data, potentially exposing it to DOM-based XSS vulnerabilities.

**Loan management**: The existing data service can create loans but does not yet provide a function to return equipment.

**Active loans**: The rendering function does not currently filter records by their active status.

**Data validation**: The application does not fully handle invalid or corrupted data stored in localStorage.

**Data storage**: localStorage is limited to the browser and does not provide shared access between multiple staff devices.


## 2. Core Ticket Analysis and Development Planning

Before implementing any changes, I reviewed the four mandatory Core tickets (GT-101 to GT-104) and compared their requirements, complexity and dependencies

After comparing the requirements and dependencies, I decided to implement the Core tickets in the following order:

**1. GT-103 — DOM-based XSS Mitigation**

I chose this ticket first because the existing application contains a security issue in the way dynamic content is rendered. Addressing this problem before introducing additional features will provide a safer foundation and reduce the risk of repeating unsafe rendering practices.

**2. GT-102 — Equipment Category Filtering**

I selected this ticket second because it is relatively simple and mainly involves extending the equipment rendering functionality. It will allow me to apply JavaScript concepts such as arrow functions, array filtering and event handling while building on the secure rendering approach introduced in GT-103.

**3. GT-101 — Checkout Form Modal**

I placed this ticket third because it introduces more complex user interactions, including forms, input validation, asynchronous data operations and updating multiple sections of the interface. Completing the security improvements first will help ensure that newly entered borrower information can be displayed safely.

**4. GT-104 — Return Equipment Flow**

I chose this ticket last because it complements the checkout functionality. Once equipment can be checked out through the interface, I will be able to implement and test the complete loan lifecycle, including creating loans, updating equipment availability and processing returns.
