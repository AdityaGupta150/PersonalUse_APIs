const { Schema, Types } = require('mongoose')

const labelModel = require('./label.js')
const categoryModel = require('./category.js')
const { parseTodo, logError } = require('../../util-functions/util')
const { getConnection } = require('../../../util/mongoConnection.js')
const syncModel = require('./syncTable.js')

/* 
myPriorities =[   //have different colors assigned to these automatically for high priorities
    1,  //MUST BE COMPLETED, before endTime
    2,  //SHOULD ""'""""""""""""""""""""""
    3,  //Medium Priority   
    4   //Low Priority (`likely` with no end)
]
*/

let todo = new Schema({
        //'id' is already an alias for the 'string version of _id'
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
        required: true
    },
    priority: {
        type: Number,
        default: 4
    },
    colour: {
        type: Number,
            //before saving to database, check if priority is high && colour not provided... then automatically default to some colour (red for highest priority)
    },

    category: { //similar to 'project_id' in todoist
        type: String,   //will be an array of category IDs
        default: 'General',
        alias: 'categoryName'
    },

    labels: {   //won't affect the UI much but nevertheless will be stored... read the note in todoistAPIRoutes.txt for explained reason
        type: [Types.ObjectId],   //will be an array of label IDs
        alias: 'labels_ids',
        default: undefined
    },
        //when fetching a todo, if it has non-empty children_ids... recursively fetch them too, and better also validate the children have valid parent
    childs: { //only top-level childrens, if any
        type: [Types.ObjectId],   //an array of ids
        alias: 'children_ids',
        default: undefined
    },
    parent: {    //can have single parent only, only for child todos
        type: Types.ObjectId,
        alias: 'parent_id'
    },

    createdAt: {
        type: Number,
        default: Date.now()
    }
})

todo.virtual('isDone')
    .get(() => this.completed)
    .set((boolVal) => {
        if(typeof(boolVal) !== Boolean) return
        this.completed = boolVal
    })

todo.pre('save', function(next){    //LEARNT -> When using ES6 functions, this is just an empty object
    if(this.completed && this.due){
        if(this.due > Date.now()){
            this.completed = false
        }
        //else let both remain as it is (a completed task can have a due date (for history storage reason))
    }

    let labels = parseTodo(this)
    for (const labelName of labels) {
        labelModel.findOne({name: labelName}, (err, labelDoc) => {
            if(err){
                return logError(0, 'label', 'todoPreSave')
            }

            if(labelDoc){   //ie. it's not null
                this.labels.push(labelDoc._id)
            }else{  //create a new 'empty' label
                labelModel.create({name: labelName})
                .then(newLabel => {
                    console.log('🎉 Created Label:', newLabel);
                    this.labels.push(newLabel._id)
                })
                .catch(err => logError(1, 'label', 'todoPreSave/createEmptyLabel'))
            }
        })    
    }


    next()
})

todo.post('save', function(doc){    //defines a post hook for the document

    syncModel.findById(this._id, async (err, syncDoc) => {
        if(err){
            return logError(0, 'syncTable', 'todoPostSave')
        }else if(!syncDoc){
            await syncModel.create({
                mongoId: doc._id
            })
            .then((addedSyncDoc) => {
                console.log('🎉 Added doc to syncTable:', addedSyncDoc);
            })
            .catch(err => logError(1, 'syncTable', 'todoPostSave'))
        }

        //if there is one present already... nothing to do !
    })

    categoryModel.findOne({name: doc.category}, async (err, catDoc) => {
        if(err){
            return logError(0, 'category', 'todoPostSave')
        }else if(!catDoc){    //as require(mongo, it should be `null` if no document matches
            console.log('ℹ Going to create collection with name: ', doc.category)
            if(categoryModel.countDocuments({name: doc.category}, (err, count) => {
                if(err){
                    console.log('Error in counting')
                }
                console.log('{name:', doc.category, '}  count =', count)
            }))
            await categoryModel.create({
                name: doc.category,
                todoIds: [doc._id]
            }).then((addedCatDoc) => {
                console.log('🎉 Created category: ', addedCatDoc.name);
            })
            .catch(err => logError(1, 'category', 'todoPostSave/createCollection'))

            return
        }

        //if here, then it exists
        catDoc.pushTodoId(doc._id)  //QUESTION -> But will it modify the remote document ?
        // catDoc.todoIds.push(doc._id)
        // categoryModel.findByIdAndUpdate(catDoc._id, {todoIds: catDoc.todoIds}, (err, upCatDoc) => {
        //     if(err){
        //         console.error('Some Error happened while adding todo Id to already existing category');
        //     }
        //     console.log('Added todoId to category');
        // })
    })

    if(!this.labels)    this.labels = []
    for (const labelId of this.labels) {
        labelModel.findById(labelId, (err, labelDoc) => {
            if(err){
                return logError(0, 'label', 'todoPostSave')
            }else if(!labelDoc){
                return logError(4, 'label', 'todoPostSave', 'No such label exists')
            }

                //CHECK -> Check whether this function run here, also changes remote data, or we have to use the next commented lines?
            labelDoc.pushTodoId(doc._id)
            // labelModel.findByIdAndUpdate(labelId, {todoIds: labelDoc.todoIds}, (err, newDoc) => {
            //     if(err){
            //         return console.error('Couldn\'t complete query to find label by Id')
            //     }
            // })

        })
    }
    
})

module.exports = getConnection('MyDoist15').model('todos', todo)
