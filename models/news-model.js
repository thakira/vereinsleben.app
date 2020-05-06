const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newsSchema = new Schema({
    newsTitle: {type: String, require: true},
    newsText: {type: String, require: true},
    //Wie speichert man ein Bild in einer DB???
    newsPicture: {type: Mixed, default: "Logo"},
    newsDocument: {type: Mixed},
    newsReleased: {type: Boolean, default: false}
}, { timestamps: true })

module.exports = mongoose.model('News', newsSchema)
