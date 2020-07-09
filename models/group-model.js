const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupSchema = new Schema({
    groupTitle: {type: String, required: true},
    groupMembers: {type:Array}
}, { timestamps: true })

module.exports = mongoose.model('Group', groupSchema)
