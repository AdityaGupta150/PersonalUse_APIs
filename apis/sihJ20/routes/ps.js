const router = require('express').Router()

const mongoose = require('mongoose')

const probModel = require('../models/schema/psSchema')

module.exports = mongoose
router.get('/pushSample', (req, res) => {
    const samples = require('../sampleResponses/getAll.json')

    res.send(samples)
})

router.get('/', (req, res) => {
    res.render('probs')
})

router.post('/incId/:psId', (req, res) => {

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    console.log(ip, ' has attempted to increase stars');

    probModel.findOne({probId: req.params.psId}, (err, doc) => {
        if( err ){
            console.error(err)
            return res.sendStatus(500)
        }
        let currentStars = doc.stars
        console.log('current stars -> ', currentStars)
        
        probModel.findByIdAndUpdate(doc._id, {stars: currentStars+1}, {new: false}, (err, doc) => {
            if( err ){
                console.error(err)
                return res.sendStatus(500)
            }                
        })
    })
    res.sendStatus(200)
})

router.get('/get/:psId', (req, res, next) => {

    probModel.findOne( {probId: req.params.psId }, (err, doc) => {
        if( err ){ return res.status(404).send("Problem Statement, with that ID doesn't exist")}

        if(!doc)    return res.json({'Error': 'Invalid psId was passed : ' + req.params.psId})
        let acquiredPS = {
            title: doc.title,
            statement: doc.statement,
            source: doc.source,
            probId: doc.probId,
            stars: doc.stars
        };

        res.json( acquiredPS )
    })
})   //Not needed now. But will be good to have it

router.get('/getAll', async (req, res, next) => {

    let allPS = []
    probModel.find( (err, docs) => {
        if( err ){
            console.error(err)
            if( next )
                return next()
            return
        }
        return docs
    }).then( (docs) => {
        if(docs.length === 0){
            return res.json({"Message": "Their are no documents, in asked collection"})
        }

        docs.forEach(doc => {   //did this to hide the IP
            allPS.push({
                title: doc.title,
                statement: doc.statement,
                source: doc.source,
                probId: doc.probId,
                stars: doc.stars
            })
        });
        return res.json(allPS)
    }).catch( (err, next) => {
        console.log(err)
        return res.sendStatus(500)
        // if (next)   next()
    })

})

router.post('/add', (req, res) => {
    // return res.status(403).json({ "unauthorized": "Ask admin if you need to do it"})    
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