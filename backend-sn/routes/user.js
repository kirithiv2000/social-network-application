const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Friend = require('../models/Friend');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         id: d5fE_asz
 *         username: johndoe
 *         email: johndoe@example.com
 *         password: password123
 *     Friend:
 *       type: object
 *       required:
 *         - senderId
 *         - receiverId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the friend relation
 *         senderId:
 *           type: string
 *           description: The id of the user who sent the friend request
 *         receiverId:
 *           type: string
 *           description: The id of the user who received the friend request
 *         status:
 *           type: string
 *           description: The status of the friend request
 *       example:
 *         id: d5fE_asz
 *         senderId: 60d0fe4f5311236168a109ca
 *         receiverId: 60d0fe4f5311236168a109cb
 *         status: accepted
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The user managing API
 */

/**
 * @swagger
 * /api/users/testapi:
 *   get:
 *     summary: Test the API
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: API is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.get('/testapi', async (req, res) => {
  console.log('test api hit');
  res.json({ message: 'API hit' });
});

/**
 * @swagger
 * /api/users/friendlist:
 *   get:
 *     summary: Get the friend list
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: The type of friend list to retrieve (getfriends, getrequests, getRequested)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: The status of the friend request (for getrequests or getRequested)
 *     responses:
 *       200:
 *         description: The list of friends
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Friend'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */

// Get friend list
router.get('/friendlist', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  console.log('API hit ', user._id);
  console.log('req.query', req.query);
  const queryObject = { $or: [] };

  if (req.query.type === 'getfriends') {
    queryObject.$or.push(
      { 'member.receiverId': new mongoose.Types.ObjectId(user._id), 'member.status': 'accepted' },
      { 'member.senderId': new mongoose.Types.ObjectId(user._id), 'member.status': 'accepted' }
    );
  } else if (req.query.type === 'getrequests') {
    queryObject.$or.push(
      { 'member.receiverId': new mongoose.Types.ObjectId(user._id), 'member.status': req.query.status }
    );
  } else if (req.query.type === 'getRequested') {
    queryObject.$or.push(
      { 'member.senderId': new mongoose.Types.ObjectId(user._id), 'member.status': req.query.status }
    );
  } else {
    return res.status(400).json({ message: 'Invalid query type' });
  }

  const findFriend = await Friend.find(queryObject);
  console.log('findFriend', findFriend);
  res.json({ message: 'API hit', friendList: findFriend });
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user info
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

// Get user info
router.get('/:id', authMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

/**
 * @swagger
 * /api/users/add-friend/{id}:
 *   post:
 *     summary: Add a friend
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the user to add as a friend
 *     responses:
 *       200:
 *         description: The friend was successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Friend not found
 *       401:
 *         description: Unauthorized
 */

// Add friend
router.post('/add-friend/:id', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  const friend = await User.findById(req.params.id);
  if (friend && user) {
    const addFriend = new Friend({
      member: {
        senderId: user,
        receiverId: friend,
      },
    });
    await addFriend.save();
    res.json({ message: 'Friend added successfully' });
  } else {
    res.status(400).json({ message: 'Friend not found' });
  }
});

module.exports = router;
