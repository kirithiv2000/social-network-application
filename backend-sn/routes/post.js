const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - user
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         user:
 *           type: string
 *           description: The id of the user who created the post
 *         content:
 *           type: string
 *           description: The content of the post
 *       example:
 *         id: d5fE_asz
 *         user: 60d0fe4f5311236168a109ca
 *         content: This is a sample post content
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The posts managing API
 */

/**
 * @swagger
 * /api/post:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */

// Create post
router.post('/', authMiddleware, async (req, res) => {
  const { content } = req.body;
  const newPost = new Post({ user: req.user.id, content });
  await newPost.save();
  res.json(newPost);
});

/**
 * @swagger
 * /api/post:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */

// Get posts
router.get('/', authMiddleware, async (req, res) => {
  const posts = await Post.find().populate('user').exec();
  res.json(posts);
});

module.exports = router;
