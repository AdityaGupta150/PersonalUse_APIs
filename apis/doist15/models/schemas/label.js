const { Schema, Types } = require('mongoose')
const {minColour, maxColour} = require("../../util-functions/colours");
const { getConnection } = require('../../../util/mongoConnection');

    //labels will be the one that will actually be the one to distinguish between actual 'projects'
const labelSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    todoIds: {
        type: [Types.ObjectId],   //array of todo ids
            //default will be []
    },
    color: {    //will only matter, when we filter using a label... ie. only when we are on the page that contains all todos under a particular label... then the label title or backfround maybe coloured using this colour
        type: String,
        default: Math.floor((Math.random()*(maxColour - minColour + 1)) + minColour)   //this gives us the range [minColour, maxColour+1)
        //not setting default, do that on the server side, to ensure a different color than others present in the collection
    },
    createdAt: {
        type: Number,
        default: Date.now() //it's a number
    }
})

labelSchema.methods.pushTodoId = function(todoId){
    this.todoIds.push(todoId)
}

module.exports = getConnection('MyDoist15').model('labels', labelSchema)
