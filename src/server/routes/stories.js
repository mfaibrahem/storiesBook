
const express = require('express');
const _ = require('lodash');

const { Story, validateStory, validatePutStory } = require('../models/storyModel');
const { User } = require('../models/userModel');
const auth = require('../middleware/auth')


const router = express.Router();
// get all stories
router.get('/', async (req, res) => {
  try {
    const stories = await Story
      .find({status: 'public'})
      .sort({date: -1})
      .populate('user', 'name _id')
      .sort({title: 1});
  
    res.render('./stories/stories', {
      stories
    });
  } 
  catch(error) {
    res
      .status(404)
      .render('./stories/stories');
  }
});


// get add story form
router.get('/add', auth, (req, res) => {
  // const stories = await Story.find().sort({title: 1});
  res.render('./stories/add');
});

// create a new story
router.post('/', auth, async (req, res) => {
  let allowComments = req.body.allowComments;
  if (allowComments) allowComments = true;
  else allowComments = false;
  const {error} = validateStory({
    title: req.body.title,
    details: req.body.details,
    status: req.body.status,
    allowComments
  });
  if (error) {
      return res
        .status(400)
        .render('./stories/add', {
          err: error.details[0].message,
          title: req.body.title,
          details: req.body.details,
          status: req.body.status,
          allowComments: allowComments
        });
  } 
    
  let story = new Story({
    title: req.body.title,
    details: req.body.details,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user._id
  });
  story = await story.save();
  res.redirect('/api/stories');

});

// get update form
router.get('/edit/:id', auth, async (req, res) => {
  const stories = await Story.find();
  try {
    const story = await Story.findById(req.params.id);
    // console.log(req.user._id); // loggedin user
    // console.log(story.user); // story user id
    // console.log(req.params.id); // sotry id
    // console.log(story); // story document
    
    res.render('./stories/getUpdateForm', _.pick(story, ['_id', 'title', 'details', 'status', 'allowComments']));
  }
  catch(error) {
    res
      .status(404)
      .render('./stories/stories', {
        err: 'The Story you serching for not found!',
        stories
      });
  }
});

// update existing story
router.put('/:id', auth, async (req, res) => {
  const story = await Story.findById(req.params.id);

  let allowComments = req.body.allowComments;
  if (allowComments) allowComments = true;
  else allowComments = false;
  const {error} = validatePutStory({
    title: req.body.title,
    details: req.body.details,
    status: req.body.status,
    allowComments
  });
  if (error) {
      return res
        .status(400)
        .render('./stories/add', {
          err: error.details[0].message,
          title: req.body.title,
          details: req.body.details,
          status: req.body.status,
          allowComments: allowComments
        });
  } 
  
  story.title = req.body.title;
  story.details = req.body.details;
  story.status = req.body.status;
  story.allowComments = allowComments;
  const updatedStory = await story.save(); 
  res.redirect('/api/stories');
  
});


// delete a specific story
router.delete('/:id', auth, async (req, res) => {

  try {
      const story = await Story.findByIdAndDelete(req.params.id);
      res.redirect('/api/stories');
  }
  catch(error) {
    res
      .status(404)
      .render('./stories/stories', {
        err: 'The Story you serching for not found!',
        stories
      });
  }
});



// get a specific story
router.get('/:id', async (req, res) => {
  try {
    const story = await Story
      .findById(req.params.id)
      .populate('user', '_id name date');
    const firstLetter = story.user.name.substr(0, 1).toUpperCase();
    const targetUser = await User.findById({_id: story.user._id});
    const nStories = await Story
      .find({user: story.user._id})
      .countDocuments();
    res.render('./stories/story', {
        story, firstLetter, nStories, targetUser
    });

  } catch(ex) {
    res.status(404).redirect('/');
  }
});


module.exports = router;