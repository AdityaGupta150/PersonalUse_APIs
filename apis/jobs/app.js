const indexRouter = require('./routes/indexRoute')
const userRouter = require('./routes/userRoute')
const dataRouter = require('./storage/createDataset')

const app = require('express')()
require('dotenv').config()

app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/data', dataRouter)

module.exports = app
