
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const { User, validateUser, validatePassword } = require('../models/userModel');
const { Story } = require('../models/storyModel');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  const stories = await Story
    .find({user: req.user._id})
    .populate('user');
    // find the stories of the loggdIn user
    res.render('./users/me', { user, stories });
  });
  
  router.get('/:id', async (req, res) => {
    // const targetUser = await User.findById(req.params.id).select('-password');
    const stories = await Story
    .find({user: req.params.id})
    .populate('user');
    // findt the stories of any user by its id
    // const loggedUser = req.user;
    res.render('./users/profile', { stories });
});

router.get('/', (req, res) => {
  if (res.locals.loggedIn) return res.status(401).redirect('/');
  else
    res.render('./users/regForm');
});

router.post('/', async (req, res) => {

  const {error} = validateUser(req.body);
  if (error) {
    if (error.details[0].path[0] === 'confirmPassword') {
      // return res.status(400).send('Password dose not match!');
      return res.status(400).render('./users/regForm', {
        err: 'Passwords do not match!',
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
      });
    }
    else {
      // return res.status(400).send(error.details[0].message);
      return res.status(400).render('./users/regForm', {
        err: error.details[0].message,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
      });
    }
  }
  const passError = validatePassword(req.body.password);
  if (passError) {
    // return res.status(400).send(passError);
    return res.status(400).render('./users/regForm', {
      err: passError,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    });
  }
    

  
  
  try {
    let user = await User.findOne({ email: req.body.email });
    // if (user) return res.status(400).send('user already registered');
    if (user) return res.status(400).render('./users/regForm', {
      err: 'user already registered',
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    });
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
      // confirmPassword: req.body.confirmPassword
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = user.generateAuthToken();
    // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    localStorage.setItem('localToken', token);
    res.redirect('/api/stories');
  } catch(ex) {
    console.log(ex)
  }
})




module.exports = router;