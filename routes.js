const User = require('./models/user-model')
const crypto = require('crypto')
const LocalStrategy = require('passport-local').Strategy

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

            if (!user) return done(null, false, 'Login failed!')

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
        return res.render('views/dashboard', {title: 'Dashboard'})
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
        res.render('views/profil', {title: 'Profil'})
    })

    // Profil
    app.get('/benachrichtigungen', (req, res) => {
        res.render('views/notifications', {title: 'Benachrichtigungen'})
    })


    // User login
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }))

    /*
    app.post('/login', isNotLoggedin, async (req, res) => {
        const email = req.body.email
        const password = req.body.password

        try {
            if (!email || !password) throw { message: 'Empty fields!' }

            const hashedPwd = crypto.createHash('sha256').update(password).digest('hex')
            const user = await User.findOne({ email: email, password: hashedPwd })

            if (!user) throw { message: 'Login failed!' }

            req.flash('success', 'Login successful.')
            res.redirect('/dashboard')

        } catch (exception) {
            req.flash('error', exception.message)
            return res.redirect('/login')
        }
    })
    */

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

            // Store new user
            await new User({ email: email, password: hashedPwd, firstname: firstname, lastname: lastname }).save(error => {
                if (error) throw { message: error.errmsg } // Guard clause

                req.flash('success', 'Du hast es fast geschafft. Wir haben Dir eine E-Mail geschickt. Bitte bestätige Deine Identität, indem Du auf den Link darin klickst.')
                res.redirect('/login')
            })
        } catch (exception) {
            req.flash('error', exception.message)
            return res.redirect('/login')
        }
    })

}