
const mongoose = require('mongoose');
const Joi = require('joi');
const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  details: {
    type: String,
    required: true,
    minlength: 8
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['public', 'private'],
    required: true
  },
  allowComments: {
    type: Boolean,
    required: true
  },
  comments: [{
    commentBody: {
      type: String,
      // required: true
    },
    commentDate: {
      type: Date,
      default: Date.now
    },
    commentUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },

  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  dislikesCount: {
    type: Number,
    default: 0
  }

});


const Story = mongoose.model('Story', storySchema, 'stories');

function validateStory(story) {
  const Schema = {
    title: Joi.string().min(5).max(255).required(),
    details: Joi.string().min(5).required(),
    status: Joi.string().required(),
    allowComments: Joi.boolean().required()
  };
  return Joi.validate(story, Schema);
}

function validatePutStory(story) {
  const Schema = {
    title: Joi.string().min(5).max(255).required(),
    details: Joi.string().min(5).required(),
    status: Joi.string().required(),
    allowComments: Joi.boolean().required(),
    _method: 'PUT' || 'DELETE'
  };
  return Joi.validate(story, Schema);
}

module.exports = {
  Story,
  validateStory,
  validatePutStory
}