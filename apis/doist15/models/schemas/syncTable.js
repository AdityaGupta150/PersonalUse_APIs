const { Schema, Types } = require('mongoose')
const { getConnection } = require('../../../util/mongoConnection')

const syncTableSchema = new Schema({
    mongoId: {
        type: Types.ObjectId,
        unique: true
    },

    todoistId: {
        type: Types.ObjectId,
        unique: true
    },

    firebaseId: {
        type: Types.ObjectId,
        unique: true
    }
})

syncTableSchema.pre('save', function(next){
    if(this.mongoId){
        //ie. it has a value
        this._id = this.mongoId
    }
})

module.exports = getConnection('MyDoist15').model('syncTable', syncTableSchema)
