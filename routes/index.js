var express = require('express');
var router = express.Router();
const { Blog } = require('../db/db');
const superAdminRouter = require('../superadmin/superadmin')
const userRouter = require('../users/users')
const loginRouter = require('./login')
const registerRouter = require('./register')
const membershipRouter = require('./membership')



// Super Admin Route
router.use('/login', loginRouter)
router.use('/register', registerRouter)
router.use('/membership', membershipRouter)
router.use('/user', userRouter)
router.use('/superadmin', superAdminRouter)


router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.locals.userData = ''
  res.render('auth-logout');
})

let limitSize = 3

// Returns a list of all enabled blogs.
router.get('/', function (req, res) {
  Blog.find({ status: 'enabled' }, function (err, blog) {
    if (!err) {
      Blog.aggregate([{ $group: { "_id": "$category" } }], (err, rows) => {
        res.render('index', { posts: blog, categories: rows });
      });
    }
  }).sort({ _id: -1 }).limit(limitSize)
});

router.post('/loadnewpost', (req, res) => {
  let category = req.body.categoryData
  let count = req.body.loadMoreCount

  if (category === 'all') {

    // List all enabled blogs.
    Blog.find({ status: 'enabled' }, function (err, blog) {
      setTimeout(() => {
        res.json(blog);
      }, 2000);
    }).sort({ _id: -1 }).skip(count).limit(limitSize);

  } else {

    Blog.find({ status: 'enabled', category: category }, function (err, blog) {
      setTimeout(() => {
        res.json(blog);
      }, 2000);
    }).sort({ _id: -1 }).skip(count).limit(limitSize)
  }
})


// Load more function to load more post into the db

router.post('/getblogs', function (req, res) {

  let getCategory = req.body.category
  if (getCategory !== 'all') {
    // Return a list of enabled blogs.
    Blog.find({ status: 'enabled', category: getCategory }, function (err, blog) {
      setTimeout(() => {
        res.json(blog);
      }, 2000);
    }).sort({ _id: -1 }).limit(limitSize)

  } else {

    // List all enabled blogs.
    Blog.find({ status: 'enabled' }, function (err, blog) {
      setTimeout(() => {
        res.json(blog);
      }, 2000);
    }).sort({ _id: -1 }).limit(limitSize)

  }
});
router.get('/account', (req, res)=>{
  res.render('account')
})

module.exports = router;
