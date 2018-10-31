
// const LocalStorage = require('node-localstorage').LocalStorage;
// localStorage = new LocalStorage('./scratch');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  // localStorage.removeItem('localToken');
  res.clearCookie('cookieToken');
  res.redirect('/api/stories');
});

module.exports = router;