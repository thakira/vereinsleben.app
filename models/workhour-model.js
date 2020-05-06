const mongoose = require('mongoose')
const Schema = mongoose.Schema

const workhourSchema = new Schema({
    workhourTitle: {type: String, required: true},
    workhourEstimated: {type: Number, required: true},
    workhourDescription: {type: String, required: true},
    workhourHeadcount: {type: Number, default: 1},
    workhourParticipants: {type: Array}
}, { timestamps: true })

module.exports = mongoose.model('Workhour', workhourSchema)
