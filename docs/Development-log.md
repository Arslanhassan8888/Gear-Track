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


## 3. GT-103 — XSS Mitigation

**File modified:** `js/app.js`

### 3.1 Problem Analysis

The original GearTrack application used `innerHTML` together with JavaScript template literals to display equipment and loan information.

I identified a potential cross-site scripting (XSS) vulnerability because dynamic values, such as equipment names and borrower details, could be interpreted as HTML rather than plain text.

I identified two functions that needed modification: `renderEquipmentList()` and `renderActiveLoans()` in `js/app.js`.

### 3.2 Research and Learning

I explored how `innerHTML` works and how DOM methods can prevent HTML injection.

I studied `createElement()`, `textContent`, `append()`, `replaceChildren()`, `map()` and `find()`.

I also used AI explanations to improve my understanding of arrow functions, parameters, return and DOM manipulation.

- https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
- https://www.javascripttutorial.net/javascript-async-await/
- https://www.programiz.com/javascript/arrow-function
- https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
- https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent

-https://jcarpizo.github.io/owasp-info/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
-https://escapehtml.com/how-to-escape-html-strings-to-prevent-xss-attacks-in-frontend-development
-https://github.com/mganss/HtmlSanitizer

### 3.3 Alternative Solutions Considered

I considered three possible solutions:

- **HTML escaping:** HTML escaping converts special characters, such as < and >, into HTML entities to prevent them from being interpreted as HTML. I could implement this by creating a function to escape dynamic values before inserting them into innerHTML. This would require fewer changes to the existing code. However, every dynamic value would need to be escaped correctly, and missing one could introduce a security risk.
- **Native DOM methods:** This approach uses createElement() to create HTML elements and textContent to display dynamic values as plain text.

I could replace the existing innerHTML templates with DOM methods such as createElement(), textContent() and append(). This would reduce the risk of XSS without additional libraries. However, it would require more code and make the rendering functions longer.
- **Sanitisation library:** HTML sanitisation removes potentially dangerous content from HTML while allowing safe formatting.

I could use a library such as DOMPurify to clean dynamic HTML before displaying it. This would be useful if GearTrack needed to support formatted HTML. However, it would introduce an external dependency and additional maintenance.

### 3.4 Selected Solution and Justification

I selected native DOM methods because GearTrack mainly displays plain-text information, such as equipment names, categories and borrower details.

Although this approach requires more code than HTML escaping, I considered it more suitable because it reduces the risk of XSS by preventing untrusted text from being interpreted as HTML. It also avoids external dependencies and provides a clearer separation between HTML structure and dynamic data, making the code easier to maintain.

### 3.5 Implementation

I updated `renderEquipmentList()` and `renderActiveLoans()` in `js/app.js`, replacing unsafe `innerHTML` templates with native DOM methods.

In `renderEquipmentList()`, I used `createElement()` and `textContent` to display equipment information safely, while `map()` generated each card. I also preserved the existing CSS classes and Checkout buttons.

In `renderActiveLoans()`, I used `find()` to match loans with equipment and `append()` to display borrower details and due dates as plain text. I also updated the empty-state message.

Both functions use `replaceChildren()` to update the displayed cards. I added JSDoc documentation and explanatory comments to improve code readability.

### 3.6 Testing and Error 

I tested the application using Live Server and Chrome DevTools.

I completed the following tests:

- Normal rendering: I checked that equipment and loan cards displayed correctly. Passed.
- JavaScript errors: I checked the Console and found no errors during normal loading. Passed.
- Equipment XSS test: I inserted `<img src="x" onerror="alert(1)">` into an equipment name. It appeared as plain text without executing. Passed.
- Borrower XSS test: I inserted the same payload into a borrower's name. It appeared as plain text without executing. Passed.
- Script injection: I inserted `<script>alert('xss')</script>` into an equipment name. It appeared as plain text without executing. Passed.

I inserted the test values into localStorage and checked the results after refreshing the application. I restored the original data after testing.

### 3.7 Problems Encountered and Fixes

During testing, I initially used the wrong localStorage key. I identified the correct keys using `Object.keys(localStorage)`.

The Console also displayed `undefined` after I saved data. I investigated this and learnt that it was the normal behaviour of `localStorage.setItem()`.

I created backups using `sessionStorage` so I could restore the original data after testing.

### 3.8 Critical Reflection and Learning Outcomes

GT-103 helped me understand how JavaScript interacts with HTML and why the way dynamic content is displayed can affect application security.

I improved my knowledge of DOM methods, arrow functions and array methods such as map() and find(). I also learnt how to create HTML elements dynamically without relying on innerHTML.

Although the new approach improved security in the tested cases, it made the functions longer and more complex. In the future, I could improve code organisation by separating card creation into smaller functions and using automated tests to check security more efficiently.

### 3.9 AI Use 

I used ChatGPT as a learning and development support tool for:

- Understanding the problem:To learn about XSS vulnerabilities and the risks of using `innerHTML`.
- Researching alternatives: To compare HTML escaping, native DOM methods and sanitisation libraries.
- Learning JavaScript: To understand arrow functions, parameters, `return`, `map()`, `find()` and `async/await`.
- Understanding DOM manipulation: To learn how `createElement()`, `textContent`, `append()`, `replaceChildren()` and `dataset` work.
- Implementation support: To understand how to improve rendering security while preserving the existing functionality and styling.



## 4. GT-102 — Equipment Category Filtering

**Files modified:** `index.html`, `js/app.js`, `cypress/e2e/app.cy.js`

### 4.1 Problem Analysis

The original GearTrack application displayed all equipment records together without allowing users to filter them by category. This made it less convenient to find specific equipment, particularly as the number of records increased.

GT-102 required a dropdown containing All categories and dynamically generated equipment categories. Selecting a category needed to update the equipment list immediately without reloading the webpage.

I identified the main tasks: adding an accessible dropdown to `index.html`, retrieving unique categories, implementing filtering and updating the displayed equipment cards.

I also needed to preserve the secure rendering developed in GT-103 and avoid unnecessary changes to `dataService.js`.

### 4.2 Research and Learning

I explored JavaScript array methods, particularly `map()`, `filter()` and `forEach()`, to understand how to extract categories, filter equipment records and generate dropdown options.

I studied the `Set` object and spread syntax (`...`) to understand how to remove duplicate categories without hard-coding their values.

I also researched `addEventListener()` and the `change` event to understand how dropdown selections could update the equipment list without refreshing the webpage.

I reviewed DOM methods, including `createElement()`, `textContent` and `replaceChildren()`, to maintain compatibility with the secure rendering introduced in GT-103.

This research helped me compare different filtering approaches and understand why separating dropdown initialisation from equipment rendering could improve code organisation.

I also explored Jest and Cypress for automated testing. I investigated their purposes, configuration requirements and suitability for testing the existing application. This helped me compare function-level testing with end-to-end browser testing and select an appropriate approach.

**Relevant research sources:**

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
- https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
- https://jestjs.io/docs/getting-started
- https://docs.cypress.io/app/end-to-end-testing/writing-your-first-end-to-end-test
- https://docs.cypress.io/app/core-concepts/best-practices

### 4.3 Alternative Solutions Considered

I considered three possible solutions:

- **JavaScript array filtering:** This approach uses `filter()` to create a new array containing equipment matching the selected category. The existing rendering function could then display the results. It is simple, readable and requires minimal changes. However, the cards need to be recreated when the category changes.

- **Show and hide existing cards:** I could use JavaScript and CSS to control the visibility of existing equipment cards. This would avoid recreating the elements, but it would require additional DOM management and could become harder to maintain when equipment data changes.

- **Filtering through dataService:** I could modify `dataService.js` to retrieve equipment based on the selected category. This could be useful in a larger application, but it would introduce unnecessary complexity for GearTrack, where the equipment records are already available.

### 4.4 Selected Solution and Justification

I selected JavaScript array filtering because it was the simplest approach that met the ticket requirements without changing the existing data service.

The `filter()` method creates a new array without modifying the original equipment records. I also chose to generate categories dynamically using `Set`, reducing the need to maintain category names manually.

I decided to separate dropdown initialisation from equipment rendering to avoid duplicated options and improve maintainability.

For automated testing, I selected Cypress because it allowed me to verify the actual browser interactions without restructuring the existing application for Jest.

### 4.5 Implementation

I updated `index.html` by adding an accessible category dropdown with a label and an All categories option.

In `app.js`, I created `initialiseCategoryFilter()` to retrieve equipment records, extract unique categories using `map()` and `Set`, and generate options using `forEach()` and DOM methods.

I added a `change` event listener to detect category selections and update the displayed equipment.

I modified `renderEquipmentList()` to accept a selected category and use `filter()` before creating the equipment cards.

I reused the secure DOM rendering methods from GT-103 and updated the JSDoc documentation to reflect the new functionality.

### 4.6 Testing and Error Simulation

I tested the application using Live Server, Chrome DevTools and Cypress.

**Manual browser testing:**

- Category dropdown: I checked that the dropdown displayed the available categories correctly. `Passed`.
- Category selection: I checked that selecting a category displayed the matching equipment. `Passed`.
- All categories: I checked that selecting All categories restored the equipment list. `Passed`.
- Page behaviour: I verified that filtering worked without reloading the webpage. `Passed`.

**Chrome DevTools:**

I used the Console and temporary `console.log()` statements to inspect category values, investigate JavaScript errors and verify the filtering results during development.

**Jest investigation:**

I installed Jest and successfully executed an initial test. However, testing the existing `app.js` functions required additional configuration involving Babel and jsdom in order too keep function as they are without creating modular approach. I decided not to use Jest for the final GT-102 tests.

**Cypress automated testing:**

I created three end-to-end tests:

- Dropdown visibility: Verified that the category dropdown was visible. `Passed`.
- Cameras filtering: Verified that selecting Cameras displayed two cards, both belonging to the Cameras category. `Passed`.
- All categories: Verified that selecting All categories restored all four equipment cards. `Passed`.

Cypress reported three passing tests and no failures. I saved screenshots as testing evidence.

### 4.7 Problems Encountered and Fixes

During development, I encountered `ReferenceError` messages when attempting to access variables before they had been initialised. I corrected the order of the variable declarations and filtering operations.

I also encountered disappearing equipment cards and duplicated dropdown options. I resolved these problems by separating category initialisation from equipment rendering.

I also initially placed the All categories selection inside the Cameras test, affecting its intended result. I corrected the test structure and verified that all three Cypress tests passed.

### 4.8 Critical Reflection and Learning Outcomes

GT-102 improved my understanding of JavaScript array methods, arrow functions, event handling and dynamic DOM manipulation.

I learnt how `map()`, `filter()`, `forEach()` and `Set` can work together to create an interactive filtering feature.

The problems encountered helped me understand the importance of variable initialisation and separating responsibilities within the code.

Exploring Jest and Cypress also improved my understanding of automated testing. I learnt that selecting a testing tool should depend on the application structure and testing requirements rather than using multiple tools unnecessarily.

Although the completed feature works correctly, the dropdown categories are generated when the application starts. In future, I could improve this behaviour to handle changes to equipment categories while the page remains open.

### 4.9 AI Use

I used ChatGPT as a learning and development support tool for:

- Understanding JavaScript: Learning about arrow functions, `map()`, `filter()`, `forEach()`, `Set` and spread syntax.
- Researching alternatives: Comparing different filtering approaches and their advantages and disadvantages.
- DOM manipulation: Understanding dropdown creation, event handling and updating equipment cards.
- Implementation support: Reviewing suggested code, understanding its logic and integrating changes into the existing application.
- Debugging: Investigating `ReferenceError` messages, disappearing cards and duplicated category options.
- Automated testing: Learning about Jest and Cypress, understanding testing commands and investigating configuration problems.
- Documentation: Receiving feedback on the organisation and clarity of my Development Log.
