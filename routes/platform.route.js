var express = require('express');
var router = express.Router();
const platformControllers = require('../controllers/platform.controller');

/* GET users listing. */
router.get('/', platformControllers.getAll);

router.post('/create', platformControllers.create);

router.delete('/delete', platformControllers.delete);

router.delete('/delete/:id', platformControllers.deleteById);

module.exports = router;
