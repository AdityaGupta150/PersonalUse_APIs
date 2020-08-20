const {Schema, Types, model} = require('mongoose')
const { allowedJobTypes, allowedRoles, countryDeCode, countryEnCode } = require('./allowedData')
const locationSchema = require('./locationSchema')

const jobSchema = new Schema({
    t: {
        alias: 'type',
        type: String,
        trim: true,
        required: true,
        enum: Object.keys(allowedJobTypes),
        get: val => allowedJobTypes[val]
    },
    p: { //or Name,  eg. 'Frontend Developer Intern'
        alias: 'position',
        type: String,
        required: true,
        trim: true
    },
    r: { //Try to use AI when not entered... like 'Frontend'
        alias: 'role',
        type: String,
        trim: true,
        required: true,
        default: 'O',
        enum: Object.keys(allowedRoles),
        get: (val) => allowedRoles[val]
    },
    s: {
        alias: 'skills',
        type: [String],
    },
    exp: {   //experience_required
        alias: 'experience',
        type: Schema.Types.Mixed, //range
        validate: function(val) {
            if(typeof(val) === 'number'){
                return val >=0 && val <= 60
            }else if(!!val.forEach && typeof(val) === 'object'){
                return (range[0] >= 0 && range[0] <= 60) && (range[1] >= 0 && range[1] <= 60)
            }else
                return false
        },
        default: 0
    },
    cmpn: {
        alias: 'company',
        type: Types.ObjectId,   //Id of company collection
        required: true,
    },
    remote: {
        alias: 'isRemote',
        type: Boolean
    },
    l: {
        alias: 'location',
        type: [locationSchema],
        get: function() {
            if(!this.l){
                if(this.remote){
                    return this.remote
                }
                return null
            }
            return this.l
        }
    },
    posted: {
        alias: 'postedAt',
        type: Date,
    }
})

jobSchema.virtual('location').get(function(){ return this.l })

jobSchema.pre('save', function(doc) {   //Signature shows this is HookSyncCallback
    this.type = this.type.toLowerCase()
    if(this.type === 'internship' || this.type === 'intern'){
        this.type = 'I'
    }else if(this.type === 'fulltime' || this.type === 'full-time'){
        this.type = 'F'
    }else if(this.type === 'parttime' || this.type === 'partime' || this.type === 'part-time'){
        this.type = 'P'
    }

    if( ! allowedJobTypes.includes(this.type) )
        throw new Error('Incorrect Job Type')

    if( Object.keys(countryEnCode).includes(this.country) ){ //This conditional will save the shorter form only
        this.country = countryEnCode[this.country]
    }
}, function(err) {
    console.error('SOME ERROR JOBSCHEMA');
})

module.exports = model('job', jobSchema)
