const express = require('express');
const { Blog, User } = require('../db/db');
const { sendPostStatus } = require('../mailer/tfa');
const router = express.Router();


router.get('/posts', (req, res) => {
    Blog.find({ statusAdmin: 'hidden' }, (err, blog) => {
        res.render('admin/pending-post', { blogs: blog })
    })
})

router.get('/view/:id', async (req, res, next) => {

    if (req.params.id.length > 0) {

        let getPedingPost = await new Promise((resolve, reject) => {
            Blog.findOne({ slug_id: req.params.id, statusAdmin: 'hidden' }, (err, blog) => {
                if (!err) {
                    resolve(blog)
                }
            });
        })

        res.render('admin/manageSinglePost', { mainPost: getPedingPost })
    }
})

router.post('/response', async (req, res, next) => {
    let infos = req.body

    let findPost = await new Promise((resolve) => {
        Blog.findOne({ slug_id: infos.slug }, function (err, blog) {
            if (!err) {
                resolve(blog)
            }
        })
    })

    let getUser = await new Promise(resolve => {
        User.findOne({ user_name: findPost.author_username }, (err, user) => {
            if (!err) {
                resolve(user)
            }
        })
    })

    if (infos.action === 'APPROVE') {

        let text = 'Your post has been approved and you can now view it live on bloggystories';

        sendPostStatus(getUser.name, getUser.email, text, 'Your post has been accepted');

        Blog.updateOne({ slug_id: infos.slug }, { statusAdmin: 'public' }, (err) => {
            if (err) {
                return
            }
        })
        res.json({
            type: 'alert',
            text: 'Post Has Been Approved',
            css: 'good'
        })

    } else if (infos.action === 'DISAPPROVE') {

        sendPostStatus(getUser.name, getUser.email, infos.stmt, 'Your post was not accepted');

        Blog.updateOne({ slug_id: infos.slug }, { statusAdmin: 'hidden' }, (err) => {
            if (err) {
                return
            }
        })

        res.json({
            type: 'alert',
            text: 'Post Has Been Disapproved',
            css: 'bad'
        })
    }


})

router.get('/approve/p/:id', (req, res) => {
    res.render('manageSinglePost')
})

router.get('/approve', async (req, res, next) => {

    let getAllBlogs = await new Promise(resolve => {
        Blog.find((err, blog) => {
            if (!err) {
                resolve(blog)
            }
        }).sort({_id: -1})
    })
    res.render('admin/audit-posts',{blogs: getAllBlogs})
})


router.post('/visibility/:slug/:action',async (req,res)=>{

    if(req.params.slug.length > 10){
        if(req.params.action === 'enable'){
            Blog.updateOne({slug_id: req.params.slug},{status:'enabled',statusAdmin:'public'},(err,blog)=>{
                if(err){
                    console.log(err)
                }
            })
        }else if(req.params.action === 'disable'){
            Blog.updateOne({slug_id: req.params.slug},{status:'disabled',statusAdmin:'hidden'},(err,blog)=>{
                if(err){
                    console.log(err)
                }
            })
        }else if(req.params.action === 'delete'){
            Blog.deleteOne({slug_id: req.params.slug});
        }
        res.redirect('/superadmin/manage/approve')
    }
})
module.exports = router