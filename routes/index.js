const router = require("express").Router();

/**
 *  @brief -  GET home page
 * */
router.get("/", function (req, res) {
	res.status(404).json({ Note: "Nothing to be found from here" });
});

module.exports = router;
