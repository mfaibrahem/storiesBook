
// const LocalStorage = require('node-localstorage').LocalStorage;
// localStorage = new LocalStorage('./scratch');

const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const {User} = require('../models/userModel');

const router = express.Router();

router.get('/', (req, res) => {
  if (res.locals.loggedIn) return res.status(401).redirect('/api/stories');
  res.render('./users/loginForm');
});

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if (error) {
    return res.status(400).render('./users/loginForm', {
      err: error.details[0].message,
      email: req.body.email,
      password: req.body.password
    });
  }
  
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).render('./users/loginForm', {
        err: 'Invalid Email or Password',
        email: req.body.email,
        password: req.body.password
      }); 
    }
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) {
      return res.status(400).render('./users/loginForm', {
        err: 'Invalid Email or Password',
        email: req.body.email,
        password: req.body.password
      });
    }
    

    const token = user.generateAuthToken();
    // localStorage.setItem('localToken', token);
    res.cookie('cookieToken', token);
    res.redirect('/api/stories');

  } catch(ex) {
    console.log(ex);
  }
});




function validate(req) {
  const schema = {
    email: Joi.string().min(8).max(255).required().email(),
    password: Joi.string().min(8).max(30).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;