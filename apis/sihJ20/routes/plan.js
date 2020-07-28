const router = require('express').Router()

const mongoose = require('mongoose')

// mongoose.connect("mongodb://localhost/Hack", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
// mongoose.connection
//   .once('open', () => console.log("Connected to MongoDB,", "Hack DB"))
//   .on('error', (err) => console.error(err))

router.get('/', (req, res) => {
    console.log("managing the request")
    res.render('plan')
})
router.post('/update', () => {})

module.exports = router