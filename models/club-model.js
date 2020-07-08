const mongoose = require('mongoose')
const Schema = mongoose.Schema
const schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
};
const clubSchema = new Schema({
    clubName: {type: String },
    shortName: {type: String, required: true, unique:true },
    email: {type: String },
    phone: {type: String},
    logo: {type: String },
    shortName: {type:String},
    address: {
        street: {type: String},
        number: {type: Number},
        zip: {type: Number},
        city: {type: String}
    },
    module: {
        workhours:{
            activate: {type: Boolean, default: true},
            defaultWorkhours: {type: Number, default: 10}
        }
    },
    admin: {type: Array}
}, { timestamps: true })

module.exports = mongoose.model('Club', clubSchema)

// Auto-added fields:
// createdAt
// updatedAt
// _id
// __v