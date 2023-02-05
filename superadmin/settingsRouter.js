const express = require('express');
const router = express.Router();
const { User, Blog } = require('../db/db');

router.get('/', async (req, res, next) => {
    let users = await new Promise((resolve, reject) => {
        User.findOne({ user_name: req.session.user.user_name }, (err, user) => {
            resolve(user)
        })
    })
    let blogs = await new Promise((resolve, reject) => {
        Blog.find({ author_username: users.user_name }, (err, blog) => {
            resolve(blog)
        })
    })
    res.render('admin/profile', { users: users, blogs: blogs })
})

router.post('/delete-my-account-clicked', (req, res, next) => {

    let code = getRandomInt(1111, 9999)
    req.session.code = code
    let user = req.session.user
    sendVcodeEmail(user.name, user.email, code)
    res.json({
        type: 'alert',
        css: 'good',
        message: 'A verification code was sent to you'
    })

})
router.post('/delete-my-account-continue', (req, res, next) => {

    let code = req.session.code

    if (req.body.confirmCode === code) {
        User.deleteOne({
            user_name: req.session.user.user_name
        }, (err, user) => {
            if (err) {
                console.log(err)
            }
            req.session.destroy()
            res.redirect('/')
        })
    }else{
        res.json({
            type: 'alert',
            css: 'bad',
            message: 'Sorry, we can\'t delete your account'
        })
    }
})


module.exports = router;        