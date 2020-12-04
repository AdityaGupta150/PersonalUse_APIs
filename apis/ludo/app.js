const { random } = require("underscore");
const router = require("express").Router();

// routes
const moveRouter = require("./routes/move");

router.get("/roll", (req, res) => {
	let n = random(1, 6);
	const arr = [];
	arr.push(n);
	while (n === 6) {
		n = random(1, 6);
		arr.push(n);
	}
	// @todo - Remove 3 consecutive sixes if any

	res.json({
		roll: arr
	});
});

router.use("/move", moveRouter);

module.exports = router;
