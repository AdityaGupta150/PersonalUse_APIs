const router = require("express").Router();
const path = require("path");
const cricapi = require("cricapi");
cricapi.setAPIKey(process.env.CRIC_API || "");

const { Schema } = require("mongoose");
const { getConnection } = require("../util/mongoConnection");

const edu = getConnection("edu").model("edu", new Schema({
	mail: String,
	comment: String
}));

function saveComment (data) {
	edu.create({ mail: data.mail_id, comment: data.comm })
		.catch(err => console.log(err));
}

router.get("/data", (req, res) => {
	edu.find({}, (err, docs) => {
		if (err) console.log("Error: " + err);
		else {
			res.json({
				to_the_hacker: "Ye rha bhai ab tak jo data tere web se add hua, idhar sab aayega",
				the_data: docs
			});
		}
	});
});

router.get("/cric1", (req, res) => {
	const obj = cricapi.cricketMatches( // current matches
		(data, data2, data3) => {
			console.log(data);
			console.log(data2);
			console.log(data3);
			res.send({
				d1: data,
				d2: data2,
				d3: data3
			});
		});

	return res.send(obj);
});

router.get("/cric2", (req, res) => {
	const obj = cricapi.matches(
		(data, data2, data3) => {
			console.log(data);
			console.log(data2);
			console.log(data3);
			res.send({
				d1: data,
				d2: data2,
				d3: data3
			});
		}
	);

	return res.send(obj);
});

// ---------------------------------------------------
router.get("/", (req, res) => res.send("Welcome to Edu"));

router.get("/bhuvnesh", (req, res) => {
	console.log(path.join(__dirname, "/index.html"));
	res.status(200).sendFile(path.join(__dirname, "/index.html"));
});

router.post("/submitIt", (req, res) => {
	// saveToDB(req.body);
	res.json({
		"You sent this:": {
			username: req.body.name,
			password: req.body.pass
		}
	});
});

router.post("/comment", (req, res) => {
	saveComment(req.body);
	res.json({
		"You sent this:": {
			email: req.body.mail_id,
			comment: req.body.comm
		}
	});
});

module.exports = router;
