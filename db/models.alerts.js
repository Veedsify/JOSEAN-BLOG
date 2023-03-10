const mongoose = require('mongoose');

// Creates a new mongoose. Schema with the given name email and password.
const alertSchema = new mongoose.Schema({
    name: String,
    page:String,
    duration: String,
    message:String,
});

module.exports = alertSchema