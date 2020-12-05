const router = require("express").Router();
const jobModel = require("../models/schemas/job");

/**
 * @stalled
 * 
 * @file_brief -> These are the various endpoints for the jobs api,
 * 			work is currenly stalled, hence endpoints maybe incomplete for now
 */


router.get("/", (req, res) => {
	/** Preferably use graphQL here, and return all data asked for */

});

// Receives profile ID, and sends back suggested jobs
router.post("/getJobs", (req, res) => {
	const userId = req.body.userId;
	// @todo - Fetch the jobs that are suitable for a particular user
	const matchedJobs = [];

	res.json(matchedJobs);
});

router.post("/addJob", async (req, res) => {
	const job = req.body.job;

	jobModel.create(job).then((doc) => {
		res.json({ 200: `🎉 Added job with id ${doc.id} to database` });
	})
		.catch((err) => {
			console.log(`Error ${err.code} while adding the job -> `, job);
			res.sendStatus(500);
		});
});

router.get("/routes", (req, res) => {
	res.send({
		glassdoor: "jobs/glassdoor",
		indeed: "jobs/indeed",
		github: "jobs/github",

		Note: "All these endpoints are severely rate-limited and authenticated, so don't waste your API calls"
	});
});

module.exports = router;
