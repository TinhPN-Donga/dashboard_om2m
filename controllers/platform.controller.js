const platformService = require("../services/platform.service");
const { fetchAPI } = require("../services/index"); // Make sure fetchAPI is correctly imported
const fetch = require('node-fetch'); // Ensure node-fetch is installed and required if you're not using a custom fetch function

let defaultResponse = {
    message: "Message platform!!!",
    status: 200,
    data: {},
};

// Function to check if the host is connectable
const isConnectHost = async (body) => {
    try {
        let url = `${body.host}/${body.uri}`;
        let headers = {
            "Content-Type": "application/json",
            "x-m2m-origin": `${body.account}:${body.password}`,
        };
        let options = {
            method: 'GET',
            headers
        };

        // Make the request using fetch
        const response = await fetch(url, options);

        // Check if the response status is 400 or higher
        if (response.status >= 400) {
            return false;  // Failed to connect
        }

        return true;  // Successfully connected
    } catch (error) {
        return false;  // Catch any error and return false for connection failure
    }
};

// Platform Controllers
const platformControllers = {
    getAll: async (req, res) => {
        const data = await platformService.findAll();
        const dataRes = { ...defaultResponse, status: 200, data: data };
        res.status(200).json(dataRes);
    },
    create: async (req, res) => {
        try {
            let { host, uri, account, password } = req.body;

            // Validate the input body
            let body = { host, uri, account, password };

            // Check if the platform can be connected to
            let isConnect = await isConnectHost(body);
            if (!isConnect) throw new Error("Connect platform failed!");

            // Proceed to create the platform entry
            const newData = await platformService.create(body);
            const dataRes = { ...defaultResponse, status: 201, data: newData };
            res.status(201).json(dataRes);
        } catch (error) {
            const message = error.message || "An error occurred";
            const dataRes = { ...defaultResponse, status: 500, message };
            res.status(500).json(dataRes);
        }
    },
    // Hàm update
    update: async (req, res) => {
        try {
            const { id } = req.params;
            let { host, uri, account, password } = req.body;

            // Kiểm tra xem trường 'host' có được cung cấp không
            if (!host) throw new Error('Host is required.');

            let body = { host, uri, account, password };

            // Kiểm tra kết nối với nền tảng
            let isConnect = await isConnectHost(body);
            if (!isConnect) throw new Error("Failed to connect to platform!");

            // Cập nhật dữ liệu
            const newData = await platformService.update(id, body);

            // Trả về dữ liệu sau khi cập nhật thành công
            const dataRes = { ...defaultResponse, status: 200, data: newData, message: "Update Successful!" };
            res.status(200).json(dataRes);

        } catch (error) {
            const message = error.message || "Update failed!";
            const dataRes = { ...defaultResponse, status: 500, message };
            res.status(500).json(dataRes);
        }
    },

    // Hàm delete tất cả
    delete: async (req, res) => {
        try {
            // Xóa tất cả các nền tảng
            const deleteAll = await platformService.deleteAll();

            if (!deleteAll || deleteAll.deletedCount === 0) {
                return res.status(404).json({
                    ...defaultResponse,
                    status: 404,
                    message: "No platforms found to delete!"
                });
            }

            // Trả về kết quả thành công sau khi xóa
            const dataRes = {
                ...defaultResponse,
                status: 200,
                data: deleteAll,
                message: "Delete All Platforms Successfully!"
            };
            res.status(200).json(dataRes);

        } catch (error) {
            const message = error.message || "Delete failed!";
            const dataRes = { ...defaultResponse, status: 500, message };
            res.status(500).json(dataRes);
        }
    },

    // Hàm delete theo ID
    deleteById: async (req, res) => {
        try {
            const { id } = req.params;

            // Kiểm tra nền tảng có tồn tại không trước khi xóa
            const platform = await platformService.findById(id);
            if (!platform) {
                return res.status(404).json({
                    ...defaultResponse,
                    status: 404,
                    message: "Platform not found!"
                });
            }

            // Xóa nền tảng theo ID
            const deleteById = await platformService.deleteById(id);
            if (!deleteById) {
                throw new Error('Delete failed!');
            }

            // Trả về kết quả thành công sau khi xóa
            const dataRes = {
                ...defaultResponse,
                status: 200,
                data: deleteById,
                message: "Delete Platform Successfully!"
            };
            res.status(200).json(dataRes);

        } catch (error) {
            const message = error.message || "Delete failed!";
            const dataRes = { ...defaultResponse, status: 500, message };
            res.status(500).json(dataRes);
        }
    },
};

module.exports = platformControllers;
