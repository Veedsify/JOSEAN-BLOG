var express = require('express');
var router = express.Router();
const { Blog, Alert, User } = require('../db/db');
const superAdminRouter = require('../superadmin/superadmin')
const userRouter = require('../users/users')
const loginRouter = require('./login')
const registerRouter = require('./register')
const membershipRouter = require('./membership')
const apiRouter = require('./api')
const aboutRouter = require('./about')
const privacyRouter = require('./privacy')
const resetRouter = require('./reset')


// Super Admin Route
router.use(getNavMode)
router.use(modes)
router.use('/api', apiRouter)
router.use('/about', aboutRouter)
router.use('/privacy', privacyRouter)
router.use('/login', loginRouter)
router.use('/register', registerRouter)
router.use('/reset', resetRouter)
router.use('/membership', membershipRouter)
router.use('/user', userRouter)
router.use('/superadmin', superAdminRouter)


router.get('/terms-of-use', (req, res, next)=>{
  res.render('terms')
})
router.get('/contact', (req, res, next)=>{
  res.render('contact')
})

function getNavMode(req, res, next) {
  if (req.session.user === undefined) {
    res.locals.navMode = [
      {
        link: '/login',
        name: 'Login',
      },
      {
        link: '/membership',
        name: 'Signup'
      }
    ]
    next()
    return
  } else {
    res.locals.navMode = [
      {
        link: '/user',
        name: 'Account',
      }
    ]
    next()
    return
  }
}


router.get('/logout', (req, res) => {
  req.session.destroy()
  res.locals.userData = ''
  res.clearCookie('auth')
  res.render('auth-logout');
})

let limitSize = process.env.NUM_OF_POST_PER_PAGE

// Returns a list of all enabled blogs.
router.get('/', async (req, res) => {

  let getblogs = await new Promise(resolve => {

    Blog.find({ status: 'enabled', statusAdmin: 'public' }, function (err, blog) {
      if (!err) {
        resolve(blog)
      }
    }).sort({ _id: -1 }).limit(limitSize)

  })

  let getCategories = await new Promise(resolve => {

    Blog.aggregate([
      { $match: { status: "enabled", statusAdmin: "public" } },
      { $group: { _id: "$category" } }
    ], (err, rows) => {
      resolve(rows)
    })

  });

  res.render('index', { posts: getblogs, categories: getCategories });
});

router.post('/loadnewpost', (req, res) => {
  let category = req.body.categoryData
  let count = req.body.loadMoreCount

  if (category === 'all') {

    // List all enabled blogs.
    Blog.find({ status: 'enabled', statusAdmin: 'public' }, function (err, blog) {
      setTimeout(() => {
        res.json(blog);
      }, 2000);
    }).sort({ _id: -1 }).skip(count).limit(limitSize);

  } else {

    Blog.find({ status: 'enabled', category: category, statusAdmin: 'public' }, function (err, blog) {
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
    Blog.find({ status: 'enabled', category: getCategory, statusAdmin: 'public' }, function (err, blog) {
      setTimeout(() => {
        res.json(blog);
      }, 2000);
    }).sort({ _id: -1 }).limit(limitSize)

  } else {

    // List all enabled blogs.
    Blog.find({ status: 'enabled', statusAdmin: 'public' }, function (err, blog) {
      setTimeout(() => {
        res.json(blog);
      }, 2000);
    }).sort({ _id: -1 }).limit(limitSize)

  }
});

router.post('/updateImpressions/:slug', (req, res) => {
  Blog.findOne({ slug_id: req.params.slug }, (err, blog) => {

    let impressions = parseInt(blog.impressions) + 1

    Blog.updateOne({ slug_id: req.params.slug }, { impressions: impressions }, err => {
      if (err) {
        console.log(err)
      } else {
        res.json({ status: 'success' });
      }
    })

  })
})

// AFTER PAYMENT
router.get('/update/payed', (req, res, next) => {
  let sess = req.session.user
  User.updateOne({ user_name: sess.user_name, trial: 'ended' }, { trial: false, membership: 'paid' }, (err, user) => {
    if (!err) {
      res.redirect('/login')
    }
  })
})


function modes(req,res,next){
  let mode = process.env.COLOR_MODE

  if(!mode){
    res.locals.clMode = 'dark'
    next()
  }
  if(mode === 'dark'){
    res.locals.clMode = 'dark'
    next()
  }else if(mode === 'light'){
    res.locals.clMode = 'light'
    next()
  }
}
module.exports = router;
