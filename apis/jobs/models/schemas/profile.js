const { Schema, Types, model } = require("mongoose");
const { allowedJobTypes, allowedRoles } = require("./allowedData");
const locationSchema = require("./location");

const profileSchema = new Schema({
    un: {
        alias: 'userName',
        type: String,
        trim: true,
        unique: true,
        required: true,
        // validate: () => {}
    },
    fn: {
        alias: 'fullName',
        type: String,
        trim: true,
        required: true,
        // validate: () => {}
    },
    mail: {
        alias: 'emailId',
        type: String,
    },
    ph: {
        alias: 'contactNumber',
        type: String,
    },
    pas: {
        alias: 'password',
        type: String
    },
    dp: {
        alias: 'displayPhoto',
        type: String,   //a url
        trim: true,
    },
    s: {
        alias: 'skills',
        type: [String],
    },
    exp: {  //list of all experiences, just to show...
        alias: 'experience',
        type: [String],
        trim: true
    },
    eN: {   //Have the frontend decide this
        alias: 'experienceNum',
        type: Number,
        validate: val => val >= 0
    },
    loc: {
        alias: 'location',
        type: locationSchema,
    },
    tp: {
        alias: 'typePreference',
        type: String,
        trim: true,
        enum: Object.keys(allowedJobTypes),
        get: val => allowedJobTypes[val]
    },
    rp: {
        alias: 'rolePreference',
        type: [String], //eg. ['Software Developer', 'FrontEnd']
        enum: Object.keys(allowedRoles),
        get: val => allowedRoles[val]
    },
    cp: {
        alias: 'companyPreference',
        type: [Types.ObjectId], //eg. ['Google'._id, 'Adobe'._id]
    },
})

profileSchema.virtual('firstName').get( function(){
    return this.fn.split(' ')[0]
})

profileSchema.pre('save', function(doc){
    //@TODO -> Pre format the profile received, for eg. cypher the password
}, function(err) {
    console.log('Error Profile Pre');
})

//@TODO - Write logic to compare passwords, using bcrypt.compare
profileSchema.static('comparePass', function(passStr) {
    
})

module.exports = model('profiles', profileSchema)
