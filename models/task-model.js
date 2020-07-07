const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
    title: {type: String, required: true},
    estimated: {type: Number, required: true},
    description: {type: String},
    headcount: {type: Number, default: 1},
    participants: {type: Array},
    date: {type: Date},
    done: {type: Boolean, default: false},
    doneInfo: {
        date: {type: Date},
        worked_hours: {type: Number},
        user_id: {type: Array}
    },
    author: {type: String}
}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)
