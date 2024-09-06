const mongoose = require('mongoose');

const platformSchema = mongoose.Schema({
    host: {
        type: String,
        default: '',
        unique: true,
        required: true,
    },
    uri: {
        type: String,
        default: '',
    },
    account: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
},{timestamps: true});

module.exports = mongoose.model('PLATFORM', platformSchema);