const express = require('express');
const router = express.Router();


router.use(checkSessions)

router.get('/',(req,res) => {
    res.redirect('/');
})

router.post('/getBlogImpressions',(req,res) => {
    
});



// functions
function checkSessions(req,res,next) {
    if(typeof req.session.user !== undefined){
        next()
    }
}


module.exports = router``;