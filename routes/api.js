const express = require('express');
const { marked } = require('marked');
const router = express.Router();
const {Blog} = require('../db/db');


router.use(checkSessions)

router.post('/getBlogImpressions',(req,res) => {
    // let user = req.session.user.user_name
     let user = 'admin'

    Blog.aggregate([
        {   
            $match: {
                'author_username': user
            }
        },{
            $group: {
                _id: null,
                total: { $sum: "$amount" }
            }
        }
    ], (err, blog) => {
        if(!err){
            res.send(blog)
        }
    })
    
});



// functions
function checkSessions(req,res,next) {
    if(typeof req.session.user !== undefined){
        next()
    }
}


module.exports = router;