var express = require('express');
var router = express.Router();
const roleUserControllers = require('../controllers/role_user.controller');

/* GET users listing. */
router.get('/', roleUserControllers.getAll);
router.get('/:id', roleUserControllers.findById);

router.post('/create', roleUserControllers.create);
router.put('/update/:id', roleUserControllers.update);

router.delete('/delete', roleUserControllers.delete);

router.delete('/delete/:id', roleUserControllers.deleteById);

module.exports = router;
