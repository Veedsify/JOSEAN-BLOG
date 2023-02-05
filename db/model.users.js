const mongoose = require('mongoose');

// Creates a new mongoose. Schema with the given name email and password.
const UserSchema = new mongoose.Schema({
    name: String,
    user_name: String,
    email: String,
    password: String,
    role:String,
    bio:String,
    membership:String,
    verification: String,
    verified: String,
    status:String,
    statusAdmin: String,
    profile_image:String,
    reset_id:String,
    duration:String,
    tfa: String,
});

module.exports = UserSchema