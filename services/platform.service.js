const PlatformModel = require('../models/platform.model');

const findAll = () => {
    return PlatformModel.find().sort('-createdAt');
}

const count = (query = {},option = {}) => {
    return PlatformModel.find().count(query, option);
}

const paginate = (limit, skip = 0) => {
    return PlatformModel.find().sort('-createdAt').skip(skip).limit(limit);
}

const findById = (id) =>{
    return PlatformModel.findById(id);
}

const create = (data) => {
    const newData = new PlatformModel(data);
    return newData.save();
}

const update  = (id, data) =>{
    return PlatformModel.updateOne({_id: id}, {$set: data});
}

const deleteAll = () =>{
    return PlatformModel.deleteMany();
}

const deleteById = (id) =>{
    return PlatformModel.findOneAndDelete({_id: id});
}

module.exports = {count, findAll, findById,create, update, deleteAll, deleteById, paginate}