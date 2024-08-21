const UserModel = require('../models/user.model');

const findAll = () => {
    return UserModel.find().sort('-createdAt');
}

const count = (query = {},option = {}) => {
    return UserModel.find().count(query, option);
}

const paginate = (limit, skip = 0) => {
    return UserModel.find().sort('-createdAt').skip(skip).limit(limit);
}

const findById = (id) =>{
    return UserModel.findById(id);
}

const findByEmail = (email) =>{
    return UserModel.findOne({ email: email });
}

const create = (data) => {
    const newUser = new UserModel(data);
    return newUser.save();
}

const update  = (id, data) =>{
    return UserModel.updateOne({_id: id}, {$set: data});
}

const deleteAll = () =>{
    return UserModel.deleteMany();
}

const deleteById = (id) =>{
    return UserModel.findOneAndDelete({_id: id});
}

module.exports = {count, findAll, findById,create, update, deleteAll, deleteById, findByEmail, paginate}