const express = require('express');
const { User } = require('../db/db');
const { getHash } = require('../function/gethash');
const getRandomInt = require('../function/randomNum');
const {sendRegisterEmail, resetLink} = require('../mailer/confirmRegisteration');
const sendVcodeEmail = require('../mailer/tfa');
const router = express.Router()


router.get('/', (req, res) => {
    if (req.session.user == null) {
        req.session.destroy()
        res.render('auth-login')
    } else {
        res.redirect('/user')
    }
})

router.get('/confirm', (req, res) => {
    let auth = req.cookies.auth
    User.find({ reset_id: auth }, (err, rows) => {
        if (err) {
            res.redirect('/login')
        } else if (rows.length > 0) {
            rows.forEach(element => {
                res.render('auth-two-step-verification', { email: element.email })
            });
        } else {
            res.redirect('/login')
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
                let code = getRandomInt(1111, 9999)
                req.session.code = code
                sendVcodeEmail(user.name, user.email, code)
                res.json({
                    type: 'alert',
                    text: 'Email has been resent',
                    css: 'good'
                })
            });
        }
    })
})

router.post('/code', (req, res) => {

    let vcode = req.body.vcode

    if (typeof vcode !== undefined || vcode !== '') {
        if (req.session.code != vcode) {
            res.json({ type: 'alert', text: 'Code is not valid', css: 'bad' })
        } else {
            req.session.tfa = 'verified'
            req.session.code = null
            let adminLink = '/' + req.session.user.role
            res.json({ type: 'link', link: adminLink })
        }
    } else {
        res.json({ type: 'alert', text: 'Please enter your verification code', css: 'bad' })
    }
})

router.get('/banned', (req, res, next) => {
    let user = req.session.tinyInfo
    if (user && user.statusAdmin !== 'public') {
        res.render('banned', { user })
        req.session.destroy()
    } else {
        res.redirect('/login')
    }
})
router.get('/ended', (req, res, next) => {
    let user = req.session.tinyInfo
    if (user) {
        res.render('trialended', { user })
    } else {
        res.redirect('/login')
    }
})

router.post('/new', checkStatus, async (req, res) => {

    let user = req.body.username
    let pass = req.body.password

    let parameters = {
        user_name: user,
        password: getHash(pass)
    }

    User.findOne(parameters, function (err, user) {
        if (user) {
            res.cookie('auth', user.reset_id)
            if (user.statusAdmin !== 'public') {
                req.session.tinyInfo = {
                    name: user.name,
                    profile_image: user.profile_image
                }
                res.json({
                    type: 'link',
                    link: '/login/banned'
                })
                return;
            } else if (user.trial === 'ended') {
                req.session.tinyInfo = {
                    name: user.name,
                    profile_image: user.profile_image
                }
                req.session.user = user
                req.session.tfa = 'skipped'
                res.json({
                    type: 'link',
                    link: '/login/ended'
                })
                return;
            }

            if (user.tfa !== 'on') {
                req.session.user = user
                req.session.tfa = 'skipped'
                if (user.role === 'superadmin') {
                    res.json({
                        type: 'link',
                        link: '/superadmin'
                    });
                } else {
                    res.json({ type: 'link', link: '/user' });
                }
            } else {
                let code = getRandomInt(1111, 9999)
                req.session.code = code
                req.session.user = user
                sendVcodeEmail(user.name, user.email, code)
                res.json({
                    type: 'link',
                    link: '/login/confirm'
                })
            }
        }
    })
})


router.get('/forgot', (req, res, next) => {
    res.render('recover-password');
})


router.post('/reset', async (req, res, next) => {
    if (!req.body.email || req.body.email === '') {
        return res.json({
            type: 'link',
            link: '/login'
        })
    }

    let email = req.body.email

    User.findOne({ email: email }, (err, user) => {
        if (user) {
            try{
                let link = `${req.protocol}://${req.get('host')}/reset/reset_id/${user.reset_id}/${user.password}`
                resetLink(user.name,user.email,link)
                res.json({
                    type: 'link',
                    link: '/reset/password'
                })
            }catch(err){
                console.error(err)
                res.json({
                    type: 'alert',
                    text: 'Sorry, There is an error with the server right now'
                })
            }
        } else {
            res.json({
                type: 'alert',
                text: 'Sorry, This is not a valid user'
            })
        }
    })
})

// FUNCTIONS
function checkStatus(req, res, next) {

    let loginScheme = {
        user_name: req.body.username,
        password: getHash(req.body.password)
    }

    User.findOne(loginScheme, (err, user) => {
        if (user) {

            if (user.status !== 'public' || user.verified !== 'true') {
                let confirmlink = `http://${req.get('host')}/register/validate/${user.vcodeId}?aouth=${user.reset_id}`
                sendRegisterEmail(user.name, user.email, confirmlink);
                res.cookie('auth', user.reset_id)
                res.json({
                    type: 'link',
                    link: '/register/confirm'
                })
            } else {
                next()
            }
        } else {
            res.json({
                type: 'alert',
                text: 'Invalid Login Credentials',
                css: 'bad'
            })
        }
    })
}

module.exports = router