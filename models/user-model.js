const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    firstname: {type: String, require: true},
    lastname: {type: String, require: true},
    phone: {type: String},
    birthday: {type: Date},
    member: {type: Boolean, default: false},
    verified: {type: Boolean, default: false},
    groups: {type: Array}
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)

// Auto-added fields:
// createdAt
// updatedAt
// _id
// __v