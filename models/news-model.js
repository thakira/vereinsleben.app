const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const newsSchema = new Schema({
//     newsTitle: {type: String, required: true},
//     newsText: {type: String, required: true},
//     newsImg: { data: Buffer, contentType: String },
//     newsDoc: {type: String},
//     newsReleased: {type: Boolean, default: false},
//     newsType: {type: String, default: 'text'} // 'text' || 'image' || 'fullimage'
// }, { timestamps: true })

const newsSchema = new Schema({
    time: {type: Number},
    blocks: {type: Array},
    version: {type: String}
}, {timestamps: true})

module.exports = mongoose.model('News', newsSchema)
