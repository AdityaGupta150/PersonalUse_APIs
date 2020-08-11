const { Schema, Types } = require('mongoose')
const { getConnection } = require('../../../util/mongoConnection')

    //Analogous to project/section in todoist
const categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    todoIds: {
        type: [Types.ObjectId],   //array of todo ids
        required: true  //since it should be initialised with at least one todoId
    },
    createdAt: {
        type: Number,
        default: Date.now()
    }
})

    //TODO_TRY  -> Try to use ES6 arrow function here, what happens then
categorySchema.methods.pushTodoId = function(id){   /**Do not declare methods using ES6 arrow functions (=>). Arrow functions explicitly prevent binding this, so your method will not have access to the document and the above examples will not work. */
    return this.todoIds.push(id)
}

module.exports = getConnection('MyDoist15').model('categories', categorySchema)
