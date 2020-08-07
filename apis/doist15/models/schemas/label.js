const mongoose = require('mongoose')

    //labels will be the one that will actually be the one to distinguish between actual 'projects'
const labelSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    todoIds: {
        type: Object,   //array of todo ids
        required: true  //since it should be initialised with at least one todoId
    },
    color: {    //will only matter, when we filter using a label... ie. only when we are on the page that contains all todos under a particular label... then the label title or backfround maybe coloured using this colour
        type: String,
        // required: true
            //not setting default, do that on the server side, to ensure a different color than others present in the collection
    },
    createdAt: {
        type: Number,
        default: Date.now() //it's a number
    }
})

//TODO - Add logic to check after each change of this.todoIds, to check if it has become empty... if so remove

module.exports = mongoose.model('labels', labelSchema)
