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