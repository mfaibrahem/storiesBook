
const mongoose = require('mongoose');
const Joi = require('joi');

// const replySchema = new mongoose.Schema({
//   replyBody: {type: String, minlength: 3},
//   replyDate: {type: Date, default: Date.now},
//   parentComment: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'},
//   replyUser: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   repliesToReply: [{
//     replyBody: {type: String, minlength: 3},
//     replyDate: {type: Date, default: Date.now},
//     replyUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
//     parentReply: {type: mongoose.Schema.Types.ObjectId, ref: 'Reply'},
    
//   }]
// });
const commentSchema = new mongoose.Schema({
  commentBody: { type: String, minlength: 3},
  commentDate: {type: Date, default: Date.now},
  commentUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  // replies: [replySchema]
})


const storySchema = new mongoose.Schema({
  comments: [commentSchema],
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
  // comments: [{
  //   commentBody: {
  //     type: String,
  //     // required: true
  //   },
  //   commentDate: {
  //     type: Date,
  //     default: Date.now
  //   },
  //   commentUser: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User'
  //   }
  
  // }],

  
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
const Comment = mongoose.model('Comment', commentSchema);
// const Reply = mongoose.model('Reply', replySchema);


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