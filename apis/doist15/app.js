/**
 * @TODO -> Have `labels` which is a premium feature in case of todoist
 * @TODO -> [FUTURE_Enhancements] Have functionality of adding comments (may contain attachments)
 * @TODO -> [FUTURE_Enhancements] Have suggestions for labels, using ML
        @body ->  Instead of ML, even simpler versions comparing with existing labels is very good.. it will be better to chose among given labels too, instead of typing everything. But since there is generally no problem in typing it, so it's of very low priority now
*/

const router = require("express").Router();

const indexRouter = require("./routes/index.js");
const syncRouter = require("./routes/sync.js");
const todoistRouter = require("./routes/todoist.js");

require("dotenv").config({ path: "./apis/doist15/.env" });

router.use("/", indexRouter);
router.use("/sync", syncRouter);
router.use("/todoist", todoistRouter);

module.exports = router;
