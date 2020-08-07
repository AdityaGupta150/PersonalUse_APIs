/**@TODO -> Have `labels` which is a premium feature in case of todoist
 * @TODO -> [FUTURE_Enhancements] Have functionality of adding comments (may contain attachments)
 * @TODO -> [FUTURE_Enhancements] Have suggestions for labels, using ML
            @body ->  Instead of ML, even simpler versions comparing with existing labels is very good.. it will be better to chose among given labels too, instead of typing everything. But since there is generally no problem in typing it, so it's of very low priority now
*/

const express = require('express')
const app = express()
// const {exit} = ;

const indexRouter = require('./routes/index')
const syncRouter = require('./routes/sync')
const todoistRouter = require('./routes/todoist')

require('dotenv').config({path: './apis/doist15/.env'})

const mongoose = require('mongoose')

const dbName = 'MyDoist15'
let db = process.env.DB_URI.replace('<DB_NAME>', dbName) || 'mongodb://localhost/' + dbName
const dbOpts = {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}
mongoose.connect(db, dbOpts)
    .then( () => {})
    .catch((err) => {
        console.error('Couldn\'t connect to mongo... Trying to connect to mongodb://localhost')
        db = 'mongodb://localhost/' + dbName
        mongoose.connect(db, dbOpts)
            .then( () => {})
            .catch( (err) => {
                console.error('Couldn\'t connect to mongo... Trying to connect to mongodb://localhost')
                exit(500)
            })
    })


mongoose.connection
    .once('open', () => {
        console.log('Database connected. DB -> ', db.substr(0,15))
    })
    .on('error', (err) => {
        console.error.bind(console, 'Error in connection with MONGO');
    })

app.use('/', indexRouter)
app.use('/sync', syncRouter)
app.use('/todoist', todoistRouter)

module.exports = app
