const express = require('express');
const app = express();
const path = require('path')
const cricapi = require('cricapi')
cricapi.setAPIKey("dmkLt572pHdnImPZpfgWdQbuaL72");

//---------------------------------------------------
const {Schema} = require('mongoose');
const { getConnection } = require('../util/mongoConnection');

const edu = getConnection('edu').model('edu', new Schema({
    mail: String,
    comment: String,
}));

function saveComment(data) {
    edu.create({mail: data.mail, comment: data.comment})
        .catch(err => console.log(err));
}

app.get('/data', (req, res) => {
    edu.find({}, (err, docs) => {
       if(err)  console.log(`Error: ` + err)
        else res.send(docs)
    });
})

app.get('/cric1', (req, res) => {
    const obj = cricapi.cricketMatches( //current matches
        (data,data2,data3) => {
            console.log(data);
            console.log(data2);
            console.log(data3);
            res.send({
                'd1': data,
                'd2': data2,
                'd3': data3
            });
        })

    });

app.get('/cric2', (req, res) => {
    const obj = cricapi.matches(
        (data,data2,data3) => {
            console.log(data);
            console.log(data2);
            console.log(data3);
            res.send({
                'd1': data,
                'd2': data2,
                'd3': data3
            });
        }
    );
})

//---------------------------------------------------
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

app.get('/boyl', (req, res) => {
    res.status(204).sendFile(path.join(__dirname+ '/boylestad.html'));
})

app.post('/comment', (req, res) => {
    saveComment(req.body)
    res.json({
        'You sent this:' : {
            'email': req.body.mail,
            'comment': req.body.comment,
        }
    })
})

module.exports = app;