var express = require('express');
const { sendPostStatus } = require('../mailer/tfa')
const { User, Blog, Notify } = require('../db/db');
var router = express.Router();
let settingsRouter = require('./settingsRouter')
let blogRouter = require('./blog')




router.use(checkSession)
router.use(checkAdmin)
router.use(userData)
router.use('/settings', settingsRouter)
router.use('/blogs', blogRouter)



router.get('/', (req, res) => {
    res.render('user/dashboard')
})

router.post('/sendAdminMessage', (req, res, next) => {
    let info = req.body

    let me = req.session.user.user_name

    User.findOne({ role: 'superadmin' }, (err, user) => {

        try {

            let notification = new Notify({
                sender: req.session.user.user_name,
                sender_image: req.session.user.profile_image,
                reciever: user.user_name,
                reciever_image: user.profile_image,
                message: info.message,
                seen: 'no'
            })

            notification.save((err, notify) => {
                if (err) {
                    console.log(err)
                }
            })

            sendPostStatus('Admin', user.email, info.message, 'Message From User:' + me)

        } catch (err) {
            console.log(err)
        }


        res.redirect('/user?message=success')
    })
})

function checkAdmin(req, res, next) {
    let sess = req.session
    if (sess.user) {

        if (sess.user.role === 'superadmin') {
            res.redirect('/superadmin')
        } else if (sess.user.role === 'user') {
            if (sess.statusAdmin != 'public') {
                res.redirect('/logout')
                return
            }
            next()
        }
        else {
            req.session.destroy()
            res.redirect('/login')
        }
    } else {
        sess.destroy()
        res.redirect('/login')
    }
}

function checkSession(req, res, next) {
    if (typeof req.session.user !== undefined || req.session.user !== '') {
        if (req.session.tfa === 'skipped' || req.session.tfa === 'verified') {
            if (req.session.trial != 'ended') {
                next()
            }
        } else {
            req.session.destroy()
            res.redirect('/login')
        }
    } else {
        req.session.destroy()
        res.redirect('/login')
    }
}

function userData(req, res, next) {
    res.locals.userData = req.session.user
    res.locals.nav = req.session.user.role
    next()
}

module.exports = router