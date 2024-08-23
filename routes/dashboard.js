// routers/dashboardRouter.js
const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');

router.get('/api/application', indexController.getJsonApplication);
router.get('/api/:tool/sensor', indexController.getJsonSensor);
router.get('/api/:tool/:sensor/data', indexController.getSensorData);

// Áp dụng middleware xác thực cho tất cả các tuyến đường trong dashboardRouter
router.get('/dashboard', indexController.getDataTool);
router.get('/info/:tool', indexController.getInfoTool);
router.get('/info/:tool/:sensor', indexController.getSensorTool);

router.get('/dashboard/create-tool', indexController.getCreateTool);
router.get('/dashboard/create/:tool/sensor', indexController.getCreateSensorTool);
router.get('/dashboard/create/:tool/:sensor/container', indexController.getCreateTool);
router.get('/dashboard/create/:tool/:sensor/subcribe', indexController.getCreateDataSubcribe);
router.get('/dashboard/create', indexController.getCreatePage);

router.get('/delete/data/:id', indexController.deleteById);
router.delete('/delete/data/:id', indexController.deleteById);
router.delete('/delete', indexController.deleteQuery);

router.post('/dashboard/create', indexController.postCreate);
router.post('/dashboard/create-tool', indexController.postCreateApplication);
router.post('/dashboard/create/:tool/sensor', indexController.postCreateSensor);
router.post('/dashboard/create/:tool/:sensor/container', indexController.postCreateCon..
    tainerInSensor);
router.post('/dashboard/create/:tool/:sensor/subcribe', indexController.postCreateDataSubcribe);

module.exports = router;