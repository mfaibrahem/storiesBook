const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  date: {
    type: Date,
    default: Date.now
  }
  // confirmPassword: {
  //   type: String,
  //   minlength: 8,
  //   maxlength: 1024,
  //   required: true,
  //   validate: {
  //     isAsync: true,
  //     validator: function(v, callback) {
  //       callback(this.password === v)
  //     },
  //     message: 'your password dose not match'
  //   }
  // }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({_id: this._id, name: this.name}, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const Schema = Joi.object().keys({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi
      .string().min(8).max(30)
      .required().regex(/^[a-zA-Z0-9 _\!\-\?\.]{8,30}$/),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
  });
  return Joi.validate(user, Schema);
}

function validatePassword(password) {
  let err = '';
  if (!password.match(/.*[a-z].*/)) err = 'password must contain at least one lower case char';
  else if (!password.match(/.*[A-Z].*/)) err = 'password must contain at least one upper case char';
  else if (!password.match(/.*[0-9].*/)) err = 'password must contain at least one number';
  else if (!password.match(/.*[ _\?\.\-\!].*/)) err = 'password must contain at least one special char';
  else err = 'passed';
  if (err === 'passed') return null;
  return err;

}




module.exports = {
  User,
  validateUser,
  validatePassword
}