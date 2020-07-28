const router = require('express').Router()

const hackModel = require('../models/schema/hackathonSchema')

const mongoose = require('mongoose')

// mongoose.connect("mongodb://localhost/Hack", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
// mongoose.connection
//   .once('open', () => console.log("Connected to MongoDB,", "Hack DB"))
//   .on('error', (err) => console.error(err))
  
router.get('/', (req, res) => {
    res.json({
        name: 'SIH',
        link: 'sih.gov.in'
    })
})
router.post('/add', (req, res) => {
    res.status(500).send('This functionality has yet to be added to the server')
})

module.exports = router