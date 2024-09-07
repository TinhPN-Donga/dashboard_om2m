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
            if (!data) {
                return res.status(404).json({
                    ...defaultResponse,
                    status: 404,
                    message: "Platform not found!"
                });
            }
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
            let { name, listUrl } = req.body;
    
            // Kiểm tra tên vai trò có được cung cấp không
            if (!name) throw new Error('Role name is required.');
    
            // Kiểm tra xem 'listUrl' có hợp lệ không (phải là mảng nếu được cung cấp)
            if (listUrl && !Array.isArray(listUrl)) {
                throw new Error('List URL must be an array.');
            }
    
            // Nếu 'listUrl' không được cung cấp, khởi tạo nó là mảng rỗng
            if (!listUrl) listUrl = [];
    
            // Kiểm tra từng URL trong 'listUrl' có hợp lệ không
            for (let url of listUrl) {
                if (!(await checkUrlHost(url))) {
                    throw new Error(`Invalid URL: ${url}`);
                }
            }
    
            // Tạo đối tượng 'body' với dữ liệu đầu vào
            let body = { name, listUrl };
    
            // Thực hiện tạo vai trò mới
            const newData = await roleUserService.create(body);
    
            // Trả về dữ liệu sau khi tạo thành công
            const dataRes = {
                ...defaultResponse,
                status: 201,
                data: newData,
                message: 'Role created successfully!'
            };
            res.status(201).json(dataRes);
    
        } catch (error) {
            const message = error.message || 'Role creation failed!';
            const dataRes = { ...defaultResponse, status: 500, message };
            res.status(500).json(dataRes);
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            let { name, listUrl } = req.body;
    
            // Kiểm tra xem 'name' có được cung cấp không
            if (!name) throw new Error('Role name is required.');
    
            // Kiểm tra tính hợp lệ của 'listUrl' (phải là mảng)
            if (listUrl && !Array.isArray(listUrl)) {
                throw new Error('List URL must be an array.');
            }
    
            // Kiểm tra từng URL trong 'listUrl' (từng URL phải hợp lệ)
            if (listUrl) {
                for (let url of listUrl) {
                    if (!(await checkUrlHost(url))) {
                        throw new Error(`Invalid URL: ${url}`);
                    }
                }
            }
    
            // Xây dựng đối tượng cập nhật
            let body = { name, listUrl };

            // Thực hiện cập nhật dữ liệu
            const newData = await roleUserService.update(id, body);
    
            // Trả về dữ liệu sau khi cập nhật thành công
            const dataRes = { ...defaultResponse, status: 200, data: newData, message: 'Update Successful!' };
            res.status(200).json(dataRes);
    
        } catch (error) {
            const message = error.message || 'Update failed!';
            const dataRes = { ...defaultResponse, status: 500, message };
            res.status(500).json(dataRes);
        }
    },
    delete: async (req, res) => {
        try {
            // Xóa tất cả các role
            const deleteAll = await roleUserService.deleteAll();
    
            // Kiểm tra nếu không có role nào được xóa
            if (!deleteAll || deleteAll.deletedCount === 0) {
                return res.status(404).json({
                    ...defaultResponse,
                    status: 404,
                    message: "No roles found to delete!"
                });
            }
    
            // Trả về kết quả thành công sau khi xóa
            const dataRes = { 
                ...defaultResponse, 
                status: 200, 
                data: deleteAll, 
                message: "Delete All Roles Successfully!" 
            };
            res.status(200).json(dataRes);
    
        } catch (error) {
            const message = error.message || "Delete failed!";
            const dataRes = { ...defaultResponse, status: 500, message };
            res.status(500).json(dataRes);
        }
    },
    deleteById: async (req, res) => {
        try {
            const { id } = req.params;
    
            // Kiểm tra xem role có tồn tại trước khi xóa
            const role = await roleUserService.findById(id);
            if (!role) {
                return res.status(404).json({
                    ...defaultResponse,
                    status: 404,
                    message: "Role not found!"
                });
            }
    
            // Xóa role theo ID
            const deleteById = await roleUserService.deleteById(id);
    
            // Kiểm tra nếu việc xóa thất bại
            if (!deleteById) {
                throw new Error('Delete failed!');
            }
    
            // Trả về kết quả thành công sau khi xóa
            const dataRes = {
                ...defaultResponse,
                status: 200,
                data: deleteById,
                message: "Delete Role Successfully!"
            };
            res.status(200).json(dataRes);
    
        } catch (error) {
            const message = error.message || "Delete failed!";
            const dataRes = { ...defaultResponse, status: 500, message };
            res.status(500).json(dataRes);
        }
    },
}

module.exports = roleUserControllers;