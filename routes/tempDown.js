/**
 * @brief -> Fallback route for routes that haven't been completely implemented yet
 */
module.exports = require("express").Router().get("/", (req, res) => {
	res.status(501).send("Not yet fully implemented");
});
