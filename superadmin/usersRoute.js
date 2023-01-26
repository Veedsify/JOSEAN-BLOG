const express = require('express');
const { User } = require('../db/db');
const router = express.Router();


router.get('/audit', (req, res, next) => {

    User.find({ user_name: { $ne: 'admin' } }, (err, user) => {
        let userLength = user.length
        res.render('audit-users', { users: user, userLength: userLength })
    })
})


router.delete('/delete', (req, res) => {
    let user = req.body.user
    if (req.session.user.role === 'superadmin') {

        User.deleteOne({ user_name: user }, (err) => {
            if (!err) {
                res.json({
                    type: 'alert',
                    text: user + ' has been deleted',
                    css: 'good'
                })
            }
        })
    } else {
        res.json({
            type: 'alert',
            text: 'Sorry you cant delete a user',
            css: 'bad'
        })
    }
})


router.put('/update', (req, res, next) => {
    let user = req.body.user
    let action = req.body.action
    if (req.session.user.role === 'superadmin') {
        if(action === 'disable'){
            User.updateOne({ user_name: user },{status: 'hidden' }, (err) => {
                if (!err) {
                    res.json({
                        type: 'alert',
                        text: user + ' has been '+action+'d',
                        css: 'good'
                    })
                }
            })
        }else{
            User.updateOne({ user_name: user },{status: 'public' }, (err) => {
                if (!err) {
                    res.json({
                        type: 'alert',
                        text: user + ' has been '+action+'d',
                        css: 'good'
                    })
                }
            })
        }
    } else {
        res.json({
            type: 'alert',
            text: 'Sorry you cant '+action+' a user',
            css: 'bad'
        })
    }
})

module.exports = router;