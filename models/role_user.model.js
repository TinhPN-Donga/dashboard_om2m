const mongoose = require('mongoose');
const {RoleUserEnum} = require('../utils/enum')

const roleUserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    listUrl: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "PLATFORM",
        default: [],
    }
},{timestamps: true});

module.exports = mongoose.model('ROLEUSER', roleUserSchema);