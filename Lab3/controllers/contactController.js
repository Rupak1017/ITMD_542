const contactsRepository = require ('../src/contactsRepository');
const { validationResult } = require ('express-validator');
const Contact = require('../src/Contact');

/* GET - Find All */
exports.contacts_list = async function(req, res, next) {
    const data = await contactsRepository.findAll();
    res.render('contacts', {title: 'Contacts', contacts: data});
  };
  
  
  /* GET - Initialize form to create new contact */
 exports.contacts_get_create = function(req, res, next) {
      res.render('contacts_create', { title: 'Create a new contact'});
  };
  
  /* POST - Create new contact with entered fields if valid */
  exports.contacts_post_create = async function(req, res, next) {
  
      const result = validationResult(req);
      if (result.isEmpty() != true){
          res.render('contacts_create', { title: 'Create a new contact', message: result.array() })
      }
      else{
        const newContact = new Contact('', req.body.first_name, req.body.last_name, req.body.email, req.body.notes, Date(), Date());
        await contactsRepository.create(newContact);
        res.redirect('/contacts');
      }
  };
  
  /* GET - Find single contact */
  exports.contacts_individual = async function(req, res, next) {

      const contact = await contactsRepository.findByID(req.params.id);
      console.log(contact, "----------------");
      if(contact) {

          res.render('contacts_single', {title: 'Contacts', contact: contact});
      }
      else {
          res.redirect('/error')
      }
    };
  
  /* GET - Delete contact */
  exports.contacts_get_delete = async function(req, res, next) {
      const contact = await contactsRepository.findByID(req.params.id);
      console.log(contact, "----------------");
      res.render('contacts_delete', { title: 'Delete Contact', contact: contact});
  };
  
  /* POST - Delete contact */
  exports.contacts_post_delete = async function(req, res, next) {
      await contactsRepository.deleteByID(req.params.id);
      res.redirect('/contacts')
  };
  
  /* GET - Edit contact */
  exports.contacts_get_edit = function(req, res, next) {
      const contact = contactsRepository.findByID(req.params.id);
      res.render('contacts_edit', { title: 'Edit Contact', contact: contact});
  };
  
  /* POST - Edit Contact */
  exports.contacts_post_edit = async function(req, res, next) {
  
      const result = validationResult(req);
      if (result.isEmpty() != true){
          const contact = contactsRepository.findByID(req.params.id);
          res.render('contacts_edit', { title: 'Edit Contact', contact: contact, message: result.array() })
      }
      else{
          const contact = contactsRepository.findByID(req.params.id);
          const updatedContact = new Contact(req.params.id, req.body.first_name, req.body.last_name, req.body.email, req.body.notes, contact.creation, Date());
          await contactsRepository.update(updatedContact);
          res.redirect('/contacts');
      }
  };