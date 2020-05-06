const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({
    eventTitle: {type: String, require: true},
    eventStartDate: {type: Date, require: true},
    eventStartTime: {type: Date, require: true},
    eventEndDate: {type: Date, require: true},
    eventEndTime: {type: Date, require: true},
    eventRecurring: {type: Boolean, default: false},
    eventCycle: {type: Map},
    eventLocation: {type: Map},
    eventParticipants: {type: Array}
}, { timestamps: true })

module.exports = mongoose.model('Event', eventSchema)

