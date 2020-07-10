const express = require('express')
const session = require('express-session')
const cors = require('cors')
const mongoose = require('mongoose')
const flash = require('express-flash')
const path = require('path')
const passport = require('passport')
const app = express()

app.use(express.static(path.join(__dirname, '/public')))
//app.get("/", express.static(path.join(__dirname, "./public")));
app.use("/", express.static(path.join(__dirname, "./public")));
app.use("/croppie",express.static(path.join(__dirname, 'node_modules/croppie/')))
app.use('/uploads', express.static('uploads'))

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(cors())
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'ahf289zfhiudsgf92zf',
    cookie: {
        maxAge: 60 * 60 * 1000, // 1 hour
        //secure: true // recommending, but only available with HTTPS
    }
}))
app.use(flash())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

// Middleware
app.use((req, res, next) => {
    next()
})

// Template engine
app.set('views', path.join(__dirname, 'public'))
app.set('view engine', 'ejs')

// MongoDB / Mongoose wrapper
mongoose.connect('mongodb://localhost:27017/siebenberger_strolche', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
mongoose.connection.on('error', () => console.log('Connection failed'))
mongoose.connection.once('open', () => console.log('Connection established'))

// Routes
require('./routes')(app, passport )


// Start server
app.get("*", function (req, res, next) {
    res.redirect("https://" + req.headers.host + "/" + req.path);
});

app.listen(3000, () => console.log('Server is up'))
//app.listen(80, () => console.log('Server is up'))
/*
const https = require('https')
const fs = require('fs')
https.createServer({
    key: fs.readFileSync('./ssl/privkey.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
}, app).listen(443, () => console.log('Server is up serving HTTPS'))
 */
