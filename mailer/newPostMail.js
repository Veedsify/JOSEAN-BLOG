const mail = require("./config");
const htmlMailTemplate = require("./templateRegisteration");

let infoText = 'a new post needs your approval, please login to approve email';


function newpostmail(name, email, link) {

    let info = mail.sendMail({
        from: `Bloggy Stories <${process.env.MAILUSER}>`, // sender address
        to: email, // list of receivers
        subject: "Approve a new post", // Subject line
        html: htmlMailTemplate(`Hi ${name}`, infoText, "Login Now", link), // html body
    }, (err) => {
        if (!err, info) {
            console.log('Mail Sent' + info)
        }
    });

    return info
}

module.exports = newpostmail

