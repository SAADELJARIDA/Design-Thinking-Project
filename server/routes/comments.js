const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

// @route   GET api/comments/:postId
// @desc    Get all comments for a post
// @access  Public
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ date: -1 })
      .populate('user', 'name');
    
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/comments/:postId
// @desc    Add a comment to a post
// @access  Private
router.post('/:postId', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    // Check if post exists
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Create new comment
    const newComment = new Comment({
      text,
      user: req.user.id,
      post: req.params.postId
    });
    
    const comment = await newComment.save();
    
    // Populate user information
    await comment.populate('user', 'name');
    
    res.json(comment);
  } catch (err) {
    console.error('Error adding comment:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    // Check if comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    
    // Check if user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await comment.deleteOne();
    
    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error('Error deleting comment:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router; 