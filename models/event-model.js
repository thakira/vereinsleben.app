const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({
    eventTitle: {type: String, required: true},
    eventStartDate: {type: Date, required: true},
    eventStartTime: {type: Date, required: true},
    eventEndDate: {type: Date, required: true},
    eventEndTime: {type: Date, required: true},
    eventRecurring: {type: Boolean, default: false},
    eventCycle: {type: Map},
    eventLocation: {type: Map},
    eventParticipants: {type: Array}
}, { timestamps: true })

module.exports = mongoose.model('Event', eventSchema)

