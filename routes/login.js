const express = require('express');
const { User } = require('../db/db');
const { getHash } = require('../function/gethash');
const getRandomInt = require('../function/randomNum');
const sendRegisterEmail = require('../mailer/confirmRegisteration');
const sendVcodeEmail = require('../mailer/tfa');
const router = express.Router()


router.get('/', (req, res) => {
    if(typeof req.session.user === undefined || req.session.user !== ''){
        req.session.destroy()
        res.render('auth-login')
    }else{
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

router.post('/new', checkStatus, async (req, res) => {

    let user = req.body.username
    let pass = req.body.password

    let parameters = {
        user_name: user,
        password: getHash(pass)
    }

    console.log(parameters)

    User.findOne(parameters, function (err, user) {
        console.log(user)
        if (user) {
            if (user.tfa !== 'on') {
                req.session.user = user
                req.cookies.auth = user.reset_id
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
                req.cookies.auth = user.reset_id
                sendVcodeEmail(user.name, user.email, code)
                res.json({
                    type: 'link',
                    link: '/login/confirm'
                })
            }
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