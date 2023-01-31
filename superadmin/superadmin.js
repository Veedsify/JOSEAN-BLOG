var express = require('express');
const multer = require('multer');
const { User, Blog } = require('../db/db');
const getRandomInt = require('../function/randomNum');
const convertSlug = require('../function/slug');

var router = express.Router();
let blogRouter = require('./blog')
let userRouter =  require('./usersRoute')
let manageRouter = require('./manageRouter')
let settingsRouter = require('./settingsRouter')

router.use(checkSession)
router.use(checkAdmin)
router.use(userData)
router.use('/blogs',blogRouter)
router.use('/users',userRouter)
router.use('/manage',manageRouter)
router.use('/settings',settingsRouter)

router.get('/', (req, res) => {
    res.render('admin/dashboard')
})


// Functions
function checkAdmin(req, res, next) {
    let sess = req.session
    if(sess){

        if (sess.user.role === 'superadmin') {
            next()
        } else if (sess.user.role === 'user') {
            res.redirect('/user')
        }
        else {
            req.session.destroy()
            res.redirect('/login')
        }
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