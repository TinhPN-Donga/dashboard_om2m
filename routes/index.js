const indexController = require('../controlles/index');
const configServerOM2M = require("../utils/config_om2m");

const routes = (app) => {
    app.get('/', async (req, res)=>{
        res.redirect('/dashboard');
    });

    app.get('/test-data',(req, res)=>{
        console.log('data loaded');
        res.json({message: 'loading data...'});
    });

    app.get('/api/application', indexController.getJsonApplication);
    app.get('/api/:tool/sensor', indexController.getJsonSensor);
    app.get('/api/:tool/:sensor/data', indexController.getSensorData);

    /* */
    app.get('/dashboard', indexController.getDataTool);
    app.get('/info/:tool', indexController.getInfoTool);
    app.get('/info/:tool/:sensor', indexController.getSensorTool);

    app.get('/dashboard/create-tool', indexController.getCreateTool);
    app.get('/dashboard/create/:tool/sensor', indexController.getCreateSensorTool);
    app.get('/dashboard/create/:tool/:sensor/container', indexController.getCreateTool);
    app.get('/dashboard/create', indexController.getCreatePage);


    app.get('/delete/data/:id', indexController.deleteById);
    app.delete('/delete/data/:id', indexController.deleteById);
    app.delete('/delete', indexController.deleteQuery);

    /* */

    app.post('/dashboard/create-tool', indexController.postCreateTool);
    app.post('/dashboard/create/:tool/sensor', indexController.postCreateSensor);
    app.post('/dashboard/create/:tool/:sensor/container', indexController.postCreateContainerInSensor);
    app.post('/dashboard/create/:tool/:sensor/subcribe', indexController.postCreateDataSubcribe);
    app.post('/dashboard/create', indexController.postCreate);


}

module.exports = routes;