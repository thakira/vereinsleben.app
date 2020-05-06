const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newsSchema = new Schema({
    newsTitle: {type: String, required: true},
    newsText: {type: String, required: true},
    //Wie speichert man ein Bild in einer DB???
    newsPicture: {type: Mixed},
    newsDocument: {type: Mixed},
    newsReleased: {type: Boolean, default: false}
}, { timestamps: true })

module.exports = mongoose.model('News', newsSchema)
