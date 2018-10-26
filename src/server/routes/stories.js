
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
      .populate('user')
      .populate('comments.commentUser');

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

// post a comment
router.post('/comment/:id', auth, async(req, res) => {

  try {
    let story = await Story
      .findById(req.params.id);
      
    story.comments.unshift({
      commentBody: req.body.commentBody,
      commentUser: req.user._id 
    });
    story = await story.save();
    res.redirect(`/api/stories/${story._id}`);
  }
  catch (ex) {
    console.log(ex);
  }
});


router.post('/likes/:id', auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    let likedUser = false;
    let dislikedUser = false;
    story.likes.forEach(ele => {
      if (ele == req.user._id)
        likedUser = true;
    });
    story.dislikes.forEach(ele => {
      if (ele == req.user._id)
        dislikedUser = true;
    });

    // if the likedUser id not in the likes array and the disLikedUser id not in the dislikes array
    if (!likedUser && !dislikedUser) {
      story.likesCount += 1;
      story.likes.push(req.user._id);
      await story.save();
    }
    // then check if the likedUser not in likes array and the dislkedUser in the dislikes array
    // then decrease the dislikesCoutn by one and remove this user id from the dislikes array and increament the likeCoutn by 1 push it to the likes array
    else if (!likedUser && dislikedUser) {
      story.likesCount += 1;
      story.likes.push(req.user._id);
      story.dislikesCount -= 1;
      story.dislikes.forEach((ele, index) => {
        if (ele == req.user._id)
          story.dislikes.splice(index, 1);
      });
      await story.save();
    }
    // check if the likedUser is in the likes array and the dislikedUser is not in the dislikes array
    // then decrease the likesCount by 1 and pull the likedUser form the likes array
    // but don't do any thing with the dislikes array  
    else if (likedUser && !dislikedUser) {
      story.likesCount -= 1;
      story.likes.forEach((ele, index) => {
        if (ele == req.user._id)
          story.likes.splice(index, 1);
      });
      await story.save();
    }
     res.redirect(`/api/stories/${req.params.id}`);
      // const story = await Story.findById(req.params.id);
      // res.redirect(`/api/stories/${story._id}`);

  }
  catch(ex) {
    console.log(ex);
  }
});

router.post('/dislikes/:id', auth, async (req, res) => {
  const story = await Story.findById(req.params.id);
  let likedUser = false,
      dislikedUser = false;
  story.likes.forEach(ele => {
    if (ele == req.user._id)
      likedUser = true;
  });
  story.dislikes.forEach(ele => {
    if (ele == req.user._id)
      dislikedUser = true;
  });


  if (!dislikedUser && !likedUser) {
    // add a dislike and push the user id
      story.dislikesCount += 1;
      story.dislikes.push(req.user._id);
      await story.save();  
    }
  else if (!dislikedUser && likedUser) {
    story.dislikesCount += 1;
    story.dislikes.push(req.user._id);
    story.likesCount -= 1;
    story.likes.forEach((ele, index) => {
      if (ele == req.user._id)
        story.likes.splice(index, 1);
    });
    await story.save();
  } 
  
  else if (dislikedUser && !likedUser) {
    // decrease a dislike and pull the user id from the dislikes array
    story.dislikesCount -= 1;
    story.dislikes.forEach((ele, index) => {
      if (ele == req.user._id)
        story.dislikes.splice(index, 1);
    });
    await story.save();
  }
  res.redirect(`/api/stories/${req.params.id}`);
});

// router.post('/likes/:id', auth, async (req, res) => {
//   try {
//     const story = await Story.findById(req.params.id);
//     let likedUser = false;
//     let dislikedUser = false;
//     story.likes.forEach(ele => {
//       if (ele == req.user._id)
//         likedUser = true;
//     });
//     story.dislikes.forEach(ele => {
//       if (ele == req.user._id)
//         dislikedUser = true;
//     });
//     // if the likedUser id not in the likes array and the disLikedUser id not in the dislikes array

//     if (!likedUser && !dislikedUser) {
//       await Story
//         .updateOne(
//           {_id: req.params.id}, {
//             $inc: {likesCount: 1},
//             $push: {likes: req.user._id}
//           }
//         );
//     }
//     // then check if the likedUser not in likes array and the dislkedUser in the dislikes array
//     // then decrease the dislikesCoutn by one and remove this user id from the dislikes array and increament the likeCoutn by 1 push it to the likes array
//     else if (!likedUser && dislikedUser) {
//       await Story
//         .updateOne({_id: req.params.id}, {
//           $inc: {likesCount: 1},
//           $push: {likes: req.user._id},
//           $inc: {dislikesCount: -1},
//           $pull: {dislikes: req.user._id}
//         });
//     }
//     // check if the likedUser is in the likes array and the dislikedUser is not in the dislikes array
//     // then decrease the likesCount by 1 and pull the likedUser form the likes array
//     // but don't do any thing with the dislikes array  
//     else if (likedUser && !dislikedUser) {
//       await Story
//         .updateOne(
//           {_id: req.params.id}, {
//             $inc: {likesCount: -1},
//             $pull: {likes: req.user._id}
//           }
//         );
//     }
//      res.redirect(`/api/stories/${req.params.id}`);
//       // const story = await Story.findById(req.params.id);
//       // res.redirect(`/api/stories/${story._id}`);

//   }
//   catch(ex) {
//     console.log(ex);
//   }
// });

// router.post('/dislikes/:id', auth, async (req, res) => {

//   const story = await Story.findById(req.params.id);
//     let likedUser = false;
//     let dislikedUser = false;
//     story.likes.forEach(ele => {
//       if (ele == req.user._id)
//         likedUser = true;
//     });
//     story.dislikes.forEach(ele => {
//       if (ele == req.user._id)
//         dislikedUser = true;
//     });

//   if (!dislikedUser && !likedUser) {
//     // add a dislike and push the user id
//     await Story
//       .updateOne(
//         {_id: req.params.id}, {
//           $inc: {dislikesCount: 1},
//           $push: {dislikes: req.user._id}
//         }
//       );
//   }
//   else if (!dislikedUser && likedUser) {
//     await Story
//       .updateOne(
//         {_id: req.params.id}, {
//           $inc: {likesCount: -1},
//           $pull: {likes: req.user._id},
//           $inc: {dislikesCount: 1},
//           $push: {dislikes: req.user._id}
//         }
//       );
//   } 
  
//   else if (dislikedUser && !likedUser) {
//     // decrease a dislike and pull the user id from the dislikes array
//     await Story
//       .updateOne(
//         {_id: req.params.id}, {
//           $inc: {dislikesCount: -1},
//           $pull: {dislikes: req.user._id}
//         }
//       )
//   }
//   res.redirect(`/api/stories/${req.params.id}`);
// });



















module.exports = router;