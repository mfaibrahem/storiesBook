const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function (req, res, next) {
  // const token = req.header('x-auth-token');
  // const token = localStorage.getItem('localToken');
  const token = req.cookies.cookieToken;
  // if (!token) return res.status(401).send('Access denied. No token provided.');
  if (!token) return res.status(401).redirect('/api/auth');
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
}