var express = require('express');
var router = express.Router();
const contactsRepository = require ('../src/contactsRepository');
const { body, validationResult } = require ('express-validator');

/* GET - Find All */
router.get('/', function(req, res, next) {
  const data = contactsRepository.findAll();
  res.render('contacts', {title: 'Contacts', contacts: data});
});


/* GET - Initialize form to create new contact */
router.get('/create', function(req, res, next) {
    res.render('contacts_create', { title: 'Create a new contact'});
});

/* POST - Create new contact with entered fields if valid */
router.post('/create',
    body('firstName').trim().notEmpty().withMessage('First Name cannot be empty!'),
    body('lastName').trim().notEmpty().withMessage('Last Name cannot be empty!'),
    body('email').trim().notEmpty().withMessage('Email cannot be empty!').isEmail().withMessage('Must be a valid email address!'),
    body('notes').trim(),
    function(req, res, next) {

    const result = validationResult(req);
    if (result.isEmpty() != true){
        res.render('contacts_create', { title: 'Create a new contact', message: result.array() })
    }
    else{
        contactsRepository.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            notes: req.body.notes,
        });

        res.redirect('/contacts');
    }
});

/* GET - Find single contact */
router.get('/:id', function(req, res, next) {
    const contact = contactsRepository.findByID(req.params.id);
    if(contact) {
        res.render('contacts_single', {title: 'Contacts', contact: contact});
    }
    else {
        res.redirect('/error')
    }
  });

/* GET - Delete contact */
router.get('/:id/delete', function(req, res, next) {
    const contact = contactsRepository.findByID(req.params.id);
    res.render('contacts_delete', { title: 'Delete Contact', contact: contact});
});

/* POST - Delete contact */
router.post('/:id/delete', function(req, res, next) {
    contactsRepository.deleteByID(req.params.id);
    res.redirect('/contacts')
});

/* GET - Edit contact */
router.get('/:id/edit', function(req, res, next) {
    const contact = contactsRepository.findByID(req.params.id);
    res.render('contacts_edit', { title: 'Edit Contact', contact: contact});
});

/* POST - Edit Contact */
router.post('/:id/edit',
    body('firstName').trim().notEmpty().withMessage('First Name cannot be empty!'),
    body('lastName').trim().notEmpty().withMessage('Last Name cannot be empty!'),
    body('email').trim().notEmpty().withMessage('Email cannot be empty!').isEmail().withMessage('Must be a valid email address!'),
    body('notes').trim(),
    function(req, res, next) {

    const result = validationResult(req);
    if (result.isEmpty() != true){
        const contact = contactsRepository.findByID(req.params.id);
        res.render('contacts_edit', { title: 'Edit Contact', contact: contact, message: result.array() })
    }
    else{
        const contact = contactsRepository.findByID(req.params.id);
        const updatedContact = {
            id: req.params.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            notes: req.body.notes,
            creation: contact.creation,
            modified: Date(),
        };
        contactsRepository.update(updatedContact);
        res.redirect('/contacts');
    }
});

module.exports = router;
