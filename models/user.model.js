const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        default: '',
        required : true, 
        index: { unique: true }
    },
    userName: {
        type: String,
        required : true, 
    },
    password: {
        type: String,
        default: '',
        required : true, 
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    urlHost: {
        type: String,
        default: '',
    },
},{timestamps: true});

module.exports = mongoose.model('USER', userSchema);