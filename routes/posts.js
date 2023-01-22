var express = require('express');
const { Blog } = require('../db/db');
var router = express.Router();


// Get a single blog.
router.get('/:id', function (req, res, next) {
  let getBlog = req.params.id

  setTimeout(() => {
    Blog.findOne({ slug_id: getBlog, status: 'enabled' }, (err, blog) => {
      if (err) {
        console.log(err)
      } else if (blog) {
        let newCount = parseInt(blog.count) + 1
        Blog.updateOne({ slug_id: getBlog, status: 'enabled' }, { count: newCount }, function () { 
          return newCount
        })
      }
    })
  }, 2000);

  Blog.findOne({ slug_id: getBlog, status: 'enabled' }, (err, blog) => {
    if (err) {
      console.log(err)
    } else if (blog) {
      res.render('post', { post: blog })
    } else {
      res.render('error')
    }
  })

});

module.exports = router;
