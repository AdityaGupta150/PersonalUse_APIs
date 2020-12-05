const router = require("express").Router();
const firstcommit = require("./routes/first_commit");

// a route to redirect to 1st commit
router.use("/1commit", firstcommit);

module.exports = router;
