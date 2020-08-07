var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(404).json({'Note': 'Nothing to be found from here'})
});

module.exports = router;
