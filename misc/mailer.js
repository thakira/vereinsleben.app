const nodemailer = require("nodemailer")

const MAIL_USER  = 'mailbestaetigung@vereinsleben.app'
const MAIL_PASS = 'e?WaagDpJ0RT'

const transport = nodemailer.createTransport({
    host: "de10.fcomet.com",
    port: 465,
    secure: true, //use TLS
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS
    }
})

module.exports = {
    sendEmail(from, to, subject, html) {
        return new Promise((resolve, reject) => {
            transport.sendMail({from, subject, to, html}, (err, info) => {
                if(err) reject(err);
                resolve(info);
            })
        })
    }
}