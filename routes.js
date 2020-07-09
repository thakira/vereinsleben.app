const User = require('./models/user-model')
const News = require('./models/news-model')
const Club = require('./models/club-model')
const Task = require('./models/task-model')
const crypto = require('crypto')
const LocalStrategy = require('passport-local').Strategy
const randomString = require('randomstring')
const mailer = require('./misc/mailer')
const fs = require('fs')
const helpers = require('./helpers')

const multer = require("multer");
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

let logo = ""
let tasks = true

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
    app.get('/', (req, res) => {
        res.redirect('/login')
    })

    // Dashboard
    app.get('/dashboard', isLoggedin, async (req, res) => {
        tasks_active = await Club.findOne({shortName: "rvss"})
        const news = await News.find({newsReleased: true}).sort({updatedAt: -1}).limit(5);

        let tasks = ''
        if (tasks_active.module.workhours.activate) {
            tasks = await Task.find({done: false}).sort({updatedAt: -1}).limit(5);
        }

        if(req.user.firstLogin) {
            res.redirect('/profil')
            return
        }

        return res.render('views/dashboard', {
            title: 'Dashboard',
            user: req.user,
            news: news,
            tasks: tasks
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
        try {
            const email = req.body.email
            const repEmail = req.body.repEmail
            const password = req.body.password
            const repPasswd = req.body.repPwd
            const firstname = req.body.firstname
            const lastname = req.body.lastname

            if (!email || !repEmail || !password || !repPasswd || !firstname || !lastname) {
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

            // Store new user
            await new User({
                email: email,
                password: hashedPwd,
                firstname: firstname,
                lastname: lastname,
                verified: verified,
                secretToken: secretToken
            }).save(error => {
                if (error) throw {message: error.errmsg} // Guard clause
            })
            //E-Mail verschicken
            const html = `Willkommen bei Vereinsleben.app,
            <br>
            Um Deine E-Mail-Adresse zu bestätigen, klicke bitte auf folgenden Link:
            <br>
            <a href="http://localhost:80/verify?token=${secretToken}">http://localhost:80/verify?token=${secretToken}</a>`

            //await mailer.sendEmail('mailbestaetigung@vereinsleben.app', email, 'Vereinsleben.app: Bitte bestätige Deine E-Mail-Adresse', html)
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


    // *** Arbeitsstunden ***
    app.get('/arbeitsstunden', isLoggedin, async (req, res) => {
        const tasks = await Task.find().sort({updatedAt: -1});
        res.render('views/arbeitsstunden-site', {
            title: 'Arbeitsstunden',
            tasks: tasks,
            user: req.user
        })
    })

    app.get('/add-task', isLoggedin, async (req, res) => {
        res.render('views/components/arbeitsstunden/add-task', {
            title: 'Aufgbe erstellen',
            user: req.user
        })
    })

    app.post('/add-task', isLoggedin, async (req, res) => {
        try {
            new Task({
                title: req.body.taskTitle,
                description: req.body.taskDescription,
                estimated: req.body.taskEstimated,
                headcount: req.body.taskHeadcount,
                date: req.body.taskDate,
                author: req.user._id
            })
                .save()
                .then( () => {
                    res.status(200).redirect('/arbeitsstunden');
                })
        } catch (exception) {
            req.flash('error', exception.message)
        }
    })

    app.get('/edit-task', isLoggedin, async (req, res) => {
        let task = await Task.findOne({_id: req.query.task});
        res.render('views/components/arbeitsstunden/edit-task', {
            title: 'Aufgabe bearbeiten',
            user: req.user,
            task:task
        })
    })

    app.post('/edit-task', isLoggedin, async (req, res) => {
        try {
            let task = await Task.findOne({_id: req.query.id});
            task.title = req.body.taskTitle;
            task.description = req.body.taskDescription;
            task.estimated = req.body.taskEstimated;
            task.headcount = req.body.taskHeadcount;
            task.date = req.body.taskDate;
            task.save()
                .then( () => {
                    res.status(200).redirect('/arbeitsstunden');
                })
        } catch (exception) {
            req.flash('error', exception.message)
        }
    })

    app.put('/task-cancel', isLoggedin, async (req, res) => {
        try {
            let delId = req.user._id.toString();
            Task.updateOne(
                {_id: req.query.id},
                {$pull: {participants: { $in: delId}}}
            ).then( () => {
                res.status(200).send('OK').redirect('/arbeitsstunden');
            })
        } catch (exception) {
            req.flash('error', exception.message)
        }
    })

    app.put('/task-inscribe', isLoggedin, async (req, res) => {
        try {
            let addId = req.user._id.toString();

            let inscribe = await Task.findOne({_id: req.query.id})
            inscribe.participants.push(addId);
            inscribe.save().then( () => {
                res.status(200).redirect('/arbeitsstunden')
            })
        } catch (exception) {
            req.flash('error', exception.message)
        }
    })

    app.post('/task-done', isLoggedin, async (req, res) => {
        try {
            let addId = req.user._id.toString();

            let task = await Task.findOne({_id: req.query.task})
            task.done = true,
            task.doneInfo.date = req.body.date;
            task.doneInfo.worked_hours = req.body.workedHours;
            task.doneInfo.user_id.push(addId);
            await task.save()

            let user = await User.findOne({_id: req.user._id})
            user.worked = parseInt(user.worked) + parseInt(req.body.workedHours);
            user.save()
                .then( () => {
                res.status(200).redirect('/arbeitsstunden')
            })
        } catch (exception) {
            req.flash('error', exception.message)
        }
    })

    app.delete('/delete-task', isLoggedin, async (req, res) => {
        try {
            await Task.findOneAndDelete({_id: req.query.id})

            const tasks = await Task.find();
            return res.render('views/arbeitsstunden-site', {
                title: 'Arbeitsstunden',
                tasks: tasks,
                user: req.user
            })
        } catch (exception) {
            req.flash('error', exception.message)
        }
    })

    // *** NEWS ***
    app.get('/aktuelles', isLoggedin, async (req, res) => {
        club = await Club.findOne({'shortName': 'rvss'})
        tasks = club.module.workhours.activate
        const news = await News.find().sort({updatedAt: -1});

        res.render('views/aktuelles-site', {
            title: 'Aktuelles',
            user: req.user,
            news: news,
            tasks: tasks
        })
    })

    app.get('/add-news', isLoggedin, async (req, res) => {
        res.render('views/add-news', {
            title: 'Neuen Artikel erstellen',
            user: req.user
        })
    })

    // News hinzufügen
    app.post('/addNews', isLoggedin, async (req, res) => {
        try {
            let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('newsImg');

            upload(req, res, (err) => {
                const newsTitle = req.body.newsTitle
                const newsText = req.body.newsText
                const newsReleased = req.body.newsReleased
                const newsAuthor = req.user._id
                let newsImg = req.body.newsImg
                let newsType = 'text'

                if (req.file) {
                    newsImg = req.file.path
                    newsType = 'image'
                }
                else if (req.fileValidationError) {
                    return res.send(req.fileValidationError);
                }
                else if (err instanceof multer.MulterError) {
                    return res.send(err);
                }
                else if (err) {
                    return res.send(err);
                }

                new News({
                    newsTitle: newsTitle,
                    newsText: newsText,
                    newsReleased: newsReleased,
                    newsAuthor: newsAuthor,
                    newsImg: newsImg,
                    newsType: newsType
                })
                    .save()
                    .then( () => {
                        res.status(200).redirect('/aktuelles')
                    })
            });

        } catch (exception) {
            req.flash('error', exception.message)
        }
    });

    app.get('/edit-news', isLoggedin, async (req,res) => {
        try {
            const newsId = req.query.id;
            const article = await News.findOne({_id: newsId})

            return res.render('views/edit-news', {
                title: 'Artikel bearbeiten',
                article: article,
                user: req.user
            })
        } catch (exception) {
            req.flash('error', exception.message)
        }
    });

    app.post('/edit-news', isLoggedin, async (req,res) => {
        try {
            let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('newsImg');

            let newsTitle
            let newsText
            let newsReleased
            let newsImg = ''
            let newsType

            upload(req, res, (err) => {
                newsTitle = req.body.newsTitle
                newsText = req.body.newsText
                newsReleased = req.body.newsReleased
                newsType = req.body.newsType
                if (req.file && newsType === 'image') {
                    newsImg = req.file.path
                }
                else if (req.fileValidationError) {
                    return res.send(req.fileValidationError);
                }
                else if (err instanceof multer.MulterError) {
                    return res.send(err);
                }
                else if (err) {
                    return res.send(err);
                }

                News.findOneAndUpdate({_id: req.query.id}, {
                    newsTitle: newsTitle,
                    newsText: newsText,
                    newsReleased: newsReleased,
                    newsType: newsType,
                    newsImg: newsImg
                }).then( function() {
                    res.status(200).redirect('/aktuelles')
                })
            });
        } catch (exception) {
            req.flash('error', exception.message)
        }
    });

    app.delete('/delete-news', isLoggedin, async (req,res) => {
        try {
            await News.findOneAndDelete({'_id': req.query.id})
            const news = await News.find();
            return res.render('views/aktuelles-site', {
                title: 'Aktuelles',
                news: news,
                user: req.user
            })
        } catch (exception) {
            req.flash('error', exception.message)
        }
    });

// ********************************************************************************************/

    // *** MEMBERS ***
    app.get('/mitglieder', isLoggedin, async(req, res) => {
        const club = await Club.findOne({'shortName': 'rvss'})
        const tasks = club.module.workhours.activate
        const users = await User.find({}, '_id firstname lastname mobile phone email birthday workhours worked memberNumber role createdAt').sort({lastname: 1})

        res.render('views/mitglieder', {
            title: 'Mitglieder',
            user: req.user,
            tasks: tasks,
            users: users
        })
    })

    app.get('/getMemberData', async (req, res) => {
        await User.find({}, '_id firstname lastname mobile phone email birthday workhours worked memberNumber role createdAt', function (err, users) {
            if (err) return next(err);
            res.send(JSON.stringify(users));
        });
    })

    app.post('/editMember', async (req, res) => {
        try {
            await User.findOneAndUpdate(
                {_id: req.query.id},
                {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    mobile: req.body.mobile,
                    phone: req.body.phone,
                    email: req.body.email,
                    memberNumber: req.body.memberNumber,
                    role: req.body.role
                })
                res.status(200).redirect('/mitglieder');
        } catch (exception) {
            req.flash('error', exception.message)
        }

    })

    app.delete('/deleteMember', async (req, res) => {
        try {
            await User.findOneAndDelete({_id: req.query.id})
            res.status(200);
        } catch (exception) {
                req.flash('error', exception.message)
                res.send("NOT OK")
            }
    })

    // ********************************************************************************************

    // *** Einstellungen Verein ***
    app.get('/verein-settings', isLoggedin, async (req, res) => {
        club = await Club.findOne({'shortName': 'rvss'})
        tasks = club.module.workhours.activate
        res.render('views/verein-settings', {
            title: 'Einstellungen Verein',
            user: req.user,
            club: club,
            tasks: club.module.workhours.activate
        })
    })

    app.post('/club-settings', isLoggedin, async (req, res) => {
        try {
            const activateWorkhours = (req.body.workhours) ? req.body.workhours : false;
            const defaultWorkhours = (req.body.defaultWorkhours) ? req.body.defaultWorkhours : 10;

            Club.findOneAndUpdate({_id: req.query.id}, {
                clubName: req.body.clubName,
                email: req.body.email,
                phone: req.body.phone,
                address: {
                    street: req.body.street,
                    number : req.body.number,
                    zip : req.body.zip,
                    city : req.body.city
                },
                module: {
                    workhours: {
                        activate: activateWorkhours,
                        defaultWorkhours: defaultWorkhours
                    }
                }
            }).then( function() {
                res.status(200).redirect('/verein-settings')
            })
        }
        catch (exception) {
            req.flash('error', exception.message)
            res.send("NOT OK")
        }
    })

    app.post('/clublogo', isLoggedin, async (req, res) => {
        try {
            await Club.findOneAndUpdate(
                {"_id": req.query.id},
                {logo: req.body.img}
            )
            res.status(200).send('OK')
        }
        catch (exception) {
            req.flash('error', exception.message)
            res.send("NOT OK")
        }
    })

    // *** Profil ***
    app.get('/profil', isLoggedin, async (req, res) => {
        club = await Club.findOne({'shortName': 'rvss'})
        tasks = club.module.workhours.activate

        let firstLogin = false;
        if(req.user.firstLogin) {
            firstLogin = true
        }

        res.render('views/profil', {
            title: 'Profil', user: req.user,
            user: req.user,
            tasks: tasks,
            firstLogin: firstLogin
        })
        await User.findOneAndUpdate({_id:req.user._id}, {firstLogin: false})
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
            res.status(200).send("OK")
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
}