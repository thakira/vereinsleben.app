const User = require('./models/user-model')
const News = require('./models/news-model')
const crypto = require('crypto')
const LocalStrategy = require('passport-local').Strategy
const randomString = require('randomstring')
const mailer = require('./misc/mailer')
const fs = require('fs')


const news =
    [
        {
            "_id": {
                "$oid": "5ebced9867shgf456f004e05d1"
            },
            "newsTitle": "Card Title 1",
            "newsText": "Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans.\n" +
                "\n" +
                "Ein kleines Bächlein namens Duden fließt durch ihren Ort und versorgt sie mit den nötigen Regelialien. Es ist ein paradiesmatisches Land, in dem einem gebratene Satzteile in den Mund fliegen.\n" +
                "\n" +
                "Nicht einmal von der allmächtigen Interpunktion werden die Blindtexte beherrscht – ein geradezu unorthographisches Leben. Eines Tages aber beschloß eine kleine Zeile Blindtext, ihr Name war Lorem Ipsum, hinaus zu gehen in die weite Grammatik.\n" +
                "\n" +
                "Der große Oxmox riet ihr davon ab, da es dort wimmele von bösen Kommata, wilden Fragezeichen und hinterhältigen Semikoli, doch das Blindtextchen ließ sich nicht beirren. Es packte seine sieben Versalien, schob sich sein Initial in den Gürtel und machte sich auf den Weg.\n" +
                "\n" +
                "Als es die ersten Hügel des Kursivgebirges erklommen hatte, warf es einen letzten Blick zurück auf die Skyline seiner Heimatstadt Buchstabhausen, die Headline von Alphabetdorf und die Subline seiner eigenen Straße, der Zeilengasse. Wehmütig lief ihm eine rhetorische Frage über die Wange, dann setzte es seinen Weg fort. Unterwegs traf es eine Copy. Die Copy warnte das Blindtextchen, da, wo sie herkäme wäre sie",
            "newsImg": "",
            "newsDoc": "",
            "newsReleased": true,
            "newsType": "text",
            "createdAt": {
                "$date": "2020-05-14T07:04:56.104Z"
            }
        }, {
        "_id": {
            "$oid": "5ebced98ghf7456004e05d1"
        },
        "newsTitle": "Card Title 4",
        "newsText": "Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans.\n" +
            "\n" +
            "Ein kleines Bächlein namens Duden fließt durch ihren Ort und versorgt sie mit den nötigen Regelialien. Es ist ein paradiesmatisches Land, in dem einem gebratene Satzteile in den Mund fliegen.\n" +
            "\n" +
            "Nicht einmal von der allmächtigen Interpunktion werden die Blindtexte beherrscht – ein geradezu unorthographisches Leben. Eines Tages aber beschloß eine kleine Zeile Blindtext, ihr Name war Lorem Ipsum, hinaus zu gehen in die weite Grammatik.\n" +
            "\n" +
            "Der große Oxmox riet ihr davon ab, da es dort wimmele von bösen Kommata, wilden Fragezeichen und hinterhältigen Semikoli, doch das Blindtextchen ließ sich nicht beirren. Es packte seine sieben Versalien, schob sich sein Initial in den Gürtel und machte sich auf den Weg.\n" +
            "\n" +
            "Als es die ersten Hügel des Kursivgebirges erklommen hatte, warf es einen letzten Blick zurück auf die Skyline seiner Heimatstadt Buchstabhausen, die Headline von Alphabetdorf und die Subline seiner eigenen Straße, der Zeilengasse. Wehmütig lief ihm eine rhetorische Frage über die Wange, dann setzte es seinen Weg fort. Unterwegs traf es eine Copy. Die Copy warnte das Blindtextchen, da, wo sie herkäme wäre sie",
        "newsImg": "/beispielfoto-voltigieren.jpg",
        "newsDoc": "",
        "newsReleased": true,
        "newsType": "image",
        "createdAt": {
            "$date": "2020-04-21T07:04:56.104Z"
        }
    }, {
            "_id": {
                "$oid": "5easd3423560f004e05d1"
            },
            "newsTitle": "Card Title 2",
            "newsText": "Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans.\n" +
                "\n" +
                "Ein kleines Bächlein namens Duden fließt durch ihren Ort und versorgt sie mit den nötigen Regelialien. Es ist ein paradiesmatisches Land, in dem einem gebratene Satzteile in den Mund fliegen.\n" +
                "\n" +
                "Nicht einmal von der allmächtigen Interpunktion werden die Blindtexte beherrscht – ein geradezu unorthographisches Leben. Eines Tages aber beschloß eine kleine Zeile Blindtext, ihr Name war Lorem Ipsum, hinaus zu gehen in die weite Grammatik.\n" +
                "\n" +
                "Der große Oxmox riet ihr davon ab, da es dort wimmele von bösen Kommata, wilden Fragezeichen und hinterhältigen Semikoli, doch das Blindtextchen ließ sich nicht beirren. Es packte seine sieben Versalien, schob sich sein Initial in den Gürtel und machte sich auf den Weg.\n" +
                "\n" +
                "Als es die ersten Hügel des Kursivgebirges erklommen hatte, warf es einen letzten Blick zurück auf die Skyline seiner Heimatstadt Buchstabhausen, die Headline von Alphabetdorf und die Subline seiner eigenen Straße, der Zeilengasse. Wehmütig lief ihm eine rhetorische Frage über die Wange, dann setzte es seinen Weg fort. Unterwegs traf es eine Copy. Die Copy warnte das Blindtextchen, da, wo sie herkäme wäre sie",
            "newsImg": "/beispielfoto-voltigieren.jpg",
            "newsDoc": "",
            "newsReleased" : true,
            "newsType": "image",
            "createdAt": {
                "$date": "2020-04-21T07:04:56.104Z"
            }
        }, {
        "_id": {
            "$oid": "5ebcedgas5763780f004e05d1"
        },
        "newsTitle": "Card Title ",
        "newsText": "Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans.\n" +
            "\n" +
            "Ein kleines Bächlein namens Duden fließt durch ihren Ort und versorgt sie mit den nötigen Regelialien. Es ist ein paradiesmatisches Land, in dem einem gebratene Satzteile in den Mund fliegen.\n" +
            "\n" +
            "Nicht einmal von der allmächtigen Interpunktion werden die Blindtexte beherrscht – ein geradezu unorthographisches Leben. Eines Tages aber beschloß eine kleine Zeile Blindtext, ihr Name war Lorem Ipsum, hinaus zu gehen in die weite Grammatik.\n" +
            "\n" +
            "Der große Oxmox riet ihr davon ab, da es dort wimmele von bösen Kommata, wilden Fragezeichen und hinterhältigen Semikoli, doch das Blindtextchen ließ sich nicht beirren. Es packte seine sieben Versalien, schob sich sein Initial in den Gürtel und machte sich auf den Weg.\n" +
            "\n" +
            "Als es die ersten Hügel des Kursivgebirges erklommen hatte, warf es einen letzten Blick zurück auf die Skyline seiner Heimatstadt Buchstabhausen, die Headline von Alphabetdorf und die Subline seiner eigenen Straße, der Zeilengasse. Wehmütig lief ihm eine rhetorische Frage über die Wange, dann setzte es seinen Weg fort. Unterwegs traf es eine Copy. Die Copy warnte das Blindtextchen, da, wo sie herkäme wäre sie",
        "newsImg": "",
        "newsDoc": "",
        "newsReleased": true,
        "newsType": "text",
        "createdAt": {
            "$date": "2020-05-14T07:04:56.104Z"
        }
    }, {
        "_id": {
            "$oid": "5ebce345567560f004e05d1"
        },
        "newsTitle": "Card Title 3",
        "newsText": "Weit hinten, hinter den Wortbergen, fern der Länder Vokalien und Konsonantien leben die Blindtexte. Abgeschieden wohnen sie in Buchstabhausen an der Küste des Semantik, eines großen Sprachozeans.\n" +
            "\n" +
            "Ein kleines Bächlein namens Duden fließt durch ihren Ort und versorgt sie mit den nötigen Regelialien. Es ist ein paradiesmatisches Land, in dem einem gebratene Satzteile in den Mund fliegen.\n" +
            "\n" +
            "Nicht einmal von der allmächtigen Interpunktion werden die Blindtexte beherrscht – ein geradezu unorthographisches Leben. Eines Tages aber beschloß eine kleine Zeile Blindtext, ihr Name war Lorem Ipsum, hinaus zu gehen in die weite Grammatik.\n" +
            "\n" +
            "Der große Oxmox riet ihr davon ab, da es dort wimmele von bösen Kommata, wilden Fragezeichen und hinterhältigen Semikoli, doch das Blindtextchen ließ sich nicht beirren. Es packte seine sieben Versalien, schob sich sein Initial in den Gürtel und machte sich auf den Weg.\n" +
            "\n" +
            "Als es die ersten Hügel des Kursivgebirges erklommen hatte, warf es einen letzten Blick zurück auf die Skyline seiner Heimatstadt Buchstabhausen, die Headline von Alphabetdorf und die Subline seiner eigenen Straße, der Zeilengasse. Wehmütig lief ihm eine rhetorische Frage über die Wange, dann setzte es seinen Weg fort. Unterwegs traf es eine Copy. Die Copy warnte das Blindtextchen, da, wo sie herkäme wäre sie",
        "newsImg": "/beispielfoto-voltigieren.jpg",
        "newsDoc": "",
        "newsReleased": true,
        "newsType": "image",
        "createdAt": {
            "$date": "2020-04-01T07:04:56.104Z"
        }
    }
    ]

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
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            //if (!email || !password) throw { message: 'Empty fields!' }

            const hashedPwd = crypto.createHash('sha256').update(password).digest('hex')
            const user = await User.findOne({email: email, password: hashedPwd})
            if (!user) return done(null, false, 'Anmeldung fehlgeschlagen!')
            if (!user.verified) return done(null, false, 'E-Mail wurde noch nicht bestätigt!')
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
    app.get('/dashboard', isLoggedin, async (req, res) => {
        return res.render('views/dashboard', {
            title: 'Dashboard',
            user: req.user,
            news: news
        })
    })

    let logo = 'data:image/png;base64,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'

    // Register
    app.get('/register', isNotLoggedin, (req, res) => {
        res.render('views/register', {
            title: 'Registrieren',
            logo: logo
        })
    })

    // Register
    app.get('/editorjs', (req, res) => {
        res.render('views/editorjs', {
            title: 'EditorJS',
            user: {firstname: "Marcus", nachname: "Kirschen"}
            //user: req.user
        })
    })

    // Login
    app.get('/login', isNotLoggedin, (req, res) => {
        res.render('views/login', {
            title: 'Anmelden',
            logo: logo
        })
    })

    // Password forgot
    app.get('/pwdforgot', isNotLoggedin, (req, res) => {
        res.render('views/pwdforgot', {
            title: 'Passwort vergessen',
            logo: logo
        })
    })

    // News
    app.get('/aktuelles', isLoggedin, (req, res) => {
        res.render('views/aktuelles-site', {title: 'Aktuelles',
            user: req.user,
            news: news
        })
    })

    // Termine
    app.get('/termine', isLoggedin, (req, res) => {
        res.render('views/termine-site', {
            title: 'Termine',
            user: req.user
        })
    })

    // Arbeitsstunden
    app.get('/arbeitsstunden', isLoggedin, (req, res) => {
        res.render('views/arbeitsstunden-site', {
            title: 'Arbeitsstunden',
            user: req.user
        })
    })

    app.get('/getMemberData', async(req, res, next) => {
        await User.find({}, 'firstname lastname mobile phone email birthday workhours worked memberNumber role createdAt', function (err, users) {
            if (err) return next(err);
            users = JSON.stringify({"components": users}, null, 4);
            //console.log(users);
            res.send(users);
        });
    });

    // Mitglieder
    app.get('/mitglieder', isLoggedin, async(req, res) => {
        res.render('views/mitglieder', {
            title: 'Mitglieder',
            user: req.user
        })
    })
    /*// Mitglieder
    app.get('/mitglieder', isLoggedin, async (req, res) => {
        //let result = await User.find({});
        //console.log("result: " + result);
        const users = await User.find({});*/
        //console.log(users);
        /*const users = () => {
            "[" +
            foreach(user in users_db)
            {
                "{"

            }
        }
        [{
                "_id": {
                    "$oid": "5ebced98e165540f004e05d1"
                },
                "firstname": "Marcus",
                "lastname": "Kirschen",
                "mobile" : "0123 456789",
                "phone" : "0123 456789",
                "email": "mail@mkirschen.de",
                "birthday": "1983-07-21T00:00:0.104Z",
                "workhours": 10,
                "worked": 10,
                "memberNumber": 1056,
                "role": "admin",
                "createdAt": {
                    "$date": "2020-05-14T07:04:56.104Z"
                }
            },{
                "_id": {
                    "$oid": "5ebd2023c8978454a007a097"
                },
                "firstname": "Emil",
                "lastname": "Meier",
                "mobile" : "0123 456789",
                "phone" : "0123 456789",
                "email": "em@mail.de",
                "birthday": "1963-04-18T00:00:0.104Z",
                "workhours": 10,
                "worked": 8,
                "memberNumber": "",
                "role": "user",
                "createdAt": {
                    "$date": "2020-04-30T07:04:56.104Z"
                }
            },{
                "_id": {
                    "$oid": "5ebd205bc8978454a007a098"
                },
                "firstname": "Saskia",
                "lastname": "Meier",
                "mobile" : "0123 456789",
                "phone" : "0123 456789",
                "email": "dm@mail.de",
                "birthday": "1998-12-11T00:00:0.104Z",
                "workhours": 10,
                "worked": 3,
                "memberNumber": "",
                "role": "trainer",
                "createdAt": {
                    "$date": "2020-05-03T07:04:56.104Z"
                }
            },{
                "_id": {
                    "$oid": "5ebd206ec8978454a007a099"
                },
                "firstname": "Brigitte",
                "lastname": "Muster",
                "mobile" : "0123 456789",
                "phone" : "0123 456789",
                "email": "bm@muster.de",
                "birthday": "2001-01-28T00:00:0.104Z",
                "workhours": 10,
                "worked": 6,
                "memberNumber": "5623",
                "role": "user",
                "createdAt": {
                    "$date": "2020-04-19T07:04:56.104Z"
                }
            }]*/

/*        res.render('views/mitglieder', {
            title: 'Mitglieder',
            user: req.user,
            users: users })
    })*/

    // Gruppen
    app.get('/gruppen', isLoggedin, (req, res) => {
        res.render('views/gruppen', {
            title: 'Gruppen',
            user: req.user
        })
    })

    // Einstellungen Verein
    app.get('/settings-verein', isLoggedin, (req, res) => {
        res.render('views/settings-verein', {
            title: 'Einstellungen Verein',
            user: req.user
        })
    })

    // Profil
    app.get('/profil', isLoggedin, (req, res) => {
        res.render('views/profil', {
            title: 'Profil', user: req.user,
            user: req.user
        })
    })

    // Profil
    app.get('/notifications', isLoggedin, (req, res) => {
        res.render('views/notifications', {
            title: 'Benachrichtigungen',
            user: req.user
        })
    })

    // User login
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }))

    // User verify
    app.get('/verify', isNotLoggedin, async (req, res) => {
        try {
            const user = await User.findOne({'secretToken': req.query['token']})
            if (!user) {
                req.flash('error', 'Es gibt keinen Benutzer mit diesem Authentifizierungscode.')
                res.redirect('/login')
            }
            //console.log(req.query['token'])
            user.verified = true
            user.secretToken = ''
            await user.save()
            req.flash('success', 'Deine E-Mail-Adresse wurde verifiziert. Du kannst Dich jetzt anmelden.')
            res.redirect('/login')
        } catch (exception) {
            req.flash('error', exception.message)
        }
    })

    app.post('/editMember', async (req, res) => {
        console.log("editMember")
        try {
            const user = await User.findOne({"_id": req.query['id']})
            if (!user) {
                req.flash('error', 'User nicht gefunden')
            }
            console.log("DB:" + user.firstname + "req:" + req.query['firstname']);
            /*if (user.firstname != req.query['firstname']) {
                user.firstname = req.query['firstname'];*/
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

    //News hinzufügen
    app.post('/addNews', async (req, res) => {
        try {
            const time = req.body.time
            const blocks = req.body.blocks
            const version = req.body.version

            await new News({
                time: time,
                blocks: blocks,
                version: version
            }).save(error => {
                console.log("Speichern erfolgreich")
                if (error) throw {
                    message: error.errmsg
                }
            })
        } catch (exception) {
            req.flash('error', exception.message)
        }
    })



    // Register a new user
    app.post('/register', isNotLoggedin, async (req, res) => {
        console.log("Register startet.")
        try {
            const email = req.body.email
            const repEmail = req.body.repEmail
            const password = req.body.password
            const repPasswd = req.body.repPwd
            const firstname = req.body.firstname
            const lastname = req.body.lastname

            if (!email || !repEmail || !password || !repPasswd || !firstname || !lastname) {
                console.log('Empty fields')
                return res.send('Empty fields')
            }

            // Check if email address is already registered
            const emails = await User.find({email: email})

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
            const verified = true

            console.log("User anlegen starten")

            // Store new user
            await new User({
                email: email,
                password: hashedPwd,
                firstname: firstname,
                lastname: lastname,
                verified: verified,
                secretToken: secretToken
            }).save(error => {
                console.log("User anlegen erfolgreich")
                if (error) throw {message: error.errmsg} // Guard clause
            })
            //E-Mail verschicken
            const html = `Willkommen bei Vereinsleben.app,
            <br>
            Um Deine E-Mail-Adresse zu bestätigen, klicke bitte auf folgenden Link:
            <br>
            <a href="http://localhost:80/verify?token=${secretToken}">http://localhost:80/verify?token=${secretToken}</a>`
            console.log("mail created: " + html)

            await mailer.sendEmail('mailbestaetigung@vereinsleben.app', email, 'Vereinsleben.app: Bitte bestätige Deine E-Mail-Adresse', html)

            console.log("mail send")
            //req.flash('success', 'Du hast es fast geschafft. Wir haben Dir eine E-Mail geschickt. Bitte bestätige Deine Identität, indem Du auf den Link darin klickst.')
            req.flash('success', 'Du kannst Dich nun anmelden. (Email-Bestätigung wird noch implementiert)')
            res.redirect('/login')
        } catch (exception) {
            req.flash('error', exception.message)
            return res.redirect('/login')
        }
    })

    // // Upload a picture
    // app.post('/profil', isLoggedin, upload.single('image'), async (req, res) => {
    //     console.log(req.file)
    //     try {
    //         const encImg = req.file.toString('base64');
    //         req.user.img = encImg
    //         //req.user.img.contentType = 'image/png';
    //         req.user.save();
    //         req.flash('error', exception.message)
    //         return res.redirect('/profil')
    //     } catch (exception) {
    //         req.flash('error', exception.message)
    //         return res.redirect('/profil')
    //     }
    // })

    // Upload a picture
    app.post('/profil', isLoggedin, async (req, res) => {
        try {
            req.user.img = fs.readAsDataURL(req.file)
            //const encImg = req.file.toString('base64');
            //req.user.img = encImg
            //req.user.img.contentType = 'image/png';
            req.user.save();
            req.flash('success', "Dein Bild wurde hochgeladen")
            return res.redirect('/profil')
        } catch (exception) {
            req.flash('error', exception.message)
            return res.redirect('/profil')
        }
    })
}