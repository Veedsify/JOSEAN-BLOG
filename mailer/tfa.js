const mail = require("./config");
const authMailTemplate = require("./templateVcode");

let infoText = 'You authorized a login in, on Bloggy Stories, use the code below to verify';

function sendVcodeEmail(name, email, code) {

    mail.sendMail({
        from: `Bloggy Stories <${process.env.MAILUSER}>`, // sender address
        to: email, // list of receivers
        subject: "Two Step Verification: Code", // Subject line
        html: authMailTemplate(`Hi ${name}`, infoText,  code), // html body
    }, (err) => {
        if (!err) {
            console.log('Mail Sent')
        }
    });

    return ;
}

module.exports = sendVcodeEmail

