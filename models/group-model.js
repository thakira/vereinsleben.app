const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupSchema = new Schema({
    groupTitle: {type: String, require: true},
    groupMembers: {type:Array, require: true}
}, { timestamps: true })

module.exports = mongoose.model('Group', groupSchema)

