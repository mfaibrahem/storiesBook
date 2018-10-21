
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  res.redirect('/api/stories');
  localStorage.removeItem('localToken');
});

module.exports = router;