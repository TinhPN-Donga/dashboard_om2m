const mongoose = require('mongoose');
const {StatusUserEnum} = require('../utils/enum')
const {findOne} = require('../services/role_user.service');
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ROLEUSER'
    },
    urlHost: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: Object.values(StatusUserEnum),
        default: StatusUserEnum.DISABLE,
    },
},{timestamps: true});

userSchema.pre('save', async function (next) {
    if (!this.role) {
        const defaultRole = await findOne({ name: 'user' }); 
        
        if (defaultRole) {
            this.role = defaultRole._id;  
        } else {
            throw new Error("Default role not found");
        }
    }
    next();
});

module.exports = mongoose.model('USER', userSchema);