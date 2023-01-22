var express = require('express');
const multer = require('multer');
const { User, Blog } = require('../db/db');
const getRandomInt = require('../function/randomNum');
const convertSlug = require('../function/slug');
var router = express.Router();

/* MULTER CONFIGURATION FOR IMAGE UPLOAD */
var fileName;
// Get a list of all image files.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // destination directory
        cb(null, 'views/IMAGES/BLOG_IMAGES/')
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


/* GET home page. */

// Returns a list of blog posts.
router.get('/', checkLoggedIn, function (req, res, next) {
    Blog.find(function (err, blog) {
        if (!err) {
            res.render('admin', { posts: blog, user: req.session.user });
        }
    }).sort({ _id: -1 })
});

// Renders the edit form.
router.get('/edit', checkLoggedIn, function (req, res, next) {
    Blog.find(function (err, blog) {
        if (!err) {
            res.render('edit', { posts: blog, user: req.session.user });
        }
    }).sort({ _id: -1 })
});

// Enable a post.
router.post('/edit/:fn/:id', checkLoggedIn, function (req, res) {
    let func = req.params.fn
    let blogId = req.params.id

    if (func === 'ds') {
        disablePost(blogId)
    } else if (func === 'en') {
        enablePost(blogId)
    } else {
        res.redirect('/admin/edit')
    }

    function disablePost(id) {
        Blog.updateOne({ slug_id: id }, { status: 'disabled' }, function (err, blog) {
            if (!err) {
                res.redirect('/admin/edit')
            }
        })
    }
    function enablePost(id) {
        Blog.updateOne({ slug_id: id }, { status: 'enabled' }, function (err, blog) {
            if (!err) {
                res.redirect('/admin/edit')
            }
        })
    }
});



// Render New Post Page
router.get('/new', checkLoggedIn, function (req, res, next) {
    res.render('newpost');
});


// GET POST FORM Data FROM FrontEnd
router.post('/newpost', checkLoggedIn, upload.single('image'), async (req, res) => {

    // GET DATA FROM FORM
    let postTitle = req.body.title
    let post = req.body.post
    let postCategory = req.body.category

    // BLOG DATE
    let now = Date.now()
    let date = new Date(now)
    let blogDate = date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    // Slugify Title
    let newUrl = convertSlug(postTitle) + getRandomInt(111, 999)

    await fileName;

    if (fileName == undefined) {
        fileName = '/IMAGES/logo.svg'

        var newPost = new Blog({
            title: postTitle,
            post: post,
            category: postCategory,
            image: fileName,
            slug_id: newUrl,
            date: blogDate,
            count: 0,
            status: 'enabled'
        })

    } else {
        var newPost = new Blog({
            title: postTitle,
            post: post,
            category: postCategory,
            image: fileName,
            slug_id: newUrl,
            date: blogDate,
            count: 0,
            status: 'enabled'
        })
    }

    newPost.save((err) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect(`/posts/${newUrl}`)
        }
    })

})

// Check if the user is logged in.
function checkLoggedIn(req, res, next) {
    if (req.session.user != null || req.session.user != undefined) {
        next();
    } else {
        res.redirect('/admin/login')
    }
}





module.exports = router;
