const express = require('express')
const router = express.Router()

router.get('/', (req,res)=>{
    res.render('pages-pricing')
})

router.post('/user', (req, res)=>{
    
    let plan = req.body.plan

    req.session.plan = plan

    res.send({
        type:'link',
        link: '/register'
    })
})

module.exports = router