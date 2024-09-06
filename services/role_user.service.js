const RoleUserModel = require('../models/role_user.model');

const findAll = () => {
    return RoleUserModel.find().sort('-createdAt');
}

const findOne = (query) => {
    return RoleUserModel.findOne(query);
}

const count = (query = {},option = {}) => {
    return RoleUserModel.find().count(query, option);
}

const paginate = (limit, skip = 0) => {
    return RoleUserModel.find().sort('-createdAt').skip(skip).limit(limit);
}

const findById = (id) =>{
    return RoleUserModel.findById(id);
}

const create = (data) => {
    const newData = new RoleUserModel(data);
    return newData.save();
}

const update  = (id, data) =>{
    return RoleUserModel.updateOne({_id: id}, {$set: data});
}

const deleteAll = () =>{
    return RoleUserModel.deleteMany();
}

const deleteById = (id) =>{
    return RoleUserModel.findOneAndDelete({_id: id});
}

module.exports = {count, findAll, findOne, findById,create, update, deleteAll, deleteById, paginate}