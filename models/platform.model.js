const mongoose = require('mongoose');

const platformSchema = mongoose.Schema({
    host: {
        type: String,
        default: '',
    },
    uri: {
        type: String,
        default: '',
    },
    account: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        default: '',
    },
    
},{timestamps: true});

module.exports = mongoose.model('PLATFORM', platformSchema);