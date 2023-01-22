const nodemailer = require('nodemailer');

let mail = nodemailer.createTransport({
host: process.env.MAILHOST,
port: process.env.MAILPORT,
secure: true,
auth: {
    user: process.env.MAILUSER,
    pass: process.env.MAILPASS
    }
})


module.exports = mail


