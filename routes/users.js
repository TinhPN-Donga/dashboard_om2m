var express = require('express');
var router = express.Router();
const userControllers = require('../controllers/user.controller');
/* GET users listing. */
router.get('/', userControllers.getAllUsers);

module.exports = router;
