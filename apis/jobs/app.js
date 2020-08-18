const indexRouter = require('./routes/indexRoute')
const userRouter = require('./routes/userRoute')

const app = require('express')()

app.use('/', indexRouter)
app.use('/user', userRouter)

module.exports = app
