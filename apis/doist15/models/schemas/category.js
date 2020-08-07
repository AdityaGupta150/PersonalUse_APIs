const mongoose = require('mongoose')

    //Analogous to project/section in todoist
const categorySchema = new mongoose.Schema({
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
    createdAt: {
        type: Number,
        default: Date.now()
    }
})

//TODO - Add logic to check after each change of this.todoIds, to check if it has become empty... if so remove

module.exports = mongoose.model('categories', categorySchema)
