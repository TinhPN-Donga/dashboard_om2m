const UserService = require('../services/user.service');
const {
    checkStatusUser,
    StatusUserEnum
} = require('../utils/enum');

let defaultResponse = {
    message: 'Message user!!!',
    status: 200,
    data: {}
}
const userControllers = {
    getAllUsers: async (req, res) => {
        const user = await UserService.findAll();
        return res.json(user);
    },
    update: async(req, res) => {
        try {
            const { id } = req.params;
    
            // Kiểm tra xem người dùng có tồn tại hay không
            const user = await UserService.findById(id);
            if (!user) {
                return res.status(404).json({
                    ...defaultResponse,
                    status: 404,
                    message: 'User not found'
                });
            }

            if(req.body.status){
                let status = req.body.status;
                if(!checkStatusUser(status)) throw new Error("Status invalid.");
            }
            
            // Cập nhật dữ liệu người dùng
            const updatedUser = await UserService.update(id, req.body);
    
            // Trả về kết quả thành công
            const dataRes = {
                ...defaultResponse,
                status: 200,
                data: updatedUser
            };
            res.status(200).json(dataRes);
    
        } catch (error) {
            const message = error.message || 'An error occurred';
            
            // Xử lý lỗi khi cập nhật
            const dataRes = {
                ...defaultResponse,
                status: 500,
                message
            };
            res.status(500).json(dataRes);
        }
    },
    delete: async (req, res) => {
        try {
            const deletedUsers = await UserService.deleteAll();
    
            if (!deletedUsers || deletedUsers.deletedCount === 0) {
                return res.status(404).json({
                    ...defaultResponse,
                    status: 404,
                    message: "No users found to delete!"
                });
            }
    
            const dataRes = {
                ...defaultResponse,
                status: 200,
                data: deletedUsers,
                message: "Delete All Users Successfully!"
            };
            res.status(200).json(dataRes);
        } catch (error) {
            const message = error.message || "Delete failed!";
            const dataRes = {
                ...defaultResponse,
                status: 500,
                message
            };
            res.status(500).json(dataRes);
        }
    },
    
    // Xóa người dùng theo id
    deleteById: async (req, res) => {
        try {
            const { id } = req.params;
    
            // Kiểm tra xem người dùng có tồn tại hay không trước khi xóa
            const user = await UserService.findById(id);
            if (!user) {
                return res.status(404).json({
                    ...defaultResponse,
                    status: 404,
                    message: "User not found!"
                });
            }
    
            const deletedUser = await UserService.deleteById(id);
            if (!deletedUser) {
                throw new Error('Delete failed!');
            }
    
            const dataRes = {
                ...defaultResponse,
                status: 200,
                data: deletedUser,
                message: "Delete User Successfully!"
            };
            res.status(200).json(dataRes);
        } catch (error) {
            const message = error.message || "Delete failed!";

            const dataRes = {
                ...defaultResponse,
                status: 500,
                message
            };
            res.status(500).json(dataRes);
        }
    }
}

module.exports = userControllers;