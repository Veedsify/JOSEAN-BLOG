const express = require('express');
const { marked } = require('marked');
const router = express.Router();
const { Blog, Notify, Alert } = require('../db/db');

router.use(checkSessions)

router.post('/getBlogImpressions', async (req, res) => {
    let user = req.session.user.user_name
    // let user = 'admin'
    let arr = []
    let imp = await new Promise(resolve => {
        Blog.find({ author_username: user }, (err, blog) => {
            resolve(blog)
        })
    })
    await imp.forEach(article => {
        arr.push(parseInt(article.impressions))
    })
    const sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    res.json(sum)
});

router.post('/getBlogviews', async (req, res) => {
    let user = req.session.user.user_name
    // let user = 'admin'
    let arr = []
    let imp = await new Promise(resolve => {
        Blog.find({ author_username: user }, (err, blog) => {
            resolve(blog)
        })
    })
    await imp.forEach(article => {
        arr.push(parseInt(article.count))
    })
    const sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    res.json(sum)
});

router.post('/postCount', async (req, res) => {
    let user = req.session.user.user_name
    let imp = await new Promise(resolve => {
        Blog.find({ author_username: user }, (err, blog) => {
            resolve(blog)
        })
    })
    res.json(imp.length)
});

router.post('/mostPost', async (req, res) => {
    let user = req.session.user.user_name
    let imp = await new Promise(resolve => {
        Blog.findOne({ author_username: user }, (err, blog) => {
            resolve(blog)
        }).limit(1).sort({ count: -1 })
    })
    try {
        res.json(imp.count)
    } catch (err) {
        res.send('0')
    }
});

router.post('/myartcles', async (req, res) => {
    let user = req.session.user.user_name
    let imp = await new Promise(resolve => {
        Blog.find({ author_username: user }, (err, blog) => {
            resolve(blog)
        }).sort({ _id: -1 })
    })
    try {
        res.json(imp)
    } catch (err) {
        res.json({})
    }
});



// functions
function checkSessions(req, res, next) {
    if (typeof req.session.user !== undefined) {
        next()
    }
}

router.post('/getNotifications', (req, res, next) => {
    Notify.find({ reciever: req.session.user.user_name }, (err, notify) => {
        res.json(notify)
    }).sort({ _id: -1 })
})

router.post('/getAlerts', async (req, res, next) => {
    let getAlerts = await new Promise(resolve => {
        if (req.session.user !== undefined) {
            if (req.session.user.role !== 'superadmin') {
                let check = req.session.user.membership
                switch (check) {
                    case 'paid':
                        Alert.findOne({ page: "paid" }, (err, alert) => {
                            resolve(alert)
                        }).sort({ _id: -1 })
                        break;
                    case 'free':
                        Alert.findOne({ page: "free" }, (err, alert) => {
                            resolve(alert)
                        }).sort({ _id: -1 })
                        break;
                }
            }
        }
    })

    res.json(getAlerts)
})

router.delete('/alerts/delete', (req, res, next)=>{
    let id = req.body.id

    Notify.deleteOne({_id: id},(err, alert)=>{
        if(err){
            return false;
        }
        res.json({
            type:'alert',
            css:'good',
            text: 'Alert Has Been Deleted'
        })
    })
})


module.exports = router;