const router = require("express").Router();

const ProbModel = require("../models/schema/psSchema");

/**
 * @brief - This renders the page listing all problem statements
 */
router.get("/", (req, res) => {
	res.render("probs");
});

/**
 * @brief - Adds a problem Statement
 * 
 * @request body -> {"title": "", "statement": "", "source": "", "probId": ""}
 * 
 * @response -> Redirects to the prebs page, when successful
 * 				Else responds with a 500
 */
router.post("/", (req, res) => {
	// return res.status(403).json({ "unauthorized": "Ask admin if you need to do it"})
	const probStatement = {
		title: req.body.title,
		statement: req.body.statement,
		source: req.body.source,
		probId: req.body.probId,
		stars: 0
	};

	if (req.body.isStarred === "on") probStatement.stars = 1;

	const newPS = new ProbModel(probStatement);
	newPS.save((err, doc) => {
		if (err) return console.error(err);
		return console.log(doc);
	});

	console.log(probStatement);
	res.redirect("/ps");
});

/**
 * @brief -> Increases stars for a particular problem statement
 * 
 * @param - Just have /YOUR_ID to the /incId route
 * 
 * @req -> Can be empty
 *         BUT, if you want to force increase stars, just add a `forceInc: true` to request body
 * 
 * @statusCode - 200, or 204 when successful, else 500
 */
router.post("/incId/:psId", (req, res) => {
	if (!req.body.forceInc) 
		return res.status(204).send("Not allowed any futher");

	const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
	console.log(ip, " has attempted to increase stars");

	ProbModel.findOne({ probId: req.params.psId }, (err, doc) => {
		if (err) {
			console.error(err);
			return res.sendStatus(500);
		}
		const currentStars = doc.stars;
		console.log("current stars -> ", currentStars);

		ProbModel.findByIdAndUpdate(doc._id, { stars: currentStars + 1 }, { new: false }, (err, doc) => {
			if (err) {
				console.error(err);
				return res.sendStatus(500);
			}
		});
	});
	res.sendStatus(200);
});

/**
 * @brief - Get the problem statement having the particular psID
 * 
 * @response - Responds with a JSON (the document of problem statement)
 * 
 * 				If failed responds with either a 404 or 500
 */
router.get("/get/:psId", (req, res, next) => {
	ProbModel.findOne({ probId: req.params.psId }, (err, doc) => {
		if (err)  return res.status(404).send("Problem Statement, with that ID doesn't exist"); 

		if (!doc) return res.json({ Error: "Invalid psId was passed : " + req.params.psId });
		const acquiredPS = {
			title: doc.title,
			statement: doc.statement,
			source: doc.source,
			probId: doc.probId,
			stars: doc.stars
		};

		res.json(acquiredPS);
	});
}); // Not needed now. But will be good to have it

/**
 * @brief - Get all Problem Statements stored in the database
 * 
 * @response - JSON of all documents that could be fetched
 * 				500 when failed
 */
router.get("/getAll", async (req, res, next) => {
	const allPS = [];
	ProbModel.find((err, docs) => {
		if (err) {
			console.error(err);
			if (next)  return next(); 
			return null;
		}
		return docs;
	}).then((docs) => {
		if (!docs) 
			return res.status(500).json({ Message: "Error occured in finding docs" });
		
		if (docs.length === 0) 
			return res.json({ Message: "Their are no documents, in asked collection" });
		

		docs.forEach((doc) => { // did this to hide the IP
			allPS.push({
				title: doc.title,
				statement: doc.statement,
				source: doc.source,
				probId: doc.probId,
				stars: doc.stars
			});
		});
		return res.json(allPS);
	}).catch((err, next) => {
		console.log(err);
		return res.sendStatus(500);
		// if (next)   next()
	});
});

/**
 * @brief - Responds with an array of titles of all Problem Statement stored in the database
 */
router.get("/getTitles", async (req, res, next) => {
	const allTitles = [];
	await ProbModel.find((err, docs) => {
		if (err) {
			console.error(err);
			if (next)  return next(); 
			return [];
		}
		return docs;
	})
		.then(docs => docs.forEach(doc => allTitles.push(doc.title)))
		.catch((err, next) => {
			console.log(err);
			return res.sendStatus(500);
			// if (next)   next()
		});

	return res.send(allTitles);
});

module.exports = router;
