const mongoose = require('mongoose')
const blogSchema = require('./model.blogs')
const notificationSchema = require('./model.notification')
const UserSchema = require('./model.users')
const alertSchema = require('./models.alerts')
require('dotenv').config()

const db = process.env.DB_URL

// Mongoose database.
mongoose.set('strictQuery', true)

mongoose.connect(db, { useNewUrlParser: true });

const User = mongoose.model('users', UserSchema);
const Blog = mongoose.model('blogs', blogSchema);
const Alert = mongoose.model('alerts', alertSchema);
const Notify = mongoose.model('notify', notificationSchema);


// Exports the user and blog modules.
module.exports = {
    User,
    Blog,
    Alert,
    Notify
}

