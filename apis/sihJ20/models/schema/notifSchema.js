//  Currently wont be working much further on this, just for later use

const mongoose = require('mongoose')

const notifSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
})

notifSchema.post('whatIsTheEventForSaved', () => {
    //Post a notification to the server
})


module.exports = mongoose.model('notifications', notifSchema)