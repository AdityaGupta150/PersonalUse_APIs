//  Currently wont be working much further on this, just for later use

const mongoose = require('mongoose')

// mongoose.connect("mongodb://localhost/Hack", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
// mongoose.connection
//   .once('open', () => console.log("Connected to MongoDB,", "Hack DB"))
//   .on('error', (err) => console.error(err))
  
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