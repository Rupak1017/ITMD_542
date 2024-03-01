class Contact{
    constructor(id, first_name, last_name, email, notes, creation, modified) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.notes = notes;
        this.creation = creation;
        this.modified = modified;
    }
}

module.exports = Contact;