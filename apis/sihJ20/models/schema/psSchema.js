const mongoose = require('mongoose')
const { Number } = require('core-js')

const Schema = mongoose.Schema

const psSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },

    statement: {
        type: String,
        required: true,
        unique: true
    },

    source: String,

    probId: {
        type: String,
        required: false,
        // unique: true         //May not be unique, when empty, but try to emulate this on the server side
    },

    stars: {
        type: Number
    }
})

const compiledModel_PS = mongoose.model('problems', psSchema)

psSchema.pre('save', (next) => {
    //Check if same problem ID is already present or not

    let toBeAdded = this    //!!!! Considering this will work 

    compiledModel_PS.findOne({probId: this.probId }, (err, doc) => {
        if(err) return console.error(err)
        if(doc) return console.log("Found duplicate, with same problemID:", doc)
    })

    next()
})

module.exports = compiledModel_PS