const mongoose = require('mongoose')
const blogSchema = require('./model.blogs')
const UserSchema = require('./model.users')
require('dotenv').config()

const db = process.env.DB_URL

// Mongoose database.
mongoose.set('strictQuery', true)

mongoose.connect(db, { useNewUrlParser: true });

const User = mongoose.model('users', UserSchema );
const Blog = mongoose.model('blogs', blogSchema);


// Exports the user and blog modules.
module.exports = {
    User,
    Blog
}