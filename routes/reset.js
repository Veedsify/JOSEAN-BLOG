const express = require('express');
const { User } = require('../db/db');
const { getHash } = require('../function/gethash');
const router = express.Router();


router.get('/password', (req, res) => {
    res.render('auth-confirm-password-reset')
})

router.get('/', (req, res, next) => {
    res.redirect('/login')
})
router.get('/reset_id/:resetid/:id', (req, res, next) => {
    User.findOne({ reset_id: req.params.resetid, password: req.params.id }, (err, user) => {
        if (user) {
            res.cookie('resetid', req.params.resetid)
            res.render('reset-password')
        }else{
            res.redirect('/login')
        }
    })
})

router.post('/update-passwords', (req, res, next) => {
    let { pass, cpass } = req.body
    let resetid = req.cookies.resetid
    let hashedPassword = getHash(pass)
    console.log(hashedPassword)
    if (pass === cpass) {
        User.updateOne({reset_id: resetid},{password: hashedPassword},(err,user)=>{
            if(!err){
                res.json({ result: true })
            }
        })
    } else {
        res.json({ result: false })
    }
})



module.exports = router;