const express = require('express');
const { Alert } = require('../db/db');
const router = express.Router();


router.get('/', (req, res, next)=>{
    Alert.find({},(err, alert)=>{
        res.render('admin/create-alerts',{alerts: alert})
    }).sort({_id: -1})
})

router.post('/delete-alert', (req, res, next)=>{
    let id = req.body.id
    Alert.deleteOne({_id: id},(err, alert)=>{
        if(!err){
            res.json({
                text: 'Alert Deleted Successfully',
                css: 'good',
                type:'alert'
            })
        }
    })
})


module.exports = router;