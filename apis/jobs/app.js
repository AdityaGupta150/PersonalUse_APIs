const indexRouter = require("./routes/indexRoute");
const userRouter = require("./routes/userRoute");
const dataRouter = require("./routes/dataRoute");

const router = require("express").Router();
require("dotenv").config();

// @note - For brief about these endpoints, read the comments in the file
router.use("/", indexRouter);
router.use("/user", userRouter);
router.use("/data", dataRouter);

module.exports = router;
