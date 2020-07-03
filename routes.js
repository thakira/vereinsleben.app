const User = require('./models/user-model')
const News = require('./models/news-model')
const Club = require('./models/club-model')
const crypto = require('crypto')
const LocalStrategy = require('passport-local').Strategy
const randomString = require('randomstring')
const mailer = require('./misc/mailer')
const fs = require('fs')
let logo = ""

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




    // *** REGISTRATION ***

    // Register
    app.get('/register', isNotLoggedin, async (req, res) => {
        if (!logo) {
            let myClub = await Club.findOne({'shortName':'rvss'})
            logo = myClub.logo
        }
        res.render('views/register', {
            title: 'Registrierung',
            logo: logo
        })
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

            //await mailer.sendEmail('mailbestaetigung@vereinsleben.app', email, 'Vereinsleben.app: Bitte bestätige Deine E-Mail-Adresse', html)

            console.log("mail send")
            //req.flash('success', 'Du hast es fast geschafft. Wir haben Dir eine E-Mail geschickt. Bitte bestätige Deine Identität, indem Du auf den Link darin klickst.')
            req.flash('success', 'Du kannst Dich nun anmelden. (Email-Bestätigung wird noch implementiert)')
            res.redirect('/login')
        } catch (exception) {
            req.flash('error', exception.message)
            return res.redirect('/login')
        }
    })

// **********************************************************************************************************


    // *** Login ***
    app.get('/login', isNotLoggedin, async (req, res) => {
        let myClub = await Club.findOne({'shortName':'rvss'})
        logo = myClub.logo
        res.render('views/login', {
            title: 'Anmelden',
            logo: logo
        })
    })


    // *** User login ***
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

    // User logout
    app.get('/logout', isLoggedin, (req, res) => {
        req.logout()
        req.flash('success', 'Du hast Dich erfolgreich abgemeldet.')
        res.redirect('/login')
    })

    // *** Password forgot ***
    app.get('/pwdforgot', isNotLoggedin, (req, res) => {
        res.render('views/pwdforgot', {
            title: 'Passwort vergessen',
            logo: logo
        })
    })

    // *** Termine ***
    app.get('/termine', isLoggedin, (req, res) => {
        res.render('views/termine-site', {
            title: 'Termine',
            user: req.user
        })
    })

    // *** Arbeitsstunden ***
    app.get('/arbeitsstunden', isLoggedin, (req, res) => {
        res.render('views/arbeitsstunden-site', {
            title: 'Arbeitsstunden',
            user: req.user
        })
    })

    // *** NEWS ***
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

// Editorjs
    app.get('/editorjs', (req, res) => {
        res.render('views/editorjs', {
            title: 'EditorJS',
            user: {firstname: "Marcus", nachname: "Kirschen"}
            //user: req.user
        })
    })

// News
    app.get('/aktuelles', isLoggedin, (req, res) => {
        res.render('views/aktuelles-site', {title: 'Aktuelles',
            user: req.user,
            news: news
        })
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

    // ********************************************************************************************/

    // *** MEMBERS ***
    app.get('/getMemberData', async(req, res, next) => {
        await User.find({}, 'firstname lastname mobile phone email birthday workhours worked memberNumber role createdAt', function (err, users) {
            if (err) return next(err);
 //           users = JSON.stringify({"data": users});
            let data = JSON.stringify({
                "draw": req.body.draw,
                "data": users
            });
            res.send(data);
        });
    });

    // Mitglieder
    app.get('/mitglieder', isLoggedin, async(req, res) => {
        res.render('views/mitglieder', {
            title: 'Mitglieder',
            user: req.user
        })
    })


    app.post('/editMember', async (req, res) => {
        //console.log("editMember")
        let id = (Object.keys(req.body.data)[0]);

        try {
            const user = await User.findOne({"_id": (Object.keys(req.body.data)[0])})
            if (!user) {
                req.flash('error', 'User nicht gefunden')
            }
            user.firstname = req.body.data[id].firstname
            user.last_name = req.body.data[id].lastname
            user.mobile = req.body.data[id].mobile
            user.phone = req.body.data[id].phone
            user.email = req.body.data[id].email
            user.birthday = req.body.data[id].birthday
            user.memberNumber = req.body.data[id].memberNumber
            user.role = req.body.data[id].role
            await user.save()


            const users = await User.find({}, 'firstname lastname mobile phone email birthday workhours worked memberNumber role createdAt')
            let data = JSON.stringify({
                "draw": req.body.draw,
                "data": users
            });
            res.send(data);
            //res.redirect('/mitglieder_datatables')
            //console.log("DB:" + user.firstname + ", req:" + first_name);
            /*if (user.firstname != req.query['firstname']) {
                user.firstname = req.query['firstname'];*/
        } catch (exception) {
            req.flash('error', exception.message)
            //res.redirect('/mitglieder_datatables')
        }

    })

    app.delete('/deleteMember', async (req, res) => {
        try {
            await User.findOneAndDelete({"_id": (Object.keys(req.query.data)[0])})

            const users = await User.find({}, 'firstname lastname mobile phone email birthday workhours worked memberNumber role createdAt')
            let data = JSON.stringify({
                "draw": req.body.draw,
                "data": users
            });
            res.send(data);
        } catch (exception) {
                req.flash('error', exception.message)
                res.send("NOT OK")
            }
    })

    // ********************************************************************************************


    // *** Gruppen ***
    app.get('/gruppen', isLoggedin, (req, res) => {
        res.render('views/gruppen', {
            title: 'Gruppen',
            user: req.user
        })
    })

    // *** Einstellungen Verein ***
    app.get('/settings-verein', isLoggedin, (req, res) => {
        res.render('views/settings-verein', {
            title: 'Einstellungen Verein',
            user: req.user
        })
    })

    // *** Profil ***
    app.get('/profil', isLoggedin, (req, res) => {
        res.render('views/profil', {
            title: 'Profil', user: req.user,
            user: req.user
        })
    })

    app.post('/editprofil', isLoggedin, async (req, res) => {
        try {
            const user = await User.findOne({"_id": req.user._id})
            user.firstname = req.body.firstname
            user.lastname = req.body.lastname
            user.mobile = req.body.mobile
            user.phone = req.body.phone
            user.email = req.body.email
            user.birthday = req.body.birthday
            user.password = (req.password > 0) ? req.password : user.password
            await user.save()
            res.send("OK")
        }
        catch (exception) {
            req.flash('error', exception.message)
            res.send("NOT OK")
        }
    })

    app.post('/profilimage', isLoggedin, async (req, res) => {
        try {
            const user = await User.findOne({"_id": req.user._id})
            user.img = req.body.img
            await user.save()
            res.send("OK")
        }
        catch (exception) {
            req.flash('error', exception.message)
            res.send("NOT OK")
        }
    })

    app.get('/notifications', isLoggedin, (req, res) => {
        res.render('views/notifications', {
            title: 'Benachrichtigungen',
            user: req.user
        })
    })

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