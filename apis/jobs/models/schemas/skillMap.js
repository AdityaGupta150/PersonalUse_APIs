const { Schema, Types, model } = require("mongoose");

const skillMap = new Schema({
    _id: {  //required... mongoose can't save a document, without an _id field, except subdocuments
        alias: 'skillName',
        type: String,
        unique: true,
        required: true
    },
    jobs: {
        type: [Types.ObjectId],
        required: true
    }
}, {_id: false, id: false})

skillMap.virtual('id').get(function(){
    console.log('❕❕ id field of SkillSchema accessed... IT IS DEPRECATED');
    return this._id
})

module.exports = model('skillMap', skillMap)
