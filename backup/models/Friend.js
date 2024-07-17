const mongoose = require('mongoose')



const friend = mongoose.Schema({
    member: {
        senderId: {
            type: mongoose.Types.ObjectId,
            ref: 'Users'
        },
        receiverId: {
            type: mongoose.Types.ObjectId,
            ref: 'Users'
        },
        status:{
            type: String,
            default: 'pending'
        }
    }

})


module.exports = mongoose.model('friends', friend)