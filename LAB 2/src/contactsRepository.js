const database = new Map();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const saveData = () => {
    const stringifyData = JSON.stringify(Array.from(database));
    fs.writeFileSync(path.join(__dirname, '../database/contacts.json'), stringifyData);
};

const loadData = () => {
    const fileData = fs.readFileSync(path.join(__dirname, '../database/contacts.json'));
    const contactsArray = JSON.parse(fileData);
    contactsArray.forEach(element => {
        database.set(element[0], element[1]);
    });
};

const repository = {
    findAll: () => Array.from(database.values()),
    findByID: (id) => database.get(id),
    create: (contacts) => {
        const newContact = {
            id: crypto.randomUUID(),
            firstName: contacts.firstName,
            lastName: contacts.lastName,
            email: contacts.email,
            notes: contacts.notes,
            creation: Date(),
            modified: Date(),
            /*This can be used if we want to standardize the time across the database
            if it was used in multiple locations at once.

            creation: new Date().toUTCString(),
            */
        };

        database.set(newContact.id, newContact);
        saveData();
    },
    deleteByID: (id) => {
        database.delete(id);
        saveData();
    },
    update: (contact) => {
        database.set(contact.id, contact);
        saveData();
    },
};

loadData();

module.exports = repository;