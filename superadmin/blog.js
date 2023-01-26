const express = require('express');
const multer = require('multer');
const { default: slugify } = require('slugify');
const { User, Blog } = require('../db/db');
const router = express.Router();
const getDate = require('../function/date');

router.get('/new', (req, res) => {
    res.render('newblog')
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

router.post('/create',upload.single('featuredImage'),(req,res)=>{
    let postTitle = req.body.postTitle
    let postCategory = req.body.postCategory
    // let postDescription = req.body.postDescription
    let post = req.body.post
    let slugTitle = slugify(postTitle)

        let newBlog = new Blog({
            title: postTitle,
            post: post,
            category: postCategory,
            image: fileName,
            slug_id: slugTitle,
            date: getDate(),
            count: '0',
            status: 'enabled',
            statusAdmin: 'public',
            impressions: '0',
            author_name: req.session.user.name,
            author_image: req.session.user.profile_image,
            author_username: req.session.user.user_name
        })

        newBlog.save((err)=>{
            if(!err){
                res.redirect(`/posts/${slugify(postTitle)}`)
            }
        })
    
})



module.exports = router;