const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    firstname: {type: String, require: true},
    lastname: {type: String, require: true},
    phone: {type: String},
    birthday: {type: Date},
    //Vereinsmitglied
    member: {type: Boolean, default: false},
    //E-Mail-Adresse verifiziert
    verified: {type: Boolean, default: false},
    //Gruppen - standardmässig muß hier beim Registrieren die Gruppe "Alle" hinzugefügt werden.
    groups: {type: Array},
    //Einstellungen Benachrichtigungen
    messages: {type: Map},
    // angemeldete Stunden
    workhours: {type: String},
    // geleistete Stunden
    worked: {type: Number},
    // angemeldete Termine
    events: {type:Array}
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)

// Auto-added fields:
// createdAt
// updatedAt
// _id
// __v