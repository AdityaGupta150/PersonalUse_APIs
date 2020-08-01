const createError = require('http-errors');
const express = require('express');
const path = require('path')

const mongoose = require('mongoose')

mongoose.connect( process.env.DB_URI || "mongodb://localhost/Hack", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
console.log( "Will connect to " + process.env.DB_URI.substr(0,10) + "..." )
mongoose.connection
  .once('open', () => console.log("Connected to MongoDB,", "Hack DB"))
  .on('error', (err) => console.error(err))

const indexRouter = require('./routes/index')
const psRouter = require('./routes/ps')
const hacksRouter = require('./routes/hack')
const planRouter = require('./routes/plan')

const app = express();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

/*
  IMPORTANT NOTE [LEARNT] ->
    Note that the app.set() function has been called here,
    So, if i route a form in an html, viewed through view folder, then it will think it base url,
    as, the base route of this express.app ('/sihJ20'),
    so, if i render a view 'probs' in psRouter (ie. different file, on '/sihJ20/ps'),
    and that form submits to '/add', then... it will post to /sihJ20 + /add,
    ie. the view thinks, that this app has rendered it (or whatever it thinks, similar to this)
    */
app.use('/', indexRouter)
app.use('/ps', psRouter)
app.use('/hacks', hacksRouter)
app.use('/plan', planRouter)

module.exports = app;