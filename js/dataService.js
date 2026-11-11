
/**
 * Storage keys used in localStorage for this application.
 * @readonly
 * @enum {string} //object that will contain values as string
 */
const STORAGE_KEYS = { //object that will contain values as string
    EQUIPMENT: 'geartrack_equipment',
    LOANS: 'geartrack_loans'
};

/**
 * @typedef {Object} Equipment - type of documentation, in this case is an object and Eqipment is the name of the object
 * @property {string} id - Unique equipment identifier.
 * @property {string} name - Human-readable equipment name.
 * @property {string} category - The equipment category, such as Cameras or Laptops.
 * @property {'available'|'loaned'} status - Current availability of the equipment.
 */

/**
 * @typedef {Object} Loan
 * @property {string} id - Unique loan identifier.
 * @property {string} equipmentId - The ID of the equipment being loaned.
 * @property {string} borrowerName - Name of the person borrowing the equipment.
 * @property {string} borrowerEmail - Email address of the borrower.
 * @property {string} dueDate - Due date for returning the equipment.
 * @property {'active'|'returned'} status - Current status of the loan.
 */

/**
 * @typedef {Object} NewLoanData
 * @property {string} equipmentId - The ID of the equipment being loaned.
 * @property {string} borrowerName - Name of the person borrowing the equipment.
 * @property {string} borrowerEmail - Email address of the borrower.
 * @property {string} dueDate - Due date for returning the equipment.
 */

/**
 * The initial equipment list used when localStorage is empty.
 * @type {Equipment[]} - this will contain an array of Equipment objects
 */
const initialEquipment = [ // Array of 4 objects, each representing a piece of equipment with its details
    { id: 'EQ-101', name: 'Canon EOS R6', category: 'Cameras', status: 'available' },
    { id: 'EQ-102', name: 'Sony FX3', category: 'Cameras', status: 'loaned' },
    { id: 'EQ-103', name: 'Manfrotto Tripod', category: 'Accessories', status: 'available' },
    { id: 'EQ-104', name: 'MacBook Pro 16"', category: 'Laptops', status: 'available' }
];

/**
 * The initial loan list used when localStorage is empty.
 * @type {Loan[]}
 */
const initialLoans = [
    {
        id: 'LN-501',
        equipmentId: 'EQ-102',
        borrowerName: 'Alex Root',
        borrowerEmail: 'alexroot@college.ac.uk',
        dueDate: '2026-08-15',
        status: 'active'
    }
];

/**
 * Seed localStorage with default equipment and loans if none exist yet.
 * This ensures the app has initial data to display on first load.
 */
function seedInitialData() {
    if (!localStorage.getItem(STORAGE_KEYS.EQUIPMENT)) { //if there is no equipment data in localStorage, return to null and set the initial equipment data in localStorage
        localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(initialEquipment)); //store the initial equipment data in localStorage as a string--- json stringify converts the array of objects into a JSON string for storage
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOANS)) {
        localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(initialLoans));
    }
}

seedInitialData();

export const dataService = { //export allows another JavaScript file to access something defined in this file.
    /**
     * Load equipment data from localStorage.
     * @returns {Promise<Equipment[]>} Array of equipment items. Promise is used to handle asynchronous operations, allowing the function to return a value in the future. Equipment[] indicates that the function returns an array of Equipment objects.
     */
    async getEquipment() { //async function that returns a promise, which will resolve to an array of Equipment objects
        const data = localStorage.getItem(STORAGE_KEYS.EQUIPMENT); //retrieve the equipment data from localStorage using the key defined in STORAGE_KEYS.EQUIPMENT but here is stored as a string, so we need to parse it back into an array of objects
        return JSON.parse(data) || []; //parse the JSON string back into an array of Equipment objects. If data is null (i.e., no equipment data in localStorage), return an empty array instead.
    },

    /**
     * Load loan data from localStorage.
     * @returns {Promise<Loan[]>} Array of loan records.
     */
    async getLoans() {
        const data = localStorage.getItem(STORAGE_KEYS.LOANS);
        return JSON.parse(data) || [];
    },

    /**
     * Save a new loan record and update the equipment status.
     * @param {NewLoanData} loanData - Information about the new loan.
     * @returns {Promise<Loan>} The newly created loan record.
     */
    async saveLoan(loanData) {
        const loans = await this.getLoans();
        const newLoan = {
            id: `LN-${Date.now().toString().slice(-4)}`, //generate a unique loan ID based on the current timestamp, taking the last 4 digits to ensure uniqueness while keeping it short
            status: 'active',
            ...loanData //spread operator is used to copy the properties of loanData into the newLoan object, allowing us to create a new loan record that includes all the necessary information from loanData.
        };
        loans.push(newLoan); //add the new loan record to the existing array of loans
        localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));

        const equipment = await this.getEquipment();
        const item = equipment.find(e => e.id === loanData.equipmentId);
        if (item) {
            item.status = 'loaned';
            localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment));
        }

        return newLoan;
    }
};