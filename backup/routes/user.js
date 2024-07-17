
// routes/users.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../models/User');
const Friend = require('../models/Friend')
const authMiddleware = require('../middleware/auth');



router.get('/testapi', async (req, resp) => {
  console.log('test api hit')
  resp.json({ 'message': 'api hit' })

})

//get friend list 

router.get('/friendlist', authMiddleware, async (req, resp) => {
  const user = await User.findById(req.user?.id)
  console.log('api hit ', user._id)
  console.log('req.query', req.query)
  const queryObject = {
    $or: []
  }
  if (req.query.type==='getfriends') {
    queryObject.$or.push(...[
      { 'member.receiverId': new mongoose.Types.ObjectId(user._id), 'member.status': 'accepted' },
      { 'member.senderId': new mongoose.Types.ObjectId(user._id), 'member.status': 'accepted' }
  ])
  }else if(req.query?.type==='getrequests'){
    queryObject.$or.push(
      { 'member.receiverId': new mongoose.Types.ObjectId(user._id), 'member.status': req.query.status },
    )

  }else if(req.query?.type==='getRequested'){
    queryObject.$or.push(
      { 'member.senderId': new mongoose.Types.ObjectId(user._id), 'member.status': req.query.status }
    )
  }
  else{
    resp.json('testquesr erroro')
  }
  const findFriend = await Friend.find(queryObject);
  
  console.log('findFriend', findFriend)
  if (findFriend) {
    resp.json({ 'message': 'api hit', 'friendList': findFriend })
  }
  else {
    resp.json({ 'message': 'api hit', 'friendList': [] })
  }
})

//getFriends
//getRequests
//getRequested



// Get user info
router.get('/:id', authMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id)
  res.json(user);
});


// Add friend
router.post('/add-friend/:id', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  const friend = await User.findById(req.params.id);
  if (friend && user) {
    const addfriend = new Friend({
      member: {
        senderId: user,
        receiverId: friend,
      }
    })
    if (addfriend) {
      await addfriend.save()
      res.json({ message: 'friend added successfully' })
    }
  }
  else {
    res.status(400).json({ message: 'Friend not found' });
  }
});







module.exports = router;