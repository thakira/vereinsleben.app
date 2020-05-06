const mongoose = require('mongoose')
const Schema = mongoose.Schema

const workhourSchema = new Schema({
    workhourTitle: {type: String, require: true},
    workhourEstimated: {type: Number},
    workhourDescription: {type: String},
    workhourHeadcount: {type: Number},
    workhourParticipants: {type: Array}
}, { timestamps: true })

module.exports = mongoose.model('Workhour', workhourSchema)
