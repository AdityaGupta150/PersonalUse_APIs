const router = require("express").Router();
const firstcommit = require("./routes/first_commit");

router.use("/1commit", firstcommit);

module.exports = router;
