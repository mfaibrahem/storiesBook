
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // res.locals.loggedIn = localStorage.getItem('localToken') ? true : false;
  const token = localStorage.getItem('localToken');
  if (token) {
    res.locals.loggedIn = true; 
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    res.locals.user = decoded;
  } else {
    res.locals.loggedIn = false; 
  }
  next();
}