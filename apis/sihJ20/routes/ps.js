const router = require('express').Router()

const mongoose = require('mongoose')

// mongoose.connect("mongodb://localhost/Hack", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
// mongoose.connection
//   .once('open', () => console.log("Connected to MongoDB,", "Hack Database"))
//   .on('error', (err) => console.error(err))

const probModel = require('../models/schema/psSchema')

module.exports = mongoose
router.get('/', (req, res, next) => {
    res.render('probs')
})

router.get('/getAll', async (req, res, next) => {

    let allPS = []
    await probModel.find( (err, docs) => {
        if( err ){
            console.error(err)
            if( next )
                return next()
            return
        }
        console.log("Docs retrieved: ", docs)
        return docs
    }).then( (docs) => {
        docs.forEach(doc => {   //did this to hide the IP
            allPS.push({
                title: doc.title,
                statement: doc.statement,
                source: doc.source,
                probId: doc.probId
            })
        });
        console.log(allPS)
        return res.json(allPS)
    }).catch( (err, next) => {
        console.log(err)
        return res.sendStatus(500)
        // if (next)   next()
    })

})

router.get('/:psId', (req, res, next) => {

    console.log(req.params);
    probModel.find( {_id: req.params.psId }, (err, docs) => {
        if( err ){ return res.status(404).send("Problem Statement, with that ID doesn't exist")}
        return res.send(docs)
    })
    // next()

})   //Not needed now. But will be good to have it

router.post('/add', (req, res) => {
    return res.status(403).json({ "unauthorized": "Ask admin if you need to do it"})
    
    let probStatement = {
        title: req.body.title,
        statement: req.body.statement,
        source: req.body.source,
        probId: req.body.probId,
        stars: 0
    }

    if( req.body.isStarred === 'on' )   probStatement.stars = 1

    let newPS = new probModel(probStatement)
    newPS.save( (err, doc) => {
        if(err) return console.error(err);
        return console.log(doc);
    } )
    
    console.log(probStatement)
    res.redirect('/ps')
})

module.exports = router