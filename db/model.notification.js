const mongoose = require('mongoose');

// Creates a new mongoose. Schema with the given name email and password.
const notificationSchema = new mongoose.Schema({
    sender: String,
    sender_image: String,
    reciever: String,
    message: String,
    reciever_image: String,
    duration: {
        type: Date,
        default: Date.now
    },
    seen: String,
});

module.exports = notificationSchema