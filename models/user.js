const mongoose = require('mongoose');

//Schema Defination
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profile: {
        type: String,
    },
    gender: {
        type: String,
    }

},
    {
        timestamps: true,
    });

const User = mongoose.model('user', userSchema);

module.exports = User;