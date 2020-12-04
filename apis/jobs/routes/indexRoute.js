const router = require("express").Router();

const jobModel = require("../models/schemas/job");

router.get("/", async (req, res) => {
	/** Preferably use graphQL here, and return all data asked for */

});

// Same as the route '/'
router.get("/all", async (req, res) => {

});

// Receives profile ID, and sends back suggested jobs
router.post("/getJobs", async (req, res) => {
	// const userId = req.body.userId;

	const matchedJobs = [];

	res.json(matchedJobs);
});

router.post("/addJob", async (req, res) => {
	const job = req.body.job;

	await jobModel.create(job);
	res.json({ 200: "🎉 Added job to database" });
});

router.get("/routes", (req, res) => {
	res.send({
		// glassdoor: 'jobs/glassdoor',
		// indeed: 'jobs/indeed',
		// github: 'jobs/github',
		// ETC: 'jobs/ETC',
	});
});

module.exports = router;
