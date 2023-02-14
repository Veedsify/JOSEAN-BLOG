var express = require('express');
const multer = require('multer');
const { User, Blog, Notify, Alert } = require('../db/db');
const getRandomInt = require('../function/randomNum');
const convertSlug = require('../function/slug');

var router = express.Router();
let blogRouter = require('./blog')
let userRouter = require('./usersRoute')
let manageRouter = require('./manageRouter')
let settingsRouter = require('./settingsRouter')
let alertRouter = require('./alertsRouter');
const { sendPostStatus } = require('../mailer/tfa');


router.use(checkSession)
router.use(checkAdmin)
router.use(userData)
router.use('/blogs', blogRouter)
router.use('/alerts', alertRouter)
router.use('/users', userRouter)
router.use('/manage', manageRouter)
router.use('/settings', settingsRouter)

router.get('/', (req, res) => {
    res.render('admin/dashboard')
})

router.post('/sendUserMessage', async (req, res, next) => {
    let info = req.body
    try {
        let today = new Date()

        let createAlert = new Alert({
            duration: new Date(today.getTime() + (60 * 60 * 24 * 30 * 1000)),
            message: info.message,
            page: info.location,
        })

        let allUsers = await new Promise((resolve, reject)=>{
            User.find({role: 'user', membership: info.location},(err, users)=>{
                if(!err){
                    resolve(users)
                }
            })
        })

        createAlert.save((err, alert) => {
            if (!err){
                allUsers.forEach(user =>{
                    sendPostStatus(user.name,user.email,info.message,'Message From Admin')
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
                })
            }
        })

    } catch (err) {
        console.log(err)
    }


    res.redirect('/superadmin?message=success')
})
router.post('/sendUserAlert', (req, res, next) => {
    let info = req.body
    try {
        let today = new Date()
        let createAlert = new Alert({
            duration: new Date(today.getTime() + (60 * 60 * 24 * 30 * 1000)),
            message: info.message,
            page: info.location,
        })

        createAlert.save((err, alert) => {
            if (err) return err
        })

    } catch (err) {
        console.log(err)
    }


    res.redirect('/superadmin/alerts?message=success')
})


// Functions
function checkAdmin(req, res, next) {
    let sess = req.session
    if (sess) {

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