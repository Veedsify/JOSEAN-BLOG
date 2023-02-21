const express = require('express');
const multer = require('multer');
const { User, Blog } = require('../db/db');
const router = express.Router();
let path = require('path')

router.get('/', async (req, res, next) => {
    let users = await new Promise((resolve, reject) => {
        User.findOne({ user_name: req.session.user.user_name }, (err, user) => {
            resolve(user)
        })
    })
    let blogs = await new Promise((resolve, reject) => {
        Blog.find({ author_username: req.session.user.user_name }, (err, blog) => {
            resolve(blog)
        })
    })

    let daysRemaining = await new Promise((resolve) => {
        User.findOne({ user_name: req.session.user.user_name }, (err, user) => {
            try {

                if (!err) {
                    if (user.membership == 'free') {
                        let date = new Date(Date.now())
                        let myDate = user.createdAt
                        let final = date - myDate
                        let dateINDays = Math.round(final / 1000 / 60 / 60 / 24)
                        let remaining = process.env.TRIAL_DAYS - dateINDays
                        resolve(remaining)
                    } else {
                        resolve({})
                    }
                }
            } catch (err) {
                console.error(err)
            }
        })
    }).catch(err => {
        console.error(err)
    })

    res.render('user/profile', { users: users, blogs: blogs, dayRm: daysRemaining })
})


router.delete('/delete-account', (req, res) => {
    let username = req.session.user.user_name
    User.deleteOne({ user_name: username }, (err, user) => {
        Blog.deleteMany({ author_username: username }, (err, blog) => {
            if (err) return err
            res.json({
                type: 'link',
                link: '/logout'
            })
        })
    })
})


router.post('/getUser', (req, res, next) => {
    User.findOne({ user_name: req.session.user.user_name }, (err, user) => {
        res.json(user);
    })
})

//Upload Image
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
        User.findOne({ user_name: req.session.user.user_name }, (err, user) => {
            if (!err) {
                let Imgname = user.user_name
                let ext = path.extname(file.originalname)
                fileName = `/IMAGES/PRO_IMAGES/` + Imgname + ext
                cb(null, Imgname + ext);
            }
        })
        // let Imgname = `${Date.now()}-${file.originalname}`

    }
})
const upload = multer({ storage: storage });

router.post('/updateDetails', upload.single('userImage'), async (req, res) => {
    let info = req.body
    await new Promise((resolve, reject)=>{
        User.findOne({
            user_name: info.user_name
        }
        ,(err, user)=>{
            try{

                if(user.length > 0){
                    reject()    
                }
            }catch(e){
                res.redirect('user/settings?user=exists')
            }
        })
    })

    let person = await new Promise((resolve, reject) => {
        User.updateOne({ user_name: req.session.user.user_name, role: 'superadmin' }, {
            name: info.fullname,
            bio: info.bio,
            user_name: info.user_name,
            email: info.email,
            profile_image: fileName
        }, (err, user) => {
            if (!err) {
                User.findOne({ user_name: info.user_name }, (err, person) => {
                    resolve(person)
                })
            }
        })
    })
    let updatePosts = await new Promise((resolve, reject) => {
        Blog.updateMany({
            author_username: req.session.user.user_name
        }, {
            author_name: info.fullname,
            author_username: info.user_name,
            author_image: person.profile_image,
        }, (err, blog) => {
            if (!err) {
                resolve(blog)
            }
        })
    })
    res.locals.userData = person
    req.session.user = person
    res.redirect('/user/settings')
})
module.exports = router;