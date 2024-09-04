const mongoose = require('mongoose');
const {StatusEnum, RoleUserEnum} = require('../utils/enum')

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
        default: Object.values(RoleUserEnum),
        enum: RoleUserEnum.USER
    },
    urlHost: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: Object.values(StatusEnum),
        default: StatusEnum.CREATED,
    },
},{timestamps: true});

module.exports = mongoose.model('USER', userSchema);