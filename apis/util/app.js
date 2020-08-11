const app = require('express')()

const theStart100Days = Date.parse('Fri Jul 17 2020 00:00:01 GMT+0530 (India Standard Time)')

app.get('/', (req, res) => {
    res.status(200).send('Use a subroute to access a utility')
})

app.get('/whatDatIsIt', (req, res) => {

    let now = ( Date.now() - theStart100Days )/(1000*3600*24)

    res.send(Math.trunc(now))
})

module.exports = app