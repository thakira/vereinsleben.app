const mongoose = require('mongoose')
const Schema = mongoose.Schema

const locationSchema = new Schema({
    locationName: {type: String, require: true}
}, { timestamps: true })

module.exports = mongoose.model('Location', locationSchema)