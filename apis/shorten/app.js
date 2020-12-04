const redisClient = require("./get_redis_conn");
const router = require("express").Router();

router.get("/:shorturl", (req, res) => {
	// @todo - Redirect to the long url for this specific shorturl
});

router.post("/", (req, res) => {
    
});

module.exports = router;
