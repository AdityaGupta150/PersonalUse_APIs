const router = require('express').Router();

// eslint-disable-next-line no-unused-vars
const hackModel = require('../models/schema/hackathonSchema');

router.get('/', (req, res) => {
	res.json({
		name: 'SIH',
		link: 'sih.gov.in'
	});
});
router.post('/add', (req, res) => {
	res.status(500).send('This functionality has yet to be added to the server');
});

module.exports = router;
