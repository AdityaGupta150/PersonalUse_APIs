/** TODO -
 * [Don't do it now? (Maybe not inside this 100DaysOfCode) But surely later]
 * How do we write `tests` for APIs ?? Probably with sample input defined for each route ?
 */

const createError = require('http-errors'); // for development
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config(); // Just loads environment variables from .env file, into the process.env object of node

const indexRouter = require('./routes/index');
const sihJ20Router = require('./apis/sihJ20/app');
const doistRouter = require('./apis/doist15/app');
const utilRouter = require('./apis/util/app');
const ludoRouter = require('./apis/ludo/app');
const eduRouter = require('./apis/eduPurpose/app');

const app = express();

app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(ensureDB)  //It shouldn't be mounted here, since here req.baseUrl = '' (empty)
app.use('/', indexRouter);
app.use('/sihJ20', sihJ20Router);
app.use('/doist15', doistRouter);
app.use('/util', utilRouter);
app.use('/edu', eduRouter);
app.use('/ludo', ludoRouter);

app.get('/useFire', (req, res) => {
	// Set the api to use firebase for this session
	// QUESTION -> Is there any useful uses of a 'session' in a completely backend setup ??

	process.env.USE_FIREBASE = true;
	res.redirect('/');
});

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.sendStatus(err.status || 500);
});

module.exports = app;
