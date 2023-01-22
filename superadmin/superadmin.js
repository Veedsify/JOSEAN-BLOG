var express = require('express');
const multer = require('multer');
const { User, Blog } = require('../db/db');
const getRandomInt = require('../function/randomNum');
const convertSlug = require('../function/slug');
var router = express.Router();





router.use(checkAdmin)
router.use(checkSession)
router.use(userData)

router.get('/', (req, res) => {
    let script = `<script>runResponse({
        type:'alert',
        text:'Welcome Admin 😏',
        css: 'good'
    })</script>`;
    req.session.code = ''
    res.render('SUPERADMIN/index', { script: script })
})


// Functions
function checkAdmin(req, res, next) {
    let sess = req.session
    if (sess.user) {

        if (sess.user.role === 'superadmin') {
            next()
        } else if (sess.user.role === 'user') {
            res.redirect('/user')
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
        next()
    } else {
        req.session.destroy()
        res.redirect('/login')
    }
}

function userData(req, res, next) {
    res.locals.userData = req.session.user
    next()
}
module.exports = router