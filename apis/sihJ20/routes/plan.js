const router = require('express').Router()

const mongoose = require('mongoose')

router.get('/', (req, res) => {
    console.log("managing the request")
    res.render('plan')
})
router.post('/update', () => {})

module.exports = router