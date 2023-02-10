const express = require('express');
const { marked } = require('marked');
const schedule = require('node-schedule');
const router = express.Router();
const { Blog, Notify, Alert, User } = require('../db/db');
const { sendPostStatus } = require('../mailer/tfa');
router.use(checkSessions)

router.post('/getBlogImpressions', async (req, res) => {
    let user = req.session.user.user_name
    // let user = 'admin'

    if (user) {

        let arr = [];
        let imp = await new Promise(resolve => {
            Blog.find({ author_username: user }, (err, blog) => {
                resolve(blog);
            })
        })
        await imp.forEach(article => {
            arr.push(parseInt(article.impressions))
        })
        const sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        res.json(sum)
    }else{
        res.json(0)
    }
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
        }).sort({ count: -1 }).limit(1)
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

router.delete('/alerts/delete', (req, res, next) => {
    let id = req.body.id
    Notify.deleteOne({ _id: id }, (err, alert) => {
        if (err) {
            return false;
        }
        res.json({
            type: 'alert',
            css: 'good',
            text: 'Alert Has Been Deleted'
        })
    })
})

// CHECK WHEN USER REACHES 60 DAYS
// let job = schedule.scheduleJob('*/5 * * * * *', ()=>{
let job = schedule.scheduleJob('0 12 * * *', () => {

    let today = Date.now()

    let date = new Date(today)

    User.find({ role: 'user' }, (err, users) => {
        if (!err) {
            users.forEach(user => {
                let myDate = user.createdAt
                let final = date - myDate
                let dateINDays = Math.round(final / 1000 / 60 / 60 / 24);
                if (user.membership === 'free') {
                    // console.log(new Date(myDate) + ' ' + dateINDays)
                    if (dateINDays == process.env.TRIAL_DAYS) {
                        User.updateOne({ user_name: user.user_name, trial: 'true' }, { trial: 'ended' }, (err, row) => {
                            if (!err) return 'ok'
                        })
                    } else if (dateINDays == (process.env.TRIAL_DAYS - 7)) {
                        let note = new Notify({
                            sender: 'admin',
                            reciever: user.user_name,
                            message: `Hi ${user.name}, do note that your trial period ends in 7 days`,
                            sender_image: '/IMAGES/user.png',
                        })
                        note.save()
                        sendPostStatus(user.name, user.email, `Hi ${user.name}, do note that your trial period ends in 7 days`, 'Trail Period Is About To End')
                    }
                }
            })
        }
    })
})


module.exports = router;