const database = new Map();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sqlite = require('sqlite3');
const Contact = require('./Contact')

const db = new sqlite.Database(path.join(__dirname, '../database/contacts.sqlite'), {verbose: console.log});

const createTable = db.prepare("CREATE TABLE IF NOT EXISTS CONTACTS (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT NOT NULL, notes TEXT, creation TEXT, modified TEXT)");
createTable.run();

const repository = {
    findAll: async () => {
        return new Promise((resolve, reject) => {
            try {
                const statement = db.prepare("SELECT * FROM CONTACTS");
                statement.all((error, rows) => {
                    if (error) {
                        console.error('Error fetching contacts:', error);
                        reject(error);
                    } else {
                        const contacts = rows.map((row) => {
                            return new Contact(row.id, row.first_name, row.last_name, row.email, row.notes, row.creation, row.modified);
                        });
                        resolve(contacts);
                    }
                });
            } catch (error) {
                console.error('Exception caught while fetching contacts:', error);
                reject(error);
            }
        });
    
    },        
    findByID: (id) => {
        return new Promise((resolve, reject) => {
            console.log("ID", id);
    
            db.get("SELECT * FROM CONTACTS WHERE id = ?", [id], (err, row) => {
                if (err) {
                    reject(`Read error: ${err.message}`);
                } else {
                    if (!row) {
                        console.log("Contact not found");
                        resolve(null); // No contact found
                    } else {
                        try {
                            const contact = new Contact(row.id, row.first_name, row.last_name, row.email, row.notes, row.creation, row.modified);
                            console.log("Contact:", contact);
                            resolve(contact);
                        } catch (error) {
                            console.error("Error creating Contact object:", error);
                            reject(error);
                        }
                    }
                }
            });
        });
    },
    

    findBy1ID: (id) => {
        return new Promise((resolve, reject) => {
            const statement = db.prepare("SELECT * FROM CONTACTS WHERE id = ?");
            statement.get(id, (error, row) => {
                if (error) {
                    console.error('Error finding contact by ID:', error);
                    reject(error);
                } else {
                    console.log("yyyyy")
                    if (!row) {
                        console.log("-------------inside finall");
                        resolve(null); // No contact found
                    } else {
                        console.log("-------------inside final", row);
                        const contact = new Contact(row.id, row.first_name, row.last_name, row.email, row.notes, row.creation, row.modified);
                        resolve(contact);
                    }
                }
            });
        });
    },
    
    
    create: async(contact) => {
        try {
            const statement = await db.prepare("INSERT INTO CONTACTS (first_name, last_name, email, notes, creation, modified) VALUES (?, ?, ?, ?, ?, ?)");
            await statement.run(contact.first_name, contact.last_name, contact.email, contact.notes, contact.creation, contact.modified, function(error) {
                if (error) {
                    console.error('Failed to create contact:', error);
                } else {
                    console.log(`Contact with ID ${this.lastID} has been created`);
                }
            });
        } catch (error) {
            console.error('Exception caught while creating contact:', error);
        }
    },

    deleteByID: async (id) => {
        return new Promise((resolve, reject) => {
            try {
                const statement = db.prepare("DELETE FROM CONTACTS WHERE id = ?");
                statement.run(id, function (error) {
                    if (error) {
                        console.error(`Error deleting contact with ID ${id}:`, error);
                        reject(error);
                    } else {
                        console.log(`Deleted contact with ID ${id}`);
                        resolve();
                    }
                });
            } catch (error) {
                console.error(`Exception caught while deleting contact with ID ${id}:`, error);
                reject(error);
            }
        });
    },
    

    update: (contacts) => {
        const statement = db.prepare("UPDATE CONTACTS SET first_name = ?, last_name = ?, email = ?, notes = ?, modified = ? WHERE id = ?");
        const updatedContact = statement.run(contacts.first_name, contacts.last_name, contacts.email, contacts.notes, contacts.modified, contacts.id);
        console.log(`Updated contact: ${updatedContact.changes}`);
    },
};

module.exports = repository;