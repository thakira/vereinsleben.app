const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    memberNumber: {type: Number},
    email: {type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    phone: {type: String},
    mobile: {type: String},
    birthday: {type: Date},
    img: { data: Buffer, contentType: String },
    secretToken: {type: String},
    //Rolle
    role: {type: String, default: "user"},
    //E-Mail-Adresse verifiziert
    verified: {type: Boolean, default: false},
    //Gruppen - standardmässig muß hier beim Registrieren die Gruppe "Alle" hinzugefügt werden.
    groups: {type: Array},
    //Einstellungen Benachrichtigungen
    messages: {type: Map},
    // angemeldete Stunden
    workhours: {type: Number},
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