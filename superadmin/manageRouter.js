const express = require('express');
const { Blog, User } = require('../db/db');
const { sendPostStatus } = require('../mailer/tfa');
const router = express.Router();


router.get('/posts',(req,res)=>{
    Blog.find({statusAdmin: 'hidden'}, (err, blog)=>{
        res.render('admin/pending-post', {blogs: blog})
    })
})

router.get('/view/:id', async (req, res, next)=>{

    if (req.params.id.length > 0){

        let getPedingPost = await new  Promise((resolve,reject)=>{
            Blog.findOne({slug_id: req.params.id},(err, blog)=>{
                if(!err){
                    resolve(blog)
                }
            });
        })

        res.render('admin/manageSinglePost',{mainPost: getPedingPost})
    }
})

router.post('/response', async (req, res, next)=>{
    let infos = req.body

    let findPost = await new Promise((resolve)=>{
        Blog.findOne({slug_id: infos.slug},function(err, blog){
            if(!err){
                resolve(blog)
            }
        })
    })

    let getUser = await new Promise(resolve=>{
        User.findOne({user_name: findPost.author_username},(err,user)=>{
            if(!err){
                resolve(user)
            }
        })
    })

    if(infos.action === 'APPROVE'){
        
        let text = `Your post has been approved and you can now view it live on bloggystories`

        sendPostStatus(getUser.name, getUser.email,text);

        Blog.updateOne({slug_id: infos.slug},{statusAdmin:'public'},(err)=>{
            if(err){
                return
            }
        })
        res.json({
            type: 'alert',
            text: 'Post Has Been Approved',
            css: 'good'
        })
        
    }else if(infos.action === 'DISAPPROVE'){

        sendPostStatus(getUser.name, getUser.email,infos.stmt);

        Blog.updateOne({slug_id: infos.slug},{statusAdmin:'hidden'},(err)=>{
            if(err){
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

router.get('/approve/p/:id', (req, res)=>{
    res.render('manageSinglePost')
})

router.get('/approve', (req, res, next)=>{

    res.render('admin/audit-posts')
})

module.exports = router