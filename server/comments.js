const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const auth = require("./auth.js");


const users = require("./users.js");
const User = users.model;

const commentSchema = new mongoose.Schema({
    photo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Photo'
    },
    date: Date,
    userName: String,
    comment: String,
});


const Comment = mongoose.model('Comment', commentSchema);


// Upload Comment
router.post('/new', async (req, res) => { 
    try { 
      const comment = new Comment({
        photo: req.body.photo,
        date: req.body.date,
        userName: req.body.user,
        comment: req.body.comment
      });
        comment.save();
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });


// get comments by photo id
router.get("/:id", async (req, res) => {
    try {
      let comment = await Comment.find({
        photo: req.params.id,
      }).sort({
        date: -1
      });
      return res.send(comment);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });


module.exports = {
    model: Comment,
    routes: router,
}