const mongoose = require('mongoose');

// Creates a new mongoose schema.
const blogSchema = new mongoose.Schema({
    title: String,
    post: String,
    category: String,
    image: String,
    slug_id: String,
    date: String,
    count: String,
    status:String,
    statusAdmin: String,
    impressions: String,
    author_name: String,
    author_image: String,
});


module.exports = blogSchema