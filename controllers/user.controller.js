const UserService = require('../services/user.service');

const userControllers = {
    getAllUsers: async (req, res) => {
        const user = await UserService.findAll();
        return res.json(user);
    }
}

module.exports = userControllers;