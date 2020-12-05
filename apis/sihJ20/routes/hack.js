const router = require("express").Router();

// eslint-disable-next-line no-unused-vars
const hackModel = require("../models/schema/hackathonSchema");

/**
 * @brief - Gets ALL hackathon listings available in database
 * 
 * @stalled
 */
router.get("/", (req, res) => {
	res.json({
		name: "SIH",
		link: "sih.gov.in"
	});
});

/**
 * @brief - Adds a hackathon listing to the database
 * 
 * @stalled
 */
router.post("/add", (req, res) => {
	res.status(500).send("This functionality has yet to be added to the server");
});

module.exports = router;
