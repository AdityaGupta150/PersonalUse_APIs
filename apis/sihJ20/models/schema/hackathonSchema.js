//  Currently wont be working much further on this, just for later use

const mongoose = require('mongoose')

// mongoose.connect("mongodb://localhost/Hack", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
// mongoose.connection
//   .once('open', () => console.log("Connected to MongoDB,", "Hack DB"))
//   .on('error', (err) => console.error(err))
  
const hackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    link: String,
})

module.exports = mongoose.model('hackathons', hackSchema)