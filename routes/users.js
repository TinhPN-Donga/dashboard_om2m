var express = require('express');
var router = express.Router();
const userControllers = require('../controllers/user.controller');

/* GET users listing. */
router.get('/', userControllers.getAllUsers);

router.put('/update/:id', userControllers.update);

router.delete('/delete', userControllers.delete);

router.delete('/delete/:id', userControllers.deleteById);

module.exports = router;
