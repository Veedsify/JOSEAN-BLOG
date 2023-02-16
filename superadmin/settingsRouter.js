const express = require('express');
const multer = require('multer');
const router = express.Router();
const { User, Blog } = require('../db/db');

router.get('/', async (req, res, next) => {
    let users = await new Promise((resolve, reject) => {
        User.findOne({ user_name: req.session.user.user_name }, (err, user) => {
            resolve(user)
        })
    })
    let blogs = await new Promise((resolve, reject) => {
        Blog.find({ author_username: users.user_name }, (err, blog) => {
            resolve(blog)
        })
    })
    res.render('admin/profile', { users: users, blogs: blogs })
})

router.post('/delete-my-account-clicked', (req, res, next) => {

    let code = getRandomInt(1111, 9999)
    req.session.code = code
    let user = req.session.user
    sendVcodeEmail(user.name, user.email, code)
    res.json({
        type: 'alert',
        css: 'good',
        message: 'A verification code was sent to you'
    })

})
router.post('/delete-my-account-continue', (req, res, next) => {

    let code = req.session.code

    if (req.body.confirmCode === code) {
        User.deleteOne({
            user_name: req.session.user.user_name
        }, (err, user) => {
            if (err) {
                console.log(err)
            }
            req.session.destroy()
            res.redirect('/')
        })
    } else {
        res.json({
            type: 'alert',
            css: 'bad',
            message: 'Sorry, we can\'t delete your account'
        })
    }
})

router.post('/getUser', (req, res, next) => {
    User.findOne({ user_name: req.session.user.user_name }, (err, user) => {
        res.json(user);
    })
})


var fileName;
// Get a list of all image files.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // destination directory
        cb(null, 'public/IMAGES/PRO_IMAGES/')
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // limit file size to 5 MB
    },
    fileFilter: function (req, file, cb) {
        // only allow image files
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
    filename: function (req, file, cb) {
        // customize the file name
        let Imgname = `${Date.now()}-${file.originalname}`
        fileName = `/IMAGES/PRO_IMAGES/` + Imgname
        cb(null, Imgname);
    }
})
const upload = multer({ storage: storage });

router.post('/updateDetails', upload.single('userImage'), (req, res) => {
    let info = req.body
    User.updateOne({ user_name: req.session.user.user_name, role: 'superadmin' }, {
        name: info.fullname,
        bio: info.bio,
        user_name: info.user_name,
        email: info.email,
        profile_image: fileName
    }, (err, user) => {
        if (!err) {
            req.session.user.name = info.fullname
            req.session.user.bio = info.bio
            req.session.user.user_name = info.user_name
            req.session.user.profile_image = fileName
            res.redirect('/superadmin/settings')
        }
    })
})
module.exports = router;        