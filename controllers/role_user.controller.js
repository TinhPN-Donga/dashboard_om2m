const roleUserService = require('../services/role_user.service');
const platformService = require('../services/platform.service');
let defaultResponse = {
    message: 'Message role user!!!',
    status: 200,
    data: {}
}

const checkUrlHost = async (id) =>{
    const data = await platformService.findById(id);
    console.log("Data: ", data);
    return data ? true : false;
}

const roleUserControllers = {
    getAll: async (req, res) => {
        try {
            const data = await roleUserService.findAll();
            const dataRes = {...defaultResponse, status: 200 ,data: data}
            res.status(200).json(dataRes);
        } catch (error) {
            const message = error.message;
            const dataRes = {...defaultResponse, status: 500, message}
            res.status(500).json(dataRes);
        }   
    },
    findById: async (req, res) => {
        try {
            const {id} = req.params;
            const data = await roleUserService.findById(id);
            const dataRes = {...defaultResponse, status: 200 ,data: data}
            res.status(200).json(dataRes);
        } catch (error) {
            const message = error.message;
            const dataRes = {...defaultResponse, status: 500, message}
            res.status(500).json(dataRes);
        }   
    },
    create: async (req, res) => {
        try {
            let {
                name, 
                listUrl
            } = req.body;
            if(!name) throw new Error('Role name is required.');
            if(listUrl && (!Array.isArray(listUrl))) throw new Error('List URL is invalid!');
            if(!listUrl) listUrl = [];
            for(let url of listUrl) {
                if(!(await checkUrlHost(url))) throw new Error('URL is invalid!');
            }
            let body = {name, listUrl};
            const newData = await roleUserService.create(body);
            const dataRes = {...defaultResponse, status: 201 ,data: newData}
            res.status(201).json(dataRes);
        } catch (error) {
            const message = error.message;
            const dataRes = {...defaultResponse, status: 500, message}
            res.status(500).json(dataRes);
        }
    },
    update: async(req, res) =>{
        try {
            const {id} = req.params;
            let {
                name, 
                listUrl
            } = req.body;
            if(!name) throw new Error('Role name is required.');
            if(listUrl && (!Array.isArray(listUrl))) throw new Error('List URL is invalid!');
            for(let url of listUrl) {
                if(!(await checkUrlHost(url))) throw new Error('URL is invalid!');
            }

            let body = {name, listUrl};
            const newData = await roleUserService.update(id, body);
            const dataRes = {...defaultResponse, status: 200 ,data: newData}
            res.status(200).json(dataRes);
        } catch (error) {
            const message = error.message;
            const dataRes = {...defaultResponse, status: 500, message}
            res.status(500).json(dataRes);
        }
    },
    delete: async (req, res) => {
        try {
            const deleteAll = await roleUserService.deleteAll();
            const dataRes = {...defaultResponse, status: 200 ,data: deleteAll, message: "Delete Successfully!!!"}
            res.status(200).json(dataRes);
        } catch (error) {
            const message = "Delete failed!!!";
            const dataRes = {...defaultResponse, status: 500, message}
            res.status(500).json(dataRes);
        }
    },
    deleteById: async (req, res) => {
        try {
            const {id} = req.params;
            const deleteAll = await roleUserService.deleteById(id);
            if(!deleteAll) throw new Error('Delete failed!!!');
            const dataRes = {...defaultResponse, status: 200 ,data: deleteAll, message: "Delete Successfully!!!"}
            res.status(200).json(dataRes);
        } catch (error) {
            const message = "Delete failed!!!";
            const dataRes = {...defaultResponse, status: 500, message}
            res.status(500).json(dataRes);
        }
    }
}

module.exports = roleUserControllers;