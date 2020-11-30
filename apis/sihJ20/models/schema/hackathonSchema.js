//  Currently wont be working much further on this, just for later use

const mongoose = require('mongoose');

const hackSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	link: String
});

module.exports = mongoose.model('hackathons', hackSchema);
