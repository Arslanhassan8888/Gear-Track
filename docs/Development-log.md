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

### 3.6 Testing and Error Simulation

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

### 3.9 References, AI Use 

**References to include where consulted:**

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


**AI use:** 

I used ChatGPT as a learning and development support tool for:

- Understanding the problem:To learn about XSS vulnerabilities and the risks of using `innerHTML`.
- Researching alternatives: To compare HTML escaping, native DOM methods and sanitisation libraries.
- Learning JavaScript: To understand arrow functions, parameters, `return`, `map()`, `find()` and `async/await`.
- Understanding DOM manipulation: To learn how `createElement()`, `textContent`, `append()`, `replaceChildren()` and `dataset` work.
- Implementation support: To understand how to improve rendering security while preserving the existing functionality and styling.