const express = require('express');
const { User } = require('../db/db');
const { randomChars, getHash } = require('../function/gethash');
const router = express.Router();
const path = require('path');
const sendRegisterEmail = require('../mailer/confirmRegisteration');

router.get('/', (req, res) => {
    if (req.session.plan) {
        if (req.session.plan.length > 0) {
            res.render('auth-register')
        } else {
            res.redirect('/membership')
        }
    } else {
        res.redirect('/membership')
    }
})

function checkEmail(req, res, next) {

    let email = req.body.email

    User.find({ email: email }, (err, email) => {
        if (email.length > 0) {
            let script = VirtualAJax("runResponse({ type: 'alert', text: 'User Already Exists', css: 'bad' })")
            return res.render('auth-register', { script })
        } else {
            next()
        }
    })

}
function checkUserName(req, res, next) {

    let username = req.body.username

    User.find({ user_name: username }, (err, usernames) => {
        if (usernames.length > 0) {
            let script = VirtualAJax("runResponse({ type: 'alert', text: 'User Already Exists', css: 'bad' })")
            return res.render('auth-register', { script })
        } else {
            next()
        }
    })
}
router.get('/pay/canceled', (req, res, next)=>{
    req.session.destroy()
    res.redirect('/register')
})
router.post('/new', checkEmail, checkUserName, (req, res, next) => {

    let fullname = req.body.fullname
    let email = req.body.email
    let username = req.body.username
    let password = req.body.password
    let hashedPassword = getHash(password)
    let vcodeId = randomChars(19)
    let resetId = getHash(fullname)
    let valid = validateFields(fullname, email, username, password, res)

    if (valid === 'proceed') {
        if (req.session.plan !== 'paid') {

            let newUser = new User({
                name: fullname,
                user_name: username,
                email: email,
                password: hashedPassword,
                role: 'user',
                bio:'',
                membership: 'free',
                verification: vcodeId,
                verified: 'false',
                status: 'hidden',
                statusAdmin: 'public',
                profile_image: '/IMAGES/user.png',
                reset_id: resetId,
                duration: 5000000,
                tfa: 'off'
            })

            newUser.save((err) => {
                if (!err) {
                    // SEND EMAIL HERE TO VERIFY
                    let confirmlink = `http://${req.get('host')}/register/validate/${vcodeId}?aouth=${resetId}`
                    sendRegisterEmail(fullname, email, confirmlink)
                    res.cookie('auth', resetId)
                    req.session.plan = ''
                    res.redirect('/register/confirm');
                }
            })

        } else {
            let newUser = new User({
                name: fullname,
                user_name: username,
                email: email,
                password: hashedPassword,
                role: 'user',
                bio:'',
                membership: 'paid',
                verification: vcodeId,
                verified: 'false',
                status: 'hidden',
                statusAdmin: 'public',
                profile_image: '/IMAGES/user.png',
                reset_id: resetId,
                duration: '',
                tfa: 'off'
            })
            newUser.save((err) => {
                if (!err) {
                    // SEND EMAIL HERE TO VERIFY

                    let confirmlink = `http://${req.get('host')}/register/validate/${vcodeId}?aouth=${resetId}`
                    sendRegisterEmail(fullname, email, confirmlink)
                    res.cookie('auth', resetId)
                    req.session.plan = ''
                    res.redirect('/register/confirm');
                }
            })
        }
    } else {
        return res.json(valid)
    }



})


router.get('/confirm', (req, res) => {
    let auth = req.cookies.auth
    User.find({ reset_id: auth }, (err, rows) => {
        if (err) {
            res.redirect('/login')
        } else if (rows.length > 0) {
            rows.forEach(element => {
                res.render('auth-email-verification', { email: element.email })
            });
        }
    })
})


router.post('/resendmail', (req, res) => {
    let auth = req.cookies.auth
    User.find({ reset_id: auth }, (err, rows) => {
        if (err) {
            res.redirect('/login')
        } else if (rows.length > 0) {
            rows.forEach(user => {
                let confirmlink = `http://${req.get('host')}/register/validate/${user.vcodeId}?aouth=${user.resetId}`
                sendRegisterEmail(user.name, user.email, confirmlink)
                res.json({
                    type: 'alert',
                    text: 'Email has been resent',
                    css: 'good'
                })
            });
        }
    })
})

router.get('/validate/:id', (req, res) => {

    let aouth = req.query.aouth

    User.updateOne({ vcodeId: req.params.id,reset_id: aouth },{verified:'true',status:'public'}, (err, user) => {
        if(!err){
            res.render('auth-confirm-mail');
        }
    });


})
// Validate Fields
function validateFields(fullname, email, username, password, res) {
    if (fullname.length < 0) {
        return res.render('auth-register', { script: VirtualAJax("runResponse({ type: 'alert', text: 'Please enter a full name', css: 'bad' })") })
    } else if (email.length <= 0) {
        return res.render('auth-register', { script: VirtualAJax("runResponse({ type: 'alert', text: 'Please enter a email address', css: 'bad' })") })
    } else if (username.length <= 0) {
        return res.render('auth-register', { script: VirtualAJax("runResponse({ type: 'alert', text: 'Please enter a username', css: 'bad' })") })
    } else if (password.length <= 0) {
        return res.render('auth-register', { script: VirtualAJax("runResponse({ type: 'alert', text: 'Please enter a password', css: 'bad' })") })
    }

    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        return res.render('auth-register', { script: VirtualAJax("runResponse({ type: 'alert', text: 'Email is not valid', css: 'bad' })") })
    }
    if (username.length < 8) {
        return res.render('auth-register', { script: VirtualAJax("runResponse({ type: 'alert', text: 'Username has to be at least 8', css: 'bad' })") })
    }
    if (password.length < 8) {
        return res.render('auth-register', { script: VirtualAJax("runResponse({ type: 'alert', text: 'Password has to be at least 8', css: 'bad' })") })
    }

    return 'proceed';
}

function VirtualAJax(script) {
    let final = `<script>${script}</script>`;
    return final;
}

module.exports = router;