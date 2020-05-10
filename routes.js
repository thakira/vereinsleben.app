const User = require('./models/user-model')
const crypto = require('crypto')
const LocalStrategy = require('passport-local').Strategy
const randomString = require('randomstring')
const mailer = require('./misc/mailer')


// Check if user is logged in
function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) return next()
    res.redirect('/login')
}

// Check if user is not logged in
function isNotLoggedin(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/dashboard')
    next()
}



module.exports = (app, passport) => {

    // Username/Password authentication
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
        try {
            //if (!email || !password) throw { message: 'Empty fields!' }

            const hashedPwd = crypto.createHash('sha256').update(password).digest('hex')
            const user = await User.findOne({ email: email, password: hashedPwd })
            if (!user) return done(null, false, 'Anmeldung fehlgeschlagen!')
            if(!user.verified) return done(null, false, 'E-Mail wurde noch nicht bestätigt!')
            return done(null, user)
        } catch (exception) {
            done(null, false, exception.message)
        }
    }))

    // Serialize user JSON object to session.userID
    passport.serializeUser((user, done) => done(null, user.id))

    // Deserialize session.userID to user JSON object
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id)
        done(null, user)
    })


    // Index site
    app.get('/', isNotLoggedin, (req, res) => {
        res.redirect('/login')
    })

    // Dashboard
    app.get('/dashboard', isLoggedin, (req, res) => {
        return res.render('views/dashboard', {title: 'Dashboard', firstname: req.user.firstname, lastname: req.user.lastname})
    })

    // Register
    app.get('/register', isNotLoggedin, (req, res) => {
        res.render('views/register', {title: 'Registrieren'})
    })

    // Login
    app.get('/login', isNotLoggedin, (req, res) => {
        res.render('views/login', {title: 'Anmelden'})
    })

    // Password forgot
    app.get('/pwdforgot', (req, res) => {
        res.render('views/pwdforgot', {title: 'Passwort vergessen'})
    })

    // News
    app.get('/aktuelles', (req, res) => {
        res.render('views/aktuelles-site', {title: 'Aktuelles'})
    })

    // Termine
    app.get('/termine', (req, res) => {
        res.render('views/termine-site', {title: 'Termine'})
    })

    // Arbeitsstunden
    app.get('/arbeitsstunden', (req, res) => {
        res.render('views/arbeitsstunden-site', {title: 'Arbeitsstunden'})
    })

    // Mitglieder
    app.get('/mitglieder', (req, res) => {
        res.render('views/mitglieder', {title: 'Mitglieder'})
    })

    // Gruppen
    app.get('/gruppen', (req, res) => {
        res.render('views/gruppen', {title: 'Gruppen'})
    })

    // Einstellungen Verein
    app.get('/settings-verein', (req, res) => {
        res.render('views/settings-verein', {title: 'Einstellungen Verein'})
    })

    // Profil
    app.get('/profil', (req, res) => {
        res.render('views/profil', {title: 'Profil', user : req.user})
    })

    // Profil
    app.get('/benachrichtigungen', (req, res) => {
        res.render('views/notifications', {title: 'Benachrichtigungen'})
    })

    // Profil
    app.get('/avatar', (req, res) => {
        res.render('views/components/avatar', {title: 'Avatar'})
    })


    // User login
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }))

    // User verify
    app.get('/verify', async(req, res) => {
        try {
            const user = await User.findOne({'secretToken' : req.query['token']})
            if(!user) {
                req.flash('error', 'Es gibt keinen Benutzer mit diesem Authentifizierungscode.')
                res.redirect('/login')
            }
            //console.log(req.query['token'])
            user.verified= true
            user.secretToken = ''
            await user.save()
            req.flash('success', 'Deine E-Mail-Adresse wurde verifiziert. Du kannst Dich jetzt anmelden.')
            res.redirect('/login')
        } catch (exception) {
            req.flash('error', exception.message)
        }
    })

    // User logout
    app.get('/logout', isLoggedin, (req, res) => {
        req.logout()
        req.flash('success', 'Du hast Dich erfolgreich abgemeldet.')
        res.redirect('/login')
    })

    // Registration site
    app.get('/register', isNotLoggedin, (req, res) => {
        res.render('views/register')
    })

    // Register a new user
    app.post('/register', isNotLoggedin, async (req, res) => {
        try {
            const email = req.body.email
            const password = req.body.password
            const repPasswd = req.body.repPwd
            const firstname = req.body.firstname
            const lastname = req.body.lastname

            if (!email || !password || !repPasswd || !firstname || !lastname) {
                console.log('Empty fields')
                return res.send('Empty fields')
            }

             // Check if email address is already registered
            const emails = await User.find({ email: email })

            // If an entry with desired email address was found, return an error
            if (emails.length) {
                req.flash('error', 'Diese E-Mail ist bereits registriert.')
                return res.redirect('/register')
            }

            // Hash password
            const hashedPwd = crypto.createHash('sha256').update(password).digest('hex')

            // Generate secret token
            const secretToken = randomString.generate()

            //flag the acccount as inactive
            const verified = false


            // Store new user
            await new User({ email: email, password: hashedPwd, firstname: firstname, lastname: lastname, verified: verified, secretToken: secretToken }).save(error => {
                if (error) throw { message: error.errmsg } // Guard clause
            })
            //E-Mail verschicken
            const html = `Willkommen bei Vereinsleben.app,
            <br>
            Um Deine E-Mail-Adresse zu bestätigen, klicke bitte auf folgenden Link:
            <br>
            <a href="http://localhost:5000/verify?token=${secretToken}">http://localhost:5000/verify?token=${secretToken}</a>`

            await mailer.sendEmail('mailbestaetigung@vereinsleben.app', email, 'Vereinsmanager.app: Bitte bestätige Deine E-Mail-Adresse', html )

            req.flash('success', 'Du hast es fast geschafft. Wir haben Dir eine E-Mail geschickt. Bitte bestätige Deine Identität, indem Du auf den Link darin klickst.')
            res.redirect('/login')
        } catch (exception) {
            req.flash('error', exception.message)
            return res.redirect('/login')
        }
    })

    // Upload a picture
    app.post('/profil', isLoggedin, async (req, res) => {
        try {
            const image = req.body.image
            console.log(image)

            if (!image) {
                console.log('Empty fields')
                return res.send('Empty fields')
            }
            /*req.user.image
            // Store new user
            await new User({ email: email, password: hashedPwd, firstname: firstname, lastname: lastname }).save(error => {
                if (error) throw { message: error.errmsg } // Guard clause

                req.flash('success', 'Du hast es fast geschafft. Wir haben Dir eine E-Mail geschickt. Bitte bestätige Deine Identität, indem Du auf den Link darin klickst.')
                res.redirect('/login')
            })*/
        } catch (exception) {
            req.flash('error', exception.message)
            return res.redirect('/profil')
        }
    })

}