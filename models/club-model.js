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
}, { timestamps: true })

module.exports = mongoose.model('Club', clubSchema)

// Auto-added fields:
// createdAt
// updatedAt
// _id
// __v