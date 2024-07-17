const mongoose = require('mongoose')

const users = mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
})

module.exports = mongoose.model('Users', users)