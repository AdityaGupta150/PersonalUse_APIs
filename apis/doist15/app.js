/**@TODO -> Have `labels` which is a premium feature in case of todoist
 * @TODO -> [FUTURE_Enhancements] Have functionality of adding comments (may contain attachments)
 * @TODO -> [FUTURE_Enhancements] Have suggestions for labels, using ML
            @body ->  Instead of ML, even simpler versions comparing with existing labels is very good.. it will be better to chose among given labels too, instead of typing everything. But since there is generally no problem in typing it, so it's of very low priority now
*/

const express = require('express')
const app = express()
// const {exit} = ;

const indexRouter = require('./routes/index.js')
const syncRouter = require('./routes/sync.js')
const todoistRouter = require('./routes/todoist.js')

require('dotenv').config({path: './apis/doist15/.env'})

app.use('/', indexRouter)
app.use('/sync', syncRouter)
app.use('/todoist', todoistRouter)

module.exports = app
