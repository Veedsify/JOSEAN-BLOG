const mail = require("./config");
const htmlMailTemplate = require("./templateRegisteration");

let infoText = 'Thanks for signing up to be an author here at bloggy stories, we\'ll need you to confirm your email address by clicking the link below';

function sendRegisterEmail(name, email, link) {

    let info = mail.sendMail({
        from: `Bloggy Stories <${process.env.MAILUSER}>`, // sender address
        to: email, // list of receivers
        subject: "Complete Registeration", // Subject line
        html: htmlMailTemplate(`Hi ${name}`, infoText, "Verify Account", link), // html body
    }, (err) => {
        if (!err, info) {
            console.log('Mail Sent' + info)
        }
    });

    return info
}

let resetText = `To reset your password on bloggystories, do click the link below`

function resetLink(name, email, link) {

    let info = mail.sendMail({
        from: `Bloggy Stories <${process.env.MAILUSER}>`, // sender address
        to: email, // list of receivers
        subject: `Password Reset - ${name}`, // Subject line
        html: htmlMailTemplate(`Hi ${name}`, resetText, "Reset My Account", link), // html body
    }, (err) => {
        if (!err, info) {
            console.log('Mail Sent' + info)
        }
    });

    return info
}

module.exports = { sendRegisterEmail, resetLink }

