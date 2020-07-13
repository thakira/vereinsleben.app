const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newsSchema = new Schema({
    newsTitle: {type: String, required: true},
    newsText: {type: String, required: true},
    newsImg: { type: String },
    newsImgMd: { type: String },
    newsThumbnail: { type: String },
    newsReleased: {type: Boolean, default: false},
    newsType: {type: String, default: 'text'}, // 'text' || 'image'
    newsAuthor: {type: String}
}, { timestamps: true })

module.exports = mongoose.model('News', newsSchema)
