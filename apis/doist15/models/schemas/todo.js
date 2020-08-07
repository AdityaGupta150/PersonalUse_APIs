const mongoose = require('mongoose')

const Schema = mongoose.Schema

const myPriorities =[   //have different colors assigned to these automatically for high priorities
    1,  //MUST BE COMPLETED, before endTime
    2,  //SHOULD ""'""""""""""""""""""""""
    3,  //Medium Priority   
    4,   //Low Priority
    5   //NA    (no end)
]

let todo = new Schema({
    _id: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: String,
    due: {
        type: Date
    },
    completed: {
        type: Boolean,
        default: false,
    },
    priority: {
        type: Number,
        default: 4
    },
    colour: {
        type: Number,
            //before saving to database, check if priority is high && colour not provided... then automatically default to some colour (red for highest priority)
    },

    category_id: { //similar to 'project_id' in todoist
        type: Number   //will be an array of category IDs
    },
    labels_ids: {   //won't affect the UI much but nevertheless will be stored... read the note in todoistAPIRoutes.txt for explained reason
        type: Object,   //will be an array of label IDs
    },
        //when fetching a todo, if it has non-empty children_ids... recursively fetch them too, and better also validate the children have valid parent
    children_ids: { //only top-level childrens, if any
        type: Object   //an array of ids
    },
    parent_id: {    //can have single parent only, only for child todos
        type: Number
    },

    createdAt: {
        type: Number,
        default: Date.now()
    }
})

module.exports = mongoose.model('todos', todo)
