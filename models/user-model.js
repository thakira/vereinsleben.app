const mongoose = require('mongoose')
const Schema = mongoose.Schema
const schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
};
const userSchema = new Schema({
    memberNumber: {type: Number, default: null},
    email: {type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    phone: {type: String, default: ""},
    mobile: {type: String, default: ""},
    birthday: {type: Date, default: null},
    img: { data: Buffer, contentType: String },
    secretToken: {type: String},
    //Rolle
    role: {type: String, required: true, enum:['user', 'admin', 'trainer'], default:'user'},
    //role: {type: String, default: "user"},
    //E-Mail-Adresse verifiziert
    verified: {type: Boolean, default: false},
    //Gruppen - standardmässig muß hier beim Registrieren die Gruppe "Alle" hinzugefügt werden.
    groups: {type: Array},
    //Einstellungen Benachrichtigungen
    messages: {type: Map},
    // angemeldete Stunden
    workhours: {type: Number, default: 10},
    // geleistete Stunden
    worked: {type: Number, default: 0},
    // angemeldete Termine
    events: {type:Array}
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)

// Auto-added fields:
// createdAt
// updatedAt
// _id
// __v