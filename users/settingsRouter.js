const express = require('express');
const router = express.Router();
const {User,Blog} = require('../db/db');

router.get('/', async(req, res, next)=>{
    let users = await new Promise((resolve, reject) => {  
        User.findOne({user_name: req.session.user.user_name},(err, user)=>{
            resolve(user)
        })
    })
    let blogs = await new Promise((resolve, reject) => {  
        Blog.find({author_username: req.session.user.user_name},(err, blog)=>{
            resolve(blog)
        })
    })
    res.render('user/profile',{users: users,blogs:blogs})
})


router.delete('/delete-account', (req, res)=>{
    let username = req.session.user.user_name
    User.deleteOne({user_name: username},(err, user)=>{
        Blog.deleteMany({author_username: username}, (err, blog)=>{
            if (err) return err
            res.json({
                type: 'link',
                link: '/logout'
            })
        })
    })
})

module.exports = router;