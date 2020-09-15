const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const { getConnection } = require('../util/mongoConnection');

const edu = getConnection('edu').model('edu', new mongoose.Schema({
    name: String,
    pass: String,
}));

function saveToDB(data) {
    edu.create({name: data.name, pass: data.pass})
        .catch(err => console.log(err));

}

app.get('/', (req,res) => res.send('Welcome to Edu'))

app.get('/bhuvnesh', (req,res) => {
    console.log(path.join(__dirname+ '/index.html'))
    res.status(200).sendFile(path.join(__dirname+ '/index.html'))
})

app.post('/submitIt', (req, res) => {
    saveToDB(req.body)
    res.json({
        'You sent this:' : {
            'username': req.body.name,
            'password': req.body.pass,
        }
    })
})

app.get('/data', (req, res) => {
    edu.find({}, (err, docs) => {
       if(err)  console.log(`Error: ` + err)
        else res.send(docs)
    });
})

module.exports = app;