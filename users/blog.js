const express = require('express');
const { marked } = require('marked');
const showdown = require('showdown')
const converter = new showdown.Converter()
const router = express.Router();
const multer = require('multer');
const sanitize = require('sanitize-html');
const { default: slugify } = require('slugify');
const { User, Blog, Notify } = require('../db/db')
const getDate = require('../function/date');
const newpostmail = require('../mailer/newPostMail');
const options = { headerIds: false };




router.get('/', (req, res) => {
    res.send('Working')
})

router.get('/new', (req, res) => {
    if (req.query.post !== '') {
        Blog.find({ author_username: req.session.user.user_name }, (err, blog) => {
            res.render('user/newblog', { auth: req.query.auth });
        })
    } else {
        Blog.find({ author_username: req.session.user.user_name }, (err, blog) => {
            res.render('user/newblog', { auth: '' });
        })
    }
})

router.get('/edit/:slug', (req, res, next) => {
    let slugifyId = req.params.slug
    let userId = req.session.user.user_name
    Blog.findOne({ slug_id: slugifyId, author_username: userId }, (err, blog) => {
        res.render('user/editblog', { blogs: blog, auth: req.query.auth })
    })

})

router.get('/posts', (req, res) => {
    Blog.find({ author_username: req.session.user.user_name }, (err, blog) => {
        res.render('user/posts', { blogs: blog })
    })
})



router.get('/visibility', (req, res) => {
    if (req.query.post !== '') {
        Blog.find({ author_username: req.session.user.user_name }, (err, blog) => {
            res.render('user/visibility', { post: req.query.post, blog: blog });
        })
    } else {
        Blog.find({ author_username: req.session.user.user_name }, (err, blog) => {
            res.render('user/visibility', { post: '', blog: blog });
        })
    }
})

router.post('/visibility/:action/:post', (req, res, next) => {
    let action = req.params.action
    let post = req.params.post
    if (action === 'D') {
        Blog.updateOne({ slug_id: post }, { status: 'disabled' }, (err) => {
            res.redirect('/user/blogs/visibility');
        })
    } else if (action === 'E') {
        Blog.updateOne({ slug_id: post }, { status: 'enabled' }, (err) => {
            res.redirect('/user/blogs/visibility');
        })
    } else if (action === 'R') {
        Blog.deleteOne({ slug_id: post }, (err) => {
            res.redirect('/user/blogs/visibility');
        })
    }


})

var fileName;
// Get a list of all image files.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // destination directory
        cb(null, 'public/IMAGES/BLOG_IMAGES/')
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
        fileName = `/IMAGES/BLOG_IMAGES/` + Imgname
        cb(null, Imgname);
    }
})
// Set up Multer to handle file uploads

const upload = multer({ storage: storage });

router.post('/create', upload.single('featuredImage'), (req, res) => {
    let postTitle = req.body.postTitle
    let postCategory = req.body.postCategory
    let postDescription = req.body.postDescription
    let post = req.body.post
    let slugTitle = slugify(postTitle)
    let html = converter.makeHtml(post);
    let category = postCategory.substr(0, 1).toUpperCase() + postCategory.substr(1);
    var newblog;

    if (req.session.user.membership === 'paid') {

        newblog = new Blog({
            title: postTitle,
            post: post,
            postMarkdown: post,
            category: category,
            desc: postDescription,
            image: fileName,
            slug_id: slugTitle,
            date: getDate(),
            count: '0',
            status: 'enabled',
            statusAdmin: 'hidden',
            review: 'no',
            impressions: '0',
            author_name: req.session.user.name,
            author_image: req.session.user.profile_image,
            author_username: req.session.user.user_name
        })
        if (req.session.user.statusAdmin === 'hidden') {
            res.redirect('/user/blogs/new?auth=banned')
        } else {
            newblog.save((err) => {
                if (!err) {
                    let link = req.protocol + '://' + req.get('host')
                    User.findOne({ role: 'superadmin' }, (err, user) => {
                        newpostmail(user.name, user.email, link)
                    })
                    res.redirect('/user/blogs/visibility?post=success')
                }
            })
        }
    } else {


        newblog = new Blog({
            title: postTitle,
            post: html,
            postMarkdown: post,
            category: category,
            desc: postDescription,
            image: fileName,
            slug_id: slugTitle,
            date: getDate(),
            count: '0',
            status: 'enabled',
            statusAdmin: 'hidden',
            review: 'no',
            impressions: '0',
            author_name: req.session.user.name,
            author_image: req.session.user.profile_image,
            author_username: req.session.user.user_name
        })
        if (req.session.user.statusAdmin === 'hidden') {
            res.redirect('/user/blogs/new?auth=banned')
        } else {
            newblog.save((err) => {
                if (!err) {
                    let link = req.protocol + '://' + req.get('host')
                    User.findOne({ role: 'superadmin' }, (err, user) => {
                        newpostmail(user.name, user.email, link)
                        let notification = new Notify({
                            sender: req.session.user.user_name,
                            sender_image: req.session.user.profile_image,
                            reciever: user.user_name,
                            reciever_image: user.profile_image,
                            message: `User ${req.session.user.user_name} just added a new post that needs your approval`,
                            seen: 'no'
                        })

                        notification.save((err, notify) => {
                            if (!err) {
                                return notify;
                            }
                        })

                    })
                    res.redirect('/user/blogs/visibility?post=success')
                }
            })
        }
    }

})

// UPdate Router
router.post('/updateBlog/:id', upload.single('featuredImage'), async (req, res) => {
    let postTitle = req.body.postTitle
    let postCategory = req.body.postCategory
    let postDescription = req.body.postDescription
    let slugTitle = slugify(postTitle)
    let category = postCategory.substr(0, 1).toUpperCase() + postCategory.substr(1);
    let post = req.body.post
    let oldDetails = await new Promise(resolve => {
        Blog.findOne({ slug_id: req.params.id }, (er, blog) => {
            resolve(blog)
        })
    })
    var html;
    if (req.session.user.membership == 'paid') {
        html = req.body.post
    }else{
        html = converter.makeHtml(req.body.post)
    }
        let newBlog = {
        title: postTitle,
        post: html,
        postMarkdown: post,
        category: category,
        desc: postDescription,
        image: fileName,
        slug_id: slugTitle,
        date: oldDetails.date,
        count: oldDetails.count,
        status: 'enabled',
        statusAdmin: 'hidden',
        review: 'no',
        impressions: oldDetails.impressions,
        author_name: req.session.user.name,
        author_image: req.session.user.profile_image,
        author_username: req.session.user.user_name
    }

    Blog.updateOne({ slug_id: req.params.id }, { $set: newBlog }, (err, result) => {
        if (!err) {
            User.findOne({ role: 'superadmin' }, (err, user) => {
                let link = req.protocol + "://" + req.get('host')
                newpostmail(user.name, user.email, link)
                let notification = new Notify({
                    sender: req.session.user.user_name,
                    sender_image: req.session.user.profile_image,
                    reciever: user.user_name,
                    reciever_image: user.profile_image,
                    message: `User ${req.session.user.user_name} just added a new post that needs your approval`,
                    seen: 'no'
                })

                notification.save((err, notify) => {
                    if (!err) {
                        return notify;
                    }
                })
                res.redirect('/user/blogs/posts')
            })
        }
    })

})


module.exports = router;