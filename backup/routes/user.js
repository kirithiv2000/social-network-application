
// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get user info
router.get('/:id', authMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id).populate('friends').exec();
  res.json(user);
});

// Add friend
router.post('/add-friend/:id', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  const friend = await User.findById(req.params.id);
  if (!user.friends.includes(friend._id)) {
    user.friends.push(friend._id);
    await user.save();
    res.json({ message: 'Friend added successfully' });
  } else {
    res.status(400).json({ message: 'Already friends' });
  }
});

module.exports = router;