const express = require('express');
const multer = require('multer');
const { default: slugify } = require('slugify');
const { User, Blog } = require('../db/db');
const router = express.Router();
const getDate = require('../function/date');

router.get('/new', (req, res) => {
    res.render('admin/newblog',{auth: {}})
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
    let postDescription = req.body.postDescription
    let post = req.body.post
    let slugTitle = slugify(postTitle)

        let newBlog = new Blog({
            title: postTitle,
            post: post,
            postMarkdown: post,
            category: postCategory,
            desc: postDescription,
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
                res.redirect('/superadmin/blogs/update')
            }
        })
    
})


router.get('/posts', (req, res, next)=>{
    Blog.find({author_username: req.session.user.user_name},(err, blog)=>{
        res.render('admin/posts', {blog: blog})
    })
})

router.get('/analytics', (req, res, next)=>{
    res.render('admin/analytics')
})

router.get('/visibility', async(req, res, next)=>{
    let getMyBLogs = await new Promise(resolve => {
        Blog.find({author_username: req.session.user.user_name   },(err, blog)=>{
            resolve(blog)
        })
    })

    res.render('admin/visibility',{blogs: getMyBLogs})
})
router.post('/visibility/:slug/:action',async (req,res)=>{

    if(req.params.slug.length > 10){
        if(req.params.action === 'enable'){
            Blog.updateOne({slug_id: req.params.slug},{status:'enabled',statusAdmin:'public'},(err,blog)=>{
                if(err){
                    console.log(err)
                }
            })
        }else if(req.params.action === 'disable'){
            Blog.updateOne({slug_id: req.params.slug},{status:'disabled',statusAdmin:'hidden'},(err,blog)=>{
                if(err){
                    console.log(err)
                }
            })
        }else if(req.params.action === 'delete'){
            Blog.deleteOne({slug_id: req.params.slug});
        }
        res.redirect('/superadmin/blogs/visibility')
    }
})

router.get('/blogs/edit/:slug',(req,res)=>{
    Blog.findOne({slug_id: req.params.slug},(err,blog)=>{
        res.render('admin/editblog',{blog:blog})
    })
})


module.exports = router;