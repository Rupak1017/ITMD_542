var express = require('express');
var router = express.Router();
const { body } = require ('express-validator');
const contactsController = require('../controllers/contactController');

/* GET - Find All */
router.get('/', contactsController.contacts_list);


/* GET - Initialize form to create new contact */
router.get('/create', contactsController.contacts_get_create);

/* POST - Create new contact with entered fields if valid */
router.post('/create',
    body('first_name').trim().notEmpty().withMessage('First Name cannot be empty!'),
    body('last_name').trim().notEmpty().withMessage('Last Name cannot be empty!'),
    body('email').trim().notEmpty().withMessage('Email cannot be empty!').isEmail().withMessage('Must be a valid email address!'),
    body('notes').trim(),
    contactsController.contacts_post_create);

/* GET - Find single contact */
router.get('/:id', contactsController.contacts_individual);

/* GET - Delete contact */
router.get('/:id/delete', contactsController.contacts_get_delete);

/* POST - Delete contact */
router.post('/:id/delete', contactsController.contacts_post_delete);

/* GET - Edit contact */
router.get('/:id/edit', contactsController.contacts_get_edit);

/* POST - Edit Contact */
router.post('/:id/edit',
    body('first_name').trim().notEmpty().withMessage('First Name cannot be empty!'),
    body('last_name').trim().notEmpty().withMessage('Last Name cannot be empty!'),
    body('email').trim().notEmpty().withMessage('Email cannot be empty!').isEmail().withMessage('Must be a valid email address!'),
    body('notes').trim(),
    contactsController.contacts_post_edit);

module.exports = router;
