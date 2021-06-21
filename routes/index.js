var express = require('express');
var router = express.Router();

const contactModel = require('./bdd');

let message = '';

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { message });
});

router.post('/add-contact', async (req, res) => {
  const searchContact = await contactModel.findOne({
    email: req.body.email
  });
  console.log(searchContact);
  if (!searchContact) {
    const newContact = new contactModel({
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      email: req.body.email,
      age: req.body.age,
      contactType: req.body.contactType,
    });
    const savedContact = await newContact.save();
    res.render('index', { message: 'Contact added' });
  } else {
    res.redirect('/');
  }
});

router.get('/contacts', async (req, res) => {
  const contacts = await contactModel.find();
  console.log(contacts);

  res.render('contacts', { 
    contacts, 
    contactType: 'famille',
    ageMin: 0,
    ageMax: 120  
  });
});

router.get('/edit-page', async (req, res) => {
  const contact = await contactModel.findOne({ email: req.query.email });

  res.render('edit', { contact, message: 'Contact modified' });
});

router.post('/edit-contact', async (req, res) => {
  const searchContact = await contactModel.findOne({
    email: req.body.email
  });
  if (!searchContact) {
    await contactModel.updateOne({ email: req.body.oldEmail }, {
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      email: req.body.email,
      age: req.body.age,
      contactType: req.body.contactType
    });
    const contacts = await contactModel.find();
  
    res.render('contacts', { 
      contacts, 
      contactType: 'famille',
      ageMin: 0,
      ageMax: 120  
    });
  } else {
    res.redirect('/contacts');
  }
});

router.get('/delete-contact', async (req, res) => {
  await contactModel.deleteOne({ email: req.query.email });
  const contacts = await contactModel.find();

  res.render('contacts', { 
    contacts, 
    contactType: 'famille',
    ageMin: 0,
    ageMax: 120  
  });
});

router.post('/filter', async (req, res) => {
  const contacts = await contactModel.find({
    age: {
      $gte: req.body.ageMin,
      $lte: req.body.ageMax 
    },
    contactType: req.body.contactType
  });

  res.render('contacts', { 
    contacts, 
    contactType: req.body.contactType,
    ageMin: req.body.ageMin,
    ageMax: req.body.ageMax
  });
});

module.exports = router;
