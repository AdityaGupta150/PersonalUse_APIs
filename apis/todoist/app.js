/**Additional Feature/Motive -> Have `labels` which is a premium feature in case of todoist*/

const express = require('express')
const app = express()

const indexRouter = require('./routes/index')

require('dotenv').config()
const mongoose = require('mongoose')

console.log(process.env)

// mongoose.connect('')
// mongoose.connection
//     .on('open', () => {

//     })
//     .once('')


app.use('/', indexRouter)

export default app
