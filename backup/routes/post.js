
// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Create post
router.post('/', authMiddleware, async (req, res) => {
  const { content } = req.body;
  const newPost = new Post({ author: req.user.id, content });
  await newPost.save();
  res.json(newPost);
});

// Get posts
router.get('/', authMiddleware, async (req, res) => {
  const posts = await Post.find().populate('author').exec();
  res.json(posts);
});

module.exports = router;