var express = require('express');
const multer = require('multer');
const { User, Blog } = require('../db/db');
const getRandomInt = require('../function/randomNum');
const convertSlug = require('../function/slug');
var router = express.Router();
let blogRouter = require('./blog')




router.use(checkSession)
router.use(checkAdmin)
router.use(userData)
router.use('/blogs', blogRouter)



router.get('/', (req, res) => {
    res.render('userdashboard')
})


function checkAdmin(req, res, next) {
    let sess = req.session
    if (sess.user) {

        if (sess.user.role === 'superadmin') {
            res.redirect('/superadmin')
        } else if (sess.user.role === 'user') {
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
            next()
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