var express = require('express');
var router = express.Router();

const notifModel = require('../models/schema/notifSchema');

/*LEARNT -> However you modify req.method, or send post request to this route... res.redirect() will change the req object, and it will ALWAYS be a GET request */

/* GET home page. */
router.get('/', function(req, res, next) {
  next()
});

module.exports = router;
